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
    constructor(keypair, exit) {
        this.keypair = keypair;
        this.exit = exit;
        this.showPasswordErrorMessage = ko.observable(false);
        this.systemSetup_systemPassword = ko.observable('');
        this.passwordChecking = ko.observable(false);
        this.inputFocus = ko.observable(false);
        this.delete_btn_view = ko.observable(false);
        this.showConform = ko.observable(false);
        const self = this;
        this.systemSetup_systemPassword.subscribe(function (newValue) {
            if (!newValue || !newValue.length) {
                return;
            }
            self.showPasswordErrorMessage(false);
        });
    }
    showPasswordError() {
        this.showPasswordErrorMessage(true);
        this.systemSetup_systemPassword('');
        return initPopupArea();
    }
    keyPair_checkPemPasswordClick() {
        const self = this;
        this.showPasswordErrorMessage(false);
        if (!this.systemSetup_systemPassword() || this.systemSetup_systemPassword().length < 5) {
            return this.showPasswordError();
        }
        this.passwordChecking(true);
        this.keypair._password = this.systemSetup_systemPassword();
        const errProcess = err => {
            self.passwordChecking(false);
            return self.showPasswordError();
        };
        return _view.sharedMainWorker.checkKeypairPassword(this.keypair, err => {
            if (err) {
                return errProcess(err);
            }
            self.passwordChecking(false);
            return self.exit(this.keypair._password, false);
        });
    }
    deleteKeypair() {
        return this.exit(null, true);
    }
}
