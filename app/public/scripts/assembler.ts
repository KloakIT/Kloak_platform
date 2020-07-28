class Assembler {
	private requestUuid: string
	private downloadIndex: kloakIndex
	private hiddenAnchor: HTMLAnchorElement
	private fileOffsets = []
	private fileUuids = []
	private assembler: Worker
	private databaseWorker: Worker
	private callback: Function
	constructor ( requestUuid: string, hiddenAnchor: HTMLAnchorElement, callback: Function) {
		this.requestUuid = requestUuid
		this.hiddenAnchor = hiddenAnchor
		this.callback = callback
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

	log = ( message: string ) => {
		console.log(`<${new Date().toLocaleString()}> ${message}`)
	}

	messageChannel = async (e) => {
		const command = e.data.cmd
		const payload = e.data.payload
		let uuid = null;
		switch (command) {
			case 'FILE_INDEX':
				this.downloadIndex = payload
				this.fileOffsets = await Object.keys(this.downloadIndex[this.requestUuid].pieces).sort()
				await this.fileOffsets.forEach(offset => {
					this.fileUuids.push(this.downloadIndex[this.requestUuid].pieces[offset])
				})
				
				this.assembler.postMessage({
					cmd: 'START',
					payload: this.downloadIndex,
				})
				break
			case 'NEXT_PIECE':
				uuid = await this.fileUuids.shift()

				this.databaseWorker.postMessage({
					cmd: 'RETRIEVE_DATA',
					payload: { database: 'kloak-files', uuid },
				})
				
				break;
			case 'RETRIEVED_PIECE':
				const pgpMessage = Buffer.from(payload.arrBuffer).toString()
				console.log(pgpMessage)
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
									end: this.fileUuids.length === 0,
									offset: parseInt(this.fileOffsets.shift()),
									arrBuffer: arrBuffer,
								},
							},
							[arrBuffer]
						)
					}
				)
				return
			case 'ASSEMBLED_FILE':
				const filename = this.downloadIndex[this.requestUuid].filename
				const extension = payload.extension
				if (this.hiddenAnchor instanceof HTMLAnchorElement) {
					this.hiddenAnchor.download = `${filename}.${extension}`
					this.hiddenAnchor.href = payload.fileUrl
					this.hiddenAnchor.click()
					this.hiddenAnchor.download = ''
					this.hiddenAnchor.href = ''
					URL.revokeObjectURL(payload.fileUrl)
					this.assembler.terminate()
					this.assembler = null
					this.databaseWorker.terminate()
					this.databaseWorker = null
					this.callback(null, null)
					return
				}
				this.callback(null, {filename, extension, url: payload.fileUrl})
				this.databaseWorker.terminate()
				this.databaseWorker = null
				break
			default:
				break
		}
	}

	terminate = () => {
		if (this.databaseWorker) {
			this.databaseWorker.terminate()
			this.databaseWorker = null
		}
		if (this.assembler) {
			this.assembler.terminate()
			this.assembler = null
		}
	}

	assemblerWorkerFn = () => {
		importScripts(`${self.location.origin}/scripts/jimp.min.js`)
		let magicNumber = null;
		let requestUuid = null
		let fileUint8Array: Uint8Array = null
		let fileIndex: kloakIndex = null
		let tempPieces = []
		let offset = 0

		const getFileType = (magicNumber: string) => {
			const n = magicNumber.toLowerCase()
			switch (true) {
				case n.startsWith('504b0304'):
				case n.startsWith('504b0506'):
				case n.startsWith('504b0708'):
					fileIndex[requestUuid]['contentType'] = 'application/zip'
					fileIndex[requestUuid]['fileExtension'] = 'zip'
					break;
				case n.startsWith('0000001866747970'):
				case n.startsWith("0000002066747970"):
					fileIndex[requestUuid]['contentType'] = 'video/mp4'
					fileIndex[requestUuid]['fileExtension'] = 'mp4'
					break;
				case n.startsWith('494433'):
				case n.startsWith('fffb'):
				case n.startsWith('fff3'):
				case n.startsWith('fff2'):
					fileIndex[requestUuid]['contentType'] = "audio/mpeg"
					fileIndex[requestUuid]['fileExtension'] = 'mp3'
					break;
			}
		}

		const log = (message: string) => {
			console.log(`<${new Date().toLocaleString()}> ${message}`)
		}

		const createBlob =  () => {
			if (!fileIndex[requestUuid].contentType || !fileIndex[requestUuid].fileExtension) {
				getFileType(magicNumber)
			}
			const blob = new Blob([fileUint8Array], {
				type: fileIndex[requestUuid].contentType,
			})
			console.log(blob.size)
			const fileUrl = URL.createObjectURL(blob)
			return fileUrl
		}

		self.addEventListener('message', async (e) => {
			const command = e.data.cmd
			const payload = e.data.payload
			const postMessage = self.postMessage as any
			switch (command) {
				case 'START':
					log('Assembler: Assembly Worker started.')
					requestUuid = Object.keys(payload)[0]
					fileIndex = await payload
					if (fileIndex.totalLength) {
						fileUint8Array = new Uint8Array(fileIndex[requestUuid]['totalLength'])
					}
					postMessage({
						cmd: 'NEXT_PIECE',
						payload: {},
					})
					break
				case 'RETRIEVED_PIECE':
					if (!fileUint8Array) {
						tempPieces.push(payload)
						if (payload.end) {
							let totalLength = 0
							tempPieces.forEach(piece => {
								totalLength += piece.arrBuffer.byteLength
							})
							fileUint8Array = await new Uint8Array(totalLength)
							tempPieces.forEach(piece => {
								fileUint8Array.set(new Uint8Array(piece.arrBuffer), piece.offset)
							})
						}
					} else {
						fileUint8Array.set(new Uint8Array(payload.arrBuffer), payload.offset)
					}
					if (!payload.end) {
						postMessage({
							cmd: 'NEXT_PIECE',
							payload: {},
						})
						return
					}
					magicNumber = Buffer.from(fileUint8Array.slice(0,10).buffer).toString('hex')
					postMessage({
						cmd: 'ASSEMBLED_FILE',
						payload: { fileUrl: createBlob(), extension: fileIndex[requestUuid].fileExtension },
					})
					break;
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
				postMessage({ cmd: 'FILE_INDEX', payload: e.target['result'] })
			}
		}

		const getFileData = (uuid) => {
			const pgpStart = '-----BEGIN PGP MESSAGE-----\n\n'
			const pgpEnd = '\n-----END PGP MESSAGE-----'
			
			fs = db
				.transaction('kloak-files', 'readonly')
				.objectStore('kloak-files')

			fs.get(uuid).onsuccess = async (e) => {
				const pgpMessage = pgpStart.concat(e.target['result'], pgpEnd)
				const arrBuffer = Buffer.from(pgpMessage).buffer
				const postMessage = self.postMessage as any
				postMessage(
					{
						cmd: 'RETRIEVED_PIECE',
						payload: {
							arrBuffer,
						},
					},
					[arrBuffer]
				)
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
							getFileData(payload.uuid)
						})
						return
					}
					getFileData(payload.uuid)
					break
				default:
					break
			}
		})
	}
}
