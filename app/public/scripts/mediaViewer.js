class MediaViewer {
    // public exit: Function = () => {}
    constructor(customPlayer, callback, exit) {
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
        this.hasOpened = false;
        this.play = () => {
            if (this.customPlayer.player) {
                this.customPlayer.player['play']();
                this.callback(null, true, true);
            }
        };
        this.sourceOpen = (mimeType, callback) => {
            const types = Object.keys(mimeType);
            if (this.hasOpened) {
                return;
            }
            types.map(type => {
                console.log(type);
                if (mimeType[type]) {
                    console.log('has type');
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
            this.customPlayer.player['src'] = URL.createObjectURL(this.mediaSource);
            this.mediaSource.addEventListener("sourceopen", () => {
                this.sourceOpen(mimeType, () => {
                    callback();
                });
            });
        };
        this.endOfStream = () => {
            if (this.sourceBuffers['video']?.updating || this.sourceBuffers['audio']?.updating) {
                return setTimeout(() => {
                    this.endOfStream();
                }, 250);
            }
            this.mediaSource.endOfStream();
        };
        this.playAds = (action) => {
            const adPlayer = document.getElementById("adPlayer");
            if (adPlayer) {
                switch (action) {
                    case 'play':
                        const ads = ['coronavirus-ad.mp4', 'ipad-ad.mp4', 'nike-ad.mp4'];
                        adPlayer['src'] = `./videos/ads/${ads[Math.floor(Math.random() * 3)]}`;
                        adPlayer['play']();
                        break;
                    case 'stop':
                        adPlayer['pause']();
                        adPlayer['src'] = null;
                        break;
                }
            }
        };
        this.youtube = (youtubeStreamingData) => {
            this.playAds('play');
            let youtubeId = youtubeStreamingData['videoDetails']['videoId'];
            let format = youtubeStreamingData['formats'].filter(format => format.itag === 22 || format.itag === 18).pop();
            console.log(format);
            let duration = youtubeStreamingData['duration'] || parseInt(format['approxDurationMs'].toString()) / 1000 || null;
            let extension = format['mimeType'].split(" ")[0].replace(";", "").split("/")[1];
            let url = format.url;
            let downloadedPieces = [];
            let endOfFile = false;
            const createUpdateIndex = (requestUuid, com) => {
                const index = {
                    filename: com.downloadFilename,
                    fileExtension: extension,
                    totalLength: com.totalLength ? com.totalLength : null,
                    online: false,
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
                    location: 'local',
                    url: `https://www.youtube.com/watch?v=${youtubeStreamingData['videoDetails']['videoId']}`,
                    tags: ['youtube', extension, 'video'],
                    size: com.totalLength ? com.totalLength : null,
                    youtube: {
                        id: youtubeId,
                        mimeType: {
                            video: format['mimeType'],
                        },
                        duration
                    }
                };
                // _view.storageHelper.replaceHistory(history, (err, data) => {
                // 	if (err) {
                // 		return console.log(err)
                // 	}
                // })
            };
            let history = false;
            this.download = new DownloadQueue(url, 'video', true, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                if (data) {
                    console.log(data);
                    if (!this.mediaSource) {
                        this.setupMediaSource({ video: format['mimeType'] }, () => {
                            this.hasOpened = true;
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
            _view.storageHelper.getDecryptLoad(pieces.shift(), (err, data) => {
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
                this.customPlayer.durationText.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(this.mediaSource.duration)}`;
                this.customPlayer.currentTimeBar.style.width = `${(currentTime / this.mediaSource.duration) * 100}%`;
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
        this.appendBuffer = (pieces, sourceBuffer, callback) => {
            if (this.state === 'STOP') {
                return;
            }
            if (!pieces.length) {
                callback(true);
                return;
            }
            _view.storageHelper.getDecryptLoad(pieces.shift(), (err, data) => {
                if (data) {
                    sourceBuffer.appendBuffer(data);
                    console.log(data);
                    return setTimeout(() => {
                        this.appendBuffer(pieces, sourceBuffer, callback);
                    }, 100);
                }
            });
        };
        this.setupPlayer = () => {
            this.customPlayer.player.addEventListener("timeupdate", this.timeUpdateEvent);
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
            this.customPlayer.player.addEventListener("progress", this.progressUpdateEvent);
            this.customPlayer?.playButton.addEventListener("click", _ => {
                this.videoPlaying = !this.videoPlaying;
                if (this.videoPlaying) {
                    this.customPlayer?.player['play']();
                }
                else {
                    this.customPlayer?.player['pause']();
                }
                this.callback(null, true, this.videoPlaying);
            });
            this.customPlayer?.stopButton.addEventListener("click", _ => {
                this.videoPlaying = false;
                this.customPlayer?.player['pause']();
                this.callback(null, true, this.videoPlaying);
            });
            this.customPlayer?.fullscreenButton.addEventListener("click", _ => {
                this.customPlayer?.player.requestFullscreen();
            });
        };
        this.streamedYoutube = (uuid, mimeType, duration, filesize, youtubeId) => {
            let removedOffset = 0;
            if (!this.customPlayer.player['autoplay']) {
                this.customPlayer.player['autoplay'] = true;
            }
            _view.storageHelper.getIndex(uuid, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                const index = JSON.parse(Buffer.from(data).toString());
                console.log(uuid, filesize, youtubeId, index);
                this.pieces = index['pieces'];
                if (!this.mediaSource) {
                    this.setupMediaSource(mimeType, () => {
                        this.hasOpened = true;
                        this.setupPlayer();
                        this.mediaSource.duration = parseInt(duration.toString());
                        if (this.pieces.length) {
                            this.appendNext(this.pieces, () => {
                            });
                        }
                    });
                }
            });
        };
        this.downloadedYoutube = (requestUuid, mimeTypes, duration, thumbnail) => {
            console.log(requestUuid);
            let videoIndex = null;
            let audioIndex = null;
            let EOF = {
                video: false,
                audio: false
            };
            if (!this.mediaSource) {
                const callback = () => {
                    if (duration) {
                        this.mediaSource.duration = parseInt(duration.toString());
                    }
                    console.log(this.sourceBuffers);
                    this.setupPlayer();
                    if (thumbnail) {
                        this.customPlayer['player']['poster'] = _view.storageHelper.dataURItoBlob(thumbnail.data, thumbnail.mime);
                    }
                    requestUuid.map(uuid => {
                        if (uuid) {
                            _view.storageHelper.getIndex(uuid, (err, data) => {
                                const index = JSON.parse(Buffer.from(data).toString());
                                if (index.contentType === 'video/webm') {
                                    this.appendBuffer(index.pieces, this.sourceBuffers.video, (eof) => {
                                        EOF['video'] = eof;
                                        if (EOF['video'] && EOF['audio']) {
                                            this.endOfStream();
                                        }
                                    });
                                    console.log(videoIndex);
                                }
                                else {
                                    this.appendBuffer(index.pieces, this.sourceBuffers.audio, (eof) => {
                                        EOF['audio'] = eof;
                                        if (!videoIndex) {
                                            if (eof) {
                                                this.endOfStream();
                                            }
                                        }
                                        else {
                                            if (EOF['video'] && EOF['audio']) {
                                                this.endOfStream();
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                };
                this.setupMediaSource(mimeTypes, () => {
                    this.hasOpened = true;
                    callback();
                });
            }
        };
        this.uploadedVideo = (requestUuid, mimeType, duration, fastStart) => {
            if (!fastStart) {
                return;
            }
            let index = null;
            requestUuid.map(uuid => {
                _view.storageHelper.getIndex(Array.from(requestUuid).pop(), (err, data) => {
                    if (data) {
                        index = JSON.parse(Buffer.from(data).toString());
                        this.setupMediaSource({ video: mimeType }, () => {
                            this.hasOpened = true;
                            console.log(duration);
                            this.mediaSource.duration = parseInt(duration.toString());
                            this.setupPlayer();
                            this.appendBuffer(index.pieces, this.sourceBuffers['video'], (eof) => {
                                if (eof) {
                                    this.endOfStream();
                                }
                            });
                        });
                    }
                });
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
        this.terminate = (callback) => {
            this.state = 'STOP';
            this.customPlayer.player.removeEventListener("timeupdate", this.timeUpdateEvent);
            this.customPlayer.player.removeEventListener("progress", this.progressUpdateEvent);
            this.customPlayer.player['pause']();
            if (this.customPlayer.player['poster']) {
                URL.revokeObjectURL(this.customPlayer.player['poster']);
            }
            URL.revokeObjectURL(this.customPlayer.player['src']);
            this.download?.stopDownload();
            this.mediaSource = null;
            this.sourceBuffers = {
                video: null,
                audio: null
            };
            callback ? callback() : null;
        };
        this.Log = (message) => {
            const u = new Date();
            return console.log(`[${u.toLocaleTimeString()}:${u.getMilliseconds()}] - ${message}`);
        };
        console.log(this.customPlayer);
        if (customPlayer.player) {
            this.customPlayer.player.addEventListener('canplay', _ => {
                callback(null, true, false);
            });
            this.customPlayer.player.addEventListener("pause", _ => {
                this.videoPlaying = false;
                callback(null, true, this.videoPlaying);
                console.log(null, true, this.videoPlaying);
            });
            this.customPlayer.player.addEventListener('ended', _ => {
                this.videoPlaying = false;
                callback(null, true, this.videoPlaying);
            });
            this.customPlayer.player.addEventListener("play", _ => {
                this.videoPlaying = true;
                callback(null, true, this.videoPlaying);
                this.playAds('stop');
            });
        }
    }
}
