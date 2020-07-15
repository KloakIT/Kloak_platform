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
const messageBoxDefine = {
	LoadingPage: ['正在解密数据和加载页面','暗号化したデータを復号化とページの読み込み中。','Decrypting data and loading page.','正在解密数据和加载頁面'],
	offline:
		['无互联网，邮件服务器无法到达！','インターネットがないか、メールサーバーへ接続ができません！','Have no Internet, can not connect to mail server!','無互聯網，郵件伺服器無法到達！'],
	systemError:
		['CoNET客户端故障，请重启后再试','端末故障です、CoNETを再起動してください','CoNET client error! Restart CoNET please!','CoNET客戶端故障，請重啟後再試'],
	reConnectCoNET:
		['CoNET链接已中断','CoNETとの接続が中断され','CoNET connection lost.','CoNET的鏈接已中斷'
	],
	localWebsiteError: [
		'CoNet网络通讯模块无应答！','CoNetネットワーク通信モジュールの応答なし',`No response from CoNet's network module`,'CoNet網絡通訊模塊无應答！',
	],
	localWebsiteDecryptError: [
		'CoNet网络通讯模块应答通讯解密错误','CoNetネットワーク通信モジュールは暗号化した通信が復号化できません','CoNet network module responds a decryption error.','CoNet網絡通訊模塊應答通訊解密錯誤'
	],
	connectingToCoNET:
		['正在连接CoNET...','CoNETへ接続中...','Connecting to CoNET...','正在連結CoNET...'
	],
	connectedToCoNET:
		['无IP地址成功连接CoNET','IPなしでCoNETに接続しました','Success to connect CoNET without IP address.','無IP地址成功連結CoNET'],
	
	maximumRequest: [
		'您的请求已达最大值，请稍后再试',
		'レクエスト回数は制限にかかった、後ほど改めてお試しください',
		'Request maximum error. Try again later.',
		'您的請求已達最大值，請稍後再試'
	],
	invalidRequest: [
		'无效请求',
		'無効なレクエスト',
		'Invalid request.',
		'無效請求'
	],
	unKnowError: [
		'未知错误，请再试！如果持续发生请重启CoNET客户端或重新安装',
		'不明なエラーが発生、もしこんな状況が続くであれば、CoNET端末を再起動するか、CoNET端末を再インストールしてください。',
		'Oops. Unknown error. Try again or restart CoNET client, if still same error please re-install CoNET.',
		'未知错误，请再试！如果持续发生请重启CoNET客户端或重新安装'

	],
	NodeInBusy: [
		'节点目前繁忙，请稍后再试','ノードは忙しいです。しばらくしてからもう一度お試しください','Node is currently busy, please try again later','节点目前繁忙，请稍后再试'
	],
	PgpMessageFormatError: [
		'内容格式错误，请复制从“-----BEGIN PGP MESSAGE----- （开始，一直到）-----END PGP MESSAGE-----” 结束的完整内容，粘贴在此输入框中。',
		'フォーマットエラー、コピーするのは「-----BEGIN PGP MESSAGE-----」から「-----END PGP MESSAGE-----」まで全ての内容をしてください。',
		'Format error! Copy all content from [-----BEGIN PGP MESSAGE-----] ... to [-----END PGP MESSAGE-----]. Paste into this text box.',
		'內容格式錯誤，請複制從“-----BEGIN PGP MESSAGE----- （開始，一直到）-----END PGP MESSAGE-----” 結束的完整內容，粘貼在此輸入框中。'
	],
	PgpDecryptError: [
		'提供的内容不能被解密，请确认这是在您收到的最后一封从CoNET发送过来的激活信。如果还是没法完成激活，请删除您的密钥重新生成和设定。',
		'この内容で暗号化解除ができませんでした。鍵ペアEmailアカンウトメールボックス再検査し、CoNETから最後のを選んでください。または鍵ペアを削除して、鍵ペア再発行してください。',
		'Decrypt message failed. Find the lasest mail from CoNET in your key pair email mailbox. Or delete this key pair and rebuild new key pair please.',
		'提供的內容不能被解密，請確認這是在您收到的最後一封從CoNET發送過來的激活信。如果還是沒法完成激活，請刪除您的密鑰重新生成和設定。'
	],
	pageLoadingError: [
		'页面加载发生错误','エラーが発生してページの読み込みが完了できません','Loading page has error.','頁面加載發生錯誤'
	],
	connectToMailServer: [
		'正在连接邮件服务器: ',
		'メールサーバーへ接続をしています: ',
		'Connect to mail server: ',
		'正在連接郵件伺服器: '
	],
	connectedMailServer: [
		'正在连接邮件服务器: 完成',
		'メールサーバーへ接続をしています: 完成',
		'Connect to mail server: success.',
		'正在連接郵件伺服器: 完成'
	],
	waitingPong :[
		'正在等待节点响应: ',
		'ノートのレスポンスを待っています: ',
		'Waiting for a response from node: ',
		'正在等待節點響應: '
	],
	waitingPongTimeOver :[
		'正在等待节点响应: 超时错误！',
		'ノートのレスポンスを待っています: タイムオーバーエラー！',
		'Waiting for a response from node: Over time error!',
		'正在等待節點響應: 響應超時錯誤！'
	],
	sendConnectRequestMail :[
		'客户端向节点发出联机请求邮件，完成需要额外的时间，请耐心等待',
		'接続メールをノートへ送信しました、完了まで時間がかかります、しばらくお待ち下さい',
		'Sending connection request email to node. Please wait a moment',
		'客戶端向節點發出聯機請求郵件，完成需要額外的時間，請耐心等待'
	],
	timeOut: [
		'节点无响应，可能正在忙碌中，请稍后再试',
		'ノートの応答がなかったです、忙しいかもしれませんが、後ほどもう一度してみてください。',
		'Node have not responding to requests, try again later.',
		'節點無響應，可能正在忙碌中，請稍後再試'
	],



}

