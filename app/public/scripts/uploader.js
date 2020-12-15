class Uploader {
    constructor(requestUuid, file, path, extraTags, progressIndicator, callback, kloakDrive) {
        this.kloakDrive = kloakDrive;
        this.chunkSize = 1048576;
        this.progressIndicator = null;
        this.pieces = [];
        this.processedPieces = [];
        this.currentPiece = null;
        this.totalPieces = 0;
        this.extraTags = [];
        this.media = {
            duration: null,
            mimeType: null,
            fastStart: null,
            thumbnail: {
                data: null,
                mime: null
            }
        };
        this.MP4BoxFile = null;
        this.callback = null;
        this.log = (message) => {
            console.log(`<${new Date().toLocaleString()}> ${message}`);
        };
        this.getWorker = (callback) => {
            const url = URL.createObjectURL(new Blob([`(${this.workerFn.toString()})()`], { type: 'text/javascript' }));
            const worker = new Worker(url);
            worker.addEventListener('message', this.messageChannel);
            URL.revokeObjectURL(url);
            return worker;
        };
        this.init = () => {
            this.fileReader(() => {
                this.getMetadata(() => {
                    switch (this.file.type) {
                        case 'video/mp4':
                            this.getVideoData(() => {
                                this.generateOffsetUUID(0, () => {
                                    this.createIndex();
                                    this.createHistory();
                                    this.disassemblyWorker = this.getWorker(this.callback);
                                    this.disassemblyWorker.postMessage({ cmd: 'START', payload: { arrayBuffer: this.arrayBuffer } }, [this.arrayBuffer]);
                                });
                            });
                            break;
                        case 'audio/mpeg':
                            this.getThumbnail((err) => {
                                if (err) {
                                    console.log(err);
                                }
                                this.media.mimeType = 'audio/mpeg';
                                this.media.fastStart = true;
                            });
                        default:
                            this.generateOffsetUUID(0, () => {
                                this.createIndex();
                                this.createHistory();
                                this.disassemblyWorker = this.getWorker(this.callback);
                                this.disassemblyWorker.postMessage({ cmd: 'START', payload: { arrayBuffer: this.arrayBuffer } }, [this.arrayBuffer]);
                            });
                            break;
                    }
                });
            });
        };
        this.getMetadata = (callback) => {
            if (!['audio', 'video'].includes(this.file.type.split("/")[0])) {
                return callback();
            }
            const _self = this;
            const video = document.createElement("video");
            video.preload = 'metadata';
            video['src'] = URL.createObjectURL(this.file);
            video.onloadedmetadata = function () {
                URL.revokeObjectURL(video.src);
                _self.media.duration = Math.round(video.duration);
                callback();
            };
        };
        this.getVideoData = (callback) => {
            const _self = this;
            this.MP4BoxFile = window['MP4Box'].createFile();
            this.MP4BoxFile.onError = (e) => {
                console.log(e);
            };
            this.MP4BoxFile.onReady = (info) => {
                const mime = info.mime.split(" ");
                _self.media.mimeType = [mime[0], mime[1]].join(" ");
                _self.media.fastStart = info.isFragmented && info.isProgressive;
                console.log(info);
                this.MP4BoxFile.flush();
                callback();
            };
            _self.arrayBuffer['fileStart'] = 0;
            _self.MP4BoxFile.appendBuffer(this.arrayBuffer);
        };
        this.generateOffsetUUID = (offset = 0, callback) => {
            if (offset > this.fileSize) {
                return callback(true);
            }
            this.pieces.push({ offset, uuid: uuid_generate() });
            this.totalPieces = this.pieces.length;
            if (offset <= this.fileSize) {
                this.generateOffsetUUID(offset + this.chunkSize, callback);
            }
        };
        this.getThumbnail = (callback) => {
            const _self = this;
            window['jsmediatags'].read(this.file, {
                onSuccess: function (tag) {
                    if (tag) {
                        tag['tags']?.artist ? _self.media.artist = tag['tags']?.artist : null;
                        tag['tags']?.album ? _self.media.album = tag['tags']?.album : null;
                        if (tag['tags']?.picture) {
                            _self.media.thumbnail['data'] = Buffer.from(tag['tags']?.picture.data).toString('base64');
                            _self.media.thumbnail['mime'] = tag['tags']?.picture.format;
                        }
                        callback(null);
                    }
                },
                onError: function (error) {
                    callback(error);
                }
            });
        };
        this.fileReader = (callback) => {
            const _self = this;
            const reader = new FileReader();
            reader.readAsArrayBuffer(this.file);
            reader.onloadend = (e) => {
                _self.arrayBuffer = e.target['result'];
                return callback();
            };
        };
        this.createHistory = () => {
            const date = new Date();
            const file = {
                uuid: [this.uuid],
                filename: this.file.name,
                location: this.kloakDrive ? 'online' : 'local',
                time_stamp: date,
                last_viewed: date,
                path: this.path,
                url: 'Upload',
                tags: [this.file.type.split('/')[0], this.file.type.split('/')[1], ...this.extraTags, 'upload', 'local'].filter(tag => tag),
                size: this.fileSize,
                favorite: false,
                media: this.media
            };
            _view.storageHelper.saveFileHistory(file, this.callback);
        };
        this.createIndex = (isOnline = false) => {
            const index = {
                filename: this.file.name,
                fileExtension: this.file.name.split('.').pop(),
                totalLength: this.file.size,
                contentType: this.file.type,
                online: isOnline,
                pieces: this.pieces.map(piece => piece['uuid']),
                finished: true,
            };
            _view.storageHelper.createUpdateIndex(this.uuid, index, (err, data) => {
                if (err) {
                    this.log(err);
                    return;
                }
                this.log(data);
            });
        };
        this.updateProgress = () => {
            if (!this.progressIndicator) {
                return;
            }
            const percent = Math.floor(((this.totalPieces - this.pieces.length) / this.totalPieces) * 100);
            if (ko.isObservable(this.progressIndicator)) {
                this.progressIndicator(percent);
                this.progressIndicator.valueHasMutated();
                return;
            }
            this.progressIndicator(percent);
        };
        this.messageChannel = (e) => {
            const command = e.data.cmd;
            const payload = e.data.payload;
            switch (command) {
                case 'READY':
                    this.currentPiece = this.pieces.shift();
                    console.log(this.currentPiece);
                    this.disassemblyWorker.postMessage({ cmd: 'NEXT_PIECE', payload: { uuid: this.currentPiece.uuid, offset: this.currentPiece.offset, chunkSize: this.chunkSize, eof: this.pieces.length === 0 } });
                    this.updateProgress();
                    break;
                case 'DATA':
                    // console.log("I GOT DATAAAA", payload)
                    // if (this.kloakDrive) {
                    // 	console.log("I SHOULD GO TO KLOAK DRIVE!")
                    // 	console.log(this.currentPiece)
                    // 	_view.storageHelper.encryptSaveOnline(this.currentPiece.uuid, payload.arrayBuffer, (err, data) => {
                    // 		if (err) {
                    // 			return
                    // 		}
                    // 		if (data) {
                    // 			this.processedPieces.push(data.Args)
                    // 			if (payload.eof) {
                    // 				this.createIndex(true)
                    // 				return this.callback(null, this.uuid)
                    // 			}
                    // 			this.currentPiece = this.pieces.shift()
                    // 			this.disassemblyWorker.postMessage({cmd: 'NEXT_PIECE', payload: {uuid: this.currentPiece.uuid, offset: this.currentPiece.offset, chunkSize: this.chunkSize, eof: this.pieces.length === 0}})
                    // 			this.updateProgress()
                    // 		}
                    // 	})
                    // } else {
                    _view.storageHelper.encryptSave(payload.uuid, payload.arrayBuffer, (err, data) => {
                        if (err) {
                            this.disassemblyWorker.terminate();
                            this.callback(err, null);
                            return;
                        }
                        // this.processedPieces.push(payload.uuid)
                        if (payload.eof) {
                            this.callback(null, this.uuid);
                            return;
                        }
                        this.currentPiece = this.pieces.shift();
                        this.disassemblyWorker.postMessage({ cmd: 'NEXT_PIECE', payload: { uuid: this.currentPiece.uuid, offset: this.currentPiece.offset, chunkSize: this.chunkSize, eof: this.pieces.length === 0 } });
                        this.updateProgress();
                    });
                    // }
                    break;
                default:
                    break;
            }
        };
        this.workerFn = () => {
            const postMessage = self.postMessage;
            let buffer = null;
            const splicePiece = (uuid, offset, chunkSize, eof) => {
                const arrayBuffer = buffer.slice(offset, offset + chunkSize);
                postMessage({ cmd: 'DATA', payload: { uuid, eof, arrayBuffer } }, [arrayBuffer]);
            };
            self.addEventListener('message', async (e) => {
                const command = e.data.cmd;
                const payload = e.data.payload;
                switch (command) {
                    case 'START':
                        buffer = payload.arrayBuffer;
                        postMessage({ cmd: 'READY', payload: {} });
                        break;
                    case 'NEXT_PIECE':
                        const uuid = payload.uuid;
                        const offset = payload.offset;
                        const chunkSize = payload.chunkSize;
                        const eof = payload.eof;
                        splicePiece(uuid, offset, chunkSize, eof);
                        break;
                }
            });
        };
        console.log(this.kloakDrive);
        this.uuid = requestUuid;
        this.path = path;
        this.file = file;
        this.fileSize = file.size;
        this.extraTags = extraTags;
        this.progressIndicator = progressIndicator;
        this.callback = callback;
        if (this.fileSize <= this.chunkSize) {
            this.chunkSize = Math.floor(this.fileSize / 5);
        }
        this.init();
    }
}
