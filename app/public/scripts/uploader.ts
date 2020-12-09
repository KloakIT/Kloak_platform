declare const MP4Box

class Uploader {
	private uuid: string
	private file: File
	private fileSize: number
	private arrayBuffer: ArrayBuffer
	private chunkSize: number = 1048576
	private path: string
	private progressIndicator = null
	private disassemblyWorker: Worker
	private pieces = []
	private totalPieces = 0
	private extraTags = []
	private videoData = {
		duration: null,
		mimeType: null,
		fastStart: null
	}
	private MP4BoxFile = null
	private callback: Function = null
	constructor(requestUuid: string, file: File, path: string, extraTags: Array<string>, progressIndicator: KnockoutObservable<number> | Function, callback: Function) {
		this.uuid = requestUuid
		this.path = path
		this.file = file
		this.fileSize = file.size
		this.extraTags = extraTags
		this.progressIndicator = progressIndicator
		if (this.fileSize <= this.chunkSize) {
			this.chunkSize = Math.floor(this.fileSize / 5)
		}
		this.callback = callback
		if (file.type === 'video/mp4') {
			this.getVideoData(() => {
				this.generateOffsetUUID()
			})
		} else if (file.type === 'audio/mpeg') {
			this.getMetadata(() => {
				this.videoData.mimeType = 'audio/mpeg'
				this.videoData.fastStart = true
				this.generateOffsetUUID()
			})
		} else {
			this.generateOffsetUUID()
		}
	}

	private getMetadata = (callback: Function) => {
		const _self = this
		const video = document.createElement("video")
		video.preload = 'metadata'
		video['src'] = URL.createObjectURL(this.file)
		video.onloadedmetadata = function() {
			URL.revokeObjectURL(video.src);
			_self.videoData.duration = Math.round(video.duration)
			callback()
		}
	}

	private getVideoData = (callback: Function) => {
		const _self = this
		this.MP4BoxFile = MP4Box.createFile()

		this.MP4BoxFile.onError = (e) => {
			console.log(e)
		}

		this.MP4BoxFile.onReady = (info) => {
			const mime = info.mime.split(" ")
			_self.videoData.mimeType = [mime[0], mime[1]].join(" ")
			_self.videoData.fastStart = info.isFragmented && info.isProgressive
			console.log(info)
			this.disassemblyWorker = this.getWorker(this.callback)
			this.disassemblyWorker.postMessage({cmd: 'START', payload: {arrayBuffer: this.arrayBuffer}}, [this.arrayBuffer])
		}

		this.getMetadata(callback)

	}

	private log = (message: string) => {
		console.log(`<${new Date().toLocaleString()}> ${message}`)
	}

	private getWorker = (callback?: Function) => {
		const url = URL.createObjectURL(
			new Blob([`(${this.workerFn.toString()})()`], { type: 'text/javascript' })
		)
		const worker = new Worker(url)
		worker.addEventListener('message', this.messageChannel)
		URL.revokeObjectURL(url)
		return worker
	}

	private generateOffsetUUID = (offset: number = 0) => {
		if (offset > this.fileSize) {
			this.createIndex()
			
			if (this.file.type === 'video/mp4') {
				return this.beginFileRead(() => {
					this.createHistory()
				})
			} else {
				this.beginFileRead()
				this.createHistory()
			}
			return
		}
		this.pieces.push({offset, uuid: uuid_generate()})
		this.totalPieces = this.pieces.length
		if (offset <= this.fileSize) {
			this.generateOffsetUUID(offset + this.chunkSize)
		}
	}

	private beginFileRead = (callback?: Function) => {
		const reader = new FileReader()
		reader.readAsArrayBuffer(this.file)
		reader.onloadend = (e) => {
			this.arrayBuffer = e.target['result'] as ArrayBuffer
			console.log(this.arrayBuffer.byteLength)
			if (this.file.type === 'video/mp4') {
				this.arrayBuffer['fileStart'] = 0
				this.MP4BoxFile.appendBuffer(this.arrayBuffer)
				callback()
				return
			}
			this.disassemblyWorker = this.getWorker(this.callback)
			this.disassemblyWorker.postMessage({cmd: 'START', payload: {arrayBuffer: this.arrayBuffer}}, [this.arrayBuffer])
		}
	}

	private createHistory = () => {
		const date = new Date()
		const file: fileHistory = {
			uuid: [this.uuid],
			filename: this.file.name,
			time_stamp: date,
			last_viewed: date,
			path: this.path,
			url: 'Upload',
			tags: [this.file.type.split('/')[0], this.file.type.split('/')[1], ...this.extraTags, 'upload', 'local'].filter(tag => tag),
			size: this.fileSize,
			favorite: false,
			videoData: this.videoData
		}
		_view.storageHelper.saveFileHistory(file, this.callback)
	}

	private createIndex = () => {
		const index: kloakIndex = {
			filename: this.file.name,
			fileExtension: this.file.name.split('.').pop(),
			totalLength: this.file.size,
			contentType: this.file.type,
			pieces: this.pieces.map(piece => piece['uuid']),
			finished: true,
		}
		_view.storageHelper.createUpdateIndex(this.uuid, index, (err, data) => {
			if (err) {
				this.log(err)
				return
			}
			this.log(data)
		})
	}

	private updateProgress = () => {
		if (!this.progressIndicator) {
			return
		}
		const percent = Math.floor(((this.totalPieces - this.pieces.length) / this.totalPieces) * 100)
		if (ko.isObservable(this.progressIndicator)) {
			this.progressIndicator(percent)
			this.progressIndicator.valueHasMutated()
			return
		}
		this.progressIndicator(percent)
	}

	private messageChannel = (e) => {
		const command = e.data.cmd
		const payload = e.data.payload
		switch (command) {
			case 'READY':
				const piece = this.pieces.shift()
				this.disassemblyWorker.postMessage({cmd: 'NEXT_PIECE', payload: {uuid: piece.uuid, offset: piece.offset, chunkSize: this.chunkSize, eof: this.pieces.length === 0}})
				this.updateProgress()
				break;
			case 'DATA':
				_view.storageHelper.encryptSave(payload.uuid, payload.arrayBuffer, (err, data) => {
					if (err) {
						this.disassemblyWorker.terminate()
						this.callback(err, null)
						return
					}
					if (payload.eof) {
						this.callback(null, this.uuid)
						return
					}
					const piece = this.pieces.shift()
					this.disassemblyWorker.postMessage({cmd: 'NEXT_PIECE', payload: {uuid: piece.uuid, offset: piece.offset, chunkSize: this.chunkSize, eof: this.pieces.length === 0}})
					this.updateProgress()
				})
				break;
			default:
				break
		}
	}

	private workerFn = () => {
		const postMessage = self.postMessage as any
		let buffer = null

		const splicePiece = (uuid: string, offset: number, chunkSize: number, eof: boolean) => {
			const arrayBuffer = buffer.slice(offset, offset + chunkSize)
			postMessage({cmd: 'DATA', payload: {uuid, eof, arrayBuffer}}, [arrayBuffer])
		}

		self.addEventListener('message', async (e) => {
			const command = e.data.cmd
			const payload = e.data.payload
			switch (command) {
				case 'START':
					buffer = payload.arrayBuffer
					postMessage({cmd: 'READY', payload: {}})
					break;
				case 'NEXT_PIECE':
					const uuid = payload.uuid
					const offset = payload.offset
					const chunkSize = payload.chunkSize
					const eof = payload.eof
					splicePiece(uuid, offset, chunkSize, eof)
					break;
			}
		})
	}
}
