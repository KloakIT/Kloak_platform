// class DatabaseWorker {
// 	constructor() {
// 	}

// 	private getWorker = (callback?: Function) => {
// 		const url = URL.createObjectURL(
// 			new Blob([`(${this.workerFn.toString()})()`], { type: 'text/javascript' })
// 		)
// 		const worker = new Worker(url)
// 		worker.addEventListener('message', (e) => {
// 			if (callback) {
// 				if (e.data.cmd === 'ERROR') {
// 					callback(new Error(e.data.payload), null)
// 					return
// 				}
// 				callback(null, e.data.payload)
// 			}
// 		})
// 		URL.revokeObjectURL(url)
// 		return worker
// 	}

// 	public delete(uuid: string, callback: Function) {
// 		const worker = this.getWorker(callback)
// 		worker.postMessage({cmd: 'DELETE_DATA', payload: {uuid}})
// 	}

// 	public save(uuid: string, data: string, callback: Function) {
// 		if (!uuid) {
// 			uuid = uuid_generate()
// 		}

// 		const arrayBuffer: ArrayBuffer = Buffer.from(data).buffer
// 		const worker = this.getWorker(callback)
// 		worker.postMessage({cmd: 'SAVE_DATA', payload: {uuid, arrayBuffer}}, [arrayBuffer])
// 	}

// 	public encryptSave(uuid: string, data: string | ArrayBuffer, callback: Function) {
// 		const buffer = Buffer.from(data)

// 		if (!uuid) {
// 			uuid = uuid_generate()
// 		}

// 		_view.sharedMainWorker.encryptStream_withMyPublicKey(
// 			buffer,
// 			(err, data) => {
// 				if (err) {
// 					callback(err, null)
// 					return
// 				}
// 				const arrayBuffer: ArrayBuffer = data instanceof ArrayBuffer ? data : Buffer.from(data).buffer
// 				const worker = this.getWorker(callback)
// 				worker.postMessage({cmd: 'SAVE_DATA', payload: {uuid, arrayBuffer}}, [arrayBuffer])
// 			}
// 		)
// 	}

// 	public decryptLoad(uuid: string | number, callback: Function) {
// 		const worker = this.getWorker((err, data) => {
// 			if (err) {
// 				callback(err, null)
// 				return
// 			}
// 			const pgpMessage = Buffer.from(data).toString()
// 			_view.sharedMainWorker.decryptStreamWithoutPublicKey(pgpMessage, (err, data) => {
// 				if (err) {
// 					callback(err, null)
// 					console.log(err)
// 					return
// 				}
// 				callback(null, Buffer.from(data.data).buffer)
// 			})
// 		})
// 		worker.postMessage({cmd: 'LOAD_DATA', payload: {uuid}})
// 	}

// 	public saveIndex(uuid: string, index: kloakIndex, callback: Function) {
// 		const worker = this.getWorker(callback)
// 		worker.postMessage({cmd: 'SAVE_INDEX', payload: {uuid, index}})
// 	}

// 	public replaceHistory(histories: Array<fileHistory>, callback?: Function) {
// 		const buffer = Buffer.from(JSON.stringify(histories))
// 		_view.sharedMainWorker.encryptStream_withMyPublicKey(buffer, (err, data) => {
// 			if (err) {
// 				console.log(err)
// 				return
// 			}
// 		const worker = this.getWorker(callback)
// 		worker.postMessage({cmd: 'SAVE_HISTORY', payload: {uuid: 'history', data}})
// 		})
// 	}

// 	public async saveHistory(history: fileHistory, callback?: Function) {
// 		this.decryptLoad('history', (err, data) => {
// 			let temp = []
// 			if (data) {
// 				temp = JSON.parse(Buffer.from(data).toString())
// 				console.log(temp)
// 			}
// 			temp.push(history)
// 			const buffer = Buffer.from(JSON.stringify(temp))
// 			_view.sharedMainWorker.encryptStream_withMyPublicKey(buffer, (err, data) => {
// 				if (err) {
// 					console.log(err)
// 					return
// 				}
// 			const worker = this.getWorker(callback)
// 			worker.postMessage({cmd: 'SAVE_HISTORY', payload: {uuid: 'history', data}})
// 			})
// 		})
// 	}

// 	public getHistory(callback: Function) {
// 		const worker = this.getWorker(callback)
// 		worker.postMessage({cmd: 'GET_HISTORY', payload: {}})
// 	}

// 	private workerFn = () => {
// 		importScripts(`${self.location.origin}/scripts/jimp.min.js`)
// 		const postMessage = self.postMessage as any

// 		const displayLog = (message: string) => {
// 			console.log(`<${new Date().toLocaleString()}> ${message}`)
// 		}

// 		const getDatabaseVersion = () => {
// 			return new Promise((resolve, reject) => {
// 				const req = indexedDB.open('kloak', 1)
// 				let db = null
// 				req.onupgradeneeded = (e) => {
// 					db = e.target['result']
// 					db.createObjectStore("kloak")
// 				}
// 				req.onsuccess = e => {
// 					db = e.target['result']
// 					resolve(db.version)
// 				}
// 				req.onerror = e => {
// 					reject(e)
// 				}
// 			})
// 		}

// 		const getIDBObjectStore = () => {
// 			return new Promise((resolve, reject) => {
// 					const req = indexedDB.open('data', 1)
// 					let db = null
// 					let fs: IDBObjectStore = null
// 					req.onupgradeneeded = (e) => {
// 						db = e.target['result']
// 						db.createObjectStore("data")
// 					}
	
