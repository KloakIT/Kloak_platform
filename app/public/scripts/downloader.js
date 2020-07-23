class Downloader {
    constructor(requestUuid, downloadTitle, progressIndicator, extraHistoryTags, callback) {
        this.requestUuid = null;
        this.downloadTitle = null;
        this.downloadObject = null;
        this.extraHistoryTags = [];
        this.downloadIndex = null;
        this.downloadState = 'stop';
        this.isConsumeQueueRunning = false;
        this.downloadQueue = [];
        this.createdHistory = false;
        this.sleep = (ms) => {
            return new Promise((resolve) => setTimeout(resolve, ms));
        };
        this.log = (message) => {
            console.log(`<${new Date().toLocaleString()}> ${message}`);
        };
        this.messageChannel = (e) => {
            const command = e.data.cmd;
            const payload = e.data.payload;
            switch (command) {
                case 'DATABASE_READY':
                    if (payload.type === 'indexRetriever') {
                        this.indexDBWorker.state = 'READY';
                        this.log('DB: IndexRetriever ready.');
                        this.indexDBWorker.instance.postMessage({
                            cmd: 'RETRIEVE_INDEX',
                            payload: {},
                        });
                        return;
                    }
                    if (payload.type === 'dataRetriever') {
                        this.dataDBWorker.state = 'READY';
                        this.log('DB: DataRetriever ready.');
                        return;
                    }
                    break;
                case 'DATABASE_ERROR':
                    this.callback(new Error("Unable to open IndexedDB"), null);
                    break;
                case 'RETRIEVED_INDEX':
                    this.downloadIndex = payload[this.requestUuid];
                    break;
                case 'FILE_DOWNLOAD_FINISHED':
                    this.callback(null, this.requestUuid);
                // this.terminate()
                default:
                    break;
            }
        };
        this.createDatabaseWorker = (type) => {
            switch (type) {
                case 'index':
                    const indexDBWorker = {
                        type: type,
                        instance: new IndexRetriever().getInstance(),
                        state: 'NOT READY',
                    };
                    indexDBWorker.instance.addEventListener('message', this.messageChannel);
                    return indexDBWorker;
                case 'data':
                    const dataDBWorker = {
                        type: type,
                        instance: new DataRetriever().getInstance(),
                        state: 'NOT READY',
                    };
                    dataDBWorker.instance.addEventListener('message', this.messageChannel);
                    return dataDBWorker;
                default:
                    break;
            }
        };
        this.start = () => {
            this.downloadState = 'running';
            if (!this.isConsumeQueueRunning) {
                this.consumeQueue(this.downloadQueue.shift());
            }
        };
        this.pause = () => {
            this.downloadState = 'pause';
        };
        this.stop = () => {
            this.downloadState = 'stop';
        };
        this.deleteHistory = (requestUuid) => {
            let db = null;
            let req = window.indexedDB.open('kloak-history', 1);
            req.onupgradeneeded = (e) => {
                db = e.target['result'];
                db.createObjectStore('history');
            };
            req.onsuccess = (e) => {
                const db = e.target['result'];
                const fs = db
                    .transaction('history', 'readonly')
                    .objectStore('history');
                fs.get(0).onsuccess = async (e) => {
                    let fileHistory = [];
                    if (e.target.result) {
                        fileHistory = await e.target['result'].filter(history => history.uuid !== requestUuid);
                    }
                    fileHistory.push(history);
                    const fs = db
                        .transaction('history', 'readwrite')
                        .objectStore('history');
                    fs.put(fileHistory, 0).onsuccess = (e) => { };
                };
            };
            req.onerror = (e) => {
                this.callback(new Error("Unable to create file history."), null);
            };
        };
        this.delete = (files) => {
            if (files) {
                this.dataDBWorker.instance.postMessage({ cmd: 'DELETE_DATA', payload: files.shift() });
                if (files.length > 0) {
                    this.sleep(500).then(res => {
                        this.delete(files);
                    });
                    return;
                }
                this.indexDBWorker.instance.postMessage({ cmd: 'DELETE_INDEX', payload: this.requestUuid });
                this.deleteHistory(this.requestUuid);
                return;
            }
            this.downloadState = 'stop';
            this.downloadQueue = [];
            const pieces = Object.values(this.downloadIndex[this.requestUuid].pieces);
            this.delete(pieces);
        };
        this.terminate = () => {
            this.indexDBWorker.instance.terminate();
            this.dataDBWorker.instance.terminate();
            this.indexDBWorker = null;
            this.dataDBWorker = null;
        };
        this.getState = () => {
            return this.downloadState;
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
        this.createHistory = (obj) => {
            const history = {
                uuid: this.requestUuid,
                filename: this.downloadTitle || obj.downloadFilename,
                time_stamp: new Date(),
                path: '',
                icon: null,
                url: obj.url,
                domain: obj.url.split('/').splice(0, 3).join('/'),
                detail: '',
                tag: [obj.fileExtension ? obj.fileExtension : null, 'download'],
                color: null,
                fileIndex: null,
            };
            let db = null;
            if (this.extraHistoryTags.length > 0) {
                history.tag = [...this.extraHistoryTags, ...history.tag];
                history.tag = history.tag.filter(tag => tag !== null || undefined || "");
            }
            history.tag = history.tag.filter(tag => tag !== null || undefined);
            let req = window.indexedDB.open('kloak-history', 1);
            req.onupgradeneeded = (e) => {
                db = e.target['result'];
                db.createObjectStore('history');
            };
            req.onsuccess = (e) => {
                const db = e.target['result'];
                const fs = db
                    .transaction('history', 'readonly')
                    .objectStore('history');
                fs.get(0).onsuccess = (e) => {
                    let fileHistory = [];
                    if (e.target.result) {
                        fileHistory = e.target['result'];
                    }
                    fileHistory.push(history);
                    const fs = db
                        .transaction('history', 'readwrite')
                        .objectStore('history');
                    fs.put(fileHistory, 0).onsuccess = (e) => { };
                };
            };
            req.onerror = (e) => {
                this.callback(new Error("Unable to create file history."), null);
            };
        };
        this.updateIndex = (obj) => {
            if (!this.downloadObject) {
                this.downloadObject = obj;
            }
            this.downloadIndex = {
                [this.requestUuid]: {
                    filename: obj.downloadFilename,
                    fileExtension: obj.fileExtension,
                    totalLength: obj.totalLength,
                    contentType: obj.contentType,
                    pieces: !this.downloadIndex ? {
                        [obj.offset]: obj.downloadUuid,
                    } : {
                        ...this.downloadIndex[this.requestUuid].pieces,
                        [obj.offset]: obj.downloadUuid,
                    },
                    finished: false,
                }
            };
            if (obj.eof) {
                this.downloadIndex[obj.requestUuid].finished = true;
            }
            this.indexDBWorker.instance.postMessage({
                cmd: 'SAVE_INDEX',
                payload: { index: this.downloadIndex },
            });
        };
        this.addToQueue = (obj) => {
            this.downloadQueue.push(obj);
            if (!this.isConsumeQueueRunning) {
                this.consumeQueue(this.downloadQueue.shift());
            }
            return;
        };
        this.updateProgress = (downloadObj) => {
            let percent = null;
            if (!this.progressIndicator) {
                return;
            }
            if (downloadObj.totalLength) {
                percent = Math.round(((downloadObj.offset + downloadObj.currentlength) / downloadObj.totalLength) * 100);
            }
            else {
                console.log(this.downloadIndex[this.requestUuid].pieces);
                console.log(Object.keys(this.downloadIndex[this.requestUuid].pieces).length / downloadObj.totalPieces);
                percent = Math.round(((Object.keys(this.downloadIndex[this.requestUuid].pieces).length) / downloadObj.totalPieces) * 100);
            }
            if (ko.isObservable(this.progressIndicator)) {
                this.progressIndicator(percent);
                this.progressIndicator.valueHasMutated();
                return;
            }
            this.progressIndicator = Math.round(((downloadObj.offset + downloadObj.currentlength) / downloadObj.totalLength) * 100);
        };
        this.consumeQueue = (obj) => {
            this.isConsumeQueueRunning = true;
            if (!obj) {
                this.isConsumeQueueRunning = false;
                return;
            }
            if (obj) {
                if (!this.createdHistory) {
                    this.createHistory(obj);
                }
                this.createdHistory = true;
                _view.connectInformationMessage.fetchFiles(obj.downloadUuid, (err, buffer) => {
                    if (err) {
                        console.log(err);
                        this.callback(err, null);
                        return;
                    }
                    const arrBuffer = Buffer.from(buffer[0].data).buffer;
                    this.updateIndex(obj);
                    this.dataDBWorker.instance.postMessage({
                        cmd: 'SAVE_DATA',
                        payload: {
                            downloadUuid: obj.downloadUuid,
                            arrayBuffer: arrBuffer,
                        },
                    }, [arrBuffer]);
                    this.updateProgress(obj);
                    this.consumeQueue(this.downloadQueue.shift());
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
        this.indexDBWorker = this.createDatabaseWorker('index');
        this.dataDBWorker = this.createDatabaseWorker('data');
    }
}
