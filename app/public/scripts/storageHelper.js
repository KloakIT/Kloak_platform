class StorageHelper {
    constructor() {
        this.downloadPool = ko.observable({});
        this.assemblyPool = ko.observable({});
        this.uploadPool = ko.observable({});
        this.databaseWorker = new DatabaseWorker();
        this.removeFromPool = (pool, uuid) => {
            const temp = pool();
            delete temp[uuid];
            pool(temp);
        };
        this.createDownload = (requestUuid, files = null, downloadTitle, extraHistoryTags, callback) => {
            if (this.downloadPool()[requestUuid]) {
                callback(`Download already exists!`, requestUuid);
                console.log('Download already exists');
                return;
            }
            const progress = ko.observable(0);
            const download = {
                requestSerial: requestUuid,
                filename: requestUuid,
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
            if (this.assemblyPool[requestUuid]) {
                callback(`Assembly already exists!`, requestUuid);
                console.log('Assembly already exists');
                return;
            }
            const progress = ko.observable(0);
            const assembler = {
                requestSerial: requestUuid,
                filename: requestUuid,
                progress,
                instance: new Assembler(requestUuid, progress, (err, data) => {
                    this.removeFromPool(this.assemblyPool, requestUuid);
                    callback(err, data);
                })
            };
            this.assemblyPool({ ...this.assemblyPool(), [requestUuid]: assembler });
            return this.assemblyPool()[requestUuid];
        };
        this.createUploader = (requestUuid, file, path, callback) => {
            const progress = ko.observable(0);
            const uploader = {
                requestSerial: requestUuid,
                filename: file.name,
                progress,
                instance: new Uploader(requestUuid, file, path, progress, (err, data) => {
                    data === requestUuid ? this.removeFromPool(this.uploadPool, requestUuid) : null;
                    callback(err, data);
                })
            };
            this.uploadPool({ ...this.uploadPool(), [requestUuid]: uploader });
            console.log(this.uploadPool());
            return this.uploadPool()[requestUuid];
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
    }
}
