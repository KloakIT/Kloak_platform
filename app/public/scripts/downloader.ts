class Downloader {
	private requestUuid: string = null
	private downloadTitle: string = null
	private downloadObject: kloak_downloadObj = null
	private extraHistoryTags: Array<string> = []
	private downloadIndex: kloakIndex = null
	private isConsumeQueueRunning: boolean = false
	private downloadQueue: Array<Object> = []
	private progressIndicator
	private createdHistory = false
	private totalPieces: number = null
	private stopDownload = false
	private callback: Function
	constructor ( requestUuid: string, files: Array<string> = null, downloadTitle: string, progressIndicator: KnockoutObservable<number> | Function, extraHistoryTags: Array<string>, callback: Function) {
		if (!window.indexedDB) {
			alert(
				"Your browser doesn't support a stable version of IndexedDB.\nWe recommend you use the Chrome browser."
			)
		}
		this.requestUuid = requestUuid
		this.downloadTitle = downloadTitle
		this.progressIndicator = progressIndicator
		this.extraHistoryTags = extraHistoryTags
		this.callback = callback

		if (files && files.length > 0) {
			this.totalPieces = files.length
			this.addToQueue(files)
			console.log("CREATED DOWNLOADER")
		}
	}

	log = (message: string) => {
		console.log(`<${new Date().toLocaleString()}> ${message}`)
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

	stop = () => {
		this.stopDownload = true
	}

	updateIndex = (uuid, eof) => {
		if (!uuid) {
			return
		}
		this.downloadIndex = {
			filename: this.downloadObject ? this.downloadObject['downloadFilename'] : this.downloadTitle,
			fileExtension: this.downloadObject ? this.downloadObject['fileExtension'] : null,
			totalLength: this.downloadObject ? this.downloadObject['totalLength'] : null,
			contentType: this.downloadObject ? this.downloadObject['contentType'] : null,
			pieces: !this.downloadIndex ? [uuid] : [ ...this.downloadIndex.pieces, uuid],
			finished: false
		}
		if (eof) {
			this.downloadIndex.finished = true
		}
		_view.storageHelper.encryptSave(this.requestUuid, JSON.stringify(this.downloadIndex), (err, data) => {
			if (err) {
				console.log(err)
				return
			}
			if (eof) {
				this.callback(null, this.requestUuid)
			}
			return data
		})
	}

	addToQueue = (filesArray: Array<any>) => {
		filesArray.forEach(file => {
			this.downloadQueue.push(file)
			if (!this.isConsumeQueueRunning) {
				this.consumeQueue()
			}
		})
		return
	}

	updateProgress = (obj: any) => {
		if (!this.progressIndicator) {
			return
		}
		let percent = null
		if (obj['totalLength']) {
			percent = Math.round(((obj.offset + obj.currentlength) / obj.totalLength) * 100)
		} else {
			percent = Math.round(((this.downloadIndex.pieces.length) / this.totalPieces) * 100)
		}

		if (ko.isObservable(this.progressIndicator)) {
			this.progressIndicator(percent)
			this.progressIndicator.valueHasMutated()
			return
		}
		this.progressIndicator(percent)
	}

	updateHistory = () => {
		const date = new Date()
		const history: fileHistory = {
			uuid: this.requestUuid,
			filename: this.downloadIndex.filename,
			time_stamp: date,
			last_viewed: date,
			path: '',
			url: null,
			domain: null,
			tag: [...this.extraHistoryTags, this.downloadIndex.fileExtension, 'download'],
			color: null
		}
		history.tag = history.tag.filter(tag => tag !== null)
		_view.storageHelper.saveHistory(history, null)
	}

	consumeQueue = () => {
		if (this.stopDownload) {
			this.isConsumeQueueRunning = false
			return
		}
		this.isConsumeQueueRunning = true
		const obj = this.downloadQueue.shift()
		let uuid = obj['downloadUuid'] || obj['fileName']
		if (!uuid) {
			this.isConsumeQueueRunning = false
			return
		}
		if (uuid) {
			_view.connectInformationMessage.fetchFiles(
				uuid,
				(err, data) => {
					if (err) {
						this.callback(err, null)
						return
					}
					_view.storageHelper.save(uuid, data.data, (err, data) => {
						if (err) {
							this.callback(err, null)
							return
						}
						this.updateIndex(uuid, obj['eof'])
						this.updateProgress(obj)
						if (!this.createdHistory) {
							this.updateHistory()
							this.createdHistory = true
						}
						if (this.downloadQueue.length > 0) {
							this.consumeQueue()
						}
					})
				}
			)
		}	
	}
}
