class forYoutube extends sharedAppClass {
    constructor(exit) {
        super(exit);
        this.exit = exit;
        this.searchInputTextPlaceholderText = [
            ''
        ];
        this.search_form_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'youtube_search',
            requestSerial: uuid_generate()
        };
        this.search_form_item_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'getSnapshop',
            requestSerial: uuid_generate()
        };
        this.search_form_response = (com) => {
            console.log(com.Args);
        };
    }
    converterWatchObj(multimediaObj) {
        multimediaObj['view_count'] = multimediaObj['total_views'];
        multimediaObj['duration'] = multimediaObj['videoDetails'].lengthSeconds;
        multimediaObj['title'] = multimediaObj.videoDetails.title;
        multimediaObj['upload_date'] = multimediaObj.microformat.playerMicroformatRenderer.uploadDate;
        multimediaObj['averageRating'] = multimediaObj['videoDetails'].averageRating;
        multimediaObj['description'] = multimediaObj.microformat.playerMicroformatRenderer.description.simpleText;
        multimediaObj['like_count'] = null;
        multimediaObj['id'] = uuid_generate();
        return multimediaObj;
    }
    getItemResponse(url, multimediaObj, exit) {
        if (!multimediaObj['title']) {
            this.converterWatchObj(multimediaObj);
        }
        const view = new showWebPageClass(url, null, multimediaObj, () => {
            exit();
        }, item => {
            const uu = item;
        });
    }
    _exit() {
        return this.exit();
    }
}
