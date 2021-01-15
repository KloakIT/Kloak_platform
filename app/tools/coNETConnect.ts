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

import * as Imap from './imap'
import * as Async from 'async'


const saveLog = ( err: {} | string, _console = false ) => {
	if ( !err ) {
		return 
	}
	const data = `${ new Date().toUTCString () }: ${ typeof err === 'object' ? ( err['message'] ? err['message'] : '' ) : err }`
	_console ? console.dir ( data ) : null
	
}

const timeOutWhenSendConnectRequestMail = 1000 * 60
const commandRequestTimeOutTime = 1000 * 10
const requestTimeOut = 1000 * 60

export default class extends Imap.imapPeer {
	private CoNETConnectReady = false
	public connectStage = -1
	public alreadyExit = false
	private timeoutWaitAfterSentrequestMail: NodeJS.Timeout = null
	private timeoutCount = {}
	private socketPool = []
	public checkSocketConnectTime = null

	public exit1 ( err ) {
		let nameSpace: SocketIO.Namespace | SocketIO.Socket = this.socket.nsp
		if ( typeof nameSpace.emit !== 'function') {
			nameSpace = this.socket
		}
		console.trace (`imapPeer doing exit! this.sockerServer.emit ( 'tryConnectCoNETStage', null, -1 )`)
		nameSpace.emit ( 'tryConnectCoNETStage', null, -1 )
		if ( !this.alreadyExit ) {
			this.alreadyExit = true
			console.log (`CoNETConnect class exit1 doing this._exit() success!`)
			return this._exit ( err )
		}
		console.log ( `exit1 cancel already Exit [${ err }]`)
	}

	public setTimeWaitAfterSentrequestMail () {
		let nameSpace: SocketIO.Namespace | SocketIO.Socket = this.socket.nsp
		if ( typeof nameSpace.emit !== 'function') {
			nameSpace = this.socket
		}
		this.timeoutWaitAfterSentrequestMail = setTimeout (() => {
			return nameSpace.emit ( 'tryConnectCoNETStage', null, 0 )
		}, requestTimeOut * 2 )
	}
	/*
	private checkSocketConnect () {
		let nameSpace: SocketIO.Namespace | SocketIO.Socket = this.socket.nsp

		if ( typeof nameSpace.clients !== 'function') {
			return this.destroy ( 0 )
		}

		return nameSpace.clients (( err, n ) => {
			if ( err ) {
				return console.log (`checkSocketConnect roomEmit.clients error!!!`, err )
			}
			console.log (`\n\n`)
			console.dir (`checkSocketConnect roomEmit.clients [${ n.length }]`)
			console.log (`\n\n`)

			if ( !n || !n.length ) {
				return this.destroy ( 0 )
			}

			this.checkSocketConnectTime = setTimeout (() => {
				return this.checkSocketConnect ()
			}, requestTimeOut )
		})
	}
	*/
	constructor ( public keyID, public imapData: IinputData, public socket: SocketIO.Socket,
		public newMail: ( mail: string, hashCode: string ) => void, public _exit: ( err ) => void ) {
			
		super ( imapData, imapData.clientFolder, imapData.serverFolder, newMail, err => {
			console.debug ( `imapPeer doing exit! err =`, err )

			socket.emit ( 'tryConnectCoNETStage', null, -2 , () => {
				console.log (`nameSpace emit tryConnectCoNETStage -2 get response!`)
			})
			return this.exit1 ( err )
		})


		saveLog (`=====================================  new CoNET connect()`, true )
		
		socket.emit ( 'tryConnectCoNETStage', null, 5, () => {
			saveLog (`socket emit tryConnectCoNETStage 5 get response!`)
		})


		this.on ( 'CoNETConnected', publicKey => {
			
			this.CoNETConnectReady = true
			saveLog ( 'Connected CoNET!', true )
			//console.log ( publicKey )
			clearTimeout ( this.timeoutWaitAfterSentrequestMail )
			this.connectStage = 4
			return socket.emit ( 'tryConnectCoNETStage', null, 4, publicKey, () => {
				saveLog (`socket emit tryConnectCoNETStage 4 get response!`)
			})
		})

		this.on ( 'pingTimeOut', () => {

			saveLog( `class CoNETConnect on pingTimeOut` )
			
			return socket.emit ( 'pingTimeOut' )
			

		})

		this.on ( 'ping', () => {
			socket.emit ( 'tryConnectCoNETStage', null, 2, () => {
				saveLog (`socket emit tryConnectCoNETStage 2 get response!`)
			})
			//this.sockerServer.emit ( 'tryConnectCoNETStage', null, 2 )
		})

		this.socketPool.push ( socket )

		socket.once ( 'disconnect', () => {
			clearTimeout ( this.timeoutWaitAfterSentrequestMail )
			const index = this.socketPool.findIndex ( n => n.id === socket.id )
			if ( index < 0 ) {
				return console.dir (`CoNetConnect class socket.on disconnect, socket id [${ socket.id }] have not in socketPool 【${ this.socketPool.map ( n => n.id )}]】`)
			}
			console.dir (`CoNetConnect class socket.on disconnect socketPool =【${ this.socketPool.map ( n => n.id )}】`)
			
		})
		
	}

