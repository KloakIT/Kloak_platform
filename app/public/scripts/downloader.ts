class Downloader {
	private requestUuid: string = null
	private downloadObject: kloak_downloadObj = null
	private downloadIndex: kloakIndex = null
	private downloadState: 'running' | 'waiting' | 'pause' | 'stop' = 'stop'
	private isConsumeQueueRunning: boolean = false
	private downloadQueue: Array<kloak_downloadObj> = []
	private indexDBWorker: databaseWorker
	private dataDBWorker: databaseWorker
	private options: downloaderOptions
	private callback: Function
	constructor(callback: Function, requestUuid: string, options: downloaderOptions = {hasProgress: true}) {
		if (!window.indexedDB) {
			alert(
				"Your browser doesn't support a stable version of IndexedDB.\nWe recommend you use the Chrome browser."
			)
		}
		this.options = options
		this.callback = callback
		this.requestUuid = requestUuid
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
				break
			case 'RETRIEVED_INDEX':
				this.downloadIndex = payload[this.requestUuid]
				break
			case 'FILE_DOWNLOAD_FINISHED':
				this.callback({
					cmd: 'FILE_DOWNLOAD_FINISHED',
					payload: { requestUuid: this.requestUuid },
				})
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

	terminate = () => {
		this.indexDBWorker.instance.terminate()
		this.indexDBWorker = null
		this.dataDBWorker.instance.terminate()
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

	updateIndex = (obj: kloak_downloadObj) => {
		if (!this.downloadObject) {
			this.downloadObject = obj
			this.callback({
				cmd: 'CREATE_FILE_HISTORY',
				payload: <fileHistory>{
					uuid: obj.requestUuid,
					time_stamp: new Date(),
					path: '',
					icon: null,
					url: obj.url,
					urlShow: obj.downloadFilename,
					domain: obj.url.split('/').splice(0, 3).join('/'),
					detail: '',
					tag: [obj.fileExtension, 'download'],
					color: null,
					fileIndex: null,
				},
			})
		}
		if (!this.downloadIndex) {
			this.downloadIndex = {
				[this.requestUuid]: {
					filename: obj.downloadFilename,
					fileExtension: obj.fileExtension,
					totalLength: obj.totalLength,
					contentType: obj.contentType,
					pieces: {
						[obj.offset]: obj.downloadUuid,
					},
					finished: false,
				},
			}
			return
		}
		this.downloadIndex = {
			[this.requestUuid]: {
				filename: obj.downloadFilename,
				fileExtension: obj.fileExtension,
				totalLength: obj.totalLength,
				contentType: obj.contentType,
				pieces: {
					...this.downloadIndex[this.requestUuid].pieces,
					[obj.offset]: obj.downloadUuid,
				},
				finished: false,
			},
		}
		console.log(this.downloadIndex)
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
			this.consumeQueue()
		}
		console.log('added to queue')
		console.log(obj)
		return
	}

	updateProgress = (downloadObj: kloak_downloadObj) => {
		this.callback({
			cmd: 'UPDATE_PROGRESS',
			payload: {
				requestUuid: downloadObj.requestUuid,
				percent: Math.round(
					((downloadObj.offset + downloadObj.currentlength) /
						downloadObj.totalLength) *
						100
				),
			},
		})
	}

	consumeQueue = () => {
		this.isConsumeQueueRunning = true
		switch (true) {
			case this.downloadState === 'stop':
			case this.downloadState === 'pause':
			case this.downloadQueue.length === 0:
				this.isConsumeQueueRunning = false
				return
			case this.downloadQueue.length > 0:
				if (this.downloadState === 'running') {
					const downloadObj: kloak_downloadObj = this.downloadQueue.shift()
					// TESTING DOWNLOAD
					// TESTING DOWNLOAD
					_view.connectInformationMessage.fetchFiles(
						downloadObj.downloadUuid,
						(err, buffer) => {
							// if (err) {
							// 	return console.dir(err)
							// }
							//console.log(buffer[0].data)
							const arrBuffer: ArrayBuffer = Buffer.from ( buffer[0].data ).buffer
							this.updateIndex(downloadObj)
							this.dataDBWorker.instance.postMessage(
								{
									cmd: 'SAVE_DATA',
									payload: {
										downloadUuid: downloadObj.downloadUuid,
										arrayBuffer: arrBuffer,
									},
								},
								[arrBuffer]
							)
							if (this.options['hasProgress']) {
							this.updateProgress(downloadObj)
							}
						}
					)
				}
				this.sleep(1000).then(() => {
					this.consumeQueue()
				})
				break
		}
	}

	// setupQueueInterval = (): NodeJS.Timeout => {
	// 	return setInterval(() => {
	// 		if (this.downloadState === 'running') {
	// 			this.downloadQueue.length > 0
	// 				? this.downloadManager.postMessage(<action>{
	// 						cmd: 'DOWNLOAD',
	// 						payload: this.downloadQueue.shift(),
	// 				  })
	// 				: null
	// 		}
	// 	}, 2000)
	// }
}
