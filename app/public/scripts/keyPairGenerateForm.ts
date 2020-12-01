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
/**
 *      check email address
 *      @param email <string>
 *      @param return <string>  Valid = '' Err = errorMessage
 */
const insideChinaEmail = /(\@|\.)(sina|sohu|qq|126|163|tom)\.com|(\.|\@)yeah\.net/i

const getNickName = function ( email: string ) {
	
    var ret = ''
    if ( email.length ){
        ret = email.split ('@')[0]
        ret = ret.charAt (0).toUpperCase () + ret.slice(1)
    }
    return ret
}

const QTGateSignKeyID = /3acbe3cbd3c1caa9|864662851231B119/i

const getEmailAddress = ( str: string ) => {
	const uu = str.split ('<')
	return uu[1].substr( 0, uu[1].length -1 )
}

const getQTGateSign = ( user ) => {
    if ( !user.otherCertifications || !user.otherCertifications.length ) {
		return null
	}
	let Certification = false
	user.otherCertifications.forEach ( n => {
		//console.log (`user.otherCertifications\n${ n.issuerKeyId.toHex ().toLowerCase() }`)
		if ( QTGateSignKeyID.test ( n.issuerKeyId.toHex ().toLowerCase())) {
			return Certification = true
		}
	})
	return Certification
}

class IsNullValidator implements StringValidator {
    isAcceptable ( s: string ) {
        if ( s === undefined ) {
            return true
        }
        if ( s === null ) {
            return true
        }
        if ( s.length == 0 ) {
            return true
        }
    }
}

class EmailValidator implements StringValidator {
    isAcceptable ( s: string ) {
        return EmailRegexp.test( s )
    }
}

const testVal = new IsNullValidator()
const testEmail = new EmailValidator()
const checkEmail = function ( email: string ) {
    
    if ( testVal.isAcceptable ( email )) {
       return 'required'
    } 
    
    if ( ! testEmail.isAcceptable ( email ))
    {
        return 'EmailAddress'
    }
    
    return ''
}

class keyPairGenerateForm {
	public EmailAddressError = ko.observable ( false )
	public SystemAdministratorEmailAddress = ko.observable ('')
	public showInsideFireWallEmail = ko.observable ( false )
	public NickNameError = ko.observable ( false )
	public passwordError = ko.observable ( false )
	public SystemAdministratorNickName = ko.observable ('')
	public bio = ko.observable ('')
	public systemSetup_systemPassword = ko.observable ('')
	public showKeyPairPorcess = ko.observable ( false )
	public delete_btn_view = ko.observable ( false )
	public doingProcessBarTime = null
	public keyPairGenerateFormMessage = ko.observable ( false )
	public message_cancel = ko.observable ( false )
	public message_keyPairGenerateError = ko.observable ( false )
	public message_keyPairGenerateSuccess = ko.observable ( false )
	public showKeyPairForm = ko.observable ( true )
	public showKeyInfomation = ko.observable ( false )
	public avatarImage = ko.observable ('')
	public SystemAdministratorNickNameEdit = ko.observable ( false )
	public SystemAdministratorEmailAddressEdit = ko.observable ( false )
	public bioEdit = ko.observable ( false )


	public boiPlaceholder = [
		'自我介绍','自己紹介','Bio','自我介紹'
	]
	
	private checkEmailAddress ( email: string ) {
		$ ('.ui.checkbox').checkbox()
		
		this.EmailAddressError ( false )
		this.NickNameError ( false )
		
		if ( ! email || ! email.length ) {
			//this.EmailAddressError ( true )
			//return initPopupArea ()
			return true
		}
		
		if ( conetImapAccount.test ( email )) {
			this.EmailAddressError ( true )
			return initPopupArea ()
		}
		if ( checkEmail ( email ).length ) {

			this.EmailAddressError ( true )
			return initPopupArea ()
		}

		
		if ( ! this.SystemAdministratorNickName ().length ){
			this.SystemAdministratorNickName ( getNickName ( email ))
		}

		if ( insideChinaEmail.test ( email )) {
			this.showInsideFireWallEmail ( true )
		}
		
		return true
	}

	private checkPassword ( password: string ) {
		this.passwordError(false)
		if ( !password || password.length < 5 ) {
			this.passwordError ( true )
			initPopupArea ()
		}
		return true
	}

	private stopDoingProcessBar () {
		clearTimeout ( this.doingProcessBarTime )
		this.showKeyPairPorcess ( false )
		return $('.keyPairProcessBar').progress ({
			percent: 0
		})
	}

