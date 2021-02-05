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

declare const mhtml2html
declare const Back
declare const gsap
declare const TweenMax
declare const Power2
declare const MorphSVGPlugin
declare const SplitText
declare const TimelineLite

ko.bindingHandlers.animationTextIn = {
	update: (element, valueAccessor, allBindings) => {
		// First get the latest data that we're bound to
		const value = valueAccessor()

		// Next, whether or not the supplied model property is observable, get its current value
		const valueUnwrapped = ko.unwrap(value)

		// Grab some more data from another binding property
		const onCompleteAll = allBindings.get('onCompleteAll')

		// Now manipulate the DOM element
		if (valueUnwrapped) {
			$(element).empty()
			const t = document.createTextNode(valueUnwrapped)
			element.appendChild(t)

			const timeLine = new TimelineLite({ onComplete: onCompleteAll })
			const mySplitText = new SplitText(element, { type: 'words, chars' })
			const chars = mySplitText.chars
			timeLine.staggerFrom(
				mySplitText.chars,
				0.6,
				{
					scale: 4,
					autoAlpha: 0,
					rotationX: -180,
					transformOrigin: '100% 50%',
					ease: Back.easeOut,
				},
				0.02,
				null,
				() => {
					mySplitText.revert()
				}
			)
		}

		//$( element ).slideDown( duration ) // Make the element visible
		else {
			const dammy = true
		}
		//$( element ).slideUp( duration )   // Make the element invisible
	},
}

ko.bindingHandlers.animationTextLineIn = {
	update: (element, valueAccessor, allBindings) => {
		// First get the latest data that we're bound to
		const value = valueAccessor()

		// Next, whether or not the supplied model property is observable, get its current value
		const valueUnwrapped = ko.unwrap(value)

		// Grab some more data from another binding property
		const onCompleteAll = allBindings.get('onCompleteAll')

		// Now manipulate the DOM element
		if (valueUnwrapped) {
			$(element).empty()
			const t = document.createTextNode(valueUnwrapped)
			element.appendChild(t)

			const timeLine = new TimelineLite({ onComplete: onCompleteAll })
			const mySplitText = new SplitText(element, { type: 'lines' })

			timeLine.staggerFrom(
				mySplitText.lines,
				0.5,
				{
					opacity: 0,
					rotationX: -120,
					force3D: true,
					transformOrigin: 'top center -150',
				},
				0.1,
				null,
				() => {
					mySplitText.revert()
				}
			)
		}

		//$( element ).slideDown( duration ) // Make the element visible
		else {
			const dammy = true
		}
		//$( element ).slideUp( duration )   // Make the element invisible
	},
}

const makeKeyPairData = ( view: view_layout.view, keypair: keypair ) => {
	const length = keypair.publicKeyID.length
	keypair.publicKeyID = keypair.publicKeyID.substr(length - 16)
	view.showKeyPair ( true )
	let keyPairPasswordClass = new keyPairPassword ( keypair, ( passwd: string, deleteKey: boolean ) => {
		view.showKeyPair ( false )
		keypair.keyPairPassword ( keyPairPasswordClass = null )

		if ( ! passwd ) {
			if ( deleteKey ) {
				_view.deleteKey ()
			}
			return _view.initWelcomeView ()
		}
		//      password OK

		keypair.passwordOK = true
		view.password = passwd
		keypair.showLoginPasswordField ( false )
		
		view.showMain ()
	})

	keypair.keyPairPassword = ko.observable ( keyPairPasswordClass )
	keypair.showLoginPasswordField = ko.observable (false)
	keypair.delete_btn_view = ko.observable ( true)
	keypair.showConform = ko.observable ( false )
	keypair['showDeleteKeyPairNoite'] = ko.observable ( false )
	keypair.delete_btn_click = () => {
		keypair.delete_btn_view ( false )
		return keypair.showConform ( true )
	}

	keypair.deleteKeyPairNext = ( ) => {
		localStorage.setItem ( 'config', JSON.stringify( {} ))
		view.localServerConfig ( null )

		view.CoNETConnectClass = null
		view.imapSetup ( view.imapFormClass = null )
		keypair.showDeleteKeyPairNoite ( false )
		keypair.delete_btn_view ( false )
		localStorage.clear ()

		return view.reFreshLocalServer()
	}
}

module view_layout {
	export class view {
		//--   define
			// -   method

