// class MediaViewer {
// 	private type: string
// 	private filename: string
// 	private state: 'RUN' | 'STOP' = 'RUN'
// 	private videoQueue: DownloadQueue = null
// 	private audioQueue: DownloadQueue = null
// 	public mediaLoading: KnockoutObservable<boolean> = ko.observable(false)
// 	private callback: Function = null

// 	private MP4BoxFile = null
// 	private mediaSource: MediaSource = null
// 	private videoInit = null
// 	private audioInit = null
// 	private audioCodec = null
// 	private videoCodec = null
// 	private audioSourceBuffer = null
// 	private videoSourceBuffer = null
// 	public player = document.getElementById("videoPlayer")

// 	private videoPlay = false

// 	public exit: Function = () => {}



// 	constructor ( type: string, filename: string, private options: { recording?: boolean, uuid?:string, twitterData?: any, youtubeStreamingData?: any, localYoutube?: fileHistory, customPlayer?: HTMLElement }, _callback: Function, exit: Function) {
// 		this.type = type
// 		this.filename = filename
// 		this.options = options
// 		this.callback = _callback
// 		this.exit = exit

// 		if (options['youtubeStreamingData'] || options['localYoutube']) {
// 			this.streamYoutubeVideo(!!options['localYoutube'])
// 		}

// 		if (options['uuid']) {
// 			this.streamDownloadedVideo(options['recording'])
// 		}

// 		if (options['twitterData']) {
// 			// get twitter
// 		}
// 	}

// 	terminate = () => {
// 		this.state = 'STOP'
// 		this.audioQueue ? this.audioQueue.stopDownload() : null
// 		this.videoQueue ? this.videoQueue.stopDownload() : null
// 	}

// 	Log = ( message: string ) => {
// 		const u = new Date()
// 		return console.log(`[${ u.toLocaleTimeString()}:${ u.getMilliseconds()}] - ${ message }`)
// 	}

// 	checkVideoHistory = (callback: Function) => {
// 		let history: Array<fileHistory> = null
// 		_view.storageHelper.decryptLoad('history', (err, data) => {
// 			if (data) {
// 				history = JSON.parse(Buffer.from(data).toString())
// 				for(let i = 0; i < history.length; i++) {
// 					if (history[i].youtubeId === this.options['youtubeStreamingData']['youtubeId']) {
// 						this.options.localYoutube = history[i]
// 						return callback(true)
// 					}
// 				}
// 				return callback(false, null)
// 			}
// 		})
// 	}


// 	streamYoutubeVideo = (local: boolean) => {
// 		if (!local) {
// 			const types: any[] = this.options['youtubeStreamingData']['streamingData']['adaptiveFormats']

// 			const audioWebm = types.filter ( n => /^audio\/webm; /i.test ( n.mimeType ))
// 			const videoWebm = types.filter ( n => /^video\/webm; /i.test ( n.mimeType ))
// 			const audioMP4 = types.filter ( n => /^audio\/mp4; /i.test ( n.mimeType ))
// 			const videoMP4 = types.filter ( n =>  /^video\/mp4; /i.test ( n.mimeType ))

// 			const audio = audioWebm.pop()
// 			const video = videoWebm.filter ( n => /720p60|720p|480p/.test ( n.qualityLabel )).shift () || videoMP4.filter ( n => /720p60|720p|480p/.test ( n.qualityLabel ) ).shift ()
			
// 			this.audioInit = audio.url
// 			this.videoInit = video.url

// 			this.audioCodec = audio['mimeType'].replace("+", ' ')
// 			this.videoCodec = video['mimeType'].replace("+", ' ')
// 		} else {
// 			this.audioCodec = 'audio/webm; codecs="opus"'
// 			this.videoCodec = 'video/webm; codecs="vp9"'
// 		}
	

// 		const initMediaSource = () => {
// 			if ( typeof MediaSource !== 'undefined' ) {
// 				if (!MediaSource.isTypeSupported(this.audioCodec) || !MediaSource.isTypeSupported(this.videoCodec)) {
// 					this.callback('Unable to play codec', null)
// 					return console.log("Unable to stream this codec!")
// 				}
// 			}
	
// 			this.mediaSource = new MediaSource()
	
