class Uploader {
	private file: File
	private arrayBuffer: ArrayBuffer
	private chunkSize: number
	private path: string
	private indexDBWorker: databaseWorker
	private dataDBWorker: databaseWorker
	private disassemblyWorker: databaseWorker
	private pieces = {}
	private uuid: string
	private callback: Function = null
	constructor(file: File, chunkSize: number, path: string, callback: Function) {
		this.callback = callback
		this.path = path
		this.uuid = uuid_generate()
		this.file = file
		this.chunkSize = chunkSize
		this.indexDBWorker = this.createDatabaseWorker('index')
		this.dataDBWorker = this.createDatabaseWorker('data')
	}

	log = (message: string) => {
		console.log(`<${new Date().toLocaleString()}> ${message}`)
	}

	beginFileRead = () => {
		const reader = new FileReader()
		reader.readAsArrayBuffer(this.file)
		reader.onloadend = (e) => {
			this.arrayBuffer = e.target.result
			console.log(this.arrayBuffer)
			this.disassemblyWorker = this.createDatabaseWorker('disassembly')
			if (this.arrayBuffer.byteLength <= this.chunkSize) {
				this.chunkSize = Math.floor(this.arrayBuffer.byteLength / 5)
			}
		}
	}

	createIndex = (): kloakIndex => {
		const index = {
			[this.uuid]: {
				filename: this.uuid,
				fileExtension: this.file.type.split('/')[1]
					? this.file.type.split('/')[1]
					: this.file.name.split('.').pop(),
				totalLength: this.file.size,
				contentType: this.file.type,
				pieces: this.pieces,
				finished: true,
			},
		}
		return index
	}

	updateFileHistory = () => {
		const history = <fileHistory>{
			uuid: this.uuid,
			filename: this.file.name,
			time_stamp: new Date(),
			path: this.path,
			icon: null,
			url: 'Local',
			domain: 'Local',
			detail: '',
			tag: [this.file.name.split('.').pop(), 'Local', 'Upload'],
			color: null,
			fileIndex: null,
		}

		history.tag = history.tag.filter(tag => tag)

		let req = window.indexedDB.open('kloak-history', 1)

		req.onupgradeneeded = (e) => {
			this.db = e.target.result
			this.db.createObjectStore('history')
		}

		req.onsuccess = (e) => {
			const db = e.target.result
			const fs = db.transaction('history', 'readonly').objectStore('history')
			fs.get(0).onsuccess = (e) => {
				let fileHistory = []
				if (e.target.result) {
					fileHistory = e.target.result
				}
				fileHistory.push(history)
				const fs = db.transaction('history', 'readwrite').objectStore('history')
				console.log(fs)
				fs.put(fileHistory, 0).onsuccess = (e) => {
					this.callback()
				}
			}
		}

		req.onerror = (e) => {
			console.log('Unable to open IndexedDB!')
		}
	}

	messageChannel = (e) => {
		const command = e.data.cmd
		const payload = e.data.payload
		switch (command) {
			case 'DATABASE_READY':
				if (payload.type === 'indexRetriever') {
					this.indexDBWorker.state = 'READY'
					this.log('DB: IndexRetriever ready.')
					return
				}
				if (payload.type === 'dataRetriever') {
					this.dataDBWorker.state = 'READY'
					this.log('DB: DataRetriever ready.')
					this.beginFileRead()
					return
				}
				break
			case 'DATABASE_ERROR':
				break
			case 'DISASSEMBLY_READY':
				this.disassemblyWorker.state = 'READY'
				this.disassemblyWorker.instance.postMessage(
					{
						cmd: 'SPLIT_FILE',
						payload: {
							arrayBuffer: this.arrayBuffer,
							chunkSize: this.chunkSize,
						},
					},
					this.arrayBuffer
				)
				break
			case 'SPLIT_FILE_PIECE':
				const removePGP = (pgp: string): string => {
					let modified = pgp.replace('-----BEGIN PGP MESSAGE-----', '')
					modified = modified.replace('-----END PGP MESSAGE-----', '')
					modified = modified.replace('Comment: https://openpgpjs.org', '')
					modified = modified.replace(/([A-Z])\w+: OpenPGP.js *.*/, '')
					return modified.trim()
				}
				const arrBuffer = payload.arrayBuffer
				console.log(arrBuffer)
				this.pieces[payload.offset] = payload.uuid
				if (payload.end) {
					this.indexDBWorker.instance.postMessage({
						cmd: 'SAVE_INDEX',
						payload: {
							index: this.createIndex(),
						},
					})
					this.updateFileHistory()
				}
				_view.sharedMainWorker.encryptStream_withMyPublicKey(
					Buffer.from(arrBuffer),
					(err, data) => {
						if (err) {
							console.log('Cannot encrypt data!')
							return
						}
						console.log(removePGP(data))
						const arrBuffer: ArrayBuffer = Buffer.from(removePGP(data)).buffer
						this.dataDBWorker.instance.postMessage(
							{
								cmd: 'SAVE_PREPARED_DATA',
								payload: {
									arrayBuffer: arrBuffer,
									downloadUuid: payload.uuid,
								},
							},
							arrBuffer
						)
						this.pieces[payload.offset] = payload.uuid
					}
				)
				break
			default:
				break
		}
	}

	createDatabaseWorker = (type: string): databaseWorker => {
		switch (type) {
			case 'index':
				const indexDBWorker: databaseWorker = {
					type: type,
					instance: new IndexRetriever().getInstance(),
					state: 'NOT READY',
				}
				indexDBWorker.instance.addEventListener('message', this.messageChannel)
				return indexDBWorker
			case 'data':
				const dataDBWorker: databaseWorker = {
					type: type,
					instance: new DataRetriever().getInstance(),
					state: 'NOT READY',
				}
				dataDBWorker.instance.addEventListener('message', this.messageChannel)
				return dataDBWorker
			case 'disassembly':
				const disassemblyWorker: databaseWorker = {
					type: type,
					instance: new DisassemblyWorker().getInstance(),
					state: 'NOT READY',
				}
				disassemblyWorker.instance.addEventListener(
					'message',
					this.messageChannel
				)
				return disassemblyWorker
			default:
				break
		}
	}
}
