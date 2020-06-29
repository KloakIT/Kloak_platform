class GenericWorker {
	private worker: Worker
	constructor(workerFn: Function) {
		this.createWorker(workerFn)
	}

	getWorker(): Worker {
		return this.worker
	}

	createWorker = (workerFn: Function): Worker => {
		const url = URL.createObjectURL(
			new Blob([`(${workerFn.toString()})()`], { type: 'text/javascript' })
		)
		this.worker = new Worker(url)
		URL.revokeObjectURL(url)
		return this.worker
	}
}
