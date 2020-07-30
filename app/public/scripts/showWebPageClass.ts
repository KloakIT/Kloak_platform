/**
 * 		@labelText [ $root.languageIndex() ]
 *  	@iconName https://semantic-ui.com/elements/icon.html#/definition
 * 		@cmd QTGateAPIRequestCommand
 * 		
 */


class buttonStatusClass {
	public loading: any = ko.observable ( false )
	public error = ko.observable ( null )
	public requestUuid = null
	public errorProcess = err => {
		this.loading ( false )
		
		this.error ( _view.connectInformationMessage.getErrorIndex ( err ))
		return 
	}
	public click ( self ) {
		
		if ( this.loading () === 5 ) {
			new Assembler(this.requestUuid, null, (err, data) => {
				_view.displayVideo(true)
				const videoPlayer = document.getElementById("videoPlayer")
				videoPlayer['src'] = data.url
			})
			return 
		}

		if ( this.error ()) {
			return this.error ( null )
		}

		if ( this.loading() ) {
			return 
		}

		const command = this.cmd
		const _self = this
		this.loading ( 1 )
		
		return _view.connectInformationMessage.emitRequest ( command, ( err, com: QTGateAPIRequestCommand ) => {
			if ( err ) {
				return _self.errorProcess ( err )
			}

			if ( !com ) {
				return _self.loading ( 2 )
			}

			if ( com.error === -1 ) {
				return _self.loading ( 3 )
			}

			if ( com.error ) {
				return _self.errorProcess ( com.error )
			}

			const files = com.Args[0]
		
			_view.downloadMain.newDownload ( com.requestSerial, `${_self.obj.title}.${self.labelText[0] === '' ? 'mp3' : 'mp4'}`, ['media', 'librarium', 'html'], ( err, data ) => {
				if ( err ) {
					console.error(err)
					return
				}
				if ( data ) {
					this.requestUuid = com.requestSerial
					this.loading( 5 )
				}
			})

			this.loading( 4 )

			_view.downloadMain.addMultipleQueue ({ requestUuid: com.requestSerial, url: null, files })
		})
		
		
	}


	constructor ( public labelText: string[], public iconName: string, public cmd: QTGateAPIRequestCommand, private obj: any, public redirect = true ) {
	}

}

class showWebPageClass {
	public showLoading = ko.observable ( true )
	public htmlIframe = ko.observable ( null )
	public showErrorMessage = ko.observable ( false )
	public showHtmlCodePage = ko.observable ( false )
	public showMultimediaObjButton = ko.observable ( false )
	public MultimediaObjArray = ko.observable ()
	public showImgPage = ko.observable ( true )
	public showMultimediaPage = ko.observable ( false )

	public showErrorMessageProcess() {
		this.showLoading ( false )
		this.showErrorMessage ( true )
	}

	public png = ko.observable ('')
	public mHtml = ko.observable ('')

	private urlBlobList = []

	public close() {
		this.showImgPage(false)
		this.showHtmlCodePage(false)
		this.png(null)
		this.htmlIframe(null)
		this.urlBlobList.forEach(( n) => {
			(URL || webkitURL).revokeObjectURL(n)
		})
		this.exit()
	}

	public imgClick () {
		this.showMultimediaPage ( false )
		this.showHtmlCodePage (false )
		this.showImgPage ( true )
		window.scrollToTop()
	}

	public showMultimedia () {
		this.showHtmlCodePage ( false )
		this.showImgPage ( false )
		this.showMultimediaPage ( true )
		window.scrollToTop()
	}

	public htmlClick() {
		this.showHtmlCodePage ( true )
		this.showImgPage ( false )
		this.showMultimediaPage ( false )
		const docu = this.mHtml ()
		if ( docu ) {
			$('iframe')
				.contents()
				.find('head')
				.html(docu['window'].document.head.outerHTML)
			$('iframe')
				.contents()
				.find('body')
				.html(docu['window'].document.body.outerHTML)
		}
		window.scrollToTop()
	}

