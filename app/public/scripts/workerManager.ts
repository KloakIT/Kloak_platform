
class workerManager {
	public workers: Map<string, Worker> = new Map()
	private callbackPool: Map<string, any> = new Map()

	private doEvent(evt: MessageEvent) {
		const jsonData = Buffer.from(
			Buffer.from(evt.data).toString(),
			'base64'
		).toString()
		let data: workerDataEvent = null
		try {
			data = JSON.parse(jsonData)
		} catch (ex) {
			return new EvalError(`workerManager JSON.parse error [${ex.message}]`)
		}

		const callBack = this.callbackPool.get(data.uuid)
		if (!callBack) {
			return console.log(
				`workerManager: [${new Date().toLocaleTimeString()}] have not callback about message from [${
					data.workerName
				}] content = [${data.data}]`
			)
		}
		return callBack(null, data)
	}

	constructor(list: string[]) {
		list.forEach((n) => {
			const work = new Worker(`scripts/${n}.js`)
			work.onmessage = (evt) => {
				return this.doEvent(evt)
			}
			return this.workers.set(n, work)
		})
	}
	/**
	 *
	 *
	 */

	public postFun(workerName: string, data: any, CallBack) {
		const worker = this.workers.get(workerName)
		if (!worker) {
			return CallBack(new Error('no worker'))
		}

		const callback: workerDataEvent = {
			data: data,
			uuid: uuid_generate(),
			workerName: workerName,
		}

		const kk = Buffer.from(
			Buffer.from(JSON.stringify(callback)).toString('base64')
		)

		this.callbackPool.set(callback.uuid, CallBack)
		return worker.postMessage(kk, [kk.buffer])
	}
}