class forYoutube extends sharedAppClass {
	private view = null

    public searchInputTextPlaceholderText = [
        ''
    ]
    constructor ( public exit: () => void ) {
        super ( exit )
    }

    public search_form_request = {
        command: 'CoSearch',
        Args: [],
        error: null,
        subCom: 'youtube_search',
        requestSerial: null
    }

    public search_form_item_request = {
        command: 'CoSearch',
        Args: [],
        error: null,
        subCom: 'getSnapshop',
        requestSerial: null
    }

    public search_form_next_request = {
        command: 'CoSearch',
        Args: [],
        error: null,
        subCom: 'youtube_search_next',
        requestSerial: null
    }

    public search_form_response ( com: QTGateAPIRequestCommand ) {
        
    }

    public converterWatchObj ( multimediaObj ) {
        multimediaObj['view_count'] = multimediaObj ['total_views']
        multimediaObj['duration'] = multimediaObj['videoDetails'].lengthSeconds
        multimediaObj ['title'] = multimediaObj.videoDetails.title
        multimediaObj ['upload_date'] = multimediaObj.player_response.microformat.playerMicroformatRenderer.uploadDate
        multimediaObj ['averageRating'] = multimediaObj['videoDetails'].averageRating
        multimediaObj ['description'] = multimediaObj.player_response.microformat.playerMicroformatRenderer.description ? multimediaObj.player_response.microformat.playerMicroformatRenderer.description.simpleText : ''
        multimediaObj ['like_count'] = null
        multimediaObj ['id'] = uuid_generate ()
        return multimediaObj
    }

    public getItemResponse ( url: string, multimediaObjArray: QTGateAPIRequestCommand[], exit ) {
        const multimediaObj = multimediaObjArray[0].Args

        if ( !multimediaObj['title'] ) {
            this.converterWatchObj ( multimediaObj )
        }
        
        this.view = new showWebPageClass ( url, null, multimediaObj, () => {
            exit ()
			this.view = null
			if (_view.mediaViewer) {
				_view.mediaViewer.terminate()
			}
            
        }, item => {
			// const uu = item
			console.log(item)
			if (item) {
				console.time("STARTING VIDEO PLAY REQUEST")
				_view.mediaViewer = new MediaViewer ({player: document.getElementById('youtubePlayer'), fullBar: document.getElementById("fullBar"), bufferBar: document.getElementById('bufferedBar'), currentTimeBar: document.getElementById("currentTimeBar"), playButton: document.getElementById("videoPlayButton"), stopButton: document.getElementById("videoStopButton"), fullscreenButton: document.getElementById("videoFullScreenButton"), durationText: document.getElementById("durationText")}, (err, canPlay, playing) => {
					if (err) {
						return err
					}
					if (canPlay) {
						if (!this['view']?.videoCanStart()) {
							this['view']?.videoCanStart(canPlay)
						}
					}
					this['view']?.videoPlaying( playing )
                }, () => {

				})

				_view.mediaViewer.youtube( item )
			} else {
				this.view.videoUnablePlay(true)
				this.view.multimediaLoading(false)
			}
        })
    }

    public searchItemList_build ( com, first: boolean ) {
		const args = com.Args
		this.returnSearchResultItemsInit ( args )
		this.moreButton_link_url ( args.nextPage )
		if ( first ) {
			
			this.searchItemsArray ( args.Result )

			args.totalResults = args.totalResults.replace ( /\B(?=(\d{3})+(?!\d))/g, ',' )
			this.totalSearchItems ( args.totalResults )
			this.showSearchItemResult ( true )
			this.showTopMenuInputField ( true )
		} else {
			this.searchItemsArray( this.searchItemsArray().concat( args.Result ))
		}

		if ( typeof this.search_form_response === 'function' ) {
			return this.search_form_response ( com )
		}
		
	}


    public _exit () {
        return this.exit ()
    }
}