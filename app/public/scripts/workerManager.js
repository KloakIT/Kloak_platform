class workerManager {
    constructor(list) {
        this.workers = new Map();
        this.callbackPool = new Map();
        list.forEach((n) => {
            const work = new Worker(`scripts/${n}.js`);
            work.onmessage = (evt) => {
                return this.doEvent(evt);
            };
            return this.workers.set(n, work);
        });
    }
    doEvent(evt) {
        const jsonData = Buffer.from(Buffer.from(evt.data).toString(), 'base64').toString();
        let data = null;
        try {
            data = JSON.parse(jsonData);
        }
        catch (ex) {
            return new EvalError(`workerManager JSON.parse error [${ex.message}]`);
        }
        const callBack = this.callbackPool.get(data.uuid);
        if (!callBack) {
            return console.log(`workerManager: [${new Date().toLocaleTimeString()}] have not callback about message from [${data.workerName}] content = [${data.data}]`);
        }
        return callBack(null, data);
    }
    /**
     *
     *
     */
    postFun(workerName, data, CallBack) {
        const worker = this.workers.get(workerName);
        if (!worker) {
            return CallBack(new Error('no worker'));
        }
        const callback = {
            data: data,
            uuid: uuid_generate(),
            workerName: workerName,
        };
        const kk = Buffer.from(Buffer.from(JSON.stringify(callback)).toString('base64'));
        this.callbackPool.set(callback.uuid, CallBack);
        return worker.postMessage(kk, [kk.buffer]);
    }
}