// 			if (this.options['customPlayer']) {
// 				this.options['customPlayer'].addEventListener("error", e => {
// 					// console.log(e)
// 				})
// 				this.options['customPlayer']['src'] = URL.createObjectURL(this.mediaSource)
// 			} else {
// 				_view.displayMedia('player')
// 				this.player = document.getElementById("videoPlayer")
// 				this.player.addEventListener("error", e => {
// 					// console.log(e)
// 				})
// 				this.player['src'] = URL.createObjectURL(this.mediaSource)
// 			}
	
// 			this.player.addEventListener("canplay", e => {
// 				this.callback(null, true)
// 				this.player['play']()
// 			})
	
// 			const sourceOpen = (_) => {
// 				console.log ( this.audioCodec, this.videoCodec )
// 				this.audioSourceBuffer = this.mediaSource.addSourceBuffer ( this.audioCodec )
// 				this.videoSourceBuffer = this.mediaSource.addSourceBuffer ( this.videoCodec )

// 				let videoIndex: kloakIndex = null
// 				let audioIndex: kloakIndex = null

// 				let audioPieces = []
// 				let videoPieces = []

// 				let endOfFile = {
// 					audio: false,
// 					video: false
// 				}

// 				let videoRequestUUID = {
// 					video: null,
// 					audio: null,
// 					createdHistory: false
// 				}

// 				const saveIndex = (requestUuid: string,extension: string, contentType: string, pieces: Array<string>) => {
// 					const index: kloakIndex = {
// 						filename: this.options['youtubeStreamingData']['title'],
// 						fileExtension: extension,
// 						totalLength: null,
// 						contentType: contentType,
// 						pieces,
// 						finished: false
// 					}

// 					console.log(index)

// 					_view.storageHelper.createUpdateIndex(requestUuid, index, (err, data) => {
// 						if (err) {
// 							return
// 						}
// 					})
// 				}

// 				const createHistory = () => {
// 					if (!videoRequestUUID.createdHistory) {
// 						if (videoRequestUUID['video'] && videoRequestUUID['audio']) {
// 							_view.storageHelper.youtubeHistory([videoRequestUUID['video'], videoRequestUUID['audio']], this.options['youtubeStreamingData']['youtubeId'], this.options['youtubeStreamingData']['title'], ['youtube'])
// 							videoRequestUUID['createdHistory'] = true
// 						}
// 					}
// 				}

// 				const shouldEndStream = () => {
// 					if (endOfFile['audio'] && endOfFile['video']) {
// 						if (this.videoSourceBuffer.updating || this.audioSourceBuffer.updating) {
// 							return setTimeout(() => {
// 								return shouldEndStream()
// 							}, 1000);
// 						}
// 						this.mediaSource.endOfStream()
// 						return
// 					}
// 					return
// 				}

// 				const playLocalYouTube = () => {
// 					let audioPieces = []
// 					let videoPieces = []

// 					const appendNext = (type: string, pieces, sourceBuffer) => {
// 						if (this.state === 'STOP') {
// 							console.log("SHOULD STOP")
// 							return
// 						}
// 						if (pieces.length) {
// 							return _view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
// 								if (data) {
// 									sourceBuffer.appendBuffer(data)
// 									if (pieces.length) {
// 										return setTimeout(() => {
// 											appendNext(type, pieces, sourceBuffer)
// 										}, 100)
// 									}
// 									endOfFile[type] = true
// 									shouldEndStream()
// 								}
// 							})
// 						}
// 						return
// 					}

// 					_view.storageHelper.getIndex(this.options['localYoutube'].uuid[0], (err, data) => {
// 						if (data) {
// 							videoIndex = JSON.parse(Buffer.from(data).toString())
// 							console.log(videoIndex)
// 							videoPieces = videoIndex['pieces']
// 							appendNext('video', videoPieces, this.videoSourceBuffer)
// 						}
// 					})

// 					_view.storageHelper.getIndex(this.options['localYoutube'].uuid[1], (err, data) => {
// 						if (data) {
// 							audioIndex = JSON.parse(Buffer.from(data).toString())
// 							console.log(audioIndex)
// 							audioPieces = audioIndex['pieces']
// 							appendNext('audio', audioPieces, this.audioSourceBuffer)
// 						}
// 					})
// 				}

// 				if (local) {
					
// 					playLocalYouTube()

// 				} else {

