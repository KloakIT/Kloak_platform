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
            '加入用户', 'ユーザを追加', 'Add user', '加入用戶'
        ];
        this.information = {
            delivered: ['已送达', '到着した', 'Delivered', '已送達'],
            online: ['在线', 'オンライン', 'Online', '在線']
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
                Args: [user.keyID, true],
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
                user.forEach(n => {
                    n['showAddUserbutton'] = ko.observable(this.currentUser().findIndex(_n => n.keyID === _n.keyID) > 0 ? false : true);
                    n['showAddUserbutton'] = ko.observable(n.keyID !== this.myKeyID);
                    if (this.tempOnlineStorage.length) {
                        const index = this.tempOnlineStorage.findIndex(_n => _n[0] === n.keyID);
                        n['online'] = ko.observable(index > 0 ? this.tempOnlineStorage[index][1] : false);
                    }
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
        user['typing'] = ko.observable(false);
        user['_notice'] = 0;
        user['notice'] = ko.observable(0);
        this.currentUser.unshift(user);
        this.userData()['contacts'] = this.currentUser();
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
            user.chatDataArray?.forEach(n => {
                n.textContent = n.textContent || '';
                n.create = ko.observable(new Date(n._create));
                n.readTimestamp = ko.observable(n._readTimestamp ? new Date(n._readTimestamp) : null);
                n.delivered = ko.observable(n._delivered ? new Date(n._delivered) : null);
                n['mediaData'] = n.mediaData || '';
                n['youtubeObj'] = n['youtubeObj'] || null;
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
    getDaggrPreferences() {
        return _view.storageHelper.decryptLoad(this.daggr_preperences_save_UUID, (err, data) => {
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
                userData?.contacts?.forEach(n => {
                    n['notice'] = ko.observable(n._notice);
                    n['online'] = ko.observable(false);
                });
                this.currentUser(userData.contacts ? userData.contacts : []);
                this.myKeyID = userData.keyInfo.publicKeyID;
            }
            else {
                this.topMenu(false);
                let pro = new keyPairGenerateForm(null, (_keyPair) => {
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
            publicKey: _profile.publicKey,
            phoneNumber: _profile.phoneNumber,
            email: _profile.email,
            nickname: _profile.nickname
        };
        const com = {
            command: 'daggr',
            Args: [Buffer.from(JSON.stringify(profile)).toString('base64')],
            error: null,
            subCom: 'userProfile',
            requestSerial: uuid_generate()
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
            _delivered: null
        };
        const com = {
            command: 'daggr',
            Args: [user.keyID, message],
            error: null,
            subCom: 'sendMessage',
            requestSerial: uuid_generate()
        };
        user.chatData.unshift(message);
        this.lastSenttypingTime = null;
        this.saveChatData();
        this.textInput('');
        this.imageSource('');
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
    getTyping(obj) {
        if (!this.currentChat() || this.currentChat().keyID !== obj.account) {
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
    }
    getMessage(obj) {
        const messageUserID = obj.account;
        const message = obj.Args[1];
        message.isSelf = false;
        console.log(`getMessage\n`, obj.Args);
        message['youtubeObj'] = message['youtubeObj'] || null;
        if (message?.youtubeObj) {
            message.youtubeObj['showLoading'] = ko.observable(0);
            message.youtubeObj['showError'] = ko.observable(false);
        }
        if (this.currentChat() && this.currentChat().keyID === messageUserID) {
            message['create'] = ko.observable(new Date(message._create));
            this.currentChat().chatData.unshift(message);
            this.currentChat().typing(false);
            scrollTop();
            return this.saveChatData();
        }
        const index = this.currentUser().findIndex(n => n.keyID === messageUserID);
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
        console.log(currentItem);
        if (currentItem['showError']()) {
            currentItem['showLoading'](0);
            return currentItem['showError'](false);
        }
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
        this.resetYoutubeSearchData();
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
        };
        const user = this.currentChat();
        user.chatData.unshift(message);
        setTimeout(() => {
            resizeInputTextArea();
        }, 500);
    }
    resetYoutubeSearchData() {
        this.searchItemsArray([]);
        this.showSearchItemResult(false);
        this.showInputMenu(false);
        this.showYoutube(false);
        resizeInputTextArea();
    }
    youtubePlayClick(index) {
        const currentItem = this.currentChat().chatData()[index];
        currentItem.youtubeObj.showLoading(5);
        console.log(currentItem);
        const url = currentItem['textContent'];
        // if (this.videoPlayer()) {
        // 	this.videoPlayer(null)
        // }
        // this.videoPlayer(new VideoPlayer("", () => {}, () => {}))
        // this.videoPlayer().youtubePlayer(null, url)
        // currentItem.youtubeObj.showLoading ( 1 )
        // /**
        //  * 			start downloadQuere
        //  */
        // const downloadQuere = new getYoutubeMp4Queue ( currentItem.youtubeObj.url, currentItem.youtubeObj.title, localServerUUID => {
        // 	/**
        // 	 * 		can skip Ad
        // 	 */
        // 	//		show SKIP buttom
        // 	currentItem.youtubeObj.showLoading ( 3 )
        // 	currentItem ['blobUUID'] = localServerUUID
        // })
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
        document.getElementById('video_Input').click();
    }
    videoInput(ee) {
        if (!ee || !ee.files || !ee.files.length) {
            return;
        }
        const file = ee.files[0];
        const reader = new FileReader();
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
                    kk.BufferArray = Buffer.from(kk.BufferArray.toString('hex') + rawData.slice(point, point + bufferLength).toString('hex'), 'hex');
                    console.log(`BufferArray.length [${kk.BufferArray.length}] totlaTime = [${new Date().getTime() - startDate.getTime()} ]`);
                    kk.transferData();
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
}
