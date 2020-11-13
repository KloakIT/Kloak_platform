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

const availableImapServer = /imap\-mail\.outlook\.com$|imap\.mail\.yahoo\.(com|co\.jp|co\.uk|au)$|imap\.mail\.me\.com$|imap\.gmail\.com$|gmx\.(com|us|net)$|imap\.zoho\.com$/i
/**
 * 			getImapSmtpHost
 * 		@param email <string>
 * 		@return Imap & Smtp info
 */

const getImapSmtpHost = function ( _email: string ) {
	const email = _email.toLowerCase()
	const yahoo = function ( domain: string ) {
		
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
		
	const domain = yahoo ( emailSplit [1].toLowerCase() )
	
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
			ret.imap = 'imap.mail.yahoo.co.jp'
			ret.smtp = 'smtp.mail.yahoo.co.jp'
			break
		}
		

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
			break
		}
		

        case 'gandi.net': {
			ret.imap = ret.smtp = 'mail.gandi.net'
        	break
		}
            
		
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
			break
		}
		

        case 'mail.ee': {
			ret.smtp = 'mail.ee'
            ret.imap = 'mail.inbox.ee'
        	break
		}
            

		
        //		gmx.com
        case 'gmx.co.uk':
        case 'gmx.de':
		case 'gmx.us':
		case 'gmx.com' : {
            ret.smtp = 'mail.gmx.com'
			ret.imap = 'imap.gmx.com'
			break
        }
		
		//		aim.com
		case 'aim.com': {
			ret.imap = 'imap.aol.com'
			break
		}
		
		
		//	outlook.com
		case 'windowslive.com':
		case 'hotmail.com': 
		case 'outlook.com': {
			ret.imap = 'imap-mail.outlook.com'
			ret.smtp = 'smtp-mail.outlook.com'
			break
		}
		
		
		//			apple mail
        case 'icloud.com':
        case 'mac.com':
		case 'me.com': {
			ret.imap = 'imap.mail.me.com'
			ret.smtp = 'smtp.mail.me.com'
			break
		}
		
		
		//			163.com
		case '126.com':
		case '163.com': {
			ret.imap = 'appleimap.' + domain
			ret.smtp = 'applesmtp.' + domain
			break
		}
		
		
		case 'sina.com':
		case 'yeah.net': {
			ret.smtpSsl = false
			break
		}
		
		
	}
	
	return ret
	
}
/**
 *       qtgate_test1@icloud.com, APP密碼: xfry-skyx-dpox-jyrh
郵箱帳號: qtgate_test2@icloud.com, APP密碼: cfes-ofqz-khho-dppa
郵箱帳號: qtgate_test3@icloud.com, APP密碼: wipp-uvkb-cupb-ngnp
郵箱帳號: qtgate_test4@icloud.com, APP密碼: pnoy-axvy-epdt-racp
郵箱帳號: qtgate_test5@icloud.com, APP密碼: uaav-ehgw-mdir-mbcs
郵箱帳號: qtgate_test6@icloud.com, APP密碼: tnkb-iixm-ewlv-pjsr
郵箱帳號: qtgate_test7@icloud.com, APP密碼: ymdo-bfoe-qipo-islu
郵箱帳號: qtgate_test8@icloud.com, APP密碼: qcit-qzjj-bmfn-ooui
郵箱帳號: qtgate_test9@icloud.com, APP密碼: eajz-mxae-otnt-njmw
郵箱帳號: qtgate_test10@icloud.com, APP密碼: oimd-qrvx-lelz-mogu
郵箱帳號: qtgate_test11@icloud.com, APP密碼: ncqg-dadz-doln-udrt
郵箱帳號: qtgate_test12@icloud.com, APP密碼: vjwe-neje-xinx-czvd
郵箱帳號: qtgate_test13@icloud.com, APP密碼: uabm-fqnv-xuuz-ixbr
郵箱帳號: qtgate_test14@icloud.com, APP密碼: ptkd-chac-rzxq-qyvj
郵箱帳號: qtgate_test15@icloud.com, APP密碼: bunf-hhlr-bhbe-qsjy
郵箱帳號: qtgate_test16@icloud.com, APP密碼: mfez-kqco-mrxy-lwmx
郵箱帳號: qtgate_test17@icloud.com, APP密碼: zsyj-yyvq-vekk-sdos
郵箱帳號: qtgate_test18@icloud.com, APP密碼: ygmt-ftoz-twad-yeeb
郵箱帳號: qtgate_test19@icloud.com, APP密碼: ajyi-mvqr-cluc-ufxu
郵箱帳號: qtgate_test20@icloud.com, APP密碼: dgiq-slit-nift-ywgy
郵箱帳號: qtgate_test21@icloud.com, APP密碼: jflx-eakk-gowq-adwu
郵箱帳號: qtgate_test22@icloud.com, APP密碼: rcbl-tmrw-skkw-wdnj
郵箱帳號: qtgate_test23@icloud.com, APP密碼: qppa-hzvj-bcmr-uwxk
郵箱帳號: qtgate_test24@icloud.com, APP密碼: fcji-uoag-drof-uhqf
郵箱帳號: qtgate_test25@icloud.com, APP密碼: kvys-eszu-mnnr-nxav
郵箱帳號: qtgate_test26@icloud.com, APP密碼: idbi-cuyl-ztvv-vogz
郵箱帳號: qtgate_test27@icloud.com, APP密碼: sdeg-rkck-tzza-qapy
郵箱帳號: qtgate_test28@icloud.com, APP密碼: etcb-ihzd-rbau-ekol
郵箱帳號: qtgate_test29@icloud.com, APP密碼: tslh-ujpp-gbqj-wejo
 */
