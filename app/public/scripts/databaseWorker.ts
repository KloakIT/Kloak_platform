class DatabaseWorker {
	private time = 0
	constructor() {}

	private getIDBObjectStore = () => {
		return new Promise((resolve, reject) => {
				const req = indexedDB.open('data', 1)
				let db = null
				let fs: IDBObjectStore = null
				req.onupgradeneeded = (e) => {
					db = e.target['result']
					db.createObjectStore("data")
				}

				req.onsuccess = (e) => {
					db = e.target['result']
					const tx: IDBTransaction = db.transaction("data", "readwrite")
					fs = tx.objectStore("data")
					resolve(fs)
				}
				req.onerror = (e) => {
					reject(e)
				}
		})
	}

	public delete(uuid: string, callback: Function) {
		this.getIDBObjectStore().then((fs: IDBObjectStore) => {
			const action = fs.delete(uuid)
			
			action.onsuccess = e => {
				callback(null, uuid)
			}

			action.onerror = e => {
				callback(null, uuid)
			}
		}).catch(e => {
			callback(e, null)
		})
	}

	public save(uuid: string, data: string, callback?: Function) {
		if (!uuid) {
			uuid = uuid_generate()
		}
		const removePGP = (pgp: string): string => {
			let modified = pgp.replace('-----BEGIN PGP MESSAGE-----', '')
			modified = modified.replace('-----END PGP MESSAGE-----', '')
			modified = modified.replace('Comment: https://openpgpjs.org', '')
			modified = modified.replace(/([A-Z])\w+: OpenPGP.js *.*/, '')
			return modified.trim()
		}

		let encryptedData = removePGP(data)

		this.getIDBObjectStore().then((fs: IDBObjectStore) => {
			fs.put(encryptedData, uuid).onsuccess = e => {
				callback ? callback(null, uuid) : null
			}
		}).catch(e => {
			callback ? callback(e, null) : null
		})
	}

	public encryptSave(uuid: string, data: string | ArrayBuffer, callback: Function) {
		const buffer = Buffer.from(data as string)

		if (!uuid) {
			uuid = uuid_generate()
		}

		_view.sharedMainWorker.encryptStream_withMyPublicKey(
			buffer,
			(err, data) => {
				if (err) {
					callback(err, null)
					return
				}
				const removePGP = (pgp: string): string => {
					let modified = pgp.replace('-----BEGIN PGP MESSAGE-----', '')
					modified = modified.replace('-----END PGP MESSAGE-----', '')
					modified = modified.replace('Comment: https://openpgpjs.org', '')
					modified = modified.replace(/([A-Z])\w+: OpenPGP.js *.*/, '')
					return modified.trim()
				}
		
				let encryptedData = Buffer.from(data).toString()
				encryptedData = removePGP(data)
		
				this.getIDBObjectStore().then((fs: IDBObjectStore) => {
					fs.put(encryptedData, uuid).onsuccess = e => {
						callback(null, uuid)
					}
				}).catch(e => {
					callback(e, null)
				})
			}
		)
	}

	public getDecryptLoad(uuid: string | number, callback: Function) {
		let t0 = performance.now()
		const pgpStart = '-----BEGIN PGP MESSAGE-----\n\n'
			const pgpEnd = '\n-----END PGP MESSAGE-----'

		this.getIDBObjectStore().then((fs: IDBObjectStore) => {
			console.log(uuid)
			fs.get(uuid).onsuccess = async (e) => {
				if (e.target['result']) {
					const pgpMessage = pgpStart.concat(e.target['result'], pgpEnd)
					_view.sharedMainWorker.decryptStreamWithoutPublicKey(pgpMessage, (err, data) => {
						if (err) {
							callback(err, null)
							return
						}
						let t1 = performance.now()
						callback(null, Buffer.from(data.data).buffer)
						this.time += t1 - t0
					})
				} else {
					callback(null, Buffer.from(JSON.stringify(null)).buffer)
				}
			}
		}).catch(e => {
			callback(e, null)
		})
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

	public replaceHistory(history: history, callback?: Function) {
		const buffer = Buffer.from(JSON.stringify(history))
		_view.sharedMainWorker.encryptStream_withMyPublicKey(buffer, (err, data) => {
			if (err) {
				callback(err, null)
				return
			}
			this.save('history', Buffer.from(data).toString(), callback)
		})
	}

	public async saveFileHistory(file: fileHistory, callback?: Function) {
		this.getDecryptLoad('history', (err, data) => {
			let history = {}
			if (data) {
				const json = JSON.parse(Buffer.from(data).toString())
				history = json ? json : {}
			}
			history['files'] ? history['files'].push(file) : history['files'] = [file]
			console.log(Array.isArray(history) )
			const buffer = Buffer.from(JSON.stringify(history))
			_view.sharedMainWorker.encryptStream_withMyPublicKey(buffer, (err, data) => {
				if (err) {
					callback(err, null)
					return
				}
				this.save('history', Buffer.from(data).toString(), callback ? callback : null)
			})
		})
	}

	public getHistory(callback: Function) {
		this.getDecryptLoad('history', callback)
	}
}