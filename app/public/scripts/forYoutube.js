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
            if (_view.mediaViewer) {
                _view.mediaViewer.terminate();
            }
        }, item => {
            // const uu = item
            console.log(item);
            if (item) {
                console.time("STARTING VIDEO PLAY REQUEST");
                _view.mediaViewer = new MediaViewer({ player: document.getElementById('youtubePlayer'), fullBar: document.getElementById("fullBar"), bufferBar: document.getElementById('bufferedBar'), currentTimeBar: document.getElementById("currentTimeBar"), playButton: document.getElementById("videoPlayButton"), stopButton: document.getElementById("videoStopButton"), fullscreenButton: document.getElementById("videoFullScreenButton"), durationText: document.getElementById("durationText") }, (err, playing) => {
                    if (err) {
                        return err;
                    }
                    if (!this.view.videoCanStart()) {
                        this.view.videoCanStart(playing);
                    }
                    this.view.videoPlaying(playing);
                }, () => {
                });
                _view.mediaViewer.youtube(item);
            }
            else {
                this.view.videoUnablePlay(true);
                this.view.multimediaLoading(false);
            }
        });
    }
    _exit() {
        return this.exit();
    }
}
