class MediaViewer {
    constructor(type, filename, options, _callback, exit) {
        this.mediaLoading = ko.observable(false);
        this.options = {};
        this.callback = null;
        this.MP4BoxFile = null;
        this.mediaSource = null;
        this.videoPieces = new Map();
        this.audioPieces = new Map();
        this.videoInit = null;
        this.audioInit = null;
        this.audioCodec = null;
        this.videoCodec = null;
        this.audioRequestUuid = uuid_generate();
        this.videoRequestUuid = uuid_generate();
        this.audioSourceBuffer = null;
        this.videoSourceBuffer = null;
        this.player = document.getElementById("videoPlayer");
        this.exit = () => { };
        this.streamYoutubeVideo = () => {
            const audioWebm = [];
            const videoWebm = [];
            const audioMP4 = [];
            const videoMP4 = [];
            this.options['youtubeStreamingData']['adaptiveFormats'].forEach(media => {
                if (media['mimeType'].includes('audio/webm')) {
                    audioWebm.push(media);
                }
                if (media['mimeType'].includes('video/webm')) {
                    videoWebm.push(media);
                }
                if (media['mimeType'].includes('audio/mp4')) {
                    audioMP4.push(media);
                }
                if (media['mimeType'].includes('video/mp4')) {
                    videoMP4.push(media);
                }
            });
            const audio = audioWebm.pop();
            const video = videoWebm.length ? videoWebm.filter(video => video['qualityLabel'] === '480p').shift() : videoMP4.filter(video => video['qualityLabel'] === '720p60' || video['qualityLabel'] === '720p' || video['qualityLabel'] === '480p').shift();
            let audioURL = audio.url;
            let videoURL = video.url;
            this.audioCodec = audio['mimeType'].replace("+", ' ');
            this.videoCodec = video['mimeType'].replace("+", ' ');
            this.downloader(audioURL, this.audioRequestUuid, (uuid, com) => {
                if (com.Args[0].order === 0) {
                    this.downloadInit(com.Args[0].downloadUuid, (buffer) => {
                        this.audioInit = buffer;
                        this.downloader(videoURL, this.videoRequestUuid, (uuid, com) => {
                            if (com.Args[0].order === 0) {
                                this.downloadInit(com.Args[0].downloadUuid, (buffer) => {
                                    this.videoInit = buffer;
                                    if (!this.mediaSource) {
                                        this.initMediaSource();
                                    }
                                });
                                return;
                            }
                            this.videoPieces.set(com.Args[0].order, com.Args[0]);
                        });
                    });
                    return;
                }
                this.audioPieces.set(com.Args[0].order, com.Args[0]);
            });
        };
        this.streamDownloadedVideo = () => {
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
                _view.storageHelper.getIndex(this.options['uuid'], (err, data) => {
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
            const createMP4Box = () => {
                Log.setLogLevel(Log.debug);
                this.MP4BoxFile = MP4Box.createFile();
                beginFileRetrieval();
                this.MP4BoxFile.onError = (e) => {
                    console.log(e);
                };
                this.MP4BoxFile.onReady = (info) => {
                    info['tracks'].forEach(track => {
                        if (track['video']) {
                            this.videoSourceBuffer = this.mediaSource.addSourceBuffer(`video/mp4; codecs="${track['codec']}"`);
                        }
                        if (track['audio']) {
                            this.audioSourceBuffer = this.mediaSource.addSourceBuffer(`audio/mp4; codecs="${track['codec']}"`);
                        }
                    });
                    if (info.isFragmented) {
                        this.mediaSource.duration = info.fragment_duration / info.timescale;
                    }
                    else {
                        this.mediaSource.duration = info.duration / info.timescale;
                    }
                    console.log(this.mediaSource.duration);
                    this.MP4BoxFile.onSegment = (id, user, buffer, sampleNum) => {
                        console.log("Received segment on track " + id + " for object " + user + " with a length of " + buffer.byteLength + ",sampleNum=" + sampleNum);
                        mp4box_onSegment(id, buffer);
                    };
                    var options = { nbSamples: 1200, rapAlignement: true };
                    this.MP4BoxFile.setSegmentOptions(info.tracks[0].id, null, options); // I don't need user object this time
                    this.MP4BoxFile.setSegmentOptions(info.tracks[1].id, null, options);
                    var initSegs = this.MP4BoxFile.initializeSegmentation();
                    //   initSegs.forEach((init, index) => {
                    this.videoSourceBuffer.appendBuffer(initSegs[0].buffer);
                    this.audioSourceBuffer.appendBuffer(initSegs[1].buffer);
                    //   })
                    console.log(initSegs);
                    this.MP4BoxFile.start();
                };
            };
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
                    createMP4Box();
                });
            };
            setupMediaSource();
        };
        this.appendSegment = (mediaPieces, sourceBuffer) => {
            if (mediaPieces === null) {
                return;
            }
            const keys = mediaPieces.keys();
            const key = keys.next().value;
            if (!key) {
                return setTimeout(() => { this.appendSegment(mediaPieces, sourceBuffer); }, 2000);
            }
            const piece = mediaPieces.get(key);
            if (piece.eof) {
                mediaPieces = null;
            }
            else {
                mediaPieces.delete(key);
            }
            _view.connectInformationMessage.fetchFiles(piece.downloadUuid, (err, data) => {
                if (err) {
                    console.log(err);
                    return this.callback('Unable to fetch files', null);
                }
                if (data) {
                    _view.sharedMainWorker.decryptStreamWithoutPublicKey(Buffer.from(data.data).toString(), (err, data) => {
                        if (err) {
                            return this.callback('Unable to decrypt file', null);
                        }
                        sourceBuffer.appendBuffer(Buffer.from(data.data).buffer);
                    });
                }
            });
        };
        this.downloadInit = (uuid, cb) => {
            _view.connectInformationMessage.fetchFiles(uuid, (err, data) => {
                if (err) {
                    return this.callback('Unable to fetch files', null);
                }
                if (data) {
                    _view.sharedMainWorker.decryptStreamWithoutPublicKey(Buffer.from(data.data).toString(), (err, data) => {
                        if (err) {
                            return this.callback('Unable to decrypt file', null);
                        }
                        if (data) {
                            console.log(Buffer.from(data.data).buffer);
                            cb(Buffer.from(data.data).buffer);
                        }
                    });
                }
            });
        };
        this.downloader = (url, uuid, callback) => {
            const com = {
                command: 'CoSearch',
                Args: [url],
                error: null,
                subCom: 'downloadFile',
                requestSerial: uuid,
            };
            return _view.connectInformationMessage.emitRequest(com, (err, com) => {
                console.log(err, com);
                if (err) {
                    // return errorProcess ( err )
                    return this.callback(err, null);
                }
                if (!com) {
                    return;
                }
                if (com.error === -1) {
                    return;
                }
                if (com.error) {
                    return this.callback(com.error, null);
                }
                if (com.subCom === 'downloadFile') {
                    callback(uuid, com);
                }
            });
        };
        this.initMediaSource = () => {
            if (!MediaSource.isTypeSupported(this.audioCodec) || !MediaSource.isTypeSupported(this.videoCodec)) {
                this.callback('Unable to play codec', null);
                return console.log("Unable to stream this codec!");
            }
            this.mediaSource = new MediaSource();
            if (this.options['customPlayer']) {
                this.options['customPlayer'].addEventListener("error", e => {
                    console.log(e);
                });
                this.options['customPlayer']['src'] = URL.createObjectURL(this.mediaSource);
            }
            else {
                _view.displayMedia('player');
                this.player = document.getElementById("videoPlayer");
                this.player.addEventListener("error", e => {
                    console.log(e);
                });
                this.player['src'] = URL.createObjectURL(this.mediaSource);
            }
            this.player.addEventListener("canplay", e => {
                this.callback(null, true);
                this.player['play']();
            });
            const sourceOpen = (_) => {
                this.audioSourceBuffer = this.mediaSource.addSourceBuffer(this.audioCodec);
                this.videoSourceBuffer = this.mediaSource.addSourceBuffer(this.videoCodec);
                this.player.addEventListener("waiting", e => {
                    this.appendSegment(this.videoPieces, this.videoSourceBuffer);
                });
                this.videoSourceBuffer.appendBuffer(this.videoInit);
                this.audioSourceBuffer.appendBuffer(this.audioInit);
                this.videoSourceBuffer.addEventListener("updateend", (event) => {
                    this.appendSegment(this.videoPieces, this.videoSourceBuffer);
                });
                this.audioSourceBuffer.addEventListener("updateend", (event) => {
                    this.appendSegment(this.audioPieces, this.audioSourceBuffer);
                });
            };
            this.mediaSource.addEventListener("sourceopen", sourceOpen);
        };
        this.type = type;
        this.filename = filename;
        this.options = options;
        this.callback = _callback;
        this.exit = exit;
        if (options['youtubeStreamingData']) {
            this.streamYoutubeVideo();
        }
        if (options['uuid']) {
            this.streamDownloadedVideo();
        }
        if (options['twitterData']) {
            // get twitter
        }
    }
}
