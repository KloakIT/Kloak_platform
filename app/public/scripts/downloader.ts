class Downloader {
	private requestUuid: string = null
	private downloadObject: kloak_downloadObj = null
	private extraHistoryTags: Array<string> = []
	private downloadIndex: kloakIndex = null
	private downloadState: 'running' | 'waiting' | 'pause' | 'stop' = 'stop'
	private isConsumeQueueRunning: boolean = false
	private downloadQueue: Array<kloak_downloadObj> = []
	private indexDBWorker: databaseWorker
	private dataDBWorker: databaseWorker
	private progressIndicator
	private createdHistory = false
	private callback: Function
	constructor(requestUuid: string, progressIndicator, extraHistoryTags: Array<string>, callback: Function) {
		if (!window.indexedDB) {
			alert(
				"Your browser doesn't support a stable version of IndexedDB.\nWe recommend you use the Chrome browser."
			)
		}
		this.requestUuid = requestUuid
		this.progressIndicator = progressIndicator
		this.extraHistoryTags = extraHistoryTags
		this.callback = callback
		this.indexDBWorker = this.createDatabaseWorker('index')
		this.dataDBWorker = this.createDatabaseWorker('data')
	}

	sleep = (ms) => {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	log = (message: string) => {
		console.log(`<${new Date().toLocaleString()}> ${message}`)
	}

	messageChannel = (e) => {
		const command = e.data.cmd
		const payload = e.data.payload
		switch (command) {
			case 'DATABASE_READY':
				if (payload.type === 'indexRetriever') {
					this.indexDBWorker.state = 'READY'
					this.log('DB: IndexRetriever ready.')
					this.indexDBWorker.instance.postMessage({
						cmd: 'RETRIEVE_INDEX',
						payload: {},
					})
					return
				}
				if (payload.type === 'dataRetriever') {
					this.dataDBWorker.state = 'READY'
					this.log('DB: DataRetriever ready.')
					return
				}
				break
			case 'DATABASE_ERROR':
				this.callback(new Error("Unable to open IndexedDB"), null)
				break
			case 'RETRIEVED_INDEX':
				this.downloadIndex = payload[this.requestUuid]
				break
			case 'FILE_DOWNLOAD_FINISHED':
				this.callback(null, this.requestUuid)
				// this.terminate()
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
			default:
				break
		}
	}

	start = () => {
		this.downloadState = 'running'
		if (!this.isConsumeQueueRunning) {
			this.consumeQueue()
		}
	}

	pause = () => {
		this.downloadState = 'pause'
	}

	stop = () => {
		this.downloadState = 'stop'
	}

	deleteHistory = (requestUuid: string) => {
		let db = null

		let req = window.indexedDB.open('kloak-history', 1)

		req.onupgradeneeded = (e) => {
			db = e.target['result']
			db.createObjectStore('history')
		}

		req.onsuccess = (e) => {
			const db = e.target['result']
			const fs = db
				.transaction('history', 'readonly')
				.objectStore('history')
			fs.get(0).onsuccess = async (e) => {
				let fileHistory = []
				if (e.target.result) {
					fileHistory = await e.target['result'].filter(history => history.uuid !== requestUuid)
				}
				fileHistory.push(history)
			const fs = db
				.transaction('history', 'readwrite')
				.objectStore('history')
			fs.put(fileHistory, 0).onsuccess = (e) => {}
			}
		}

		req.onerror = (e) => {
			this.callback(new Error("Unable to create file history."), null)
		}
	}

	delete = (files?: Array<string>) => {
		if (files) {
			this.dataDBWorker.instance.postMessage({cmd: 'DELETE_DATA', payload: files.shift()})
			if (files.length > 0) {
				this.sleep(500).then(res => {
					this.delete(files)
				})
				return
			}
			this.indexDBWorker.instance.postMessage({cmd: 'DELETE_INDEX', payload: this.requestUuid})
			this.deleteHistory(this.requestUuid)
			return
		}
		this.downloadState = 'stop'
		this.downloadQueue = []
		const pieces = Object.values(this.downloadIndex[this.requestUuid].pieces)
		this.delete(pieces)
	}

	terminate = () => {
		this.indexDBWorker.instance.terminate()
		this.dataDBWorker.instance.terminate()
		this.indexDBWorker = null
		this.dataDBWorker = null
	}

	getState = () => {
		return this.downloadState
	}

	detectStorage = () => {
		if ('storage' in navigator && 'estimate' in navigator.storage) {
			return navigator.storage.estimate().then(({ usage, quota }) => {
				return {
					usage,
					quota,
				}
			})
		}
		return new Error('Unable to detect IndexedDB storage information.')
	}

	createHistory = (obj: kloak_downloadObj) => {
		const history: fileHistory = {
			uuid: this.requestUuid,
			filename: obj.downloadFilename,
			time_stamp: new Date(),
			path: '',
			icon: null,
			url: obj.url,
			domain: obj.url.split('/').splice(0, 3).join('/'),
			detail: '',
			tag: [obj.fileExtension ? obj.fileExtension : null, 'download'],
			color: null,
			fileIndex: null,
		}
		let db = null
		if (this.extraHistoryTags.length > 0) {
			history.tag = [...this.extraHistoryTags, ...history.tag]
			history.tag = history.tag.filter(tag => tag !== null || undefined || "")
		}

		history.tag = history.tag.filter(tag => tag !== null || undefined)

		let req = window.indexedDB.open('kloak-history', 1)

		req.onupgradeneeded = (e) => {
			db = e.target['result']
			db.createObjectStore('history')
		}

		req.onsuccess = (e) => {
			const db = e.target['result']
			const fs = db
				.transaction('history', 'readonly')
				.objectStore('history')
			fs.get(0).onsuccess = (e) => {
				let fileHistory = []
				if (e.target.result) {
					fileHistory = e.target['result']
				}
				fileHistory.push(history)
			const fs = db
				.transaction('history', 'readwrite')
				.objectStore('history')
			fs.put(fileHistory, 0).onsuccess = (e) => {}
			}
		}

		req.onerror = (e) => {
			this.callback(new Error("Unable to create file history."), null)
		}
	}

	updateIndex = (obj: kloak_downloadObj) => {
		if (!this.downloadObject) {
			this.downloadObject = obj
		}
		this.downloadIndex = {
			[this.requestUuid]: {
				filename: obj.downloadFilename,
				fileExtension: obj.fileExtension,
				totalLength: obj.totalLength,
				contentType: obj.contentType,
				pieces: !this.downloadIndex ? {
					[obj.offset]: obj.downloadUuid,
				} : {
					...this.downloadIndex[this.requestUuid].pieces,
					[obj.offset]: obj.downloadUuid,
				},
				finished: false,
			}
		}
		if (obj.eof) {
			this.downloadIndex[obj.requestUuid].finished = true
		}
		this.indexDBWorker.instance.postMessage({
			cmd: 'SAVE_INDEX',
			payload: { index: this.downloadIndex },
		})
	}

	addToQueue = (obj: kloak_downloadObj) => {
		this.downloadQueue.push(obj)
		if (!this.isConsumeQueueRunning) {
			this.consumeQueue(this.downloadQueue.shift())
		}
		return
	}

	updateProgress = (downloadObj: kloak_downloadObj) => {
		let percent = null
		if (!this.progressIndicator) {
			return
		}
		if (downloadObj.totalLength) {
			percent = Math.round(((downloadObj.offset + downloadObj.currentlength) / downloadObj.totalLength) * 100)
		} else {
			console.log(this.downloadIndex[this.requestUuid].pieces)
			console.log(Object.keys(this.downloadIndex[this.requestUuid].pieces).length / downloadObj.totalPieces)
			percent = Math.round(((Object.keys(this.downloadIndex[this.requestUuid].pieces).length) / downloadObj.totalPieces) * 100)
		}
		if (ko.isObservable(this.progressIndicator)) {
			this.progressIndicator(percent)
			this.progressIndicator.valueHasMutated()
			return
		}
		this.progressIndicator = Math.round(((downloadObj.offset + downloadObj.currentlength) / downloadObj.totalLength) * 100
		)
	}

	consumeQueue = (obj: kloak_downloadObj) => {
		this.isConsumeQueueRunning = true
		if (!obj) {
			this.isConsumeQueueRunning = false
			return
		}
		if (obj) {
			if (!this.createdHistory) {
				this.createHistory(obj)
			}
			this.createdHistory = true
			_view.connectInformationMessage.fetchFiles(
				obj.downloadUuid,
				(err, buffer) => {
					if (err) {
						console.log(err)
						this.callback(err, null)
						return
					}
					const arrBuffer: ArrayBuffer = Buffer.from(buffer[0].data).buffer
					this.updateIndex(obj)
					this.dataDBWorker.instance.postMessage(
						{
							cmd: 'SAVE_DATA',
							payload: {
								downloadUuid: obj.downloadUuid,
								arrayBuffer: arrBuffer,
							},
						},
						[arrBuffer]
					)
					this.updateProgress(obj)
					this.consumeQueue(this.downloadQueue.shift())
				}
			)
		}	
	}
}
