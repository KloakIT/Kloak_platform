// class DownloadQueue {
// 	private downloadQueue: kloak_downloadObj[]  = []
// 	private downloading = false
// 	private stoped = false
// 	private currentIndex = 0
// 	private requestUUID = uuid_generate()
// 	public totalLength = 0
// 	private stopProcess ( err ) {
// 		// this.CallBack ( new Error ( err ))
// 		this.stoped = true
// 		this.downloadQueue = []
// 		return this.Log ( err )
// 	}
// 	private downloadProcess () {
// 		if ( this.stoped ) {
// 			this.Log (`downloadProcess this.stoped!`, this.downloadQueue )
// 			return this.downloadQueue = []
// 		}
// 		if ( this.downloading ) {
// 			return this.Log (`downloadProcess downloading!!`)
// 		}
// 		const _check = () => {
// 			const index = this.downloadQueue.findIndex ( n => n.order === this.currentIndex )
// 			if ( index < 0 ) {
// 				this.Log (`[${ this.downloadQueue.map ( n => n.order )}]`)
// 				return null
// 			}
// 			const coms = this.downloadQueue.splice ( index, 1 )
// 			this.downloading = true
// 			return coms[0]
// 		}
// 		const com = _check ()
// 		if ( !com ) {
// 			return this.Log (`_check return null, currentIndex [${ this.currentIndex }] downloadQueue.length [ ${ this.downloadQueue.length }]`)
// 		}
// 		this.Log (`downloadObj coming! [${ com.downloadUuid }] ORDER [${ com.order }] EOF [${ com.eof }]`)
// 		return _view.connectInformationMessage.fetchFiles ( com.downloadUuid, ( err, data ) => {
// 			if ( err ) {
// 				const message = `downloadProcess ERROR [${ err }] when fetch order ${ com.order } UUID [${ com.downloadUuid }], Download STOP!`
// 				return this.stopProcess ( message )
// 			}
// 			if ( data ) {
// 				if ( typeof this.dataCallBackBeforeDecryptoCallBack === 'function' ) {
// 					this.dataCallBackBeforeDecryptoCallBack ( this.requestUUID, com, data.data )
// 				}
// 				return _view.sharedMainWorker.decryptStreamWithoutPublicKey ( Buffer.from ( data.data ).toString(), ( err, _data ) => {
// 					if ( err ) {
// 						const err = `Unable to decrypt file ORDER [${ com.order }]`
// 						return this.stopProcess ( err )
// 					}
// 					this.currentIndex ++
// 					this.downloading = false
// 					if ( _data ) {
// 						this.CallBack ( null, _data.data )
// 					}
// 					if ( com.eof ) {
// 						return this.stopProcess ('EOF')
// 					}
// 					return this.downloadProcess ()
// 				})
// 			}
// 			this.Log (`downloadPart have NO Data, order ${ com.order }`)
// 			if ( com.eof ) {
// 				return this.stopProcess ('EOF')
// 			}
// 			this.currentIndex ++
// 			this.downloading = false
// 			return this.downloadProcess ()
// 		})
// 	}
// 	private Log ( ...args ) {
// 		const now = new Date()
// 		console.log (`[${ now.toLocaleTimeString()}:${ now.getMilliseconds()}]  [${ this.title }] ${ args }`)
// 	}
// 	constructor ( downloadUrl: string, private title: string, private CallBack, private dataCallBackBeforeDecryptoCallBack: ( requestUuid: string, com, data ) => void = null ) {
// 		this.Log (`new DownloadQueue UUID [${ this.requestUUID }]`)
// 		if (! downloadUrl) {
// 			const err = new Error ( `No URL present! Decode signatureCipher!` )
// 			this.Log( err.message )
// 			return CallBack ( err )
// 		}
// 		const com: QTGateAPIRequestCommand = {
// 			command: 'CoSearch',
// 			Args: [ downloadUrl ],
// 			error: null,
// 			subCom: 'downloadFile',
// 			requestSerial: this.requestUUID,
// 		}
// 		const _CallBack = ( _err, com: QTGateAPIRequestCommand ) => {
// 			if ( this.stoped ) {
// 				return 
// 			}
// 			if ( _err ) {
// 				const err = new Error (`Emit request error ${ _err.message }`)
// 				this.Log( err.message )
// 				return CallBack ( err )
// 			}
// 			if ( !com ) {
// 				return
// 			}
// 			if ( com.error === -1 ) {
// 				return
// 			}
// 			if ( com.error ) {
// 				const err = `Kloak response error ${ com.error }`
// 				return this.stopProcess ( err )
// 			}
// 			if ( com.subCom === 'downloadFile' ) {
// 				const downloadObj: kloak_downloadObj = com.Args[0]
// 				this.totalLength = downloadObj.totalLength
// 				if ( downloadObj.order !== this.currentIndex ) {
// 					if ( downloadObj.order < this.currentIndex ) {
// 						return this.Log (`ORDER [${ downloadObj.order }] already passed `)
// 					}
// 					const index = this.downloadQueue.findIndex ( n => n.order === downloadObj.order )
// 					if ( index < 0 ) {
// 						this.downloadQueue.push ( downloadObj )
// 					}
// 					return this.downloadProcess ()
// 				}
// 				/**
// 				 * 
// 				 * 			current order already running!
// 				 */
// 				if ( this.downloading ) {
// 					return
// 				}
// 				this.downloadQueue.push ( downloadObj )
// 				return this.downloadProcess ()
// 			}
// 			const message = `emitRequest get response !== 'downloadFile' STOP!`
// 			console.log ( com )
// 			return this.stopProcess ( message )
// 		}
// 		_view.connectInformationMessage.emitRequest ( com, _CallBack )
// 	}
// 	public stopDownload () {
// 		this.stoped = true
// 	}
// }
// class mediaHtmlStream {
// 	constructor ( uuid: string, ) {
// 	}
// }
class DownloadQueue {
    constructor(downloadUrl, title, CallBack, dataCallBackBeforeDecryptoCallBack = null, range) {
        this.title = title;
        this.CallBack = CallBack;
        this.dataCallBackBeforeDecryptoCallBack = dataCallBackBeforeDecryptoCallBack;
        this.range = range;
        this.downloadQueue = [];
        this.downloading = false;
        this.stoped = false;
        this.currentIndex = 0;
        this.requestUUID = uuid_generate();
        this.totalLength = 0;
        this.Log(`new DownloadQueue UUID [${this.requestUUID}]`);
        if (!downloadUrl) {
            const err = new Error(`No URL present! Decode signatureCipher!`);
            this.Log(err.message);
            return CallBack(err);
        }
        const com = {
            command: 'CoSearch',
            Args: [downloadUrl],
            error: null,
            subCom: 'downloadFile',
            requestSerial: this.requestUUID
        };
        // const com: QTGateAPIRequestCommand = downloadUrl.includes('https://www.youtube.com/watch?v=') ? {
        // 	command: 'CoSearch',
        // 	Args: [ downloadUrl, this.range ],
        // 	error: null,
        // 	subCom: 'youtube_getVideoMp4',
        // 	requestSerial: this.requestUUID
        // } : {
        // 	command: 'CoSearch',
        // 	Args: [ downloadUrl],
        // 	error: null,
        // 	subCom: 'downloadFile',
        // 	requestSerial: this.requestUUID
        // }
        const _CallBack = (_err, com) => {
            if (this.stoped) {
                return;
            }
            if (_err) {
                const err = new Error(`Emit request error ${_err.message}`);
                this.Log(err.message);
                return CallBack(err);
            }
            if (!com) {
                return;
            }
            if (com.error === -1) {
                return;
            }
            if (com.error) {
                const err = `Kloak response error ${com.error}`;
                return this.stopProcess(err);
            }
            if (com.subCom === 'downloadFile') {
                const downloadObj = com.Args[0];
                this.totalLength = downloadObj.totalLength;
                if (downloadObj.order !== this.currentIndex) {
                    if (downloadObj.order < this.currentIndex) {
                        return this.Log(`ORDER [${downloadObj.order}] already passed `);
                    }
                    const index = this.downloadQueue.findIndex(n => n.order === downloadObj.order);
                    if (index < 0) {
                        this.downloadQueue.push(downloadObj);
                    }
                    return this.downloadProcess();
                }
                /**
                 *
                 * 			current order already running!
                 */
                if (this.downloading) {
                    return;
                }
                this.downloadQueue.push(downloadObj);
                return this.downloadProcess();
            }
            const message = `emitRequest get response !== 'downloadFile' || 'youtube_getVideoMp4' STOP!`;
            console.log(com);
            return this.stopProcess(message);
        };
        _view.connectInformationMessage.emitRequest(com, _CallBack);
    }
    stopProcess(err) {
        // this.CallBack ( new Error ( err ))
        this.stoped = true;
        this.downloadQueue = [];
        return this.Log(err);
    }
    downloadProcess() {
        if (this.stoped) {
            this.Log(`downloadProcess this.stoped!`, this.downloadQueue);
            return this.downloadQueue = [];
        }
        if (this.downloading) {
            return this.Log(`downloadProcess downloading!!`);
        }
        const _check = () => {
            const index = this.downloadQueue.findIndex(n => n.order === this.currentIndex);
            if (index < 0) {
                this.Log(`[${this.downloadQueue.map(n => n.order)}]`);
                return null;
            }
            const coms = this.downloadQueue.splice(index, 1);
            this.downloading = true;
            return coms[0];
        };
        const com = _check();
        if (!com) {
            return this.Log(`_check return null, currentIndex [${this.currentIndex}] downloadQueue.length [ ${this.downloadQueue.length}]`);
        }
        this.Log(`downloadObj coming! [${com.downloadUuid}] ORDER [${com.order}] EOF [${com.eof}]`);
        return _view.connectInformationMessage.fetchFiles(com.downloadUuid, (err, data) => {
            if (err) {
                const message = `downloadProcess ERROR [${err}] when fetch order ${com.order} UUID [${com.downloadUuid}], Download STOP!`;
                return this.stopProcess(message);
            }
            if (data) {
                if (typeof this.dataCallBackBeforeDecryptoCallBack === 'function') {
                    this.dataCallBackBeforeDecryptoCallBack(this.requestUUID, com, data.data);
                }
                return _view.sharedMainWorker.decryptStreamWithoutPublicKey(Buffer.from(data.data).toString(), (err, _data) => {
                    if (err) {
                        const err = `Unable to decrypt file ORDER [${com.order}]`;
                        return this.stopProcess(err);
                    }
                    this.currentIndex++;
                    this.downloading = false;
                    if (_data) {
                        this.CallBack(null, _data.data);
                    }
                    if (com.eof) {
                        return this.stopProcess('EOF');
                    }
                    return this.downloadProcess();
                });
            }
            this.Log(`downloadPart have NO Data, order ${com.order}`);
            if (com.eof) {
                return this.stopProcess('EOF');
            }
            this.currentIndex++;
            this.downloading = false;
            return this.downloadProcess();
        });
    }
    Log(...args) {
        const now = new Date();
        console.log(`[${now.toLocaleTimeString()}:${now.getMilliseconds()}]  [${this.title}] ${args}`);
    }
    stopDownload() {
        this.stoped = true;
    }
}
class Mp4LocalServerUrl {
    constructor(bufferTotalLength, callBack) {
        this.bufferTotalLength = bufferTotalLength;
        this.uuid = '';
        this.readyTransfer = false;
        this.postUrl = '/streamUrl';
        this.posting = false;
        this.transferBufferLength = 1024 * 1024;
        this.currentStartPoint = 0;
        this.currentEndPoint = 0;
        this.BufferArray = Buffer.alloc(0);
        _view.connectInformationMessage.sockEmit('requestStreamUrl', bufferTotalLength, uuid => {
            this.uuid = uuid;
            _view.connectInformationMessage.socketIo.on(uuid, (range) => {
                console.log(`Start transfer Buffer!range = [${range}] `);
                this.readyTransfer = true;
                if (range) {
                    const _range = range.split('=')[1];
                    this.currentStartPoint = parseInt(_range.split('-')[0]) || 0;
                    this.currentEndPoint = parseInt(_range.split('-')[1]) || this.bufferTotalLength;
                    if (this.posting) {
                        console.log(`Already posting! reset to new range!`);
                        this.posting = false;
                    }
                }
                this.transferData();
            });
            return callBack(uuid);
        });
    }
    transferData() {
        if (!this.readyTransfer || this.posting) {
            return console.log(`this.readyTransfer have not ready!`);
        }
        if (this.currentStartPoint > this.bufferTotalLength) {
            return console.log(`All buffer had transfer`);
        }
        if (this.BufferArray.length < this.currentStartPoint) {
            return console.log(`Request part have over buffer!`);
        }
        this.posting = true;
        let endPoint = this.currentStartPoint + this.transferBufferLength;
        endPoint = endPoint > this.bufferTotalLength - 1 ? this.bufferTotalLength - 1 : endPoint;
        if (this.BufferArray.length < endPoint) {
            this.posting = false;
            return console.log(`this.BufferArray.length < endPoint STOP this.BufferArray.length [${this.BufferArray.length}] [${this.currentStartPoint}-${endPoint}]`);
        }
        const buffer = this.BufferArray.slice(this.currentStartPoint, endPoint);
        if (!buffer || !buffer.length) {
            this.posting = false;
            return console.log(`BufferArray.shift () null stop transferData!`);
        }
        console.log(`POST buffer [${this.currentStartPoint}-${endPoint}] length [${buffer.length}]`);
        this.currentStartPoint = endPoint;
        const uuu = Buffer.from(buffer);
        console.log(uuu.slice(0, 100).toString('base64'));
        return $.post(this.postUrl, { uuid: this.uuid, buffer: uuu.toString('base64') })
            .done(() => {
            console.log(`transferData post data success, do again!`);
            this.posting = false;
            return this.transferData();
        })
            .fail(() => {
            this.posting = false;
            return console.log(`transferData post data fail!!!`);
        });
    }
}
class getYoutubeMp4Queue {
    constructor(youtubeUrl, YoutubeTitle, skipSwitch) {
        this.YoutubeTitle = YoutubeTitle;
        this.skipSwitch = skipSwitch;
        this.requestUUID = uuid_generate();
        this.stoped = false;
        this.downloadQueue = [];
        this.currentIndex = 0;
        this.totalLength = 0;
        this.downloading = false;
        this.mp4Url = null;
        this.LocalMp4ServerUUID = null;
        this.streamData = [];
        this.Log(`new getYoutubeMp4Queue UUID [${this.requestUUID}]`);
        if (!youtubeUrl) {
            const err = new Error(`No URL present! Decode signatureCipher!`);
            this.Log(err.message);
        }
        const cmd = {
            command: 'CoSearch',
            Args: [youtubeUrl],
            error: null,
            subCom: 'youtube_getVideoMp4',
            requestSerial: this.requestUUID
        };
        const _CallBack = (_err, com) => {
            if (this.stoped) {
                return;
            }
            if (_err) {
                const err = new Error(`Emit request error ${_err.message}`);
                return this.Log(err.message);
            }
            if (!com) {
                return;
            }
            if (com.error === -1) {
                return;
            }
            if (com.error) {
                const err = `Kloak response error ${com.error}`;
                return this.stopProcess(err);
            }
            if (com.subCom === "youtube_getVideoMp4") {
                const downloadObj = com.Args[0];
                this.totalLength = downloadObj.totalLength;
                if (!this.mp4Url) {
                    this.mp4Url = new Mp4LocalServerUrl(this.totalLength, urlUUid => {
                        this.LocalMp4ServerUUID = urlUUid;
                        //	test
                        this.skipSwitch(this.LocalMp4ServerUUID);
                    });
                }
                if (downloadObj.order !== this.currentIndex) {
                    if (downloadObj.order < this.currentIndex) {
                        return this.Log(`ORDER [${downloadObj.order}] already passed `);
                    }
                    const index = this.downloadQueue.findIndex(n => n.order === downloadObj.order);
                    if (index < 0) {
                        this.downloadQueue.push(downloadObj);
                    }
                    return this.downloadProcess();
                }
                /**
                 *
                 * 			current order already running!
                 */
                if (this.downloading) {
                    return;
                }
                this.downloadQueue.push(downloadObj);
                return this.downloadProcess();
            }
            const message = `emitRequest get response !== 'downloadFile' || 'youtube_getVideoMp4' STOP!`;
            console.log(com);
            return this.stopProcess(message);
        };
        //_view.connectInformationMessage.emitRequest ( cmd, _CallBack )
    }
    Log(...args) {
        const now = new Date();
        console.log(`[${now.toLocaleTimeString()}:${now.getMilliseconds()}]  [${this.YoutubeTitle}] ${args}`);
    }
    stopProcess(err) {
        // this.CallBack ( new Error ( err ))
        this.stoped = true;
        this.downloadQueue = [];
        return this.Log(err);
    }
    downloadProcess() {
        if (this.stoped) {
            this.Log(`downloadProcess this.stoped!`, this.downloadQueue);
            return this.downloadQueue = [];
        }
        if (this.downloading) {
            return this.Log(`downloadProcess downloading!!`);
        }
        const _check = () => {
            const index = this.downloadQueue.findIndex(n => n.order === this.currentIndex);
            if (index < 0) {
                this.Log(`[${this.downloadQueue.map(n => n.order)}]`);
                return null;
            }
            const coms = this.downloadQueue.splice(index, 1);
            this.downloading = true;
            return coms[0];
        };
        const com = _check();
        if (!com) {
            return this.Log(`_check return null, currentIndex [${this.currentIndex}] downloadQueue.length [ ${this.downloadQueue.length}]`);
        }
        this.Log(`downloadObj coming! [${com.downloadUuid}] ORDER [${com.order}] EOF [${com.eof}]`);
        _view.connectInformationMessage.fetchFiles(com.downloadUuid, (err, data) => {
            if (err) {
                const message = `downloadProcess ERROR [${err}] when fetch order ${com.order} UUID [${com.downloadUuid}], Download STOP!`;
                return this.stopProcess(message);
            }
            if (data) {
                /**
                 *
                 * 				save to Fortress
                 */
                console.log(`downloadObj [${com.downloadUuid}] completed, decrypt now !`);
                return _view.sharedMainWorker.decryptStreamWithoutPublicKey(Buffer.from(data.data).toString(), (err, _data) => {
                    if (err) {
                        const err = `Unable to decrypt file ORDER [${com.order}]`;
                        return this.stopProcess(err);
                    }
                    if (!_data || !_data.data) {
                        const err = `!! have not data! [${com.order}]`;
                        return this.stopProcess(err);
                    }
                    this.currentIndex++;
                    this.downloading = false;
                    this.streamData.push(_data.data);
                    this.mp4Url.transferData();
                    /*
                    if ( !this.mp4Url ) {
                        return this.mp4Url = new Mp4LocalServerUrl ( com.totalLength, this, urlUUid => {
                            this.CallBack ( null, urlUUid )
                            this.mp4Url.pushData ( _data.data )
                            if ( com.eof ) {
                                return this.stopProcess ('EOF')
                            }
                            return this.downloadProcess ()
                        })
                        
                    }
                    
                    */
                    //this.CallBack ( null, _data.data )
                    if (com.eof) {
                        return this.stopProcess('EOF');
                    }
                    return this.downloadProcess();
                });
            }
            this.Log(`downloadPart have NO Data, order ${com.order}`);
            if (com.eof) {
                return this.stopProcess('EOF');
            }
            this.currentIndex++;
            this.downloading = false;
            return this.downloadProcess();
        });
    }
}