				public connectInformationMessage: connectInformationMessage = null
				public keyPairGenerateForm: KnockoutObservable< keyPairGenerateForm > = ko.observable()
				public localServerConfig: KnockoutObservable< localServerConfig > = ko.observable()
				public imapSetup: KnockoutObservable < imapForm > = ko.observable ( null )
				public CoNETConnectClass: CoNETConnect = null
				public imapFormClass: imapForm = null
				public sharedMainWorker = new sharedWorkerManager('/scripts/netSocket.js')
				public storageHelper = new StorageHelper()
				public videoPlayer: KnockoutObservable < VideoPlayer > = ko.observable ( null )
				public mediaViewer: MediaViewer = null
				public appsManager: KnockoutObservable<appsManager> = ko.observable( null )
			//-
				public LocalServerUrl = window.location.href.split(/https?\:\/\//i)[1].split(/\//)[0]
				public password = null
				public systemPreferences = null

			//- for View 

				//- language select
				public tLang = ko.observable( initLanguageCookie())
				public languageIndex = ko.observable ( lang[this.tLang()])
				public showLanguageSelect = ko.observable ( true )

				public networkSetupHeader = [
					'网络通讯线路设定',
					'ネットワーク通信設定',
					'Network connection setup',
					'網絡通訊線路設定',
				]
				public networkSetupDescription = [
					'指定本地网络通讯模块，及接入CoNet网络所使用的邮件服务器帐号密码',
					'ローカールネットワークモージュルとCoNet通信用メールアカウント設定',
					'Local network module and the mail informationthe for connect to CoNet network',
					'指定本地網絡通訊模塊，及接入CoNet網絡所使用的郵件伺服器帳號密碼',
				]
				public networkSetupConnectShow = [
					'连接节点',
					'ノードへ接続',
					'Connect to node',
					'連接結點',
				]
				public networkDisconnect = [
					'解除连接',
					'接続を解除',
					'Disconnect',
					'解除連結',
				]
	

				//- main
				public sectionLogin = ko.observable ( false )
				public sectionAgreement = ko.observable ( false )
				public sectionWelcome = ko.observable ( true )
				public menu = Menu
				public keyPair: KnockoutObservable< keypair> = ko.observable ( InitKeyPair())
				public showKeyPair = ko.observable ( false )
				public bodyBlue = ko.observable( true )
				public CanadaBackground = ko.observable ( false )
				public welcomeTitle = ko.observable ( true )
				public showMainPage = ko.observable ( false )
				public showStartupVideo = ko.observable ( true )
				public localServerConnected = ko.observable ( false )
				public showLocalServerDisconnect = ko.observable ( false )
				public displayMedia = ko.observable ( null )
				public networkConnect: KnockoutObservable<number | boolean> = ko.observable ( false )
				public showSnapshop = ko.observable ( null )
				public mainManuItems = ko.observableArray ( mainMenuArray )
				public tempAppHtml = ko.observable ( false )
				public appScript = ko.observable ()
				public middleX = ko.observable ( window.innerWidth / 2 )
				public middleY = ko.observable ( window.innerHeight / 2 )

				public imapData = ko.observable ( null )
				public AppList = ko.observable ( false )

				public daggrHtml = ko.observable ( false )
				public showFileStorage = ko.observable ( false )
				public showGeneralSpalding = ko.observable ( false )
				public showCanada = ko.observable ( false )

				public muteHtml = ko.observable ( false )
				public forTwitterHtml = ko.observable ( false )
				public forYoutubeHtml = ko.observable ( false )

				//-animation
				public KloakTL = gsap.timeline()
				private demoTimeout = null
				private demoMainElm = null
				public newVersion = ko.observable ()
			
			
			/*
			public worker = new workerManager ([
				'mHtml2Html'
			])
			*/

			
		//-

		private afterInitConfig() {
			this.keyPair( this.localServerConfig().keypair )

			if ( this.keyPair() && this.keyPair().keyPairPassword() && typeof this.keyPair().keyPairPassword().inputFocus === 'function' ) {
				this.keyPair().keyPairPassword().inputFocus( true )
				this.sectionLogin(false)
			}
		}


	public getPictureBase64MaxSize_mediaData ( mediaData: string, imageMaxWidth: number, imageMaxHeight: number, CallBack ) {
		const media = mediaData.split(',')
		const type = media[0].split(';')[0].split(':')[1]
		const _media = Buffer.from( media[1], 'base64' )

		const ret: twitter_mediaData = {
			total_bytes: media[1].length,
			media_type: 'image/jpeg',//png',
			rawData: media[1],
			media_id_string: null,
		}

		//if ( mediaData.length > maxImageLength) {
		const exportImage = ( _type, img ) => {
			return img.getBuffer( _type, ( err, _buf: Buffer ) => {
				if ( err ) {
					return CallBack ( err )
				}
				ret.rawData = _buf.toString ('base64')
				ret.total_bytes = _buf.length

				return CallBack ( null, ret )
			})
		}

		return Jimp.read ( _media, ( err, image ) => {
			if ( err ) {
				return CallBack ( err )
			}
			const uu = image.bitmap
			const isSameWH = imageMaxHeight === imageMaxWidth
			
			if ( uu.height + uu.width > imageMaxHeight + imageMaxWidth ) {
				if ( uu.height > uu.widt ) {
					image.resize ( isSameWH ? imageMaxWidth : Jimp.AUTO, imageMaxHeight )
				} else {
					image.resize ( imageMaxWidth, isSameWH ? imageMaxWidth: Jimp.AUTO )
				}
			}
			
			return image.quality ( 70, () => {
				return image.getBase64 ( ret.media_type, ( err, buf ) => {
					if ( err ) {
						return CallBack ( err )
					}
					ret.rawData = buf
					ret.total_bytes = buf.length
					return CallBack ( null, ret )
				})
			})
			
			//		to PNG
			/*
			return image.deflateStrategy ( 2, () => {
				return exportImage ( ret.media_type, image )
			})
			*/
		})
		//}

		//return CallBack ( null, ret )
	}


		private initConfig( config ) {
			const self = this
			

			if ( config?.keypair?.publicKeyID ) {
				/**
				 *
				 *      Key pair ready
				 *
				 */

				makeKeyPairData ( this, config.keypair )
				if ( !config.keypair.passwordOK ) {
					config.keypair.showLoginPasswordField ( true )
				}
				this.localServerConfig ( config )
				return this.afterInitConfig()

				//this.keyPairGenerateForm ( _keyPairGenerateForm )
			}

			/**
			 *
			 *      No key pair
			 *
			 */
			this.svgDemo_showLanguage()
			config['account'] = config['keypair'] = null
			
			let _keyPairGenerateForm = new keyPairGenerateForm ( null, ( _keyPair: keypair ) => {
					self.keyPairGenerateForm (( _keyPairGenerateForm = null ))
					/**
					 *      key pair ready
					 */

					self.password = _keyPair._password
					_keyPair._password = null
					config.account =  _keyPair.publicKeyID

					config.keypair = _keyPair
					localStorage.setItem ( 'config', JSON.stringify ( config ))
					_keyPair.passwordOK = true
					_keyPair._password = self.password
					
					self.keyPair ( _keyPair )
					self.showMain ()
				}
			)

			this.localServerConfig ( config )
			this.afterInitConfig ()
			this.keyPairGenerateForm ( _keyPairGenerateForm )
		}

		private getConfigFromLocalStorage() {
			const configStr = localStorage.getItem ( 'config' )
			if (! configStr ) {
				return this.initConfig({})
			}
			let config = null
			try {
				config = JSON.parse( configStr )
			} catch ( ex ) {
				return this.initConfig({})
			}

			return this.initConfig( config )
		}

		public initWelcomeView() {
			this.welcomeTitle(true)
			this.sectionLogin(false)

			
			const eve = () => {
				clearTimeout(this.demoTimeout)
				dom.off ('click touch')
				this.KloakTL.clear()
				this.openClick()
			}
			const dom = $('.welcome')
			dom.on ('click touch', eve )
		}

		constructor() {
			this.getConfigFromLocalStorage ()
			this.CanadaBackground.subscribe((val) => {
				if (val) {
					$.ajax({
						url: '/scripts/CanadaSvg.js',
					}).done((data) => {
						eval(data)
					})
				}
			})
			this.InitKloakLogoTimeLine()
			this.initWelcomeView()
		}

		//          change language
		public selectItem ( that?: any, site?: () => number ) {
			const tindex = lang[this.tLang()]
			let index = tindex + 1
			if (index > 3) {
				index = 0
			}

			this.languageIndex(index)
			this.tLang(lang[index])
			$.cookie('langEH', this.tLang(), { expires: 180, path: '/' })
			const obj = $('span[ve-data-bind]')

			obj.each(function (index, element) {
				const ele = $(element)
				const data = ele.attr('ve-data-bind')
				if (data && data.length) {
					ele.text(eval(data))
				}
			})

			$('.languageText').shape(`flip up`)
			$('.KnockoutAnimation').transition('jiggle')
			this.animationTitle()
			initPopupArea()
			return false
		}
		//          start click
		public openClick() {
			if (!this.sectionWelcome()) {
				return
			}

			clearTimeout(this.demoTimeout)

			if (this.demoMainElm && typeof this.demoMainElm.remove === 'function') {
				this.demoMainElm.remove()
				this.demoMainElm = null
			}

			/*
            if ( !this.connectInformationMessage.socketIoOnline ) {
                return this.connectInformationMessage.showSystemError ()
            }
            */
			this.welcomeTitle(false)
			/*
            if ( this.localServerConfig().firstRun ) {
                return this.sectionAgreement ( true )
			}
            */

			this.sectionLogin(true)

			return initPopupArea()
			/*
            setTimeout (() => {
                this.nytloader ( false )
            }, 3000 )
           
           
           new Date().toDateString
           this.nyt_menu ( true )
            return this.nytSection ( true )
            */
		}

		public deletedKeypairResetView() {
			this.imapSetup( null )
		}

		public agreeClick() {
			this.connectInformationMessage.sockEmit('agreeClick')
			this.sectionAgreement(false)
			return this.openClick()
		}

		public saveSystemPreferences ( CallBack ) {
			return this.storageHelper.encryptSave ( this.localServerConfig().account, JSON.stringify ( this.systemPreferences ), err => {
				if ( err ) {
					this.connectInformationMessage.showErrorMessage ( err )
				}
				return CallBack ()
			} )
		}

		public getSystemPreferences ( CallBack ) {
			return this.storageHelper.getDecryptLoad ( this.localServerConfig ().account, ( err, data ) => {
				if ( err ) {
					return this.connectInformationMessage.showErrorMessage ( err )
				}

				
				try {
					this.systemPreferences = JSON.parse ( Buffer.from ( data ).toString () )
				} catch ( ex ) {
					return this.connectInformationMessage.showErrorMessage ( err )
				}
				this.systemPreferences = this.systemPreferences || {}
				return CallBack ()

			})
		}

		public showImapSetup() {
			
			this.hideMainPage ()
			this.sectionLogin ( true )
			return this.imapSetup ( this.imapFormClass = new imapForm ( this.keyPair().publicKeyID, this.imapData(), true, ( imapData: IinputData ) => {
				this.imapSetup ( this.imapFormClass = null )
				this.sectionLogin ( false )
				this.imapData ( this.systemPreferences['imapData'] = imapData )
				this.saveSystemPreferences ( () => {
					return this.showMain ()
				})
				
			}))
		}

		public connectToNode () {

			this.networkConnect ( 2 )
			if ( !this.CoNETConnectClass ) {
				return this.CoNETConnectClass = new CoNETConnect ( this, this.keyPair().verified,
					( err ) => {
						if ( typeof err === 'number' && err > -1 ) {
							this.CoNETConnectClass = null
							return this.showImapSetup()
						}
						this.networkConnect ( true )
					})
			}
			console.log (`CoNETConnectClass already created!`)
			
		}

		public reFreshLocalServer() {
			location.reload()
		}

		public homeClick() {
			this.AppList(true)
			this.sectionLogin(false)
			const connectMainMenu = () => {
				let am = null
				this.appsManager(
					(am = new appsManager(() => {
						am = null
						return connectMainMenu()
					}))
				)
			}
			connectMainMenu()

			$('.dimmable').dimmer({ on: 'hover' })
			$('.comeSoon').popup({
				on: 'focus',
				movePopup: false,
				position: 'top left',
				inline: true,
			})
			_view.connectInformationMessage.socketIo.removeEventListener(
				'tryConnectCoNETStage',
				this.CoNETConnectClass.listenFun
			)
		}

		/**
		 *
		 * 		T/t = Translate (t is relative, T is absolute) R/r = rotate(r is relative, R is absolute) S/s = scale(s is relative, S is absolute)
		 */

		private svgDemo_showLanguage() {
			if (!this.sectionWelcome()) {
				return
			}
			let i = 0
			const changeLanguage = () => {
				if (!_view.welcomeTitle()) {
					return
				}
				if (++i === 1) {
					backGround_mask_circle.attr({
						stroke: '#FF000090',
					})
					return setTimeout(() => {
						changeLanguage()
					}, 1000)
				}
				if (i > 5 || !_view.sectionWelcome()) {
					main.remove()
					return (_view.demoMainElm = main = null)
				}
				_view.selectItem()
				_view.demoTimeout = setTimeout(() => {
					changeLanguage()
				}, 2000)
			}

			const width = window.innerWidth
			const height = window.outerHeight
			let main = (this.demoMainElm = Snap(width, height))

			const backGround_mask_circle = main
				.circle(width / 2, height / 2, width / 1.7)
				.attr({
					fill: '#00000000',
					stroke: '#FF000020',
					strokeWidth: 5,
				})

			const wT = width / 2 - 35
			const wY = 40 - height / 2
			backGround_mask_circle.animate(
				{
					transform: `t${wT} ${wY}`,
					r: 60,
				},
				3000,
				mina.easeout,
				changeLanguage
			)
		}

		private InitKloakLogoTimeLine() {
			var colors = [
				'#E6E7E8',
				'#152B52',
				'#152B52',
				'#152B52',
				'#152B52',
				'#152B52',
				'#152B52',
				'#152B52',
			]
			for (let i = 0; i < 8; i++) {
				this.KloakTL.to(
					'#start' + i,
					1,
					{
						morphSVG: '#end' + i,
						fill: colors[i],
						ease: Power2.easeInOut,
					},
					i * 0.05
				)
			}
		}

		public animationTitle() {
			// .add("end", 2)
			// .to("#redBox", 3, {scale:2, opacity:0}, "end")

			if (!_view.welcomeTitle()) {
				return
			}

			_view.KloakTL.restart()
		}

		public deleteKey() {
			localStorage.setItem ('config', JSON.stringify({}))
			_view.localServerConfig ( null )

			_view.CoNETConnectClass = null
			_view.imapSetup ( _view.imapFormClass = null )
			localStorage.clear ()
			return _view.reFreshLocalServer ()
		}

		public showMain() {
			this.sectionWelcome ( false )
			this.showStartupVideo ( false )
			this.afterPasswordReady ()
		}

		public storeDaggrNotice ( obj: QTGateAPIRequestCommand ) {
			
			const index = mainMenuArray.findIndex ( n => n.name === 'daggr')
			const daggr = mainMenuArray[ index ]

			if ( index > 0 ) {
				
				const message: messageContent = obj.Args[1]
				const sender = message.senderKeyID
				message.isSelf = false

				return _view.storageHelper.getDecryptLoad ( this.systemPreferences.daggr_UUID, ( err, data ) => {
					if ( err ) {
						return _view.connectInformationMessage.showErrorMessage ( err )
					}
	
					let userData: daggr_preperences = null
					try {
						userData = JSON.parse ( Buffer.from ( data ).toString () )
					} catch ( ex ) {
						return console.log ( ex )
					}
					
					const index = userData.contacts.findIndex ( n => n.keyID === sender )
					const contact =  userData.contacts[ index ]
					contact._notice += 1
					daggr.notice ( daggr.notice () + 1 )

					
					return _view.storageHelper.encryptSave ( this.systemPreferences.daggr_UUID, JSON.stringify ( userData ), err => {
						if ( err ) {
							return _view.connectInformationMessage.showErrorMessage ( err )
						}
						
						return _view.storageHelper.getDecryptLoad ( contact.chatDataUUID, ( err, data ) => {
							if ( err ) {
								return _view.connectInformationMessage.showErrorMessage ( err )
							}
							let userData: messageContent[] = null
							try {
								userData = JSON.parse ( Buffer.from ( data ).toString () )
							} catch ( ex ) {
								return _view.connectInformationMessage.showErrorMessage ( err )
							}
							userData.unshift ( message )
							return _view.storageHelper.encryptSave ( contact.chatDataUUID, JSON.stringify ( userData ), err => {
								if ( err ) {
									return _view.connectInformationMessage.showErrorMessage ( err )
								}
							})
						})
						
					} )
					
					
				})
			}
			
		}

		private getDaggrNotice () {
			const index = mainMenuArray.findIndex ( n => n.name === 'daggr')
			if ( index > 0 ) {
				const daggr = mainMenuArray[ index ]
				_view.storageHelper.getDecryptLoad ( this.localServerConfig ().account, ( err, data ) => {
					if ( err ) {
						return _view.connectInformationMessage.showErrorMessage ( err )
					}
	
					let userData: daggr_preperences = null
					try {
						userData = JSON.parse ( Buffer.from ( data ).toString () )
					} catch ( ex ) {
						return console.log ( ex )
					}
					let notice = 0

					userData.contacts.forEach ( n => {
						notice += n._notice
					})

					if ( notice > 0 ) {
						daggr.notice ( notice )
					}
				})
			}
			
		}

		public afterPasswordReady () {
			const self = this

			return this.sharedMainWorker.getKeyPairInfo ( this.keyPair(), err => {
				if ( err ) {
					return console.dir (`sharedMainWorker.getKeyPairInfo return Error!`)
				}
				
				return this.getSystemPreferences (() => {

					this.imapData ( this.systemPreferences?.imapData )
					this.connectInformationMessage = new connectInformationMessage ( this.keyPair().publicKeyID, this )
					if ( this.imapData ()) {
						//this.getDaggrNotice ()
						return this.showMainPage ( true )
					}
	
					return this.showImapSetup ()
				})
					
				
				/*
				if ( this.dagge ) {
					_view.storageHelper.encryptSave ( self.localServerConfig ().account, JSON.stringify ( this.dagge ), err => {
						if ( err ) {
							return _view.connectInformationMessage.showErrorMessage ( err )
						}
					})
				}
				*/


				
			})
		}

		public hidePlanetElement(elem, onCompleteAll: () => void) {
			if (elem.nodeType === 1) {
				return $(elem).slideUp(() => {
					onCompleteAll()
				})
			}
		}

		public showPlanetElement(elem, onCompleteAll: () => void) {
			const timeLine = new TimelineLite({ onComplete: onCompleteAll })
			timeLine.from(elem, { rotation: 27, x: 8000, duration: 1 })
		}

		public hideMainPage() {
			_view.showMainPage( false )
		}

		public appClick ( index ) {
			const appScript1: any = mainMenuArray [ index ].click
			const showSwitch = `_view.${ mainMenuArray [ index ].htmlTemp }( true )`
			if ( ! appScript1 || ! showSwitch ) {
				return
			}
			this.showMainPage ( false )
			this.bodyBlue ( false )
			this.sectionLogin ( false )
			if (
				typeof appScript1 === 'object' &&
				typeof appScript1.startup === 'function'
			) {
				appScript1.startup ( appScript1 )
				this.appScript ( appScript1 )

			} else {

				this.appScript( new appScript1( () => {
					this.appScript ( null )
					this.showMainPage ( true )
					this.bodyBlue ( true )
					eval ( `_view.${ mainMenuArray[ index ].htmlTemp }( false )` )
				}))
			}

			eval ( showSwitch )
		}

		public resizeMiddleZise () {
			this.middleX ( window.innerWidth / 2 )
			this.middleY ( window.innerHeight / 2 )
		}

		public connectLocalServer() {
			this.showLocalServerDisconnect ( false )
			this.connectInformationMessage.socketListening ()
		}

		public userTextareaHeight ( id ) {

			const d = document.getElementById( id )
		   
			/*
			if ( lines < 2 ) {
				const totalText = twitterObj.full_text.length
				if ( totalText > 119 ) {
					return '3rem'
				}
				if ( totalText > 119 ) {
					return '3rem'
				}
			}
			*/
			//const high = limit + lines.length * eachLine 
			//return high + 'rem'
			const high = d.scrollTop + d.scrollHeight
			return high + 'px'
		}
	}
}

const mainMenuArray = [
	
	{
		name: 'librarium',
		img: kloakSearchIcon_svg,
		header: ['图书馆', '図書館', 'Librarium', '圖書館'],
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
		notice: ko.observable ( 0 )
	},
	/** */
	{
		name: 'fortress',
		img: KloakFortress,
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
		notice: ko.observable ( 0 )
	},
	
	{
		name: 'daggr',
		img: Kloak_Daggr,
		header: ['大哥', 'ダク', 'Daggr', '大哥'],
		description: [
			'强加密点对点加密群聊，支持文件多媒体传输和网页链接快照',
			'エンドツーエンドメッセージローカールネットワークモージュルとCoNet通信用メールアカウント設定',
			'EndtoEnd encrypted message system.',
			'強加密點對點群聊，支持群聊，文件多媒體傳輸和網頁鏈接快照',
		],
		extra: null,
		click: daggr,
		htmlTemp: 'daggrHtml',
		online: true,
		notice: ko.observable ( 0 )
	},
	
	{
		name: 'Kloak_youtube',
		img: Kloak_youtube,
		header: ['油管客户端', 'For Youtube', 'For Youtube', 'For Youtube'],
		description: [
			'Youtube客户端',
			'Youtubeクライアント',
			'For Youtube',
			'Youtube客戶端',
		],
		extra: null,
		click: forYoutube,
		online: true,
		htmlTemp: 'forYoutubeHtml',
		notice: ko.observable ( 0 )
	},
	/* *
	{
		name: 'voa',
		img: kloak_voa,
		header: ['VOA', 'VOA', 'VOA', 'VOA'],
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
		notice: ko.observable ( 0 )
	},
	{
		name: 'rfa',
		img: kloak_rfa,
		header: ['RFA', 'RFA', 'RFA', 'RFA'],
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
		notice: ko.observable ( 0 )
	}
	/*,
	{
		name: 'mbn',
		img: Kloak_MBN,
		header: ['MBN', 'MBN', 'MBN', 'MBN'],
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
		notice: ko.observable ( 0 )
	},
	/*
	{
		name: 'tw',
		img: Kloak_twitter,
		header: ['推特客户端', 'Kloak for Twitter', 'Kloak for Twitter', 'Kloak for Twitter'],
		description: [
			'推特客户端',
			'Twitterクライアント',
			'Client for Twitter',
			'推特客戶端',
		],
		extra: null,
		click: forTwitter,
		online: true,
		htmlTemp: 'forTwitterHtml',
		notice: ko.observable ( 0 )
	},
	/*
	{
		name: 'mute',
		img: Kloak_encrypted,
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
		htmlTemp: 'muteHtml',
		notice: ko.observable ( 0 )
	},
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
		notice: ko.observable ( 0 )
	}
	*/
	
	{
		img: Kloak_generalspalding,
		header: [
			'史帕丁将军',
			'ｽﾎﾟﾃﾞﾝ将軍',
			'Spalding',
			'史帕丁將軍',
		],
		description: [
			'前美空军准将，哈德逊研究所高级研究员，美国的智囊团和前白宫国家安全委员会的高级战略规划师',
			'ハドソン研究所の上級研究者であり、アメリカのシンクタンクであり、元ホワイトハウス国家安全保障理事会の上級戦略立案者です',
			'Robert S. Spalding III is a retired United States Air Force brigadier general. He currently serves as a senior fellow at the Hudson Institute.',
			'前美空軍準將，哈德遜研究所高級研究員，美國的智囊團和前白宮國家安全委員會的高級戰略規劃師',
		],
		extra: null,
		click: genSpalding,
		online: false,
		htmlTemp: 'showGeneralSpalding',
		notice: ko.observable ( 0 )
	},
	/*
	{
		name: 'canada',
		img: canadaGov,
		header: ['加拿大政府', 'カナダ', 'For Canada', '加拿大政府'],
		description: [
			'加拿大政府',
			'カナダ政府',
			'For Canada',
			'加拿大政府',
		],
		extra: null,
		click: Canada,
		online: false,
		htmlTemp: 'showCanada',
		notice: ko.observable ( 0 )
	},
	*/
]

const _view = new view_layout.view ()
ko.applyBindings( _view, document.getElementById('body'))

$(`.${_view.tLang()}`).addClass('active')
window[`${'indexedDB'}`] =
	window.indexedDB ||
	window['mozIndexedDB'] ||
	window['webkitIndexedDB'] ||
	window['msIndexedDB']
gsap.registerPlugin ( MorphSVGPlugin, SplitText )
const $window = $( window )

$window.on ( 'resize', () => { 
    _view.resizeMiddleZise ()
})
const CoNET_version = '0.1.43'
