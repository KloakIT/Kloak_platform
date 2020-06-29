class DataRetriever {
	private dataRetriever: Worker
	constructor() {
		this.init(this.workerFn)
	}

	init = (workerFn: Function) => {
		this.dataRetriever = new GenericWorker(workerFn).getWorker()
		this.dataRetriever.postMessage({ cmd: "START", payload: {} })
	}

	getInstance = (): Worker => {
		return this.dataRetriever
	}

	workerFn = () => {
		importScripts(`${self.location.origin}/scripts/jimp.min.js`)
		let db: IDBDatabase = null
		let tx: IDBTransaction = null
		let fs: IDBObjectStore = null

		const log = (message: string) => {
			console.log(`<${new Date().toLocaleString()}> ${message}`)
		}

		const instanceInit = () => {
			const req = indexedDB.open("kloak-files", 1)
			req.onupgradeneeded = (e) => {
				db = e.target.result
				db.createObjectStore("kloak-files")
			}

			req.onsuccess = (e) => {
				db = e.target.result
				if (e.target.readyState === "done") {
					self.postMessage({
						cmd: "DATABASE_READY",
						payload: { type: "dataRetriever" },
					})
				}
			}

			req.onerror = (e) => {
				self.postMessage({
					cmd: "DATABASE_ERROR",
					payload: { type: "dataRetriever" },
				})
			}
		}

		const removePGP = (pgp: string): string => {
			let modified = pgp.replace("-----BEGIN PGP MESSAGE-----", "")
			modified = modified.replace("-----END PGP MESSAGE-----", "")
			modified = modified.replace("Comment: https://openpgpjs.org", "")
			modified = modified.replace(/([A-Z])\w+: OpenPGP.js *.*/, "")
			return modified.trim()
		}

		self.addEventListener("message", (e) => {
			const command = e.data.cmd
			const payload = e.data.payload
			let pgp: string = null
			switch (command) {
				case "START":
					log("DB: DataRetriever started.")
					instanceInit()
					break
				case "SAVE_DATA":
					pgp = Buffer.from(new Uint8Array(payload.arrayBuffer)).toString()
					fs = db
						.transaction("kloak-files", "readwrite")
						.objectStore("kloak-files")
					fs.put(removePGP(pgp), payload.downloadUuid)
					break
				case "SAVE_PREPARED_DATA":
					pgp = Buffer.from(payload.arrayBuffer).toString()
					fs = db
						.transaction("kloak-files", "readwrite")
						.objectStore("kloak-files")
					fs.put(pgp, payload.downloadUuid)
					break
				default:
					break
			}
		})
	}
}
