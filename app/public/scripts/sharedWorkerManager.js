class sharedWorkerManager {
    constructor(sharedPath) {
        this.sharedPath = sharedPath;
        this.sharedWorker = typeof SharedWorker === 'function' ? true : false;
        this.worker = this.makeWorker();
        this.sharedMainWorkerWaitingPool = new Map();
        if (this.sharedWorker) {
            this.worker["port"].addEventListener("message", e => {
                return this.catchReturn(e.data);
            }, false);
            this.worker["port"].start();
        }
        else {
            this.worker['onmessage'] = e => {
                return this.catchReturn(e.data);
            };
        }
    }
    catchReturn(messageData) {
        const jsonData = Buffer.from(messageData).toString();
        let cmd = null;
        try {
            cmd = JSON.parse(jsonData);
        }
        catch (ex) {
            return console.dir(ex);
        }
        const getCallBack = this.sharedMainWorkerWaitingPool.get(cmd.uuid);
        if (!getCallBack) {
            console.dir(cmd);
            console.dir(this.sharedMainWorkerWaitingPool);
            return console.dir(`catch unknow UUID sharedMainWorker Return: ${cmd.uuid} `);
        }
        this.sharedMainWorkerWaitingPool.delete(cmd.uuid);
        if (cmd.error) {
            return getCallBack(new Error(cmd.error));
        }
        return getCallBack(null, cmd.args);
    }
    emitCommand(cmd, CallBack) {
        this.sharedMainWorkerWaitingPool.set(cmd["uuid"] = uuid_generate(), CallBack);
        const cmdStream = Buffer.from(JSON.stringify(cmd));
        if (this.sharedWorker) {
            this.worker["port"].postMessage(cmdStream.buffer, [cmdStream.buffer]);
        }
        else {
            this.worker["postMessage"](cmdStream.buffer, [cmdStream.buffer]);
        }
        if (cmd.command === "decrypt_withLocalServerKey") {
            console.dir(this.sharedMainWorkerWaitingPool);
        }
    }
    checkKeypairPassword(keypair, CallBack) {
        const cmd = {
            command: 'checkPassword',
            args: keypair
        };
        return this.emitCommand(cmd, CallBack);
    }
    getKeyPairInfo(keypair, CallBack) {
        const cmd = {
            command: 'getKeyInfo',
            args: keypair
        };
        return this.emitCommand(cmd, CallBack);
    }
    NewKeyPair(sendData, CallBack) {
        const cmd = {
            command: 'NewKeyPair',
            args: sendData
        };
        return this.emitCommand(cmd, CallBack);
    }
    localSeverPublicKey(publicKey, CallBack) {
        const cmd = {
            command: 'localSeverPublicKey',
            args: publicKey
        };
        return this.emitCommand(cmd, CallBack);
    }
    encrypto_withNodeKey(message, CallBack) {
        const cmd = {
            command: 'encryptedWithNodePublicKey',
            args: message
        };
        return this.emitCommand(cmd, CallBack);
    }
    encrypto_withLocalServerKey(command, CallBack) {
        const cmd = {
            command: 'encrypto_withLocalServerKey',
            args: JSON.stringify(command)
        };
        return this.emitCommand(cmd, CallBack);
    }
    encryptedWithAccessPointKey(command, CallBack) {
        const cmd = {
            command: 'encryptedWithAccessPointPublicKey',
            args: JSON.stringify(command)
        };
        return this.emitCommand(cmd, CallBack);
    }
    encryptStream_withMyPublicKey(message, CallBack) {
        const cmd = {
            command: 'encryptStream_withMyPublicKey',
            args: message
        };
        return this.emitCommand(cmd, CallBack);
    }
    decrypt_withLocalServerKey(message, CallBack) {
        const cmd = {
            command: 'decrypt_withLocalServerKey',
            args: message
        };
        return this.emitCommand(cmd, CallBack);
    }
    decryptJsonWithAPKey(message, CallBack) {
        const cmd = {
            command: 'decryptTextWithNodeAPIKey',
            args: message
        };
        return this.emitCommand(cmd, CallBack);
    }
    decryptStreamWithAPKey(message, CallBack) {
        const cmd = {
            command: 'decryptStreamWithAPKey',
            args: message
        };
        return this.emitCommand(cmd, CallBack);
    }
    saveImapIInputData(imap, CallBack) {
        const cmd = {
            command: 'saveImapIInputData',
            args: imap
        };
        return this.emitCommand(cmd, CallBack);
    }
    getHistoryTable(CallBack) {
        const cmd = {
            command: 'getHistoryTable'
        };
        return this.emitCommand(cmd, CallBack);
    }
    saveHistoryTable(data, CallBack) {
        const cmd = {
            command: 'saveHistoryTable',
            args: data
        };
        return this.emitCommand(cmd, CallBack);
    }
    decryptStreamWithAPKeyAndUnZIP(uuid, message, CallBack) {
        const cmd = {
            command: 'decryptStreamWithAPKeyAndUnZIP',
            args: [uuid, message]
        };
        return this.emitCommand(cmd, CallBack);
    }
    decryptStreamWithoutPublicKey(message, CallBack) {
        const cmd = {
            command: 'decryptStreamWithoutPublicKey',
            args: message
        };
        return this.emitCommand(cmd, CallBack);
    }
    makeWorker() {
        if (this.sharedWorker) {
            return new SharedWorker(this.sharedPath);
        }
        return new Worker(this.sharedPath);
    }
    saveFileBlock(uuid, buffer, CallBack) {
        const cmd = {
            command: 'decryptStreamWithAPKeyAndUnZIP',
            args: [uuid, buffer]
        };
        return this.emitCommand(cmd, CallBack);
    }
}
