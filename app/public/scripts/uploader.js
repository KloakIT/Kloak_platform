class Uploader {
    constructor(requestUuid, file, path, extraTags, progressIndicator, callback) {
        this.chunkSize = 1048576;
        this.progressIndicator = null;
        this.pieces = [];
        this.totalPieces = 0;
        this.extraTags = [];
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
        this.generateOffsetUUID = (offset = 0) => {
            if (offset > this.fileSize) {
                this.createIndex();
                this.createHistory();
                this.beginFileRead();
                return;
            }
            this.pieces.push({ offset, uuid: uuid_generate() });
            this.totalPieces = this.pieces.length;
            if (offset <= this.fileSize) {
                this.generateOffsetUUID(offset + this.chunkSize);
            }
        };
        this.beginFileRead = () => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(this.file);
            reader.onloadend = (e) => {
                this.arrayBuffer = e.target['result'];
                console.log(this.arrayBuffer.byteLength);
                this.disassemblyWorker = this.getWorker(this.callback);
                this.disassemblyWorker.postMessage({ cmd: 'START', payload: { arrayBuffer: this.arrayBuffer } }, [this.arrayBuffer]);
            };
        };
        this.createHistory = () => {
            const date = new Date();
            const history = {
                uuid: this.uuid,
                filename: this.file.name,
                time_stamp: date,
                last_viewed: date,
                path: this.path,
                url: 'Upload',
                domain: 'Upload',
                tag: [this.file.type.split('/')[0], this.file.type.split('/')[1], ...this.extraTags, 'upload', 'local'],
                color: null,
                size: this.fileSize
            };
            history.tag = history.tag.filter(tag => tag !== null);
            _view.storageHelper.saveHistory(history, this.callback);
        };
        this.createIndex = () => {
            const index = {
                filename: this.file.name,
                fileExtension: this.file.name.split('.').pop(),
                totalLength: this.file.size,
                contentType: this.file.type,
                pieces: this.pieces.map(piece => piece['uuid']),
                finished: true,
            };
            _view.storageHelper.encryptSave(this.uuid, JSON.stringify(index), (err, data) => {
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
                    const piece = this.pieces.shift();
                    this.disassemblyWorker.postMessage({ cmd: 'NEXT_PIECE', payload: { uuid: piece.uuid, offset: piece.offset, chunkSize: this.chunkSize, eof: this.pieces.length === 0 } });
                    this.updateProgress();
                    break;
                case 'DATA':
                    _view.storageHelper.encryptSave(payload.uuid, payload.arrayBuffer, (err, data) => {
                        if (err) {
                            this.disassemblyWorker.terminate();
                            this.callback(err, null);
                            return;
                        }
                        if (payload.eof) {
                            this.callback(null, this.uuid);
                            return;
                        }
                        const piece = this.pieces.shift();
                        this.disassemblyWorker.postMessage({ cmd: 'NEXT_PIECE', payload: { uuid: piece.uuid, offset: piece.offset, chunkSize: this.chunkSize, eof: this.pieces.length === 0 } });
                        this.updateProgress();
                    });
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
        this.uuid = requestUuid;
        this.path = path;
        this.file = file;
        this.fileSize = file.size;
        this.extraTags = extraTags;
        this.progressIndicator = progressIndicator;
        if (this.fileSize <= this.chunkSize) {
            this.chunkSize = Math.floor(this.fileSize / 5);
        }
        this.callback = callback;
        this.generateOffsetUUID();
    }
}
