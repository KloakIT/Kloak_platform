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
    // public exit: Function = () => {}
    constructor(type, filename, customPlayer, callback, exit) {
        this.type = type;
        this.filename = filename;
        this.customPlayer = customPlayer;
        this.callback = callback;
        this.exit = exit;
        this.state = 'RUN';
        this.download = null;
        this.mediaLoading = ko.observable(false);
        // private callback: Function = null
        this.MP4BoxFile = null;
        this.mediaSource = null;
        this.videoInit = null;
        this.audioInit = null;
        this.audioCodec = null;
        this.videoCodec = null;
        this.sourceBuffers = {
            video: null,
            audio: null
        };
        this.pieces = null;
        this.videoPlaying = false;
        this.buffered = 0;
        this.sourceOpen = (codecs, callback) => {
            console.log("source open");
            codecs.map((codec, idx) => {
                const keys = Object.keys(this.sourceBuffers);
                this.sourceBuffers[keys[idx]] = this.mediaSource.addSourceBuffer(codec);
            });
            callback();
        };
        this.setupMediaSource = (codecs, callback) => {
            console.log("setting up media source!");
            if (!MediaSource) {
                return console.log("Your browser does not support MediaSource!");
            }
            this.mediaSource = new MediaSource();
            this.customPlayer.player['src'] = URL.createObjectURL(this.mediaSource);
            this.mediaSource.addEventListener("sourceopen", () => {
                this.sourceOpen(codecs, () => {
                    callback();
                    this.mediaSource.removeEventListener('sourceopen', () => { });
                });
            });
        };
        this.endOfStream = () => {
            if (this.sourceBuffers['video']?.updating || this.sourceBuffers['audio']?.updating) {
                return setTimeout(() => {
                    this.endOfStream();
                }, 250);
            }
            if (this.mediaSource.readyState === 'open') {
                this.mediaSource.endOfStream();
            }
        };
        this.youtube = (youtubeStreamingData) => {
            let youtubeId = youtubeStreamingData['videoDetails']['videoId'];
            let format = youtubeStreamingData['streamingData']['formats'].pop();
            let duration = youtubeStreamingData['duration'];
            console.log(duration);
            let extension = format['mimeType'].split(" ")[0].replace(";", "").split("/")[1];
            let url = format.url;
            let downloadedPieces = [];
            const createUpdateIndex = (requestUuid, com) => {
                const index = {
                    filename: com.downloadFilename,
                    fileExtension: extension,
                    totalLength: com.totalLength ? com.totalLength : null,
                    contentType: com.contentType,
                    pieces: [...downloadedPieces],
                    finished: com.eof
                };
                _view.storageHelper.createUpdateIndex(requestUuid, index, (err, data) => {
                    if (err) {
                        console.log(err);
                    }
                });
            };
            const createHistory = (requestUuid, com) => {
                const date = new Date();
                const history = {
                    uuid: [requestUuid],
                    filename: `${youtubeStreamingData['videoDetails']['title']}.mp4`,
                    time_stamp: date,
                    last_viewed: date,
                    path: "",
                    url: `https://www.youtube.com/watch?v=${youtubeStreamingData['videoDetails']['videoId']}`,
                    domain: "https://www.youtube.com",
                    tag: ['youtube', extension, 'video'],
                    color: null,
                    size: com.totalLength ? com.totalLength : null,
                    mimeType: format['mimeType'],
                    youtubeId,
                    duration
                };
                _view.storageHelper.saveHistory(history, (err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                });
            };
            let history = false;
            this.download = new DownloadQueue(url, 'video', (err, data) => {
                if (err) {
                    return console.log(err);
                }
                if (data) {
                    console.log(data);
                    if (!this.mediaSource) {
                        this.setupMediaSource([format['mimeType']], () => {
                            this.mediaSource.duration = parseInt(duration.toString());
                            this.sourceBuffers['video'].appendBuffer(Buffer.from(data));
                        });
                        return;
                    }
                    this.sourceBuffers['video'].appendBuffer(Buffer.from(data));
                }
            }, (requestUuid, com, data) => {
                console.log(com, Buffer.from(data).toString());
                downloadedPieces.push(com.downloadUuid);
                if (!history) {
                    createHistory(requestUuid, com);
                    history = true;
                }
                _view.storageHelper.save(com.downloadUuid, data, (err, data) => {
                    if (data) {
                        createUpdateIndex(requestUuid, com);
                    }
                });
                // console.log(requestUuid, downloadUuid, data, eof)
            });
        };
        this.removeBuffers = (start, end, sourceBuffer, callback) => {
            console.log("called remove buffer");
            if (sourceBuffer.updating) {
                return setTimeout(() => {
                    this.removeBuffers(start, end, sourceBuffer, callback);
                }, 250);
            }
            sourceBuffer.remove(start, end);
            callback();
        };
        this.appendNext = (pieces, callback) => {
            console.log(this.sourceBuffers['video'].buffered);
            console.log(this.customPlayer.player['currentTime']);
            console.log(pieces);
            _view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
                if (err) {
                    return console.log(err);
                }
                if (data) {
                    this.sourceBuffers['video'].appendBuffer(Buffer.from(data));
                    callback();
                }
                if (!pieces.length) {
                    this.endOfStream();
                }
            });
        };
        this.formatTime = (seconds) => {
            let date = new Date(null);
            let s = parseInt(seconds.toString(), 10);
            date.setSeconds(s);
            let time = date.toISOString().substr(11, 8).split(":");
            if (time[0] === '00') {
                return [time[1], time[2]].join(":");
            }
            else {
                return time.join(":");
            }
        };
        this.timeUpdateEvent = e => {
            try {
                this.buffered = e.target['buffered'].end(0);
                const currentTime = this.customPlayer.player['currentTime'];
                if (this.customPlayer['durationText']) {
                    this.customPlayer.durationText.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(this.mediaSource.duration)}`;
                }
                if (this.customPlayer['currentTimeBar']) {
                    this.customPlayer.currentTimeBar.style.width = `${(currentTime / this.mediaSource.duration) * 100}%`;
                }
                const percent = Math.floor((currentTime / this.buffered) * 100);
                if (percent > 80) {
                    if (this.pieces.length) {
                        this.appendNext(this.pieces, () => {
                        });
                    }
                }
            }
            catch (e) {
                return;
            }
        };
        this.progressUpdateEvent = e => {
            try {
                const buffered = e.target['buffered'].end(0);
                this.customPlayer.bufferBar.style.width = `${(buffered / this.mediaSource.duration) * 100}%`;
            }
            catch (e) {
                return;
            }
        };
        this.setupPlayer = () => {
            this.customPlayer.player.addEventListener("timeupdate", this.timeUpdateEvent);
            this.customPlayer.player.addEventListener("progress", this.progressUpdateEvent);
            this.customPlayer?.fullBar.addEventListener("click", e => {
                console.log(e);
                const x = e?.['layerX'];
                console.log(x);
                const full = this.customPlayer.fullBar.clientWidth;
                console.log(e.target);
                console.log(full);
                const percent = (x / full);
                console.log(percent);
                const time = percent * this.mediaSource.duration;
                if (time > this.buffered) {
                    return;
                }
                this.customPlayer.player['currentTime'] = percent * this.mediaSource.duration;
                this.customPlayer.currentTimeBar.style.width = `${Math.round(percent * 100)}%`;
            });
            this.customPlayer?.playButton.addEventListener("click", _ => {
                this.videoPlaying = !this.videoPlaying;
                if (this.videoPlaying) {
                    this.customPlayer?.player['play']();
                }
                else {
                    this.customPlayer?.player['pause']();
                }
                this.callback(null, this.videoPlaying);
            });
            this.customPlayer?.stopButton.addEventListener("click", _ => {
                this.videoPlaying = false;
                this.customPlayer?.player['pause']();
                this.callback(null, this.videoPlaying);
            });
            this.customPlayer?.fullscreenButton.addEventListener("click", _ => {
                this.customPlayer?.player.requestFullscreen();
            });
        };
        this.localYoutube = (uuid, mimeType, duration, filesize, youtubeId) => {
            let removedOffset = 0;
            _view.storageHelper.getIndex(uuid, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                const index = JSON.parse(Buffer.from(data).toString());
                console.log(uuid, filesize, youtubeId, index);
                this.pieces = index['pieces'];
                if (!this.mediaSource) {
                    this.setupMediaSource([mimeType], () => {
                        this.mediaSource.duration = parseInt(duration.toString());
                        this.setupPlayer();
                        if (this.pieces.length) {
                            this.appendNext(this.pieces, () => {
                            });
                        }
                    });
                }
                // return _view.connectInformationMessage.sockEmit("requestStreamUrl", filesize, uuid => {
                // 	streamUuid = uuid
                // 	streamURL = `${window.location.href}streamUrl?uuid=${ uuid }`
                // 	this.player['src'] = streamURL
                // 	_view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
                // 		if (err) {
                // 			return console.log(err)
                // 		}
                // 		if (data) {
                // 			_view.connectInformationMessage.sockEmit ( uuid, Buffer.from(data).toString('base64'), () => {
                // 			})
                // 			appendNext(pieces)
                // 		}
                // 	})
                // 	// _view.connectInformationMessage.sockEmit ( uuid, _view.storageHelper.decryptLoad(pieces.shift), () => {
                // 	// })
                // })
            });
        };
        this.recording = (uuid) => {
            _view.storageHelper.createAssembler(uuid, (err, data) => {
                if (data) {
                    this.customPlayer.player['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType);
                    console.log(data);
                    this.customPlayer.player.addEventListener('canplay', e => {
                        this.customPlayer.player["play"]();
                    });
                }
            });
            return;
        };
        // downloaded = (uuid: string) => {
        // 	this.mediaLoading(true)
        // 	const beginFileRetrieval = () => {
        // 		let fileStart = 0
        // 		let pieces = null
        // 		const appendSourceBuffer = (uuid: string) => {
        // 			_view.storageHelper.decryptLoad(uuid, (err, data) => {
        // 				console.log(err, data)
        // 				if (err) {
        // 					return console.log("Error grabbing video data!")
        // 				}
        // 				if (data) {
        // 					if (this.type === 'webm') {
        // 						this.videoSourceBuffer.appendBuffer(data)
        // 					} else {
        // 						data['fileStart'] = fileStart
        // 						this.MP4BoxFile.appendBuffer(data)
        // 						if (!pieces.length) {
        // 							this.MP4BoxFile.flush()
        // 						}
        // 					}
        // 					fileStart += data.byteLength
        // 					if (pieces.length) {
        // 						appendSourceBuffer(pieces.shift())
        // 					}
        // 				}
        // 			})
        // 		}
        // 		_view.storageHelper.getIndex(uuid, (err, data) => {
        // 			let index = JSON.parse(Buffer.from(data).toString())
        // 			pieces = index.pieces
        // 			appendSourceBuffer(pieces.shift())
        // 		})
        // 	}
        // 	const webmSourceOpen = () => {
        // 		const mimeType = 'video/webm; codecs="vp9, opus"'
        // 		this.videoSourceBuffer = this.mediaSource.addSourceBuffer(mimeType)
        // 		beginFileRetrieval()
        // 	}
        // 	const setupMediaSource = () => {
        // 		this.mediaSource = new MediaSource()
        // 		this.player['src'] = URL.createObjectURL(this.mediaSource)
        // 		this.player.addEventListener('canplay', e => {
        // 			this.mediaLoading(false)
        // 		})
        // 		this.mediaSource.addEventListener("sourceopen", () => {
        // 			if (this.type === 'webm') {
        // 				webmSourceOpen()
        // 				return
        // 			}
        // 			//createMP4Box()
        // 		})
        // 	}
        // 	setupMediaSource()
        // }
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
        this.terminate = () => {
            this.customPlayer.player.removeEventListener("timeupdate", this.timeUpdateEvent);
            this.customPlayer.player.removeEventListener("progress", this.progressUpdateEvent);
            this.customPlayer.player['pause']();
            URL.revokeObjectURL(this.customPlayer.player['src']);
            this.download?.stopDownload();
            this.mediaSource = null;
            this.sourceBuffers = {
                video: null,
                audio: null
            };
        };
        this.Log = (message) => {
            const u = new Date();
            return console.log(`[${u.toLocaleTimeString()}:${u.getMilliseconds()}] - ${message}`);
        };
        this.checkVideoHistory = (callback) => {
            let history = null;
            _view.storageHelper.decryptLoad('history', (err, data) => {
                if (data) {
                    history = JSON.parse(Buffer.from(data).toString());
                    for (let i = 0; i < history.length; i++) {
                        if (history[i].youtubeId === this.options['youtubeStreamingData']['youtubeId']) {
                            this.options.localYoutube = history[i];
                            return callback(true);
                        }
                    }
                    return callback(false, null);
                }
            });
        };
        this.streamYoutubeVideo = (local) => {
            if (!local) {
                const types = this.options['youtubeStreamingData']['streamingData']['adaptiveFormats'];
                const audioWebm = types.filter(n => /^audio\/webm; /i.test(n.mimeType));
                const videoWebm = types.filter(n => /^video\/webm; /i.test(n.mimeType));
                const audioMP4 = types.filter(n => /^audio\/mp4; /i.test(n.mimeType));
                const videoMP4 = types.filter(n => /^video\/mp4; /i.test(n.mimeType));
                const audio = audioWebm.pop();
                const video = videoWebm.filter(n => /720p60|720p|480p/.test(n.qualityLabel)).shift() || videoMP4.filter(n => /720p60|720p|480p/.test(n.qualityLabel)).shift();
                this.audioInit = audio.url;
                this.videoInit = video.url;
                this.audioCodec = audio['mimeType'].replace("+", ' ');
                this.videoCodec = video['mimeType'].replace("+", ' ');
            }
            else {
                this.audioCodec = 'audio/webm; codecs="opus"';
                this.videoCodec = 'video/webm; codecs="vp9"';
            }
            const initMediaSource = () => {
                if (!MediaSource.isTypeSupported(this.audioCodec) || !MediaSource.isTypeSupported(this.videoCodec)) {
                    this.callback('Unable to play codec', null);
                    return console.log("Unable to stream this codec!");
                }
                this.mediaSource = new MediaSource();
                if (this.options['customPlayer']) {
                    this.options['customPlayer'].addEventListener("error", e => {
                        // console.log(e)
                    });
                    this.options['customPlayer']['src'] = URL.createObjectURL(this.mediaSource);
                }
                else {
                    _view.displayMedia('player');
                    this.player = document.getElementById("videoPlayer");
                    this.player.addEventListener("error", e => {
                        // console.log(e)
                    });
                    this.player['src'] = URL.createObjectURL(this.mediaSource);
                }
                this.player.addEventListener("canplay", e => {
                    this.callback(null, true);
                    this.player['play']();
                });
                const sourceOpen = (_) => {
                    console.log(this.audioCodec, this.videoCodec);
                    this.audioSourceBuffer = this.mediaSource.addSourceBuffer(this.audioCodec);
                    this.videoSourceBuffer = this.mediaSource.addSourceBuffer(this.videoCodec);
                    let videoIndex = null;
                    let audioIndex = null;
                    let audioPieces = [];
                    let videoPieces = [];
                    let endOfFile = {
                        audio: false,
                        video: false
                    };
                    let videoRequestUUID = {
                        video: null,
                        audio: null,
                        createdHistory: false
                    };
                    const saveIndex = (requestUuid, extension, contentType, pieces) => {
                        const index = {
                            filename: this.options['youtubeStreamingData']['title'],
                            fileExtension: extension,
                            totalLength: null,
                            contentType: contentType,
                            pieces,
                            finished: false
                        };
                        console.log(index);
                        _view.storageHelper.createUpdateIndex(requestUuid, index, (err, data) => {
                            if (err) {
                                return;
                            }
                        });
                    };
                    const createHistory = () => {
                        if (!videoRequestUUID.createdHistory) {
                            if (videoRequestUUID['video'] && videoRequestUUID['audio']) {
                                _view.storageHelper.youtubeHistory([videoRequestUUID['video'], videoRequestUUID['audio']], this.options['youtubeStreamingData']['youtubeId'], this.options['youtubeStreamingData']['title'], ['youtube']);
                                videoRequestUUID['createdHistory'] = true;
                            }
                        }
                    };
                    const shouldEndStream = () => {
                        if (endOfFile['audio'] && endOfFile['video']) {
                            if (this.videoSourceBuffer.updating || this.audioSourceBuffer.updating) {
                                return setTimeout(() => {
                                    return shouldEndStream();
                                }, 1000);
                            }
                            this.mediaSource.endOfStream();
                            return;
                        }
                        return;
                    };
                    const playLocalYouTube = () => {
                        let audioPieces = [];
                        let videoPieces = [];
                        const appendNext = (type, pieces, sourceBuffer) => {
                            if (this.state === 'STOP') {
                                console.log("SHOULD STOP");
                                return;
                            }
                            if (pieces.length) {
                                return _view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
                                    if (data) {
                                        sourceBuffer.appendBuffer(data);
                                        if (pieces.length) {
                                            return setTimeout(() => {
                                                appendNext(type, pieces, sourceBuffer);
                                            }, 100);
                                        }
                                        endOfFile[type] = true;
                                        shouldEndStream();
                                    }
                                });
                            }
                            return;
                        };
                        _view.storageHelper.getIndex(this.options['localYoutube'].uuid[0], (err, data) => {
                            if (data) {
                                videoIndex = JSON.parse(Buffer.from(data).toString());
                                console.log(videoIndex);
                                videoPieces = videoIndex['pieces'];
                                appendNext('video', videoPieces, this.videoSourceBuffer);
                            }
                        });
                        _view.storageHelper.getIndex(this.options['localYoutube'].uuid[1], (err, data) => {
                            if (data) {
                                audioIndex = JSON.parse(Buffer.from(data).toString());
                                console.log(audioIndex);
                                audioPieces = audioIndex['pieces'];
                                appendNext('audio', audioPieces, this.audioSourceBuffer);
                            }
                        });
                    };
                    if (local) {
                        playLocalYouTube();
                    }
                    else {
                        this.checkVideoHistory((exist) => {
                            if (exist) {
                                return playLocalYouTube();
                            }
                            this.audioQueue = new DownloadQueue(this.audioInit, 'AUDIO', (err, data) => {
                                if (err) {
                                    this.callback(err);
                                    return console.log(`AUDIO stream stoped!`, err);
                                }
                                this.audioSourceBuffer.appendBuffer(Buffer.from(data).buffer);
                                shouldEndStream();
                            }, (requestUuid, downloadUuid, encryptedData, eof) => {
                                !videoRequestUUID['audio'] ? videoRequestUUID['audio'] = requestUuid : null;
                                endOfFile['audio'] = eof;
                                _view.storageHelper.save(downloadUuid, encryptedData, (err, data) => {
                                    if (err) {
                                        return;
                                    }
                                    audioPieces.push(downloadUuid);
                                    saveIndex(videoRequestUUID['audio'], this.audioCodec.split(" ")[0].split('/')[1].replace(";", ""), this.audioCodec.split(" ")[0].replace(";", ""), audioPieces);
                                    createHistory();
                                });
                            });
                            this.videoQueue = new DownloadQueue(this.videoInit, 'VIDEO', (err, data) => {
                                if (err) {
                                    this.callback(err);
                                    return console.log(`VIDEO stream stoped!`, err);
                                }
                                this.videoSourceBuffer.appendBuffer(Buffer.from(data).buffer);
                                shouldEndStream();
                            }, (requestUuid, downloadUuid, encryptedData, eof) => {
                                !videoRequestUUID['video'] ? videoRequestUUID['video'] = requestUuid : null;
                                endOfFile['video'] = eof;
                                _view.storageHelper.save(downloadUuid, encryptedData, (err, data) => {
                                    if (err) {
                                        return;
                                    }
                                    videoPieces.push(downloadUuid);
                                    saveIndex(videoRequestUUID['video'], this.videoCodec.split(" ")[0].split('/')[1].replace(";", ""), this.videoCodec.split(" ")[0].replace(";", ""), videoPieces);
                                    createHistory();
                                });
                            });
                        });
                    }
                };
                this.mediaSource.addEventListener("sourceopen", sourceOpen);
            };
            if (!this.mediaSource) {
                initMediaSource();
            }
        };
        this.streamDownloadedVideo = (recording) => {
            if (recording) {
                _view.storageHelper.createAssembler(this.options.uuid[0], (err, data) => {
                    if (data) {
                        console.log(data);
                        const blobURL = _view.storageHelper.createBlob(data.buffer, data.contentType);
                        _view.displayMedia('player');
                        this.player = document.getElementById("videoPlayer");
                        this.player['src'] = blobURL;
                        this.player.addEventListener('canplay', e => {
                            this.player["play"]();
                        });
                    }
                });
                return;
            }
            this.mediaLoading(true);
            const beginFileRetrieval = () => {
                let fileStart = 0;
                let pieces = null;
                const appendSourceBuffer = (uuid) => {
                    _view.storageHelper.decryptLoad(uuid, (err, data) => {
                        console.log(err, data);
                        if (err) {
                            return console.log("Error grabbing video data!");
                        }
                        if (data) {
                            if (this.type === 'webm') {
                                this.videoSourceBuffer.appendBuffer(data);
                            }
                            else {
                                data['fileStart'] = fileStart;
                                this.MP4BoxFile.appendBuffer(data);
                                if (!pieces.length) {
                                    this.MP4BoxFile.flush();
                                }
                            }
                            fileStart += data.byteLength;
                            if (pieces.length) {
                                appendSourceBuffer(pieces.shift());
                            }
                        }
                    });
                };
                _view.storageHelper.getIndex(this.options['uuid'][0], (err, data) => {
                    let index = JSON.parse(Buffer.from(data).toString());
                    pieces = index.pieces;
                    appendSourceBuffer(pieces.shift());
                });
            };
            const mp4box_onSegment = (id, buffer) => {
                console.log(id);
                var view = new Uint8Array(buffer);
                console.log(`ID: ${id} - Got ${buffer.byteLength} bytes. Values= ${view[0]} ${view[1]} ${view[2]} ${view[3]} ${view[4]}`);
                switch (id) {
                    case 1:
                        if (!this.videoSourceBuffer.updating) {
                            // console.log("Streaming started with", view[0], view[1], view[2], view[3], view[4]);
                            this.videoSourceBuffer.appendBuffer(buffer);
                            return;
                        }
                        break;
                    case 2:
                        if (!this.audioSourceBuffer.updating) {
                            // console.log("Streaming started with", view[0], view[1], view[2], view[3], view[4]);
                            this.audioSourceBuffer.appendBuffer(buffer);
                            return;
                        }
                        break;
                }
            };
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
                const mimeType = 'video/webm; codecs="vp9, opus"';
                this.videoSourceBuffer = this.mediaSource.addSourceBuffer(mimeType);
                beginFileRetrieval();
            };
            const setupMediaSource = () => {
                this.mediaSource = new MediaSource();
                _view.displayMedia('player');
                this.player = document.getElementById("videoPlayer");
                this.player['src'] = URL.createObjectURL(this.mediaSource);
                this.player.addEventListener('canplay', e => {
                    this.mediaLoading(false);
                });
                this.mediaSource.addEventListener("sourceopen", () => {
                    if (this.type === 'webm') {
                        webmSourceOpen();
                        return;
                    }
                    //createMP4Box()
                });
            };
            setupMediaSource();
        };
        if (customPlayer.player) {
            this.customPlayer.player.addEventListener('canplay', _ => {
                callback(null, true);
                this.videoPlaying = true;
            });
            this.customPlayer.player.addEventListener("pause", _ => {
                this.videoPlaying = false;
                callback(null, this.videoPlaying);
            });
            this.customPlayer.player.addEventListener('ended', _ => {
                this.videoPlaying = false;
                callback(null, this.videoPlaying);
            });
        }
    }
}