const CoNetTempAccount = [
	{ userName: 'qtgate_test1@icloud.com', passwd: 'xfry-skyx-dpox-jyrh' },
	{ userName: 'qtgate_test2@icloud.com', passwd: 'cfes-ofqz-khho-dppa' },
	{ userName: 'qtgate_test3@icloud.com', passwd: 'wipp-uvkb-cupb-ngnp' },
	{ userName: 'qtgate_test4@icloud.com', passwd: 'pnoy-axvy-epdt-racp' },
	{ userName: 'qtgate_test5@icloud.com', passwd: 'uaav-ehgw-mdir-mbcs' },
	{ userName: 'qtgate_test6@icloud.com', passwd: 'tnkb-iixm-ewlv-pjsr' },
	{ userName: 'qtgate_test7@icloud.com', passwd: 'ymdo-bfoe-qipo-islu' },
	{ userName: 'qtgate_test8@icloud.com', passwd: 'qcit-qzjj-bmfn-ooui' },
	{ userName: 'qtgate_test9@icloud.com', passwd: 'eajz-mxae-otnt-njmw' },
	{ userName: 'qtgate_test10@icloud.com', passwd: 'oimd-qrvx-lelz-mogu' },
	{ userName: 'qtgate_test11@icloud.com', passwd: 'ncqg-dadz-doln-udrt' },
	{ userName: 'qtgate_test12@icloud.com', passwd: 'vjwe-neje-xinx-czvd' },
	{ userName: 'qtgate_test13@icloud.com', passwd: 'uabm-fqnv-xuuz-ixbr' },
	{ userName: 'qtgate_test14@icloud.com', passwd: 'ptkd-chac-rzxq-qyvj' },
	{ userName: 'qtgate_test15@icloud.com', passwd: 'bunf-hhlr-bhbe-qsjy' },
	{ userName: 'qtgate_test16@icloud.com', passwd: 'mfez-kqco-mrxy-lwmx' },
	{ userName: 'qtgate_test17@icloud.com', passwd: 'zsyj-yyvq-vekk-sdos' },
	{ userName: 'qtgate_test18@icloud.com', passwd: 'ygmt-ftoz-twad-yeeb' },
	{ userName: 'qtgate_test19@icloud.com', passwd: 'ajyi-mvqr-cluc-ufxu' },
	{ userName: 'qtgate_test20@icloud.com', passwd: 'dgiq-slit-nift-ywgy' },
	{ userName: 'qtgate_test21@icloud.com', passwd: 'jflx-eakk-gowq-adwu' },
	{ userName: 'qtgate_test22@icloud.com', passwd: 'rcbl-tmrw-skkw-wdnj' },
	{ userName: 'qtgate_test23@icloud.com', passwd: 'qppa-hzvj-bcmr-uwxk' },
	{ userName: 'qtgate_test24@icloud.com', passwd: 'fcji-uoag-drof-uhqf' },
	{ userName: 'qtgate_test25@icloud.com', passwd: 'kvys-eszu-mnnr-nxav' },
	{ userName: 'qtgate_test26@icloud.com', passwd: 'idbi-cuyl-ztvv-vogz' },
	{ userName: 'qtgate_test27@icloud.com', passwd: 'sdeg-rkck-tzza-qapy' },
	{ userName: 'qtgate_test28@icloud.com', passwd: 'etcb-ihzd-rbau-ekol' },
	{ userName: 'qtgate_test29@icloud.com', passwd: 'tslh-ujpp-gbqj-wejo' }
]

