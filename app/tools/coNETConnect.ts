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
import * as Tool from './initSystem'
import * as Fs from 'fs'
import * as Async from 'async'
import { EIDRM } from 'constants'
import { Console } from 'console'


let logFileFlag = 'w'
const saveLog = ( err: {} | string, _console = false ) => {
	if ( !err ) {
		return 
	}
	const data = `${ new Date().toUTCString () }: ${ typeof err === 'object' ? ( err['message'] ? err['message'] : '' ) : err }\r\n`
	_console ? console.log ( data ) : null
	return Fs.appendFile ( Tool.CoNETConnectLog, data, { flag: logFileFlag }, () => {
		return logFileFlag = 'a'
	})
}

const timeOutWhenSendConnectRequestMail = 1000 * 60
const commandRequestTimeOutTime = 1000 * 10
const requestTimeOut = 1000 * 60

export default class extends Imap.imapPeer {
	private CoNETConnectReady = false
	public connectStage = -1
	public alreadyExit = false
	private timeoutWaitAfterSentrequestMail: NodeJS.Timeout = null
	private roomEmit = this.server.to ( this.socket.id )
	private timeoutCount = {}

	public exit1 ( err ) {
		console.trace (`imapPeer doing exit! this.sockerServer.emit ( 'tryConnectCoNETStage', null, -1 )`)
		this.roomEmit.emit ( 'tryConnectCoNETStage', null, -1 )
		if ( !this.alreadyExit ) {
			this.alreadyExit = true
			console.log (`CoNETConnect class exit1 doing this._exit() success!`)
			return this._exit ( err )
		}
		console.log ( `exit1 cancel already Exit [${ err }]`)
	}

	public setTimeWaitAfterSentrequestMail () {
		this.timeoutWaitAfterSentrequestMail = setTimeout (() => {
			return this.roomEmit.emit ( 'tryConnectCoNETStage', null, 0 )
		}, requestTimeOut * 2 )
	}

	constructor ( public imapData: IinputData, public server: SocketIO.Server, public socket: SocketIO.Socket, 
		private cmdResponse: ( mail: string, hashCode: string ) => void, public _exit: ( err ) => void ) {
		super ( imapData, imapData.clientFolder, imapData.serverFolder, err => {
			console.debug ( `imapPeer doing exit! err =`, err )
			this.roomEmit.emit ( 'tryConnectCoNETStage', null, -2 )
			return this.exit1 ( err )
		})

		saveLog (`=====================================  new CoNET connect()`, true )
		this.roomEmit.emit ( 'tryConnectCoNETStage', null, 5 )
		this.newMail = ( mail: string, hashCode: string ) => {
			return this.cmdResponse ( mail, hashCode )
		}

		this.on ( 'CoNETConnected', publicKey => {
			
			this.CoNETConnectReady = true
			saveLog ( 'Connected CoNET!', true )
			//console.log ( publicKey )
			clearTimeout ( this.timeoutWaitAfterSentrequestMail )
			this.connectStage = 4
			this.roomEmit.emit ( 'tryConnectCoNETStage', null, 4, publicKey )
			return 
		})

		this.on ( 'pingTimeOut', () => {

			console.log ( `class CoNETConnect on pingTimeOut` )
			
			return this.roomEmit.emit ( 'pingTimeOut' )
			

		})

		this.on ( 'ping', () => {
			this.roomEmit.emit ( 'tryConnectCoNETStage', null, 2 )
			//this.sockerServer.emit ( 'tryConnectCoNETStage', null, 2 )
		})
		
	}

	public requestCoNET_v1 ( uuid: string, text: string, CallBack ) {
		return this.sendDataToANewUuidFolder ( Buffer.from ( text ).toString ( 'base64' ), this.imapData.serverFolder, uuid, CallBack )
	}

	/**
	 * 1:18.254
	 */