const requestTimeOut = 1000 * 180

class connectInformationMessage {
	public offlineInfo = ko.observable ( false )
	public showNegative = ko.observable ( false )
	public showGreen = ko.observable ( false )
	public messageArray = ko.observable ( null )
	public socketIoOnline = false
	public socketIo = null
	
	public localServerPublicKey = ""

	private requestPool = new Map ()
	private first = true
	constructor ( private keyID: string, private _view ) {

		const self = this

		this.offlineInfo.subscribe ( function (vv) {
			if ( this.first ) {
				return
			}
			const div =  $('#offlineInfo')
			if ( vv ) {
				return div.transition('fly down')
			}
			div.transition('fly down')
		})

		this.first = false
		
		
	}

	public socketListening ( url: string ) {
		const self = this

		if ( this.socketIo ) {
			if ( _view.connectedCoNET() ) {
				this.socketIo.close ()
				this.socketIo.removeAllListeners()
				this.socketIo = null
				_view.networkConnect ( false )
				_view.connectedCoNET ( false )
				return _view.localServerConnected ( false )
			}
			
			if ( _view.CoNETConnect() && typeof _view.CoNETConnect().sendConnectMail === 'function') {
				return _view.CoNETConnect().sendConnectMail()
			}
		}

		this.socketIo =  io ( url, { reconnectionAttempts: 5, timeout: 500, autoConnect: true })
		this.socketIo.on ( 'reconnect_failed', () => {
			console.dir ( `reconnect_failed`)
			//self.showErrorMessage ( 'systemError' )
		})
		
		this.socketIo.on ( 'connect', () => {
			console.dir (`on connect`)
			return self.getServerPublicKey ( err => {
				if ( err ) {
					console.dir (`getServerPublicKey error!`, err )
				}
				_view.localServerConnected ( true )
				console.dir (`getServerPublicKey success!`)
				if ( _view.imapData ) {
					_view.connectToNode ()
				}
			})
		})
		
		this.socketIo.on ( 'reconnect', attempt => {
			console.dir (`on reconnect`)
			/*
			if ( _view && _view.keyPairCalss && typeof _view.keyPairCalss.getServerPublicKey === "function" ) {
				return _view.keyPairCalss.getServerPublicKey ( err => {
					if ( err ) {
						return self.showErrorMessage ( 'systemError' )
					}
				})
			}
			*/
			
		})
		
		this.socketIo.on ( 'doingRequest', ( mess, uuid ) => {
			this.onDoingRequest ( mess, uuid )
		})


		this.socketIo.on ( 'systemErr', err => {
			console.dir ( err )
			//return self.showErrorMessage ( err )
		})

		this.socketIo.on ( this.keyID, encryptoText => {
			return this._view.sharedMainWorker.decryptJsonWithAPKey ( encryptoText, ( err, obj: QTGateAPIRequestCommand ) => {

				if ( err ) {
					return self.showErrorMessage ( err )
				}
				
				switch ( obj.command ) {
					case 'daggr': {
						if ( this._view.appScript() && typeof this._view.appScript().getMessage === 'function' ) {
							
							return this._view.appScript().getMessage ( obj )
						}

					}

					default: {
						self.showErrorMessage ( 'unknow command from node!' )
					}
				}
				
			})
		})

		this.socketIo.on ( 'disconnect', reason => {
			if ( reason === 'io server disconnect') {
				// the disconnection was initiated by the server, you need to reconnect manuall
				return this.socketIo.connect()
			}
			console.log ( `socketIo.on ( 'disconnect' )`, reason )
		})


	}

	public emitRequest ( cmd: QTGateAPIRequestCommand, CallBack ) {
		const self = this
		const uuid = cmd.requestSerial
		this.requestPool.set ( uuid, 
			{
				CallBack: CallBack,
				cmd: cmd,
				timeOut: setTimeout(() => {
					self.requestPool.delete ( uuid )
					return CallBack ( new Error ( 'timeOut' ))
				}, requestTimeOut )
			})
		return this._view.sharedMainWorker.encryptedWithAccessPointKey ( cmd, ( err, ciphertext ) => {
			if ( err ) {
				return self.showErrorMessage ( err )
			}
			return self.sockEmit ( 'doingRequest' , uuid, ciphertext, err => {
				return CallBack ( err )
			})
		})

	}

