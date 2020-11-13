const appScript = {
    info: {
        totalResults: ['大约有', '約', 'About', '大約有'],
        totalResults1: ['条记录', '件', 'results', '條記錄'],
        moreResults: ['更多结果', '結果をさらに表示', 'More Results', '更多結果'],
        searchToolBarMenu: [
            ['网站', 'ウェイブ', 'Website', '網頁'],
            ['新闻', 'ニュース', 'News', '新聞'],
            ['图片', '画像', 'Picture', '圖片'],
            ['视频', 'ビデオ', 'Video', '視頻'],
        ],
    },
    showMain: ko.observable(true),
    htmlIframe: ko.observable(false),
    searchItemsArray: ko.observable(),
    hasFocusShowTool: ko.observable(false),
    backGroundBlue: ko.observable(false),
    searchItem: ko.observable(null),
    showMainSearchForm: ko.observable(true),
    showSearchSetupForm: ko.observable(false),
    showSearchError: ko.observable(false),
    showInputLoading: ko.observable(false),
    errorMessageIndex: ko.observable(-1),
    searchInputText: ko.observable(''),
    hasFocus: ko.observable(false),
    passwordError: ko.observable(false),
    searchSetupIcon: ko.observable(bingIcon),
    password: ko.observable(''),
    searchInputTextActionShow: ko.observable(false),
    SearchInputNextHasFocus: ko.observable(false),
    showSearchesRelated: ko.observable(false),
    searchItemList: ko.observableArray([]),
    loadingGetResponse: ko.observable(false),
    conetResponse: ko.observable(false),
    searchInputTextShow: ko.observable(''),
    currentlyShowItems: ko.observable(0),
    newsButtonShowLoading: ko.observable(false),
    newsItemsArray: ko.observable(),
    newsButtonShowError: ko.observable(false),
    newsButtonErrorIndex: ko.observable(null),
    newsLoadingGetResponse: ko.observable(false),
    newsConetResponse: ko.observable(false),
    nextButtonShowError: ko.observable(false),
    moreResultsButtomLoading: ko.observable(false),
    imageButtonShowLoading: ko.observable(false),
    imageButtonShowError: ko.observable(false),
    imageButtonErrorIndex: ko.observable(-1),
    imageLoadingGetResponse: ko.observable(false),
    imageConetResponse: ko.observable(false),
    imageItemsArray: ko.observable(),
    searchSimilarImagesList: ko.observableArray([]),
    showSearchSimilarImagesResult: ko.observable(false),
    imageSearchItemArray: ko.observable(),
    videoButtonShowLoading: ko.observable(false),
    videoItemsArray: ko.observable(),
    videoButtonShowError: ko.observable(false),
    videoButtonErrorIndex: ko.observable(-1),
    videoLoadingGetResponse: ko.observable(false),
    videoConetResponse: ko.observable(false),
    nextButtonErrorIndex: ko.observable(false),
    nextButtonConetResponse: ko.observable(false),
    nextButtonLoadingGetResponse: ko.observable(false),
    showDownloadProcess: ko.observable(false),
    showDownload: ko.observable(false),
    showHistory: ko.observable(false),
    showDownloadProgress: ko.observable(false),
    currentDownloads: ko.observable({}),
    finishedDownloads: ko.observableArray([]),
    showTwitterObjResult: ko.observable(false),
    twitterObj: null,
    backToMain: () => {
        appScript.searchItem(null);
        appScript.searchItemList([]);
        appScript.showInputLoading(false);
        appScript.showSearchesRelated(false);
        appScript.newsItemsArray(null);
        appScript.imageItemsArray(null);
        appScript.showSearchesRelated(null);
        appScript.videoItemsArray(null);
        appScript.imageSearchItemArray(null);
        appScript.searchInputText('');
        _view.tempAppHtml(false);
        _view.showMainPage(true);
        _view.bodyBlue(true);
        _view.sectionLogin(true);
        _view.appScript(null);
        _view.CanadaBackground(false);
        _view.showSnapshop(false);
    },
    //	['originImage']
    initSearchData: (self) => {
        self.searchItem(null);
        self.searchItemList([]);
        self.showInputLoading(true);
        self.showSearchesRelated(false);
        self.newsItemsArray(null);
        self.imageItemsArray(null);
        self.showSearchesRelated(null);
        self.videoItemsArray(null);
        self.imageSearchItemArray(null);
    },
    showResultItems: (self, items) => {
        self.searchItem(items);
        self.searchItemList(items.Result);
        $('.selection.dropdown').dropdown();
    },
    searchSetupClick: (self, event) => {
        self.showSearchSetupForm(true);
        self.backGroundBlue(true);
        /*
        $('#coSearchBackGround').one ( 'click', function() {
            self.backGroundClick ()
            $('#coSearchForm').off ('click')
        })
        $('#coSearchForm').one ( 'click', function() {
            self.backGroundClick ()
            $('#coSearchBackGround').off ('click')
        })
        */
        return false;
    },
    searchInputCloseError: (self, event) => {
        self.showSearchError(false);
        self.errorMessageIndex(null);
    },
    showTwitter: (self, twitterObj, twitterHref, serialNumber, showAccount) => {
        self.showInputLoading(false);
        _view.CanadaBackground(false);
        self.showMainSearchForm(false);
        self.showMain(false);
        self.twitterObj = new twitter(twitterObj, twitterHref, serialNumber, showAccount, () => {
            self.twitterObj = null;
            self.showTwitterObjResult(false);
            self.showMain(true);
            if (self.searchItemsArray() && self.searchItemsArray().length) {
                return;
            }
            self.showMainSearchForm(true);
            _view.CanadaBackground(true);
        });
        self.showTwitterObjResult(true);
        while (self.twitterObjGetFilesFromFileArray && self.twitterObjGetFilesFromFileArray.length) {
            self.twitterObj.getFilesFromFileArray(self.twitterObjGetFilesFromFileArray.shift());
        }
    },
    getLinkClick: (self, index) => {
        const currentItem = self.searchItemList()[index];
        const el = document.createElement('textarea');
        el.value = currentItem.url;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        const aTag = $(`#${currentItem.id}-urlLink`);
        aTag.popup({ on: 'click' }).popup('show');
        setTimeout(() => {
            aTag.popup('remove');
        }, 3000);
    },
    returnSearchResultItemsInit: (items) => {
        let i = 0;
        const y = [];
        items.Result.forEach((n) => {
            i++;
            n['showLoading'] = ko.observable(false);
            n['conetResponse'] = ko.observable(false);
            n['loadingGetResponse'] = ko.observable(false);
            n['snapshotReady'] = ko.observable(false);
            n['snapshotClass'] = null;
            n['snapshotData'] = null;
            n['snapshotUuid'] = null;
            n['id'] = uuid_generate();
            n['showError'] = ko.observable(false);
            n['errorIndex'] = ko.observable(-1);
            if (!n['newsBrand']) {
                n['newsBrand'] = null;
            }
            if (n.imageInfo) {
                if (!n.imageInfo['videoTime']) {
                    n.imageInfo['videoTime'] = null;
                }
            }
            n['webUrlHref'] = n.clickUrl;
            n['imgUrlHref'] = n.imgSrc;
            n['showDownload'] = ko.observable(false);
            /* ====================================================================================================================
            ANDY - MASONARY IMAGES
            ======================================================================================================================= */
            n['showOptions'] = ko.observable(false);
            /* ====================================================================================================================
            
            ======================================================================================================================= */
            n['showImageLoading'] = ko.observable(false);
            n['showImageError'] = ko.observable(false);
            n['snapshotImageReady'] = ko.observable(false);
            n['loadingImageGetResponse'] = ko.observable(false);
            n['conetImageResponse'] = ko.observable(false);
            n['imageErrorIndex'] = ko.observable(-1);
            n['imgSrc'] = n['imgSrc'] || '';
        });
    },
    search_form: (self, event) => {
        if (self.showInputLoading()) {
            return;
        }
        if (!_view.CanadaBackground()) {
            _view.CanadaBackground(true);
        }
        if (!self.showMainSearchForm()) {
            self.showMainSearchForm(true);
        }
        const search_text = self.searchInputText();
        const width = window.innerWidth;
        const height = window.outerHeight;
        self.initSearchData(self);
        const com = {
            command: 'CoSearch',
            Args: null,
            error: null,
            subCom: null,
            requestSerial: uuid_generate(),
        };
        /**
         * 			web page address
         */
        /*

        const showTwitter = ( twitterObj, twitterHref, serialNumber, buffer, showAccount: boolean ) => {
            self.showInputLoading ( false )
            _view.CanadaBackground ( false )
            self.showMainSearchForm ( false )
            self.showMain( false )
            
            self.twitterObj = new twitter ( twitterObj, twitterHref, serialNumber, buffer, showAccount )
            self.showTwitterObjResult ( true )
        }
        */
        if (/^http[s]?:\/\//.test(search_text)) {
            com.Args = [search_text, width, height];
            com.subCom = 'getSnapshop';
        }
        else {
            com.Args = ['google', search_text];
            com.subCom = 'webSearch';
        }
        const errorProcess = (err) => {
            self.showInputLoading(false);
            self.searchInputText('');
            self.errorMessageIndex(_view.connectInformationMessage.getErrorIndex(err));
            return self.showSearchError(true);
        };
        /**
         *
         * 		test Unit
         */
        com['startTime'] = new Date().getTime();
        return _view.connectInformationMessage.emitRequest(com, (err, com) => {
            if (err) {
                return errorProcess(err);
            }
            if (!com) {
                return self.loadingGetResponse(true);
            }
            if (com.error === -1) {
                self.loadingGetResponse(false);
                return self.conetResponse(true);
            }
            if (com.error) {
                return errorProcess(com.error);
            }
            console.log(`totla time [${(new Date().getTime() - com['startTime']) / 1000}] seconds`);
            /***
             *
             *
             * 		youtube API
             *
             */
            self.showInputLoading(false);
            if (com.subCom === 'youtube') {
                const multimediaObj = com.Args;
                let y = null;
                self.showDownload(true);
                _view.CanadaBackground(false);
                self.showMainSearchForm(false);
                self.showMain(false);
                return new showWebPageClass(search_text, null, multimediaObj, () => {
                    self.showMain(true);
                    self.showMainSearchForm(true);
                    _view.CanadaBackground(true);
                }, () => {
                });
            }
            /**
             *
             * 		getSnapshop will return com.subCom === "downloadFile" when except HTML format
             * 		{
             * 		 	Content-Type: string
             * 			fileExpansion: string
             * 			fileName: string
             * 			length: string ( If null server have not support breakpoint resume )
             * 			url: string
             *
             * 		}
             */
            if (com.subCom === 'downloadFile') {
                const args = com.Args[0];
                self.showDownloadProcess(true);
                let downloader = _view.storageHelper.getDownloader(com.requestSerial);
                if (downloader) {
                    downloader.addToQueue(args);
                    return;
                }
                downloader = _view.storageHelper.createDownload(com.requestSerial, [], args.downloadFilename, ['librarium', 'download'], (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(`${com.requestSerial} DOWNLOAD FINISHED`);
                });
                downloader.addToQueue([args]);
                return;
            }
            if (com.subCom === 'webSearch') {
                const args = com.Args;
                self.searchInputTextShow(search_text);
                self.returnSearchResultItemsInit(args);
                args.totalResults = args.totalResults.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                self.searchItemsArray(args);
                self.showResultItems(self, args);
                _view.CanadaBackground(false);
                return self.showMainSearchForm(false);
            }
            if (com.subCom === 'getSnapshop') {
                const files = com.Args[0];
                let multimediaObj = null;
                try {
                    multimediaObj = JSON.parse(com.Args[1]);
                }
                catch (ex) {
                    console.dir(`have not multimediaObj`);
                }
                _view.storageHelper.createDownload(com.requestSerial, files, multimediaObj && multimediaObj.title, ['snapshot', 'librarium', 'html'], (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    if (data === com.requestSerial) {
                        self.showDownload(true);
                        self.showInputLoading(false);
                        _view.CanadaBackground(false);
                        self.showMainSearchForm(false);
                        self.showMain(false);
                        new showWebPageClass(search_text, com.requestSerial, multimediaObj, () => {
                            self.showMain(true);
                            self.showMainSearchForm(true);
                            _view.CanadaBackground(true);
                        }, () => {
                        });
                    }
                });
                return;
            }
            if (com.subCom === 'twitter') {
                const twObj = com.Args[0];
                const twitterHref = com.Args[1];
                const serialNumber = com.requestSerial;
                const files = com.Args[2];
                if (twObj) {
                    return self.showTwitter(self, twObj, twitterHref, serialNumber, true);
                }
                console.dir(files);
                if (self.twitterObj && self.twitterObj.getFilesFromFileArray) {
                    return self.twitterObj.getFilesFromFileArray(files);
                }
                if (self.twitterObjGetFilesFromFileArray) {
                    return self.twitterObjGetFilesFromFileArray.push(files);
                }
                self["twitterObjGetFilesFromFileArray"] = [files];
                /**
                 *
                 * 			Twitter API
                 */
            }
        });
    },
    historyListClick: (self, event) => {
        _view.CanadaBackground(false);
        self.showMainSearchForm(false);
        self.showMain(true);
        self.showHistory(true);
        _view.bodyBlue(false);
    },
    searchSetup: (key, self, event) => {
        self.showSearchSetupForm(false);
        self.backGroundBlue(false);
        switch (key) {
            case 'b': {
                return self.searchSetupIcon(bingIcon);
            }
            case 'd': {
                return self.searchSetupIcon(duckduckgoIcon);
            }
            case 'y': {
                return self.searchSetupIcon(YahooIcon);
            }
            default: {
                self.searchSetupIcon(googleIcon);
            }
        }
    },
    startup: (self) => {
        self.password.subscribe((_text) => {
            self.passwordError(false);
        });
        self.hasFocus.subscribe((_result) => {
            if (_result) {
                self.hasFocusShowTool(true);
                return self.backGroundBlue(true);
            }
            /*
            if ( self.showMain () ) {
                if ( !self.searchInputText().length ) {
                    self.searchInputTextActionShow ( false )
                    return self.backGroundBlue ( _result )
                }
                self.searchInputTextActionShow ( true )
                _result = false
                return true
            }
            if ( !_result ) {
                return true
            }
            if ( _result ) {
                if ( !self.showSubViewToolBar ()) {
                    self.showSubViewToolBar ( true )
                }
            }
            return true
            */
        });
        self.searchInputText.subscribe((_text) => {
            self.searchInputTextActionShow(_text.length > 0);
        });
        self.SearchInputNextHasFocus.subscribe((hasFocus) => {
            if (hasFocus) {
                self.showSearchesRelated(true);
            }
        });
        _view.CanadaBackground(true);
    },
    nextButtonErrorClick: (self) => {
        self.nextButtonShowError(false);
        self.nextButtonErrorIndex(null);
    },
    webItemsClick: (self, event) => {
        self.currentlyShowItems(0);
        self.showResultItems(self, self.searchItemsArray());
    },
    searchNext: (self, event) => {
        const nextLink = self.searchItem().nextPage;
        if (self.moreResultsButtomLoading() || !nextLink) {
            return;
        }
        self.moreResultsButtomLoading(true);
        function showError(err) {
            self.moreResultsButtomLoading(false);
            self.nextButtonErrorIndex(_view.connectInformationMessage.getErrorIndex(err));
            self.nextButtonShowError(true);
        }
        let currentArray = null;
        const com = {
            command: 'CoSearch',
            Args: ['google', nextLink],
            error: null,
            subCom: null,
            requestSerial: uuid_generate(),
        };
        switch (self.currentlyShowItems()) {
            //      google search
            case 0: {
                com.subCom = 'searchNext';
                currentArray = self.searchItemsArray();
                break;
            }
            //      news
            case 1: {
                com.subCom = 'newsNext';
                currentArray = self.newsItemsArray();
                break;
            }
            case 2: {
                com.subCom = 'imageSearchNext';
                currentArray = self.imageSearchItemArray();
                break;
            }
            default: {
                com.subCom = 'videoNext';
                currentArray = self.videoItemsArray();
                break;
            }
        }
        /** */
        com['startTime'] = new Date().getTime();
        return _view.connectInformationMessage.emitRequest(com, (err, com) => {
            if (err) {
                return showError(err);
            }
            if (!com) {
                return self.nextButtonLoadingGetResponse(true);
            }
            if (com.error === -1) {
                self.nextButtonLoadingGetResponse(false);
                return self.nextButtonConetResponse(true);
            }
            if (com.error) {
                return showError(com.error);
            }
            console.log(`totla time [${(new Date().getTime() - com['startTime']) / 1000}] seconds`);
            self.moreResultsButtomLoading(false);
            self.nextButtonLoadingGetResponse(false);
            self.nextButtonConetResponse(false);
            const args = com.Args;
            self.returnSearchResultItemsInit(args);
            currentArray.Result.push(...args.Result);
            currentArray.nextPage = args.nextPage;
            return self.showResultItems(self, currentArray);
        });
    },
    createNewsResult: (self, newsResult) => {
        const newsItems = JSON.parse(JSON.stringify(self.searchItemsArray()));
        newsItems.Result = newsResult.Result;
        newsItems.nextPage = newsResult.nextPage;
        newsItems.totalResults = newsResult.totalResults;
        return newsItems;
    },
    newsButtonClick: (self, event) => {
        if (self.newsButtonShowLoading()) {
            return;
        }
        if (self.newsButtonShowError()) {
            self.newsButtonShowError(false);
            return self.newsButtonErrorIndex(null);
        }
        self.newsButtonShowLoading(true);
        const errorProcess = (err) => {
            self.newsButtonShowLoading(false);
            self.newsLoadingGetResponse(false);
            self.newsConetResponse(false);
            self.newsButtonErrorIndex(_view.connectInformationMessage.getErrorIndex(err));
            return self.newsButtonShowError(true);
        };
        if (!self.newsItemsArray()) {
            if (!self.searchItemsArray().action ||
                !self.searchItemsArray().action.news) {
                return errorProcess('invalidRequest');
            }
            const com = {
                command: 'CoSearch',
                Args: ['google', self.searchItemsArray().action.news],
                error: null,
                subCom: 'newsNext',
            };
            return _view.connectInformationMessage.emitRequest(com, (err, com) => {
                if (err) {
                    return errorProcess(err);
                }
                if (!com) {
                    return self.newsLoadingGetResponse(true);
                }
                if (com.error === -1) {
                    self.newsLoadingGetResponse(false);
                    return self.newsConetResponse(true);
                }
                if (com.error) {
                    return errorProcess(com.error);
                }
                self.newsButtonShowLoading(false);
                self.newsConetResponse(false);
                self.newsLoadingGetResponse(false);
                const args = com.Args;
                args.totalResults = args.totalResults.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                self.newsItemsArray(self.createNewsResult(self, args));
                self.returnSearchResultItemsInit(self.newsItemsArray());
            });
        }
        self.currentlyShowItems(1);
        self.newsButtonShowLoading(false);
        return self.showResultItems(self, self.newsItemsArray());
    },
    imageButtonClick: (self, event) => {
        if (self.imageButtonShowLoading()) {
            return;
        }
        if (self.imageButtonShowError()) {
            self.imageButtonShowError(false);
            return self.imageButtonErrorIndex(null);
        }
        const errorProcess = (err) => {
            self.imageButtonShowLoading(false);
            self.imageLoadingGetResponse(false);
            self.imageConetResponse(false);
            self.imageButtonErrorIndex(_view.connectInformationMessage.getErrorIndex(err));
            return self.imageButtonShowError(true);
        };
        if (!self.imageItemsArray()) {
            const imageLink = self.searchItemsArray() &&
                self.searchItemsArray().action &&
                self.searchItemsArray().action.image
                ? self.searchItemsArray().action.image
                : self.imageSearchItemArray().searchesRelated[1];
            const com = {
                command: 'CoSearch',
                Args: ['google', imageLink],
                error: null,
                subCom: 'imageNext',
            };
            self.imageButtonShowLoading(true);
            return _view.connectInformationMessage.emitRequest(com, (err, com) => {
                if (err) {
                    return errorProcess(err);
                }
                if (!com) {
                    self.imageConetResponse(false);
                    return self.imageLoadingGetResponse(true);
                }
                if (com.error === -1) {
                    self.imageLoadingGetResponse(false);
                    return self.imageConetResponse(true);
                }
                const args = com.Args;
                if (com.error) {
                    return errorProcess(com.error);
                }
                if (!args.param || !args.param.Result || !args.param.Result.length) {
                    return errorProcess('timeOut');
                }
                self.imageButtonShowLoading(false);
                self.imageConetResponse(false);
                self.imageLoadingGetResponse(false);
                self.imageItemsArray(args.param);
                self.returnSearchResultItemsInit(self.imageItemsArray());
            });
            /** */
        }
        self.searchSimilarImagesList(self.imageItemsArray().Result);
        self.showMain(false);
        self.showSearchSimilarImagesResult(true);
    },
    // CHANGED ============================================
    // CHANGED ============================================
    // CHANGED ============================================
    getSnapshotClick: (self, index, isImage) => {
        let currentItem = null;
        if (isImage) {
            currentItem = self.searchSimilarImagesList()[index];
            currentItem.showImageLoading(true);
        }
        else {
            currentItem = self.searchItemList()[index];
            currentItem.showLoading(true);
        }
        console.log(currentItem.title);
        const url = isImage ? currentItem.clickUrl : currentItem.url;
        const width = $(window).width();
        const height = $(window).height();
        const showError = (err) => {
            isImage
                ? currentItem.showImageLoading(false)
                : currentItem.showLoading(false);
            currentItem.loadingGetResponse(false);
            currentItem.conetResponse(false);
            currentItem["errorIndex"](_view.connectInformationMessage.getErrorIndex(err));
            currentItem['showError'](true);
            const currentElm = $(`#${currentItem['id']}`);
            return currentElm.popup({
                on: 'click',
                inline: true,
                onHidden: function () {
                    currentItem['showError'](false);
                    currentItem['errorIndex'](null);
                },
            });
        };
        const callBack = (err, com) => {
            if (err) {
                return showError(err);
            }
            if (!com) {
                currentItem.loadingGetResponse(true);
                return currentItem.conetResponse(false);
            }
            if (com.error === -1) {
                currentItem.loadingGetResponse(false);
                return currentItem.conetResponse(true);
            }
            if (com.error) {
                return showError(com.error);
            }
            if (com.subCom === 'youtube') {
                currentItem.showDownload(false);
                currentItem.snapshotReady(true);
                currentItem.showLoading(false);
                currentItem['serialNumber'] = com.requestSerial;
                return currentItem['multimediaObj'] = com.Args;
            }
            if (com.subCom === 'twitter') {
                currentItem.showLoading(false);
                currentItem.showDownload(true);
                currentItem['serialNumber'] = com.requestSerial;
                currentItem['twitterObj'] = com.Args;
                /*
                if ( currentItem['fileBuffer'] ) {
                    _view.storageHelper.createDownload ( com.requestSerial, currentItem['fileBuffer'], currentItem ['twitterHref'], [ 'snapshot', 'librarium', 'html', 'twitter' ], (err, data) => {
                        if ( err ) {
                            console.error(err)
                            return
                        }
                        self.showInputLoading ( false )
                        _view.CanadaBackground ( false )
                        self.showMainSearchForm ( false )
                        self.showMain ( false )
                        let y = null
                        
                        _view.storageHelper.createAssembler(com.requestSerial, (err, data) => {
                            if ( err ) {
                                console.error(err)
                                return
                            }
                            //showTwitter: ( self, twitterObj, twitterHref, serialNumber, showAccount: boolean )
                            return self.showTwitter ( self, currentItem ['twObj'], currentItem ['twitterHref'], currentItem ['serialNumber'], true )
                        })
                    })
                }
                */
                //return self.showTwitter ( self, twObj, twitterHref, serialNumber, null, true )
                /**
                 *
                 * 			Twitter API
                 */
                currentItem.showDownload(false);
                currentItem.snapshotReady(true);
                return;
            }
            const files = com.Args[0];
            currentItem.snapshotUuid = com.requestSerial;
            try {
                currentItem['multimediaObj'] = JSON.parse(com.Args[1]);
            }
            catch (ex) {
                console.dir(`have not multimediaObj`);
            }
            console.log(files);
            _view.storageHelper.createDownload(com.requestSerial, files, currentItem.title, ['snapshot', 'librarium', 'html'], (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                if (data === com.requestSerial) {
                    currentItem.showDownload(false);
                    isImage
                        ? currentItem.snapshotImageReady(true)
                        : currentItem.snapshotReady(true);
                    isImage
                        ? currentItem.showImageLoading(false)
                        : currentItem.showLoading(false);
                    currentItem.loadingGetResponse(false);
                }
            });
        };
        const com = {
            command: 'CoSearch',
            Args: [url, width, height],
            error: null,
            subCom: 'getSnapshop',
            requestSerial: uuid_generate(),
        };
        return _view.connectInformationMessage.emitRequest(com, callBack);
    },
    showSnapshotClick: (self, index, isImage) => {
        let currentItem = null;
        if (isImage) {
            currentItem = self.searchSimilarImagesList()[index];
        }
        else {
            currentItem = self.searchItemList()[index];
        }
        /**
         *
         * 		Twitter obj
         */
        //showTwitter: ( self, twitterObj, twitterHref, serialNumber, showAccount: boolean )
        if (currentItem['twitterObj']) {
            const args = currentItem['twitterObj'];
            return self.showTwitter(self, args[0], args[1], currentItem['serialNumber'], true);
        }
        /**
         *
         * 		youtube API
         */
        let y = null;
        self.showMain(false);
        return new showWebPageClass(currentItem.url, currentItem.snapshotUuid, currentItem.multimediaObj, () => {
            self.showMain(true);
        }, () => {
        });
    },
    // CHANGED ============================================
    // CHANGED ============================================
    // CHANGED ============================================
    searchesRelatedSelect: (self, index) => {
        self.searchInputText(self.searchItem().searchesRelated[index].text);
        self.showSearchesRelated(false);
    },
    closeSimilarImagesResult: (self) => {
        self.searchSimilarImagesList([]);
        self.showMain(true);
        self.showSearchSimilarImagesResult(false);
    },
    videoButtonClick: (self) => {
        if (self.videoButtonShowLoading()) {
            return;
        }
        if (self.videoButtonShowError()) {
            self.videoButtonShowError(false);
            return self.imageButtonErrorIndex(null);
        }
        const errorProcess = err => {
            self.videoButtonShowLoading(false);
            self.videoLoadingGetResponse(false);
            self.videoConetResponse(false);
            self.videoButtonErrorIndex(_view.connectInformationMessage.getErrorIndex(err));
            return self.videoButtonShowError(true);
        };
        if (!self.videoItemsArray()) {
            if (!self.searchItemsArray().action || !self.searchItemsArray().action.video) {
                return errorProcess('invalidRequest');
            }
            const com = {
                command: 'CoSearch',
                Args: ['google', self.searchItemsArray().action.video],
                error: null,
                subCom: 'videoNext',
                requestSerial: uuid_generate()
            };
            self.videoButtonShowLoading(true);
            com['startTime'] = new Date().getTime();
            return _view.connectInformationMessage.emitRequest(com, (err, com) => {
                if (err) {
                    return errorProcess(err);
                }
                if (!com) {
                    self.videoConetResponse(false);
                    return self.videoLoadingGetResponse(true);
                }
                if (com.error === -1) {
                    self.videoLoadingGetResponse(false);
                    return self.videoConetResponse(true);
                }
                if (com.error) {
                    return errorProcess(com.error);
                }
                console.log(`subCom: 'videoNext' totla time [${(new Date().getTime() - com['startTime']) / 1000}] seconds`);
                self.videoButtonShowLoading(false);
                self.videoLoadingGetResponse(false);
                self.videoConetResponse(false);
                const args = com.Args;
                self.videoItemsArray(self.createNewsResult(self, args));
                self.returnSearchResultItemsInit(self.videoItemsArray());
            });
            /** */
        }
        self.currentlyShowItems(3);
        return self.showResultItems(self, self.videoItemsArray());
    },
    imageSearch: (ee) => {
        const self = _view.appsManager().appScript();
        const errorProcess = (err) => {
            self.showInputLoading(false);
            self.searchInputText('');
            self.errorMessageIndex(_view.connectInformationMessage.getErrorIndex(err));
            return self.showSearchError(true);
        };
        const showItems = (iResult) => {
            self.showInputLoading(false);
            self.currentlyShowItems(2);
            self.returnSearchResultItemsInit(iResult);
            self.imageSearchItemArray(iResult);
            self.searchInputText(iResult.searchesRelated[0]);
            self.showResultItems(self, self.imageSearchItemArray());
        };
        if (!ee || !ee.files || !ee.files.length) {
            return;
        }
        const file = ee.files[0];
        if (!file || !file.type.match(/^image.(png$|jpg$|jpeg$|gif$)/)) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const rawData = reader.result.toString();
            self.showInputLoading(true);
            self.searchInputText(' ');
            self.searchItem(null);
            self.searchItemList([]);
            return _view.getPictureBase64MaxSize_mediaData(rawData, 1024, 1024, (err, data) => {
                if (err) {
                    return errorProcess(err);
                }
                const uuid = uuid_generate() + '.png';
                return _view.keyPairCalss.encrypt(data.rawData, (err, textData) => {
                    if (err) {
                        return errorProcess(err);
                    }
                    self.initSearchData(self);
                    return _view.connectInformationMessage.sockEmit('sendMedia', uuid, textData, (err) => {
                        if (err) {
                            return errorProcess(err);
                        }
                        const com = {
                            command: 'CoSearch',
                            Args: ['google', uuid],
                            error: null,
                            subCom: 'imageSearch',
                        };
                        return _view.connectInformationMessage.emitRequest(com, (err, com) => {
                            if (err) {
                                return errorProcess(err);
                            }
                            if (!com) {
                                return self.loadingGetResponse(true);
                            }
                            if (com.error === -1) {
                                self.loadingGetResponse(false);
                                return self.conetResponse(true);
                            }
                            if (com.error) {
                                return errorProcess(com.error);
                            }
                            _view.CanadaBackground(false);
                            self.showMainSearchForm(false);
                            return showItems(com.Args.param);
                        });
                    });
                });
            });
        };
        if (!_view.CanadaBackground()) {
            _view.CanadaBackground(true);
        }
        if (!self.showMainSearchForm()) {
            self.showMainSearchForm(true);
        }
        return reader.readAsDataURL(file);
    },
    imagesResultClick: (self, index, image) => {
        const _img = self.searchSimilarImagesList()[index];
        const currentElm = $(`#${_img.id}-1`);
        /**
         *
         * 			get web side
         *
         */
        if (_img.showError()) {
            return _img.showError(false);
        }
        if (_img.showImageError()) {
            return _img.showImageError(false);
        }
        if (image === 'link') {
            if (_img.showLoading()) {
                return;
            }
            const url = _img.webUrlHref;
            if (_img['snapshotData']) {
                self.showMain(false);
                self.showSearchSimilarImagesResult(false);
                let y = null;
                return new showWebPageClass(url, _img['snapshotData'], _img['snapshotUuid'], () => {
                    self.showMain(true);
                    self.showSearchSimilarImagesResult(true);
                }, () => {
                });
            }
            const errorProcess = (err) => {
                _img.errorIndex(_view.connectInformationMessage.getErrorIndex(err));
                _img.showLoading(false);
                _img.snapshotReady(false);
                _img.loadingGetResponse(false);
                _img.conetResponse(false);
                const currentElm = $(`#${_img.id}`);
                currentElm.popup({
                    on: 'click',
                    inline: true,
                    onHidden: function () {
                        _img.showError(false);
                        _img.errorIndex(null);
                    },
                });
                return _img.showError(true);
            };
            _img.showLoading(true);
            const callBack = (err, com) => {
                if (err) {
                    return errorProcess(err);
                }
                if (!com) {
                    _img.loadingGetResponse(true);
                    return _img.conetResponse(false);
                }
                if (com.error === -1) {
                    _img.loadingGetResponse(false);
                    return _img.conetResponse(true);
                }
                if (com.error) {
                    return errorProcess(com.error);
                }
                const arg = com.Args[0];
                _img['snapshotUuid'] = arg.split(',')[0].split('.')[0];
                return _view.connectInformationMessage.sockEmit('getFilesFromImap', arg, (err, buffer) => {
                    if (err) {
                        return errorProcess(err);
                    }
                    if (err) {
                        return errorProcess(err);
                    }
                    _img.snapshotReady(true);
                    _img.showLoading(false);
                    _img.loadingGetResponse(false);
                    _img.conetResponse(false);
                    return (_img['snapshotData'] = buffer);
                });
            };
            const width = $(window).width();
            const height = $(window).height();
            const com = {
                command: 'CoSearch',
                Args: [url, width, height],
                error: null,
                subCom: 'getSnapshop',
            };
            return _view.connectInformationMessage.emitRequest(com, callBack);
        }
        /**
         * n['showImageLoading'] = ko.observable ( false )
            n['snapshotImageReady'] = ko.observable ( false )
            n['loadingImageGetResponse'] = ko.observable ( false )
            n['conetImageResponse'] = ko.observable ( false )
            n['showImageError'] = ko.observable ( false )
            n['imageErrorIndex'] = ko.observable (-1)
         */
        if (image === 'img') {
            if (_img.showImageLoading()) {
                return;
            }
            if (_img['imgOriginalData']) {
                const uu = 1;
                return;
            }
            const errorProcess = (err) => {
                _img.imageErrorIndex(_view.connectInformationMessage.getErrorIndex(err));
                _img.showImageLoading(false);
                _img.snapshotImageReady(false);
                _img.loadingImageGetResponse(false);
                _img.conetImageResponse(false);
                _img.showImageError(true);
                currentElm.popup({
                    inline: true,
                    onHidden: function () {
                        _img.showImageError(false);
                    },
                });
                return;
            };
            const callBack = (err, com) => {
                if (err) {
                    return errorProcess(err);
                }
                if (!com) {
                    _img.loadingGetResponse(true);
                    return _img.conetResponse(false);
                }
                if (com.error === -1) {
                    _img.loadingGetResponse(false);
                    return _img.conetResponse(true);
                }
                if (com.error) {
                    return errorProcess(com.error);
                }
                const arg = com.Args[0];
                _img['snapshotUuid'] = arg.split(',')[0].split('.')[0];
                return _view.connectInformationMessage.sockEmit('getFilesFromImap', arg, (err, buffer) => {
                    if (err) {
                        return errorProcess(err);
                    }
                    _view.sharedMainWorker;
                    return _view.sharedMainWorker.decryptStreamWithAPKey(buffer, (err, data) => {
                        if (err) {
                            return errorProcess(err);
                        }
                        _img.snapshotReady(true);
                        _img.showLoading(false);
                        _img.loadingGetResponse(false);
                        _img.conetResponse(false);
                        return (_img['snapshotData'] = data);
                    });
                });
            };
            const com = {
                command: 'CoSearch',
                Args: [_img.imgUrlHref],
                error: null,
                subCom: 'getFile',
            };
            return _view.connectInformationMessage.emitRequest(com, callBack);
            setTimeout(() => {
                _img.loadingImageGetResponse(true);
                setTimeout(() => {
                    _img.loadingImageGetResponse(false);
                    _img.conetImageResponse(true);
                    setTimeout(() => {
                        _img.loadingImageGetResponse(false);
                        _img.conetImageResponse(false);
                        _img.snapshotImageReady(true);
                        _img.showImageLoading(false);
                    }, 1000);
                }, 1000);
            }, 1000);
            _img.showImageLoading(true);
        }
    },
    closeLibrarium: self => {
        self.searchItem(null);
        self.searchItemList(null);
        self.showInputLoading(false);
        self.newsItemsArray(null);
        self.imageItemsArray(null);
        self.showSearchesRelated(null);
        self.videoItemsArray(null);
        self.imageSearchItemArray(null);
        self.showMainSearchForm(true);
        self.searchInputText('');
        _view.CanadaBackground(false);
        _view.appScript(null);
        _view.showMain();
        _view.bodyBlue(true);
    }
    //*** */
    /** */
};
