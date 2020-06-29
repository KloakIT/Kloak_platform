class DisassemblyWorker {
    constructor() {
        this.init = (workerFn) => {
            this.disassemblyWorker = new GenericWorker(workerFn).getWorker();
            this.disassemblyWorker.postMessage({ cmd: "START", payload: {} });
        };
        this.getInstance = () => {
            return this.disassemblyWorker;
        };
        this.workerFn = () => {
            const uuid_generate = function () {
                let lut = [];
                for (let i = 0; i < 256; i++) {
                    lut[i] = (i < 16 ? "0" : "") + i.toString(16);
                }
                let d0 = (Math.random() * 0xffffffff) | 0;
                let d1 = (Math.random() * 0xffffffff) | 0;
                let d2 = (Math.random() * 0xffffffff) | 0;
                let d3 = (Math.random() * 0xffffffff) | 0;
                return (lut[d0 & 0xff] +
                    lut[(d0 >> 8) & 0xff] +
                    lut[(d0 >> 16) & 0xff] +
                    lut[(d0 >> 24) & 0xff] +
                    "-" +
                    lut[d1 & 0xff] +
                    lut[(d1 >> 8) & 0xff] +
                    "-" +
                    lut[((d1 >> 16) & 0x0f) | 0x40] +
                    lut[(d1 >> 24) & 0xff] +
                    "-" +
                    lut[(d2 & 0x3f) | 0x80] +
                    lut[(d2 >> 8) & 0xff] +
                    "-" +
                    lut[(d2 >> 16) & 0xff] +
                    lut[(d2 >> 24) & 0xff] +
                    lut[d3 & 0xff] +
                    lut[(d3 >> 8) & 0xff] +
                    lut[(d3 >> 16) & 0xff] +
                    lut[(d3 >> 24) & 0xff]);
            };
            let chunkSize = null;
            let arrayBuffer = null;
            let offset = 0;
            const sliceArrayBuffer = (arrayBuffer, start, chunkSize) => {
                return [arrayBuffer.slice(start, start + chunkSize), uuid_generate()];
            };
            self.addEventListener("message", (e) => {
                const command = e.data.cmd;
                const payload = e.data.payload;
                switch (command) {
                    case "START":
                        self.postMessage({ cmd: "DISASSEMBLY_READY", payload: {} });
                        break;
                    case "SPLIT_FILE":
                        arrayBuffer = payload.arrayBuffer;
                        chunkSize = payload.chunkSize;
                        while (offset <= arrayBuffer.byteLength) {
                            const data = sliceArrayBuffer(arrayBuffer, offset, chunkSize);
                            console.log(data);
                            self.postMessage({
                                cmd: "SPLIT_FILE_PIECE",
                                payload: {
                                    uuid: data[1],
                                    offset: offset,
                                    arrayBuffer: data[0],
                                    end: offset + chunkSize > arrayBuffer.byteLength ? true : false,
                                },
                            }, data[0]);
                            // pieces[offset] = data[1]
                            // files.push({ [data[1]]: data[0] })
                            offset += chunkSize;
                        }
                        break;
                    default:
                        break;
                }
            });
        };
        this.init(this.workerFn);
    }
}
