class Downloader {
    constructor(callback, requestUuid, options = { hasProgress: true }) {
        this.requestUuid = null;
        this.downloadObject = null;
        this.downloadIndex = null;
        this.downloadState = 'stop';
        this.isConsumeQueueRunning = false;
        this.downloadQueue = [];
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
                    break;
                case 'RETRIEVED_INDEX':
                    this.downloadIndex = payload[this.requestUuid];
                    break;
                case 'FILE_DOWNLOAD_FINISHED':
                    this.callback({
                        cmd: 'FILE_DOWNLOAD_FINISHED',
                        payload: { requestUuid: this.requestUuid },
                    });
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
                this.consumeQueue();
            }
        };
        this.pause = () => {
            this.downloadState = 'pause';
        };
        this.stop = () => {
            this.downloadState = 'stop';
        };
        this.terminate = () => {
            this.indexDBWorker.instance.terminate();
            this.indexDBWorker = null;
            this.dataDBWorker.instance.terminate();
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
        this.updateIndex = (obj) => {
            if (!this.downloadObject) {
                this.downloadObject = obj;
                this.callback({
                    cmd: 'CREATE_FILE_HISTORY',
                    payload: {
                        uuid: obj.requestUuid,
                        time_stamp: new Date(),
                        path: '',
                        icon: null,
                        url: obj.url,
                        urlShow: obj.downloadFilename,
                        domain: obj.url.split('/').splice(0, 3).join('/'),
                        detail: '',
                        tag: [obj.fileExtension, 'download'],
                        color: null,
                        fileIndex: null,
                    },
                });
            }
            if (!this.downloadIndex) {
                this.downloadIndex = {
                    [this.requestUuid]: {
                        filename: obj.downloadFilename,
                        fileExtension: obj.fileExtension,
                        totalLength: obj.totalLength,
                        contentType: obj.contentType,
                        pieces: {
                            [obj.offset]: obj.downloadUuid,
                        },
                        finished: false,
                    },
                };
                return;
            }
            this.downloadIndex = {
                [this.requestUuid]: {
                    filename: obj.downloadFilename,
                    fileExtension: obj.fileExtension,
                    totalLength: obj.totalLength,
                    contentType: obj.contentType,
                    pieces: {
                        ...this.downloadIndex[this.requestUuid].pieces,
                        [obj.offset]: obj.downloadUuid,
                    },
                    finished: false,
                },
            };
            console.log(this.downloadIndex);
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
                this.consumeQueue();
            }
            console.log('added to queue');
            console.log(obj);
            return;
        };
        this.updateProgress = (downloadObj) => {
            this.callback({
                cmd: 'UPDATE_PROGRESS',
                payload: {
                    requestUuid: downloadObj.requestUuid,
                    percent: Math.round(((downloadObj.offset + downloadObj.currentlength) /
                        downloadObj.totalLength) *
                        100),
                },
            });
        };
        this.consumeQueue = () => {
            this.isConsumeQueueRunning = true;
            switch (true) {
                case this.downloadState === 'stop':
                case this.downloadState === 'pause':
                case this.downloadQueue.length === 0:
                    this.isConsumeQueueRunning = false;
                    return;
                case this.downloadQueue.length > 0:
                    if (this.downloadState === 'running') {
                        const downloadObj = this.downloadQueue.shift();
                        // TESTING DOWNLOAD
                        // TESTING DOWNLOAD
                        _view.connectInformationMessage.fetchFiles(downloadObj.downloadUuid, (err, buffer) => {
                            // if (err) {
                            // 	return console.dir(err)
                            // }
                            console.log(buffer[0].data);
                            const arrBuffer = Buffer.from(buffer[0].data).buffer;
                            this.updateIndex(downloadObj);
                            this.dataDBWorker.instance.postMessage({
                                cmd: 'SAVE_DATA',
                                payload: {
                                    downloadUuid: downloadObj.downloadUuid,
                                    arrayBuffer: arrBuffer,
                                },
                            }, [arrBuffer]);
                            if (this.options['hasProgress']) {
                                this.updateProgress(downloadObj);
                            }
                        });
                    }
                    this.sleep(1000).then(() => {
                        this.consumeQueue();
                    });
                    break;
            }
        };
        if (!window.indexedDB) {
            alert("Your browser doesn't support a stable version of IndexedDB.\nWe recommend you use the Chrome browser.");
        }
        this.options = options;
        this.callback = callback;
        this.requestUuid = requestUuid;
        this.indexDBWorker = this.createDatabaseWorker('index');
        this.dataDBWorker = this.createDatabaseWorker('data');
    }
}
