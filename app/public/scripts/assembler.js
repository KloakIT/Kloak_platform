class Assembler {
    constructor(requestUuid, callback) {
        this.fileOffsets = [];
        this.fileUuids = [];
        this.getInstance = () => {
            return this.assembler;
        };
        this.log = (message) => {
            console.log(`<${new Date().toLocaleString()}> ${message}`);
        };
        this.messageChannel = async (e) => {
            const command = e.data.cmd;
            const payload = e.data.payload;
            let uuid = null;
            switch (command) {
                case 'FILE_INDEX':
                    this.downloadIndex = payload;
                    this.fileOffsets = await Object.keys(this.downloadIndex[this.requestUuid].pieces).sort();
                    console.log(this.fileOffsets);
                    await this.fileOffsets.forEach(offset => {
                        this.fileUuids.push(this.downloadIndex[this.requestUuid].pieces[offset]);
                    });
                    this.assembler.postMessage({
                        cmd: 'START',
                        payload: this.downloadIndex,
                    });
                    break;
                case 'NEXT_PIECE':
                    uuid = await this.fileUuids.shift();
                    this.databaseWorker.postMessage({
                        cmd: 'RETRIEVE_DATA',
                        payload: { database: 'kloak-files', uuid },
                    });
                    break;
                case 'RETRIEVED_PIECE':
                    const pgpMessage = Buffer.from(payload.arrBuffer).toString();
                    console.log(pgpMessage);
                    _view.sharedMainWorker.decryptStreamWithoutPublicKey(pgpMessage, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        const arrBuffer = Buffer.from(data.data).buffer;
                        this.assembler.postMessage({
                            cmd: 'RETRIEVED_PIECE',
                            payload: {
                                end: this.fileUuids.length === 0,
                                offset: parseInt(this.fileOffsets.shift()),
                                arrBuffer: arrBuffer,
                            },
                        }, [arrBuffer]);
                    });
                    return;
                case 'ASSEMBLED_FILE':
                    this.callback({
                        filename: this.requestUuid,
                        extension: this.downloadIndex[this.requestUuid].fileExtension,
                        url: payload.fileUrl,
                    });
                    this.assembler.terminate();
                    this.databaseWorker.terminate();
                    break;
                default:
                    break;
            }
        };
        this.assemblerWorkerFn = () => {
            let requestUuid = null;
            let fileUint8Array = null;
            let fileIndex = null;
            let tempPieces = [];
            let offset = 0;
            const log = (message) => {
                console.log(`<${new Date().toLocaleString()}> ${message}`);
            };
            const createBlob = () => {
                const blob = new Blob([fileUint8Array], {
                    type: fileIndex.contentType,
                });
                console.log(blob.size);
                const fileUrl = URL.createObjectURL(blob);
                return fileUrl;
            };
            self.addEventListener('message', async (e) => {
                const command = e.data.cmd;
                const payload = e.data.payload;
                const postMessage = self.postMessage;
                switch (command) {
                    case 'START':
                        log('Assembler: Assembly Worker started.');
                        requestUuid = Object.keys(payload)[0];
                        fileIndex = await payload[Object.keys(payload)[0]];
                        if (fileIndex.totalLength) {
                            fileUint8Array = new Uint8Array(fileIndex['totalLength']);
                        }
                        postMessage({
                            cmd: 'NEXT_PIECE',
                            payload: {},
                        });
                        break;
                    case 'RETRIEVED_PIECE':
                        if (!fileUint8Array) {
                            tempPieces.push(payload);
                            if (payload.end) {
                                let totalLength = 0;
                                tempPieces.forEach(piece => {
                                    totalLength += piece.arrBuffer.byteLength;
                                });
                                fileUint8Array = await new Uint8Array(totalLength);
                                tempPieces.forEach(piece => {
                                    fileUint8Array.set(new Uint8Array(piece.arrBuffer), piece.offset);
                                });
                            }
                        }
                        else {
                            fileUint8Array.set(new Uint8Array(payload.arrBuffer), payload.offset);
                        }
                        if (!payload.end) {
                            postMessage({
                                cmd: 'NEXT_PIECE',
                                payload: {},
                            });
                            return;
                        }
                        postMessage({
                            cmd: 'ASSEMBLED_FILE',
                            payload: { fileUrl: createBlob() },
                        });
                        // PROBLEM HERE
                        // if (!fileIndex.totalLength) {
                        // 	await tempPieces.push(payload)
                        // } else {
                        // 	if (!fileUint8Array) {
                        // 		fileUint8Array = new Uint8Array(fileIndex.totalLength as any)
                        // 	}
                        // 	fileUint8Array.set(payload.arrBuffer, offset)
                        // 	console.log(payload.arrBuffer)
                        // 	offset += payload.arrBuffer.byteLength
                        // }
                        // const postMessage = self.postMessage as any
                        // if (payload.end) {
                        // 	const postMessage = self.postMessage as any
                        // 	postMessage({
                        // 		cmd: 'ASSEMBLED_FILE',
                        // 		payload: { fileUrl: createBlob() },
                        // 	})
                        // 	return
                        // }
                        // if (!payload.end) {
                        // 	postMessage({
                        // 		cmd: 'NEXT_PIECE',
                        // 		payload: {},
                        // 	})
                        // 	return
                        // }
                        // if(payload.end) {
                        // 	// if (fileUint8Array) {
                        // 	// 	const postMessage = self.postMessage as any
                        // 	// 	postMessage({
                        // 	// 		cmd: 'ASSEMBLED_FILE',
                        // 	// 		payload: { fileUrl: createBlob() },
                        // 	// 	})
                        // 	// 	return
                        // 	// }
                        // 	// let totalLength = 0
                        // 	// await tempPieces.map(piece => {
                        // 	// 	totalLength += piece.arrBuffer.byteLength
                        // 	// })
                        // 	// await tempPieces.map(async piece => {
                        // 	// 	fileUint8Array = await new Uint8Array(totalLength)
                        // 	// 	fileUint8Array.set(piece.arrBuffer, offset)
                        // 	// 	offset += piece.arrBuffer.byteLength
                        // 	// 	console.log(offset)
                        // 	// })
                        // 	// const postMessage = self.postMessage as any
                        // 	// 	postMessage({
                        // 	// 		cmd: 'ASSEMBLED_FILE',
                        // 	// 		payload: { fileUrl: createBlob() },
                        // 	// 	})
                        // }
                        // break;
                        // case 'RETRIEVED_PIECE':
                        // 	if (!fileIndex.totalLength) {
                        // 		console.log(payload)
                        // 		temp[payload.offset] = payload
                        // 		if (payload.end) {
                        // 			let totalLength = 0;
                        // 			let keys = Object.keys(fileIndex[requestUuid].pieces).sort()
                        // 			keys.forEach(key => {
                        // 				totalLength += temp[key].arrBuffer.byteLength
                        // 			})
                        // 			console.log(totalLength)
                        // 			// let chunksize = temp[]
                        // 			// console.log(temp)
                        // 			// temp.forEach(payload => {
                        // 			// 	totalLength += payload.arrBuffer.byteLength
                        // 			// })
                        // 			// fileUint8Array = new Uint8Array(totalLength)
                        // 			// temp.forEach(payload => {
                        // 			// 	fileUint8Array.set(new Uint8Array(payload.arrBuffer), parseInt(payload.offset))
                        // 			// })
                        // 			// const postMessage = self.postMessage as any
                        // 			// postMessage({
                        // 			// 	cmd: 'ASSEMBLED_FILE',
                        // 			// 	payload: { fileUrl: createBlob() },
                        // 			// })
                        // 			// temp = null
                        // 		}
                        // 		return
                        // 	}
                        // 	if (!fileUint8Array) {
                        // 		fileUint8Array = new Uint8Array(fileIndex.totalLength as any)
                        // 		fileUint8Array.set(
                        // 			new Uint8Array(payload.arrBuffer),
                        // 			parseInt(payload.offset)
                        // 		)
                        // 		return
                        // 	}
                        // 	fileUint8Array.set(
                        // 		new Uint8Array(payload.arrBuffer),
                        // 		parseInt(payload.offset)
                        // 	)
                        // 	if (payload.end) {
                        // 		console.log('FINISHED')
                        // 		const postMessage = self.postMessage as any
                        // 		postMessage({
                        // 			cmd: 'ASSEMBLED_FILE',
                        // 			payload: { fileUrl: createBlob() },
                        // 		})
                        // 	}
                        break;
                    default:
                        break;
                }
            });
        };
        this.databaseWorkerFn = () => {
            importScripts(`${self.location.origin}/scripts/jimp.min.js`);
            let db = null;
            let fs = null;
            let currentDB = null;
            const log = (message) => {
                console.log(`<${new Date().toLocaleString()}> ${message}`);
            };
            const instanceInit = (database) => {
                return new Promise((resolve, reject) => {
                    const req = indexedDB.open(database, 1);
                    req.onupgradeneeded = (e) => {
                        db = e.target['result'];
                    };
                    req.onsuccess = (e) => {
                        db = e.target['result'];
                        if (e.target['readyState'] === 'done') {
                            resolve();
                        }
                    };
                    req.onerror = (e) => {
                        reject();
                    };
                });
            };
            const getFileIndex = (filename) => {
                fs = db.transaction('kloak-index', 'readwrite').objectStore('kloak-index');
                fs.get(filename).onsuccess = (e) => {
                    const postMessage = self.postMessage;
                    postMessage({ cmd: 'FILE_INDEX', payload: e.target['result'] });
                };
            };
            const getFileData = (uuid) => {
                const pgpStart = '-----BEGIN PGP MESSAGE-----\n\n';
                const pgpEnd = '\n-----END PGP MESSAGE-----';
                fs = db
                    .transaction('kloak-files', 'readonly')
                    .objectStore('kloak-files');
                fs.get(uuid).onsuccess = async (e) => {
                    const pgpMessage = pgpStart.concat(e.target['result'], pgpEnd);
                    const arrBuffer = Buffer.from(pgpMessage).buffer;
                    const postMessage = self.postMessage;
                    postMessage({
                        cmd: 'RETRIEVED_PIECE',
                        payload: {
                            arrBuffer,
                        },
                    }, [arrBuffer]);
                };
            };
            self.addEventListener('message', (e) => {
                const command = e.data.cmd;
                const payload = e.data.payload;
                switch (command) {
                    case 'START':
                        log('Assembler: Database Worker started.');
                        currentDB = payload.database;
                        instanceInit(payload.database).then(() => {
                            getFileIndex(payload.requestUuid);
                        });
                        break;
                    case 'RETRIEVE_DATA':
                        if (currentDB !== payload.database) {
                            currentDB = payload.database;
                            instanceInit(payload.database).then(() => {
                                getFileData(payload.uuid);
                            });
                            return;
                        }
                        getFileData(payload.uuid);
                        break;
                    default:
                        break;
                }
            });
        };
        this.callback = callback;
        this.requestUuid = requestUuid;
        this.assembler = new GenericWorker(this.assemblerWorkerFn).getWorker();
        this.databaseWorker = new GenericWorker(this.databaseWorkerFn).getWorker();
        this.databaseWorker.postMessage({
            cmd: 'START',
            payload: { database: 'kloak-index', requestUuid },
        });
        this.assembler.addEventListener('message', this.messageChannel);
        this.databaseWorker.addEventListener('message', this.messageChannel);
    }
}