// 					this.checkVideoHistory((exist: boolean) => {
// 						if (exist) {
// 							return playLocalYouTube()
// 						}
						
// 						this.audioQueue = new DownloadQueue ( this.audioInit, 'AUDIO', ( err, data ) => {
// 							if ( err ) {
// 								this.callback(err)
// 								return console.log (`AUDIO stream stoped!`, err )
// 							}
// 							this.audioSourceBuffer.appendBuffer( Buffer.from ( data ).buffer )
// 							shouldEndStream()
// 						}, (requestUuid, downloadUuid, encryptedData, eof) => {
// 							!videoRequestUUID['audio'] ? videoRequestUUID['audio'] = requestUuid : null
// 							endOfFile['audio'] = eof
// 							_view.storageHelper.save(downloadUuid, encryptedData, (err, data) => {
// 								if (err) {
// 									return
// 								}
// 								audioPieces.push(downloadUuid)
// 								saveIndex(videoRequestUUID['audio'], this.audioCodec.split(" ")[0].split('/')[1].replace(";", ""), this.audioCodec.split(" ")[0].replace(";", ""), audioPieces)
// 								createHistory()
// 							})
// 						})
		
// 						this.videoQueue = new DownloadQueue ( this.videoInit, 'VIDEO', ( err, data ) => {
// 							if ( err ) {
// 								this.callback(err)
// 								return console.log (`VIDEO stream stoped!`, err )
// 							}
// 							this.videoSourceBuffer.appendBuffer( Buffer.from ( data ).buffer )
// 							shouldEndStream()
// 						}, (requestUuid, downloadUuid, encryptedData, eof) => {
// 							!videoRequestUUID['video'] ? videoRequestUUID['video'] = requestUuid : null
// 							endOfFile['video'] = eof
// 							_view.storageHelper.save(downloadUuid, encryptedData, (err, data) => {
// 								if (err) {
// 									return
// 								}
// 								videoPieces.push(downloadUuid)
// 								saveIndex(videoRequestUUID['video'], this.videoCodec.split(" ")[0].split('/')[1].replace(";", ""), this.videoCodec.split(" ")[0].replace(";", ""), videoPieces)
// 								createHistory()
// 							})
// 						})
// 					})
// 				}
// 			}


// 			this.mediaSource.addEventListener( "sourceopen", sourceOpen )
// 		}

// 		if (!this.mediaSource) {
// 			initMediaSource()
// 		}
// 	}

// 	streamDownloadedVideo = (recording?: boolean) => {
// 		if (recording) {
// 			_view.storageHelper.createAssembler(this.options.uuid[0], (err, data) => {
// 				if (data) {
// 					console.log(data)
// 					const blobURL = _view.storageHelper.createBlob(data.buffer, data.contentType)
// 					_view.displayMedia('player')
// 					this.player = document.getElementById("videoPlayer")
// 					this.player['src'] = blobURL
			
// 					this.player.addEventListener('canplay', e => {
// 						this.player["play"]()
// 					})
// 				}
// 			})
// 			return
// 		}

// 		this.mediaLoading(true)

// 		const beginFileRetrieval = () => {
// 			let fileStart = 0
// 			let pieces = null
// 			const appendSourceBuffer = (uuid: string) => {
// 				_view.storageHelper.decryptLoad(uuid, (err, data) => {
// 					console.log(err, data)
// 					if (err) {
// 						return console.log("Error grabbing video data!")
// 					}
// 					if (data) {
// 						if (this.type === 'webm') {
// 							this.videoSourceBuffer.appendBuffer(data)
// 						} else {
// 							data['fileStart'] = fileStart
// 							this.MP4BoxFile.appendBuffer(data)
// 							if (!pieces.length) {
// 								this.MP4BoxFile.flush()
// 							}
// 						}
// 						fileStart += data.byteLength
// 						if (pieces.length) {
// 							appendSourceBuffer(pieces.shift())
// 						}
// 					}
// 				})
// 			}
// 			_view.storageHelper.getIndex(this.options['uuid'][0], (err, data) => {
// 				let index = JSON.parse(Buffer.from(data).toString())
// 				pieces = index.pieces
// 				appendSourceBuffer(pieces.shift())
// 			})
// 		}

