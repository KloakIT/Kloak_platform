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

import * as Express from 'express'
import * as Path from 'path'
import * as HTTP from 'http'
import * as SocketIo from 'socket.io'
import * as Tool from './tools/initSystem'
import * as Async from 'async'
import * as Fs from 'fs'
import * as Uuid from 'node-uuid'
import * as Imap from './tools/imap'
import CoNETConnectCalss from './tools/coNETConnect'
import * as mime from 'mime-types'

const Package = require ( '../package.json' )

interface localConnect {
	socket: SocketIO.Socket
	login: boolean
	listenAfterPasswd: boolean
}

let logFileFlag = 'w'

const saveLog = ( err: {} | string ) => {
	if ( !err ) {
		return 
	}
	const data = `${ new Date().toUTCString () }: ${ typeof err === 'object' ? ( err['message'] ? err['message'] : '' ) : err }\r\n`
	console.log ( data )
	return Fs.appendFile ( Tool.ErrorLogFile, data, { flag: logFileFlag }, () => {
		return logFileFlag = 'a'
	})
}

const saveServerStartup = ( postNumber: number, rootPath: string ) => {
	const info = `\n*************************** Kloak Platform [ ${ Package.version } ] server start up *****************************\n` +
			`Access url: http://localhost:${ postNumber }${ rootPath }\n`
	saveLog ( info )
}

const saveServerStartupError = ( err: {} ) => {
	const info = `\n*************************** Kloak Platform [ ${ Package.version } ] server startup falied *****************************\n` +
			`platform ${ process.platform }\n` +
			`${ err['message'] }\n`
	saveLog ( info )
}

const imapErrorCallBack = ( message: string ) => {
	if ( message && message.length ) {
		if ( /auth|login|log in|Too many simultaneous|UNAVAILABLE/i.test( message )) {
			return 1
		}
			
		if ( /ECONNREFUSED/i.test ( message )) {
			return 5
		}

		if (/OVERQUOTA/i.test ( message )) {
			return 6
		}
			
		if ( /certificate/i.test ( message )) {
			return 2
		}
			
		if ( /timeout|ENOTFOUND/i.test ( message )) {
			return 0
		}

		return 5
	}
	
	return -1

}

const resetConnectTimeLength = 1000 * 60 * 30


export default class localServer {
	private expressServer = Express()
	private httpServer = HTTP.createServer ( this.expressServer )
	private socketServer = SocketIo ( this.httpServer )
	public config: install_config  = null

	public savedPasswrod: string = ''
	public localConnected: Map < string, localConnect > = new Map ()
	private localKeyPair: localServerKeyPair = null
	private serverKeyPassword = Uuid.v4()
	private requestPool: Map < string, SocketIO.Socket > = new Map()
	private imapConnectPool: Map <string, CoNETConnectCalss > = new Map()
	private destoryConnectTimePool: Map <string, any > = new Map ()

	private catchCmd ( mail: string, uuid: string ) {
		
		console.log ( `Get response from CoNET uuid [${ uuid }] length [${ mail.length }]`)
		const socket = this.requestPool.get ( uuid )

		if ( !socket ) {
			const keyIdRoom = this.socketServer.of ( uuid  )
			return keyIdRoom.clients (( err, clients ) => {
				if ( err ) {
					console.log ( err )
					return console.dir (`keyIdRoom [${ uuid }] get Error` )
				}
				if ( !clients.length ) {
					console.dir (`keyIdRoom [${ uuid }] have not client!`)
				}
				keyIdRoom.emit ( uuid, mail )
				
			})
			
		}

		socket.emit ( 'doingRequest', mail, uuid )
	}
	
