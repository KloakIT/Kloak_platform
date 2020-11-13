class VideoPlayer {
    constructor(customCss, callback, exit) {
        this.customCss = customCss;
        this.callback = callback;
        this.exit = exit;
        this.mediaSource = null;
        this.downloadQueue = null;
        this.isPlaying = ko.observable(false);
        this.canPlay = ko.observable(false);
        this.skipAdvertisements = ko.observable(false);
        this.adPlaying = ko.observable(false);
        this.loading = ko.observable(false);
        this.playbackSpeed = ko.observable(1);
        this.needBufferEvent = new Event("needBuffer");
        this.sourceBuffers = {
            video: null,
            audio: null
        };
        this.playerElements = {};
        this.terminate = () => {
            this.playerElements['kloakVideo'].removeEventListener("timeupdate", this.timeUpdateEvent);
            this.playerElements['kloakVideo'].removeEventListener("progress", this.progressUpdateEvent);
            this.playerElements['kloakVideo']['pause']();
            if (this.playerElements['kloakVideo']['poster']) {
                URL.revokeObjectURL(this.playerElements['kloakVideo']['poster']);
            }
            URL.revokeObjectURL(this.playerElements['kloakVideo']['src']);
            this.playerElements['kloakVideo']['src'] = "";
            this.downloadQueue?.stopDownload();
            this.mediaSource = null;
            this.sourceBuffers = {
                video: null,
                audio: null
            };
        };
        this.playAds = (action) => {
            if (this.playerElements['kloakAdPlayer']) {
                switch (action) {
                    case 'play':
                        this.adPlaying(true);
                        const ads = ['coronavirus-ad.mp4', 'ipad-ad.mp4', 'nike-ad.mp4'];
                        this.playerElements['kloakAdPlayer']['src'] = `./videos/ads/${ads[Math.floor(Math.random() * 3)]}`;
                        this.playerElements['kloakAdPlayer']['play']();
                        break;
                    case 'stop':
                        try {
                            this.adPlaying(false);
                            this.playerElements['kloakAdPlayer']['pause']();
                            this.playerElements['kloakAdPlayer']['src'] = "";
                        }
                        catch (e) {
                            return;
                        }
                }
            }
        };
        this.retrievePlayerElements = (callback) => {
            this.playerElements = {
                kloakAdPlayer: document.getElementById("kloakAdPlayer"),
                kloakVideo: document.getElementById("kloakVideo"),
                kloakVideoSeekBar: document.getElementById("kloakVideoSeekBar"),
                kloakSeekBar: document.getElementById("kloakVideoSeekBar"),
                kloakBufferedBar: document.getElementById("kloakBufferedBar"),
                kloakCurrentTimeBar: document.getElementById("kloakCurrentTimeBar"),
                kloakDurationText: document.getElementById("kloakVideoDuration"),
                kloakVideoSpeed: document.getElementById("kloakVideoSpeed"),
                kloakPlayButton: document.getElementById("kloakVideoPlay"),
                kloakStopButton: document.getElementById("kloakVideoStop"),
                kloakFastForwardButton: document.getElementById("kloakFastForward"),
                kloakExpandButton: document.getElementById("kloakVideoExpand")
            };
            this.playerElements['kloakVideo'].addEventListener('canplay', () => {
                this.canPlay(true);
            });
            let playerElements = Object.values(this.playerElements);
            for (let i = 0; i < Object.values(this.playerElements).length; i++) {
                if (!playerElements[i]) {
                    this.callback(new Error("Player elements not present!"));
                    return;
                }
            }
            callback();
        };
        this.sourceOpen = (mimeType, callback) => {
            // console.log(MediaSource.isTypeSupported(mimeType.video))
            console.log("JUST SOURCE OPENED MEDIA SOURCE");
            const types = Object.keys(mimeType);
            types.map(type => {
                console.log(type);
                if (mimeType[type]) {
                    console.log('has type', mimeType[type]);
                    this.sourceBuffers[type] = this.mediaSource.addSourceBuffer(mimeType[type]);
                    // this.sourceBuffers[type].mode = 'sequence'
                }
            });
            callback();
        };
        this.setupMediaSource = (mimeType, callback) => {
            console.log("setting up media source!");
            if (!MediaSource) {
                return console.log("Your browser does not support MediaSource!");
            }
            this.mediaSource = new MediaSource();
            this.playerElements.kloakVideo['src'] = URL.createObjectURL(this.mediaSource);
            this.mediaSource.addEventListener("sourceopen", () => {
                this.sourceOpen(mimeType, () => {
                    callback();
                });
            });
        };
        this.timeUpdateEvent = e => {
            const formatTime = (seconds) => {
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
            try {
                const buffered = e.target['buffered'].end(0);
                const currentTime = this.playerElements.kloakVideo['currentTime'];
                this.playerElements.kloakDurationText.textContent = `${formatTime(currentTime)} / ${formatTime(this.mediaSource.duration)}`;
                this.playerElements.kloakCurrentTimeBar.style.width = `${(currentTime / this.mediaSource.duration) * 100}%`;
                // const percent = Math.floor((currentTime/buffered) * 100)
                if (this.mediaSource.duration <= 180) {
                    return this.playerElements['kloakVideo'].dispatchEvent(this.needBufferEvent);
                }
                if ((buffered - currentTime) <= 60) {
                    if (!this.sourceBuffers['video'].updating || !this.sourceBuffers['audio'].updating) {
                        return this.playerElements['kloakVideo'].dispatchEvent(this.needBufferEvent);
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
                this.playerElements.kloakBufferedBar.style.width = `${Math.round((buffered / this.mediaSource.duration) * 100)}%`;
            }
            catch (e) {
                return;
            }
        };
        this.endOfStream = () => {
            if (this.sourceBuffers['video']?.updating || this.sourceBuffers['audio']?.updating) {
                return setTimeout(() => {
                    this.endOfStream();
                }, 250);
            }
            this.mediaSource.endOfStream();
        };
        this.defaultSeekBarEvent = (e) => {
            const x = e?.['layerX'];
            const full = this.playerElements['kloakSeekBar'].clientWidth;
            const percent = (x / full);
            this.playerElements.kloakVideo['currentTime'] = percent * this.mediaSource.duration;
            this.playerElements['kloakCurrentTimeBar'].style.width = `${Math.round(percent * 100)}%`;
        };
        this.setupPlayer = (callback) => {
            // console.log(this.playerElements.kloakVideo['buffered'])
            this.playerElements.kloakVideo.addEventListener("timeupdate", this.timeUpdateEvent);
            this.playerElements?.kloakSeekBar.addEventListener("click", this.defaultSeekBarEvent);
            this.playerElements.kloakVideo.addEventListener("progress", this.progressUpdateEvent);
            this.playerElements['kloakVideo'].addEventListener('ended', _ => {
                this.isPlaying(false);
            });
            this.playerElements['kloakFastForwardButton'].addEventListener("click", _ => {
                if (this.playbackSpeed() === 2) {
                    return this.playbackSpeed(1);
                }
                return this.playbackSpeed(this.playbackSpeed() + 0.5);
            });
            this.playerElements?.kloakPlayButton.addEventListener("click", _ => {
                this.isPlaying(!this.isPlaying());
            });
            this.playerElements?.kloakStopButton.addEventListener("click", _ => {
                this.isPlaying(false);
            });
            this.playerElements?.kloakExpandButton.addEventListener("click", _ => {
                this.playerElements?.kloakVideo.requestFullscreen();
            });
            callback ? callback() : null;
        };
        this.skipAd = () => {
            this.skipAdvertisements(true);
            this.playAds('stop');
            this.isPlaying(true);
        };
        this.getVideoIndex = (uuid, callback) => {
            _view.storageHelper.decryptLoad(uuid, (err, data) => {
                if (err) {
                    return;
                }
                callback(JSON.parse(Buffer.from(data).toString()));
            });
        };
        this.checkFileExistence = (youtubeId, callback) => {
            _view.storageHelper.getFileHistory((err, data) => {
                if (err) {
                    return err;
                }
                for (let i = 0; i < data.length; i++) {
                    if (data[i]['youtube']['id'] === youtubeId) {
                        return callback(data[i].uuid);
                    }
                }
                return callback(null);
            });
        };
        // streamingData object from ytplayer.config.args
        this.youtubePlayer = (streamingData, watchUrl) => {
            let youtubeId = null;
            let format = {};
            let duration = null;
            let extension = null;
            let url = null;
            let offset = 0;
            this.retrievePlayerElements(() => {
                this.loading(false);
                if (!this.adPlaying()) {
                    this.playAds("play");
                }
                if (!watchUrl) {
                    youtubeId = streamingData['videoDetails']['videoId'];
                    format = streamingData['formats'].filter(format => format.itag === 22 || format.itag === 18).pop();
                    console.log(format);
                    duration = streamingData['duration'] || parseInt(format['approxDurationMs'].toString()) / 1000 || null;
                    extension = format['mimeType'].split(" ")[0].replace(";", "").split("/")[1];
                    url = format['url'];
                }
                if (watchUrl) {
                    youtubeId = watchUrl.replace("https://www.youtube.com/watch?v=", "");
                }
                let downloadedPieces = {};
                let downloadUuidQueue = [];
                let history = false;
                let endOfFile = false;
                this.playerElements['kloakVideo'].addEventListener("needBuffer", () => {
                    console.log("NEED BUFFER");
                    if (downloadUuidQueue.length) {
                        _view.storageHelper.decryptLoad(downloadUuidQueue.shift(), (err, data) => {
                            if (err)
                                return;
                            if (data) {
                                this.sourceBuffers['video'].appendBuffer(Buffer.from(data));
                            }
                        });
                    }
                    // appendNext(timestamps, index.pieces, this.sourceBuffers['video'])
                });
                const beginDownloadQueue = (url, range, callback) => {
                    console.log(URL, range);
                    this.downloadQueue = new DownloadQueue(url, 'video', (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        if (data) {
                            if (!this.canPlay()) {
                                console.log("SHOULD APPEND");
                                this.sourceBuffers['video'].appendBuffer(Buffer.from(data));
                                // this.appendNext([downloadUuidQueue.shift()], this.sourceBuffers['video'])
                            }
                        }
                    }, (requestUuid, com, data) => {
                        let time = null;
                        console.log(com);
                        if (this.playerElements.kloakVideo['buffered'].length > 0) {
                            time = this.playerElements.kloakVideo['buffered'].end(0);
                            console.log(time);
                        }
                        time = time ? time : 0;
                        downloadedPieces[offset] = com.downloadUuid;
                        offset = com['currentStartOffset'] + com['currentlength'];
                        // downloadedPieces[time] = com.downloadUuid
                        if (!history) {
                            if (!duration) {
                                duration = this.hmsToSecondsOnly(com['duration']);
                            }
                            this.mediaSource.duration = parseInt(duration.toString());
                            createHistory(requestUuid, com, format['bitrate']);
                            history = true;
                        }
                        if (this.playerElements.kloakVideo['buffered'].length > 0) {
                            console.log(this.playerElements.kloakVideo['buffered'].end(0));
                        }
                        _view.storageHelper.save(com.downloadUuid, data, (err, data) => {
                            if (data) {
                                // if (range) {
                                // 	callback(com, data)
                                // } else {
                                createUpdateIndex(requestUuid, com, () => {
                                    if (this.canPlay()) {
                                        downloadUuidQueue.push(com.downloadUuid);
                                    }
                                    // if (!this.canPlay() && !this.sourceBuffers['video'].updating) {
                                    // 	this.appendNext([downloadUuidQueue.shift()], this.sourceBuffers['video'])
                                    // }
                                });
                                // }
                            }
                        });
                        if (com.eof) {
                            endOfFile = true;
                        }
                    });
                };
                this.setupMediaSource({ video: format['mimeType'] || 'video/mp4; codecs="avc1.64001F, mp4a.40.2"' }, () => {
                    this.setupPlayer();
                    // this.checkFileExistence(youtubeId, (uuid) => {
                    // 	let index = null
                    // 	if (uuid) {
                    // 		this.getVideoIndex(uuid[0], (data) => {
                    // 			index = data
                    // 			downloadedPieces = index.pieces
                    // 			downloadUuidQueue = Object.values(downloadedPieces)
                    // 			this.appendNext(downloadUuidQueue, this.sourceBuffers['video'])
                    // 			// if (!index.finished) {
                    // 			// 	beginDownloadQueue(`https://www.youtube.com/watch?v=${youtubeId}`, `bytes=${Object.keys(downloadedPieces)[downloadUuidQueue.length - 1]}-${index.totalLength}`)
                    // 			// }
                    // 		})
                    // 	} else {
                    beginDownloadQueue(url, null);
                    // 	}
                    // })
                });
                const createUpdateIndex = (requestUuid, com, done) => {
                    const index = {
                        filename: com.downloadFilename,
                        fileExtension: extension,
                        totalLength: com.totalLength ? com.totalLength : null,
                        contentType: com.contentType,
                        pieces: downloadedPieces,
                        finished: com.eof
                    };
                    _view.storageHelper.createUpdateIndex(requestUuid, index, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        done();
                    });
                };
                const createHistory = (requestUuid, com, bitrate) => {
                    const date = new Date();
                    const history = {
                        uuid: [requestUuid],
                        filename: streamingData ? `${streamingData['videoDetails']['title']}.mp4` : watchUrl,
                        time_stamp: date,
                        last_viewed: date,
                        path: "",
                        url: streamingData ? `https://www.youtube.com/watch?v=${streamingData['videoDetails']['videoId']}` : "",
                        domain: "https://www.youtube.com",
                        tag: ['youtube', extension, 'video'],
                        color: null,
                        size: com.totalLength ? com.totalLength : null,
                        youtube: {
                            id: youtubeId || "",
                            mimeType: {
                                video: format['mimeType'] || `video/mp4; codecs="avc1.64001F, mp4a.40.2"`,
                            },
                            bitrate,
                            duration
                        }
                    };
                    _view.storageHelper.saveHistory(history, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                };
            });
        };
        // Youtube stream with URL
        // youtubeStream = (url: string) => {
        // 	let downloadedPieces = []
        // 	let downloadUuidQueue = []
        // 	const cmd = {
        // 		command: 'CoSearch',
        // 		Args: [ url ],
        // 		error: null,
        // 		subCom: 'youtube_getVideoMp4',
        // 		requestSerial: uuid_generate()
        // 	}
        // 	this.retrievePlayerElements(() => {
        // 		this.loading(false)
        // 		if (!this.adPlaying()) {
        // 			this.playAds("play")
        // 		}
        // 	})
        // 	this.playerElements['kloakVideo'].addEventListener("needBuffer", () => {
        // 		console.log("NEED BUFFER")
        // 		if (downloadUuidQueue.length) {
        // 			_view.storageHelper.decryptLoad(downloadUuidQueue.shift(), (err, data) => {
        // 				if (err) return
        // 					if (data) {
        // 						this.sourceBuffers['video'].appendBuffer(Buffer.from(data))
        // 					}
        // 			})
        // 		}
        // 		// appendNext(timestamps, index.pieces, this.sourceBuffers['video'])
        // 	})
        // }
        this.appendNext = (pieces, sourceBuffer) => {
            if (!pieces.length) {
                this.endOfStream();
            }
            if (sourceBuffer) {
                if (pieces.length) {
                    _view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
                        if (err) {
                            return;
                        }
                        if (data) {
                            try {
                                sourceBuffer.appendBuffer(Buffer.from(data));
                            }
                            catch (e) {
                                console.log(e);
                            }
                            if (this.mediaSource.duration < 180) {
                                this.appendNext(pieces, sourceBuffer);
                            }
                        }
                    });
                }
            }
        };
        this.downloadedYoutube = (fileHistory) => {
            // Testing shuffle
            const shuffle = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
                    // swap elements array[i] and array[j]
                    // we use "destructuring assignment" syntax to achieve that
                    // you'll find more details about that syntax in later chapters
                    // same can be written as:
                    // let t = array[i]; array[i] = array[j]; array[j] = t
                    [array[i], array[j]] = [array[j], array[i]];
                }
            };
            this.retrievePlayerElements(() => {
                this.skipAdvertisements(true);
                this.loading(false);
                let index = null;
                let pieces = [];
                let timestamps = [];
                let currentFetchTimestamps = [];
                let tags = ko.isObservable(fileHistory.tag) ? fileHistory.tag() : fileHistory.tag;
                const appendNext = (pieces, sourceBuffer, from) => {
                    if (sourceBuffer) {
                        // if (from) {
                        // 	const n = pieces.slice(from - 1)
                        // 	console.log(n)
                        // 	return
                        // }
                        // if (from) {
                        // 	for(let i = timestamps.length; i >= 0; i++) {
                        // 		if (timestamps[i] > from) {
                        // 			continue
                        // 		} else {
                        // 			currentFetchTimestamps = timestamps.slice(i)
                        // 			return
                        // 		}
                        // 	}
                        // }
                        if (pieces.length) {
                            _view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
                                if (err) {
                                    return;
                                }
                                if (data) {
                                    console.log(Buffer.from(data));
                                    sourceBuffer.appendBuffer(Buffer.from(data));
                                    if (this.mediaSource.duration < 180) {
                                        appendNext(pieces, sourceBuffer);
                                    }
                                }
                            });
                        }
                        else {
                            this.endOfStream();
                        }
                    }
                };
                this.playerElements['kloakVideo'].addEventListener("needBuffer", () => {
                    if (this.mediaSource.readyState === 'ended' || this.mediaSource.duration < 180) {
                        return;
                    }
                    appendNext(pieces, this.sourceBuffers['video']);
                });
                this.playerElements['kloakSeekBar'].addEventListener("click", (e) => {
                    const x = e?.['layerX'];
                    const full = this.playerElements['kloakSeekBar'].clientWidth;
                    const percent = (x / full);
                    const currentTime = percent * this.mediaSource.duration;
                    this.playerElements['kloakVideo']['currentTime'] = currentTime;
                    const n = pieces.slice((((currentTime * fileHistory['youtube']['bitrate']) / 8) / 1048576) - 1);
                    appendNext(n, this.sourceBuffers['video']);
                    // this.sourceBuffers['video'].abort()
                    // console.log(index.pieces)
                    // FIX HEREEEEE
                    // appendNext()
                    // this.sourceBuffers['video'].abort()
                    // this.playerElements.kloakVideo['currentTime'] = percent * this.mediaSource.duration
                });
                switch (true) {
                    case ['youtube', 'mp4'].every(val => tags.includes(val)):
                        _view.storageHelper.getIndex(fileHistory.uuid[0], (err, data) => {
                            if (err) {
                                return;
                            }
                            if (data) {
                                index = JSON.parse(Buffer.from(data).toString());
                                this.setupMediaSource(fileHistory['youtube'].mimeType, () => {
                                    this.mediaSource.duration = fileHistory['youtube'].duration;
                                    this.setupPlayer();
                                    this.isPlaying(true);
                                    pieces = Object.values(index.pieces);
                                    // let temp = timestamps.splice(0,3)
                                    // let n = timestamps.splice(3)
                                    // shuffle(n)
                                    // timestamps = [...temp, ...n]
                                    appendNext(Object.values(pieces), this.sourceBuffers['video']);
                                });
                            }
                        });
                        break;
                    case ['youtube', 'audio'].every(val => tags.includes(val)):
                    case ['youtube', 'webm'].every(val => tags.includes(val)):
                        if (fileHistory.uuid.length > 1) {
                            console.log(fileHistory);
                            let videoIndex = null;
                            let audioIndex = null;
                            const getIndex = (uuid, callback) => {
                                if (uuid) {
                                    _view.storageHelper.getIndex(uuid, (err, data) => {
                                        if (err) {
                                            return;
                                        }
                                        if (data) {
                                            callback(JSON.parse(Buffer.from(data).toString()));
                                        }
                                    });
                                }
                                else {
                                    callback();
                                }
                            };
                            getIndex(fileHistory.uuid[0], (index) => {
                                if (index) {
                                    videoIndex = index;
                                }
                                getIndex(fileHistory.uuid[1], (index) => {
                                    audioIndex = index;
                                    this.setupMediaSource(fileHistory['youtube'].mimeType, () => {
                                        this.mediaSource.duration = fileHistory['youtube'].duration;
                                        this.setupPlayer();
                                        this.playerElements['kloakVideo']['poster'] = _view.storageHelper.dataURItoBlob(fileHistory['youtube']['thumbnail']['data'], fileHistory['youtube']['thumbnail']['mime']);
                                        this.isPlaying(true);
                                        if (videoIndex) {
                                            appendNext(videoIndex['pieces'], this.sourceBuffers['video']);
                                        }
                                        if (audioIndex) {
                                            appendNext(audioIndex['pieces'], this.sourceBuffers['audio']);
                                        }
                                    });
                                });
                            });
                            return;
                        }
                        break;
                }
            });
        };
        this.uploadedVideo = (fileHistory) => {
            this.retrievePlayerElements(() => {
                this.playerElements['kloakVideo'].addEventListener("needBuffer", () => {
                    this.appendNext(index.pieces, this.sourceBuffers['video']);
                });
                this.skipAdvertisements(true);
                let index = null;
                this.loading(false);
                this.playerElements['kloakSeekBar'].addEventListener("click", (e) => {
                    const x = e?.['layerX'];
                    const full = this.playerElements['kloakSeekBar'].clientWidth;
                    const percent = (x / full);
                    const currentTime = percent * this.mediaSource.duration;
                    this.playerElements['kloakVideo']['currentTime'] = currentTime;
                    this.sourceBuffers['video'].abort();
                    console.log(index.pieces);
                    // FIX HEREEEEE
                    // appendNext()
                    // this.sourceBuffers['video'].abort()
                    // this.playerElements.kloakVideo['currentTime'] = percent * this.mediaSource.duration
                });
                _view.storageHelper.getIndex(fileHistory.uuid[0], (err, data) => {
                    if (err) {
                        return;
                    }
                    if (data) {
                        index = JSON.parse(Buffer.from(data).toString());
                        this.setupMediaSource({ video: fileHistory['videoData'].mimeType, audio: null }, () => {
                            this.mediaSource.duration = fileHistory['videoData'].duration;
                            this.setupPlayer();
                            this.isPlaying(true);
                            this.appendNext(index.pieces, this.sourceBuffers['video']);
                        });
                    }
                });
            });
        };
        this.recording = (fileHistory) => {
            console.log(fileHistory);
            _view.storageHelper.createAssembler(fileHistory.uuid[0], (err, data) => {
                if (err) {
                    return;
                }
                if (data) {
                    this.retrievePlayerElements(() => {
                        this.skipAdvertisements(true);
                        this.loading(false);
                        this.setupPlayer(() => {
                            const _self = this;
                            this.playerElements['kloakVideo']['preload'] = "metadata";
                            this.playerElements['kloakVideo']['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType);
                            this.playerElements['kloakVideo'].onloadedmetadata = function () {
                                _self.isPlaying(true);
                            };
                        });
                    });
                }
            });
        };
        this.isPlaying.subscribe(playing => {
            playing ? this.playerElements?.kloakVideo['play']() : this.playerElements?.kloakVideo['pause']();
        });
        this.playbackSpeed.subscribe(speed => {
            this.playerElements['kloakVideo']['playbackRate'] = speed;
            this.playerElements['kloakVideoSpeed'].textContent = `${speed}x`;
            // switch (speed) {
            // 	case 1:
            // 		this.playerElements['kloakVideo']['playbackRate'] = speed
            // 		this.playerElements['kloakVideoSpeed'].textContent = `${speed}x`
            // 		break;
            // 	case 2:
            // 		this.playerElements['kloakVideo']['playbackRate'] = speed
            // 		this.playerElements['kloakVideoSpeed'].textContent = `${speed}x`
            // 		break;
            // 	}
        });
        this.loading(true);
    }
    hmsToSecondsOnly(hms) {
        if (typeof hms !== 'string') {
            return hms;
        }
        const str = hms.split(".")[0];
        let p = str.split(':');
        let s = 0;
        let m = 1;
        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }
        return s;
    }
}
