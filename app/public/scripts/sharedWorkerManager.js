class sharedWorkerManager1 {
    constructor(sharedPath) {
        this.sharedPath = sharedPath;
        this.sharedWorker = false; //typeof SharedWorker === 'function' ? true: false 
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
    getKeyInfo_Daggr(keypair, CallBack) {
        const cmd = {
            command: 'getKeyInfo_Daggr',
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
    unzipHTML(uuid, base64, Callback) {
        const cmd = {
            command: 'unzipHTML',
            args: [uuid, base64]
        };
        return this.emitCommand(cmd, Callback);
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
const getKeyInfo1 = async (privateKey, passwd, CallBack) => {
    const _privateKey = await openpgp.readKey({ armoredKey: privateKey });
    const ret = {
        createDate: _privateKey.keyPacket.created.toISOString(),
        verified: false,
        keyid: _privateKey.getFingerprint().substr(24)
    };
    if (passwd) {
        return _privateKey.decrypt(passwd).then(keyOK => {
            //console.log (`privateKey1.decrypt then keyOK [${ keyOK }] didCallback [${ didCallback }]`)
            ret.verified = true;
            return CallBack(null, ret);
        }).catch(ex => {
            return CallBack(null, ret);
        });
    }
    return CallBack(null, ret);
};
const kloakPublicArmor = `
-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEYF/6PRYJKwYBBAHaRw8BAQdATMNoTXLMBPzVgMcgwDIJT42QkNuOOwjRLpHF
K2q58la0G1NFR1VSTyA8aW5mb0BnZXRTRUdVUk8uY29tPoiPBBAWCgAgBQJgX/o9
BgsJBwgDAgQVCAoCBBYCAQACGQECGwMCHgEAIQkQvJNMcTPisIgWIQQUTeA25O28
akPm5lO8k0xxM+KwiBVMAP9cMr1pIHb8OHDNU8mW/lfD+YUVH6Qt3xJXSZvw+JUa
gAEAo+chcb5+h3SYwO7El/etUu3z+VKBaVDc1RvMzeHuug64OARgX/o9EgorBgEE
AZdVAQUBAQdAAAPmwSs9MVXDEx+c8HB0KRp7OxIGq1RswnQv/GSrbTcDAQgHiHgE
GBYIAAkFAmBf+j0CGwwAIQkQvJNMcTPisIgWIQQUTeA25O28akPm5lO8k0xxM+Kw
iEJ8AP9i3ZyodVd7wUnI8e1zuMO4hfImjsXMfp28qXQ6yBHHLQEApdtrLmxHEbwm
iUatG/EQn9VLAanhlsOMmZApsHnIxwc=
=u6x5
-----END PGP PUBLIC KEY BLOCK-----
`;
class sharedWorkerManager {
    constructor(sharedPath) {
        this.sharedPath = sharedPath;
    }
    async NewKeyPair(sendData, CallBack) {
        const userId = {
            name: sendData.nikeName,
            email: sendData.email
        };
        const option = {
            passphrase: sendData.password,
            userIds: [userId],
            curve: "ed25519",
            aead_protect: false,
            //aead_protect_version: 4
        };
        const option1 = {
            userIds: [{
                    name: '',
                    email: ''
                }],
            curve: "ed25519",
            aead_protect: false,
            //aead_protect_version: 4
        };
        const keypair = {
            kloak_keyid: null,
            kloak_publickey_armor: null,
            kloak_privatekey_armor: null,
            device_keyid: null,
            device_publickey_armor: null,
            device_privatekey_armor: null,
            _password: sendData.password
        };
        return openpgp.generateKey(option).then((data) => {
            keypair.device_privatekey_armor = data.privateKeyArmored;
            keypair.device_publickey_armor = data.publicKeyArmored;
            return openpgp.generateKey(option1).then((data) => {
                keypair.kloak_privatekey_armor = data.privateKeyArmored;
                keypair.kloak_publickey_armor = data.publicKeyArmored;
                return getKeyInfo1(keypair.device_privatekey_armor, sendData.password, (err, data) => {
                    keypair.device_keyid = data.keyid;
                    return getKeyInfo1(keypair.kloak_privatekey_armor, null, (err, data) => {
                        keypair.kloak_keyid = data.keyid;
                        return CallBack(null, keypair);
                    });
                });
            });
        });
    }
    checkKeypairPassword(keypair, CallBack) {
        return getKeyInfo1(keypair.device_privatekey_armor, keypair._password, CallBack);
    }
    async encryptByKloak(clearText, signPrivatekeyArmor, passwd, CallBack) {
        const option = {
            privateKeys: await openpgp.readKey({ armoredKey: signPrivatekeyArmor }),
            publicKeys: await openpgp.readKey({ armoredKey: kloakPublicArmor }),
            message: await openpgp.Message.fromText(clearText),
            compression: openpgp.enums.compression.zip
        };
        if (passwd) {
            await option.privateKeys.decrypt(passwd);
        }
        return openpgp.encrypt(option).then(n => {
            return CallBack(null, n.data);
        }).catch(ex => {
            return CallBack('systemError');
        });
    }
}
