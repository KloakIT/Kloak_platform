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
ko.bindingHandlers.animationTextIn = {
    update: (element, valueAccessor, allBindings) => {
        // First get the latest data that we're bound to
        const value = valueAccessor();
        // Next, whether or not the supplied model property is observable, get its current value
        const valueUnwrapped = ko.unwrap(value);
        // Grab some more data from another binding property
        const onCompleteAll = allBindings.get('onCompleteAll');
        // Now manipulate the DOM element
        if (valueUnwrapped) {
            $(element).empty();
            const t = document.createTextNode(valueUnwrapped);
            element.appendChild(t);
            const timeLine = new TimelineLite({ onComplete: onCompleteAll });
            const mySplitText = new SplitText(element, { type: 'words, chars' });
            const chars = mySplitText.chars;
            timeLine.staggerFrom(mySplitText.chars, 0.6, {
                scale: 4,
                autoAlpha: 0,
                rotationX: -180,
                transformOrigin: '100% 50%',
                ease: Back.easeOut,
            }, 0.02, null, () => {
                mySplitText.revert();
            });
        }
        //$( element ).slideDown( duration ) // Make the element visible
        else {
            const dammy = true;
        }
        //$( element ).slideUp( duration )   // Make the element invisible
    },
};
ko.bindingHandlers.animationTextLineIn = {
    update: (element, valueAccessor, allBindings) => {
        // First get the latest data that we're bound to
        const value = valueAccessor();
        // Next, whether or not the supplied model property is observable, get its current value
        const valueUnwrapped = ko.unwrap(value);
        // Grab some more data from another binding property
        const onCompleteAll = allBindings.get('onCompleteAll');
        // Now manipulate the DOM element
        if (valueUnwrapped) {
            $(element).empty();
            const t = document.createTextNode(valueUnwrapped);
            element.appendChild(t);
            const timeLine = new TimelineLite({ onComplete: onCompleteAll });
            const mySplitText = new SplitText(element, { type: 'lines' });
            timeLine.staggerFrom(mySplitText.lines, 0.5, {
                opacity: 0,
                rotationX: -120,
                force3D: true,
                transformOrigin: 'top center -150',
            }, 0.1, null, () => {
                mySplitText.revert();
            });
        }
        //$( element ).slideDown( duration ) // Make the element visible
        else {
            const dammy = true;
        }
        //$( element ).slideUp( duration )   // Make the element invisible
    },
};
const makeKeyPairData = (view, keypair) => {
    const length = keypair.publicKeyID.length;
    keypair.publicKeyID = keypair.publicKeyID.substr(length - 16);
    view.showKeyPair(true);
    let keyPairPasswordClass = new keyPairPassword(keypair, (passwd, deleteKey) => {
        view.showKeyPair(false);
        keypair.keyPairPassword((keyPairPasswordClass = null));
        if (!passwd) {
            if (deleteKey) {
                _view.deleteKey();
            }
            return _view.initWelcomeView();
        }
        //      password OK
        keypair.passwordOK = true;
        view.password = passwd;
        keypair.showLoginPasswordField(false);
        view.showMain();
    });
    keypair.keyPairPassword = ko.observable(keyPairPasswordClass);
    keypair.showLoginPasswordField = ko.observable(false);
    keypair.delete_btn_view = ko.observable(true);
    keypair.showConform = ko.observable(false);
    keypair['showDeleteKeyPairNoite'] = ko.observable(false);
    keypair.delete_btn_click = function () {
        keypair.delete_btn_view(false);
        return keypair.showConform(true);
    };
    keypair.deleteKeyPairNext = function () {
        localStorage.setItem('config', JSON.stringify({}));
        view.localServerConfig(null);
        view.connectedCoNET(false);
        view.connectToCoNET(false);
        view.CoNETConnect((view.CoNETConnectClass = null));
        view.imapSetup((view.imapFormClass = null));
        keypair.showDeleteKeyPairNoite(false);
        keypair.delete_btn_view(false);
        localStorage.clear();
        return view.reFreshLocalServer();
    };
};
var view_layout;
(function (view_layout) {
    class view {
        constructor() {
            this.connectInformationMessage = null;
            this.sectionLogin = ko.observable(false);
            this.sectionAgreement = ko.observable(false);
            this.sectionWelcome = ko.observable(true);
            this.isFreeUser = ko.observable(true);
            this.QTTransferData = ko.observable(false);
            this.LocalLanguage = 'up';
            this.menu = Menu;
            this.modalContent = ko.observable('');
            this.keyPairGenerateForm = ko.observable();
            this.tLang = ko.observable(initLanguageCookie());
            this.languageIndex = ko.observable(lang[this.tLang()]);
            this.localServerConfig = ko.observable();
            this.keyPair = ko.observable(InitKeyPair());
            this.hacked = ko.observable(false);
            this.imapSetup = ko.observable();
            this.connectToCoNET = ko.observable(false);
            this.connectedCoNET = ko.observable(false);
            this.showKeyPair = ko.observable(false);
            this.CoNETConnectClass = null;
            this.imapFormClass = null;
            this.CoNETConnect = ko.observable(null);
            this.historyData = ko.observableArray();
            this.bodyBlue = ko.observable(true);
            this.CanadaBackground = ko.observable(false);
            this.password = null;
            this.KloakTL = gsap.timeline();
            this.secondTitle = ko.observable(false);
            this.titleAnimationStep = ko.observable(0);
            this.sharedMainWorker = new sharedWorkerManager('/scripts/netSocket.js');
            this.welcomeTitle = ko.observable(true);
            this.showMainPage = ko.observable(false);
            this.showStartupVideo = ko.observable(true);
            this.daggrHtml = ko.observable(false);
            this.showFileStorage = ko.observable(false);
            this.muteHtml = ko.observable(false);
            this.localServerConnected = ko.observable(false);
            this.showLocalServerDisconnect = ko.observable(false);
            /*
            public worker = new workerManager ([
                'mHtml2Html'
            ])
            */
            this.appsManager = ko.observable(null);
            this.AppList = ko.observable(false);
            this.LocalServerUrl = window.location.href.split(/https?\:\/\//i)[1].split(/\//)[0];
            this.imapData = ko.observable(null);
            this.newVersion = ko.observable(null);
            this.showLanguageSelect = ko.observable(true);
            this.demoTimeout = null;
            /*************************************
             *
             *          for New York Times
             */
            this.nytSection = ko.observable(false);
            this.nytloader = ko.observable(true);
            this.iframShow = ko.observable(false);
            this.nyt_news = ko.observable(false);
            this.nyt_detail = ko.observable(false);
            this.nyt_menu = ko.observable(false);
            this.TitleLine1 = null;
            this.TitleLine2 = null;
            this.networkSetupHeader = [
                '网络通讯线路设定',
                'ネットワーク通信設定',
                'Network connection setup',
                '網絡通訊線路設定',
            ];
            this.networkSetupDescription = [
                '指定本地网络通讯模块，及接入CoNet网络所使用的邮件服务器帐号密码',
                'ローカールネットワークモージュルとCoNet通信用メールアカウント設定',
                'Local network module and the mail informationthe for connect to CoNet network',
                '指定本地網絡通訊模塊，及接入CoNet網絡所使用的郵件伺服器帳號密碼',
            ];
            this.networkSetupConnectShow = [
                '连接节点',
                'ノードへ接続',
                'Connect to node',
                '連接結點',
            ];
            this.networkDisconnect = [
                '解除连接',
                '接続を解除',
                'Disconnect',
                '解除連結',
            ];
            this.networkConnect = ko.observable(false);
            this.mainManuItems = ko.observableArray(mainMenuArray);
            this.tempAppHtml = ko.observable(false);
            this.appScript = ko.observable();
            this.middleX = ko.observable(window.innerWidth / 2);
            this.middleY = ko.observable(window.innerHeight / 2);
            this.getConfigFromLocalStorage();
            this.CanadaBackground.subscribe((val) => {
                if (val) {
                    $.ajax({
                        url: '/scripts/CanadaSvg.js',
                    }).done((data) => {
                        eval(data);
                    });
                }
            });
            this.InitKloakLogoTimeLine();
            this.initWelcomeView();
        }
        /*** */
        afterInitConfig() {
            this.keyPair(this.localServerConfig().keypair);
            if (this.keyPair() &&
                this.keyPair().keyPairPassword() &&
                typeof this.keyPair().keyPairPassword().inputFocus === 'function') {
                this.keyPair().keyPairPassword().inputFocus(true);
                this.sectionLogin(false);
            }
        }
        initConfig(config) {
            const self = this;
            if (config && config.keypair && config.keypair.publicKeyID) {
                /**
                 *
                 *      Key pair ready
                 *
                 */
                makeKeyPairData(this, config.keypair);
                if (!config.keypair.passwordOK) {
                    config.keypair.showLoginPasswordField(true);
                }
                this.localServerConfig(config);
                return this.afterInitConfig();
                //this.keyPairGenerateForm ( _keyPairGenerateForm )
            }
            /**
             *
             *      No key pair
             *
             */
            this.svgDemo_showLanguage();
            config['account'] = config['keypair'] = null;
            let _keyPairGenerateForm = new keyPairGenerateForm((_keyPair) => {
                self.keyPairGenerateForm((_keyPairGenerateForm = null));
                /**
                 *      key pair ready
                 */
                self.password = _keyPair._password;
                _keyPair._password = null;
                config.account = _keyPair.email || _keyPair.publicKeyID;
                config.keypair = _keyPair;
                localStorage.setItem('config', JSON.stringify(config));
                _keyPair.passwordOK = true;
                _keyPair._password = self.password;
                //self.localServerConfig ( config )
                self.keyPair(_keyPair);
                self.showMain();
            });
            this.localServerConfig(config);
            this.afterInitConfig();
            this.keyPairGenerateForm(_keyPairGenerateForm);
        }
        getConfigFromLocalStorage() {
            const configStr = localStorage.getItem('config');
            if (!configStr) {
                return this.initConfig({});
            }
            let config = null;
            try {
                config = JSON.parse(configStr);
            }
            catch (ex) {
                return this.initConfig({});
            }
            return this.initConfig(config);
        }
        initWelcomeView() {
            this.welcomeTitle(true);
            this.sectionLogin(false);
            const dom = document.getElementById('body');
            const eve = () => {
                clearTimeout(this.demoTimeout);
                dom.removeEventListener('click', eve);
                this.KloakTL.clear();
                this.openClick();
            };
            dom.addEventListener('click', eve);
        }
        //          change language
        selectItem(that, site) {
            const tindex = lang[this.tLang()];
            let index = tindex + 1;
            if (index > 3) {
                index = 0;
            }
            this.languageIndex(index);
            this.tLang(lang[index]);
            $.cookie('langEH', this.tLang(), { expires: 180, path: '/' });
            const obj = $('span[ve-data-bind]');
            obj.each(function (index, element) {
                const ele = $(element);
                const data = ele.attr('ve-data-bind');
                if (data && data.length) {
                    ele.text(eval(data));
                }
            });
            $('.languageText').shape(`flip ${this.LocalLanguage}`);
            $('.KnockoutAnimation').transition('jiggle');
            this.animationTitle();
            initPopupArea();
            return false;
        }
        //          start click
        openClick() {
            if (!this.sectionWelcome()) {
                return;
            }
            clearTimeout(this.demoTimeout);
            if (this.demoMainElm && typeof this.demoMainElm.remove === 'function') {
                this.demoMainElm.remove();
                this.demoMainElm = null;
            }
            /*
            if ( !this.connectInformationMessage.socketIoOnline ) {
                return this.connectInformationMessage.showSystemError ()
            }
            */
            this.welcomeTitle(false);
            /*
            if ( this.localServerConfig().firstRun ) {
                return this.sectionAgreement ( true )
            }
            */
            this.sectionLogin(true);
            return initPopupArea();
            /*
            setTimeout (() => {
                this.nytloader ( false )
            }, 3000 )
           
           
           new Date().toDateString
           this.nyt_menu ( true )
            return this.nytSection ( true )
            */
        }
        deletedKeypairResetView() {
            this.imapSetup(null);
        }
        agreeClick() {
            this.connectInformationMessage.sockEmit('agreeClick');
            this.sectionAgreement(false);
            this.localServerConfig().firstRun = false;
            return this.openClick();
        }
        refresh() {
            if (typeof require === 'undefined') {
                this.modalContent(infoDefine[this.languageIndex()].emailConform.formatError[11]);
                return this.hacked(true);
            }
            const { remote } = require('electron');
            if (remote && remote.app && typeof remote.app.quit === 'function') {
                return remote.app.quit();
            }
        }
        showKeyInfoClick() {
            this.sectionLogin(true);
            this.AppList(false);
            this.appsManager(null);
            //this.showImapSetup ()
        }
        showImapSetup() {
            _view.hideMainPage();
            _view.sectionLogin(true);
            return _view.imapSetup((_view.imapFormClass = new imapForm(_view.keyPair().publicKeyID, _view.imapData(), (imapData) => {
                _view.imapSetup((_view.imapFormClass = null));
                _view.sectionLogin(false);
                _view.imapData(imapData);
                _view.sharedMainWorker.saveImapIInputData(imapData, (err, data) => {
                    return _view.showMain();
                });
            })));
        }
        connectToNode() {
            const self = this;
            self.networkConnect(2);
            return this.CoNETConnect((this.CoNETConnectClass = new CoNETConnect(this, this.keyPair().verified, err => {
                if (typeof err === 'number' && err > -1) {
                    self.CoNETConnect((this.CoNETConnectClass = null));
                    return self.showImapSetup();
                }
                self.networkConnect(true);
                self.connectedCoNET(true);
            })));
        }
        reFreshLocalServer() {
            location.reload();
        }
        homeClick() {
            this.AppList(true);
            this.sectionLogin(false);
            const connectMainMenu = () => {
                let am = null;
                this.appsManager((am = new appsManager(() => {
                    am = null;
                    return connectMainMenu();
                })));
            };
            connectMainMenu();
            $('.dimmable').dimmer({ on: 'hover' });
            $('.comeSoon').popup({
                on: 'focus',
                movePopup: false,
                position: 'top left',
                inline: true,
            });
            _view.connectInformationMessage.socketIo.removeEventListener('tryConnectCoNETStage', this.CoNETConnectClass.listenFun);
        }
        /**
         *
         * 		T/t = Translate (t is relative, T is absolute) R/r = rotate(r is relative, R is absolute) S/s = scale(s is relative, S is absolute)
         */
        svgDemo_showLanguage() {
            if (!this.sectionWelcome()) {
                return;
            }
            let i = 0;
            const changeLanguage = () => {
                if (!_view.welcomeTitle()) {
                    return;
                }
                if (++i === 1) {
                    backGround_mask_circle.attr({
                        stroke: '#FF000090',
                    });
                    return setTimeout(() => {
                        changeLanguage();
                    }, 1000);
                }
                if (i > 5 || !_view.sectionWelcome()) {
                    main.remove();
                    return (_view.demoMainElm = main = null);
                }
                _view.selectItem();
                _view.demoTimeout = setTimeout(() => {
                    changeLanguage();
                }, 2000);
            };
            const width = window.innerWidth;
            const height = window.outerHeight;
            let main = (this.demoMainElm = Snap(width, height));
            const backGround_mask_circle = main
                .circle(width / 2, height / 2, width / 1.7)
                .attr({
                fill: '#00000000',
                stroke: '#FF000020',
                strokeWidth: 5,
            });
            const wT = width / 2 - 35;
            const wY = 40 - height / 2;
            backGround_mask_circle.animate({
                transform: `t${wT} ${wY}`,
                r: 60,
            }, 3000, mina.easeout, changeLanguage);
        }
        InitKloakLogoTimeLine() {
            var colors = [
                '#E6E7E8',
                '#152B52',
                '#152B52',
                '#152B52',
                '#152B52',
                '#152B52',
                '#152B52',
                '#152B52',
            ];
            for (let i = 0; i < 8; i++) {
                this.KloakTL.to('#start' + i, 1, {
                    morphSVG: '#end' + i,
                    fill: colors[i],
                    ease: Power2.easeInOut,
                }, i * 0.05);
            }
        }
        animationTitle() {
            // .add("end", 2)
            // .to("#redBox", 3, {scale:2, opacity:0}, "end")
            if (!_view.welcomeTitle()) {
                return;
            }
            _view.KloakTL.restart();
        }
        deleteKey() {
            localStorage.setItem('config', JSON.stringify({}));
            _view.localServerConfig(null);
            _view.connectedCoNET(false);
            _view.connectToCoNET(false);
            _view.CoNETConnect((_view.CoNETConnectClass = null));
            _view.imapSetup((_view.imapFormClass = null));
            localStorage.clear();
            return _view.reFreshLocalServer();
        }
        showMain() {
            this.sectionWelcome(false);
            this.showStartupVideo(false);
            this.afterPasswordReady();
        }
        afterPasswordReady() {
            const self = this;
            if (!this.connectInformationMessage) {
                this.connectInformationMessage = new connectInformationMessage(this.keyPair().publicKeyID, this);
            }
            this.sharedMainWorker.getKeyPairInfo(this.keyPair(), (err, data) => {
                if (err) {
                    return console.dir(`sharedMainWorker.getKeyPairInfo return Error!`);
                }
                if (/localhost|127\.0\.0\.1/i.test(this.LocalServerUrl)) {
                    self.connectInformationMessage.socketListening(this.LocalServerUrl);
                }
                if (data['imapData']) {
                    self.imapData(data['imapData']);
                }
                if (this.imapData()) {
                    return this.showMainPage(true);
                }
                self.connectInformationMessage.socketListening(this.LocalServerUrl);
                return this.showImapSetup();
            });
        }
        connectToLocalServer() {
            this.connectInformationMessage.getServerPublicKey((err) => {
                this.keyPair()['localserverPublicKey'] = _view.connectInformationMessage.localServerPublicKey;
                const self = this;
                return this.sharedMainWorker.getKeyPairInfo(this.keyPair(), (err, data) => {
                    if (err) {
                        return console.dir(`sharedMainWorker.getKeyPairInfo return Error!`);
                    }
                    if (data['imapData']) {
                        self.imapData(data['imapData']);
                        //return view.imapSetupClassExit ( view.imapData )
                    }
                });
            });
        }
        hidePlanetElement(elem, onCompleteAll) {
            if (elem.nodeType === 1) {
                return $(elem).slideUp(() => {
                    onCompleteAll();
                });
            }
        }
        showPlanetElement(elem, onCompleteAll) {
            const timeLine = new TimelineLite({ onComplete: onCompleteAll });
            timeLine.from(elem, { rotation: 27, x: 8000, duration: 1 });
        }
        hideMainPage() {
            _view.showMainPage(false);
        }
        appClick(index) {
            const appScript1 = mainMenuArray[index].click;
            const showSwitch = `_view.${mainMenuArray[index].htmlTemp}( true )`;
            if (!appScript1 || !showSwitch) {
                return;
            }
            _view.showMainPage(false);
            _view.bodyBlue(false);
            _view.sectionLogin(false);
            if (typeof appScript1 === 'object' &&
                typeof appScript1.startup === 'function') {
                appScript1.startup(appScript1);
                _view.appScript(appScript1);
            }
            else {
                _view.appScript(new appScript1());
            }
            eval(showSwitch);
        }
        resizeMiddleZise() {
            this.middleX(window.innerWidth / 2);
            this.middleY(window.innerHeight / 2);
        }
        connectLocalServer() {
            _view.showLocalServerDisconnect(false);
            _view.connectInformationMessage.socketListening(this.LocalServerUrl);
        }
    }
    view_layout.view = view;
})(view_layout || (view_layout = {}));
const mainMenuArray = [
    {
        name: 'librarium',
        img: '/images/kloakSearchIcon.svg',
        header: [
            '图书馆',
            '図書館',
            'The Librarium',
            '圖書館',
        ],
        description: [
            '流行检索引擎关键字及图像检索，获得指定网页快照，文件和流媒体代理下载',
            'サイト及画像のサーチ、サイドのスクリーンショットを取得、ファイルやマルチディアをゲイトウェイを通じてダウンロード',
            'Web and image search, screenshot and files download via gateway.',
            '流行檢索引擎關鍵字及圖像檢索，獲得指定網頁快照，文件和流媒體的下載',
        ],
        extra: null,
        click: appScript,
        online: true,
        htmlTemp: 'tempAppHtml',
    },
    {
        name: 'fortress',
        img: '/images/fileStorage.svg',
        header: ['堡垒', '堡塁', 'Fortress', '堡壘'],
        description: [
            '强安全私密无痕离线浏览器存储。文件打碎并加密保存在浏览器内部，整体系统扫描都无法发现文件痕迹，恢复时解密拼装复原后可保存到本地，流媒体无需复原浏览器直接播放',
            'プライバシーと安全な離線ブラウザストレージ。ファイルを破片化して暗号化でブラウザに保存します、ほしい時復元してローカルストレッジへ保存、マルチメディアファイルはブラウザ内で直接プレーできます',
            'Offline file and media storage which divides the file into multiple, encrypted, and ordered parts and stores them locally in the browser.  When the user wants to access the file for editing for example , these parts will be reassembled together in the designated order. However for media files, they can be played from the browser without needing reassembly of the media.',
            '強安全私密無痕離線瀏覽器存储。文件打碎並加密保存在瀏覽器內部，系統掃描都無法發現文件痕跡，恢復時解密拼裝復原後可保存到本地，流媒體無需複原瀏覽器直接播放',
        ],
        extra: null,
        click: fileStorage,
        htmlTemp: 'showFileStorage',
        online: false,
    },
    {
        name: 'mute',
        img: '/images/encrypted.svg',
        header: ['哑语', 'ミュート', 'Mute', '啞語'],
        description: [
            '加密解密工具',
            '暗号化と平文するツール',
            'Encrypted and decrypted tool',
            '加密解密工具',
        ],
        extra: null,
        click: mute,
        online: false,
        htmlTemp: 'muteHtml'
    }
    /*,
    {
        name: 'masquerade',
        img: '/images/Masquerade.svg',
        header: ['假面舞会', 'マスカレード', 'Masquerade', '假面舞會'],
        description: [
            '去中心化无审查社交媒体',
            '検閲なしのソーシャルメディア',
            'Decentralized no censorship social media',
            '強加密點對點消息系統，支持群聊，文件多媒體傳輸和網頁鏈接快照',
        ],
        extra: null,
        click: null,
        online: true,
    }*/
    ,
    {
        img: '/images/message.svg',
        header: ['', '', 'Daggr', ''],
        description: [
            '强加密点对点加密群聊，支持文件多媒体传输和网页链接快照',
            'エンドツーエンドメッセージローカールネットワークモージュルとCoNet通信用メールアカウント設定',
            'EndtoEnd encrypted message system.',
            '強加密點對點群聊，支持群聊，文件多媒體傳輸和網頁鏈接快照',
        ],
        extra: null,
        click: daggr,
        htmlTemp: 'daggrHtml',
        online: false,
    },
    {
        img: '/images/generalspalding.svg',
        header: [
            '史帕丁将军',
            'Robert Spalding将軍',
            'General Robert Spalding',
            '史帕丁將軍',
        ],
        description: [
            '前美空军准将，哈德逊研究所高级研究员，美国的智囊团和前白宫国家安全委员会的高级战略规划师',
            'ハドソン研究所の上級研究者であり、アメリカのシンクタンクであり、元ホワイトハウス国家安全保障理事会の上級戦略立案者です',
            'Robert S. Spalding III is a retired United States Air Force brigadier general. He currently serves as a senior fellow at the Hudson Institute.',
            '前美空軍準將，哈德遜研究所高級研究員，美國的智囊團和前白宮國家安全委員會的高級戰略規劃師',
        ],
        extra: null,
        click: null,
        online: false,
    },
];
const _view = new view_layout.view();
ko.applyBindings(_view, document.getElementById('body'));
$(`.${_view.tLang()}`).addClass('active');
window[`${'indexedDB'}`] =
    window.indexedDB ||
        window['mozIndexedDB'] ||
        window['webkitIndexedDB'] ||
        window['msIndexedDB'];
gsap.registerPlugin(MorphSVGPlugin, SplitText);
const CoNET_version = '0.1.43';
