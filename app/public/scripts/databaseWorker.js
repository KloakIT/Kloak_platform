class DatabaseWorker {
    constructor() {
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
        this.workerFn = () => {
            importScripts(`${self.location.origin}/scripts/jimp.min.js`);
            const postMessage = self.postMessage;
            const displayLog = (message) => {
                console.log(`<${new Date().toLocaleString()}> ${message}`);
            };
            const getDatabaseVersion = () => {
                return new Promise((resolve, reject) => {
                    const req = indexedDB.open('kloak', 1);
                    let db = null;
                    req.onupgradeneeded = (e) => {
                        db = e.target['result'];
                        db.createObjectStore("kloak");
                    };
                    req.onsuccess = e => {
                        db = e.target['result'];
                        resolve(db.version);
                    };
                    req.onerror = e => {
                        reject(e);
                    };
                });
            };
            const getIDBObjectStore = () => {
                return new Promise((resolve, reject) => {
                    const req = indexedDB.open('data', 1);
                    let db = null;
                    let fs = null;
                    req.onupgradeneeded = (e) => {
                        db = e.target['result'];
                        db.createObjectStore("data");
                    };
                    req.onsuccess = (e) => {
                        db = e.target['result'];
                        const tx = db.transaction("data", "readwrite");
                        tx.oncomplete = e => {
                            self.close();
                        };
                        fs = tx.objectStore("data");
                        resolve(fs);
                    };
                    req.onerror = (e) => {
                        reject(e);
                    };
                });
            };
            const deleteData = async (uuid) => {
                getIDBObjectStore().then((fs) => {
                    const action = fs.delete(uuid);
                    action.onsuccess = e => {
                        postMessage(uuid);
                    };
                    action.onerror = e => {
                        postMessage(uuid);
                    };
                    displayLog(`Successfully deleted ${uuid}`);
                }).catch(e => {
                    postMessage({ cmd: 'ERROR', payload: e });
                });
            };
            const saveData = async (uuid, data) => {
                const removePGP = (pgp) => {
                    let modified = pgp.replace('-----BEGIN PGP MESSAGE-----', '');
                    modified = modified.replace('-----END PGP MESSAGE-----', '');
                    modified = modified.replace('Comment: https://openpgpjs.org', '');
                    modified = modified.replace(/([A-Z])\w+: OpenPGP.js *.*/, '');
                    return modified.trim();
                };
                let encryptedData = Buffer.from(data).toString();
                encryptedData = await removePGP(encryptedData);
                getIDBObjectStore().then((fs) => {
                    fs.put(encryptedData, uuid).onsuccess = e => {
                        postMessage(uuid);
                        displayLog(`Successfully saved ${uuid}`);
                    };
                }).catch(e => {
                    postMessage({ cmd: 'ERROR', payload: e });
                });
            };
            const loadData = (uuid) => {
                const pgpStart = '-----BEGIN PGP MESSAGE-----\n\n';
                const pgpEnd = '\n-----END PGP MESSAGE-----';
                getIDBObjectStore().then((fs) => {
                    fs.get(uuid).onsuccess = async (e) => {
                        const pgpMessage = pgpStart.concat(e.target['result'], pgpEnd);
                        const arrayBuffer = Buffer.from(pgpMessage).buffer;
                        postMessage({ payload: arrayBuffer }, [arrayBuffer]);
                        displayLog(`Successfully loaded ${uuid}`);
                    };
                }).catch(e => {
                    postMessage({ cmd: 'ERROR', payload: e });
                });
            };
            const saveIndex = (uuid, index) => {
                getIDBObjectStore().then((fs) => {
                    fs.put(index[uuid], uuid).onsuccess = e => {
                        postMessage(uuid);
                        displayLog(`Successfully saved ${uuid} index`);
                    };
                }).catch(e => {
                    postMessage({ cmd: 'ERROR', payload: e });
                });
            };
            self.addEventListener('message', e => {
                const command = e.data.cmd;
                const payload = e.data.payload;
                switch (command) {
                    case 'SAVE_DATA':
                        saveData(payload['uuid'], payload['arrayBuffer']);
                        break;
                    case 'LOAD_DATA':
                        loadData(payload['uuid']);
                        break;
                    case 'DELETE_DATA':
                        deleteData(payload['uuid']);
                        break;
                    case 'SAVE_INDEX':
                        saveIndex(payload['uuid'], payload['index']);
                        break;
                    case 'SAVE_HISTORY':
                        saveData(payload['uuid'], payload['data']);
                        break;
                    case 'GET_HISTORY':
                        loadData(payload['uuid']);
                        break;
                }
            });
        };
    }
    delete(uuid, callback) {
        const worker = this.getWorker(callback);
        worker.postMessage({ cmd: 'DELETE_DATA', payload: { uuid } });
    }
    save(uuid, data, callback) {
        if (!uuid) {
            uuid = uuid_generate();
        }
        const arrayBuffer = Buffer.from(data).buffer;
        const worker = this.getWorker(callback);
        worker.postMessage({ cmd: 'SAVE_DATA', payload: { uuid, arrayBuffer } }, [arrayBuffer]);
    }
    encryptSave(uuid, data, callback) {
        const buffer = Buffer.from(data);
        if (!uuid) {
            uuid = uuid_generate();
        }
        _view.sharedMainWorker.encryptStream_withMyPublicKey(buffer, (err, data) => {
            if (err) {
                callback(err, null);
                return;
            }
            const arrayBuffer = data instanceof ArrayBuffer ? data : Buffer.from(data).buffer;
            const worker = this.getWorker(callback);
            worker.postMessage({ cmd: 'SAVE_DATA', payload: { uuid, arrayBuffer } }, [arrayBuffer]);
        });
    }
    decryptLoad(uuid, callback) {
        const worker = this.getWorker((err, data) => {
            if (err) {
                callback(err, null);
                return;
            }
            const pgpMessage = Buffer.from(data).toString();
            _view.sharedMainWorker.decryptStreamWithoutPublicKey(pgpMessage, (err, data) => {
                if (err) {
                    callback(err, null);
                    console.log(err);
                    return;
                }
                callback(null, Buffer.from(data.data).buffer);
            });
        });
        worker.postMessage({ cmd: 'LOAD_DATA', payload: { uuid } });
    }
    saveIndex(uuid, index, callback) {
        const worker = this.getWorker(callback);
        worker.postMessage({ cmd: 'SAVE_INDEX', payload: { uuid, index } });
    }
    replaceHistory(histories, callback) {
        const buffer = Buffer.from(JSON.stringify(histories));
        _view.sharedMainWorker.encryptStream_withMyPublicKey(buffer, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            const worker = this.getWorker(callback);
            worker.postMessage({ cmd: 'SAVE_HISTORY', payload: { uuid: 'history', data } });
        });
    }
    async saveHistory(history, callback) {
        this.decryptLoad('history', (err, data) => {
            let temp = [];
            if (data) {
                temp = JSON.parse(Buffer.from(data).toString());
                console.log(temp);
            }
            temp.push(history);
            const buffer = Buffer.from(JSON.stringify(temp));
            _view.sharedMainWorker.encryptStream_withMyPublicKey(buffer, (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                const worker = this.getWorker(callback);
                worker.postMessage({ cmd: 'SAVE_HISTORY', payload: { uuid: 'history', data } });
            });
        });
    }
    getHistory(callback) {
        const worker = this.getWorker(callback);
        worker.postMessage({ cmd: 'GET_HISTORY', payload: {} });
    }
}