	public getFile ( fileName: string, CallBack ) {
		const idle_wait_timeout = 1000 * 10
		let callback = false
		let SEARCH_HAVE_EXISTS = false
		let idle_wait_timeout_process = null
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
			clearTimeout ( idle_wait_timeout_process )
			const attr = Imap.getMailAttached ( mail )
			const subject = Imap.getMailSubject ( mail )
			console.log (`=========>   getFile mail.length = [${ mail.length }] attr.length = [${ attr.length }]`)
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
			
			rImap.removeAllListeners ()
			rImap = null
			
			if ( !callback ) {
				if ( this.timeoutCount[ "fileName" ] ++ < 3 ) {
					saveLog (`getFile got error [${ err }]\nDoing getFile again!\n`)
					return this.getFile ( fileName, CallBack  )
				}
				console.log (`getFile callback === false && timeoutCount =【${ this.timeoutCount[ "fileName" ] }】`)
				callback = true
				return CallBack ('GetFile got maximum tryed.' )
			}

			return saveLog (`getFile [${ fileName }] success!`)
		})

		rImap.once ('SEARCH_HAVE_EXISTS', () => {
			SEARCH_HAVE_EXISTS = true
		})

		rImap.once ('ready', () => {
			
			if ( SEARCH_HAVE_EXISTS ) {
				console.log (`rImap.once ('ready') SEARCH_HAVE_EXISTS = True It is server still uploading now, doing getFile again! `)
				return rImap.logout (() => {
					return this.getFile ( fileName, CallBack )
				})
				
			}
			console.log (`rImap.once ('ready') SEARCH_HAVE_EXISTS = false, Server side have not uploading now, waiting IDLE and setup timeout`)
			idle_wait_timeout_process = setTimeout (() => {
				return rImap.logout (() => {
					return CallBack ( new Error ('idle_wait_timeout'))
				})
			}, idle_wait_timeout )
		})

	}

	public getFileV1 ( fileName: string, CallBack ) {
		let callback = false 
		let idle_wait_timeout_process = null
		if ( !this.timeoutCount[ "fileName" ] ) {
			this.timeoutCount[ "fileName" ] = 1
		}
		const imapClone: IinputData = JSON.parse ( JSON.stringify ( this.imapData ))
		if ( /^imap\.mail\.me\.com/.test ( this.imapData.imapServer )) {
			imapClone.imapServer = 'p03-imap.mail.me.com'
		}

		const rImap = new Imap.qtGateImap ( imapClone, null, false, null, true, mail => {
			clearTimeout ( idle_wait_timeout_process )
			const attr = Imap.getMailAttached ( mail )
			const subject = Imap.getMailSubject ( mail )
			console.log (`=========>   getFile mail.length = [${ mail.length }] attr.length = [${ attr.length }]`)
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
			console.log (`getFileV1 rImap.once ( 'ready' )`)
			return Async.series ([
				
				next => rImap.imapStream.openBoxV1 ( fileName, next ),
				next => rImap.imapStream.fetch ( 1, next )
			], err => {
				
				let doAgain = false
				if ( err ) {
					
					if ( ++ this.timeoutCount[ "fileName" ] < 3 ) {
						console.dir ( `getFileV1 [${ fileName }] this.timeoutCount[ "fileName" ] < 3, doing again`)
						doAgain = true
					}
					
					
				}
				
				return rImap.imapStream._logoutWithoutCheck (() => {
					
					if ( doAgain ) {
						console.log (`getFileV1 [${ fileName }] doAgain` )
						return this.getFile ( fileName, CallBack )
					}
					console.log (`getFileV1【${ fileName }】success!`)
				})
				
			})
		})
	
		console.log (`new rImap success!`)
	}

}
/**
 * 
 * 
 * 
 */
/*
const imap = {"email":"2B92E647A2EEBE3620CDFC7B0486D502A6EAD0E8","account":"2B92E647A2EEBE3620CDFC7B0486D502A6EAD0E8","smtpServer":"smtp.mail.me.com","smtpUserName":"qtgate_test20@icloud.com","smtpPortNumber":[465,587,994],"smtpSsl":true,"smtpIgnoreCertificate":false,"smtpUserPassword":"dgiq-slit-nift-ywgy","imapServer":"imap.mail.me.com","imapPortNumber":993,"imapSsl":true,"imapUserName":"qtgate_test20@icloud.com","imapIgnoreCertificate":false,"imapUserPassword":"dgiq-slit-nift-ywgy","timeZoneOffset":420,"language":"tw","imapTestResult":null,"clientFolder":"89a3e98b-8d55-4cfe-83f0-6237ece496bf","serverFolder":"fe9a88f7-916e-4100-846a-eab5086d3231","randomPassword":"df65fa74-52b1-44ec-b006-15a0a83a5618","uuid":"37ed5324-86b4-4f7f-be61-65843bd7ed65","confirmRisk":true,"clientIpAddress":null,"ciphers":null,"sendToQTGate":false}
const getFileV1 = ( imapData: IinputData, fileName: string, CallBack ) => {
	let callback = false 
	let idle_wait_timeout_process = null
	
	
	if ( /^imap\.mail\.me\.com/.test ( imapData.imapServer )) {
		imapData.imapServer = 'p03-imap.mail.me.com'
	}

	const rImap = new Imap.qtGateImap ( imapData, null, false, null, true, mail => {
		clearTimeout ( idle_wait_timeout_process )
		const attr = Imap.getMailAttached ( mail )
		const subject = Imap.getMailSubject ( mail )
		console.log (`=========>   getFile mail.length = [${ mail.length }] attr.length = [${ attr.length }]`)
		if ( !callback ) {
			callback = true
			CallBack ( null, attr, subject )
		}
	} )
	
	rImap.once ( 'error', err => {
		rImap.destroyAll ( err )
	})


	rImap.once ( 'ready', () => {
		console.log (`getFileV1 rImap.once ( 'ready' )`)
		return Async.series ([
			
			next => rImap.imapStream.openBoxV1 ( fileName, next ),
			next => rImap.imapStream.fetch ( 1, next )
		], err => {
			
			let doAgain = false
			if ( err ) {
				console.log (`getFileV1 Async.series error`, err )
				if ( ++ this.timeoutCount[ "fileName" ] < 3 ) {
					console.dir ( `getFileV1 this.timeoutCount[ "fileName" ] < 3, doing again`)
					doAgain = true
				}
				
				
			}
			console.log (`Async.series success!`, err )
			return rImap.imapStream._logoutWithoutCheck (() => {
				console.log (`rImap.logout success!` )
				if ( doAgain ) {
					return this.getFile ( fileName, CallBack )
				}
				console.log (`getFileV1【${ fileName }】success!`)
			})
			
		})
	})

	console.log (`new rImap success!`)
}

getFileV1 (imap, '83ae9b48-d6b6-4edb-94e9-22fbad88fd02', ( err, data, uuid ) => {
	if ( err ) {
		return console.log ( err)
	}
	console.log (`SUCCESS\n[${ data.length }] [${ uuid }]`)
})

/** */