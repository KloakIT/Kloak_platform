class IndexRetriever {
	private indexRetriever: Worker
	constructor() {
		this.init(this.workerFn)
	}

	init = (workerFn: Function) => {
		this.indexRetriever = new GenericWorker(workerFn).getWorker()
		this.indexRetriever.postMessage({ cmd: 'START', payload: {} })
	}

	getInstance = (): Worker => {
		return this.indexRetriever
	}

	workerFn = () => {
		let db: IDBDatabase = null
		let tx: IDBTransaction = null
		let fs: IDBObjectStore = null
		const postMessage = self.postMessage as any
		const log = (message: string) => {
			console.log(`<${new Date().toLocaleString()}> ${message}`)
		}

		const instanceInit = () => {
			const req = indexedDB.open('kloak-index', 1)

			req.onupgradeneeded = (e) => {
				db = e.target['result']
				db.createObjectStore('kloak-index')
			}

			req.onsuccess = (e) => {
				db = e.target['result']
				if (e.target['readyState'] === 'done') {
					postMessage({
						cmd: 'DATABASE_READY',
						payload: { type: 'indexRetriever' },
					})
				}
			}
			req.onerror = (e) => {
				postMessage({
					cmd: 'DATABASE_ERROR',
					payload: { type: 'indexRetriever' },
				})
			}
		}

		self.addEventListener('message', (e) => {
			const command = e.data.cmd
			const payload = e.data.payload
			switch (command) {
				case 'START':
					log('DB: IndexRetriever started.')
					instanceInit()
					break
				case 'RETRIEVE_INDEX':
					fs = db
						.transaction('kloak-index', 'readwrite')
						.objectStore('kloak-index')
					fs.get('index').onsuccess = (e) => {
						postMessage({
							cmd: 'RETRIEVED_INDEX',
							payload: e.target['result'] ? e.target['result'] : [],
						})
					}
					break
				case 'SAVE_INDEX':
					const key = Object.keys(payload.index)[0]
					fs = db
						.transaction('kloak-index', 'readwrite')
						.objectStore('kloak-index')
					console.log(payload)
					fs.put(payload.index, key)

					if (payload.index[key].finished) {
						postMessage({
							cmd: 'FILE_DOWNLOAD_FINISHED',
							payload: {},
						})
					}
					break
				case 'DELETE_INDEX':
					fs = db
						.transaction('kloak-index', 'readwrite')
						.objectStore('kloak-index')
					fs.delete(payload)
				default:
					break
			}
		})
	}
}
