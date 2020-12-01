class StorageHelper {
	public downloadPool: KnockoutObservable<{[uuid: string]: kloakFileInstance}> = ko.observable({})
	public currentAssembly: KnockoutObservable<{[uuid: string]: kloakFileInstance}> = ko.observable({})
	private assemblyQueue: KnockoutObservableArray<{uuid: string, callback: Function}> = ko.observableArray([])
	private uploadPool: KnockoutObservable<{[uuid: string]: kloakFileInstance}> = ko.observable({})
	private databaseWorker = new DatabaseWorker()
	private hiddenAnchor = document.createElement('a')
	constructor() {}

	public removeFromPool = (pool: KnockoutObservable<any>, uuid: string) => {
		const temp = pool()
		delete temp[uuid]
		pool(temp)
	}

	public createDownload = (requestUuid: string, files: Array<string> = null, downloadTitle: string, extraHistoryTags: Array<string>, callback: Function, stream?:boolean) => {
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

	public createYoutubeMP4Downloader = (requestSerial, url: string, title: string, duration: string | number, youtubeId: string, quality: string, mimeType: string, thumbnail: string, callback: (eof) => void) => {
		console.log(mimeType)
		let progress: KnockoutObservable<number> = null
		let createdHistory = false
		const pieces = []
		let totalSize = {
			downloaded: 0,
			total: 0
		}

		const createHistory = (requestUuid) => {
			const date = new Date()
			const history: fileHistory = {
				uuid: [requestUuid],
				filename: `${title}.mp4`,
				time_stamp: date,
				last_viewed: date,
				path: "",
				url: `YouTube`,
				tags: ['youtube', 'mp4', 'video'],
				size: totalSize.total,
				favorite: false,
				youtube: {
					id: youtubeId,
					mimeType: {
						video: mimeType,
					},
					quality,
					duration: parseInt(duration.toString())
				}
			}

			_view.storageHelper.saveFileHistory(history, (err, data) => {
				if (err) {
					return console.log(err)
				}
			})
		}

		const createProgress = () => {
			const download = {
				requestSerial: requestSerial,
				progress
			}
			this.downloadPool({...this.downloadPool(), [requestSerial]: download})
		}

		const createUpdateIndex = (requestUuid, com: kloak_downloadObj, pieces) => {
			const index: kloakIndex = {
				filename: com.downloadFilename,
				fileExtension: com.contentType.split("/")[1],
				totalLength: com.totalLength ? com.totalLength : null,
				contentType: com.contentType,
				pieces: [...pieces],
				finished: com.eof
			}
			_view.storageHelper.createUpdateIndex(requestUuid, index, (err, data) => {
				if (err) {
					console.log(err)
				}
			})
		}

		new DownloadQueue(url, title, (err, data) => {
			console.log(err, data)
		}, (requestUuid, com: kloak_downloadObj, data) => {
			console.log(com)
			totalSize.downloaded += com.currentlength
			totalSize.total = com.totalLength
			this.save(com.downloadUuid, data, (err, data) => {
				if (err) {
					return
				}
				pieces.push(com.downloadUuid)
				createUpdateIndex(requestUuid, com, pieces)
				if (!createdHistory) {
					createHistory(requestUuid)
					createdHistory = true
				}
				if (!progress) {
					progress = ko.observable(0)
					createProgress()
				} else {
					this.downloadPool()[requestSerial].progress(Math.round(totalSize['downloaded'] / totalSize['total'] * 100))
				}
				if (com.eof) {
					this.removeFromPool(this.downloadPool, requestSerial)
					callback(com.eof)	
				}
			})
		})

	}

	public createYoutubeDownloader = (requestSerial, videoURL: string = null, audioURL: string = null, title: string, duration: string | number, youtubeId: string, quality: string, thumbnail: string, callback: (eof) => void) => {
		let progress: KnockoutObservable<number> = null

		let downloadRequestUuid = {
			video: null,
			audio: null,
			created: false
		}

		let EOF = {
			video: null,
			audio: null
		}

		let totalSize = {
			video: {
				downloaded: 0,
				total: 0
			},
			audio: {
				downloaded: 0,
				total: 0
			}
		}

		let audioPieces = []
		let videoPieces = []

		const createProgress = () => {
			const download = {
				requestSerial: requestSerial,
				progress
			}
			this.downloadPool({...this.downloadPool(), [requestSerial]: download})
		}

		const updateProgress = () => {
			console.log(totalSize)
			if (audioURL && !videoURL) {
				const percent = Math.round((totalSize['audio'].downloaded / totalSize['audio'].total) * 100)
				console.log(`=============${percent}==================`)
				this.downloadPool()[requestSerial].progress(percent)
				return
			}
			if (totalSize['video'].total && totalSize['audio'].total) {
				const total = totalSize['video'].total + totalSize['audio'].total
				const downloaded = totalSize['video'].downloaded + totalSize['audio'].downloaded
				const percent = Math.round((downloaded / total) * 100)
				this.downloadPool()[requestSerial].progress(percent)
			}
		}
		

		const createUpdateIndex = (requestUuid, com: kloak_downloadObj, pieces) => {
			const index: kloakIndex = {
				filename: com.downloadFilename,
				fileExtension: com.contentType.split("/")[1],
				totalLength: com.totalLength ? com.totalLength : null,
				contentType: com.contentType,
				pieces: [...pieces],
				finished: com.eof
			}
			_view.storageHelper.createUpdateIndex(requestUuid, index, (err, data) => {
				if (err) {
					console.log(err)
				}
			})
		}

		const createHistory = (mimeType: {video: string, audio: string}) => {
			const videoMimeType = {
				video: 'video/webm; codecs="vp9"'
			}
			const audioMimeType = {
				audio: 'audio/webm; codecs="opus"'
			}

			if (!downloadRequestUuid.created) {
				if (audioURL && !videoURL) {
					_view.storageHelper.youtubeHistory([null, downloadRequestUuid['audio']], youtubeId, title, ['youtube', 'audio'], audioMimeType, duration, quality, thumbnail)
					downloadRequestUuid.created = true
					return
				}
				if (downloadRequestUuid['video'] && downloadRequestUuid['audio']) {
					_view.storageHelper.youtubeHistory([downloadRequestUuid['video'], downloadRequestUuid['audio']], youtubeId, title, ['video', 'youtube'], Object.assign(videoMimeType, audioMimeType), duration, quality, thumbnail)
					downloadRequestUuid.created = true
				}
			}
		}
		
		if (videoURL) {
			let videoDownload = new DownloadQueue(videoURL, title, () => {}, (requestUuid, com: kloak_downloadObj, data) => {
				if (!downloadRequestUuid['video']) {
					downloadRequestUuid['video'] = requestUuid
				}
				createHistory({video:'video/webm; codecs="vp9"', audio:'audio/webm; codecs="opus"'})
				if (!totalSize['video']['total']) {
					totalSize['video']['total'] = parseInt(com.totalLength.toString())
				}

				console.log(com)

				totalSize['video'].downloaded += com.currentlength

				if (!progress) {
					progress = ko.observable(0)
					createProgress()
				} else {
					updateProgress()
				}

				if (com.eof) {
					EOF['video'] = true
					if (EOF['video'] && EOF['audio']) {
						callback(true)
						this.removeFromPool(this.downloadPool, requestSerial)
					}
				}
				this.save(com.downloadUuid, data, (err, data) => {
					if (err) {
						return
					}
					videoPieces.push(com.downloadUuid)
					createUpdateIndex(requestUuid, com, videoPieces)
				})
			})
		}

		if (audioURL) {
			let audioDownload = new DownloadQueue(audioURL, title, () => {}, (requestUuid, com: kloak_downloadObj, data) => {
				if (!downloadRequestUuid['audio']) {
					downloadRequestUuid['audio'] = requestUuid
				}
				createHistory({video:'video/webm; codecs="vp9"', audio:'audio/webm; codecs="opus"'})
				if (!totalSize['audio']['total']) {
					totalSize['audio']['total'] = parseInt(com.totalLength.toString())
				}

				totalSize['audio'].downloaded += com.currentlength

				if (!progress) {
					progress = ko.observable(0)
					createProgress()
				} else {
					updateProgress()
				}



				if (com.eof) {
					EOF['audio'] = true
					if (audioURL && !videoURL) {
						if (EOF['audio']) {
							callback(true)
							this.removeFromPool(this.downloadPool, requestSerial)
						}
					}
					if (EOF['video'] && EOF['audio']) {
						callback(true)
						this.removeFromPool(this.downloadPool, requestSerial)
					}
				}
				this.save(com.downloadUuid, data, (err, data) => {
					if (err) {
						return
					}
					audioPieces.push(com.downloadUuid)
					createUpdateIndex(requestUuid, com, audioPieces)
				})
			})
		}
	}

	public createAssembler = (requestUuid: string, callback: Function) => {
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

	public createUploader = (requestUuid: string, file: File, path: string, extraTags: string[], callback: Function) => {
		const progress = ko.observable(0)
		const uploader = {
			requestSerial: requestUuid,
			filename: file.name,
			progress,
			instance: new Uploader(requestUuid, file, path, extraTags,  progress, (err, data) => {
				data === requestUuid ? this.removeFromPool(this.uploadPool, requestUuid) : null
				callback(err, data)
			})
		}
		this.uploadPool({...this.uploadPool(), [requestUuid]: uploader})
		return this.uploadPool()[requestUuid]
	}

	public youtubeHistory = (requestUUIDs: Array<string>, youtubeId: string, title: string, extraTags: Array<string>,  mimeType: {video?: string, audio?: string}, duration?: number | string, quality?: string, thumbnail: string = null ) => {
		const date = new Date()
		const file: fileHistory = {
			uuid: requestUUIDs,
			filename: title,
			time_stamp: date,
			last_viewed: date,
			path: "",
			url: 'YouTube',
			favorite: false,
			tags: [...extraTags, 'upload', 'local'].filter(tag => tag),
			youtube: {
				id: youtubeId,
				mimeType,
				quality,
			}
		}

		if (duration) {
			file.youtube.duration = parseInt(duration.toString())
		}

		if (thumbnail) {
			const arr = thumbnail.split(','), mime = arr[0].match(/:(.*?);/)[1];
			history['youtube']['thumbnail'] = {
				data: arr[1],
				mime: mime
			}
		}
		_view.storageHelper.saveFileHistory(file, (err, data) => {

		})
	}

	public dataURItoBlob = (base64: string, mime: string) => {
		return URL.createObjectURL(new Blob([Buffer.from(base64, 'base64')], {type: mime}))
	}

	public createUpdateIndex = (uuid: string, index: kloakIndex, callback: Function) => {
		console.log(index)
		this.encryptSave(uuid, JSON.stringify(index), callback)
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

	public replaceHistory = (files: history, callback?: Function) => {
		return this.databaseWorker.replaceHistory(files, callback ? callback : null)
	}

	public saveFileHistory = (file: fileHistory, callback?: Function) => {
		return this.databaseWorker.saveFileHistory(file, callback ? callback : null)
	}

	public getHistory = (callback?: Function) => {
		return this.databaseWorker.decryptLoad("history", (err, data) => {
			if (err) {
				return callback(err, null)
			}
			return callback(null, JSON.parse(Buffer.from(data).toString()))
		})
	} 

	public decryptLoad = (uuid: string | number, callback: Function) => {
		return this.databaseWorker.decryptLoad(uuid, callback)
	}

	public getIndex = (uuid: string, callback: Function) => {
		return this.databaseWorker.decryptLoad(uuid, (err, data) => {
			callback(null, JSON.parse(Buffer.from(data).toString()))
		})
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
}