	private checkFormat ( multimediaObj ) {

		const fomrmats: any[] = multimediaObj.formats
	
		multimediaObj['audio'] = multimediaObj['video8k'] = multimediaObj['video4k'] = multimediaObj['video2k'] = multimediaObj['video720'] = multimediaObj['video480'] = false
		
		multimediaObj[ 'error' ] = ko.observable ( false )
		multimediaObj['longer'] = null

		if ( typeof multimediaObj['like_count'] === 'number' && multimediaObj['like_count'] > 0 ) {
			multimediaObj.like_count = multimediaObj.like_count.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' )
		}
		if ( typeof multimediaObj['view_count'] === 'number' && multimediaObj['view_count'] > 0 ) {
			multimediaObj.view_count = multimediaObj.view_count.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' )
		}
		

		if ( multimediaObj.duration ) {
			const se1 = parseInt( multimediaObj.duration )
			const se2 = parseInt(( se1 / 60).toString ())
			let se3 = (se1 - se2 * 60).toString ()
			se3 = se3.length < 2 ? '0' + se3 : se3
			multimediaObj.longer =  `${ se2 }:${ se3 }`
		}

		if ( /audio only$/i.test ( multimediaObj.format )) {
			const cmd: QTGateAPIRequestCommand = {
				command: 'CoSearch',
				Args: [ multimediaObj.webpage_url, 'audio' ],
				error: null,
				subCom: 'getMediaData',
				requestSerial: uuid_generate(),
			}
			return multimediaObj.audio = new buttonStatusClass (['','','',''], 'volume up', cmd, multimediaObj )
		}
		
		fomrmats.forEach ( n => {
			const h = parseInt ( n.format_id )

			switch ( h ) {
				
				case 140:
				case 249:
				case 250:
				case 251: {
					const cmd: QTGateAPIRequestCommand = {
						command: 'CoSearch',
						Args: [ multimediaObj.webpage_url, 'audio' ],
						error: null,
						subCom: 'getMediaData',
						requestSerial: uuid_generate(),
					}
					return multimediaObj.audio = new buttonStatusClass (['','','',''], 'volume up', cmd, multimediaObj )
				}
				case 18:
				case 43:
				case 133:
				case 134:
				case 135:
				case 160:
				case 242:
				case 243:
				case 244:
				case 278: 
				case 330: 
				case 331: 
				case 332: 
				case 333:
				case 394:
				case 395:
				case 396:
				case 397: {
					const cmd: QTGateAPIRequestCommand = {
						command: 'CoSearch',
						Args: [ multimediaObj.webpage_url, '480' ],
						error: null,
						subCom: 'getMediaData',
						requestSerial: uuid_generate(),
					}
					return multimediaObj.video480 = new buttonStatusClass (['480','480','480','480'],'film', cmd, multimediaObj )
				}
				case 22:
				case 136:
				case 247:
				case 298:
				case 302:
				case 334:
				case 398:{
					const cmd: QTGateAPIRequestCommand = {
						command: 'CoSearch',
						Args: [ multimediaObj.webpage_url, '720' ],
						error: null,
						subCom: 'getMediaData',
						requestSerial: uuid_generate(),
					}
					return multimediaObj.video720 = new buttonStatusClass (['720','720','720','720'],'film', cmd, multimediaObj )
				}
				case 137:
				case 248:
				case 299:
				case 303:
				case 335:
				case 399: {
					const cmd: QTGateAPIRequestCommand = {
						command: 'CoSearch',
						Args: [ multimediaObj.webpage_url, '1080' ],
						error: null,
						subCom: 'getMediaData',
						requestSerial: uuid_generate(),
					}
					return multimediaObj.video2k = new buttonStatusClass (['2k','2k','2k','2k'],'film', cmd, multimediaObj )
				}

				case 271:
				case 308:
				case 313:
				case 315:
				case 336:
				case 337:
				case 400: 
				case 401: {
					const cmd: QTGateAPIRequestCommand = {
						command: 'CoSearch',
						Args: [ multimediaObj.webpage_url, '2048' ],
						error: null,
						subCom: 'getMediaData',
						requestSerial: uuid_generate(),
					}
					return multimediaObj.video4k = new buttonStatusClass (['','4k','4k','4k'],'film', cmd, multimediaObj )
				}

				case 272: {
					const cmd: QTGateAPIRequestCommand = {
						command: 'CoSearch',
						Args: [ multimediaObj.webpage_url, '4096' ],
						error: null,
						subCom: 'getMediaData',
						requestSerial: uuid_generate(),
					}
					return multimediaObj.video8k = new buttonStatusClass (['8k','8k','8k','8k'], 'film', cmd, multimediaObj )
				}

				default: {
					if ( /hls_opus_64|hls_mp3_128|http_mp3_128|download/i.test ( n.format_id )) {
						const cmd: QTGateAPIRequestCommand = {
							command: 'CoSearch',
							Args: [ multimediaObj.webpage_url, 'audio' ],
							error: null,
							subCom: 'getMediaData',
							requestSerial: uuid_generate(),
						}
						return multimediaObj.audio = new buttonStatusClass (['','','',''], 'volume up', cmd, multimediaObj )
					}
					return console.dir (`checkFormat know format: ${ n.format_id } ${n.format }`)
				}

			}
		})
	}

