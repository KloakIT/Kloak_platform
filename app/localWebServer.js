"use strict";
/*!
 * Copyright 2018 CoNET Technology Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const Path = require("path");
const HTTP = require("http");
const SocketIo = require("socket.io");
const Tool = require("./tools/initSystem");
const Async = require("async");
const Fs = require("fs");
const Uuid = require("node-uuid");
const Imap = require("./tools/imap");
const coNETConnect_1 = require("./tools/coNETConnect");
const mime = require("mime-types");
var CSR = require('@root/csr');
var PEM = require('@root/pem/packer');
var Keypairs = require('@root/keypairs');
const Package = require('../package.json');
let logFileFlag = 'w';
const saveLog = (err) => {
    if (!err) {
        return;
    }
    const data = `${new Date().toUTCString()}: ${typeof err === 'object' ? (err['message'] ? err['message'] : '') : err}\r\n`;
    console.log(data);
    return Fs.appendFile(Tool.ErrorLogFile, data, { flag: logFileFlag }, () => {
        return logFileFlag = 'a';
    });
};
const saveServerStartup = (postNumber, rootPath) => {
    const info = `\n*************************** Kloak Platform [ ${Package.version} ] server start up *****************************\n` +
        `Access url: http://localhost:${postNumber}${rootPath}\n`;
    saveLog(info);
};
const saveServerStartupError = (err) => {
    const info = `\n*************************** Kloak Platform [ ${Package.version} ] server startup falied *****************************\n` +
        `platform ${process.platform}\n` +
        `${err['message']}\n`;
    saveLog(info);
};
const imapErrorCallBack = (message) => {
    if (message && message.length) {
        if (/auth|login|log in|Too many simultaneous|UNAVAILABLE/i.test(message)) {
            return 1;
        }
        if (/ECONNREFUSED/i.test(message)) {
            return 5;
        }
        if (/OVERQUOTA/i.test(message)) {
            return 6;
        }
        if (/certificate/i.test(message)) {
            return 2;
        }
        if (/timeout|ENOTFOUND/i.test(message)) {
            return 0;
        }
        return 5;
    }
    return -1;
};
const resetConnectTimeLength = 1000 * 60 * 1;
class localServer {
    constructor(postNumber = 3000, folderName = '') {
        this.expressServer = Express();
        this.httpServer = HTTP.createServer(this.expressServer);
        this.socketServer = SocketIo(this.httpServer);
        this.config = null;
        this.savedPasswrod = '';
        this.localConnected = new Map();
        this.localKeyPair = null;
        this.serverKeyPassword = Uuid.v4();
        this.requestPool = new Map();
        this.imapConnectPool = new Map();
        this.destoryConnectTimePool = new Map();
        this.lengthPool = new Map();
        this.streamUrlPool = new Map();
        //Express.static.mime.define({ 'message/rfc822' : ['mhtml','mht'] })
        //Express.static.mime.define ({ 'multipart/related' : ['mhtml','mht'] })
        Express.static.mime.define({ 'application/x-mimearchive': ['mhtml', 'mht'] });
        this.expressServer.set('views', Path.join(__dirname, 'views'));
        this.expressServer.set('view engine', 'pug');
        this.expressServer.use(Express.static(Tool.QTGateFolder));
        this.expressServer.use(Express.static(Path.join(__dirname, 'public')));
        this.expressServer.use(Express.static(Path.join(__dirname, 'html')));
        const localPath = `/${folderName}`;
        const workspaces = this.socketServer.of(/^\/\w+$/);
        this.expressServer.get(localPath, (req, res) => {
            res.render('home', { title: 'home', proxyErr: false });
        });
        /*
        this.expressServer.get ( `${ folderName }/message`, ( req, res ) => {
            res.render( 'home/message', { title: 'message', proxyErr: false  })
        })
        */
        this.expressServer.get(`${folderName}/browserNotSupport`, (req, res) => {
            res.render('home/browserNotSupport', { title: 'browserNotSupport', proxyErr: false });
        });
        this.expressServer.get(`${folderName}/streamUrl`, (req, res) => {
            const errRespon = () => {
                res.status(404);
                return res.end();
            };
            const uuid = req.query['uuid'];
            console.dir(`ON ${folderName}/streamUrl typeof UUID = ${typeof uuid} UUID= [${uuid}]`);
            if (!uuid) {
                return errRespon();
            }
            const length = this.lengthPool.get(uuid);
            if (!length) {
                return errRespon();
            }
            console.dir(req.headers, { depth: 4 });
            const range = req.header('range').toLocaleLowerCase();
            const fangeEnd = range.split('bytes=0-')[1];
            if (range && fangeEnd) {
                if (/bytes\=0\-1/.test(range)) {
                    console.dir(req.rawHeaders);
                    res.writeHead(206, { 'Content-Type': 'video/mp4', 'accept-ranges': 'bytes', 'Content-Length': 2, 'Content-Range': `bytes 0-1/${length}`, 'Connection': 'close' });
                    return res.end(Buffer.alloc(2, 0));
                }
                console.dir(`range = 【${range} 】`);
                res.writeHead(206, { 'Content-Type': 'video/mp4', 'accept-ranges': 'bytes', 'Content-Length': length, 'Content-Range': `bytes 0-${length}/${length}`, 'Connection': 'close' });
            }
            else {
                res.writeHead(200, { 'Content-Type': 'video/mp4', 'status': 200, 'accept-ranges': 'bytes' });
            }
            this.streamUrlPool.set(uuid, res);
        });
        workspaces.on('connection', socket => {
            return this.listenAfterPassword(socket);
        });
        // this middleware will be assigned to each namespace
        workspaces.use((socket, next) => {
            // ensure the user has access to the workspace
            next();
        });
        /*
        this.socketServer.on ( 'connection', socker => {
            return this.listenAfterPassword ( socker )
        })
        */
        this.httpServer.once('error', err => {
            console.log(`httpServer error`, err);
            saveServerStartupError(err);
            return process.exit(1);
        });
        this.newKeyPair(err => {
            if (err) {
                console.dir(err);
                return saveServerStartupError(err);
            }
            return this.httpServer.listen(postNumber, () => {
                saveServerStartup(postNumber, localPath);
            });
        });
    }
    catchCmd(mail, uuid) {
        console.log(`Get response from CoNET uuid [${uuid}] length [${mail.length}]`);
        const socket = this.requestPool.get(uuid);
        if (!socket) {
            const nameSpace = this.socketServer.of(uuid);
            return nameSpace.clients((err, clients) => {
                if (err) {
                    console.log(err);
                    return console.dir(`catchCmd nameSpace.clients [${uuid}] get Error`);
                }
                if (!clients.length) {
                    return console.dir(`catchCmd nameSpace.clients request [${uuid}] have not client!`);
                }
                nameSpace.emit(uuid, mail);
            });
        }
        socket.emit('doingRequest', mail, uuid);
    }
    tryConnectCoNET(socket, imapData, sendMail, nameSpace) {
        //		have CoGate connect
        const keyID = socket['keyID'];
        let ConnectCalss = this.imapConnectPool.get(keyID);
        clearTimeout(this.destoryConnectTimePool.get(keyID));
        if (ConnectCalss) {
            console.log(`${imapData.account} have CoNETConnectCalss `);
            return ConnectCalss.Ping(sendMail);
        }
        const _exitFunction = err => {
            console.trace(`makeConnect on _exitFunction err this.CoNETConnectCalss destroy!`, err);
            /*
            if ( err && err.message ) {
                
                //		network error
                if ( / ECONNRESET /i.test) {
                    if ( typeof ConnectCalss.destroy === 'function' ) {
                        ConnectCalss.destroy ()
                    }
                    
                    //makeConnect ()
                    
                }
            }
            */
            if (typeof ConnectCalss.destroy === 'function') {
                ConnectCalss.destroy();
            }
            //makeConnect ()
            this.imapConnectPool.delete(keyID);
            return nameSpace.clients((err, n) => {
                if (err) {
                    return console.log(`_exitFunction nameSpace.clients get error`, err);
                }
                console.log(`nameSpace.clients = [${n.length}]`);
                if (n && n.length > 0) {
                    return makeConnect();
                }
            });
        };
        const makeConnect = () => {
            ConnectCalss = new coNETConnect_1.default(keyID, imapData, this.socketServer, socket, nameSpace, (mail, uuid) => {
                return this.catchCmd(mail, uuid);
            }, _exitFunction);
            return this.imapConnectPool.set(keyID, socket['userConnet'] = ConnectCalss);
        };
        return makeConnect();
    }
    listenAfterPassword(socket) {
        let sendMail = false;
        const clientName = `[${socket.id}][ ${socket.conn.remoteAddress}]`;
        const workspace = socket.nsp;
        const checkSocketKeypair = (socket, CallBack) => {
            const uuid = Uuid.v4();
            CallBack(uuid);
            const keyPair = socket["keypair"];
            if (!keyPair) {
                console.dir(`on 'checkImap' error: have not keypair object!`);
                socket.emit(uuid, 'Have not allow');
                saveLog(`connect [${clientName}] have no keyPair`);
                return null;
            }
            return uuid;
        };
        socket.on('checkImap', (imapConnectData, CallBack1) => {
            const uuid = checkSocketKeypair(socket, CallBack1);
            if (!uuid) {
                return;
            }
            const keyPair = socket["keypair"];
            return Tool.decryptoMessage(this.localKeyPair, keyPair.publicKey, imapConnectData, (err, imapData) => {
                if (err) {
                    return socket.emit(uuid, 'localWebsiteDecryptError');
                }
                return this.doingCheckImap(socket, imapData);
            });
        });
        socket.on('tryConnectCoNET', (imapData, CallBack1) => {
            console.dir('【on tryConnectCoNET】');
            const uuid = checkSocketKeypair(socket, CallBack1);
            if (!uuid) {
                return;
            }
            const keyPair = socket["keypair"];
            return Tool.decryptoMessage(this.localKeyPair, keyPair.publicKey, imapData, (err, data) => {
                if (err) {
                    console.log('checkImap Tool.decryptoMessage error\n', err);
                    return socket.emit(uuid, 'system');
                }
                try {
                }
                catch (ex) {
                    return socket.emit(uuid, 'system');
                }
                return this.tryConnectCoNET(socket, data, sendMail, workspace);
            });
        });
        socket.on('doingRequest', (request_uuid, request, CallBack1) => {
            const uuid = checkSocketKeypair(socket, CallBack1);
            if (!uuid) {
                return;
            }
            const _callBack = (...data) => {
                socket.emit(uuid, ...data);
            };
            this.requestPool.set(request_uuid, socket);
            const keyID = socket["keyID"];
            let userConnet = socket["userConnet"] || this.imapConnectPool.get(keyID);
            if (!userConnet) {
                saveLog(`doingRequest on ${uuid} but have not CoNETConnectCalss need restart! socket.emit ( 'systemErr' )`);
                return socket.emit(uuid, new Error('have no connect to node'));
            }
            console.dir(`on doingRequest request_uuid [${request_uuid}]`);
            userConnet.requestCoNET_v1(request_uuid, request, _callBack);
        });
        socket.on('getFilesFromImap', (files, CallBack1) => {
            const uuid = checkSocketKeypair(socket, CallBack1);
            if (!uuid) {
                return;
            }
            const _callBack = (...data) => {
                socket.emit(uuid, ...data);
            };
            const keyPair = socket["keypair"];
            const keyID = socket["keyID"];
            return Tool.decryptoMessage(this.localKeyPair, keyPair.publicKey, files, (err, data) => {
                if (err) {
                    return _callBack(err.message || err);
                }
                const _files = data;
                //console.log (`socket.on ('getFilesFromImap') _files = [${ _files }] _files.length = [${ _files.length }]`  )
                const userConnect = socket["userConnet"] || this.imapConnectPool.get(keyID);
                if (!userConnect) {
                    console.log(`getFilesFromImap error:![ Have no userConnect ]`);
                    return socket.emit('systemErr');
                }
                //console.time ( `getFilesFromImap ${ _files }` )
                let ret = '';
                return userConnect.getFileV1(_files, (err, data, subject) => {
                    //console.timeEnd ( `getFilesFromImap ${ _files } ` )
                    if (err) {
                        console.log(err);
                        return _callBack(err);
                    }
                    return _callBack(null, data, subject);
                });
            });
        });
        socket.on('sendRequestMail', (message, CallBack1) => {
            console.dir(`socket.on 【( 'sendRequestMail')】`);
            const uuid = checkSocketKeypair(socket, CallBack1);
            if (!uuid) {
                return;
            }
            const keyPair = socket["keypair"];
            const keyID = socket["keyID"];
            return Tool.decryptoMessage(this.localKeyPair, keyPair.publicKey, message, (err, data) => {
                sendMail = true;
                const userConnect = socket["userConnet"] || this.imapConnectPool.get(keyID);
                if (userConnect) {
                    userConnect.Ping(true);
                }
                return Tool.sendCoNETConnectRequestEmail(data.imapData, data.toMail, data.message, data.subject, err => {
                    if (err) {
                        console.log(err);
                    }
                    console.log(`Tool.sendCoNETConnectRequestEmail success!`);
                });
            });
        });
        socket.on('sendMedia', (uuid, rawData, CallBack1) => {
            const _uuid = Uuid.v4();
            CallBack1(_uuid);
            const _callBack = (...data) => {
                socket.emit(_uuid, ...data);
            };
            const keyID = socket["keyID"];
            const userConnect = this.imapConnectPool.get(keyID);
            if (!userConnect) {
                return socket.emit('systemErr');
            }
            return userConnect.sendDataToANewUuidFolder(Buffer.from(rawData).toString('base64'), uuid, uuid, _callBack);
        });
        socket.on('mime', (_mime, CallBack1) => {
            const _uuid = Uuid.v4();
            CallBack1(_uuid);
            console.log(`socket.on ( 'mime' ) [${_mime}]`);
            const _callBack = (...data) => {
                socket.emit(_uuid, ...data);
            };
            let y = mime.lookup(_mime);
            console.log(y);
            if (!y) {
                return _callBack(new Error('no mime'));
            }
            return _callBack(null, y);
        });
        socket.on('keypair', async (publicKey, CallBack) => {
            const _uuid = Uuid.v4();
            CallBack(_uuid);
            return Tool.getPublicKeyInfo(publicKey, (err, data) => {
                if (err) {
                    console.log(`Tool.getPublicKeyInfo ERROR!`, err);
                    return socket.emit(_uuid, err);
                }
                const keyID = data.publicID.slice(24).toLocaleUpperCase();
                socket["keypair"] = data;
                socket["keyID"] = keyID;
                console.dir(`client join room 【${keyID}】`);
                socket.emit(_uuid, null, this.localKeyPair.publicKey);
                if (workspace.name.toLocaleUpperCase() !== `/${keyID}`) {
                    console.log(`workspace.name.toLocaleUpperCase()[${workspace.name.toLocaleUpperCase()}] !== /${keyID}`);
                }
            });
        });
        socket.once('disconnect', () => {
            const keypair = socket['keypair'];
            if (!keypair) {
                return console.dir(`${clientName} have no keypair on disconnect! `);
            }
            const keyID = socket["keyID"];
            const adminNamespace = this.socketServer.of(`/${keyID}`);
            return adminNamespace.clients((err, clients) => {
                if (err) {
                    return console.log(err);
                }
                const client = clients.length;
                console.dir(`socket.once ( 'disconnect') total clients of room [/${keyID}] = [${clients.length}]`);
                if (!client) {
                    const connect = this.imapConnectPool.get(keyID);
                    this.imapConnectPool.delete(keyID);
                    if (connect) {
                        if (connect.rImap && typeof connect.rImap.logout === 'function') {
                            return connect.rImap.logout(() => {
                                console.dir(`CoNet connect [${keyID}] destroy`);
                            });
                        }
                    }
                    console.log(`ERROR!\n\n`);
                    console.dir(`socket.once ( 'disconnect') keyID = [${keyID}] connect = ${connect} `);
                }
            });
        });
        socket.on('requestStreamUrl', (length, CallBack1) => {
            const _uuid = Uuid.v4();
            CallBack1(_uuid);
            console.dir(`socket.on ( 'requestStreamUrl' ) length = ${length}`);
            const listenChunk = (buffer, CallBack1) => {
                const __uuid = Uuid.v4();
                //		Destory Buffer Url
                CallBack1(__uuid);
                const urlSocket = this.streamUrlPool.get(_uuid);
                if (!urlSocket) {
                    return console.dir(`【have no URL uuid as ${_uuid}】`);
                }
                //console.dir (`stream.write`)
                //console.log ( Buffer.from ( buffer.substr (0, 100),'base64').toString ('hex'))
                const uuu = Buffer.from(buffer, 'base64');
                console.dir(`socket.on 【${_uuid}】buffer length = [${uuu.length}]`);
                //console.dir (`listenChunk ${ _uuid }, buffer length = [${ uuu.length }]`)
                urlSocket.write(uuu);
            };
            this.lengthPool.set(_uuid, length);
            socket.on(_uuid, listenChunk);
            socket.emit(_uuid, _uuid);
        });
        /*
                socket.on ('getUrl', ( url: string, CallBack ) => {
                    const uu = new URLSearchParams ( url )
                    if ( !uu || typeof uu.get !== 'function' ) {
                        console.log (`getUrl [${ url }] have not any URLSearchParams`)
                        return CallBack ()
                    }
                    
                    return CallBack ( null, uu.get('imgrefurl'), uu.get('/imgres?imgurl'))
                })
        */
    }
    doingCheckImap(socket, imapData) {
        return Async.series([
            next => Imap.imapAccountTest(imapData, err => {
                if (err) {
                    return next(err);
                }
                socket.emit('imapTest');
                return next();
            }),
            next => Tool.smtpVerify(imapData, next)
        ], (err) => {
            if (err) {
                console.log(`doingCheckImap Async.series Error!`, err);
                return socket.emit('imapTest', err.message || err);
            }
            console.dir(`doingCheckImap finished`);
            imapData.imapTestResult = true;
            const keyPair = socket["keypair"];
            return Tool.encryptMessage(keyPair.publicKeys, this.localKeyPair.privateKey, JSON.stringify(imapData), (err, data) => {
                console.dir(`socket.emit ( 'imapTestFinish'`);
                return socket.emit('imapTestFinish', err, data);
            });
        });
    }
    mediaHttpServer() {
    }
    newKeyPair(CallBack) {
        return Tool.newKeyPair("admin@Localhost.local", "admin", this.serverKeyPassword, async (err, data) => {
            if (err) {
                return CallBack(err);
            }
            this.localKeyPair = data;
            return CallBack();
        });
    }
}
exports.default = localServer;
/*
const csrKey = async () => {
    const pair = await Keypairs.generate()
    let keyPem = await Keypairs.export ({ jwk: pair.private, format: 'pkcs8' })
    
    let csr: string = await CSR.csr({
        jwk: pair.private,
        domains: ['example.com', '*.example.com', 'foo.bar.example.com'],
        encoding: 'pem'
    })
    
    
    
    console.log ( keyPem )
    console.log ( csr )
    const server = Https.createServer ({
        key: keyPem,
        cert: csr
    }, (req, res) => {
        console.log (`${ req }`)
    })
    
    server.listen (8000)
}

csrKey ()

*/ 
