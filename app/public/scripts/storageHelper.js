class StorageHelper {
    constructor() {
        this.downloadPool = ko.observable({});
        this.currentAssembly = ko.observable({});
        this.assemblyQueue = ko.observableArray([]);
        this.uploadPool = ko.observable({});
        this.databaseWorker = new DatabaseWorker();
        this.hiddenAnchor = document.createElement('a');
        this.removeFromPool = (pool, uuid) => {
            const temp = pool();
            delete temp[uuid];
            pool(temp);
        };
        this.createDownload = (requestUuid, files = null, downloadTitle, extraHistoryTags, callback, stream) => {
            if (this.downloadPool()[requestUuid]) {
                callback(`Download already exists!`, requestUuid);
                console.log('Download already exists');
                return;
            }
            const progress = ko.observable(0);
            const download = {
                requestSerial: requestUuid,
                filename: downloadTitle,
                progress,
                instance: new Downloader(requestUuid, files, downloadTitle, progress, extraHistoryTags, (err, data) => {
                    this.removeFromPool(this.downloadPool, requestUuid);
                    callback(err, data);
                })
            };
            this.downloadPool({ ...this.downloadPool(), [requestUuid]: download });
            return this.downloadPool()[requestUuid].instance;
        };
        this.createAssembler = (requestUuid, callback) => {
            if (this.currentAssembly[requestUuid]) {
                callback(`Assembly already exists!`, requestUuid);
                console.log('Assembly already exists');
                return;
            }
            if (Object.keys(this.currentAssembly()).length === 0) {
                const progress = ko.observable(0);
                const assembler = {
                    requestSerial: requestUuid,
                    filename: requestUuid,
                    progress,
                    instance: new Assembler(requestUuid, progress, (err, data) => {
                        this.currentAssembly({});
                        callback(err, data);
                        const nextRequest = this.assemblyQueue.shift();
                        nextRequest ? this.createAssembler(nextRequest.uuid, nextRequest.callback) : null;
                    })
                };
                this.currentAssembly({ [requestUuid]: assembler });
                return this.currentAssembly()[requestUuid];
            }
            else {
                this.assemblyQueue.push({ uuid: requestUuid, callback });
                return requestUuid;
            }
        };
        this.createUploader = (requestUuid, file, path, extraTags, callback) => {
            const progress = ko.observable(0);
            const uploader = {
                requestSerial: requestUuid,
                filename: file.name,
                progress,
                instance: new Uploader(requestUuid, file, path, extraTags, progress, (err, data) => {
                    data === requestUuid ? this.removeFromPool(this.uploadPool, requestUuid) : null;
                    callback(err, data);
                })
            };
            this.uploadPool({ ...this.uploadPool(), [requestUuid]: uploader });
            return this.uploadPool()[requestUuid];
        };
        this.youtubeHistory = (requestUUIDs, youtubeId, title, extraTags) => {
            const date = new Date();
            const history = {
                uuid: requestUUIDs,
                filename: title,
                time_stamp: date,
                last_viewed: date,
                path: "",
                url: 'YouTube',
                domain: 'YouTube',
                tag: [...extraTags, 'upload', 'local'],
                color: null,
                youtubeId
            };
            history.tag = history.tag.filter(tag => tag !== null);
            _view.storageHelper.saveHistory(history, (err, data) => {
            });
        };
        this.createUpdateIndex = (uuid, index, callback) => {
            console.log(index);
            this.encryptSave(uuid, JSON.stringify(index), callback);
        };
        this.delete = (uuid, callback) => {
            return this.databaseWorker.delete(uuid, callback);
        };
        this.save = (uuid, data, callback) => {
            return this.databaseWorker.save(uuid, data, callback);
        };
        this.encryptSave = (uuid, data, callback) => {
            return this.databaseWorker.encryptSave(uuid, data, callback);
        };
        this.replaceHistory = (histories, callback) => {
            return this.databaseWorker.replaceHistory(histories, callback ? callback : null);
        };
        this.saveHistory = (history, callback) => {
            return this.databaseWorker.saveHistory(history, callback ? callback : null);
        };
        this.decryptLoad = (uuid, callback) => {
            return this.databaseWorker.decryptLoad(uuid, callback);
        };
        this.getIndex = (uuid, callback) => {
            return this.databaseWorker.decryptLoad(uuid, callback);
        };
        this.getDownloader = (requestUuid) => {
            return this.downloadPool[requestUuid].instance;
        };
        this.createBlob = (data, contentType) => {
            const blob = new Blob([data], { type: contentType });
            return URL.createObjectURL(blob);
        };
        this.downloadBlob = (url, filename) => {
            this.hiddenAnchor['href'] = url;
            this.hiddenAnchor['download'] = filename;
            this.hiddenAnchor.click();
            this.hiddenAnchor['href'] = null;
            this.hiddenAnchor['download'] = null;
            URL.revokeObjectURL(url);
        };
        this.detectStorage = (callback) => {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                return navigator.storage.estimate().then(({ usage, quota }) => {
                    callback(null, { usage, quota });
                });
            }
            return callback(new Error('Unable to detect IndexedDB storage information.'), null);
        };
    }
}
