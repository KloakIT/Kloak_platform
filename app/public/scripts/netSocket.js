self.importScripts('/scripts/lightweight/openpgp.min.js');
self.importScripts('/scripts/encryptoClass.js');
self.importScripts('/scripts/jimp.min.js');
self.importScripts('/scripts/jszip.min.js');
//openpgp.config.indutny_elliptic_path = '/scripts/lightweight/elliptic.min.js'
//openpgp.config.aead_protect = true
//openpgp.config.aead_mode = openpgp.enums.aead.experimental_gcm
window.IDBTransaction = window.IDBTransaction || window["webkitIDBTransaction"] || window["msIDBTransaction"];
window.IDBKeyRange = window.IDBKeyRange || window["webkitIDBKeyRange"] || window["msIDBKeyRange"];
const returnCommand = (ports, cmd) => {
    const jsonData = Buffer.from(JSON.stringify(cmd));
    if (sharedWorker) {
    }
    return ports.postMessage(jsonData.buffer, [jsonData.buffer]);
};
const sharedWorker = false; //typeof self.postMessage === 'function' ? false : true
const NewKeyPair = (ports, cmd) => {
    const uu = cmd.args;
    const userId = {
        name: uu.nikeName,
        email: uu.email
    };
    const option = {
        passphrase: uu.password,
        userIds: [userId],
        curve: "ed25519",
        aead_protect: true,
        aead_protect_version: 4
    };
    return openpgp.generateKey(option).then((out) => {
        const keypair = {
            keyLength: null,
            nickname: uu.nikeName,
            createDate: null,
            email: uu.email,
            publicKeyID: null,
            publicKey: out.publicKeyArmored,
            privateKey: out.privateKeyArmored,
            passwordOK: true,
            _password: uu.password,
            verified: false,
            image: null
        };
        cmd.args = keypair;
        return returnCommand(ports, cmd);
    }).catch(err => {
        // ERROR
        cmd.error = err.message;
        return returnCommand(ports, cmd);
    });
};
const InitKeyPairV = function () {
    const keyPair = {
        publicKey: null,
        privateKey: null,
        keyLength: null,
        nickname: null,
        createDate: null,
        email: null,
        passwordOK: false,
        verified: false,
        publicKeyID: null,
        _password: null,
        localserverPublicKey: null,
        image: null
    };
    return keyPair;
};
const getKeyInfo = async (keyPair, CallBack) => {
    if (!keyPair.publicKey || !keyPair.privateKey) {
        return CallBack(new Error('publicKey or privateKey empty!'));
    }
    const _privateKey = await openpgp.key.readArmored(keyPair.privateKey);
    const _publicKey = await openpgp.key.readArmored(keyPair.publicKey);
    if (_privateKey.err || _publicKey.err) {
        console.log(`_privateKey.err = [${_privateKey.err}], _publicKey.err [${_publicKey.err}]`);
        return CallBack(new Error('no key'));
    }
    const privateKey1 = _privateKey.keys[0];
    const publicKey1 = _publicKey.keys;
    const user = publicKey1[0].users[0];
    const ret = InitKeyPairV();
    let didCallback = false;
    ret.publicKey = keyPair.publicKey;
    ret.privateKey = keyPair.privateKey;
    ret.nickname = keyPair.nickname;
    ret.createDate = privateKey1.primaryKey.created.toLocaleDateString();
    ret.email = keyPair.email;
    ret.verified = false;
    ret.publicKeyID = publicKey1[0].primaryKey.getFingerprint().toUpperCase();
    ret.localserverPublicKey = keyPair["localserverPublicKey"];
    ret.passwordOK = false;
    //console.log (`getKeyPairInfo test password!`)
    if (privateKey1.isDecrypted()) {
        ret.passwordOK = true;
        ret._password = keyPair._password;
        didCallback = true;
        return CallBack(null, ret);
    }
    return privateKey1.decrypt(keyPair._password).then(keyOK => {
        //console.log (`privateKey1.decrypt then keyOK [${ keyOK }] didCallback [${ didCallback }]`)
        ret.passwordOK = keyOK;
        ret._password = keyPair._password;
        didCallback = true;
        return CallBack(null, ret);
    }).catch(err => {
        didCallback = true;
        return CallBack(null, ret);
    });
};
const checkPassword = async (_keyPair, CallBack) => {
    const privateKey = (await openpgp.key.readArmored(_keyPair.privateKey)).keys[0];
    privateKey.decrypt(_keyPair._password).then(ok => {
        CallBack();
    }).catch(err => {
        CallBack(err);
    });
};
let encryptoClassObj = null;
const doingCommand = (message, ports) => {
    let cmd = null;
    try {
        cmd = JSON.parse(message);
    }
    catch (ex) {
        return new EvalError(`workerManager JSON.parse error [${ex.message}]`);
    }
    const encryptoClassObjCallBack = (err, data) => {
        if (err) {
            cmd.error = typeof err === 'string' ? err : err.message;
            return returnCommand(ports, cmd);
        }
        cmd.args = data;
        return returnCommand(ports, cmd);
    };
    switch (cmd.command) {
        case 'NewKeyPair': {
            return NewKeyPair(ports, cmd);
        }
        case 'checkPassword': {
            console.dir(`on checkPassword`);
            return checkPassword(cmd.args, err => {
                if (err) {
                    cmd.error = 'passwd error';
                    return returnCommand(ports, cmd);
                }
                return returnCommand(ports, cmd);
            });
        }
        case 'getKeyInfo': {
            return getKeyInfo(cmd.args, (err, data) => {
                if (err) {
                    cmd.error = err.message;
                    return returnCommand(ports, cmd);
                }
                cmd.args = data;
                return encryptoClassObj = new encryptoClass(data, data._password, err => {
                    if (err) {
                        cmd.error = err.message;
                        return returnCommand(ports, cmd);
                    }
                    return returnCommand(ports, cmd);
                });
            });
        }
        case 'getKeyInfo_Daggr': {
            return getKeyInfo(cmd.args, (err, data) => {
                if (err) {
                    cmd.error = err.message;
                    return returnCommand(ports, cmd);
                }
                cmd.args = data;
                return returnCommand(ports, cmd);
            });
        }
        case 'localSeverPublicKey': {
            if (!encryptoClassObj) {
                cmd.error = 'Have no encryptoClass';
                return returnCommand(ports, cmd);
            }
            return openpgp.key.readArmored(cmd.args).then(data => {
                encryptoClassObj.localServerPublicKey = data.keys;
                return returnCommand(ports, cmd);
            });
        }
        /**
         * 		Encrypt function
         */
        case 'encrypto_withLocalServerKey': {
            return encryptoClassObj.encrypt_withLocalServerKey(cmd.args, encryptoClassObjCallBack);
        }
        case 'encryptedWithNodePublicKey': {
            return encryptoClassObj.encryptWithNodeKey(cmd.args, encryptoClassObjCallBack);
        }
        case 'encryptedWithAccessPointPublicKey': {
            return encryptoClassObj.encryptWithAPKey(cmd.args, encryptoClassObjCallBack);
        }
        case 'encryptStream_withMyPublicKey': {
            return encryptoClassObj.encryptStream_withMyPublicKey(Buffer.from(cmd.args.data), encryptoClassObjCallBack);
        }
        /**
         * 		Decrypt function
         */
        case 'decryptJsonWithAPKey': {
            return encryptoClassObj.decryptJsonWithAPKey(cmd.args, encryptoClassObjCallBack);
        }
        case 'decryptStreamWithAPKey': {
            return encryptoClassObj.decryptStreamWithAPKey(cmd.args, encryptoClassObjCallBack);
        }
        case 'decrypt_withLocalServerKey': {
            return encryptoClassObj.decrypt_withLocalServerKey(cmd.args, encryptoClassObjCallBack);
        }
        case 'decryptTextWithNodeAPIKey': {
            return encryptoClassObj.decryptTextWithNodeAPIKey(cmd.args, encryptoClassObjCallBack);
        }
        case 'decryptStreamWithAPKeyAndUnZIP': {
            return encryptoClassObj.decryptStreamWithAPKeyAndUnZIP(cmd.args[0], cmd.args[1], encryptoClassObjCallBack);
        }
        // ANDY CHANGED ====================================
        // ANDY CHANGED ====================================
        // ANDY CHANGED ====================================
        case 'unzipHTML': {
            return encryptoClassObj.unzipHTML(cmd.args[0], cmd.args[1], encryptoClassObjCallBack);
        }
        case 'decryptStreamWithoutPublicKey': {
            return encryptoClassObj.decryptStreamWithoutPublicKey(cmd.args, encryptoClassObjCallBack);
        }
        case 'getHistoryTable': {
            return encryptoClassObj.getHistoryTable(encryptoClassObjCallBack);
        }
        case 'saveHistoryTable': {
            return encryptoClassObj.getHistoryTable(encryptoClassObjCallBack);
        }
        default: {
            cmd["error"] = 'unknow command!';
            return returnCommand(ports, cmd);
        }
    }
};
if (sharedWorker) {
    self.addEventListener('connect', e => {
        const port = e["ports"][0];
        port.addEventListener('message', e => {
            doingCommand(Buffer.from(e.data).toString(), port);
        }, false);
        port.onmessageerror = e => {
            console.dir(e);
        };
        return port.start();
    });
}
else {
    onmessage = e => {
        doingCommand(Buffer.from(e.data).toString(), self);
    };
}