// 		const mp4box_onSegment = (id, buffer) => {
// 			console.log(id)
// 			var view = new Uint8Array(buffer);
// 			console.log(`ID: ${id} - Got ${buffer.byteLength} bytes. Values= ${view[0]} ${view[1]} ${view[2]} ${view[3]} ${view[4]}`);
// 			switch (id) {
// 				case 1:
// 					if (!this.videoSourceBuffer.updating) {
// 						// console.log("Streaming started with", view[0], view[1], view[2], view[3], view[4]);
// 						this.videoSourceBuffer.appendBuffer(buffer);
// 						return;
// 					}
// 					break
// 				case 2:
// 					if (!this.audioSourceBuffer.updating) {
// 						// console.log("Streaming started with", view[0], view[1], view[2], view[3], view[4]);
// 						this.audioSourceBuffer.appendBuffer(buffer);
// 						return;
// 					}
// 					break
// 			}
// 		}


// 		/*
// 		const createMP4Box = () => {
			
// 			this.MP4BoxFile = MP4Box.createFile()

// 			beginFileRetrieval()

// 			this.MP4BoxFile.onError = (e) => {
// 				console.log(e)
// 			}
	
// 			this.MP4BoxFile.onReady = (info) => {
// 				info['tracks'].forEach(track => {
// 					if (track['video']) {
// 						this.videoSourceBuffer = this.mediaSource.addSourceBuffer(`video/mp4; codecs="${track['codec']}"`)
// 					}

// 					if (track['audio']) {
// 						this.audioSourceBuffer = this.mediaSource.addSourceBuffer(`audio/mp4; codecs="${track['codec']}"`)
// 					}
// 				})

// 				if (info.isFragmented) {
// 					this.mediaSource.duration = info.fragment_duration/info.timescale;
// 				} else {
// 					this.mediaSource.duration = info.duration/info.timescale;
// 				}

// 				// console.log(this.mediaSource.duration)

// 				this.MP4BoxFile.onSegment = (id, user, buffer, sampleNum) => {
// 					console.log("Received segment on track "+id+" for object "+user+" with a length of "+buffer.byteLength+",sampleNum="+sampleNum);
// 					mp4box_onSegment(id, buffer);
// 				  }
		
// 				var options = { nbSamples: 1200, rapAlignement:true };
// 				this.MP4BoxFile.setSegmentOptions(info.tracks[0].id, null, options);
// 				this.MP4BoxFile.setSegmentOptions(info.tracks[1].id, null, options); 
// 				var initSegs = this.MP4BoxFile.initializeSegmentation();
// 				this.videoSourceBuffer.appendBuffer(initSegs[0].buffer)
// 				this.audioSourceBuffer.appendBuffer(initSegs[1].buffer)
// 				this.MP4BoxFile.start();
// 			}
// 		}
// 		*/
// 		const webmSourceOpen = () => {
// 			const mimeType = 'video/webm; codecs="vp9, opus"'
// 			this.videoSourceBuffer = this.mediaSource.addSourceBuffer(mimeType)
// 			beginFileRetrieval()
// 		}

// 		const setupMediaSource = () => {
// 			this.mediaSource = new MediaSource()
// 			_view.displayMedia('player')
// 			this.player = document.getElementById("videoPlayer")
// 			this.player['src'] = URL.createObjectURL(this.mediaSource)
	
// 			this.player.addEventListener('canplay', e => {
// 				this.mediaLoading(false)
// 			})
	
	
// 			this.mediaSource.addEventListener("sourceopen", () => {
// 				if (this.type === 'webm') {
// 					webmSourceOpen()
// 					return
// 				}
// 				//createMP4Box()
// 			})
// 		}

// 		setupMediaSource()
// 	}
// }

class MediaViewer {
	private state: 'RUN' | 'STOP' = 'RUN'
	private videoQueue: DownloadQueue = null
	private audioQueue: DownloadQueue = null
	public mediaLoading: KnockoutObservable<boolean> = ko.observable(false)
	private callback: Function = null

	private MP4BoxFile = null
	private mediaSource: MediaSource = null
	private videoInit = null
	private audioInit = null
	private audioCodec = null
	private videoCodec = null
	private audioSourceBuffer = null
	private videoSourceBuffer = null

	private videoPlay = false

	// public exit: Function = () => {}


	constructor(private type: string, private filename: string, private player: HTMLElement, exit: () => void ) {
	}

