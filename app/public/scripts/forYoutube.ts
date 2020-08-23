class forYoutube extends sharedAppClass {

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
        requestSerial: uuid_generate()
    }

    public search_form_item_request = {
        command: 'CoSearch',
        Args: [],
        error: null,
        subCom: 'getSnapshop',
        requestSerial: uuid_generate()
    }

    public search_form_response = ( com: QTGateAPIRequestCommand ) => {
        console.log ( com.Args )
    }

    public converterWatchObj ( multimediaObj ) {
        multimediaObj['view_count'] = multimediaObj ['total_views']
        multimediaObj['duration'] = multimediaObj['videoDetails'].lengthSeconds
        multimediaObj ['title'] = multimediaObj.videoDetails.title
        multimediaObj ['upload_date'] = multimediaObj.microformat.playerMicroformatRenderer.uploadDate
        multimediaObj ['averageRating'] = multimediaObj['videoDetails'].averageRating
        multimediaObj ['description'] = multimediaObj.microformat.playerMicroformatRenderer.description.simpleText
        multimediaObj ['like_count'] = null
        multimediaObj ['id'] = uuid_generate ()
        return multimediaObj
    }

    public getItemResponse ( url: string, multimediaObj, exit ) {
        if ( !multimediaObj['title'] ) {
            this.converterWatchObj ( multimediaObj )
        }
        const view = new showWebPageClass ( url, null, multimediaObj, () => {
            exit ()
        }, item => {
            const uu = item
        })
    }


    public _exit () {
        return this.exit ()
    }
}