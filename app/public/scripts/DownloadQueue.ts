

class DownloadQueue {

	private downloadQueue: kloak_downloadObj[]  = []
	private downloading = false
	private stoped = false
	private currentIndex = 0
	private requestUUID = uuid_generate()
	public totalLength = 0

	private stopProcess ( err ) {
		// this.CallBack ( new Error ( err ))
		this.stoped = true
		this.downloadQueue = []
		return this.Log ( err )
	}

	private downloadProcess () {

		if ( this.stoped ) {
			this.Log (`downloadProcess this.stoped!`, this.downloadQueue )
			return this.downloadQueue = []
		}
		if ( this.downloading ) {
			return this.Log (`downloadProcess downloading!!`)
		}
		

		const _check = () => {
			const index = this.downloadQueue.findIndex ( n => n.order === this.currentIndex )
			if ( index < 0 ) {
				this.Log (`[${ this.downloadQueue.map ( n => n.order )}]`)
				return null
			}
			const coms = this.downloadQueue.splice ( index, 1 )
			this.downloading = true
			return coms[0]
		}

		const com = _check ()

		if ( !com ) {
			return this.Log (`_check return null, currentIndex [${ this.currentIndex }] downloadQueue.length [ ${ this.downloadQueue.length }]`)
		}

		this.Log (`downloadObj coming! [${ com.downloadUuid }] ORDER [${ com.order }] EOF [${ com.eof }]`)

		return _view.connectInformationMessage.fetchFiles ( com.downloadUuid, ( err, data ) => {

			if ( err ) {
				const message = `downloadProcess ERROR [${ err }] when fetch order ${ com.order } UUID [${ com.downloadUuid }], Download STOP!`
				return this.stopProcess ( message )
				
			}

			if ( data ) {
				if ( typeof this.dataCallBackBeforeDecryptoCallBack === 'function' ) {
					this.dataCallBackBeforeDecryptoCallBack ( this.requestUUID, com.downloadUuid, data.data, com.eof )
				}
				return _view.sharedMainWorker.decryptStreamWithoutPublicKey ( Buffer.from ( data.data ).toString(), ( err, _data ) => {
					if ( err ) {
						const err = `Unable to decrypt file ORDER [${ com.order }]`
						return this.stopProcess ( err )
					}
					this.currentIndex ++
					this.downloading = false

					if ( _data ) {
						this.CallBack ( null, _data.data )
					}
					if ( com.eof ) {
						return this.stopProcess ('EOF')
					}
					
					return this.downloadProcess ()
				})
			}
			
			this.Log (`downloadPart have NO Data, order ${ com.order }`)
			if ( com.eof ) {
				return this.stopProcess ('EOF')
			}
			this.currentIndex ++
			this.downloading = false
			return this.downloadProcess ()
		})
	}

	private Log ( ...args ) {
		const now = new Date()
		console.log (`[${ now.toLocaleTimeString()}:${ now.getMilliseconds()}]  [${ this.title }] ${ args }`)
	}

	constructor ( downloadUrl: string, private title: string, private CallBack, private dataCallBackBeforeDecryptoCallBack: ( requestUuid: String, downloadUuid: string,  data: string, eof: boolean ) => void = null ) {
		this.Log (`new DownloadQueue UUID [${ this.requestUUID }]`)

		if (! downloadUrl) {
			const err = new Error ( `No URL present! Decode signatureCipher!` )
			this.Log( err.message )
			return CallBack ( err )
		}

		const com: QTGateAPIRequestCommand = {
			command: 'CoSearch',
			Args: [ downloadUrl ],
			error: null,
			subCom: 'downloadFile',
			requestSerial: this.requestUUID,
		}

		const _CallBack = ( _err, com: QTGateAPIRequestCommand ) => {

			if ( this.stoped ) {
				return 
			}

			if ( _err ) {
				const err = new Error (`Emit request error ${ _err.message }`)
				this.Log( err.message )
				return CallBack ( err )
			}
			if ( !com ) {
				return
			}

			if ( com.error === -1 ) {
				return
			}

			if ( com.error ) {
				const err = `Kloak response error ${ com.error }`
				return this.stopProcess ( err )
			}
	
			if ( com.subCom === 'downloadFile' ) {
				const downloadObj: kloak_downloadObj = com.Args[0]
				this.totalLength = downloadObj.totalLength
				if ( downloadObj.order !== this.currentIndex ) {
					if ( downloadObj.order < this.currentIndex ) {
						return this.Log (`ORDER [${ downloadObj.order }] already passed `)
					}

					const index = this.downloadQueue.findIndex ( n => n.order === downloadObj.order )

					if ( index < 0 ) {
						this.downloadQueue.push ( downloadObj )
					}

					return this.downloadProcess ()
				}
				/**
				 * 
				 * 			current order already running!
				 */

				if ( this.downloading ) {
					return
				}

				this.downloadQueue.push ( downloadObj )
				return this.downloadProcess ()
			}

			const message = `emitRequest get response !== 'downloadFile' STOP!`
			console.log ( com )

			return this.stopProcess ( message )
		}

		_view.connectInformationMessage.emitRequest ( com, _CallBack )
	}

	public stopDownload () {
		this.stoped = true
	}
}

class mediaHtmlStream {
	constructor ( uuid: string, ) {

	}
}