	public requestCoNET_v1 ( uuid: string, text: string, CallBack ) {
		this.checklastAccessTime ()
		return this.sendDataToANewUuidFolder ( Buffer.from ( text ).toString ( 'base64' ), this.imapData.serverFolder, uuid, CallBack )
	}

	/**
	 * 1:18.254
	 */

	public getFile ( fileName: string, CallBack ) {
		let callback = false
		if ( !this.timeoutCount[ fileName ]) {
			this.timeoutCount[ fileName ] = 1
		}
		if ( this.alreadyExit ) {
			return CallBack ( new Error ('alreadyExit'))
		}
		console.log (`requestCoNET_v1 get file:[${ fileName }]`)
		console.log (`this.imapData.imapServer = [${ this.imapData.imapServer }]`)
		const imapClone: IinputData = JSON.parse ( JSON.stringify ( this.imapData ))
		if ( /^imap\.mail\.me\.com/.test ( this.imapData.imapServer )) {
			imapClone.imapServer = 'p03-imap.mail.me.com'
		}

		let rImap: Imap.qtGateImapRead = new Imap.qtGateImapRead ( imapClone, fileName, true, mail => {
			
			const attr = Imap.getMailAttached ( mail )
			const subject = Imap.getMailSubject ( mail )
			//console.dir (`=========>   getFile mail.length = [${ mail.length }] attr.length = [${ attr.length }]`)
			if ( !callback ) {
				callback = true
				CallBack ( null, attr, subject )
			}
			return rImap.logout ()
		})

		rImap.once ( 'error', err => {
			console.log (`CoNetConnect.getFile on error`, err )
			return rImap.destroyAll( null )
		})

		rImap.once( 'end', err => {
			console.dir (`[${ fileName }]rImap.once END`)
			rImap.destroyAll ( null )
			rImap.removeAllListeners ()
			rImap = null
			if ( err ) {
				if ( !callback ) {
					if ( this.timeoutCount[ "fileName" ] ++ < 3 ) {
						saveLog (`getFile got error [${ err }]\nDoing getFile again!\n`)
						return this.getFile ( fileName, CallBack  )
					}
					callback = true

					return CallBack ( err )
				}
				
			}
			
			return saveLog (`getFile [${ fileName }] success!`)
		})

	}

	public getFileV1 ( fileName: string, CallBack ) {
		let callback = false
		let _mail = false
		let idle_wait_timeout_process = null
		if ( !this.timeoutCount[ fileName ] ) {
			this.timeoutCount[ fileName ] = 1
		}
		const imapClone: IinputData = JSON.parse ( JSON.stringify ( this.imapData ))
		if ( /^imap\.mail\.me\.com/.test ( this.imapData.imapServer )) {
			imapClone.imapServer = 'p03-imap.mail.me.com'
		}

		const rImap = new Imap.qtGateImap ( imapClone, null, false, null, false, mail => {
			clearTimeout ( idle_wait_timeout_process )
			if ( !mail || mail.length < 50 ) {
				return console.log (`getFileV1 [${ fileName }] mail empty!`)
			}
			_mail = true
			const attr = Imap.getMailAttached ( mail )
			const subject = Imap.getMailSubject ( mail )
			//console.dir (`=========>   getFile mail.length = [${ mail.length }] attr.length = [${ attr.length }]`)
			if ( !callback ) {
				callback = true
				CallBack ( null, attr, subject )
			}
		} )
		
		rImap.once ( 'error', err => {
			rImap.destroyAll ( err )
		})
	
	
		rImap.once ( 'ready', () => {
			rImap.imapSerialID = fileName
			//console.log (`getFileV1 rImap.once ( 'ready' )`)
			return Async.series ([
				
				next => rImap.imapStream.openBoxV1 ( fileName, next ),
				next => rImap.imapStream.fetch ( 1, next )
				
			], err => {
				
				let doAgain = false
				

				if ( _mail ) {
					return Async.series ([
						next => rImap.imapStream.flagsDeleted ( '1', next ),
						next => rImap.imapStream.expunge ( next ),
						next => rImap.imapStream._logoutWithoutCheck ( next )
					], err => {
						//console.log (`new rImap success!`)
					})
					
				}

				if ( err || !callback ) {
					
					if ( ++ this.timeoutCount[ fileName ] < 20 ) {
						console.dir ( `getFileV1 [${ fileName }] this.timeoutCount[ ${ fileName }  ] < 20, doing again`)
						doAgain = true
					} else {
						console.dir (` ++ this.timeoutCount[  ${ fileName } ] [${ this.timeoutCount[ fileName ] }] > 20 `)
					}
					
				}
				console.log (`doAgain = 【${ doAgain }】 callback = 【${ callback } 】`)
				
				return rImap.imapStream._logoutWithoutCheck (() => {
					
					if ( doAgain ) {
						console.log (`getFileV1 [${ fileName }] doAgain` )
						return setTimeout (() => this.getFileV1 ( fileName, CallBack ), 3000 )
					}
					if ( callback ) {
						return console.log (`getFileV1 callback already TRUE!!!`)
					}
					return CallBack ( new Error ('timeout'))
				})
				
			})
		})
	
		
	}

	
}