	private onDoingRequest = async ( encryptoText: string, uuid: string ) => {
		const self = this
		const request = this.requestPool.get ( uuid )
		if ( !request ) {
			return console.dir ( `onDoingRequest have no uuid ${ uuid }`)
		}
		
		
		return this._view.sharedMainWorker.decryptJsonWithAPKey ( encryptoText, ( err, obj: QTGateAPIRequestCommand ) => {

			if ( err ) {
				return self.showErrorMessage ( err )
			}
			if ( obj.error !== -1 ) {
				clearTimeout ( request.timeOut )
			}
			
			return request.CallBack ( null, obj )
		})
		
		

	}

	public getServerPublicKey ( CallBack ) {
		if ( !this._view.keyPair ()) {
			return CallBack ()
		}
		const publicKey = this._view.keyPair().publicKey
		const self = this
		return this.sockEmit ( 'keypair', publicKey, async ( err, data ) => {
			if ( err ) {
				self.showErrorMessage ( err )
				return CallBack ( err )
			}
			self.localServerPublicKey = data
			
			self._view.keyPair()["localserverPublicKey"] = data
			return self._view.sharedMainWorker.localSeverPublicKey ( data, CallBack )
			
		})
	}

	public emitLocalCommand ( emitName: string, command: any, CallBack? ) {
		return this._view.sharedMainWorker.encrypto_withLocalServerKey ( command, ( err, data ) => {
			if ( err ) {
				return CallBack ( err )
			}
			return this.sockEmit ( emitName, data, CallBack )
		})

	}

	public showErrorMessage ( err ) {
		if ( !err ) {
			return
		}

		let errMes = ( typeof err === "string" ) ? messageBoxDefine[ err ] : messageBoxDefine[ err.message ]
		if ( !errMes ) {
			return
		}

		this.hideMessage()
		this.messageArray ( errMes )
		this.showNegative ( true )
		this.offlineInfo ( true )
	}

	public showSystemError () {
		return this.showErrorMessage ( 'systemError' )
	}

	public showRestartCoNET_Connect () {
		this.showErrorMessage ( 'reConnectCoNET' )
	}
	
	public hideMessage() {
		this.offlineInfo ( false )
		this.messageArray ( null )
		this.showNegative ( false )

	}

	public getErrorIndex ( err ) {
 
		if ( ! err ) {
			return 'unKnowError'
		}
		
		if ( typeof err !== 'object' ) {
			return messageBoxDefine [ err ] ? err : 'unKnowError'
		}
		
		return messageBoxDefine [ err['message']] ? err['message'] : 'unKnowError'
	}

	public sockEmit ( eventName: string, ...args ) {

		const argLength = args.length - 1
		let _CallBack = null
	
		if ( argLength > -1 && typeof ( args[ argLength ]) === 'function' ) {
			_CallBack = args.pop ()
		}
		
		this.socketIo.emit ( eventName, ...args, uuid => {
			clearTimeout ( _timeout )
			if ( _CallBack ) {
				const reconnect = () => {
					return _CallBack ( new Error ( 'socket.io reconnected ' ))
				}
				this.socketIo.once ( 'reconnect', reconnect )
				return this.socketIo.once ( uuid, ( err, ...data ) => {
					this.socketIo.removeListener ( 'reconnect', reconnect )
					if ( err ) {
						//self.showErrorMessage ( err )
					}
		
					if ( _CallBack ) {
						return _CallBack ( err, ...data )
					}
				})
			}
			
		})
	
		const _timeout = setTimeout(() => {
			if ( _CallBack ) {
				_CallBack( "localWebsiteError" )
				return _CallBack = null
			}
			return this.showSystemError()
		}, 5000 )
	}

	public fetchFiles ( files: string, CallBack ) {
		const filesArray = files.split (',')
		let data = []
		let currentFIle = filesArray.shift ()
		let repertTime = 0
		const _callBack = ( _err, _data, sha1sum ) => {
			if ( _err ) {
				if ( ++ repertTime > 4 ) {
					return CallBack ( _err )
				}
				return fetchFIle ( _callBack )
			}
			data.push ({
				uuid: currentFIle,
				data: _data,
				sha1sum: sha1sum
			})
			if ( filesArray.length ) {
				currentFIle = filesArray.shift ()
				return fetchFIle ( _callBack )
			}

			return CallBack ( null , data )
		}


		const fetchFIle = ( _CallBack ) => {
			
			return this.emitLocalCommand ( 'getFilesFromImap', currentFIle, _CallBack )
		}
	
		return fetchFIle ( _callBack )
	}
	
}

