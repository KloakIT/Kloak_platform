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
const Imap = require("./imap");
const Tool = require("./initSystem");
const Fs = require("fs");
const Async = require("async");
let logFileFlag = 'w';
const saveLog = (err, _console = false) => {
    if (!err) {
        return;
    }
    const data = `${new Date().toUTCString()}: ${typeof err === 'object' ? (err['message'] ? err['message'] : '') : err}\r\n`;
    _console ? console.log(data) : null;
    return Fs.appendFile(Tool.CoNETConnectLog, data, { flag: logFileFlag }, () => {
        return logFileFlag = 'a';
    });
};
const timeOutWhenSendConnectRequestMail = 1000 * 60;
const commandRequestTimeOutTime = 1000 * 10;
const requestTimeOut = 1000 * 60;
class default_1 extends Imap.imapPeer {
    constructor(imapData, server, socket, cmdResponse, _exit) {
        super(imapData, imapData.clientFolder, imapData.serverFolder, err => {
            console.debug(`imapPeer doing exit! err =`, err);
            this.roomEmit.emit('tryConnectCoNETStage', null, -2);
            return this.exit1(err);
        });
        this.imapData = imapData;
        this.server = server;
        this.socket = socket;
        this.cmdResponse = cmdResponse;
        this._exit = _exit;
        this.CoNETConnectReady = false;
        this.connectStage = -1;
        this.alreadyExit = false;
        this.timeoutWaitAfterSentrequestMail = null;
        this.roomEmit = this.server.to(this.socket.id);
        this.timeoutCount = {};
        saveLog(`=====================================  new CoNET connect()`, true);
        this.roomEmit.emit('tryConnectCoNETStage', null, 5);
        this.newMail = (mail, hashCode) => {
            return this.cmdResponse(mail, hashCode);
        };
        this.on('CoNETConnected', publicKey => {
            this.CoNETConnectReady = true;
            saveLog('Connected CoNET!', true);
            //console.log ( publicKey )
            clearTimeout(this.timeoutWaitAfterSentrequestMail);
            this.connectStage = 4;
            this.roomEmit.emit('tryConnectCoNETStage', null, 4, publicKey);
            return;
        });
        this.on('pingTimeOut', () => {
            console.log(`class CoNETConnect on pingTimeOut`);
            return this.roomEmit.emit('pingTimeOut');
        });
        this.on('ping', () => {
            this.roomEmit.emit('tryConnectCoNETStage', null, 2);
            //this.sockerServer.emit ( 'tryConnectCoNETStage', null, 2 )
        });
    }
    exit1(err) {
        console.trace(`imapPeer doing exit! this.sockerServer.emit ( 'tryConnectCoNETStage', null, -1 )`);
        this.roomEmit.emit('tryConnectCoNETStage', null, -1);
        if (!this.alreadyExit) {
            this.alreadyExit = true;
            console.log(`CoNETConnect class exit1 doing this._exit() success!`);
            return this._exit(err);
        }
        console.log(`exit1 cancel already Exit [${err}]`);
    }
    setTimeWaitAfterSentrequestMail() {
        this.timeoutWaitAfterSentrequestMail = setTimeout(() => {
            return this.roomEmit.emit('tryConnectCoNETStage', null, 0);
        }, requestTimeOut * 2);
    }
    requestCoNET_v1(uuid, text, CallBack) {
        return this.sendDataToANewUuidFolder(Buffer.from(text).toString('base64'), this.imapData.serverFolder, uuid, CallBack);
    }
    /**
     * 1:18.254
     */
    getFile(fileName, CallBack) {
        let callback = false;
        if (!this.timeoutCount[fileName]) {
            this.timeoutCount[fileName] = 1;
        }
        if (this.alreadyExit) {
            return CallBack(new Error('alreadyExit'));
        }
        console.log(`requestCoNET_v1 get file:[${fileName}]`);
        console.log(`this.imapData.imapServer = [${this.imapData.imapServer}]`);
        const imapClone = JSON.parse(JSON.stringify(this.imapData));
        if (/^imap\.mail\.me\.com/.test(this.imapData.imapServer)) {
            imapClone.imapServer = 'p03-imap.mail.me.com';
        }
        let rImap = new Imap.qtGateImapRead(imapClone, fileName, true, mail => {
            const attr = Imap.getMailAttached(mail);
            const subject = Imap.getMailSubject(mail);
            console.log(`=========>   getFile mail.length = [${mail.length}] attr.length = [${attr.length}]`);
            if (!callback) {
                callback = true;
                CallBack(null, attr, subject);
            }
            return rImap.logout();
        });
        rImap.once('error', err => {
            console.log(`CoNetConnect.getFile on error`, err);
            return rImap.destroyAll(null);
        });
        rImap.once('end', err => {
            console.dir(`[${fileName}]rImap.once END`);
            rImap.destroyAll(null);
            rImap.removeAllListeners();
            rImap = null;
            if (err) {
                if (!callback) {
                    if (this.timeoutCount["fileName"]++ < 3) {
                        saveLog(`getFile got error [${err}]\nDoing getFile again!\n`);
                        return this.getFile(fileName, CallBack);
                    }
                    callback = true;
                    return CallBack(err);
                }
            }
            return saveLog(`getFile [${fileName}] success!`);
        });
    }
    getFileV1(fileName, CallBack) {
        let callback = false;
        let _mail = false;
        let idle_wait_timeout_process = null;
        if (!this.timeoutCount[fileName]) {
            this.timeoutCount[fileName] = 1;
        }
        const imapClone = JSON.parse(JSON.stringify(this.imapData));
        if (/^imap\.mail\.me\.com/.test(this.imapData.imapServer)) {
            imapClone.imapServer = 'p03-imap.mail.me.com';
        }
        const rImap = new Imap.qtGateImap(imapClone, null, false, null, true, mail => {
            clearTimeout(idle_wait_timeout_process);
            if (!mail || mail.length < 50) {
                return console.log(`getFileV1 [${fileName}] mail empty!`);
            }
            _mail = true;
            const attr = Imap.getMailAttached(mail);
            const subject = Imap.getMailSubject(mail);
            console.log(`=========>   getFile mail.length = [${mail.length}] attr.length = [${attr.length}]`);
            if (!callback) {
                callback = true;
                CallBack(null, attr, subject);
            }
        });
        rImap.once('error', err => {
            rImap.destroyAll(err);
        });
        rImap.once('ready', () => {
            rImap.imapSerialID = fileName;
            console.log(`getFileV1 rImap.once ( 'ready' )`);
            return Async.series([
                next => rImap.imapStream.openBoxV1(fileName, next),
                next => rImap.imapStream.fetch(1, next)
            ], err => {
                let doAgain = false;
                if (err || !callback) {
                    if (++this.timeoutCount[fileName] < 20) {
                        console.dir(`getFileV1 [${fileName}] this.timeoutCount[ ${fileName}  ] < 20, doing again`);
                        doAgain = true;
                    }
                    else {
                        console.dir(` ++ this.timeoutCount[  ${fileName} ] [${this.timeoutCount[fileName]}] > 20 `);
                    }
                }
                console.log(`doAgain = 【${doAgain}】 callback = 【${callback} 】`);
                if (_mail) {
                    return Async.series([
                        next => rImap.imapStream.flagsDeleted('1', next),
                        next => rImap.imapStream.expunge(next),
                        next => rImap.imapStream._logoutWithoutCheck(next)
                    ], err => {
                        console.log(`new rImap success!`);
                    });
                }
                return rImap.imapStream._logoutWithoutCheck(() => {
                    if (doAgain) {
                        console.log(`getFileV1 [${fileName}] doAgain`);
                        return setTimeout(() => this.getFileV1(fileName, CallBack), 3000);
                    }
                    if (callback) {
                        return console.log(`getFileV1 callback already TRUE!!!`);
                    }
                    return CallBack(new Error('timeout'));
                });
            });
        });
    }
}
exports.default = default_1;