	private tryConnectCoNET ( socket: SocketIO.Socket, imapData: IinputData, sendMail: boolean, nameSpace: SocketIO.Namespace ) {
		
		//		have CoGate connect
		const keyID = socket['keyID']
		let ConnectCalss: CoNETConnectCalss = this.imapConnectPool.get ( keyID )
		clearTimeout ( this.destoryConnectTimePool.get ( keyID ))
		
		if ( ConnectCalss ) {
			console.log (`${ imapData.account } have CoNETConnectCalss `)

			let dontNeedReset = true
			
			if ( ConnectCalss.lastAccessTime && typeof ConnectCalss.lastAccessTime.getTime === "function" ) {
				dontNeedReset = ( new Date ().getTime () - ConnectCalss.lastAccessTime.getTime ()) < resetConnectTimeLength
			}
			

			if ( dontNeedReset && ! ConnectCalss.pingUuid ) {
				
				console.log ( `tryConnectCoNET already have room; [${ keyID }]` )
				
				return ConnectCalss.Ping ( sendMail )
			}

			ConnectCalss.destroy ()
			
		}


		
		const _exitFunction = err => {
			console.trace ( `makeConnect on _exitFunction err this.CoNETConnectCalss destroy!`, err )

			
			if ( err && err.message ) {
				
				//		network error
				if ( / ECONNRESET /i.test) {
					if ( typeof ConnectCalss.destroy === 'function' ) {
						ConnectCalss.destroy ()
					}
					
					
					makeConnect ()
					
				}
			}
			return console.log (`_exitFunction doing nathing!`)
		}

		const makeConnect = () => {
			ConnectCalss = new CoNETConnectCalss ( imapData, this.socketServer, socket, nameSpace, ( mail, uuid ) => {
				return this.catchCmd ( mail, uuid )
			}, _exitFunction )
			
			return this.imapConnectPool.set ( keyID, socket['userConnet'] = ConnectCalss )
		}
		
		return makeConnect()
	}

	
	private listenAfterPassword ( socket: SocketIO.Socket ) {
		let sendMail = false
		const clientName = `[${ socket.id }][ ${ socket.conn.remoteAddress }]`
		
		const workspace = socket.nsp
		
		const checkSocketKeypair = ( socket: SocketIO.Socket, CallBack ) => {
		
			const uuid = Uuid.v4()
			CallBack ( uuid )
	
			const keyPair = socket ["keypair"]
			if ( !keyPair ) {
				console.dir (`on 'checkImap' error: have not keypair object!`)
				socket.emit ( uuid, 'Have not allow' )
				saveLog ( `connect [${ clientName }] have no keyPair`)
				return null
			}

			return uuid
			
		}

		socket.on ( 'checkImap', ( imapConnectData, CallBack1 ) => {
			
			
			const uuid = checkSocketKeypair ( socket, CallBack1 )
			if ( !uuid ) {
				return 
			}
			const keyPair: localServerKeyPair = socket ["keypair"]
			
			return Tool.decryptoMessage ( this.localKeyPair, keyPair.publicKey, imapConnectData, ( err, imapData ) => {
				if ( err ) {
					return socket.emit ( uuid, 'localWebsiteDecryptError' )
				}
				
				
				return this.doingCheckImap ( socket, imapData )
			})
			
		})

		socket.on ( 'tryConnectCoNET', ( imapData: string, CallBack1 ) => {

			console.dir ('【on tryConnectCoNET】')
			const uuid = checkSocketKeypair ( socket, CallBack1 )
			if ( !uuid ) {
				return 
			}

			const keyPair: localServerKeyPair = socket ["keypair"]
			
			return Tool.decryptoMessage ( this.localKeyPair, keyPair.publicKey, imapData, ( err, data ) => {
				if ( err ) {
					console.log ( 'checkImap Tool.decryptoMessage error\n', err )
					return socket.emit ( uuid, 'system' )
				}
				try {

				} catch ( ex ) {
					return socket.emit ( uuid, 'system' )
				}
				return this.tryConnectCoNET ( socket, data, sendMail, workspace )
			})

			
			
		})

		socket.on ( 'doingRequest', ( request_uuid, request, CallBack1 ) => {
			const uuid = checkSocketKeypair ( socket, CallBack1 )
			if ( !uuid ) {
				return 
			}
			const _callBack = ( ...data ) => {
				socket.emit ( uuid, ...data )
			}

			this.requestPool.set ( request_uuid, socket )
			const keyID = socket ["keyID"]

			let userConnet: CoNETConnectCalss = socket [ "userConnet" ] || this.imapConnectPool.get ( keyID )
			if ( ! userConnet ) {
				saveLog ( `doingRequest on ${ uuid } but have not CoNETConnectCalss need restart! socket.emit ( 'systemErr' )`)
				return socket.emit ( uuid, new Error ('have no connect to node'))
			}
			
			userConnet.requestCoNET_v1 ( request_uuid, request, _callBack )

		})

		socket.on ( 'getFilesFromImap', ( files: string, CallBack1 ) => {
			const uuid = checkSocketKeypair ( socket, CallBack1 )
			if ( !uuid ) {
				return 
			}
			const _callBack = ( ...data ) => {
				socket.emit ( uuid, ...data )
			}
			

			const keyPair: localServerKeyPair = socket ["keypair"]
			const keyID = socket ["keyID"]

			return Tool.decryptoMessage ( this.localKeyPair, keyPair.publicKey, files, ( err, data ) => {
				if ( err ) {
					return _callBack ( err.message || err )
				}

				const _files = data
				
				console.log (`socket.on ('getFilesFromImap') _files = [${ _files }] _files.length = [${ _files.length }]`  )
				
				
				const userConnect: CoNETConnectCalss = socket [ "userConnet" ] || this.imapConnectPool.get ( keyID )

				if ( !userConnect ) {
					console.log ( `getFilesFromImap error:![ Have no userConnect ]` )
					return socket.emit ( 'systemErr' )
				}

				console.time ( `getFilesFromImap ${ _files }` )
				let ret = ''
				
				return userConnect.getFileV1 ( _files, ( err, data, subject ) => {
					console.timeEnd ( `getFilesFromImap ${ _files } ` )
					
					if ( err ) {
						console.log(err)
						return _callBack ( err )
					}
					return _callBack ( null, data, subject )
				})
				
			})
			
			
		})

		socket.on ( 'sendRequestMail', ( message: string, CallBack1 ) => {
			console.dir (`socket.on 【( 'sendRequestMail')】`)
			const uuid = checkSocketKeypair ( socket, CallBack1 )
			if ( !uuid ) {
				return 
			}
			const keyPair: localServerKeyPair = socket [ "keypair" ]
			const keyID = socket ["keyID"]
			return Tool.decryptoMessage ( this.localKeyPair, keyPair.publicKey, message, ( err, data ) => {
				
				sendMail = true
				const userConnect: CoNETConnectCalss = socket [ "userConnet" ] || this.imapConnectPool.get ( keyID )
				if ( userConnect ) {
					userConnect.Ping ( true )
				}
				return Tool.sendCoNETConnectRequestEmail ( data.imapData, data.toMail, data.message, err => {
					
				})
			})
			

		})

		socket.on ( 'sendMedia', ( uuid, rawData, CallBack1 ) => {
			const _uuid = Uuid.v4()
			CallBack1( _uuid )

			const _callBack = ( ...data ) => {
				socket.emit ( _uuid, ...data )
			}
			const keyID = socket ["keyID"]
			const userConnect = this.imapConnectPool.get ( keyID )
			
			if ( !userConnect ) {
				return socket.emit ( 'systemErr' )
			}
			return userConnect.sendDataToANewUuidFolder ( Buffer.from ( rawData ).toString ( 'base64' ), uuid, uuid, _callBack )
		})

		socket.on ( 'mime', ( _mime, CallBack1 ) => {
			const _uuid = Uuid.v4()
			CallBack1( _uuid )
			console.log ( `socket.on ( 'mime' ) [${ _mime }]`)
			const _callBack = ( ...data ) => {
				socket.emit ( _uuid, ...data )
			}
			let y = mime.lookup( _mime )

			console.log ( y )
			if ( !y ) {
				return _callBack ( new Error ('no mime'))
			}
			return _callBack ( null, y )
		})

		socket.on ( 'keypair', async ( publicKey, CallBack )=> {
			
			const _uuid = Uuid.v4 ()
			CallBack( _uuid )
			
			return Tool.getPublicKeyInfo ( publicKey, ( err, data: localServerKeyPair ) => {
				
				if ( err ) {
					console.log ( `Tool.getPublicKeyInfo ERROR!`, err )
					return socket.emit ( _uuid, err )
				}
				
				const keyID = data.publicID.slice( 24 ).toLocaleUpperCase()
				socket [ "keypair" ] = data
				socket [ "keyID" ] = keyID

				console.dir (`client join room 【${ keyID }】`)
				socket.emit ( _uuid, null, this.localKeyPair.publicKey )
				
				if ( workspace.name.toLocaleUpperCase() !== `/${ keyID }`) {
					console.log (`workspace.name.toLocaleUpperCase()[${  workspace.name.toLocaleUpperCase() }] !== /${ keyID }`)

				}
				
			})
			
			
			
		})

		socket.once ( 'disconnect', () => {

			const keypair: localServerKeyPair = socket[ 'keypair' ]

			if ( !keypair ) {
				return console.dir (`${ clientName } have no keypair on disconnect! `)
			}
			const keyID = socket ["keyID"]
			const adminNamespace = this.socketServer.of ( `/${ keyID }` )
			return adminNamespace.clients (( err, clients ) => {
				if ( err ) {
					return console.log ( err )
				}
				const client = clients.length
				console.dir (`socket.once ( 'disconnect') total clients of room [/${ keyID }] = [${ clients.length }]`)
				if ( !client) {
					const connect = this.imapConnectPool.get ( keyID )
					this.imapConnectPool.delete ( keyID )
					if ( connect ) {
						if ( connect.rImap && typeof connect.rImap.logout === 'function') {
							return connect.rImap.logout (() => {
								console.dir (`CoNet connect [${ keyID }] destroy`)
							})
						}
						
					}
					console.log (`ERROR!\n\n`)
					console.dir ( `socket.once ( 'disconnect') keyID = [${ keyID }] connect = ${ connect } `)

				}
				
			})
			
		})


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

	private doingCheckImap ( socket: SocketIO.Socket, imapData: IinputData ) {
		
		return Async.series ([
			next => Imap.imapAccountTest ( imapData, err => {
				if ( err ) {
					return next ( err )
				}
				
				socket.emit ( 'imapTest' )
				return next ()
			}),
			next => Tool.smtpVerify ( imapData, next )
		], ( err: Error ) => {
			
			if ( err ) {
				console.log ( `doingCheckImap Async.series Error!`, err )
				return socket.emit ( 'imapTest', err.message || err )
			}
			console.dir (`doingCheckImap finished`)
			imapData.imapTestResult = true
			const keyPair = socket ["keypair"]
			return Tool.encryptMessage ( keyPair.publicKeys, this.localKeyPair.privateKey, JSON.stringify ( imapData ), ( err, data ) => {
				console.dir (`socket.emit ( 'imapTestFinish'`)
				return socket.emit ( 'imapTestFinish' , err, data )
			})

		})
			
		
	}

	private newKeyPair ( CallBack ) {
		return Tool.newKeyPair ( "admin@Localhost.local", "admin", this.serverKeyPassword, async ( err, data: localServerKeyPair ) => {
			if ( err ) {
				return CallBack ( err )
			}

			this.localKeyPair = data
			return CallBack ()
		})
	}

	constructor ( postNumber: number = 3000, folderName: string = '' ) {
		//Express.static.mime.define({ 'message/rfc822' : ['mhtml','mht'] })
		//Express.static.mime.define ({ 'multipart/related' : ['mhtml','mht'] })
		Express.static.mime.define ({ 'application/x-mimearchive' : ['mhtml','mht'] })
		this.expressServer.set ( 'views', Path.join ( __dirname, 'views' ))
		this.expressServer.set ( 'view engine', 'pug' )
		this.expressServer.use ( Express.static ( Tool.QTGateFolder ))
		this.expressServer.use ( Express.static ( Path.join ( __dirname, 'public' )))
		this.expressServer.use ( Express.static ( Path.join ( __dirname, 'html' )))
		const localPath = `/${ folderName }`
		this.expressServer.get ( localPath, ( req, res ) => {
            res.render( 'home', { title: 'home', proxyErr: false  })
		})
		/*
		this.expressServer.get ( `${ folderName }/message`, ( req, res ) => {
            res.render( 'home/message', { title: 'message', proxyErr: false  })
		})
		*/
		this.expressServer.get ( `${ folderName }/browserNotSupport`, ( req, res ) => {
            res.render( 'home/browserNotSupport', { title: 'browserNotSupport', proxyErr: false  })
		})

		const workspaces = this.socketServer.of(/^\/\w+$/)


		workspaces.on ( 'connection', socket => {
			
			return this.listenAfterPassword ( socket )
			
		})

		// this middleware will be assigned to each namespace
		workspaces.use (( socket, next ) => {
			// ensure the user has access to the workspace
			next()
		})

		/*
		this.socketServer.on ( 'connection', socker => {
			return this.listenAfterPassword ( socker )
		})
		*/
		
		this.httpServer.once ( 'error', err => {
			console.log (`httpServer error`, err )
			saveServerStartupError ( err )
			return process.exit (1)
		})

		this.newKeyPair ( err => {
			
			if ( err ) {
				console.dir ( err )
				return saveServerStartupError ( err )
			}
			return this.httpServer.listen ( postNumber, () => {
				saveServerStartup ( postNumber, localPath )
			})
			
		})

	}
}
