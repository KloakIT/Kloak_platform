class Assembler {
	private requestUuid: string
	private downloadIndex: kloakIndex
	private assembler: Worker
	private databaseWorker: Worker
	private callback: Function
	private isLocal: boolean = false
	constructor(requestUuid: string, callback: Function, isLocal = false) {
		this.isLocal = isLocal
		this.callback = callback
		this.requestUuid = requestUuid
		this.assembler = new GenericWorker(this.assemblerWorkerFn).getWorker()
		this.databaseWorker = new GenericWorker(this.databaseWorkerFn).getWorker()
		this.databaseWorker.postMessage({
			cmd: 'START',
			payload: { database: 'kloak-index', requestUuid },
		})
		this.assembler.addEventListener('message', this.messageChannel)
		this.databaseWorker.addEventListener('message', this.messageChannel)
	}

	getInstance = (): Worker => {
		return this.assembler
	}

	log = (message: string) => {
		console.log(`<${new Date().toLocaleString()}> ${message}`)
	}

	messageChannel = (e) => {
		const command = e.data.cmd
		const type = e.data.type
		const payload = e.data.payload
		switch (command) {
			case 'FILE_INDEX':
				this.downloadIndex = payload
				this.databaseWorker.postMessage({
					cmd: 'RETRIEVE_DATA',
					payload: { database: 'kloak-files', index: this.downloadIndex },
				})
				this.assembler.postMessage({
					cmd: 'START',
					payload: this.downloadIndex,
				})
				break
			case 'RETRIEVED_PIECE':
				const pgpMessage = Buffer.from(payload.arrBuffer).toString()
				_view.sharedMainWorker.decryptStreamWithoutPublicKey(
					pgpMessage,
					(err, data) => {
						if (err) {
							return console.log(err)
						}
						const arrBuffer = Buffer.from(data.data).buffer
						this.assembler.postMessage(
							{
								cmd: 'RETRIEVED_PIECE',
								payload: {
									offset: parseInt(payload.offset),
									end: payload.end,
									arrBuffer: arrBuffer,
								},
							},
							arrBuffer
						)
					}
				)
				return

				_view.sharedMainWorker.decryptStreamWithAPKey(
					pgpMessage,
					(err, data) => {
						if (err) {
							return console.log(err)
						}
						this.assembler.postMessage(
							{
								cmd: 'RETRIEVED_PIECE',
								payload: {
									offset: parseInt(payload.offset),
									end: payload.end,
									arrBuffer: data.data,
								},
							},
							Buffer.from(data.data).buffer
						)
					}
				)
				break
			case 'ASSEMBLED_FILE':
				this.callback({
					filename: this.requestUuid,
					extension: this.downloadIndex[this.requestUuid].fileExtension,
					url: payload.fileUrl,
				})
				this.assembler.terminate()
				this.databaseWorker.terminate()
				break
			default:
				break
		}
	}

	assemblerWorkerFn = () => {
		let fileUint8Array: Uint8Array = null
		let fileIndex: kloakIndex = null
		let requestUuid: string = null
		let temp = []

		const log = (message: string) => {
			console.log(`<${new Date().toLocaleString()}> ${message}`)
		}

		const createBlob = () => {
			const blob = new Blob([fileUint8Array], {
				type: fileIndex.contentType,
			})
			console.log(blob.size)
			const fileUrl = URL.createObjectURL(blob)
			return fileUrl
		}

		self.addEventListener('message', (e) => {
			const command = e.data.cmd
			const payload = e.data.payload
			switch (command) {
				case 'START':
					log('Assembler: Assembly Worker started.')
					requestUuid = Object.keys(payload)[0]
					fileIndex = payload[Object.keys(payload)[0]]
					break
				case 'RETRIEVED_PIECE':
					if (!fileIndex.totalLength) {
						temp.push(payload)
						if (payload.end) {
							let totalLength = 0;

							temp.forEach(payload => {
								totalLength += payload.arrBuffer.byteLength
							})

							fileUint8Array = new Uint8Array(totalLength)

							temp.forEach(payload => {
								fileUint8Array.set(new Uint8Array(payload.arrBuffer), parseInt(payload.offset))
							})

							const postMessage = self.postMessage as any
							postMessage({
								cmd: 'ASSEMBLED_FILE',
								payload: { fileUrl: createBlob() },
							})
							
							temp = null
						}
						return
					}
					if (!fileUint8Array) {
						fileUint8Array = new Uint8Array(fileIndex.totalLength as any)
						fileUint8Array.set(
							new Uint8Array(payload.arrBuffer),
							parseInt(payload.offset)
						)
						return
					}
					fileUint8Array.set(
						new Uint8Array(payload.arrBuffer),
						parseInt(payload.offset)
					)

					if (payload.end) {
						console.log('FINISHED')
						const postMessage = self.postMessage as any
						postMessage({
							cmd: 'ASSEMBLED_FILE',
							payload: { fileUrl: createBlob() },
						})
					}
					break
				case 'RETRIEVED_FINISH':
					console.log('finished')
					console.log(fileUint8Array)
					break
				default:
					break
			}
		})
	}

	databaseWorkerFn = () => {
		importScripts(`${self.location.origin}/scripts/jimp.min.js`)
		let db: IDBDatabase = null
		let fs: IDBObjectStore = null
		let currentDB: string = null
		const log = (message: string) => {
			console.log(`<${new Date().toLocaleString()}> ${message}`)
		}
		const instanceInit = (database: string) => {
			return new Promise((resolve, reject) => {
				const req = indexedDB.open(database, 1)
				req.onupgradeneeded = (e) => {
					db = e.target['result']
				}
				req.onsuccess = (e) => {
					db = e.target['result']
					if (e.target['readyState'] === 'done') {
						resolve()
					}
				}
				req.onerror = (e) => {
					reject()
				}
			})
		}

		const getFileIndex = (filename: string) => {
			fs = db.transaction('kloak-index', 'readwrite').objectStore('kloak-index')
			fs.get(filename).onsuccess = (e) => {
				const postMessage = self.postMessage as any
				postMessage({ cmd: 'FILE_INDEX', payload: e.target.result })
			}
		}

		const getFileData = (obj: kloakIndex) => {
			const pieces = obj[Object.keys(obj)[0]].pieces
			const keys = Object.keys(pieces)
			const pgpStart = '-----BEGIN PGP MESSAGE-----\n\n'
			const pgpEnd = '\n-----END PGP MESSAGE-----'
			for (let i = 0; i < keys.length; i++) {
				fs = db
					.transaction('kloak-files', 'readonly')
					.objectStore('kloak-files')
				fs.get(pieces[keys[i]]).onsuccess = (e) => {
					const pgpMessage = pgpStart.concat(e.target['result'], pgpEnd)
					const arrBuffer = Buffer.from(pgpMessage).buffer
					console.log(arrBuffer)
					const postMessage = self.postMessage as any
					postMessage(
						{
							cmd: 'RETRIEVED_PIECE',
							payload: {
								offset: keys[i],
								end: i === keys.length - 1,
								arrBuffer,
							},
						},
						[arrBuffer]
					)
				}
			}
		}

		self.addEventListener('message', (e) => {
			const command = e.data.cmd
			const payload = e.data.payload
			switch (command) {
				case 'START':
					log('Assembler: Database Worker started.')
					currentDB = payload.database
					instanceInit(payload.database).then(() => {
						getFileIndex(payload.requestUuid)
					})
					break
				case 'RETRIEVE_DATA':
					if (currentDB !== payload.database) {
						currentDB = payload.database
						instanceInit(payload.database).then(() => {
							getFileData(payload.index)
						})
						return
					}
					getFileData(payload.index)
					break
				default:
					break
			}
		})
	}
}
