

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

import * as Fs from 'fs'
import * as Path from 'path'
import * as Os from 'os'
import * as Async from 'async'

import * as Http from 'http'
import * as Https from 'https'
import * as Net from 'net'
import * as Nodemailer from 'nodemailer'
import * as Url from 'url'
import { inspect } from 'util'
/**
 * 		define
 */
//OpenPgp.config.aead_protect = true
//OpenPgp.config.aead_mode = OpenPgp.enums.aead.experimental_gcm

const InitKeyPair = () => {
	const keyPair: keypair = {
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
		image: null
		
	}
	return keyPair
}

export const checkUrl = ( url ) => {

    const urlCheck = Url.parse ( url )

	const ret = /^http:|^https:$/.test ( urlCheck.protocol ) && ! /^localhost|^127.0.0.1/.
	test ( urlCheck.hostname )
    if ( ret ) {
        return true
    }
    return false
}
export const QTGateFolder = Path.join (  !/^android$/i.test ( process.platform ) ? Os.homedir() : Path.join( __dirname, "../../../../.." ), '.CoNET' )
export const QTGateLatest = Path.join ( QTGateFolder, 'latest' )
export const QTGateTemp = Path.join ( QTGateFolder, 'tempfile' )
export const QTGateVideo = Path.join ( QTGateTemp, 'videoTemp')
export const ErrorLogFile = Path.join ( QTGateFolder, 'systemError.log' )
export const CoNETConnectLog = Path.join ( QTGateFolder, 'CoNETConnect.log' )
export const imapDataFileName1 = Path.join ( QTGateFolder, 'imapData.pem' )

export const CoNET_Home = Path.join ( __dirname )

export const LocalServerPortNumber = 3000
export const configPath = Path.join ( QTGateFolder, 'config.json' )
//const packageFilePath = Path.join ( __dirname,'package.json')
//export const packageFile = require ( packageFilePath )
export const QTGateSignKeyID = /3acbe3cbd3c1caa9|864662851231B119/i
export const twitterDataFileName = Path.join ( QTGateFolder, 'twitterData.pem' )

export const checkFolder = ( folder: string, CallBack: ( err?: Error ) => void ) => {
    Fs.access ( folder, err => {
        if ( err ) {
            return Fs.mkdir ( folder, err1 => {
                if ( err1 ) {
                    
                    return CallBack ( err1 )
                }
                return CallBack ()
            })
        }
        return CallBack ()
    })
}

export const convertByte = ( byte: number ) => {
	if ( byte < 1000 ) {
		return `${ byte } B`
	}
	const kbyte = Math.round ( byte / 10.24 ) / 100
	if ( kbyte < 1000 ) {
		return `${ kbyte } KB`
	}
	const mbyte = Math.round ( kbyte / 10 ) / 100
	if ( mbyte < 1000 ) {
		return `${ mbyte } MB`
	}
	const gbyte = Math.round ( mbyte / 10 ) / 100
	if ( gbyte < 1000 ) {
		return `${ gbyte } GB`
	}
	const tbyte = Math.round ( mbyte / 10 ) / 100
	return `${ tbyte } TB`
}


export const getLocalInterface = () => {
	const ifaces = Os.networkInterfaces()
	const ret = []
	Object.keys ( ifaces ).forEach ( n => {
		ifaces[ n ].forEach ( iface => {
			
			if ( 'IPv4' !== iface.family || iface.internal !== false ) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				return
			}
			ret.push ( iface.address )
		})
	})
	return ret
}


export const getNickName = ( str: string ) => {
	const uu = str.split ('<')
	return uu[0]
}

export const getEmailAddress = ( str: string ) => {
	console.dir ( str )
	const uu = str.split ('<')
	return uu[1].substr( 0, uu[1].length -1 )
}




export const createKeyPairObj = ( ) => {
	
}

export const emitConfig = ( config: install_config, passwordOK: boolean ) => {
	if ( !config ) {
		return null
	}
	const ret: install_config = {
		keypair: config.keypair,
		firstRun: config.firstRun,
		alreadyInit: config.alreadyInit,
		newVerReady: config.newVerReady,
		version: CoNET_version,
		multiLogin: config.multiLogin,
		freeUser: config.freeUser,
		account: config.keypair && config.keypair.email ? config.keypair.email : null,
		serverGlobalIpAddress: config.serverGlobalIpAddress,
		serverPort: config.serverPort,
		connectedQTGateServer: config.connectedQTGateServer,
		localIpAddress: getLocalInterface(),
		lastConnectType: config.lastConnectType,
		iterations: config.iterations,
		connectedImapDataUuid: config.connectedImapDataUuid
	}
	ret.keypair.passwordOK = false 
	return ret
}

export const saveConfig = ( config: install_config, CallBack ) => {
	return Fs.writeFile ( configPath, JSON.stringify ( config ), CallBack )
}