class keyPairSign {
	public signError = ko.observable ( false )
	public conformButtom = ko.observable ( false )
	public requestActivEmailrunning = ko.observable ( false )
	public showSentActivEmail = ko.observable ( -1 )
	public conformText = ko.observable ('')
	public conformTextError = ko.observable ( false )
	public requestError = ko.observable (-1)
	public conformTextErrorNumber = ko.observable ( -1 )
	public activeing = ko.observable ( false )
	public showRequestActivEmailButtonError = ko.observable ( false )
	
	constructor ( private exit: () => void ) {
		const self = this
		this.conformText.subscribe ( function ( newValue ) {
			if ( !newValue || !newValue.length ) {
				self.conformButtom ( false )
			} else {
				self.conformButtom ( true )
			}
		})
	}


	public clearError () {
		_view.connectInformationMessage.hideMessage()
		this.showRequestActivEmailButtonError ( false )
		
	}

}

class imapForm {
	public emailAddress = ko.observable ('')
	public password = ko.observable ('')
	public emailAddressShowError = ko.observable ( false )
	public passwordShowError = ko.observable ( false )
	public EmailAddressErrorType = ko.observable ( 0 )
	public showForm = ko.observable ( true )
	public checkProcessing = ko.observable ( false )
	public checkImapError = ko.observable ( -1 )
	public showCheckProcess = ko.observable ( false )
	public checkImapStep = ko.observable (0)
	public imapConnectData = null
	
	private clearError () {
		this.emailAddressShowError ( false )
		this.EmailAddressErrorType (0)
		this.passwordShowError ( false )
	}

	private errorProcess ( err ) {

		
		//		Invalid login
		if ( /Authentication|login/i.test ( err )) {
			return this.checkImapError ( 1 )
		}

		//		Cannot connect to email server!
		if ( /ENOTFOUND/i.test ( err )) {
			return this.checkImapError ( 0 )
		}

		//		https://github.com/KloakIT/Kloak_platform/issues/2
		if ( /certificate/i.test ( err )) {
			return this.checkImapError ( 0 )
		}



		this.checkImapError ( 5 )
	}
	
