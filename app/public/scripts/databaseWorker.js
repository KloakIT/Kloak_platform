class DatabaseWorker {
    constructor() {
        this.time = 0;
        this.getIDBObjectStore = () => {
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
                    fs = tx.objectStore("data");
                    resolve(fs);
                };
                req.onerror = (e) => {
                    reject(e);
                };
            });
        };
    }
    delete(uuid, callback) {
        this.getIDBObjectStore().then((fs) => {
            const action = fs.delete(uuid);
            action.onsuccess = e => {
                callback(null, uuid);
            };
            action.onerror = e => {
                callback(null, uuid);
            };
        }).catch(e => {
            callback(e, null);
        });
    }
    save(uuid, data, callback) {
        if (!uuid) {
            uuid = uuid_generate();
        }
        const removePGP = (pgp) => {
            let modified = pgp.replace('-----BEGIN PGP MESSAGE-----', '');
            modified = modified.replace('-----END PGP MESSAGE-----', '');
            modified = modified.replace('Comment: https://openpgpjs.org', '');
            modified = modified.replace(/([A-Z])\w+: OpenPGP.js *.*/, '');
            return modified.trim();
        };
        let encryptedData = removePGP(data);
        this.getIDBObjectStore().then((fs) => {
            fs.put(encryptedData, uuid).onsuccess = e => {
                callback ? callback(null, uuid) : null;
            };
        }).catch(e => {
            callback ? callback(e, null) : null;
        });
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
            const removePGP = (pgp) => {
                let modified = pgp.replace('-----BEGIN PGP MESSAGE-----', '');
                modified = modified.replace('-----END PGP MESSAGE-----', '');
                modified = modified.replace('Comment: https://openpgpjs.org', '');
                modified = modified.replace(/([A-Z])\w+: OpenPGP.js *.*/, '');
                return modified.trim();
            };
            let encryptedData = Buffer.from(data).toString();
            encryptedData = removePGP(data);
            this.getIDBObjectStore().then((fs) => {
                fs.put(encryptedData, uuid).onsuccess = e => {
                    callback(null, uuid);
                };
            }).catch(e => {
                callback(e, null);
            });
        });
    }
    decryptLoad(uuid, callback) {
        let t0 = performance.now();
        const pgpStart = '-----BEGIN PGP MESSAGE-----\n\n';
        const pgpEnd = '\n-----END PGP MESSAGE-----';
        this.getIDBObjectStore().then((fs) => {
            console.log(uuid);
            fs.get(uuid).onsuccess = async (e) => {
                const pgpMessage = pgpStart.concat(e.target['result'], pgpEnd);
                _view.sharedMainWorker.decryptStreamWithoutPublicKey(pgpMessage, (err, data) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    let t1 = performance.now();
                    callback(null, Buffer.from(data.data).buffer);
                    this.time += t1 - t0;
                });
            };
        }).catch(e => {
            callback(e, null);
        });
    }
    /* ==================== For SR&ED spreadsheet excel ====================
    public decryptLoad2(uuid: string | number, callback: Function) {
        let t0 = performance.now()
        const pgpStart = '-----BEGIN PGP MESSAGE-----\n\n'
            const pgpEnd = '\n-----END PGP MESSAGE-----'

        this.getIDBObjectStore().then((fs: IDBObjectStore) => {
            fs.get(uuid).onsuccess = async (e) => {
                const pgpMessage = pgpStart.concat(e.target['result'], pgpEnd)
                _view.sharedMainWorker.decryptStreamWithoutPublicKey(pgpMessage, (err, data) => {
                    if (err) {
                        callback(err, null)
                        return
                    }
                    let t1 = performance.now()
                    callback(null, Buffer.from(data.data).buffer)
                    this.time += t1 - t0
                    console.log(`TOTAL DECRYPT TIME: ${this.time.toFixed(2)}ms | ${(this.time/1000).toFixed(2)} s`)
                })
            }
        }).catch(e => {
            callback(e, null)
        })
    }
    */
    replaceHistory(histories, callback) {
        const buffer = Buffer.from(JSON.stringify(histories));
        _view.sharedMainWorker.encryptStream_withMyPublicKey(buffer, (err, data) => {
            if (err) {
                callback(err, null);
                return;
            }
            this.save('history', Buffer.from(data).toString(), callback);
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
                    callback(err, null);
                    return;
                }
                this.save('history', Buffer.from(data).toString(), callback ? callback : null);
            });
        });
    }
    getHistory(callback) {
        this.decryptLoad('history', callback);
    }
}
