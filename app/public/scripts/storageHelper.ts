class StorageHelper {
	public downloadPool: KnockoutObservable<{[uuid: string]: kloakFileInstance}> = ko.observable({})
	public currentAssembly: KnockoutObservable<{[uuid: string]: kloakFileInstance}> = ko.observable({})
	private assemblyQueue: KnockoutObservableArray<{uuid: string, callback: Function}> = ko.observableArray([])
	private uploadPool: KnockoutObservable<{[uuid: string]: kloakFileInstance}> = ko.observable({})
	private databaseWorker = new DatabaseWorker()
	private hiddenAnchor = document.createElement('a')
	constructor() {}

	removeFromPool = (pool: KnockoutObservable<any>, uuid: string) => {
		const temp = pool()
		delete temp[uuid]
		pool(temp)
	}

	createDownload = (requestUuid: string, files: Array<string> = null, downloadTitle: string, extraHistoryTags: Array<string>, callback: Function) => {
		if (this.downloadPool()[requestUuid]) {
			callback(`Download already exists!`, requestUuid)
			console.log('Download already exists')
			return
		}
		const progress = ko.observable(0)
		const download = {
			requestSerial: requestUuid,
			filename: downloadTitle,
			progress,
			instance: new Downloader(requestUuid, files, downloadTitle, progress, extraHistoryTags, (err, data) => {
				this.removeFromPool(this.downloadPool, requestUuid)
				callback(err, data)
			})
		}
		this.downloadPool({...this.downloadPool(), [requestUuid]: download})
		return this.downloadPool()[requestUuid].instance
	}

	createAssembler = (requestUuid: string, callback: Function) => {
		if (this.currentAssembly[requestUuid]) {
			callback(`Assembly already exists!`, requestUuid)
			console.log('Assembly already exists')
			return
		}
		if (Object.keys(this.currentAssembly()).length === 0) {
			const progress = ko.observable(0)
			const assembler = {
				requestSerial: requestUuid,
				filename: requestUuid,
				progress,
				instance: new Assembler(requestUuid, progress, (err, data) => {
					this.currentAssembly({})
					callback(err, data)
					const nextRequest = this.assemblyQueue.shift()
					nextRequest ? this.createAssembler(nextRequest.uuid, nextRequest.callback) : null
				})
			}
			this.currentAssembly({[requestUuid]: assembler})
			return this.currentAssembly()[requestUuid]
		} else {
			this.assemblyQueue.push({uuid: requestUuid, callback})
			return requestUuid
		}
	}

	createUploader = (requestUuid: string, file: File, path: string, callback: Function) => {
		const progress = ko.observable(0)
		const uploader = {
			requestSerial: requestUuid,
			filename: file.name,
			progress,
			instance: new Uploader(requestUuid, file, path, progress, (err, data) => {
				data === requestUuid ? this.removeFromPool(this.uploadPool, requestUuid) : null
				callback(err, data)
			})
		}
		this.uploadPool({...this.uploadPool(), [requestUuid]: uploader})
		return this.uploadPool()[requestUuid]
	}

	public delete = (uuid: string, callback: Function) => {
		return this.databaseWorker.delete(uuid, callback)
	}

	public save = (uuid: string, data: string, callback: Function) => {
		return this.databaseWorker.save(uuid, data, callback)
	}

	public encryptSave = (uuid: string, data: string, callback: Function) => {
		return this.databaseWorker.encryptSave(uuid, data, callback)
	}

	public replaceHistory = (histories: Array<fileHistory>, callback?: Function) => {
		return this.databaseWorker.replaceHistory(histories, callback ? callback : null)
	}

	public saveHistory = (history: fileHistory, callback?: Function) => {
		return this.databaseWorker.saveHistory(history, callback ? callback : null)
	}

	public decryptLoad = (uuid: string | number, callback: Function) => {
		return this.databaseWorker.decryptLoad(uuid, callback)
	}

	public decryptLoad2 = (uuid: string | number, callback: Function) => {
		return this.databaseWorker.decryptLoad2(uuid, callback)
	}

	public getIndex = (uuid: string, callback: Function) => {
		return this.databaseWorker.decryptLoad(uuid, callback)
	}

	public getDownloader = (requestUuid: string) => {
		return this.downloadPool[requestUuid].instance
	}

	public createBlob = (data: ArrayBuffer, contentType: string) => {
		const blob = new Blob([data], {type: contentType})
		return URL.createObjectURL(blob)
	}

	public downloadBlob = (url: string, filename: string) => {
		this.hiddenAnchor['href'] = url
		this.hiddenAnchor['download'] = filename
		this.hiddenAnchor.click()
		this.hiddenAnchor['href'] = null
		this.hiddenAnchor['download'] = null
		URL.revokeObjectURL(url)
	}

	public detectStorage = (callback: Function) => {
		if ('storage' in navigator && 'estimate' in navigator.storage) {
			return navigator.storage.estimate().then(({ usage, quota }) => {
				callback(null, {usage, quota})
			})
		}
		return callback(new Error('Unable to detect IndexedDB storage information.'), null)
	}

	// cancel = (requestUuid: string) => {
	// 	const download = this.downloadPool[requestUuid]
	// 	if (download) {
	// 		download.downloader.delete()
	// 	}
	// }

	// terminate = (requestUuid: string) => {
	// 	const download = this.downloadPool[requestUuid]
	// 	if (download) {
	// 		download.downloader.terminate()
	// 	}
	// 	delete this.downloadPool[requestUuid]
	// }



}