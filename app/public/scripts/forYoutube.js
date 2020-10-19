class forYoutube extends sharedAppClass {
    constructor(exit) {
        super(exit);
        this.exit = exit;
        this.view = null;
        this.searchInputTextPlaceholderText = [
            ''
        ];
        this.search_form_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'youtube_search',
            requestSerial: null
        };
        this.search_form_item_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'getSnapshop',
            requestSerial: null
        };
        this.search_form_next_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'youtube_search_next',
            requestSerial: null
        };
    }
    search_form_response(com) {
    }
    converterWatchObj(multimediaObj) {
        multimediaObj['view_count'] = multimediaObj['total_views'];
        multimediaObj['duration'] = multimediaObj['videoDetails'].lengthSeconds;
        multimediaObj['title'] = multimediaObj.videoDetails.title;
        multimediaObj['upload_date'] = multimediaObj.player_response.microformat.playerMicroformatRenderer.uploadDate;
        multimediaObj['averageRating'] = multimediaObj['videoDetails'].averageRating;
        multimediaObj['description'] = multimediaObj.player_response.microformat.playerMicroformatRenderer.description ? multimediaObj.player_response.microformat.playerMicroformatRenderer.description.simpleText : '';
        multimediaObj['like_count'] = null;
        multimediaObj['id'] = uuid_generate();
        return multimediaObj;
    }
    getItemResponse(url, multimediaObjArray, exit) {
        const multimediaObj = multimediaObjArray[0].Args;
        if (!multimediaObj['title']) {
            this.converterWatchObj(multimediaObj);
        }
        this.view = new showWebPageClass(url, null, multimediaObj, () => {
            exit();
            this.view = null;
            if (_view.videoPlayer()) {
                _view.videoPlayer().terminate();
            }
        }, item => {
            // const uu = item
            console.log(item);
            if (item) {
                _view.videoPlayer(new VideoPlayer('youtubePlayer', () => { }, () => { }));
                // const uu = item
                console.log(item);
                _view.videoPlayer().youtubePlayer(item);
            }
            else {
                this.view.videoUnablePlay(true);
                this.view.multimediaLoading(false);
            }
        });
    }
    searchItemList_build(com, first) {
        const args = com.Args;
        this.returnSearchResultItemsInit(args);
        this.moreButton_link_url(args.nextPage);
        if (first) {
            this.searchItemsArray(args.Result);
            args.totalResults = args.totalResults.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            this.totalSearchItems(args.totalResults);
            this.showSearchItemResult(true);
            this.showTopMenuInputField(true);
        }
        else {
            this.searchItemsArray(this.searchItemsArray().concat(args.Result));
        }
        if (typeof this.search_form_response === 'function') {
            return this.search_form_response(com);
        }
    }
    _exit() {
        return this.exit();
    }
}
