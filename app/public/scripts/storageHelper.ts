class StorageHelper {
	private downloadPool: KnockoutObservable<{[uuid: string]: kloakFileInstance}> = ko.observable({})
	private assemblyPool: KnockoutObservable<{[uuid: string]: kloakFileInstance}> = ko.observable({})
	private uploadPool: KnockoutObservable<{[uuid: string]: kloakFileInstance}> = ko.observable({})
	private databaseWorker = new DatabaseWorker()
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
			filename: requestUuid,
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
		if (this.assemblyPool[requestUuid]) {
			callback(`Assembly already exists!`, requestUuid)
			console.log('Assembly already exists')
			return
		}
		const progress = ko.observable(0)
		const assembler = {
			requestSerial: requestUuid,
			filename: requestUuid,
			progress,
			instance: new Assembler(requestUuid, progress, (err, data) => {
				this.removeFromPool(this.assemblyPool, requestUuid)
				callback(err, data)
			})
		}
		this.assemblyPool({...this.assemblyPool(), [requestUuid]: assembler})
		return this.assemblyPool()[requestUuid]
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
		console.log(this.uploadPool())
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