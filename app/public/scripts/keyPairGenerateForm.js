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
const insideChinaEmail = /(\@|\.)(sina|sohu|qq|126|163|tom)\.com|(\.|\@)yeah\.net/i;
const getNickName = function (email) {
    var ret = '';
    if (email.length) {
        ret = email.split('@')[0];
        ret = ret.charAt(0).toUpperCase() + ret.slice(1);
    }
    return ret;
};
const QTGateSignKeyID = /3acbe3cbd3c1caa9|864662851231B119/i;
const getEmailAddress = (str) => {
    const uu = str.split('<');
    return uu[1].substr(0, uu[1].length - 1);
};
const getQTGateSign = (user) => {
    if (!user.otherCertifications || !user.otherCertifications.length) {
        return null;
    }
    let Certification = false;
    user.otherCertifications.forEach(n => {
        //console.log (`user.otherCertifications\n${ n.issuerKeyId.toHex ().toLowerCase() }`)
        if (QTGateSignKeyID.test(n.issuerKeyId.toHex().toLowerCase())) {
            return Certification = true;
        }
    });
    return Certification;
};
class IsNullValidator {
    isAcceptable(s) {
        if (s === undefined) {
            return true;
        }
        if (s === null) {
            return true;
        }
        if (s.length == 0) {
            return true;
        }
    }
}
class EmailValidator {
    isAcceptable(s) {
        return EmailRegexp.test(s);
    }
}
const testVal = new IsNullValidator();
const testEmail = new EmailValidator();
const checkEmail = function (email) {
    if (testVal.isAcceptable(email)) {
        return 'required';
    }
    if (!testEmail.isAcceptable(email)) {
        return 'EmailAddress';
    }
    return '';
};
class keyPairGenerateForm {
    constructor(_daggrUser, exit) {
        this._daggrUser = _daggrUser;
        this.exit = exit;
        this.EmailAddressError = ko.observable(false);
        this.SystemAdministratorEmailAddress = ko.observable('');
        this.showInsideFireWallEmail = ko.observable(false);
        this.NickNameError = ko.observable(false);
        this.passwordError = ko.observable(false);
        this.SystemAdministratorNiekname = ko.observable('');
        this.bio = ko.observable('');
        this.systemSetup_systemPassword = ko.observable('');
        this.SystemAdministratorPhone = ko.observable('');
        this.showKeyPairPorcess = ko.observable(false);
        this.delete_btn_view = ko.observable(false);
        this.doingProcessBarTime = null;
        this.keyPairGenerateFormMessage = ko.observable(false);
        this.canbefind = ko.observable(false);
        this.userAutoAdded = ko.observable(false);
        this.message_cancel = ko.observable(false);
        this.message_keyPairGenerateError = ko.observable(false);
        this.message_keyPairGenerateSuccess = ko.observable(false);
        this.showKeyPairForm = ko.observable(true);
        this.showKeyInfomation = ko.observable(false);
        this.avatarImage = ko.observable('');
        this.SystemAdministratorNieknameEdit = ko.observable(false);
        this.SystemAdministratorEmailAddressEdit = ko.observable(false);
        this.bioEdit = ko.observable(false);
        this.DaggrUser = ko.observable(null);
        this.SystemAdministratorPhoneEdit = ko.observable(false);
        this.PhoneNumberFcous = ko.observable(false);
        this.SystemAdministratorNieknameFcous = ko.observable(false);
        this.SystemAdministratorEmailAddressFcous = ko.observable(false);
        this.bioEditFcous = ko.observable(false);
        this.publicKey = null;
        this.boiPlaceholder = [
            '自我介绍（选项，可不填）', '自己紹介（非必須）', 'Bio ( Option )', '自我介紹（選項，可不填）'
        ];
        this.userID = [
            '用户ID: ', 'ユーザーID: ', 'User ID: ', '用戶ID: '
        ];
        this.allows = {
            canBeSearch: ['能够通过昵称，Email等被找到', 'ニックネームやEmailで検索ができます', 'Find me can by nickname or Email', '能夠通過暱稱，Email等被找到'],
            canNotBeSearch: ['只有用户ID才能联系', 'ユーザーIDしか検索ができません', 'Find me by user ID only', '只有用戶ID才能聯繫'],
            canAutoAdded: ['允许自动加入好友', '友だちへの追加を許可', 'Allow other users to automatically friend me', '允許自動加入好友'],
            canNotAutoAdded: ['好友加入需确认', '友だちへの追加は確認が必要', 'Friend me need my permit', '好友加入需確認']
        };
        const self = this;
        this.DaggrUser(_daggrUser);
        this.SystemAdministratorEmailAddress.subscribe(function (newValue) {
            return self.checkEmailAddress(newValue);
        });
        /*
        this.systemSetup_systemPassword.subscribe ( function ( newValue ) {
            return self.checkPassword ( newValue )
        })
        */
        if (_daggrUser && _daggrUser?.publicKeyID) {
            this.publicKey = _daggrUser.publicKeyID;
            this.SystemAdministratorEmailAddress(_daggrUser.email);
            this.avatarImage(_daggrUser.image);
            this.SystemAdministratorPhone(_daggrUser.phoneNumber);
            this.SystemAdministratorNiekname(_daggrUser.nickname);
            this.canbefind(_daggrUser.canbefind);
            this.userAutoAdded(_daggrUser.userAutoAdded);
            this.bio(_daggrUser.bio);
        }
    }
    checkEmailAddress(email) {
        $('.ui.checkbox').checkbox();
        this.EmailAddressError(false);
        this.NickNameError(false);
        if (!email || !email.length) {
            //this.EmailAddressError ( true )
            //return initPopupArea ()
            return true;
        }
        if (conetImapAccount.test(email)) {
            this.EmailAddressError(true);
            return initPopupArea();
        }
        if (checkEmail(email).length) {
            this.EmailAddressError(true);
            return initPopupArea();
        }
        if (!this.SystemAdministratorNiekname().length) {
            this.SystemAdministratorNiekname(getNickName(email));
        }
        if (insideChinaEmail.test(email)) {
            this.showInsideFireWallEmail(true);
        }
        return true;
    }
    checkPassword(password) {
        this.passwordError(false);
        if (!password || password.length < 5) {
            this.passwordError(true);
            initPopupArea();
        }
        return true;
    }
    stopDoingProcessBar() {
        clearTimeout(this.doingProcessBarTime);
        this.showKeyPairPorcess(false);
        return $('.keyPairProcessBar').progress({
            percent: 0
        });
    }
    form_AdministratorEmail_submit() {
        const self = this;
        this.checkEmailAddress(this.SystemAdministratorEmailAddress());
        this.checkPassword(this.systemSetup_systemPassword());
        if (this.EmailAddressError() || !this._daggrUser && (this.passwordError() || this.NickNameError())) {
            return false;
        }
        this.showKeyPairPorcess(true);
        this.showKeyPairForm(false);
        const email = this.SystemAdministratorEmailAddress();
        const sendData = {
            password: this.systemSetup_systemPassword(),
            nikeName: this.SystemAdministratorNiekname(),
            email: this.SystemAdministratorEmailAddress()
        };
        if (this.publicKey) {
            this._daggrUser.email = this.SystemAdministratorEmailAddress();
            this._daggrUser.image = this.avatarImage();
            this._daggrUser.phoneNumber = this.SystemAdministratorPhone();
            this._daggrUser.nickname = this.SystemAdministratorNiekname();
            this._daggrUser.bio = this.bio();
            this._daggrUser.userAutoAdded = this.userAutoAdded();
            this._daggrUser.canbefind = this.canbefind();
            return self.exit(this._daggrUser);
        }
        return _view.sharedMainWorker.NewKeyPair(sendData, (err, data) => {
            self.stopDoingProcessBar();
            self.keyPairGenerateFormMessage(true);
            if (err) {
                return self.message_keyPairGenerateError(true);
            }
            self.message_keyPairGenerateSuccess(true);
            if (this.DaggrUser) {
                return _view.sharedMainWorker.getKeyInfo_Daggr(data, (err, _data) => {
                    _data.publicKeyID = _data.publicKeyID.substr(24);
                    _data.email = this.SystemAdministratorEmailAddress();
                    _data.image = this.avatarImage();
                    _data.phoneNumber = this.SystemAdministratorPhone();
                    _data.nickname = this.SystemAdministratorNiekname();
                    _data.bio = this.bio();
                    _data.canbefind = this.canbefind();
                    _data.userAutoAdded = this.userAutoAdded();
                    return self.exit(_data);
                });
            }
            return _view.sharedMainWorker.getKeyPairInfo(data, (err, _data) => {
                _data.publicKeyID = _data.publicKeyID.substr(24);
                return self.exit(_data);
            });
        });
    }
    SystemAdministratorNieknameEditClick() {
        this.SystemAdministratorNieknameEdit(true);
        this.SystemAdministratorEmailAddressEdit(false);
        this.bioEdit(false);
        this.SystemAdministratorPhoneEdit(false);
        this.SystemAdministratorNieknameFcous(true);
        this.PhoneNumberFcous(false);
        this.SystemAdministratorEmailAddressFcous(false);
        this.bioEditFcous(false);
    }
    SystemAdministratorEmailAddressEditClick() {
        this.SystemAdministratorEmailAddressEdit(true);
        this.SystemAdministratorNieknameEdit(false);
        this.bioEdit(false);
        this.SystemAdministratorPhoneEdit(false);
        this.SystemAdministratorNieknameFcous(false);
        this.PhoneNumberFcous(false);
        this.SystemAdministratorEmailAddressFcous(true);
        this.bioEditFcous(false);
    }
    SystemAdministratorPhoneEditClick() {
        this.SystemAdministratorPhoneEdit(true);
        this.SystemAdministratorEmailAddressEdit(false);
        this.SystemAdministratorNieknameEdit(false);
        this.bioEdit(false);
        this.PhoneNumberFcous(true);
        this.SystemAdministratorNieknameFcous(false);
        this.SystemAdministratorEmailAddressFcous(false);
        this.bioEditFcous(false);
    }
    bioEditClick() {
        this.bioEdit(true);
        this.SystemAdministratorEmailAddressEdit(false);
        this.SystemAdministratorNieknameEdit(false);
        this.SystemAdministratorPhoneEdit(false);
        this.PhoneNumberFcous(false);
        this.SystemAdministratorNieknameFcous(false);
        this.SystemAdministratorEmailAddressFcous(false);
        this.bioEditFcous(true);
    }
    endEdit() {
        this.bioEdit(false);
        this.SystemAdministratorEmailAddressEdit(false);
        this.SystemAdministratorNieknameEdit(false);
        return true;
    }
    inputClick() {
        return;
    }
    imageInput(ee) {
        if (!ee?.files?.length) {
            return;
        }
        const file = ee.files[0];
        if (!file || !file.type.match(/^image.(png$|jpg$|jpeg$|gif$)/)) {
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            const rawData = reader.result.toString();
            return _view.getPictureBase64MaxSize_mediaData(rawData, 80, 80, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                this.avatarImage(`${data.rawData}`);
            });
        };
        return reader.readAsDataURL(file);
    }
    CloseKeyPairGenerateFormMessage() {
        this.message_cancel(false);
        this.message_keyPairGenerateError(false);
        this.message_keyPairGenerateSuccess(false);
        this.keyPairGenerateFormMessage(false);
        return this.showKeyPairForm(true);
    }
    cancel() {
        this.exit(null);
    }
}
