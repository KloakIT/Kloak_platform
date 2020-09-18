class MediaViewer {
	private type: string
	private filename: string
	public mediaLoading: KnockoutObservable<boolean> = ko.observable(false)
	public options: {stream?: boolean, customPlayer?: HTMLElement} = {}
	private callback: Function = null

	private MP4BoxFile = null
	private mediaSource = null
	private videoPieces = []
	private audioPieces = []
	private videoInit = null
	private audioInit = null
	private calledInit = {video: false, audio: false}
	private audioCodec = null
	private videoCodec = null
	private audioRequestUuid = uuid_generate()
	private videoRequestUuid = uuid_generate()
	private audioSourceBuffer = null
	private videoSourceBuffer = null
	private videoFetching = false 
	private audioFetching = false 
	public player = document.getElementById("videoPlayer")

	private videoArray = []
	private audioArray = []

	private currentVideoPoint = 1
	private currentAudioPoint = 1

	private videoDataAppendRunning = false
	private audioDataAppendRunning = false

	private videoPlay = false

	public exit: Function = () => {}



	constructor ( type: string, filename: string, options: { uuid?:string, twitterData?: any, youtubeStreamingData?: any, customPlayer?: HTMLElement }, _callback: Function, exit: Function) {
		this.type = type
		this.filename = filename
		this.options = options
		this.callback = _callback
		this.exit = exit

		if (options['youtubeStreamingData']) {
			this.streamYoutubeVideo()
		}

		if (options['uuid']) {
			this.streamDownloadedVideo()
		}

		if (options['twitterData']) {
			// get twitter
		}
	}

	Log = ( message: string ) => {
		const u = new Date()
		return console.log(`[${ u.toLocaleTimeString()}:${ u.getMilliseconds()}] - ${ message }`)
	}

	

	streamYoutubeVideo = () => {
		const types: any[] = this.options['youtubeStreamingData']['adaptiveFormats']

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


				new DownloadQueue ( this.audioInit, 'AUDIO', ( err, data ) => {
					if ( err ) {
						return console.log (`AUDIO stream stoped!`, err )
					}
					this.audioSourceBuffer.appendBuffer( Buffer.from ( data ).buffer )
				})

				new DownloadQueue ( this.videoInit, 'VIDEO', ( err, data ) => {
					if ( err ) {
						return console.log (`VIDEO stream stoped!`, err )
					}
					this.videoSourceBuffer.appendBuffer( Buffer.from ( data ).buffer )
				})

			}


			this.mediaSource.addEventListener( "sourceopen", sourceOpen )
		}

		if (!this.mediaSource) {
			initMediaSource()
		}

		// this.downloader(audioURL, this.audioRequestUuid, (uuid, com) => {
		// 	if (com.Args[0].order === 0) {
		// 		this.downloadInit(com.Args[0].downloadUuid, (buffer) => {
		// 			this.audioInit = buffer
		// 			this.downloader(videoURL, this.videoRequestUuid, (uuid, com) => {
		// 				if (com.Args[0].order === 0) {
		// 					this.downloadInit(com.Args[0].downloadUuid, (buffer) => {
		// 						this.videoInit = buffer
		// 						if (!this.mediaSource) {
		// 							this.initMediaSource()
		// 						}
		// 					})
		// 					return
		// 				}
		// 				this.videoPieces.set(com.Args[0].order, com.Args[0])
		// 			})
		// 		})
		// 		return
		// 	}
		// 	this.audioPieces.set(com.Args[0].order, com.Args[0])
		// })
	}

	streamDownloadedVideo = () => {
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
			_view.storageHelper.getIndex(this.options['uuid'], (err, data) => {
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