	public getMediaData ( _com: string, index = -1 ) {
		const com: QTGateAPIRequestCommand = {
			command: 'CoSearch',
			Args: [ _com ],
			error: null,
			subCom: 'getMediaData',
			requestSerial: uuid_generate(),
		}
		if ( index === -1 ) {
			com.Args.push ( this.MultimediaObjArray().webpage_url )
		} else {
			com.Args.push ( this.MultimediaObjArray().entries[ index ].webpage_url )
		}

	}

	public showMultimediaObj () {
		this.multimediaObj.entriesObj = ko.observableArray ([])
		this.showMultimediaObjButton ( true )
		if ( !this.multimediaObj.entries ) {
			this.multimediaObj['entries'] = false
			this.checkFormat ( this.multimediaObj )
		}
		if ( !this.multimediaObj.thumbnails ) {
			this.multimediaObj['thumbnails'] = false
			
			this.multimediaObj.entries.forEach ( n => {

				if ( /^playlist$/i.test ( n._type )) {
					if ( n.entries && n.entries.length ) {
						n.entries.forEach  ( m => {
							this.checkFormat ( m )
							this.multimediaObj.entriesObj.push ( m )
						})
						return 
					}
				}
				this.checkFormat ( n )
				this.multimediaObj.entriesObj.push ( n )
			})
			//this.multimediaObj.entriesObj = ko.observableArray ( this.multimediaObj.entries )
		}

		this.MultimediaObjArray ( this.multimediaObj )
		window.scrollToTop ()

		
	}

	constructor( public showUrl: string, private zipBase64Stream: string, private zipBase64StreamUuid: string, private multimediaObj, private exit: () => void ) {
		const self = this
		if ( zipBase64Stream && zipBase64StreamUuid ) {
			_view.sharedMainWorker.unzipHTML ( zipBase64StreamUuid, zipBase64Stream, (err, data) => {
				//showHTMLComplete ( zipBase64StreamUuid, zipBase64Stream, ( err, data: { mhtml: string, img: string, html: string, folder: [ { filename: string, data: string }]} ) => {
				if ( err ) {
					console.log ( err )
					return self.showErrorMessageProcess()
				}
			/*
				if ( err ) {
					return self.showErrorMessageProcess()
				}
			*/
				_view.bodyBlue ( false )

				let html = null
				//      support HTMLComplete
				if ( html ) {
					html = html.replace(/ srcset="[^"]+" /gi, ' ').replace(/ srcset='[^']+' /gi, ' ')
					let det = data.folder.shift()
					const getData = (filename: string, _data: string, CallBack) => {
						const pointStart = html.indexOf(`${filename}`)

						const doCallBack = () => {
							det = data.folder.shift()
							if (!det) {
								return CallBack()
							}
							return getData(det.filename, det.data, CallBack)
						}

						if ( pointStart > -1 ) {
							return getFilenameMime(filename, (err, mime) => {
								if (mime && !/javascript/.test(mime)) {
									/**
									 *
									 *          css link tag format support
									 *
									 */
									const _filename = filename
										.replace(/\-/g, '\\-')
										.replace(/\//g, '\\/')
										.replace(/\./g, '\\.')
										.replace(/\(/g, '\\(')
										.replace(/\)/g, '\\)')
									const regex = new RegExp(
										` src=("|')\.\/${_filename}("|')`,
										'g'
									)
									const regex1 = new RegExp(
										` href=("|')\.\/${_filename}("|')`,
										'g'
									)
									/*
								if ( /^ src/i.test( hrefTest )) {
									
									const data1 = `data:${ mime };base64,` + _data
									html = html.replace ( regex, data1 ).replace ( regex, data1 )
									return doCallBack ()
									
								}
								*/
									const blob = new Blob(
										[
											/^image/.test(mime)
												? Buffer.from(_data, 'base64')
												: Buffer.from(_data, 'base64').toString(),
										],
										{ type: mime }
									)
									const link = (URL || webkitURL).createObjectURL(blob)
									html = html
										.replace(regex, ` src="${link}"`)
										.replace(regex1, ` href="${link}"`)
									this.urlBlobList.push(link)
								}
								doCallBack()
							})
						}

						doCallBack()
					}

					return getData(det.filename, det.data, (err) => {
						self.png(data.img)

						const htmlBolb = new Blob([html], { type: 'text/html' })
						const _url = (URL || webkitURL).createObjectURL(htmlBolb)

						self.showLoading(false)
						self.htmlIframe(_url)
						self.urlBlobList.push(_url)
					})
				}
				
				if ( data.mhtml ) {
					html = mhtml2html.convert ( data.mhtml )
					self.mHtml ( html )
				}
				self.png ( data.img ) //data.img )
				self.showLoading ( false )

				if ( multimediaObj ) {
					this.showMultimediaObj ()
				}
			})
			return
		}
		this.showLoading ( false )
		this.showImgPage ( false )
		this.showMultimediaObj ()
		this.showMultimedia ()
	}
}