// 					req.onsuccess = (e) => {
// 						db = e.target['result']
// 							const tx: IDBTransaction = db.transaction("data", "readwrite")
// 							tx.oncomplete = e => {
// 								self.close()
// 							}
// 							fs = tx.objectStore("data")
// 							resolve(fs)
// 					}
// 					req.onerror = (e) => {
// 						reject(e)
// 					}
// 			})
// 		}

// 		const deleteData = async (uuid: string) => {
// 			getIDBObjectStore().then((fs: IDBObjectStore) => {
// 				const action = fs.delete(uuid)
				
// 				action.onsuccess = e => {
// 					postMessage(uuid)
// 				}

// 				action.onerror = e => {
// 					postMessage(uuid)
// 				}
// 				displayLog(`Successfully deleted ${uuid}`)
// 			}).catch(e => {
// 				postMessage({cmd: 'ERROR', payload: e})
// 			})
// 		}

// 		const saveData = async (uuid: string, data: ArrayBuffer) => {
// 			const removePGP = (pgp: string): string => {
// 				let modified = pgp.replace('-----BEGIN PGP MESSAGE-----', '')
// 				modified = modified.replace('-----END PGP MESSAGE-----', '')
// 				modified = modified.replace('Comment: https://openpgpjs.org', '')
// 				modified = modified.replace(/([A-Z])\w+: OpenPGP.js *.*/, '')
// 				return modified.trim()
// 			}

// 			let encryptedData = Buffer.from(data).toString()
// 			encryptedData = await removePGP(encryptedData)

// 			getIDBObjectStore().then((fs: IDBObjectStore) => {
// 				fs.put(encryptedData, uuid).onsuccess = e => {
// 					postMessage(uuid)
// 					displayLog(`Successfully saved ${uuid}`)
// 				}
// 			}).catch(e => {
// 				postMessage({cmd: 'ERROR', payload: e})
// 			})
// 		}

// 		const loadData = (uuid: string) => {
// 			const pgpStart = '-----BEGIN PGP MESSAGE-----\n\n'
// 			const pgpEnd = '\n-----END PGP MESSAGE-----'

// 			getIDBObjectStore().then((fs: IDBObjectStore) => {
// 				fs.get(uuid).onsuccess = async (e) => {
// 					const pgpMessage = pgpStart.concat(e.target['result'], pgpEnd)
// 					const arrayBuffer = Buffer.from(pgpMessage).buffer
// 					postMessage({payload: arrayBuffer}, [arrayBuffer])
// 					displayLog(`Successfully loaded ${uuid}`)
// 				}
// 			}).catch(e => {
// 				postMessage({cmd: 'ERROR', payload: e})
// 			})
// 		}

// 		const saveIndex = (uuid: string, index: kloakIndex) => {
// 			getIDBObjectStore().then((fs: IDBObjectStore) => {
// 				fs.put(index[uuid], uuid).onsuccess = e => {
// 					postMessage(uuid)
// 					displayLog(`Successfully saved ${uuid} index`)
// 				}
// 			}).catch(e => {
// 				postMessage({cmd: 'ERROR', payload: e})
// 			})
// 		}

// 		self.addEventListener('message', e => {
// 			const command = e.data.cmd
// 			const payload = e.data.payload
// 			switch (command) {
// 				case 'SAVE_DATA':
// 					saveData( payload['uuid'], payload['arrayBuffer'])
// 					break;
// 				case 'LOAD_DATA':
// 					loadData(payload['uuid'])
// 					break;
// 				case 'DELETE_DATA':
// 					deleteData(payload['uuid'])
// 					break;
// 				case 'SAVE_INDEX':
// 					saveIndex(payload['uuid'], payload['index'])
// 					break;
// 				case 'SAVE_HISTORY':
// 					saveData(payload['uuid'], payload['data'])
// 					break;
// 				case 'GET_HISTORY':
// 					loadData(payload['uuid'])
// 					break;
// 			}
// 		})
// 	}
// }


class DatabaseWorker {
	private time = 0
	constructor() {
	}

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
		const buffer = Buffer.from(data)

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

	public decryptLoad(uuid: string | number, callback: Function) {
		let t0 = performance.now()
		const pgpStart = '-----BEGIN PGP MESSAGE-----\n\n'
			const pgpEnd = '\n-----END PGP MESSAGE-----'

		this.getIDBObjectStore().then((fs: IDBObjectStore) => {
			console.log(uuid)
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
				})
			}
		}).catch(e => {
			callback(e, null)
		})
	}

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

	public replaceHistory(histories: Array<fileHistory>, callback?: Function) {
		const buffer = Buffer.from(JSON.stringify(histories))
		_view.sharedMainWorker.encryptStream_withMyPublicKey(buffer, (err, data) => {
			if (err) {
				callback(err, null)
				return
			}
			this.save('history', Buffer.from(data).toString(), callback)
		})
	}

	public async saveHistory(history: fileHistory, callback?: Function) {
		this.decryptLoad('history', (err, data) => {
			let temp = []
			if (data) {
				temp = JSON.parse(Buffer.from(data).toString())
				console.log(temp)
			}
			temp.push(history)
			const buffer = Buffer.from(JSON.stringify(temp))
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
		this.decryptLoad('history', callback)
	}
}