	youtube = (youtubeStreamingData: any) => {
		let streamURL = null
		let sockEmitUuid = null
		let download = new DownloadQueue(youtubeStreamingData['streamingData']['formats'].pop().url, 'video', (err, data) => {
			
			console.log(data)
			if ( data ) {
				if (!sockEmitUuid) {
					return _view.connectInformationMessage.sockEmit('requestStreamUrl', download.totalLength, uuid => {
						if ( !uuid ) {
							return console.log (`requestStreamUrl return null`)
						}
						console.log ( `requestStreamUrl return uuid = [${ uuid }]`)
						sockEmitUuid = uuid
						streamURL = `${window.location.href}streamUrl?uuid=${ uuid }`
						this.player['src'] = streamURL
						_view.connectInformationMessage.sockEmit ( uuid, Buffer.from ( data ).toString('base64'), () => {

						})
					})
				}
				_view.connectInformationMessage.sockEmit ( sockEmitUuid, Buffer.from ( data ).toString('base64'), () => {

				})
			}
			

		}, (requestUuid, downloadUuid, data, eof) => {
		})
		console.log(youtubeStreamingData['streamingData']['formats'][1])
	}

	recording = (uuid: string) => {
		_view.storageHelper.createAssembler(uuid, (err, data) => {
			if (data) {
				this.player['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType)
				console.log(data)
				this.player.addEventListener('canplay', e => {
					this.player["play"]()
				})
			}
		})
		return
	}

	downloaded = (uuid: string) => {
		this.mediaLoading(true)

		const beginFileRetrieval = () => {
			let fileStart = 0
			let pieces = null
			const appendSourceBuffer = (uuid: string) => {
				_view.storageHelper.decryptLoad(uuid, (err, data) => {
					console.log(err, data)
					if (err) {
						return console.log("Error grabbing video data!")
					}
					if (data) {
						if (this.type === 'webm') {
							this.videoSourceBuffer.appendBuffer(data)
						} else {
							data['fileStart'] = fileStart
							this.MP4BoxFile.appendBuffer(data)
							if (!pieces.length) {
								this.MP4BoxFile.flush()
							}
						}
						fileStart += data.byteLength
						if (pieces.length) {
							appendSourceBuffer(pieces.shift())
						}
					}
				})
			}
			_view.storageHelper.getIndex(uuid, (err, data) => {
				let index = JSON.parse(Buffer.from(data).toString())
				pieces = index.pieces
				appendSourceBuffer(pieces.shift())
			})
		}

		const webmSourceOpen = () => {
			const mimeType = 'video/webm; codecs="vp9, opus"'
			this.videoSourceBuffer = this.mediaSource.addSourceBuffer(mimeType)
			beginFileRetrieval()
		}

		const setupMediaSource = () => {
			this.mediaSource = new MediaSource()
			this.player['src'] = URL.createObjectURL(this.mediaSource)
	
			this.player.addEventListener('canplay', e => {
				this.mediaLoading(false)
			})
	
	
			this.mediaSource.addEventListener("sourceopen", () => {
				if (this.type === 'webm') {
					webmSourceOpen()
					return
				}
				//createMP4Box()
			})
		}

		setupMediaSource()
	}
	// constructor ( type: string, filename: string, private options: { recording?: boolean, uuid?:string, twitterData?: any, youtubeStreamingData?: any, localYoutube?: fileHistory, customPlayer?: HTMLElement }, _callback: Function, exit: Function) {
	// 	this.type = type
	// 	this.filename = filename
	// 	this.options = options
	// 	this.callback = _callback
	// 	this.exit = exit

	// 	if (options['youtubeStreamingData'] || options['localYoutube']) {
	// 		this.streamYoutubeVideo(!!options['localYoutube'])
	// 	}

	// 	if (options['uuid']) {
	// 		this.streamDownloadedVideo(options['recording'])
	// 	}

	// 	if (options['twitterData']) {
	// 		// get twitter
	// 	}
	// }

	terminate = () => {
		this.state = 'STOP'
		this.audioQueue ? this.audioQueue.stopDownload() : null
		this.videoQueue ? this.videoQueue.stopDownload() : null
	}

	Log = ( message: string ) => {
		const u = new Date()
		return console.log(`[${ u.toLocaleTimeString()}:${ u.getMilliseconds()}] - ${ message }`)
	}

	checkVideoHistory = (callback: Function) => {
		let history: Array<fileHistory> = null
		_view.storageHelper.decryptLoad('history', (err, data) => {
			if (data) {
				history = JSON.parse(Buffer.from(data).toString())
				for(let i = 0; i < history.length; i++) {
					if (history[i].youtubeId === this.options['youtubeStreamingData']['youtubeId']) {
						this.options.localYoutube = history[i]
						return callback(true)
					}
				}
				return callback(false, null)
			}
		})
	}


	streamYoutubeVideo = (local: boolean) => {
		if (!local) {
			const types: any[] = this.options['youtubeStreamingData']['streamingData']['adaptiveFormats']

			const audioWebm = types.filter ( n => /^audio\/webm; /i.test ( n.mimeType ))
			const videoWebm = types.filter ( n => /^video\/webm; /i.test ( n.mimeType ))
			const audioMP4 = types.filter ( n => /^audio\/mp4; /i.test ( n.mimeType ))
			const videoMP4 = types.filter ( n =>  /^video\/mp4; /i.test ( n.mimeType ))

			const audio = audioWebm.pop()
			const video = videoWebm.filter ( n => /720p60|720p|480p/.test ( n.qualityLabel )).shift () || videoMP4.filter ( n => /720p60|720p|480p/.test ( n.qualityLabel ) ).shift ()
			
			this.audioInit = audio.url
			this.videoInit = video.url

			this.audioCodec = audio['mimeType'].replace("+", ' ')
			this.videoCodec = video['mimeType'].replace("+", ' ')
		} else {
			this.audioCodec = 'audio/webm; codecs="opus"'
			this.videoCodec = 'video/webm; codecs="vp9"'
		}
	

		const initMediaSource = () => {
			if (!MediaSource.isTypeSupported(this.audioCodec) || !MediaSource.isTypeSupported(this.videoCodec)) {
				this.callback('Unable to play codec', null)
				return console.log("Unable to stream this codec!")
			}
	
			this.mediaSource = new MediaSource()
	
			if (this.options['customPlayer']) {
				this.options['customPlayer'].addEventListener("error", e => {
					// console.log(e)
				})
				this.options['customPlayer']['src'] = URL.createObjectURL(this.mediaSource)
			} else {
				_view.displayMedia('player')
				this.player = document.getElementById("videoPlayer")
				this.player.addEventListener("error", e => {
					// console.log(e)
				})
				this.player['src'] = URL.createObjectURL(this.mediaSource)
			}
	
			this.player.addEventListener("canplay", e => {
				this.callback(null, true)
				this.player['play']()
			})
	
			const sourceOpen = (_) => {
				console.log ( this.audioCodec, this.videoCodec )
				this.audioSourceBuffer = this.mediaSource.addSourceBuffer ( this.audioCodec )
				this.videoSourceBuffer = this.mediaSource.addSourceBuffer ( this.videoCodec )

				let videoIndex: kloakIndex = null
				let audioIndex: kloakIndex = null

				let audioPieces = []
				let videoPieces = []

				let endOfFile = {
					audio: false,
					video: false
				}

				let videoRequestUUID = {
					video: null,
					audio: null,
					createdHistory: false
				}

				const saveIndex = (requestUuid: string,extension: string, contentType: string, pieces: Array<string>) => {
					const index: kloakIndex = {
						filename: this.options['youtubeStreamingData']['title'],
						fileExtension: extension,
						totalLength: null,
						contentType: contentType,
						pieces,
						finished: false
					}

					console.log(index)

					_view.storageHelper.createUpdateIndex(requestUuid, index, (err, data) => {
						if (err) {
							return
						}
					})
				}

				const createHistory = () => {
					if (!videoRequestUUID.createdHistory) {
						if (videoRequestUUID['video'] && videoRequestUUID['audio']) {
							_view.storageHelper.youtubeHistory([videoRequestUUID['video'], videoRequestUUID['audio']], this.options['youtubeStreamingData']['youtubeId'], this.options['youtubeStreamingData']['title'], ['youtube'])
							videoRequestUUID['createdHistory'] = true
						}
					}
				}

				const shouldEndStream = () => {
					if (endOfFile['audio'] && endOfFile['video']) {
						if (this.videoSourceBuffer.updating || this.audioSourceBuffer.updating) {
							return setTimeout(() => {
								return shouldEndStream()
							}, 1000);
						}
						this.mediaSource.endOfStream()
						return
					}
					return
				}

				const playLocalYouTube = () => {
					let audioPieces = []
					let videoPieces = []

					const appendNext = (type: string, pieces, sourceBuffer) => {
						if (this.state === 'STOP') {
							console.log("SHOULD STOP")
							return
						}
						if (pieces.length) {
							return _view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
								if (data) {
									sourceBuffer.appendBuffer(data)
									if (pieces.length) {
										return setTimeout(() => {
											appendNext(type, pieces, sourceBuffer)
										}, 100)
									}
									endOfFile[type] = true
									shouldEndStream()
								}
							})
						}
						return
					}

					_view.storageHelper.getIndex(this.options['localYoutube'].uuid[0], (err, data) => {
						if (data) {
							videoIndex = JSON.parse(Buffer.from(data).toString())
							console.log(videoIndex)
							videoPieces = videoIndex['pieces']
							appendNext('video', videoPieces, this.videoSourceBuffer)
						}
					})

					_view.storageHelper.getIndex(this.options['localYoutube'].uuid[1], (err, data) => {
						if (data) {
							audioIndex = JSON.parse(Buffer.from(data).toString())
							console.log(audioIndex)
							audioPieces = audioIndex['pieces']
							appendNext('audio', audioPieces, this.audioSourceBuffer)
						}
					})
				}

				if (local) {
					
					playLocalYouTube()

				} else {

					this.checkVideoHistory((exist: boolean) => {
						if (exist) {
							return playLocalYouTube()
						}
						
						this.audioQueue = new DownloadQueue ( this.audioInit, 'AUDIO', ( err, data ) => {
							if ( err ) {
								this.callback(err)
								return console.log (`AUDIO stream stoped!`, err )
							}
							this.audioSourceBuffer.appendBuffer( Buffer.from ( data ).buffer )
							shouldEndStream()
						}, (requestUuid, downloadUuid, encryptedData, eof) => {
							!videoRequestUUID['audio'] ? videoRequestUUID['audio'] = requestUuid : null
							endOfFile['audio'] = eof
							_view.storageHelper.save(downloadUuid, encryptedData, (err, data) => {
								if (err) {
									return
								}
								audioPieces.push(downloadUuid)
								saveIndex(videoRequestUUID['audio'], this.audioCodec.split(" ")[0].split('/')[1].replace(";", ""), this.audioCodec.split(" ")[0].replace(";", ""), audioPieces)
								createHistory()
							})
						})
		
						this.videoQueue = new DownloadQueue ( this.videoInit, 'VIDEO', ( err, data ) => {
							if ( err ) {
								this.callback(err)
								return console.log (`VIDEO stream stoped!`, err )
							}
							this.videoSourceBuffer.appendBuffer( Buffer.from ( data ).buffer )
							shouldEndStream()
						}, (requestUuid, downloadUuid, encryptedData, eof) => {
							!videoRequestUUID['video'] ? videoRequestUUID['video'] = requestUuid : null
							endOfFile['video'] = eof
							_view.storageHelper.save(downloadUuid, encryptedData, (err, data) => {
								if (err) {
									return
								}
								videoPieces.push(downloadUuid)
								saveIndex(videoRequestUUID['video'], this.videoCodec.split(" ")[0].split('/')[1].replace(";", ""), this.videoCodec.split(" ")[0].replace(";", ""), videoPieces)
								createHistory()
							})
						})
					})
				}
			}


			this.mediaSource.addEventListener( "sourceopen", sourceOpen )
		}