	private checkImapSetup () {
		
		let self = this
		this.checkProcessing ( true )
		this.checkImapStep ( 0 )
		
		const imapTest = function ( err ) {
			if ( err && typeof err === "string" || err !== null && err > -1 ) {
				return errorProcess ( err )
			}
			self.checkImapStep (5)
			
		}

		const smtpTest = function ( err ) {
			
			if ( err && typeof err === "string" || err !== null && err > -1 ) {
				return errorProcess ( err )
			}
			self.checkImapStep (2)
			
		}

		const imapTestFinish = function ( err: Error ) {

			removeAllListen ()

			if ( err ) {
				return errorProcess ( err )
			}

			self.exit ( self.imapConnectData )
			
		}

		const removeAllListen = function () {
			_view.connectInformationMessage.socketIo.removeEventListener ( 'smtpTest', smtpTest )
			_view.connectInformationMessage.socketIo.removeEventListener ( 'imapTest', imapTest )
			_view.connectInformationMessage.socketIo.removeEventListener ( 'imapTestFinish', imapTestFinish )
		}

		const errorProcess = function ( err ) {
			removeAllListen ()
			if ( err ) {
				if ( typeof err === "number") {
					return self.checkImapError ( err )
				}
	
				return self.errorProcess ( err )
			}
			return self.exit ( this.imapConnectData )
		}

		_view.connectInformationMessage.socketIo.on ( 'smtpTest', smtpTest )
		_view.connectInformationMessage.socketIo.on ( 'imapTest', imapTest )
		_view.connectInformationMessage.socketIo.once ( 'imapTestFinish', imapTestFinish )

		const imapServer = getImapSmtpHost( self.emailAddress ())
		const account = _view.keyPair().email || _view.keyPair().publicKeyID
		const imapConnectData = {
			email: account,
			account: account,
			smtpServer: imapServer.smtp,
			smtpUserName:  self.emailAddress(),
			smtpPortNumber: imapServer.SmtpPort,
			smtpSsl: imapServer.smtpSsl,
			smtpIgnoreCertificate: false,
			smtpUserPassword: self.password (),
			imapServer: imapServer.imap,
			imapPortNumber: imapServer.ImapPort,
			imapSsl: imapServer.imapSsl,
			imapUserName: self.emailAddress(),
			imapIgnoreCertificate: false,
			imapUserPassword: self.password (),
			timeZoneOffset: new Date ().getTimezoneOffset (),
			language: _view.tLang (),
			imapTestResult: null,
			clientFolder: uuid_generate(),
			serverFolder: uuid_generate(),
			randomPassword: uuid_generate(),
			uuid: uuid_generate(),
			confirmRisk: false,
			clientIpAddress: null,
			ciphers: null,
			sendToQTGate: false

		}
		this.imapConnectData = imapConnectData
		
		return _view.connectInformationMessage.emitLocalCommand ( 'checkImap', imapConnectData, err => {

		})
		
		
	}

	private checkEmailAddress ( email: string ) {
		this.clearError ()
		if ( checkEmail ( email ).length ) {
			this.EmailAddressErrorType (0)
			this.emailAddressShowError ( true )
			return initPopupArea ()
		}
		const imapServer = getImapSmtpHost ( email )
		
		if ( !availableImapServer.test ( imapServer.imap )) {
			this.EmailAddressErrorType (2)
			this.emailAddressShowError ( true )
			return initPopupArea ()
		}
		
	}

	constructor ( private keyID: string, private imapData: IinputData, private exit: ( IinputData: IinputData ) => void ) {
		const self = this
		if ( imapData ) {
			this.emailAddress ( imapData.imapUserName )
			this.password ( imapData.imapUserPassword )
		}

		this.emailAddress.subscribe ( function ( newValue ) {
			return self.checkEmailAddress ( newValue )
		})

		this.password.subscribe ( function ( newValue ) {
			return self.clearError ()
		})
	}

	public imapAccountGoCheckClick () {
		const self = this
		if ( this.imapData && this.emailAddress() === this.imapData.imapUserName && this.password () === this.imapData.imapUserPassword ) {
			return self.exit ( this.imapData )
		}
		this.checkEmailAddress ( this.emailAddress() )
		
		if ( this.emailAddressShowError() || !this.password().length ) {
			return
		}
		this.showForm ( false )
		this.showCheckProcess ( true )
		this.checkImapError ( -1 )
		
		return this.checkImapSetup ()
		
	}

	public returnImapSetup () {
		this.showForm ( true )
		this.showCheckProcess ( false )
		this.checkImapError ( -1 )
	}

	public useCoNetTempAccount () {
		const account = CoNetTempAccount[ parseInt (( Math.random () * 28 ).toString()) ]
		this.emailAddress ( account.userName )
		this.password ( account.passwd )
		return this.imapAccountGoCheckClick ()
	}
}