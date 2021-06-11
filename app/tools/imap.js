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
exports.imapPeer = exports.imapGetMediaFile = exports.imapAccountTest = exports.getMailAttachedBase64 = exports.getMailSubject = exports.getMailAttached = exports.qtGateImapRead = exports.seneMessageToFolder = exports.qtGateImap = exports.saveLog = void 0;
const Tls = require("tls");
const Stream = require("stream");
const Event = require("events");
const Uuid = require("node-uuid");
const Async = require("async");
const Crypto = require("crypto");
const timers_1 = require("timers");
const buffer_1 = require("buffer");
const Util = require("util");
const MAX_INT = 9007199254740992;
const debug = true;
const NoopLoopWaitingTime = 1000 * 1;
const saveLog = (log, _console = true) => {
    const data = `${new Date().toUTCString()}: ${log}\r\n`;
    _console ? console.log(data) : null;
};
exports.saveLog = saveLog;
const debugOut = (text, isIn, serialID) => {
    const log = `【${new Date().toISOString()}】【${serialID}】${isIn ? '<=' : '=>'} 【${text}】`;
    console.log(log);
};
const idleInterval = 1000 * 60 * 15; // 5 mins
/**
 * 				watch the socket pipe write speed
 * 				alert when write timeout
 */
class watchWriteToSocket extends Stream.Transform {
    constructor() {
        super();
    }
    _transform(chunk, encoding, next) {
    }
}
class ImapServerSwitchStream extends Stream.Transform {
    constructor(imapServer, exitWithDeleteBox, debug) {
        super();
        this.imapServer = imapServer;
        this.exitWithDeleteBox = exitWithDeleteBox;
        this.debug = debug;
        this._buffer = buffer_1.Buffer.alloc(0);
        this.Tag = null;
        this.cmd = null;
        this.callback = false;
        this.doCommandCallback = null;
        this._login = false;
        this.first = true;
        this.waitLogoutCallBack = null;
        this.idleResponsrTime = null;
        this.ready = false;
        this.appendWaitResponsrTimeOut = null;
        this.runningCommand = null;
        //private nextRead = true
        this.idleNextStop = null;
        this.reNewCount = 0;
        this.isImapUserLoginSuccess = false;
        this.newSwitchRet = false;
        this.doingIdle = false;
        this.needLoginout = null;
        this.fetchEmptyBody = false;
        this.isFetchBodyFinished = false;
    }
    commandProcess(text, cmdArray, next, callback) { }
    serverCommandError(err, CallBack) {
        this.imapServer.emit('error', err);
        if (CallBack) {
            CallBack(err);
        }
    }
    idleDoingDown() {
        if (!this.doingIdle || this.runningCommand !== 'idle') {
            return; //console.dir (`idleDoingDown stop because this.doingIdle === false!`)
        }
        this.doingIdle = false;
        timers_1.clearTimeout(this.idleNextStop);
        if (this.writable) {
            this.debug ? debugOut(`DONE`, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
            console.log('');
            return this.push(`DONE\r\n`);
        }
        /**
         *
         */
        return this.imapServer.destroyAll(null);
    }
    doCapability(capability) {
        this.imapServer.serverSupportTag = capability;
        this.imapServer.idleSupport = /IDLE/i.test(capability);
        this.imapServer.condStoreSupport = /CONDSTORE/i.test(capability);
        this.imapServer.literalPlus = /LITERAL\+/i.test(capability);
        const ii = /X\-GM\-EXT\-1/i.test(capability);
        const ii1 = /CONDSTORE/i.test(capability);
        return this.imapServer.fetchAddCom = `(${ii ? 'X-GM-THRID X-GM-MSGID X-GM-LABELS ' : ''}${ii1 ? 'MODSEQ ' : ''}BODY[])`;
    }
    preProcessCommane(commandLine, _next, callback) {
        //commandLine = commandLine.replace( /^ +/g,'').replace (/^IDLE\*/, '*')
        const cmdArray = commandLine.split(' ');
        this.debug ? debugOut(`${commandLine}`, true, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this._login) {
            switch (commandLine[0]) {
                case '+': /////       +
                case ' ':
                case '*': { /////       *
                    return this.commandProcess(commandLine, cmdArray, _next, callback);
                }
                case 'I': //  IDLE
                case 'D': //  NODE
                case 'N': //  NOOP
                case 'O': //	OK
                case 'A': { /////       A
                    timers_1.clearTimeout(this.appendWaitResponsrTimeOut);
                    timers_1.clearTimeout(this.idleResponsrTime);
                    this.runningCommand = false;
                    if (/^ok$/i.test(cmdArray[1]) || /^ok$/i.test(cmdArray[0])) {
                        this.doCommandCallback(null, commandLine);
                        return callback();
                    }
                    if (this.Tag !== cmdArray[0]) {
                        return this.serverCommandError(new Error(`this.Tag[${this.Tag}] !== cmdArray[0] [${cmdArray[0]}]\ncommandLine[${commandLine}]`), callback);
                    }
                    //console.log (`IMAP preProcessCommane on NO Tag!`, commandLine )
                    const errs = cmdArray.slice(2).join(' ');
                    this.doCommandCallback(new Error(errs));
                    return callback();
                }
                default: {
                    return this.serverCommandError(new Error(`_commandPreProcess got switch default error!\ncommandLine[0] = ${commandLine[0]}`), callback);
                }
            }
        }
        return this.login(commandLine, cmdArray, _next, callback);
    }
    checkFetchEnd() {
        //console.log (`checkFetchEnd\n\n_buffer.length = [${ this._buffer.length }]`)
        if (this._buffer.length < this.imapServer.fetching) {
            //console.log (` this._buffer.length [${  this._buffer.length }] <= this.imapServer.fetching [${ this.imapServer.fetching  }]`)
            return null;
        }
        //console.log (this._buffer.toString ('hex'))
        //console.log (this._buffer.toString ())
        const body = this._buffer.slice(0, this.imapServer.fetching);
        this._buffer = this._buffer.slice(this.imapServer.fetching);
        this.imapServer.fetching = 0;
        if (/^\)\r\n/.test(this._buffer.toString())) {
            this._buffer = this._buffer.slice(3);
        }
        return body;
    }
    checkLine(next) {
        // /console.log (`__CallBack\n\nthis._buffer = [${ this._buffer.toString() }] [${ this._buffer.toString ('hex')}]`)
        let index = -1;
        /**
         * 		check line
         */
        if (!this._buffer.length || (index = this._buffer.indexOf('\r\n')) < 0) {
            //      this is for IDLE do DONE command
            //		this.emit ( 'hold' )
            if (!this.callback) {
                this.callback = true;
                return next();
            }
            //      did next with other function
            return;
        }
        const _buf = this._buffer.slice(0, index);
        return this.preProcessCommane(_buf.toString(), next, () => {
            //		delete '\r\n'
            this._buffer = this._buffer.slice(index + 2);
            return this.doLine(next);
        });
    }
    doLine(next) {
        if (this.imapServer.fetching) {
            //console.log ('************************************** ImapServerSwitchStream _transform chunk **************************************')
            //console.log ( this._buffer.toString ())
            //console.log ('************************************** ImapServerSwitchStream _transform chunk **************************************')
            const _buf1 = this.checkFetchEnd();
            //  have no fill body must goto  next chunk
            if (!_buf1) {
                this.callback = true;
                return next();
            }
            //console.log ('************************************** ImapServerSwitchStream _transform chunk **************************************')
            //console.log ( `\n\n_buf1.length = [${ _buf1.length }]\n\n` )
            //console.log ( _buf1.toString ())
            this.isFetchBodyFinished = true;
            this.imapServer.newMail(_buf1);
        }
        return this.checkLine(next);
    }
    _transform(chunk, encoding, next) {
        this.callback = false;
        //console.log ('************************************** ImapServerSwitchStream _transform chunk **************************************')
        //console.log ( chunk.toString ())
        //console.log ('************************************** ImapServerSwitchStream _transform chunk **************************************')
        this._buffer = buffer_1.Buffer.concat([this._buffer, chunk]);
        return this.doLine(next);
    }
    capability() {
        this.doCommandCallback = (err) => {
            if (this.imapServer.listenFolder) {
                return this.createBox(true, this.imapServer.listenFolder, (err, newMail, UID) => {
                    if (err) {
                        console.log(`========================= [${this.imapServer.listenFolder || this.imapServer.imapSerialID}] openBox Error do this.end ()`, err);
                        return this.imapServer.destroyAll(err);
                    }
                    /*
                    if ( this.isWaitLogout ) {
                        console.log (`capability this.waitLogout = true doing logout_process ()`)
                        return this.logout_process ( this.waitLogoutCallBack )
                    }
                    */
                    if (/^inbox$/i.test(this.imapServer.listenFolder)) {
                        console.log(`capability open inbox !`);
                        this.ready = true;
                        return this.imapServer.emit('ready');
                    }
                    if (this.imapServer.skipOldMail) {
                        return this.skipAllUnreadMail();
                    }
                    if (newMail && typeof this.imapServer.newMail === 'function') {
                        //this.imapServer.emit ( 'ready' )
                        //console.log (`[${ this.imapServer.imapSerialID }]capability doing newMail = true`)
                        return this.doNewMail(UID);
                    }
                    if (typeof this.imapServer.newMail === 'function') {
                        this.idleNoop();
                    }
                    this.ready = true;
                    this.imapServer.emit('ready');
                });
            }
            this.ready = true;
            this.imapServer.emit('ready');
        };
        this.commandProcess = (text, cmdArray, next, callback) => {
            switch (cmdArray[0]) {
                case '*': { /////       *
                    //          check imap server is login ok
                    if (/^CAPABILITY$/i.test(cmdArray[1]) && cmdArray.length > 2) {
                        const kkk = cmdArray.slice(2).join(' ');
                        this.doCapability(kkk);
                    }
                    return callback();
                }
                default:
                    return callback();
            }
        };
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} CAPABILITY`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable) {
            return this.push(this.cmd + '\r\n');
        }
        return this.imapServer.destroyAll(null);
    }
    skipAllUnreadMail() {
        return this.seachUnseen((err, newMailIds, havemore) => {
            if (newMailIds) {
                return Async.series([
                    next => this.flagsDeleted(newMailIds, next),
                    next => this.expunge(next)
                ], err => {
                    this.runningCommand = null;
                    this.imapServer.emit('ready');
                    return this.idleNoop();
                });
                /*
                return Async.eachSeries ( uids, ( n: string , next ) => {
                    
                    if ( n && n.length ) {
                        return this.flagsDeleted ( n, next )
                    }
                    return next ( false )
                }, err => {
                    return this.expunge ( err => {
                        this.runningCommand = null
                        this.imapServer.emit ( 'ready' )
                        return this.idleNoop()
                    })
                })
                */
            }
            this.runningCommand = null;
            this.imapServer.emit('ready');
            return this.idleNoop();
        });
    }
    doNewMail(UID = '') {
        this.reNewCount--;
        this.runningCommand = 'doNewMail';
        return this.seachUnseen((err, newMailIds, havemore) => {
            if (err) {
                console.log(`===============> seachUnseen got error. destore imap connect!`, err);
                this.runningCommand = null;
                return this.imapServer.destroyAll(err);
            }
            let haveMoreNewMail = false;
            const getNewMail = (_fatchID, CallBack) => {
                return Async.waterfall([
                    next => this.fetch(_fatchID, next),
                    (_moreNew, next) => {
                        haveMoreNewMail = _moreNew;
                        return this.flagsDeleted(_fatchID, next);
                    },
                    next => {
                        return this.expunge(next);
                    }
                ], CallBack);
            };
            if (newMailIds || (newMailIds = UID)) {
                const uids = newMailIds.split(',');
                return Async.eachSeries(uids, (n, next) => {
                    const _uid = parseInt(n);
                    if (_uid > 0) {
                        return getNewMail(_uid, next);
                    }
                    return next();
                }, err => {
                    console.log(`doNewMail Async.eachSeries getNewMail callback!`);
                    this.runningCommand = null;
                    if (err) {
                        console.log(`doNewMail Async.eachSeries getNewMail error`, err);
                        debug ? exports.saveLog(`ImapServerSwitchStream [${this.imapServer.listenFolder || this.imapServer.imapSerialID}] doNewMail ERROR! [${err}]`) : null;
                        return this.imapServer.destroyAll(err);
                    }
                    if (this.needLoginout) {
                        console.log(`this.needLoginout === true!`);
                        return this.idleNoop();
                    }
                    if (haveMoreNewMail || havemore || this.newSwitchRet) {
                        return this.doNewMail();
                    }
                    return this.idleNoop();
                });
            }
            this.runningCommand = null;
            this.imapServer.emit('ready');
            return this.idleNoop();
        });
    }
    idleNoop() {
        if (this.needLoginout) {
            return this._logoutWithoutCheck(() => {
            });
        }
        this.newSwitchRet = false;
        this.doingIdle = true;
        this.runningCommand = 'idle';
        if (!this.ready) {
            this.ready = true;
            this.imapServer.emit('ready');
        }
        this.doCommandCallback = (err => {
            if (err) {
                console.log(`IDLE doCommandCallback! error`, err);
                return this.imapServer.destroyAll(err);
            }
            this.runningCommand = null;
            if (this.needLoginout) {
                return this._logoutWithoutCheck(() => {
                    this.needLoginout();
                });
            }
            //console.log(`IDLE DONE newSwitchRet = [${newSwitchRet}] nextRead = [${this.nextRead}]`)
            if (this.newSwitchRet || this.reNewCount > 0) {
                return this.doNewMail();
            }
            if (this.imapServer.idleSupport) {
                return this.idleNoop();
            }
            /**
             * NOOP support
             */
            timers_1.setTimeout(() => {
                if (!this.runningCommand) {
                    return this.idleNoop();
                }
            }, NoopLoopWaitingTime);
        });
        this.commandProcess = (text, cmdArray, next, callback) => {
            //console.log (`idleNoop commandProcess coming ${ text }\n${ cmdArray }`)
            switch (cmdArray[0]) {
                case `${this.Tag}*`:
                case '+':
                case '*': {
                    timers_1.clearTimeout(this.idleResponsrTime);
                    if (/^RECENT$|^EXISTS$/i.test(cmdArray[2])) {
                        this.newSwitchRet = true;
                        if (this.imapServer.idleSupport) {
                            this.idleDoingDown();
                        }
                    }
                    return callback();
                }
                default:
                    return callback();
            }
        };
        const name = this.Tag = this.imapServer.idleSupport ? 'IDLE' : 'NOOP';
        this.cmd = `${this.Tag} ${name}`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable) {
            this.idleNextStop = this.imapServer.idleSupport
                ? timers_1.setTimeout(() => {
                    this.idleDoingDown();
                }, idleInterval)
                : null;
            return this.push(this.cmd + '\r\n');
        }
        this.doingIdle = false;
        return this.imapServer.destroyAll(null);
    }
    loginoutWithCheck(CallBack) {
        if (this.needLoginout) {
            return CallBack();
        }
        this.needLoginout = CallBack;
        if (this.runningCommand === 'doNewMail') {
            return;
        }
        if (this.doingIdle) {
            return this.idleDoingDown();
        }
    }
    login(text, cmdArray, next, _callback) {
        this.doCommandCallback = (err) => {
            if (!err) {
                this.isImapUserLoginSuccess = true;
                return this.capability();
            }
            console.log(`ImapServerSwitchStream class login error `, err);
            return this.imapServer.destroyAll(err);
        };
        this.commandProcess = (text, cmdArray, next, callback) => {
            switch (cmdArray[0]) {
                case '+':
                case '*': {
                    return callback();
                }
                default:
                    return callback();
            }
        };
        switch (cmdArray[0]) {
            case '*': { /////       *
                //          check imap server is login ok
                if (/^ok$/i.test(cmdArray[1]) && this.first) {
                    this.first = false;
                    this.Tag = `A${this.imapServer.TagCount1()}`;
                    this.cmd = `${this.Tag} LOGIN "${this.imapServer.IMapConnect.imapUserName}" "${this.imapServer.IMapConnect.imapUserPassword}"`;
                    this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
                    this.callback = this._login = true;
                    if (this.writable) {
                        return next(null, this.cmd + '\r\n');
                    }
                    this.imapServer.destroyAll(null);
                }
                //
                return _callback();
            }
            default:
                return this.serverCommandError(new Error(`login switch default ERROR!`), _callback);
        }
    }
    createBox(openBox, folderName, CallBack) {
        this.doCommandCallback = (err) => {
            if (err) {
                if (err.message && !/exists/i.test(err.message)) {
                    return CallBack(err);
                }
            }
            if (openBox) {
                return this.openBox(CallBack);
            }
            return CallBack();
        };
        this.commandProcess = (text, cmdArray, next, callback) => {
            return callback();
        };
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} CREATE "${folderName}"`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable) {
            return this.push(this.cmd + '\r\n');
        }
        return this.imapServer.destroyAll(null);
    }
    openBox(CallBack) {
        this.newSwitchRet = false;
        let UID = 0;
        this.doCommandCallback = (err) => {
            if (err) {
                return this.createBox(true, this.imapServer.listenFolder, CallBack);
            }
            CallBack(null, this.newSwitchRet, UID);
        };
        this.commandProcess = (text, cmdArray, next, _callback) => {
            switch (cmdArray[0]) {
                case '*': {
                    if (/^EXISTS$|^UIDNEXT$|UNSEEN/i.test(cmdArray[2])) {
                        const _num = text.split('UNSEEN ')[1];
                        if (_num) {
                            UID = parseInt(_num.split(']')[0]);
                        }
                        this.newSwitchRet = true;
                    }
                    return _callback();
                }
                default:
                    return _callback();
            }
        };
        const conText = this.imapServer.condStoreSupport ? ' (CONDSTORE)' : '';
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} SELECT "${this.imapServer.listenFolder}"${conText}`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable)
            return this.push(this.cmd + '\r\n');
        this.imapServer.destroyAll(null);
    }
    openBoxV1(folder, CallBack) {
        this.newSwitchRet = false;
        let UID = 0;
        this.doCommandCallback = (err) => {
            if (err) {
                return CallBack(err);
            }
            CallBack(null, this.newSwitchRet, UID);
        };
        this.commandProcess = (text, cmdArray, next, _callback) => {
            switch (cmdArray[0]) {
                case '*': {
                    if (/^EXISTS$|^UIDNEXT$|UNSEEN/i.test(cmdArray[2])) {
                        const _num = text.split('UNSEEN ')[1];
                        if (_num) {
                            UID = parseInt(_num.split(']')[0]);
                        }
                        this.newSwitchRet = true;
                    }
                    return _callback();
                }
                default:
                    return _callback();
            }
        };
        const conText = this.imapServer.condStoreSupport ? ' (CONDSTORE)' : '';
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} SELECT "${folder}"${conText}`;
        this.debug ? debugOut(this.cmd, false, folder || this.imapServer.imapSerialID) : null;
        if (this.writable)
            return this.push(this.cmd + '\r\n');
        this.imapServer.destroyAll(new Error('imapServer un-writeable'));
    }
    _logoutWithoutCheck(CallBack) {
        //console.trace (`doing _logout typeof CallBack = [${ typeof CallBack }]`)
        if (!this.isImapUserLoginSuccess) {
            return CallBack();
        }
        this.doCommandCallback = (err, info) => {
            return CallBack(err);
        };
        timers_1.clearTimeout(this.idleResponsrTime);
        this.commandProcess = (text, cmdArray, next, _callback) => {
            //console.log (`_logout doing this.commandProcess `)
            this.isImapUserLoginSuccess = false;
            return _callback();
        };
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} LOGOUT`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable) {
            this.appendWaitResponsrTimeOut = timers_1.setTimeout(() => {
                return CallBack();
            }, 1000 * 30);
            return this.push(this.cmd + '\r\n');
        }
        if (CallBack && typeof CallBack === 'function') {
            return CallBack();
        }
    }
    append(text, subject, CallBack) {
        //console.log (`[${ this.imapServer.imapSerialID }] ImapServerSwitchStream append => [${ text.length }]`)
        if (typeof subject === 'function') {
            CallBack = subject;
            subject = null;
        }
        this.doCommandCallback = (err, info) => {
            if (err && /TRYCREATE|Mailbox/i.test(err.message)) {
                return this.createBox(false, this.imapServer.writeFolder, err1 => {
                    if (err1) {
                        return CallBack(err1);
                    }
                    return this.append(text, subject, CallBack);
                });
            }
            console.log(`[${this.imapServer.listenFolder || this.imapServer.imapSerialID}] append doCommandCallback `, err);
            return CallBack(err, info);
        };
        let out = `Date: ${new Date().toUTCString()}\r\nContent-Type: application/octet-stream\r\nContent-Disposition: attachment\r\nMessage-ID:<${Uuid.v4()}@>${this.imapServer.domainName}\r\n${subject ? 'Subject: ' + subject + '\r\n' : ''}Content-Transfer-Encoding: base64\r\nMIME-Version: 1.0\r\n\r\n${text}`;
        this.commandProcess = (text1, cmdArray, next, _callback) => {
            switch (cmdArray[0]) {
                case '*':
                case '+': {
                    if (!this.imapServer.literalPlus && out.length && !this.callback) {
                        console.log(`====> append ! this.imapServer.literalPlus && out.length && ! this.callback = [${!this.imapServer.literalPlus && out.length && !this.callback}]`);
                        this.debug ? debugOut(out, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
                        this.callback = true;
                        next(null, out + '\r\n');
                    }
                    return _callback();
                }
                default:
                    return _callback();
            }
        };
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `APPEND "${this.imapServer.writeFolder}" {${out.length}${this.imapServer.literalPlus ? '+' : ''}}`;
        this.cmd = `${this.Tag} ${this.cmd}`;
        const time = out.length + 30000;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (!this.writable) {
            //console.log (`[${ this.imapServer.imapSerialID }] ImapServerSwitchStream append !this.writable doing imapServer.socket.end ()`)
            return this.imapServer.socket.end();
        }
        this.push(this.cmd + '\r\n');
        this.appendWaitResponsrTimeOut = timers_1.setTimeout(() => {
            return this.doCommandCallback(new Error(`IMAP append TIMEOUT`));
        }, time);
        //console.log (`*************************************  append time = [${ time }] `)
        if (this.imapServer.literalPlus) {
            this.debug ? debugOut(out, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
            this.push(out + '\r\n');
        }
    }
    appendStreamV4(Base64Data = '', subject = null, folderName, CallBack) {
        if (!Base64Data) {
            Base64Data = '';
        }
        console.log(`appendStreamV4 Base64Data = [${Base64Data}]`);
        this.doCommandCallback = (err, response) => {
            //this.debug ? saveLog (`appendStreamV2 doing this.doCommandCallback`) : null
            timers_1.clearTimeout(this.appendWaitResponsrTimeOut);
            if (err) {
                if (/TRYCREATE/i.test(err.message)) {
                    return this.createBox(false, this.imapServer.writeFolder, err1 => {
                        if (err1) {
                            return CallBack(err1);
                        }
                        return this.appendStreamV4(Base64Data, subject, folderName, CallBack);
                    });
                }
                return CallBack(err);
            }
            let code = response && response.length ? response.split('[')[1] : null;
            if (code) {
                code = code.split(' ')[2];
                //console.log ( `this.doCommandCallback\n\n code = ${ code } code.length = ${ code.length }\n\n` )
                if (code) {
                    return CallBack(null, parseInt(code));
                }
            }
            CallBack();
        };
        const out = `Date: ${new Date().toUTCString()}\r\nContent-Type: application/octet-stream\r\nContent-Disposition: attachment\r\nMessage-ID:<${Uuid.v4()}@>${this.imapServer.domainName}\r\n${subject ? 'Subject: ' + subject + '\r\n' : ''}Content-Transfer-Encoding: base64\r\nMIME-Version: 1.0\r\n\r\n`;
        this.commandProcess = (text1, cmdArray, next, _callback) => {
            switch (cmdArray[0]) {
                case '*':
                case '+': {
                    if (!this.imapServer.literalPlus && out.length && !this.callback) {
                        this.callback = true;
                        //this.debug ? debugOut ( out, false, this.imapServer.IMapConnect.imapUserName ) : null
                        next(null, out + Base64Data + '\r\n');
                    }
                    return _callback();
                }
                default:
                    return _callback();
            }
        };
        const _length = out.length + Base64Data.length;
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `APPEND "${folderName}" {${_length}${this.imapServer.literalPlus ? '+' : ''}}`;
        this.cmd = `${this.Tag} ${this.cmd}`;
        const _time = _length + 1000 * 60;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (!this.writable) {
            return this.doCommandCallback(new Error('! imap.writable '));
        }
        this.push(this.cmd + '\r\n');
        this.appendWaitResponsrTimeOut = timers_1.setTimeout(() => {
            return this.doCommandCallback(new Error('appendStreamV3 mail serrver write timeout!'));
        }, _time);
        //console.log (`*************************************  append time = [${ time }] `)
        if (this.imapServer.literalPlus) {
            //this.debug ? debugOut ( out + Base64Data + '\r\n', false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
            this.push(out);
            this.push(Base64Data + '\r\n');
        }
    }
    seachUnseen(callabck) {
        let newSwitchRet = null;
        let moreNew = false;
        this.doCommandCallback = (err) => {
            if (err)
                return callabck(err);
            return callabck(null, newSwitchRet, moreNew);
        };
        this.commandProcess = (text, cmdArray, next, _callback) => {
            switch (cmdArray[0]) {
                case '*': {
                    if (/^SEARCH$/i.test(cmdArray[1])) {
                        const uu1 = cmdArray[2] && cmdArray[2].length > 0 ? parseInt(cmdArray[2]) : 0;
                        if (cmdArray.length > 2 && uu1) {
                            if (!cmdArray[cmdArray.length - 1].length)
                                cmdArray.pop();
                            const uu = cmdArray.slice(2).join(',');
                            if (/\,/.test(uu[uu.length - 1]))
                                uu.substr(0, uu.length - 1);
                            newSwitchRet = uu;
                            moreNew = cmdArray.length > 3;
                        }
                        return _callback();
                    }
                    if (/^EXISTS$/i.test(cmdArray[2])) {
                        this.imapServer.emit('SEARCH_HAVE_EXISTS');
                    }
                    return _callback();
                }
                default:
                    return _callback();
            }
        };
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} UID SEARCH ALL`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable) {
            return this.push(this.cmd + '\r\n');
        }
        return this.imapServer.destroyAll(null);
    }
    fetch(fetchNum, callback) {
        this.fetchEmptyBody = this.isFetchBodyFinished = false;
        this.doCommandCallback = (err) => {
            console.log(`ImapServerSwitchStream doing doCommandCallback this.imapServer.fetching = [${this.imapServer.fetching}]`);
            if (this.fetchEmptyBody) {
                return timers_1.setTimeout(() => {
                    console.log(`\n\nError have no body! Try again.`);
                    return this.fetch(fetchNum, callback);
                }, 1000);
            }
            if (err) {
                console.log(`\n\n\nfetch Error\n`, err);
                if (this.isFetchBodyFinished) {
                    return callback(null, this.newSwitchRet);
                }
            }
            return callback(err, this.newSwitchRet);
        };
        this.newSwitchRet = false;
        this.commandProcess = (text1, cmdArray, next, _callback) => {
            switch (cmdArray[0]) {
                case '*': {
                    if (/^FETCH$/i.test(cmdArray[2])) {
                        if (/\{\d+\}/.test(text1)) {
                            this.imapServer.fetching = parseInt(text1.split('{')[1].split('}')[0]);
                            /**
                             * 			SUPPORT ZOHO empty Body!
                             */
                            if (!this.imapServer.fetching) {
                                console.log(`this.imapServer.fetching body = empty!`);
                                this.fetchEmptyBody = true;
                            }
                        }
                        //this.debug ? console.log ( `${ text1 } doing length [${ this.imapServer.fetching }]` ) : null
                    }
                    if (/^RECENT$/i.test(cmdArray[2]) && parseInt(cmdArray[1]) > 0) {
                        this.newSwitchRet = true;
                    }
                    return _callback();
                }
                default: {
                    return _callback();
                }
            }
        };
        //console.log (`ImapServerSwitchStream doing UID FETCH `)
        this.cmd = `UID FETCH ${fetchNum} ${this.imapServer.fetchAddCom}`;
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} ${this.cmd}`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        this.appendWaitResponsrTimeOut = timers_1.setTimeout(() => {
            //this.imapServer.emit ( 'error', new Error (`${ this.cmd } timeout!`))
            return this.doCommandCallback(new Error(`${this.cmd} timeout!`));
        }, this.imapServer.fetching + 1000 * 120);
        if (this.writable) {
            return this.push(this.cmd + '\r\n');
        }
        return this.imapServer.destroyAll(null);
    }
    deleteBox(CallBack) {
        this.doCommandCallback = CallBack;
        this.commandProcess = (text1, cmdArray, next, _callback) => {
            return _callback();
        };
        this.cmd = `DELETE "${this.imapServer.listenFolder}"`;
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} ${this.cmd}`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable)
            return this.push(this.cmd + '\r\n');
        return this.imapServer.destroyAll(null);
    }
    deleteAMailBox(boxName, CallBack) {
        this.doCommandCallback = err => {
            return CallBack(err);
        };
        this.commandProcess = (text1, cmdArray, next, _callback) => {
            return _callback();
        };
        this.cmd = `DELETE "${boxName}"`;
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} ${this.cmd}`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable)
            return this.push(this.cmd + '\r\n');
        return this.imapServer.destroyAll(null);
    }
    flagsDeleted(num, CallBack) {
        this.doCommandCallback = err => {
            //saveLog ( `ImapServerSwitchStream this.flagsDeleted [${ this.imapServer.listenFolder }] doing flagsDeleted success! typeof CallBack = [${ typeof CallBack }]`)
            return CallBack(err);
        };
        this.commandProcess = (text1, cmdArray, next, _callback) => {
            switch (cmdArray[0]) {
                case '*': {
                    if (/^FETCH$/i.test(cmdArray[2])) {
                        if (/\{\d+\}/.test(text1)) {
                            this.imapServer.fetching = parseInt(text1.split('{')[1].split('}')[0]);
                        }
                        this.debug ? console.log(`${text1} doing length [${this.imapServer.fetching}]`) : null;
                    }
                    if (/^EXISTS$/i.test(cmdArray[2]) && parseInt(cmdArray[1]) > 0) {
                        this.newSwitchRet = true;
                    }
                    return _callback();
                }
                default:
                    return _callback();
            }
        };
        this.cmd = `UID STORE ${num} FLAGS.SILENT (\\Deleted)`;
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} ${this.cmd}`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable) {
            return this.push(this.cmd + '\r\n');
        }
        return this.imapServer.destroyAll(null);
    }
    expunge(CallBack) {
        this.doCommandCallback = err => {
            return CallBack(err, this.newSwitchRet);
        };
        this.commandProcess = (text, cmdArray, next, _callback) => {
            switch (cmdArray[0]) {
                case '*': {
                    if (/^RECENT$|^EXPUNGE$|^EXISTS$/i.test(cmdArray[2]) && parseInt(cmdArray[1]) > 0) {
                        //console.log (`\n\nexpunge this.newSwitchRet = true\n\n`)
                        this.newSwitchRet = true;
                    }
                    return _callback();
                }
                default:
                    return _callback();
            }
        };
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} EXPUNGE`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable) {
            return this.push(this.cmd + '\r\n');
        }
        return this.imapServer.destroyAll(null);
    }
    listAllMailBox(CallBack) {
        let boxes = [];
        this.doCommandCallback = (err) => {
            if (err)
                return CallBack(err);
            return CallBack(null, boxes);
        };
        this.commandProcess = (text, cmdArray, next, _callback) => {
            switch (cmdArray[0]) {
                case '*': {
                    debug ? exports.saveLog(`IMAP listAllMailBox this.commandProcess text = [${text}]`) : null;
                    if (/^LIST/i.test(cmdArray[1])) {
                        boxes.push(cmdArray[2] + ',' + cmdArray[4]);
                    }
                    return _callback();
                }
                default:
                    return _callback();
            }
        };
        this.Tag = `A${this.imapServer.TagCount1()}`;
        this.cmd = `${this.Tag} LIST "" "*"`;
        this.debug ? debugOut(this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null;
        if (this.writable)
            return this.push(this.cmd + '\r\n');
        return this.imapServer.destroyAll(null);
    }
}
const connectTimeOut = 10 * 1000;
class qtGateImap extends Event.EventEmitter {
    constructor(IMapConnect, listenFolder, deleteBoxWhenEnd, writeFolder, debug, newMail, skipOldMail = true) {
        super();
        this.IMapConnect = IMapConnect;
        this.listenFolder = listenFolder;
        this.deleteBoxWhenEnd = deleteBoxWhenEnd;
        this.writeFolder = writeFolder;
        this.debug = debug;
        this.newMail = newMail;
        this.skipOldMail = skipOldMail;
        this.imapStream = new ImapServerSwitchStream(this, this.deleteBoxWhenEnd, this.debug);
        this.newSwitchRet = null;
        this.newSwitchError = null;
        this.fetching = null;
        this.tagcount = 0;
        this.domainName = this.IMapConnect.imapUserName.split('@')[1];
        this.serverSupportTag = null;
        this.idleSupport = null;
        this.condStoreSupport = null;
        this.literalPlus = null;
        this.fetchAddCom = '';
        this.imapEnd = false;
        this.imapSerialID = Crypto.createHash('md5').update(JSON.stringify(this.IMapConnect)).digest('hex').toUpperCase();
        this.port = typeof this.IMapConnect.imapPortNumber === 'object' ? this.IMapConnect.imapPortNumber[0] : this.IMapConnect.imapPortNumber;
        this.connectTimeOut = null;
        this.connect();
        this.once(`error`, err => {
            debug ? exports.saveLog(`[${this.imapSerialID}] this.on error ${err && err.message ? err.message : null}`) : null;
            this.imapEnd = true;
            return this.destroyAll(err);
        });
    }
    TagCount1() {
        if (++this.tagcount < MAX_INT)
            return this.tagcount;
        return this.tagcount = 0;
    }
    connect() {
        let conn = null;
        const _connect = () => {
            timers_1.clearTimeout(timeout);
            console.log(Util.inspect(this.socket, false, 2, true));
            this.socket = conn;
            this.socket.setKeepAlive(true);
            this.socket.pipe(this.imapStream).pipe(this.socket).once('error', err => {
                return this.destroyAll(err);
            }).once('end', () => {
                return this.destroyAll(null);
            });
        };
        //console.log ( `qtGateImap connect mail server [${ this.IMapConnect.imapServer }: ${ this.port }] setTimeout [${ connectTimeOut /1000 }] !`)
        const timeout = timers_1.setTimeout(() => {
            return this.socket.destroy(new Error('connect time out!'));
        }, connectTimeOut);
        try {
            conn = Tls.connect({ host: this.IMapConnect.imapServer, servername: this.IMapConnect.imapServer, port: this.port }, _connect);
        }
        catch (ex) {
            console.log(ex);
            return this.connect();
        }
        return conn.once('error', err => {
            return this.destroyAll(err);
        });
    }
    destroyAll(err) {
        //console.trace (`class qtGateImap on destroyAll`, err )
        this.imapEnd = true;
        if (this.socket && typeof this.socket.end === 'function') {
            this.socket.end();
        }
        return this.emit('end', err);
    }
    logout(CallBack = null) {
        console.log(`IMAP logout`);
        const _end = () => {
            if (typeof CallBack === 'function') {
                return CallBack();
            }
        };
        if (this.imapEnd) {
            console.log(`this.imapEnd`);
            return _end();
        }
        this.imapEnd = true;
        console.log(`this.imapStream.loginoutWithCheck`);
        return this.imapStream.loginoutWithCheck(() => {
            if (this.socket && typeof this.socket.end === 'function') {
                this.socket.end();
            }
            else {
                console.log(`this.socket have not end function!`);
            }
            this.emit('end');
            return _end();
        });
    }
}
exports.qtGateImap = qtGateImap;
const seneMessageToFolder = (IMapConnect, writeFolder, message, subject, createFolder, CallBack) => {
    const wImap = new qtGateImap(IMapConnect, null, false, writeFolder, debug, null);
    let _callback = false;
    //console.log ( `seneMessageToFolder !!! ${ subject }`)
    wImap.once('error', err => {
        wImap.destroyAll(err);
        if (!_callback) {
            CallBack(err);
            return _callback = true;
        }
    });
    wImap.once('ready', () => {
        Async.series([
            next => {
                if (!createFolder) {
                    return next();
                }
                return wImap.imapStream.createBox(false, writeFolder, next);
            },
            next => wImap.imapStream.appendStreamV4(message, subject, writeFolder, next),
            next => wImap.imapStream._logoutWithoutCheck(next)
        ], err => {
            _callback = true;
            if (err) {
                wImap.destroyAll(err);
            }
            return CallBack(err);
        });
    });
};
exports.seneMessageToFolder = seneMessageToFolder;
class qtGateImapRead extends qtGateImap {
    constructor(IMapConnect, listenFolder, deleteBoxWhenEnd, newMail, skipOldMail = false) {
        super(IMapConnect, listenFolder, deleteBoxWhenEnd, null, debug, newMail, skipOldMail);
        this.openBox = false;
        this.once('ready', () => {
            this.openBox = true;
        });
    }
}
exports.qtGateImapRead = qtGateImapRead;
const getMailAttached = (email) => {
    const attachmentStart = email.indexOf('\r\n\r\n');
    if (attachmentStart < 0) {
        console.log(`getMailAttached error! can't faind mail attahced start!\n${email.toString()}`);
        return '';
    }
    const attachment = email.slice(attachmentStart + 4);
    return attachment.toString();
};
exports.getMailAttached = getMailAttached;
const getMailSubject = (email) => {
    const ret = email.toString().split('\r\n\r\n')[0].split('\r\n');
    const yy = ret.find(n => {
        return /^subject\: /i.test(n);
    });
    if (!yy || !yy.length) {
        debug ? exports.saveLog(`\n\n${ret} \n`) : null;
        return '';
    }
    return yy.split(/^subject\: +/i)[1];
};
exports.getMailSubject = getMailSubject;
const getMailAttachedBase64 = (email) => {
    const attachmentStart = email.indexOf('\r\n\r\n');
    if (attachmentStart < 0) {
        console.log(`getMailAttached error! can't faind mail attahced start!`);
        return null;
    }
    const attachment = email.slice(attachmentStart + 4);
    return attachment.toString();
};
exports.getMailAttachedBase64 = getMailAttachedBase64;
const imapAccountTest = (IMapConnect, CallBack) => {
    debug ? exports.saveLog(`start test imap [${IMapConnect.imapUserName}]`, true) : null;
    let callbackCall = false;
    let startTime = null;
    const listenFolder = Uuid.v4();
    const ramdomText = Crypto.randomBytes(20);
    let timeout = null;
    const doCallBack = (err, ret) => {
        if (!callbackCall) {
            exports.saveLog(`imapAccountTest doing callback err [${err && err.message ? err.message : `undefine `}] ret [${ret ? ret : 'undefine'}]`);
            callbackCall = true;
            timers_1.clearTimeout(timeout);
            return CallBack(err, ret);
        }
    };
    let rImap = new qtGateImapRead(IMapConnect, listenFolder, debug, mail => {
        rImap.logout();
    });
    rImap.once('ready', () => {
        rImap.logout();
    });
    rImap.once('end', err => {
        console.log(`imapAccountTest on end err = `, err);
        doCallBack(err);
    });
    rImap.once('error', err => {
        debug ? exports.saveLog(`rImap.once ( 'error' ) [${err.message}]`, true) : null;
        return doCallBack(err);
    });
};
exports.imapAccountTest = imapAccountTest;
const imapGetMediaFile = (IMapConnect, fileName, CallBack) => {
    let rImap = new qtGateImapRead(IMapConnect, fileName, debug, mail => {
        rImap.logout();
        const retText = exports.getMailAttachedBase64(mail);
        return CallBack(null, retText);
    });
};
exports.imapGetMediaFile = imapGetMediaFile;
const pingPongTimeOut = 1000 * 15;
const resetConnectTimeLength = 1000 * 60 * 30;
class imapPeer extends Event.EventEmitter {
    constructor(imapData, listenBox, writeBox, newMail, exit) {
        super();
        this.imapData = imapData;
        this.listenBox = listenBox;
        this.writeBox = writeBox;
        this.newMail = newMail;
        this.exit = exit;
        this.domainName = this.imapData.imapUserName.split('@')[1];
        this.waitingReplyTimeOut = null;
        this.pingUuid = null;
        this.doingDestroy = false;
        this.peerReady = false;
        this.makeRImap = false;
        this.needPingTimeOut = null;
        this.pinging = false;
        this.connected = false;
        this.rImap_restart = false;
        this.checkSocketConnectTime = null;
        this.rImap = null;
        debug ? exports.saveLog(`doing peer account [${imapData.imapUserName}] listen with[${listenBox}], write with [${writeBox}] `) : null;
        console.dir(`newMail = ${typeof newMail}`);
        this.newReadImap();
    }
    restart_rImap() {
        console.dir('restart_rImap');
        if (this.rImap_restart) {
            return console.log(`already restart_rImap STOP!`);
        }
        this.rImap_restart = true;
        if (typeof this.rImap?.imapStream?.loginoutWithCheck === 'function') {
            return this.rImap.imapStream.loginoutWithCheck(() => {
                if (typeof this.exit === 'function') {
                    this.exit(0);
                }
            });
        }
        if (typeof this.exit === 'function') {
            this.exit(0);
        }
    }
    checklastAccessTime() {
        timers_1.clearTimeout(this.checkSocketConnectTime);
        return this.checkSocketConnectTime = timers_1.setTimeout(() => {
            return this.restart_rImap();
        }, resetConnectTimeLength);
    }
    mail(email) {
        //console.log (`imapPeer new mail:\n\n${ email.toString()} this.pingUuid = [${ this.pingUuid  }]`)
        const subject = exports.getMailSubject(email);
        const attr = exports.getMailAttached(email);
        console.log(email.toString());
        /**
         * 			PING get PONG
         */
        if (subject === this.pingUuid) {
            this.pingUuid = null;
            this.connected = true;
            this.pinging = false;
            timers_1.clearTimeout(this.waitingReplyTimeOut);
            return this.emit('CoNETConnected', attr);
        }
        if (subject) {
            /**
             *
             *
             *
             */
            if (attr.length < 40) {
                console.log(`new attr\n${attr}\n`);
                const _attr = attr.split(/\r?\n/)[0];
                if (!this.connected && !this.pinging) {
                    this.Ping(false);
                }
                if (subject === _attr) {
                    console.log(`\n\nthis.replyPing [${_attr}]\n\n this.ping.uuid = [${this.pingUuid}]`);
                    return this.replyPing(subject);
                }
                console.log(`this.pingUuid = [${this.pingUuid}] subject [${subject}]`);
                return console.log(`new attr\n${_attr}\n _attr [${buffer_1.Buffer.from(_attr).toString('hex')}] subject [${buffer_1.Buffer.from(subject).toString('hex')}]]!== attr 【${JSON.stringify(_attr)}】`);
            }
            /**
             * 			ignore old mail
             */
            if (!this.connected) {
                return;
            }
            return this.newMail(attr, subject);
        }
        console.log(`get mail have not subject\n\n`, email.toString());
    }
    replyPing(uuid) {
        console.log(`\n\nreplyPing = [${uuid}]\n\n`);
        return this.AppendWImap1(uuid, uuid, err => {
            if (err) {
                debug ? exports.saveLog(`reply Ping ERROR! [${err.message ? err.message : null}]`) : null;
            }
        });
    }
    AppendWImap1(mail, uuid, CallBack) {
        return exports.seneMessageToFolder(this.imapData, this.writeBox, mail, uuid, true, CallBack);
    }
    setTimeOutOfPing(sendMail) {
        console.trace(`setTimeOutOfPing [${this.pingUuid}]`);
        timers_1.clearTimeout(this.waitingReplyTimeOut);
        timers_1.clearTimeout(this.needPingTimeOut);
        debug ? exports.saveLog(`Make Time Out for a Ping, ping ID = [${this.pingUuid}]`, true) : null;
        return this.waitingReplyTimeOut = timers_1.setTimeout(() => {
            debug ? exports.saveLog(`ON setTimeOutOfPing this.emit ( 'pingTimeOut' ) pingID = [${this.pingUuid}] `, true) : null;
            this.pingUuid = null;
            this.connected = false;
            this.pinging = false;
            return this.emit('pingTimeOut');
        }, sendMail ? pingPongTimeOut * 8 : pingPongTimeOut);
    }
    Ping(sendMail) {
        if (this.pinging) {
            return console.trace('Ping stopd! pinging = true !');
        }
        this.pinging = true;
        this.emit('ping');
        this.pingUuid = Uuid.v4();
        debug ? exports.saveLog(`doing ping test! this.pingUuid = [${this.pingUuid}], sendMail = [${sendMail}]`) : null;
        return this.AppendWImap1(null, this.pingUuid, err => {
            if (err) {
                this.pinging = false;
                this.pingUuid = null;
                console.dir(`PING this.AppendWImap1 Error [${err.message}]`);
                return this.Ping(sendMail);
            }
            return this.setTimeOutOfPing(sendMail);
        });
    }
    newReadImap() {
        if (this.makeRImap || this.rImap && this.rImap.imapStream && this.rImap.imapStream.readable) {
            return debug ? exports.saveLog(`newReadImap have rImap.imapStream.readable = true, stop!`, true) : null;
        }
        this.makeRImap = true;
        //saveLog ( `=====> newReadImap!`, true )
        this.rImap = new qtGateImapRead(this.imapData, this.listenBox, debug, email => {
            this.mail(email);
        }, true);
        this.rImap.once('ready', () => {
            this.emit('ready');
            this.makeRImap = this.rImap_restart = false;
            //debug ? saveLog ( `this.rImap.once on ready `): null
            this.Ping(false);
            this.checklastAccessTime();
        });
        this.rImap.on('error', err => {
            this.makeRImap = false;
            debug ? exports.saveLog(`rImap on Error [${err.message}]`, true) : null;
            if (err && err.message && /auth|login|log in|Too many simultaneous|UNAVAILABLE/i.test(err.message)) {
                return this.destroy(1);
            }
            if (this.rImap && this.rImap.destroyAll && typeof this.rImap.destroyAll === 'function') {
                return this.rImap.destroyAll(null);
            }
        });
        this.rImap.on('end', err => {
            this.rImap.removeAllListeners();
            this.rImap = null;
            this.makeRImap = false;
            timers_1.clearTimeout(this.waitingReplyTimeOut);
            if (this.rImap_restart) {
                console.dir(`rImap.on ( 'end' ) this.rImap_restart = TRUE`, err);
            }
            if (typeof this.exit === 'function') {
                debug ? exports.saveLog(`imapPeer rImap on END!`) : null;
                this.exit(err);
                return this.exit = null;
            }
            debug ? exports.saveLog(`imapPeer rImap on END! but this.exit have not a function `) : null;
        });
    }
    destroy(err) {
        timers_1.clearTimeout(this.waitingReplyTimeOut);
        timers_1.clearTimeout(this.needPingTimeOut);
        timers_1.clearTimeout(this.checkSocketConnectTime);
        console.log(`destroy IMAP!`);
        console.trace();
        if (this.doingDestroy) {
            return console.log(`destroy but this.doingDestroy = ture`);
        }
        this.doingDestroy = true;
        this.peerReady = false;
        if (this.rImap) {
            return this.rImap.imapStream.loginoutWithCheck(() => {
                if (typeof this.exit === 'function') {
                    this.exit(err);
                    this.exit = null;
                }
            });
        }
        if (this.exit && typeof this.exit === 'function') {
            this.exit(err);
            this.exit = null;
        }
    }
    sendDataToANewUuidFolder(data, writeBox, subject, CallBack) {
        return exports.seneMessageToFolder(this.imapData, writeBox, data, subject, !this.connected, CallBack);
    }
}
exports.imapPeer = imapPeer;
