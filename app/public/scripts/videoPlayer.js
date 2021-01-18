class VideoPlayer {
    constructor(customCss, callback, exit) {
        this.customCss = customCss;
        this.callback = callback;
        this.exit = exit;
        this.mediaSource = null;
        this.downloadQueue = null;
        this.currentPlaylist = {
            uuid: "",
            playlistName: "",
            playlist: ko.observableArray([]),
            current: ko.observable(0),
            next: ko.observable(1),
            mode: ko.observable("normal"),
            lastShuffle: null
        };
        this.isPlaying = ko.observable(false);
        this.canPlay = ko.observable(false);
        this.canSkip = ko.observable(false);
        this.skipAdvertisements = ko.observable(false);
        this.adPlaying = ko.observable(false);
        this.loading = ko.observable(true);
        this.playbackSpeed = ko.observable(1);
        this.needBufferEvent = new Event("needBuffer");
        this.sourceBuffers = {
            video: null,
            audio: null
        };
        this.playerElements = {};
        this.playlistPlayerElements = {
            audio: null,
            playBtn: null,
            prevBtn: null,
            nextBtn: null,
            textDisplay: null,
            progressBar: null,
            progressCompleteBar: null
        };
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
        this.setupMediaSource = (mimeType, target, callback) => {
            console.log("setting up media source!");
            if (!MediaSource) {
                return console.log("Your browser does not support MediaSource!");
            }
            this.mediaSource = new MediaSource();
            target['src'] = URL.createObjectURL(this.mediaSource);
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
            if (this.mediaSource.readyState === 'open') {
                if (this.sourceBuffers['video']?.updating || this.sourceBuffers['audio']?.updating) {
                    return setTimeout(() => {
                        this.endOfStream();
                    }, 250);
                }
                this.mediaSource.endOfStream();
            }
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
            _view.storageHelper.getDecryptLoad(uuid, (err, data) => {
                if (err) {
                    return;
                }
                callback(JSON.parse(Buffer.from(data).toString()));
            });
        };
        // streamingData object from ytplayer.config.args
        this.youtubePlayer = (streamingData, watchUrl) => {
            let youtubeId = null;
            let format = {};
            let duration = null;
            let extension = null;
            let thumbnail = {
                data: null,
                mime: null
            };
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
                    // console.log(streamingData, format['approxDurationMs'])
                    duration = streamingData['duration'] || parseInt(format['approxDurationMs'].toString()) / 1000 || null;
                    extension = format['mimeType'].split(" ")[0].replace(";", "").split("/")[1];
                    url = format['url'];
                    const n = streamingData['thumbnails'][streamingData['thumbnails'].length - 1]['url'].split(';');
                    const mime = n[0].replace('data:', '');
                    const base64 = n[1].replace('base64,', '');
                    thumbnail['data'] = base64;
                    thumbnail['mime'] = mime;
                }
                if (watchUrl) {
                    url = watchUrl;
                    youtubeId = watchUrl.replace("https://www.youtube.com/watch?v=", "");
                }
                let downloadedPieces = {};
                let downloadUuidQueue = [];
                let history = false;
                let endOfFile = false;
                this.playerElements['kloakVideo'].addEventListener("needBuffer", () => {
                    console.log("NEED BUFFER");
                    if (downloadUuidQueue.length) {
                        _view.storageHelper.getDecryptLoad(downloadUuidQueue.shift(), (err, data) => {
                            if (err)
                                return;
                            if (data) {
                                this.sourceBuffers['video'].appendBuffer(Buffer.from(data));
                            }
                        });
                    }
                });
                const beginDownloadQueue = (url, range, callback) => {
                    console.log(url, range);
                    this.downloadQueue = new DownloadQueue(url, 'video', true, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        if (data) {
                            if (!this.canPlay()) {
                                console.log("SHOULD APPEND");
                                this.sourceBuffers['video'].appendBuffer(Buffer.from(data));
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
                        if (!history) {
                            if (!duration) {
                                duration = this.hmsToSecondsOnly(com['duration']);
                            }
                            console.log(duration);
                            if (!isNaN(duration.toString())) {
                                this.mediaSource.duration = parseInt(duration.toString());
                            }
                            createHistory(requestUuid, com, format['bitrate']);
                            history = true;
                        }
                        if (this.playerElements.kloakVideo['buffered'].length > 0) {
                            console.log(this.playerElements.kloakVideo['buffered'].end(0));
                        }
                        _view.storageHelper.save(com.downloadUuid, data, (err, data) => {
                            if (data) {
                                createUpdateIndex(requestUuid, com, () => {
                                    if (this.canPlay()) {
                                        downloadUuidQueue.push(com.downloadUuid);
                                    }
                                });
                            }
                        });
                        if (com.eof) {
                            endOfFile = true;
                        }
                    });
                };
                this.setupMediaSource({ video: format['mimeType'] || 'video/mp4; codecs="avc1.64001F, mp4a.40.2"' }, this.playerElements.kloakVideo, () => {
                    this.setupPlayer();
                    beginDownloadQueue(url, null);
                });
                const createUpdateIndex = (requestUuid, com, done) => {
                    const index = {
                        filename: com.downloadFilename,
                        fileExtension: extension,
                        totalLength: com.totalLength ? com.totalLength : null,
                        online: false,
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
                    const file = {
                        uuid: [requestUuid],
                        filename: streamingData ? `${streamingData['videoDetails']['title']}.mp4` : watchUrl,
                        time_stamp: date,
                        last_viewed: date,
                        path: "",
                        location: 'local',
                        url: streamingData ? `https://www.youtube.com/watch?v=${streamingData['videoDetails']['videoId']}` : "",
                        tags: ['youtube', extension, 'video'],
                        size: com.totalLength ? com.totalLength : null,
                        favorite: false,
                        youtube: {
                            id: youtubeId || "",
                            mimeType: {
                                video: format['mimeType'] || `video/mp4; codecs="avc1.64001F, mp4a.40.2"`,
                            },
                            thumbnail,
                            bitrate,
                            duration
                        }
                    };
                    _view.storageHelper.saveFileHistory(file, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                };
            });
        };
        this.appendNext = (pieces, sourceBuffer) => {
            if (!pieces.length) {
                this.endOfStream();
            }
            if (sourceBuffer) {
                if (pieces.length) {
                    _view.storageHelper.getDecryptLoad(pieces.shift(), (err, data) => {
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
            this.retrievePlayerElements(() => {
                this.skipAdvertisements(true);
                this.loading(false);
                let index = null;
                let pieces = [];
                let tags = ko.isObservable(fileHistory.tags) ? fileHistory.tags() : fileHistory.tags;
                const appendNext = (sourceBuffer) => {
                    if (sourceBuffer) {
                        if (pieces.length) {
                            let yyy = '';
                            _view.storageHelper.getDecryptLoad(yyy = pieces.shift(), (err, data) => {
                                if (err) {
                                    return;
                                }
                                if (data) {
                                    console.log(`piece UUID = ${yyy}`, Buffer.from(data));
                                    sourceBuffer.appendBuffer(Buffer.from(data));
                                    if (this.mediaSource.duration < 180) {
                                        appendNext(sourceBuffer);
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
                    appendNext(this.sourceBuffers['video']);
                });
                this.playerElements['kloakSeekBar'].addEventListener("click", (e) => {
                    const x = e?.['layerX'];
                    const full = this.playerElements['kloakSeekBar'].clientWidth;
                    const percent = (x / full);
                    const currentTime = percent * this.mediaSource.duration;
                    this.playerElements['kloakVideo']['currentTime'] = currentTime;
                    // const n = pieces.slice((((currentTime * fileHistory['youtube']['bitrate']) / 8) / 1048576) - 1)
                    appendNext(this.sourceBuffers['video']);
                });
                switch (true) {
                    case ['youtube', 'mp4'].every(val => tags.includes(val)):
                        _view.storageHelper.getIndex(fileHistory.uuid[0], (err, data) => {
                            if (err) {
                                return;
                            }
                            if (data) {
                                index = data;
                                this.setupMediaSource(fileHistory['youtube'].mimeType, this.playerElements.kloakVideo, () => {
                                    this.mediaSource.duration = fileHistory['youtube'].duration;
                                    this.setupPlayer();
                                    this.isPlaying(true);
                                    pieces = Object.values(index.pieces);
                                    appendNext(this.sourceBuffers['video']);
                                });
                            }
                        });
                        break;
                    // case ['youtube', 'audio'].every(val => tags.includes(val)):
                    // case ['youtube', 'webm'].every(val => tags.includes(val)):
                    // 	if (fileHistory.uuid.length > 1) {
                    // 		console.log(fileHistory)
                    // 		let videoIndex = null
                    // 		let audioIndex = null
                    // 		const getIndex = (uuid, callback: Function) => {
                    // 			if (uuid) {
                    // 				_view.storageHelper.getIndex(uuid, (err, data) => {
                    // 					if (err) {
                    // 						return
                    // 					}
                    // 					if (data) {
                    // 						callback(JSON.parse(Buffer.from(data).toString()))
                    // 					}
                    // 				})
                    // 			} else {
                    // 				callback()
                    // 			}
                    // 		}
                    // 		getIndex(fileHistory.uuid[0], (index) => {
                    // 			if (index) {
                    // 				videoIndex = index
                    // 			}
                    // 			getIndex(fileHistory.uuid[1], (index) => {
                    // 				audioIndex = index
                    // 				this.setupMediaSource(fileHistory['youtube'].mimeType, this.playerElements.kloakVideo, () => {
                    // 					this.mediaSource.duration = fileHistory['youtube'].duration
                    // 					this.setupPlayer()
                    // 					this.playerElements['kloakVideo']['poster'] = _view.storageHelper.dataURItoBlob(fileHistory['youtube']['thumbnail']['data'], fileHistory['youtube']['thumbnail']['mime'])
                    // 					this.isPlaying(true)
                    // 					if (videoIndex) {
                    // 						appendNext(videoIndex['pieces'], this.sourceBuffers['video'])
                    // 					}
                    // 					if (audioIndex) {
                    // 						appendNext(audioIndex['pieces'], this.sourceBuffers['audio'])
                    // 					}
                    // 				})
                    // 			})
                    // 		});
                    // 		return
                    // 	}
                    // 	break;
                }
            });
        };
        this.uploadedVideo = (fileHistory) => {
            document.getElementById("kloakVideoMP3Cover") ? URL.revokeObjectURL(document.getElementById("kloakVideoMP3Cover")['src']) : null;
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
                });
                _view.storageHelper.getIndex(fileHistory.uuid[0], (err, data) => {
                    if (err) {
                        return;
                    }
                    if (data) {
                        index = data;
                        this.setupMediaSource({ video: fileHistory['media'].mimeType, audio: null }, this.playerElements.kloakVideo, () => {
                            this.mediaSource.duration = fileHistory['media'].duration;
                            this.setupPlayer(() => {
                                if (fileHistory['media'].mimeType.split("/")[0] === "audio") {
                                    const thumbnailImage = document.getElementById("kloakVideoMP3Cover");
                                    const { data, mime } = fileHistory['media'].thumbnail;
                                    if (data && mime && thumbnailImage) {
                                        thumbnailImage.style.display = 'initial';
                                        return thumbnailImage['src'] = _view.storageHelper.dataURItoBlob(data, mime);
                                    }
                                    this.playerElements.kloakVideo.classList.add("placeholderGradient");
                                    this.playerElements.kloakVideo.style.opacity = "1";
                                }
                            });
                            this.isPlaying(true);
                            this.appendNext(index.pieces, this.sourceBuffers['video']);
                        });
                    }
                });
            });
        };
        this.playlistPlayer = (playlistUuid, playlistName, playlistItems, playlistThumbnails, mode) => {
            this.currentPlaylist.uuid = playlistUuid;
            this.currentPlaylist.playlistName = playlistName;
            let index = null;
            if (mode) {
                this.currentPlaylist.mode(mode);
            }
            const random = () => {
                const num = Math.floor(Math.random() * (this.currentPlaylist.playlist().length)) + 1;
                console.log(num);
                if (this.currentPlaylist.lastShuffle === num && this.currentPlaylist.playlist().length !== 1) {
                    return random();
                }
                this.currentPlaylist.lastShuffle = num;
                return num;
            };
            this.loading(true);
            let duration = 0;
            let files = [];
            const setupPlayer = (callback) => {
                this.playlistPlayerElements = {
                    audio: document.getElementById("fileStorageAudioPlayer"),
                    playBtn: document.getElementById("audioPausePlay"),
                    prevBtn: document.getElementById("audioPlayingPrevious"),
                    nextBtn: document.getElementById("audioPlayingNext"),
                    textDisplay: document.getElementById("audioPlayingText"),
                    progressBar: document.getElementById("audioPlayingProgress"),
                    progressCompleteBar: document.getElementById("audioPlayingProcessComplete")
                };
                this.playlistPlayerElements.playBtn.addEventListener("click", () => {
                    this.isPlaying(!this.isPlaying());
                });
                this.playlistPlayerElements.prevBtn.addEventListener("click", () => {
                    if (this.loading()) {
                        return;
                    }
                    getTrackFile('previous');
                });
                this.playlistPlayerElements.nextBtn.addEventListener("click", () => {
                    if (this.loading()) {
                        return;
                    }
                    getTrackFile('next');
                });
                this.playlistPlayerElements.audio.addEventListener('paused', () => {
                    this.isPlaying(false);
                    console.log("PAUSED");
                });
                this.playlistPlayerElements.audio.addEventListener('play', () => {
                    this.isPlaying(true);
                });
                this.playlistPlayerElements.audio.addEventListener("timeupdate", e => {
                    !this.canSkip() ? this.canSkip(true) : null;
                    try {
                        const currentTime = this.playlistPlayerElements.audio['currentTime'];
                        console.log(currentTime, this.mediaSource.duration);
                        // this.playerElements.kloakDurationText.textContent = `${formatTime(currentTime)} / ${formatTime(this.mediaSource.duration)}`
                        this.playlistPlayerElements.progressCompleteBar.style.width = `${(currentTime / this.mediaSource.duration) * 100}%`;
                        if (Math.ceil(currentTime) == Math.ceil(this.mediaSource.duration)) {
                            this.playlistPlayerElements.audio['currentTime'] = 0;
                            getTrackFile('next');
                        }
                    }
                    catch (e) {
                        return;
                    }
                });
                this.playlistPlayerElements.progressBar.addEventListener("click", (e) => {
                    const x = e?.['offsetX'];
                    const full = this.playlistPlayerElements.progressBar.clientWidth;
                    console.log(e);
                    const percent = (x / full);
                    const currentTime = percent * this.mediaSource.duration;
                    this.playlistPlayerElements.audio['currentTime'] = currentTime;
                });
                callback();
            };
            const init = (callback) => {
                _view.storageHelper.getHistory((err, data) => {
                    const temp = data['files'].filter(file => playlistItems.includes(file['uuid'][0]));
                    playlistItems.forEach(item => {
                        files.push(...temp.filter(file => file['uuid'][0] === item));
                    });
                    callback(files);
                });
            };
            const getTrackFile = (direction) => {
                this.canSkip(false);
                this.loading(true);
                this.isPlaying(false);
                this.playlistPlayerElements.audio ? URL.revokeObjectURL(this.playlistPlayerElements.audio['src']) : null;
                this.playlistPlayerElements.textDisplay ? this.playlistPlayerElements.textDisplay.textContent = "" : null;
                if (this.currentPlaylist.mode() === 'shuffle') {
                    console.log("AM I HERE?");
                    const num = random();
                    this.currentPlaylist.current(num);
                }
                else {
                    switch (direction) {
                        case 'next':
                            console.log(this.currentPlaylist.current(), this.currentPlaylist.playlist().length);
                            if (this.currentPlaylist.current() === this.currentPlaylist.playlist().length) {
                                console.log("END OF PLAYLIST REPEAT");
                                this.currentPlaylist.current(1);
                                this.currentPlaylist.next(2);
                            }
                            else {
                                this.currentPlaylist.current(this.currentPlaylist.next());
                                this.currentPlaylist.next(this.currentPlaylist.next() + 1);
                            }
                            break;
                        case 'previous':
                            if (this.currentPlaylist.current() === 1) {
                                this.currentPlaylist.current(this.currentPlaylist.playlist().length);
                                this.currentPlaylist.next(1);
                            }
                            else {
                                this.currentPlaylist.next(this.currentPlaylist.current());
                                this.currentPlaylist.current(this.currentPlaylist.current() - 1);
                            }
                            break;
                        default:
                            break;
                    }
                }
                this.currentPlaylist.lastShuffle = this.currentPlaylist.current();
                const track = this.currentPlaylist.playlist()[this.currentPlaylist.current() - 1];
                _view.storageHelper.getIndex(track['uuid'][0], (err, data) => {
                    index = data;
                    let pieces = index.pieces;
                    console.log(pieces);
                    this.loading(false);
                    setupPlayer(() => {
                        this.setupMediaSource({ audio: 'audio/mpeg' }, this.playlistPlayerElements.audio, () => {
                            pieces.map(piece => {
                                _view.storageHelper.getDecryptLoad(piece, (err, data) => {
                                    this.mediaSource.duration = parseInt(track.media.duration);
                                    this.playlistPlayerElements.textDisplay.textContent = track.filename;
                                    this.sourceBuffers.audio.appendBuffer(data);
                                    this.isPlaying(true);
                                });
                            });
                        });
                    });
                });
            };
            init((playlist) => {
                this.currentPlaylist.playlist(playlist);
                getTrackFile("next");
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
            if (this.playerElements?.kloakVideo) {
                playing ? this.playerElements?.kloakVideo['play']() : this.playerElements?.kloakVideo['pause']();
            }
            if (this.playlistPlayerElements?.audio) {
                playing ? this.playlistPlayerElements?.audio['play']() : this.playlistPlayerElements?.audio['pause']();
            }
        });
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