export const getImapSmtpHost = function ( _email: string ) {
	const email = _email.toLowerCase()
	const yahoo = ( domain: string ) => {
		
		if ( /yahoo.co.jp$/i.test ( domain ))
			return 'yahoo.co.jp';
			
		if ( /((.*\.){0,1}yahoo|yahoogroups|yahooxtra|yahoogruppi|yahoogrupper)(\..{2,3}){1,2}$/.test ( domain ))
			return 'yahoo.com';
		
		if ( /(^hotmail|^outlook|^live|^msn)(\..{2,3}){1,2}$/.test ( domain ))
			return 'hotmail.com';
			
		if ( /^(me|^icould|^mac)\.com/.test ( domain ))
			return 'me.com'

		return domain
	}

	const emailSplit = email.split ( '@' )
	
	if ( emailSplit.length !== 2 ) 
		return null
		
	const domain = yahoo ( emailSplit [1] )
	
	const ret = {
		imap: 'imap.' + domain,
		smtp: 'smtp.' + domain,
		SmtpPort: [465,587,994],
		ImapPort: 993,
		imapSsl: true,
		smtpSsl: true,
		haveAppPassword: false,
		ApplicationPasswordInformationUrl: ['']
	}
	
	switch ( domain ) {
		//		yahoo domain have two different 
		//		the yahoo.co.jp is different other yahoo.*
		case 'yahoo.co.jp': {
			ret.imap = 'imap.mail.yahoo.co.jp';
			ret.smtp = 'smtp.mail.yahoo.co.jp'
		}
		break;

		//			gmail
		case 'google.com':
		case 'googlemail.com':
		case 'gmail': {
			ret.haveAppPassword = true;
			ret.ApplicationPasswordInformationUrl = [
				'https://support.google.com/accounts/answer/185833?hl=zh-Hans',
				'https://support.google.com/accounts/answer/185833?hl=ja',
				'https://support.google.com/accounts/answer/185833?hl=en'
			]
		}
		break;

        case 'gandi.net':
            ret.imap = ret.smtp = 'mail.gandi.net'
        break
		
		//				yahoo.com
		case 'rocketmail.com':
		case 'y7mail.com':
		case 'ymail.com':
		case 'yahoo.com': {
			ret.imap = 'imap.mail.yahoo.com'
			ret.smtp = (/^bizmail.yahoo.com$/.test(emailSplit[1]))
				? 'smtp.bizmail.yahoo.com'
				: 'smtp.mail.yahoo.com'
			ret.haveAppPassword = true;
			ret.ApplicationPasswordInformationUrl = [
				'https://help.yahoo.com/kb/SLN15241.html',
				'https://help.yahoo.com/kb/SLN15241.html',
				'https://help.yahoo.com/kb/SLN15241.html'
			]
		}
		break;

        case 'mail.ee':
            ret.smtp = 'mail.ee'
            ret.imap = 'mail.inbox.ee'
        break

		
        //		gmx.com
        case 'gmx.co.uk':
        case 'gmx.de':
		case 'gmx.us':
		case 'gmx.com' : {
            ret.smtp = 'mail.gmx.com'
            ret.imap = 'imap.gmx.com'
        }
        
		break;
		
		//		aim.com
		case 'aim.com': {
			ret.imap = 'imap.aol.com'
		}
		break;


		//	outlook.com
		case 'windowslive.com':
		case 'hotmail.com': 
		case 'outlook.com': {
			ret.imap = 'imap-mail.outlook.com'
            ret.smtp = 'smtp-mail.outlook.com'
		}
		break;
		
		//			apple mail
        case 'icloud.com':
        case 'mac.com':
		case 'me.com': {
			ret.imap = 'imap.mail.me.com'
            ret.smtp = 'smtp.mail.me.com'
		}
		break;
		
		//			163.com
		case '126.com':
		case '163.com': {
			ret.imap = 'appleimap.' + domain
			ret.smtp = 'applesmtp.' + domain
		}
		break;
		
		case 'sina.com':
		case 'yeah.net': {
			ret.smtpSsl = false
		}
		break;
		
	}
	
	return ret
	
}

export const availableImapServer = /imap\-mail\.outlook\.com$|imap\.mail\.yahoo\.(com|co\.jp|co\.uk|au)$|imap\.mail\.me\.com$|imap\.gmail\.com$|gmx\.(com|us|net)$|imap\.zoho\.com$/i

const doUrl = ( url: string, CallBack) => {
	let ret = ''
	const res = res => {
		res.on( 'data', (data: Buffer) => {
			ret += data.toString('utf8')
		})
		res.once ( 'end', () => {
			return CallBack( null, ret )
		})
	}
	if ( /^https/.test( url ))
		return Https.get ( url, res )
			.once ( 'error', err => {
				console.log( 'on err ', err  )
				return CallBack ( err )
			})
	return Http.get ( url, res )
		.once ( 'error', err => {
		console.log( 'on err ', err  )
		return CallBack ( err )
	})
}


