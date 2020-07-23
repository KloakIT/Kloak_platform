class DataRetriever {
    constructor() {
        this.init = (workerFn) => {
            this.dataRetriever = new GenericWorker(workerFn).getWorker();
            this.dataRetriever.postMessage({ cmd: "START", payload: {} });
        };
        this.getInstance = () => {
            return this.dataRetriever;
        };
        this.workerFn = () => {
            importScripts(`${self.location.origin}/scripts/jimp.min.js`);
            let db = null;
            let tx = null;
            let fs = null;
            let isProcessing = false;
            let terminate = false;
            const postMessage = self.postMessage;
            const log = (message) => {
                console.log(`<${new Date().toLocaleString()}> ${message}`);
            };
            const instanceInit = () => {
                const req = indexedDB.open("kloak-files", 1);
                req.onupgradeneeded = (e) => {
                    db = e.target['result'];
                    db.createObjectStore("kloak-files");
                };
                req.onsuccess = (e) => {
                    db = e.target['result'];
                    if (e.target['readyState'] === "done") {
                        postMessage({
                            cmd: "DATABASE_READY",
                            payload: { type: "dataRetriever" },
                        });
                    }
                };
                req.onerror = (e) => {
                    postMessage({
                        cmd: "DATABASE_ERROR",
                        payload: { type: "dataRetriever" },
                    });
                };
            };
            const shouldTerminate = () => {
            };
            const removePGP = (pgp) => {
                let modified = pgp.replace("-----BEGIN PGP MESSAGE-----", "");
                modified = modified.replace("-----END PGP MESSAGE-----", "");
                modified = modified.replace("Comment: https://openpgpjs.org", "");
                modified = modified.replace(/([A-Z])\w+: OpenPGP.js *.*/, "");
                return modified.trim();
            };
            self.addEventListener("message", (e) => {
                const command = e.data.cmd;
                const payload = e.data.payload;
                let pgp = null;
                switch (command) {
                    case "START":
                        log("DB: DataRetriever started.");
                        instanceInit();
                        break;
                    case "SAVE_DATA":
                        isProcessing = true;
                        pgp = Buffer.from(new Uint8Array(payload.arrayBuffer)).toString();
                        fs = db
                            .transaction("kloak-files", "readwrite")
                            .objectStore("kloak-files");
                        fs.put(removePGP(pgp), payload.downloadUuid).onsuccess = e => {
                            isProcessing = false;
                        };
                        break;
                    case "SAVE_PREPARED_DATA":
                        isProcessing = true;
                        pgp = Buffer.from(payload.arrayBuffer).toString();
                        fs = db
                            .transaction("kloak-files", "readwrite")
                            .objectStore("kloak-files");
                        fs.put(pgp, payload.downloadUuid).onsuccess = e => {
                            isProcessing = false;
                        };
                        break;
                    case 'DELETE_DATA':
                        fs = db
                            .transaction("kloak-files", "readwrite")
                            .objectStore("kloak-files");
                        fs.delete(payload).onsuccess = e => {
                            isProcessing = false;
                        };
                        break;
                    default:
                        break;
                }
            });
        };
        this.init(this.workerFn);
    }
}
