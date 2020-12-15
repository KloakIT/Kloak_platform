class Assembler {
    constructor(requestUuid, progressIndicator, callback) {
        this.progressIndicator = null;
        this.filePieces = null;
        this.totalPieces = null;
        this.isOnline = false;
        this.getIndex = (uuid) => {
            _view.storageHelper.getIndex(uuid, (err, data) => {
                if (err) {
                    this.terminate();
                    this.callback(err, null);
                    return;
                }
                try {
                    this.log(`File: ${this.requestUuid} got index.`);
                    this.downloadIndex = data;
                    this.isOnline = this.downloadIndex.online;
                    this.filePieces = this.downloadIndex.pieces;
                    this.totalPieces = this.filePieces.length;
                    this.updateProgress();
                    this.retrieveData(this.filePieces.shift());
                }
                catch (err) {
                    this.callback(err, null);
                    this.terminate();
                }
            });
        };
        this.updateProgress = () => {
            if (!this.progressIndicator) {
                return;
            }
            const percent = Math.floor(((this.totalPieces - this.filePieces.length) / this.totalPieces) * 100);
            if (ko.isObservable(this.progressIndicator)) {
                this.progressIndicator(percent);
                this.progressIndicator.valueHasMutated();
                return;
            }
            this.progressIndicator(percent);
        };
        this.getWorker = (callback) => {
            const url = URL.createObjectURL(new Blob([`(${this.workerFn.toString()})()`], { type: 'text/javascript' }));
            const worker = new Worker(url);
            worker.addEventListener('message', (e) => {
                if (callback) {
                    if (e.data.cmd === 'ERROR') {
                        callback(new Error(e.data.payload), null);
                        return;
                    }
                    callback(null, e.data.payload);
                }
            });
            URL.revokeObjectURL(url);
            return worker;
        };
        this.log = (message) => {
            console.log(`<${new Date().toLocaleString()}> ${message}`);
        };
        this.getFileType = (magicNumber) => {
            const n = magicNumber.toLowerCase();
            switch (true) {
                case n.startsWith('1a45dfa3'):
                    this.downloadIndex['contentType'] = 'video/webm';
                    this.downloadIndex['fileExtension'] = 'webm';
                    break;
                case n.startsWith('504b0304'):
                case n.startsWith('504b0506'):
                case n.startsWith('504b0708'):
                    this.downloadIndex['contentType'] = 'application/zip';
                    this.downloadIndex['fileExtension'] = 'zip';
                    break;
                case n.startsWith('0000001866747970'):
                case n.startsWith("0000002066747970"):
                    this.downloadIndex['contentType'] = 'video/mp4';
                    this.downloadIndex['fileExtension'] = 'mp4';
                    break;
                case n.startsWith('494433'):
                case n.startsWith('fffb'):
                case n.startsWith('fff3'):
                case n.startsWith('fff2'):
                    this.downloadIndex['contentType'] = "audio/mpeg";
                    this.downloadIndex['fileExtension'] = 'mp3';
                    break;
            }
        };
        this.retrieveData = (uuid) => {
            if (!uuid) {
                return;
            }
            // if (this.isOnline) {
            // 	_view.storageHelper.decryptRetrieveOnline(piece as string[], (err, data) => {
            // 		console.log(data)
            // 	})
            // 	console.log(piece)
            // 	console.log("ONLINE")
            // } else {
            _view.storageHelper.getDecryptLoad(uuid, (err, data) => {
                if (err) {
                    this.callback(err, null);
                    return;
                }
                this.assembler.postMessage({ cmd: 'DATA', payload: { uuid, buffer: data, eof: this.filePieces.length === 0 } }, [data]);
            });
        };
        // }
        this.messageChannel = async (e) => {
            const command = e.data.cmd;
            const payload = e.data.payload;
            let uuid = null;
            switch (command) {
                case 'NEXT_PIECE':
                    uuid = await this.filePieces.shift();
                    this.updateProgress();
                    this.retrieveData(uuid);
                    break;
                case 'ASSEMBLED_FILE':
                    this.terminate();
                    const filename = this.downloadIndex.filename;
                    let extension = this.downloadIndex.fileExtension;
                    let contentType = this.downloadIndex.contentType;
                    if (!extension || !contentType) {
                        this.magicNumber = await Buffer.from(payload.buffer.slice(0, 10)).toString('hex');
                        await this.getFileType(this.magicNumber);
                        extension = this.downloadIndex.fileExtension;
                        contentType = this.downloadIndex.contentType;
                    }
                    this.log(`File: ${this.requestUuid} assembly complete.`);
                    this.terminate();
                    this.callback(null, { filename, contentType, extension, buffer: payload.buffer });
                    break;
                default:
                    break;
            }
        };
        this.terminate = () => {
            if (this.assembler) {
                this.assembler.terminate();
                this.assembler = null;
            }
        };
        this.workerFn = () => {
            importScripts(`${self.location.origin}/scripts/jimp.min.js`);
            let data = [];
            let time = 0;
            let t0 = null;
            let t1 = null;
            let fileUint8Array = null;
            let index = 0;
            self.addEventListener('message', async (e) => {
                const command = e.data.cmd;
                const payload = e.data.payload;
                const postMessage = self.postMessage;
                switch (command) {
                    case 'DATA':
                        t0 = performance.now();
                        if (!fileUint8Array) {
                            fileUint8Array = await new Uint8Array(payload.buffer);
                        }
                        else {
                            let nextUint8Array = new Uint8Array(payload.buffer);
                            let tempUint8Array = new Uint8Array(fileUint8Array.byteLength + nextUint8Array.byteLength);
                            tempUint8Array.set(fileUint8Array, 0);
                            tempUint8Array.set(nextUint8Array, fileUint8Array.byteLength);
                            fileUint8Array = tempUint8Array;
                            tempUint8Array = null;
                            nextUint8Array = null;
                            /* PREVIOUS WAY OF COMBINING UINT8ARRAYS, VERY SLOW!
    
                            fileUint8Array = new Uint8Array([...fileUint8Array, ...new Uint8Array(payload.buffer)])
    
                            */
                        }
                        t1 = performance.now();
                        time += t1 - t0;
                        if (!payload.eof) {
                            postMessage({ cmd: 'NEXT_PIECE', payload: {} });
                            console.log(`TOTAL ASSEMBLY TIME: ${time.toFixed(2)}ms | ${(time / 1000).toFixed(2)} s`);
                            return;
                        }
                        if (payload.eof) {
                            console.log(data);
                            postMessage({ cmd: 'ASSEMBLED_FILE', payload: { buffer: fileUint8Array.buffer } }, [fileUint8Array.buffer]);
                        }
                        break;
                    default:
                        break;
                }
            });
        };
        this.requestUuid = requestUuid;
        this.progressIndicator = progressIndicator;
        this.callback = callback;
        this.assembler = this.getWorker();
        this.assembler.addEventListener('message', this.messageChannel);
        this.getIndex(requestUuid);
    }
}
