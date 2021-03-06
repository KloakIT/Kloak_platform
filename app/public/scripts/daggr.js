const marginOfTextarea = 20;
const sentTypingTimeout = 1000 * 60 * 1;
const showTypingKeepTimes = 1000 * 60 * 0.5;
const resizeInputTextArea = () => {
    const elm = document.getElementById('daggrInput');
    if (elm) {
        elm.style.height = '0px';
        elm.style.height = elm.scrollHeight + 'px';
    }
    const elm1 = document.getElementById('chatArea');
    elm1.style.paddingTop = document.getElementById('daggr_bottomInputArea').clientHeight + 30 + 'px';
    scrollTop();
};
const resizeElmTextareaHeight = (elm) => {
    if (!elm) {
        return;
    }
    elm.style.height = '0px';
    elm.style.height = elm.scrollHeight + 'px';
};
const scrollTop = () => {
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
    window.scrollTo(0, height);
};
class daggr extends sharedAppClass {
    constructor(exit) {
        super(exit);
        this.exit = exit;
        this.daggr_preperences_save_UUID = _view.systemPreferences["daggr_UUID"] = _view.systemPreferences?.daggr_UUID || uuid_generate();
        this.currentUser = ko.observableArray([]);
        this.userData = ko.observable(null);
        this.showUserInfor = ko.observable(false);
        this.searchResultUsers = ko.observableArray([]);
        this.currentChat = ko.observable();
        this.currentChatIndex = null;
        this.myKeyID = '';
        this.getFocus = ko.observable();
        this.typing = ko.observable(false);
        this.lastSenttypingTime = null;
        this.altEnter = false;
        this.showSendBottom = ko.observable(false);
        this.imageSource = ko.observable('');
        this.showInputMenu = ko.observable(false);
        this.inputHtmlData = ko.observable('');
        this.showYoutube = ko.observable(false);
        this.textInput = ko.observable('');
        this.videoPlayer = ko.observable(null);
        this.showEmojiPanel = ko.observable(false);
        this.emojiPanel = null;
        this.keyPairGenerateForm = ko.observable(null);
        this.tempOnlineStorage = [];
        this.gamer = [[1, 2, 3, 4], [1, 2, 3, 4, 5]];
        this.lottieMessage = '';
        this.lottiePanel = ko.observable(false);
        /**** test unit */
        this.currentYoutubeObj = null;
        /** test unit end */
        this.search_form_request = {
            command: 'daggr',
            Args: [],
            error: null,
            subCom: 'user_search',
            requestSerial: null
        };
        this.search_form_next_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'youtube_search_next',
            requestSerial: null
        };
        this.searchInputPlaceholder = [
            '检索用户昵称或邮箱地址或ID', 'ユーザネックネーム又はEmail又はIDを検索', 'Search user by nickname or Email or key ID', '檢索用戶暱稱或郵箱地址或ID'
        ];
        this.addUserInfo = [
            '好友请求', '友達請求', 'Friend request', '好友請求'
        ];
        this.information = {
            delivered: ['已送达', '到着した', 'Delivered', '已送達'],
            online: ['在线', 'オンライン', 'Online', '在線'],
            connectingCount: ['好友', '友達', 'Friends', '好友'],
            sendRequest: ['送信', '送信', 'Send', '送信'],
            cancel: ['放弃', 'キャンセル', 'Cancel', '放棄'],
            addUser: ['加入好友', '友達を追加', 'Add to friends', '加入好友'],
            delUser: ['删除好友', '友達を削除', 'Delete friend', '刪除好友'],
            muteUser: ['安静模式', 'ミュート', 'Mute', '安靜模式'],
            blockkUser: ['屏蔽', 'ブロック', 'Block', '屏蔽'],
            WaitingConfirm: ['正在等待好友确认', '友達確認を待っている', 'Friend permit waiting', '正在等待好友確認']
        };
        this.errorProcess = (err) => {
            return console.log(err);
        };
        this.textInputHeight = ko.observable();
        this.ad_video_random = ko.computed(() => {
            const ads = ['coronavirus-ad.mp4', 'ipad-ad.mp4', 'nike-ad.mp4'];
            return `/videos/ads/${ads[Math.round(Math.random() * 2)]}`;
        });
        this.getDaggrPreferences();
        this.textInput.subscribe((newValue) => {
            if (newValue && newValue.length) {
                this.showSendBottom(true);
            }
            else {
                this.showSendBottom(false);
            }
            resizeInputTextArea();
        });
        this.getFocus.subscribe(value => {
            const now = new Date();
            if (!value) {
                return;
            }
            if (this.lastSenttypingTime && now.getTime() - this.lastSenttypingTime.getTime() < sentTypingTimeout) {
                return;
            }
            this.lastSenttypingTime = now;
            const user = this.currentChat();
            const com = {
                command: 'daggr',
                Args: [true],
                error: null,
                subCom: 'typing',
                requestSerial: uuid_generate(),
                account: _view.localServerConfig().account,
                daggrKeyID: this.userData().keyInfo.publicKeyID,
                targetAccount: user.account,
                targetDaggrID: user.keyID
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
        this.currentChat.subscribe(data => {
            if (!data) {
                $(window).off('resize', resizeInputTextArea);
            }
        });
        this.searchInputText.subscribe(val => {
            this.searchInputTextError(false);
        });
    }
    //     Result of search a user
    searchItemList_build(com, first) {
        switch (com.command) {
            case 'daggr': {
                const user = com.Args[0];
                if (typeof user === 'string') {
                    if (!this.searchResultUsers() || !Object.keys(this.searchResultUsers())) {
                        this.tempOnlineStorage.push(com.Args);
                    }
                    return this.currentUser().forEach(n => {
                        if (n.keyID === user) {
                            n.online(com.Args[1]);
                        }
                    });
                }
                user.forEach((n, i) => {
                    n['showAddUserbutton'] = ko.observable(true);
                    n['getFocus'] = ko.observable(true);
                    n['textInput'] = ko.observable('');
                    n['onlineListeing'] = n['onlineListeing'] || [];
                    n.userAutoAdded = n.userAutoAdded || false;
                    n.isAddUserWaitingConfirm = ko.observable(false);
                });
                this.searchResultUsers(user);
                return this.showUserInfor(true);
            }
            case 'CoSearch': {
                const args = com.Args;
                if (!args?.Result) {
                    return;
                }
                this.returnSearchResultItemsInit(args);
                this.moreButton_link_url(args.nextPage);
                const arr = args.Result.filter(n => {
                    return n.imageInfo['videoTime'];
                });
                if (first) {
                    this.searchItemsArray(arr);
                    args.totalResults = args.totalResults.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    this.totalSearchItems(args.totalResults);
                    this.showSearchItemResult(true);
                    this.showTopMenuInputField(true);
                }
                else {
                    this.searchItemsArray(this.searchItemsArray().concat(arr));
                }
                resizeInputTextArea();
                if (typeof this.search_form_response === 'function') {
                    return this.search_form_response(com);
                }
                return;
            }
        }
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
        if (this.currentUser()) {
            const _index = this.currentUser().map(n => n.keyID).indexOf(user.keyID);
            if (_index > -1) {
                return;
            }
        }
        user.typing = ko.observable(false);
        user._notice = 0;
        user.notice = ko.observable(0);
        user.online = ko.observable(false);
        user.mute = ko.observable(false);
        user.isMute = false;
        user.showDeleteUserConfirm = ko.observable(false);
        user.showBlockUserConfirm = ko.observable(false);
        user.isAddUserWaitingConfirm = ko.observable(user.userAutoAdded ? true : false);
        this.currentUser.unshift(user);
        this.userData()['contacts'] = this.currentUser();
        this.saveDaggrPreperences();
        const request = {
            command: 'daggr',
            Args: [user.account, user.keyID],
            error: null,
            subCom: 'add_user',
            requestSerial: uuid_generate()
        };
        /*

        return _view.connectInformationMessage.emitRequest ( request, ( err, com: QTGateAPIRequestCommand ) => {

            if ( err ) {
                console.log ( `sendDelUser Error`, err )
                return this.errorProcess ( err )
            }

            if ( !com ) {
                console.log ( `sendDelUser !com` )
                return
            }

            if ( com.error === -1 ) {
                
                return console.dir (`sendDelUser success!`)
            }

            console.log ( `_sendDelUser `, com.Args )
        })
        */
    }
    startChat(index) {
        const user = this.currentUser()[this.currentChatIndex = index];
        user['typing'] = ko.observable(false);
        if (!user?.chatDataUUID) {
            user['chatDataUUID'] = uuid_generate();
            return this.saveDaggrPreperences();
        }
        if (!user.isAddUserWaitingConfirm()) {
            return;
        }
        return _view.storageHelper.getDecryptLoad(user.chatDataUUID, (err, data) => {
            if (err) {
                return _view.connectInformationMessage.showErrorMessage(err);
            }
            try {
                user.chatDataArray = JSON.parse(Buffer.from(data).toString());
            }
            catch (ex) {
                return user.chatDataArray = null;
            }
            user.chatDataArray?.forEach(n => {
                n.textContent = n.textContent || '';
                n.create = ko.observable(new Date(n._create));
                n.readTimestamp = ko.observable(n._readTimestamp ? new Date(n._readTimestamp) : null);
                n.delivered = ko.observable(n._delivered ? new Date(n._delivered) : null);
                n['mediaData'] = n.mediaData || '';
                n['youtubeObj'] = n['youtubeObj'] || null;
                n['showDelete'] = ko.observable(false);
                n['lottieMessage'] = n['lottieMessage'] || '';
                if (n?.youtubeObj) {
                    n.youtubeObj['showLoading'] = ko.observable(0);
                    n.youtubeObj['showError'] = ko.observable(false);
                }
            });
            const index = mainMenuArray.findIndex(n => n.name === 'daggr');
            const daggr = mainMenuArray[index];
            daggr.notice(daggr.notice() - user.notice());
            user.notice(user._notice = 0);
            user.chatData = ko.observableArray(user.chatDataArray);
            this.currentChat(user);
            this.getFocus(true);
            this.saveDaggrPreperences();
            this.showInputMenu(false);
            this.showYoutube(false);
            $(window).on('resize', resizeInputTextArea);
            document.getElementById('daggrInput').onkeydown = event => {
                if (event.defaultPrevented) {
                    return true;
                }
                var handled = false;
                if (event.key !== undefined) {
                    if (event.key === 'Enter' && event.altKey) {
                        this.altEnter = true;
                        return true;
                    }
                }
                if (handled) {
                    event.preventDefault();
                }
                return true;
            };
            this.showSendBottom(false);
        });
    }
    editUsers(index) {
        const user = this.currentUser()[index];
    }
    getDaggrPreferences() {
        return _view.storageHelper.getDecryptLoad(this.daggr_preperences_save_UUID, (err, data) => {
            if (err) {
                return _view.connectInformationMessage.showErrorMessage(err);
            }
            let userData = null;
            try {
                userData = JSON.parse(Buffer.from(data).toString()) || {};
            }
            catch (ex) {
                return _view.connectInformationMessage.showErrorMessage(err);
            }
            if (userData?.keyInfo) {
                userData?.contacts?.forEach((n) => {
                    n['notice'] = ko.observable(n._notice);
                    n['online'] = ko.observable(false);
                    n['showDeleteUserConfirm'] = ko.observable(false);
                    n['showBlockUserConfirm'] = ko.observable(false);
                    n['mute'] = ko.observable(n['isMute']);
                    n.isAddUserWaitingConfirm = ko.observable(n.userAutoAdded);
                });
                this.currentUser(userData.contacts ? userData.contacts : []);
                this.myKeyID = userData.keyInfo.publicKeyID;
            }
            else {
                this.topMenu(false);
                let pro = new keyPairGenerateForm({}, (_keyPair) => {
                    this.topMenu(true);
                    userData["keyInfo"] = _keyPair;
                    this.saveDaggrPreperences();
                    _view.saveSystemPreferences(() => {
                        this.keyPairGenerateForm(pro = null);
                        this.publishProfile();
                    });
                });
                this.keyPairGenerateForm(pro);
            }
            this.userData(userData);
            this.updateAllUserProfile();
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
    updateprofile(Args) {
        if (!Args || !Args.length) {
            return;
        }
        const a1 = Args[0];
        /**
         * 		When user profile
         */
        if (typeof a1 === 'object') {
            const index = this.currentUser().findIndex(n => n.keyID === a1?.keyID);
            if (index < 0) {
                return console.log(`updateprofile object have no user keyID []`, JSON.stringify(a1));
            }
            const user = this.currentUser()[index];
            user['account'] = a1.account;
            user.bio = a1.bio;
            user.email = a1.email;
            user.nickname = a1.nickname;
            user.phoneNumber = a1.phoneNumber;
            user.image = a1.image;
            user.keyID = a1.keyID;
            user.online(a1.online);
            console.log(`User [${user.nickname ? user.nickname : user.keyID}] profile [${JSON.stringify(a1)}]`);
            return this.saveDaggrPreperences();
        }
        /**
         * 		When online status
         */
        return console.log(`updateprofile get unknow result!`, JSON.stringify(Args));
    }
    updateAllUserProfile() {
        if (!this.currentUser().length) {
            return;
        }
        const com = {
            command: 'daggr',
            Args: [this.currentUser().map(n => n.keyID), this.userData().keyInfo.publicKeyID],
            error: null,
            subCom: 'user_profiles_update',
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
                return console.dir(`Send user_profiles_update success!`);
            }
            return this.updateprofile(com.Args);
        });
    }
    imageSearch(ee) {
        if (!ee || !ee.files || !ee.files.length) {
            return;
        }
        const file = ee.files[0];
        if (!file || !file.type.match(/^image.(png$|jpg$|jpeg$|gif$)/)) {
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            const rawData = reader.result.toString();
            return _view.getPictureBase64MaxSize_mediaData(rawData, 2048, 2048, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                this.imageSource(data.rawData);
                this.showSendBottom(true);
                this.showInputMenu(false);
                resizeInputTextArea();
            });
        };
        return reader.readAsDataURL(file);
    }
    publishProfile() {
        const _profile = this.userData().keyInfo;
        const profile = {
            bio: _profile.bio,
            image: _profile.image,
            publickeyArmor: _profile.publicKey,
            phoneNumber: _profile.phoneNumber,
            email: _profile.email,
            nickname: _profile.nickname,
            canbefind: _profile.canbefind,
            userAutoAdded: _profile.userAutoAdded
        };
        const com = {
            command: 'daggr',
            Args: [Buffer.from(JSON.stringify(profile)).toString('base64')],
            error: null,
            subCom: 'userProfile',
            requestSerial: uuid_generate(),
            account: _view.localServerConfig().account,
            daggrKeyID: this.userData().keyInfo.publicKeyID,
            DaggrPublickeyArmor: this.userData().keyInfo.publicKey
        };
        return _view.connectInformationMessage.emitRequest(com, (err, com) => {
            if (err) {
                console.log(`_view.connectInformationMessage.emitRequest Error`, err);
                return this.errorProcess(err);
            }
            if (!com) {
                console.log(`_view.connectInformationMessage.emitRequest !com`);
                return;
            }
            if (com.error === -1) {
                return;
            }
            console.log(`_view.connectInformationMessage.emitRequest com = `, com.Args);
        });
    }
    snedMessage() {
        const user = this.currentChat();
        const now = new Date();
        this.emojiPanel = null;
        this.showEmojiPanel(false);
        const message = {
            uuid: uuid_generate(),
            _create: now.toISOString(),
            create: ko.observable(now),
            textContent: this.textInput() || '',
            mediaData: this.imageSource() || '',
            readTimestamp: ko.observable(null),
            _readTimestamp: null,
            attachedFile: null,
            delivered: ko.observable(null),
            isSelf: true,
            youtubeObj: null,
            _delivered: null,
            showDelete: ko.observable(false),
            senderKeyID: this.userData().keyInfo.publicKeyID,
            lottieMessage: this.lottieMessage
        };
        const com = {
            command: 'daggr',
            Args: [message],
            error: null,
            subCom: 'sendMessage',
            requestSerial: uuid_generate(),
            account: _view.localServerConfig().account,
            daggrKeyID: this.userData().keyInfo.publicKeyID,
            targetAccount: user.account,
            targetDaggrID: user.keyID
        };
        user.chatData.unshift(message);
        this.lastSenttypingTime = null;
        this.saveChatData();
        this.textInput('');
        this.imageSource('');
        this.lottieMessage = '';
        //document.getElementById( "daggrInput" ).style.height = '48px'
        //this.textInputHeightRun ( document.getElementById( `${ message.uuid }` ) )
        this.showSendBottom(false);
        resizeInputTextArea();
        return _view.connectInformationMessage.emitRequest(com, (err, com) => {
            if (err) {
                console.log(`_view.connectInformationMessage.emitRequest Error`, err);
                return this.errorProcess(err);
            }
            if (!com) {
                console.log(`_view.connectInformationMessage.emitRequest !com`);
                return message.create = ko.observable(null);
            }
            if (!com.error) {
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
    getTyping(obj) {
        if (!this.currentChat() || this.currentChat().keyID !== obj.daggrKeyID) {
            return;
        }
        this.currentChat().typing(true);
        scrollTop();
        setTimeout(() => {
            this.currentChat().typing(false);
        }, showTypingKeepTimes);
    }
    showAddedAction(index) {
        const item = this.currentChat().chatData()[index];
        item.showDelete(true);
    }
    getMessage(obj) {
        return this.putMessage(obj);
    }
    putMessage(obj) {
        const messageUserID = obj.daggrKeyID;
        const message = obj.Args[0];
        message['isSelf'] = false;
        message['showDelete'] = ko.observable(false);
        message['youtubeObj'] = message['youtubeObj'] || null;
        if (message?.youtubeObj) {
            message.youtubeObj['showLoading'] = ko.observable(0);
            message.youtubeObj['showError'] = ko.observable(false);
        }
        message['create'] = ko.observable(new Date(message._create));
        if (this.currentChat() && this.currentChat().keyID === messageUserID) {
            const index = this.currentChat().chatData().findIndex(n => n.uuid === message.uuid);
            /**
             * 		Message already have
             */
            if (index > -1) {
                return;
            }
            this.currentChat().chatData.unshift(message);
            this.currentChat().typing(false);
            scrollTop();
            this.saveChatData();
        }
        if (message.mediaData) {
            console.log(message.mediaData);
            _view.storageHelper.storeBase64(message.mediaData, (err, done) => { });
        }
        const index = this.currentUser().findIndex(n => n.keyID === messageUserID);
        /**
         * 			New connecting
         */
        if (index < 0) {
            if (!mesObj[3]) {
                return;
            }
        }
        const user = this.currentUser()[index];
        return _view.storageHelper.getDecryptLoad(user.chatDataUUID, (err, data) => {
            if (err) {
                return _view.connectInformationMessage.showErrorMessage(err);
            }
            try {
                user.chatDataArray = JSON.parse(Buffer.from(data).toString());
            }
            catch (ex) {
                return user.chatDataArray = null;
            }
            const index = user.chatDataArray.findIndex(n => n.uuid === message.uuid);
            if (index > -1) {
                return;
            }
            const index1 = mainMenuArray.findIndex(n => n.name === 'daggr');
            const daggr = mainMenuArray[index1];
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
    youtubeSearch() {
        _view.appScript().search_form_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'youtube_search',
            requestSerial: null
        };
        _view.appScript().search_form();
    }
    getLinkClick(index) {
        const currentItem = this.searchItemsArray()[index];
        if (currentItem['showError']()) {
            currentItem['showLoading'](0);
            return currentItem['showError'](false);
        }
        const user = this.currentChat();
        const url = currentItem['url'];
        const youtubeObj = {
            url: url,
            img: currentItem['imageInfo']['img'],
            title: currentItem['title'],
            time: currentItem['imageInfo']['videoTime'],
            description: currentItem['description'],
            showLoading: ko.observable(0),
            showError: ko.observable(false)
        };
        const now = new Date();
        const message = {
            uuid: uuid_generate(),
            _create: now.toISOString(),
            create: ko.observable(now),
            textContent: url,
            youtubeObj: youtubeObj,
            mediaData: this.imageSource() || '',
            readTimestamp: ko.observable(null),
            _readTimestamp: null,
            attachedFile: null,
            delivered: ko.observable(null),
            isSelf: true,
            _delivered: null,
            senderKeyID: this.userData().keyInfo.publicKeyID,
            lottieMessage: '',
            showDelete: ko.observable(false)
        };
        const com = {
            command: 'daggr',
            Args: [message],
            error: null,
            subCom: 'sendMessage',
            requestSerial: uuid_generate(),
            account: _view.localServerConfig().account,
            daggrKeyID: this.userData().keyInfo.publicKeyID,
            targetAccount: user.account,
            targetDaggrID: user.keyID
        };
        user.chatData.unshift(message);
        this.showYoutube(false);
        this.showInputMenu(false);
        resizeInputTextArea();
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
    resetYoutubeSearchData() {
        this.searchItemsArray([]);
        this.showSearchItemResult(false);
        this.showInputMenu(false);
        this.showYoutube(false);
        this.lottiePanel(false);
        resizeInputTextArea();
    }
    youtubePlayClick(index) {
        const currentItem = this.currentChat().chatData()[index];
        currentItem.youtubeObj.showLoading(1);
        let mp4Player = null;
        let history = false;
        let downloadedPieces = {};
        let offset = 0;
        /**
         * 			start downloadQuere
         */
        const downloadQuere = new DownloadQueue(currentItem.youtubeObj.url, currentItem.youtubeObj.title, false, (err, buffer) => {
            /**
             * 		can skip Ad
             */
            //		show SKIP buttom
            if (err) {
                return console.log(`youtubePlayClick DownloadQueue callback err`, err);
            }
            if (buffer && buffer.length) {
                console.log(`DownloadQueue return Buffer length = [${buffer.length}]`);
                console.log(buffer);
                if (!mp4Player) {
                    mp4Player = new Mp4LocalServerUrl(downloadQuere.totalLength, uuid => {
                        currentItem['blobUUID'] = uuid;
                        currentItem.youtubeObj.showLoading(3); //		show SKIP button
                    });
                }
                mp4Player.addBuffer(buffer);
            }
        }, (requestUuid, com, data) => {
            console.log(com);
            const createHistory = () => {
                const date = new Date();
                const file = {
                    uuid: [requestUuid],
                    filename: `${currentItem.youtubeObj.title}.mp4`,
                    location: 'local',
                    time_stamp: date,
                    last_viewed: date,
                    size: com.totalLength,
                    path: "",
                    url: 'YouTube',
                    favorite: false,
                    tags: ['daggr', 'youtube', 'mp4', 'upload', 'local'].filter(tag => tag),
                    youtube: {
                        id: '',
                        mimeType: {
                            video: 'video/mp4; codecs="avc1.42001E, mp4a.40.2"'
                        }
                    }
                };
                _view.storageHelper.saveFileHistory(file, (err, data) => {
                });
            };
            if (!history) {
                createHistory();
                history = true;
            }
            downloadedPieces[offset] = com.downloadUuid;
            offset = com['currentStartOffset'] + com['currentlength'];
            const createUpdateIndex = (requestUuid, com, done) => {
                console.log("CREATE INDEX?!");
                const index = {
                    filename: com.downloadFilename,
                    fileExtension: 'mp4',
                    totalLength: com.totalLength ? com.totalLength : null,
                    online: false,
                    contentType: com.contentType,
                    pieces: downloadedPieces,
                    finished: com.eof
                };
                _view.storageHelper.createUpdateIndex(requestUuid, index, (err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    done();
                });
            };
            _view.storageHelper.save(com.downloadUuid, data, (err, data) => {
                if (data) {
                    createUpdateIndex(requestUuid, com, () => {
                    });
                }
            });
        });
    }
    skipAdclick(index) {
        const currentItem = this.currentChat().chatData()[index];
        currentItem.youtubeObj.showLoading(4);
        console.log(`Skip Ad click video url = /streamUrl?uuid=${currentItem['blobUUID']}`);
        $(`#${currentItem.uuid}_videoPlay`).attr('src', `/streamUrl?uuid=${currentItem['blobUUID']}`);
    }
    youtubePlayClick1(index) {
        const currentItem = this.currentChat().chatData()[index];
        currentItem.youtubeObj.showLoading(1);
        this.currentYoutubeObj = currentItem;
        /**
         * 			start downloadQuere
         */
        //document.getElementById( 'video_Input' ).click()
    }
    videoInput(ee) {
        if (!ee || !ee.files || !ee.files.length) {
            return;
        }
        const file = ee.files[0];
        const reader = new FileReader();
        let startTransferData = false;
        reader.onload = e => {
            const currentItem = this.currentYoutubeObj;
            const rawData = Buffer.from(reader.result);
            const kk = new Mp4LocalServerUrl(rawData.length, uuid => {
                currentItem['blobUUID'] = uuid;
                currentItem.youtubeObj.showLoading(3);
                let point = 0;
                const bufferLength = 1024 * 1024;
                const setTime = () => {
                    const startDate = new Date();
                    kk.addBuffer(Buffer.from(rawData.slice(point, point + bufferLength)));
                    console.log(`totlaTime = [${new Date().getTime() - startDate.getTime()} ]`);
                    if (!startTransferData) {
                        kk.transferData();
                        startTransferData = true;
                    }
                    point = point + bufferLength;
                    if (point < rawData.length) {
                        return setTimeout(() => { setTime(); }, 500);
                    }
                    console.log(`all rawData success to buffer!`);
                };
                setTime();
            });
        };
        return reader.readAsArrayBuffer(file);
    }
    emojiTrigger() {
        const emojiInput = emoji => {
            const inputArea = document.getElementById('daggrInput');
            const start = inputArea['selectionStart'];
            this.textInput(this.textInput().substr(0, start) +
                emoji.char +
                this.textInput().substr(inputArea['selectionEnd']));
            setTimeout(() => {
                inputArea["setSelectionRange"](start + 2, start + 2);
            }, 300);
        };
        if (this.showEmojiPanel()) {
            //this.emojiPanel.removeEventListener ( 'select', emojiInput )
            this.emojiPanel = null;
            return this.showEmojiPanel(false);
        }
        this.showEmojiPanel(true);
        this.emojiPanel = new EmojiPanel({
            container: '#EmojiPanel'
        });
        this.emojiPanel.addListener('select', emojiInput);
    }
    profileClick() {
        const userData = this.userData();
        this.topMenu(false);
        let pro = new keyPairGenerateForm(userData["keyInfo"], (_keyPair) => {
            this.keyPairGenerateForm(pro = null);
            this.topMenu(true);
            if (!_keyPair) {
                return;
            }
            userData["keyInfo"] = _keyPair;
            this.saveDaggrPreperences();
            _view.saveSystemPreferences(() => {
                this.publishProfile();
            });
        });
        this.keyPairGenerateForm(pro);
    }
    deleteChatItem(index) {
        this.currentChat().chatData.splice(index, 1);
        const user = this.currentChat();
        return _view.storageHelper.encryptSave(user.chatDataUUID, JSON.stringify(user.chatDataArray), err => {
            if (err) {
                return _view.connectInformationMessage.showErrorMessage(err);
            }
        });
    }
    gamerClick(elm, e) {
        const self = _view.appScript();
        self.lottieMessage = $('lottie-player', e.currentTarget).attr('src');
        self.snedMessage();
        self.lottiePanel(false);
        self.showInputMenu(false);
    }
    sendDelUser(user) {
        const request = {
            command: 'daggr',
            Args: [user.account, user.keyID],
            error: null,
            subCom: 'del_user',
            requestSerial: uuid_generate()
        };
        return _view.connectInformationMessage.emitRequest(request, (err, com) => {
            if (err) {
                console.log(`sendDelUser Error`, err);
                return this.errorProcess(err);
            }
            if (!com) {
                console.log(`sendDelUser !com`);
                return;
            }
            if (com.error === -1) {
                return console.dir(`sendDelUser success!`);
            }
            console.log(`_sendDelUser `, com.Args);
        });
    }
    searchResultUsersaAfterRender(elm) {
        const jj = $(elm).find('.searchResultUsersTextarea');
        if (!jj.length) {
            return;
        }
        jj[0].style.height = '0px';
        jj[0].style.height = jj[0].scrollHeight + 'px';
    }
    delUser(index) {
        const user = this.currentUser.splice(index, 1)[0];
        this.sendDelUser(user);
        this.saveDaggrPreperences();
    }
}
