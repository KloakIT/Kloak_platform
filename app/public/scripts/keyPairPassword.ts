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


class keyPairPassword {
	public showPasswordErrorMessage = ko.observable ( false )
	public systemSetup_systemPassword = ko.observable ('')
	public passwordChecking = ko.observable ( false )
	public inputFocus = ko.observable ( false )
	public delete_btn_view = ko.observable ( false )
	public showConform = ko.observable ( false )
	constructor ( private keypair: keypair,  private exit: ( passwd: string, deleteKeypair: boolean ) => void ) {
		const self = this
		this.systemSetup_systemPassword.subscribe ( function ( newValue ) {
			if ( !newValue || !newValue.length ) {
				return
			}
			self.showPasswordErrorMessage ( false )
		})
		
	}

	private showPasswordError() {
		this.showPasswordErrorMessage ( true )
		this.systemSetup_systemPassword ('')
		return initPopupArea()
	}

	public keyPair_checkPemPasswordClick () {
		const self = this
		this.showPasswordErrorMessage ( false )
		if ( !this.systemSetup_systemPassword() || this.systemSetup_systemPassword().length < 5 ) {
			return this.showPasswordError ()
		}
		this.passwordChecking ( true )

		this.keypair._password = this.systemSetup_systemPassword()

		const errProcess = err => {
			self.passwordChecking ( false )
			return self.showPasswordError()
		}

		return _view.sharedMainWorker.checkKeypairPassword ( this.keypair, err => {
			if ( err ) {
				return errProcess ( err )
			}
			self.passwordChecking ( false )
			
			return self.exit ( this.keypair._password, false )
		})
		
	}

	public deleteKeypair () {
		return this.exit ( null, true )
	}
}