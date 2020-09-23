class Downloader {
    constructor(requestUuid, files = null, downloadTitle, progressIndicator, extraHistoryTags, callback) {
        this.requestUuid = null;
        this.downloadTitle = null;
        this.downloadObject = null;
        this.extraHistoryTags = [];
        this.downloadIndex = null;
        this.isConsumeQueueRunning = false;
        this.downloadQueue = [];
        this.createdHistory = false;
        this.totalPieces = null;
        this.stopDownload = false;
        this.log = (message) => {
            console.log(`<${new Date().toLocaleString()}> ${message}`);
        };
        this.detectStorage = () => {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                return navigator.storage.estimate().then(({ usage, quota }) => {
                    return {
                        usage,
                        quota,
                    };
                });
            }
            return new Error('Unable to detect IndexedDB storage information.');
        };
        this.stop = () => {
            this.stopDownload = true;
        };
        this.updateIndex = (uuid, eof) => {
            if (!uuid) {
                return;
            }
            this.downloadIndex = {
                filename: this.downloadObject ? this.downloadObject['downloadFilename'] : this.downloadTitle,
                fileExtension: this.downloadObject ? this.downloadObject['fileExtension'] : null,
                totalLength: this.downloadObject ? this.downloadObject['totalLength'] : null,
                contentType: this.downloadObject ? this.downloadObject['contentType'] : null,
                pieces: !this.downloadIndex ? [uuid] : [...this.downloadIndex.pieces, uuid],
                finished: false
            };
            if (eof) {
                this.downloadIndex.finished = true;
            }
            _view.storageHelper.encryptSave(this.requestUuid, JSON.stringify(this.downloadIndex), (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (eof) {
                    this.callback(null, this.requestUuid);
                }
                return data;
            });
        };
        this.addToQueue = (filesArray) => {
            filesArray.forEach(file => {
                this.downloadQueue.push(file);
                if (!this.isConsumeQueueRunning) {
                    this.consumeQueue();
                }
            });
            return;
        };
        this.updateProgress = (obj) => {
            if (!this.progressIndicator) {
                return;
            }
            let percent = null;
            if (obj['totalLength']) {
                percent = Math.round(((obj.offset + obj.currentlength) / obj.totalLength) * 100);
            }
            else {
                percent = Math.round(((this.downloadIndex.pieces.length) / this.totalPieces) * 100);
            }
            if (ko.isObservable(this.progressIndicator)) {
                this.progressIndicator(percent);
                this.progressIndicator.valueHasMutated();
                return;
            }
            this.progressIndicator(percent);
        };
        this.updateHistory = () => {
            const date = new Date();
            const history = {
                uuid: [this.requestUuid],
                filename: this.downloadIndex.filename,
                time_stamp: date,
                last_viewed: date,
                path: '',
                url: null,
                domain: null,
                tag: [...this.extraHistoryTags, this.downloadIndex.fileExtension, 'download'],
                color: null
            };
            history.tag = history.tag.filter(tag => tag !== null);
            _view.storageHelper.saveHistory(history, null);
        };
        this.consumeQueue = () => {
            if (this.stopDownload) {
                this.isConsumeQueueRunning = false;
                return;
            }
            this.isConsumeQueueRunning = true;
            const obj = this.downloadQueue.shift();
            let uuid = obj['downloadUuid'] || obj['fileName'];
            if (!uuid) {
                this.isConsumeQueueRunning = false;
                return;
            }
            if (uuid) {
                _view.connectInformationMessage.fetchFiles(uuid, (err, data) => {
                    if (err) {
                        this.callback(err, null);
                        return;
                    }
                    _view.storageHelper.save(uuid, data.data, (err, data) => {
                        if (err) {
                            this.callback(err, null);
                            return;
                        }
                        this.updateIndex(uuid, obj['eof']);
                        this.updateProgress(obj);
                        if (!this.createdHistory) {
                            this.updateHistory();
                            this.createdHistory = true;
                        }
                        if (this.downloadQueue.length > 0) {
                            this.consumeQueue();
                        }
                    });
                });
            }
        };
        if (!window.indexedDB) {
            alert("Your browser doesn't support a stable version of IndexedDB.\nWe recommend you use the Chrome browser.");
        }
        this.requestUuid = requestUuid;
        this.downloadTitle = downloadTitle;
        this.progressIndicator = progressIndicator;
        this.extraHistoryTags = extraHistoryTags;
        this.callback = callback;
        if (files && files.length > 0) {
            this.totalPieces = files.length;
            this.addToQueue(files);
            console.log("CREATED DOWNLOADER");
        }
    }
}