	constructor ( private exit: ( keyPair ) => void ) {
		const self = this
		this.SystemAdministratorEmailAddress.subscribe ( function ( newValue ) {
			return self.checkEmailAddress ( newValue )
		})
		/*
		this.systemSetup_systemPassword.subscribe ( function ( newValue ) {
			return self.checkPassword ( newValue )
		})
		*/
	}

	
	public form_AdministratorEmail_submit () {
		const self = this
		this.checkEmailAddress ( this.SystemAdministratorEmailAddress ())
		
		this.checkPassword ( this.systemSetup_systemPassword ())
		if ( this.passwordError() || this.EmailAddressError() || this.NickNameError()) {
			return false
		}
		this.showKeyPairPorcess ( true )
		this.showKeyPairForm ( false )
		const email = this.SystemAdministratorEmailAddress ()
		const array = {
			nickName: this.SystemAdministratorNickName (),
			bio: this.bio()
		}
		const sendData: INewKeyPair = {
			password: this.systemSetup_systemPassword (),
			nikeName: this.SystemAdministratorNickName (),
			email: this.SystemAdministratorEmailAddress()
		}
		let percent = 1
		$('.keyPairProcessBar').progress ('reset')
		const timeSet = 10000
		
		const doingProcessBar = function () {
			clearTimeout ( self.doingProcessBarTime )
			self.doingProcessBarTime = setTimeout ( function () {
				$('.keyPairProcessBar').progress ({
					percent: percent++
				})
				if ( percent < 100 )
					return doingProcessBar ()
			}, timeSet )
		}

		_view.sharedMainWorker.NewKeyPair ( sendData, ( err, data: keypair ) => {
			self.stopDoingProcessBar ()
			self.keyPairGenerateFormMessage ( true )
			if ( err ) {
				return self.message_keyPairGenerateError ( true )
			}
			self.message_keyPairGenerateSuccess ( true )
			
			
			console.dir ( data )
			return _view.sharedMainWorker.getKeyPairInfo ( data, ( err, _data ) => {
				
				_data.publicKeyID = _data.publicKeyID.substr ( 24 )

				const daggr: daggr_preperences = {
					keyInfo: {
						nikeName: this.SystemAdministratorNickName (),
						bio: this.bio(),
						image: this.avatarImage(),
						email: this.SystemAdministratorEmailAddress(),
						keyID: _data.publicKeyID
					},
					contacts: []
				}
				_data.email = this.SystemAdministratorEmailAddress()

				_data ['daggr'] = daggr
				return self.exit ( _data )
			})
			
			
		})
		return doingProcessBar ()
	}

	public SystemAdministratorNickNameEditClick () {
		this.SystemAdministratorNickNameEdit ( true )
		this.SystemAdministratorEmailAddressEdit ( false )
		this.bioEdit ( false )
	}

	public SystemAdministratorEmailAddressEditClick () {
		this.SystemAdministratorEmailAddressEdit ( true )
		this.SystemAdministratorNickNameEdit ( false )
		this.bioEdit ( false )
	}

	public bioEditClick () {
		this.bioEdit ( true )
		this.SystemAdministratorEmailAddressEdit ( false )
		this.SystemAdministratorNickNameEdit ( false )
		
	}

	public endEdit () {
		this.bioEdit ( false )
		this.SystemAdministratorEmailAddressEdit ( false )
		this.SystemAdministratorNickNameEdit ( false )
	}

	public inputClick () {
		return
	}

	public imageInput( ee ) {

		if ( ! ee?.files?.length ) {
			return
		}

		const file = ee.files[0]

		if (! file || ! file.type.match ( /^image.(png$|jpg$|jpeg$|gif$)/ )) {
			return
		}
		const reader = new FileReader()

		reader.onload = e => {
			const rawData = reader.result.toString()
			
			return _view.getPictureBase64MaxSize_mediaData ( rawData, 80, 80, ( err, data ) => {
					if ( err ) {
						return console.log ( err )
					}
					this.avatarImage ( `${data.rawData}` )
					
				}
			)
		}

		return reader.readAsDataURL ( file )
	}


	public CloseKeyPairGenerateFormMessage () {
		this.message_cancel ( false )
		this.message_keyPairGenerateError ( false )
		this.message_keyPairGenerateSuccess ( false )
		this.keyPairGenerateFormMessage ( false )
		return this.showKeyPairForm ( true )
	}
}