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
                kloakPlayButton: document.getElementById("kloakVideoPlay"),
                kloakStopButton: document.getElementById("kloakVideoStop"),
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
            const types = Object.keys(mimeType);
            types.map(type => {
                console.log(type);
                if (mimeType[type]) {
                    console.log('has type', mimeType[type]);
                    this.sourceBuffers[type] = this.mediaSource.addSourceBuffer(mimeType[type]);
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
                const percent = Math.floor((currentTime / buffered) * 100);
                // if (percent > 80) {
                // 	if (this.pieces.length) {
                // 		this.appendNext(this.pieces, () => {
                // 		})
                // 	}
                // }
            }
            catch (e) {
                return;
            }
        };
        this.progressUpdateEvent = e => {
            try {
                const buffered = e.target['buffered'].end(0);
                this.playerElements.kloakBufferedBar.style.width = `${(buffered / this.mediaSource.duration) * 100}%`;
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
        this.setupPlayer = () => {
            // console.log(this.playerElements.kloakVideo['buffered'])
            this.playerElements.kloakVideo.addEventListener("timeupdate", this.timeUpdateEvent);
            this.playerElements?.kloakSeekBar.addEventListener("click", e => {
                const buffered = this.playerElements.kloakVideo['buffered'].end(0);
                console.log(e);
                const x = e?.['layerX'];
                console.log(x);
                const full = this.playerElements['kloakSeekBar'].clientWidth;
                console.log(e.target);
                console.log(full);
                const percent = (x / full);
                console.log(percent);
                const time = percent * this.mediaSource.duration;
                if (time > buffered) {
                    return;
                }
                this.playerElements.kloakVideo['currentTime'] = percent * this.mediaSource.duration;
                this.playerElements['kloakCurrentTimeBar'].style.width = `${Math.round(percent * 100)}%`;
            });
            this.playerElements.kloakVideo.addEventListener("progress", this.progressUpdateEvent);
            this.playerElements['kloakVideo'].addEventListener('ended', _ => {
                this.isPlaying(false);
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
        };
        this.skipAd = () => {
            this.skipAdvertisements(true);
            this.playAds('stop');
            this.isPlaying(true);
        };
        // streamingData object from ytplayer.config.args
        this.youtubePlayer = (streamingData) => {
            this.retrievePlayerElements(() => {
                this.loading(false);
                if (!this.adPlaying()) {
                    this.playAds("play");
                }
                let youtubeId = streamingData['videoDetails']['videoId'];
                let format = streamingData['formats'].filter(format => format.itag === 22 || format.itag === 18).pop();
                console.log(format);
                let duration = streamingData['duration'] || parseInt(format['approxDurationMs'].toString()) / 1000 || null;
                let extension = format['mimeType'].split(" ")[0].replace(";", "").split("/")[1];
                let url = format.url;
                let downloadedPieces = [];
                let history = false;
                let endOfFile = false;
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
                        filename: `${streamingData['videoDetails']['title']}.mp4`,
                        time_stamp: date,
                        last_viewed: date,
                        path: "",
                        url: `https://www.youtube.com/watch?v=${streamingData['videoDetails']['videoId']}`,
                        domain: "https://www.youtube.com",
                        tag: ['youtube', extension, 'video'],
                        color: null,
                        size: com.totalLength ? com.totalLength : null,
                        youtube: {
                            id: youtubeId,
                            mimeType: {
                                video: format['mimeType'],
                            },
                            duration
                        }
                    };
                    _view.storageHelper.saveHistory(history, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                };
                this.downloadQueue = new DownloadQueue(url, 'video', (err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    if (data) {
                        console.log(data);
                        if (!this.mediaSource) {
                            this.setupMediaSource({ video: format['mimeType'] }, () => {
                                this.mediaSource.duration = parseInt(duration.toString());
                                this.setupPlayer();
                                this.sourceBuffers['video'].appendBuffer(Buffer.from(data));
                            });
                            return;
                        }
                        this.sourceBuffers['video'].appendBuffer(Buffer.from(data));
                        if (endOfFile) {
                            this.endOfStream();
                        }
                    }
                }, (requestUuid, com, data) => {
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
                    if (com.eof) {
                        endOfFile = true;
                    }
                });
            });
        };
        this.appendNext = (pieces, sourceBuffer) => {
            if (sourceBuffer) {
                if (pieces.length) {
                    _view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
                        if (err) {
                            return;
                        }
                        if (data) {
                            sourceBuffer.appendBuffer(Buffer.from(data));
                            setTimeout(() => {
                                this.appendNext(pieces, sourceBuffer);
                            }, 500);
                        }
                    });
                }
                else {
                    this.endOfStream();
                }
            }
        };
        this.downloadedYoutube = (fileHistory) => {
            this.retrievePlayerElements(() => {
                this.skipAdvertisements(true);
                this.loading(false);
                let index = null;
                let tags = ko.isObservable(fileHistory.tag) ? fileHistory.tag() : fileHistory.tag;
                const appendNext = (pieces, sourceBuffer) => {
                    if (sourceBuffer) {
                        if (pieces.length) {
                            _view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
                                if (err) {
                                    return;
                                }
                                if (data) {
                                    sourceBuffer.appendBuffer(Buffer.from(data));
                                    setTimeout(() => {
                                        appendNext(pieces, sourceBuffer);
                                    }, 500);
                                }
                            });
                        }
                        else {
                            this.endOfStream();
                        }
                    }
                };
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
                                    appendNext(index.pieces, this.sourceBuffers['video']);
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
                this.skipAdvertisements(true);
                let index = null;
                this.loading(false);
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
        this.isPlaying.subscribe(playing => {
            playing ? this.playerElements?.kloakVideo['play']() : this.playerElements?.kloakVideo['pause']();
        });
        this.loading(true);
    }
}