const _smtpVerify = ( imapData: IinputData, CallBack: ( err?: Error, success?: any ) => void ) => {
	const option = {
		host:  Net.isIP ( imapData.smtpServer ) ? null : imapData.smtpServer,
		hostname:  Net.isIP ( imapData.smtpServer ) ? imapData.smtpServer : null,
		port: imapData.smtpPortNumber,
		secure: imapData.smtpSsl,
		auth: {
			user: imapData.smtpUserName,
			pass: imapData.smtpUserPassword
		},
		connectionTimeout: ( 1000 * 10 ).toString (),
		tls: {
			rejectUnauthorized: imapData.smtpIgnoreCertificate,
			ciphers: imapData.ciphers
		},
		debug: true
	}
	
	const transporter = Nodemailer.createTransport ( option )
	console.dir (transporter)
	return transporter.verify ( CallBack )
}

export const smtpVerify = ( imapData: IinputData, CallBack: ( err? ) => void ) => {
	
	let testArray: IinputData[] = null
	let err1 = null

	if ( typeof imapData.smtpPortNumber === 'object' ) {
		testArray = imapData.smtpPortNumber.map ( n => { 
			const ret: IinputData = JSON.parse ( JSON.stringify ( imapData ))
			ret.smtpPortNumber = n
			ret.ciphers = null
			return ret
		})
		
	} else {
		testArray = [ imapData ]
	}
	
	testArray = testArray.concat ( testArray.map ( n => {
		const ret: IinputData = JSON.parse ( JSON.stringify ( n ))
		ret.ciphers = 'SSLv3'
		ret.smtpSsl = false
		return ret
	}))
	
	return Async.each ( testArray, ( n, next ) => {
		return _smtpVerify ( n, ( err: Error, success ) => {

			if ( err && err.message ) {
				if ( /Invalid login|AUTH/i.test ( err.message )) {
					return next ( err )
				}
				return next ()
			}
			console.log ( success )
			if ( typeof CallBack === 'function' ) {

				imapData.smtpPortNumber = n.smtpPortNumber
				imapData.smtpSsl = n.smtpSsl
				imapData.ciphers = n.ciphers
				CallBack ()
				CallBack = null
			}
			return next ( false )
		})
	}, ( err: Error ) => {
		if ( err ) {
			console.log ( `smtpVerify exit = [${ err.message }]`)
			return 
		}

		if ( typeof CallBack === 'function' ) {
			console.log ( `smtpVerify success Async!`)
			CallBack ()
			return CallBack = null
		}
		console.log (`smtpVerify already did CallBack!`)
	})
	
}



const testSmtpAndSendMail = ( imapData, CallBack ) => {
	let first = false
	if ( typeof imapData === 'object' ) {
		first = true
	}
	return smtpVerify ( imapData, err => {
		if ( err ) {
			if ( first ) {
				imapData.imapPortNumber = [ 25,465,587,994,2525 ]
				return smtpVerify ( imapData, CallBack )
			}
			return CallBack ( err )
		}
		return CallBack ()
	})
}

const sendMailAccount = {
	imapPortNumber: '993',
    smtpPortNumber: [ 465, 587, 994 ],
    imapServer: 'imap.mail.me.com',
    imapIgnoreCertificate: false,
    smtpIgnoreCertificate: false,
    imapSsl: true,
    smtpSsl: true,
    imapUserName: 'qtgate_test2@icloud.com',
    imapUserPassword: 'cfes-ofqz-khho-dppa',
    account: '',
    smtpServer: 'smtp.mail.me.com',
    smtpUserName: 'qtgate_test2@icloud.com',
    smtpUserPassword: 'cfes-ofqz-khho-dppa',
    email: '',
    imapTestResult: null,
    language: 'en',
    timeZoneOffset: 420,
    serverFolder: '',
    clientFolder: '',
    randomPassword: '',
    clientIpAddress: null,
    requestPortNumber: null
}

export const sendCoNETConnectRequestEmail = ( imapData: IinputData, toEmail: string, message: string, subject: string, CallBack ) => {
	
	//const imapData = sendMailAccount //( /^smtp\-mail\.outlook\.com$/i.test ( _imapData.smtpServer ) ? sendMailAccount : _imapData )

	
			const option = {
				host:  Net.isIP ( imapData.smtpServer ) ? null : imapData.smtpServer,
				hostname:  Net.isIP ( imapData.smtpServer ) ? imapData.smtpServer : null,
				port: imapData.smtpPortNumber,
				secure: imapData.smtpSsl,
				auth: {
					user: imapData.smtpUserName,
					pass: imapData.smtpUserPassword
				},
				connectionTimeout: ( 1000 * 15 ).toString (),
				tls: !imapData.smtpSsl ? {
					rejectUnauthorized: true,
					ciphers: 'SSLv3'
				} : null,
				debug: true
			}

			

			const transporter = Nodemailer.createTransport ( option )
			//console.log ( Util.inspect ( option ))
			const mailOptions = {
				from: imapData.smtpUserName,
				to: toEmail,
				subject: subject,
				attachments: [{
					content: message
				}]
			}
			console.log (`transporter.sendMail`)
			return transporter.sendMail ( mailOptions, CallBack )
		
	

}


