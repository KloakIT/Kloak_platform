class GenericWorker {
    constructor(workerFn) {
        this.createWorker = (workerFn) => {
            const url = URL.createObjectURL(new Blob([`(${workerFn.toString()})()`], { type: 'text/javascript' }));
            this.worker = new Worker(url);
            URL.revokeObjectURL(url);
            return this.worker;
        };
        this.createWorker(workerFn);
    }
    getWorker() {
        return this.worker;
    }
}
