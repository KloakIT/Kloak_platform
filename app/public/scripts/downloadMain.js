class DownloadMain {
    constructor() {
        this.downloadPool = {};
        this.newDownload = (requestUuid, downloadTitle, extraHistoryTags, callback) => {
            if (this.downloadPool[requestUuid]) {
                callback(`Download already exists!`, requestUuid);
                console.log('Download already exists');
                return;
            }
            const percent = ko.observable(0);
            this.downloadPool[requestUuid] = {
                requestSerial: requestUuid,
                filename: requestUuid,
                percent,
                downloader: new Downloader(requestUuid, downloadTitle, percent, extraHistoryTags, callback)
            };
            return this.downloadPool[requestUuid].downloader;
        };
        this.getPercent = (requestUuid) => {
            return this.downloadPool[requestUuid].percent;
        };
        this.getDownloader = (requestUuid) => {
            return this.downloadPool[requestUuid].downloader;
        };
        this.addMultipleQueue = (multipleObj) => {
            if (!this.downloadPool[multipleObj.requestUuid]) {
                return;
            }
            console.log(multipleObj);
            multipleObj.files.forEach(file => {
                const downloadObj = {
                    url: multipleObj.url || "",
                    downloadFilename: multipleObj.requestUuid,
                    acceptRanges: null,
                    fileExtension: '',
                    totalLength: null,
                    contentType: '',
                    lastModified: new Date(),
                    downloadUuid: file.fileName,
                    offset: file.currentStartOffset,
                    currentlength: file.currentLength,
                    eof: file.eof,
                    stopDownload: false,
                    totalPieces: multipleObj.files.length,
                    requestUuid: multipleObj.requestUuid
                };
                this.downloadPool[multipleObj.requestUuid].downloader.addToQueue(downloadObj);
            });
            this.downloadPool[multipleObj.requestUuid].downloader.start();
            return;
        };
        this.cancel = (requestUuid) => {
            const download = this.downloadPool[requestUuid];
            if (download) {
                download.downloader.delete();
            }
        };
        this.terminate = (requestUuid) => {
            const download = this.downloadPool[requestUuid];
            if (download) {
                download.downloader.terminate();
            }
            delete this.downloadPool[requestUuid];
        };
    }
}