		if (!this.mediaSource) {
			initMediaSource()
		}
	}

	streamDownloadedVideo = (recording?: boolean) => {
		if (recording) {
			_view.storageHelper.createAssembler(this.options.uuid[0], (err, data) => {
				if (data) {
					console.log(data)
					const blobURL = _view.storageHelper.createBlob(data.buffer, data.contentType)
					_view.displayMedia('player')
					this.player = document.getElementById("videoPlayer")
					this.player['src'] = blobURL
			
					this.player.addEventListener('canplay', e => {
						this.player["play"]()
					})
				}
			})
			return
		}

		this.mediaLoading(true)

		const beginFileRetrieval = () => {
			let fileStart = 0
			let pieces = null
			const appendSourceBuffer = (uuid: string) => {
				_view.storageHelper.decryptLoad(uuid, (err, data) => {
					console.log(err, data)
					if (err) {
						return console.log("Error grabbing video data!")
					}
					if (data) {
						if (this.type === 'webm') {
							this.videoSourceBuffer.appendBuffer(data)
						} else {
							data['fileStart'] = fileStart
							this.MP4BoxFile.appendBuffer(data)
							if (!pieces.length) {
								this.MP4BoxFile.flush()
							}
						}
						fileStart += data.byteLength
						if (pieces.length) {
							appendSourceBuffer(pieces.shift())
						}
					}
				})
			}
			_view.storageHelper.getIndex(this.options['uuid'][0], (err, data) => {
				let index = JSON.parse(Buffer.from(data).toString())
				pieces = index.pieces
				appendSourceBuffer(pieces.shift())
			})
		}

		const mp4box_onSegment = (id, buffer) => {
			console.log(id)
			var view = new Uint8Array(buffer);
			console.log(`ID: ${id} - Got ${buffer.byteLength} bytes. Values= ${view[0]} ${view[1]} ${view[2]} ${view[3]} ${view[4]}`);
			switch (id) {
				case 1:
					if (!this.videoSourceBuffer.updating) {
						// console.log("Streaming started with", view[0], view[1], view[2], view[3], view[4]);
						this.videoSourceBuffer.appendBuffer(buffer);
						return;
					}
					break
				case 2:
					if (!this.audioSourceBuffer.updating) {
						// console.log("Streaming started with", view[0], view[1], view[2], view[3], view[4]);
						this.audioSourceBuffer.appendBuffer(buffer);
						return;
					}
					break
			}
		}


		/*
		const createMP4Box = () => {
			
			this.MP4BoxFile = MP4Box.createFile()

			beginFileRetrieval()

			this.MP4BoxFile.onError = (e) => {
				console.log(e)
			}
	
			this.MP4BoxFile.onReady = (info) => {
				info['tracks'].forEach(track => {
					if (track['video']) {
						this.videoSourceBuffer = this.mediaSource.addSourceBuffer(`video/mp4; codecs="${track['codec']}"`)
					}

					if (track['audio']) {
						this.audioSourceBuffer = this.mediaSource.addSourceBuffer(`audio/mp4; codecs="${track['codec']}"`)
					}
				})

				if (info.isFragmented) {
					this.mediaSource.duration = info.fragment_duration/info.timescale;
				} else {
					this.mediaSource.duration = info.duration/info.timescale;
				}

				// console.log(this.mediaSource.duration)

				this.MP4BoxFile.onSegment = (id, user, buffer, sampleNum) => {
					console.log("Received segment on track "+id+" for object "+user+" with a length of "+buffer.byteLength+",sampleNum="+sampleNum);
					mp4box_onSegment(id, buffer);
				  }
		
				var options = { nbSamples: 1200, rapAlignement:true };
				this.MP4BoxFile.setSegmentOptions(info.tracks[0].id, null, options);
				this.MP4BoxFile.setSegmentOptions(info.tracks[1].id, null, options); 
				var initSegs = this.MP4BoxFile.initializeSegmentation();
				this.videoSourceBuffer.appendBuffer(initSegs[0].buffer)
				this.audioSourceBuffer.appendBuffer(initSegs[1].buffer)
				this.MP4BoxFile.start();
			}
		}
		*/
		const webmSourceOpen = () => {
			const mimeType = 'video/webm; codecs="vp9, opus"'
			this.videoSourceBuffer = this.mediaSource.addSourceBuffer(mimeType)
			beginFileRetrieval()
		}

		const setupMediaSource = () => {
			this.mediaSource = new MediaSource()
			_view.displayMedia('player')
			this.player = document.getElementById("videoPlayer")
			this.player['src'] = URL.createObjectURL(this.mediaSource)
	
			this.player.addEventListener('canplay', e => {
				this.mediaLoading(false)
			})
	
	
			this.mediaSource.addEventListener("sourceopen", () => {
				if (this.type === 'webm') {
					webmSourceOpen()
					return
				}
				//createMP4Box()
			})
		}

		setupMediaSource()
	}
}



