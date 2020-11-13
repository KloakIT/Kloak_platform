const marginOfTextarea = 20;
class daggr extends sharedAppClass {
    constructor(exit) {
        super(exit);
        this.exit = exit;
        this.daggr_preperences_save_UUID = _view.localServerConfig()['daggerUUID'];
        this.currentUser = ko.observableArray([]);
        this.userData = ko.observable(null);
        this.showUserInfor = ko.observable(true);
        this.searchResultUsers = ko.observableArray([]);
        this.currentChat = ko.observable();
        this.currentChatIndex = null;
        this.myKeyID = _view.keyPair().publicKeyID;
        this.getFocus = ko.observable();
        this.typing = ko.observable(false);
        this.sentTyping = false;
        this.search_form_request = {
            command: 'daggr',
            Args: [],
            error: null,
            subCom: 'user_search',
            requestSerial: null
        };
        this.searchInputPlaceholder = [
            '检索用户昵称或邮箱地址或ID', 'ユーザネックネーム又はEmail又はIDを検索', 'Search user by nikename or Email or key ID', '檢索用戶暱稱或郵箱地址或ID'
        ];
        this.addUserInfo = [
            '加入用户', 'ユーザを追加', 'Add user', '加入用戶'
        ];
        this.information = {
            delivered: ['已送达', '到着した', 'Delivered', '已送達'],
            startChat: ['']
        };
        this.errorProcess = (err) => {
            return console.log(err);
        };
        this.textInput = ko.observable();
        this.textInputHeight = ko.observable();
        this.textInput.subscribe(newValue => {
            this.textInputHeightRun(document.getElementById("daggrInput"));
        });
        this.getFocus.subscribe(value => {
            if (this.sentTyping === value) {
                return;
            }
            this.sentTyping = value;
            const user = this.currentChat();
            const com = {
                command: 'daggr',
                Args: [user.id, value],
                error: null,
                subCom: 'typing',
                requestSerial: uuid_generate()
            };
            return _view.connectInformationMessage.emitRequest(com, (err, com) => {
                if (err) {
                    return this.errorProcess(err);
                }
                if (!com) {
                    return;
                }
                if (com.error === -1) {
                    return console.dir(`Send typing status success!`);
                }
            });
        });
        _view.storageHelper.decryptLoad(_view.localServerConfig()['daggerUUID'], (err, data) => {
            if (err) {
                return _view.connectInformationMessage.showErrorMessage(err);
            }
            let userData = null;
            try {
                userData = JSON.parse(Buffer.from(data).toString());
            }
            catch (ex) {
                return console.log(ex);
            }
            this.userData(userData);
            userData.contacts.forEach(n => {
                n.notice = ko.observable(n._notice);
            });
            this.currentUser(this.userData().contacts);
        });
    }
    //     Result of search a user
    searchItemList_build(com, first) {
        this.searchResultUsers([com.Args[0]]);
        const self = this;
        this.showUserInfor(true);
        return setTimeout(() => {
            const elms = $('.searchResultUsersTextarea');
            elms.each(index => {
                self.textInputHeightRun(elms[index]);
            });
        }, 100);
    }
    saveDaggrPreperences() {
        return _view.storageHelper.encryptSave(this.daggr_preperences_save_UUID, JSON.stringify(this.userData()), err => {
            if (err) {
                return _view.connectInformationMessage.showErrorMessage(err);
            }
        });
    }
    addUser(index) {
        const user = this.searchResultUsers.splice(index, 1)[0];
        user.chatDataUUID = uuid_generate();
        const _index = this.currentUser().map(n => n.id).indexOf(user.id);
        if (_index > -1) {
            return;
        }
        user['typing'] = ko.observable(false);
        user['_notice'] = 0;
        user['notice'] = ko.observable(0);
        this.currentUser.unshift(user);
        this.saveDaggrPreperences();
    }
    startChat(index) {
        const user = this.currentUser()[this.currentChatIndex = index];
        user['typing'] = ko.observable(false);
        if (!user?.chatDataUUID) {
            user['chatDataUUID'] = uuid_generate();
            return this.saveDaggrPreperences();
        }
        return _view.storageHelper.decryptLoad(user.chatDataUUID, (err, data) => {
            if (err) {
                return _view.connectInformationMessage.showErrorMessage(err);
            }
            try {
                user.chatDataArray = JSON.parse(Buffer.from(data).toString());
            }
            catch (ex) {
                return user.chatDataArray = null;
            }
            user.chatDataArray.forEach(n => {
                n.create = ko.observable(new Date(n._create));
                n.readTimestamp = ko.observable(n._readTimestamp ? new Date(n._readTimestamp) : null);
                n.delivered = ko.observable(n._delivered ? new Date(n._delivered) : null);
            });
            const index = mainMenuArray.findIndex(n => n.name === 'daggr');
            const daggr = mainMenuArray[index];
            daggr.notice(daggr.notice() - user.notice());
            user.notice(user._notice = 0);
            user.chatData = ko.observableArray(user.chatDataArray);
            this.currentChat(user);
            const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
            window.scrollTo(0, height);
            this.getFocus(true);
            this.saveDaggrPreperences();
        });
    }
    saveChatData() {
        const currest = this.currentChat();
        const chatData = JSON.parse(JSON.stringify(this.currentChat().chatData()));
        _view.storageHelper.encryptSave(currest.chatDataUUID, JSON.stringify(chatData), err => {
            if (err) {
                _view.connectInformationMessage.showErrorMessage(err);
            }
        });
    }
    snedMessage() {
        const user = this.currentChat();
        const now = new Date();
        const message = {
            uuid: uuid_generate(),
            _create: now.toISOString(),
            create: ko.observable(now),
            textContent: this.textInput(),
            readTimestamp: ko.observable(null),
            _readTimestamp: null,
            attachedFile: null,
            delivered: ko.observable(null),
            isSelf: true,
            _delivered: null,
            rows: document.getElementById("daggrInput").style.height
        };
        const com = {
            command: 'daggr',
            Args: [user.id, message],
            error: null,
            subCom: 'sendMessage',
            requestSerial: uuid_generate()
        };
        user.chatData.unshift(message);
        this.saveChatData();
        this.textInput('');
        document.getElementById("daggrInput").style.height = '48px';
        this.textInputHeightRun(document.getElementById(`${message.uuid}`));
        const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
        window.scrollTo(0, height);
        message.rows = document.getElementById(user.chatData()[0].uuid).style.height;
        return _view.connectInformationMessage.emitRequest(com, (err, com) => {
            if (err) {
                console.log(`_view.connectInformationMessage.emitRequest Error`, err);
                return this.errorProcess(err);
            }
            if (!com) {
                console.log(`_view.connectInformationMessage.emitRequest !com`);
                return message.create = ko.observable(null);
            }
            if (com.error === -1) {
                console.log(`_view.connectInformationMessage.emitRequest com.error === -1`);
                const now = new Date();
                message.delivered(now);
                message._delivered = now.toISOString();
                this.saveChatData();
                return console.dir(`_view.connectInformationMessage.emitRequest return success!`);
            }
            console.log(`_view.connectInformationMessage.emitRequest com = `, com.Args);
        });
    }
    textInputHeightRun(elm) {
        const d = elm;
        const outerHeight = parseInt(window.getComputedStyle(d).height, 10);
        //const diff = outerHeight - d.clientHeight
        const high = Math.max(48, d.scrollHeight);
        return d.style.height = high + 'px';
    }
    getHeight(uuid) {
        this.textInputHeightRun(document.getElementById(uuid));
    }
    getTyping(obj) {
        if (!this.currentChat() || this.currentChat().id !== obj.account) {
            return;
        }
        const typing = obj.Args[1];
        this.currentChat().typing(typing);
        const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
        window.scrollTo(0, height);
    }
    getMessage(obj) {
        const messageUserID = obj.account;
        const message = obj.Args[1];
        message.isSelf = false;
        console.log(`getMessage\n`, obj.Args);
        if (this.currentChat() && this.currentChat().id === messageUserID) {
            message['create'] = ko.observable(new Date(message._create));
            this.currentChat().chatData.unshift(message);
            const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
            window.scrollTo(0, height);
            return this.saveChatData();
        }
        const index = this.currentUser().findIndex(n => n.id === messageUserID);
        if (index < 0) {
            return;
        }
        const user = this.currentUser()[index];
        return _view.storageHelper.decryptLoad(user.chatDataUUID, (err, data) => {
            if (err) {
                return _view.connectInformationMessage.showErrorMessage(err);
            }
            try {
                user.chatDataArray = JSON.parse(Buffer.from(data).toString());
            }
            catch (ex) {
                return user.chatDataArray = null;
            }
            const index = mainMenuArray.findIndex(n => n.name === 'daggr');
            const daggr = mainMenuArray[index];
            daggr.notice(daggr.notice() + 1);
            user._notice += 1;
            user.notice(user._notice);
            this.saveDaggrPreperences();
            user.chatDataArray.unshift(message);
            return _view.storageHelper.encryptSave(user.chatDataUUID, JSON.stringify(user.chatDataArray), err => {
                if (err) {
                    return _view.connectInformationMessage.showErrorMessage(err);
                }
            });
        });
    }
}
