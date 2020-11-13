class sharedAppClass {
    constructor(exit) {
        this.exit = exit;
        this.info = {
            totalResults: ['大约有', '約', 'About', '大約有'],
            totalResults1: ['条记录', '件', 'results', '條記錄'],
            moreResults: ['更多结果', '結果をさらに表示', 'More Results', '更多結果']
        };
        this.searchInputText = ko.observable('');
        this.searchInputText_searching = ko.observable(false);
        this.errorMessageIndex = ko.observable(-1);
        this.searchInputTextError = ko.observable(false);
        this.topMenu = ko.observable(true);
        this.showTopMenuInputField = ko.observable(true);
        this.showTopMenuHomeButton = ko.observable(true);
        this.searchItemsArray = ko.observableArray();
        this.totalSearchItems = ko.observable();
        this.moreButton_link_url = ko.observable();
        this.showSearchItemResult = ko.observable(false);
        this.nextButtonShowError = ko.observable(false);
        this.moreResultsButtomLoading = ko.observable(0);
        this.currentItem = -1;
    }
    searchItemList_build(com, first) {
    }
    /**
     *
     * 		function
     */
    search_form_response(data) { }
    item_request_get_response(currentItem, data) { return true; }
    showInputTextAreaError(err) {
        this.searchInputText_searching(false);
        this.errorMessageIndex(_view.connectInformationMessage.getErrorIndex(err));
        this.searchInputTextError(true);
    }
    returnSearchResultItemsInit(items) {
        let i = 0;
        const y = [];
        items.Result.forEach(n => {
            i++;
            n['showLoading'] = ko.observable(false);
            n['showError'] = ko.observable(false);
            n['errorIndex'] = ko.observable(-1);
            n['conetResponse'] = ko.observable(false);
            n['loadingGetResponse'] = ko.observable(false);
            n['snapshotReady'] = ko.observable(false);
            n['snapshotClass'] = null;
            n['snapshotData'] = null;
            n['snapshotUuid'] = null;
            n['id'] = uuid_generate();
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
            const u = n['title'];
            n['title'] = u.replace(/ \- YouTube$/i, '');
        });
    }
    search_form() {
        try {
            this.search_form_request.Args = [this.searchInputText()];
        }
        catch (ex) {
            return console.log(ex);
        }
        this.search_form_request.requestSerial = uuid_generate();
        this.search_form_request['startTime'] = new Date().getTime();
        this.searchInputText_searching(false);
        const youtube_search_response = (err, com) => {
            if (err) {
                this.searchInputText_searching(false);
                return this.showInputTextAreaError(err);
            }
            if (!com) {
                return this.searchInputText_searching(2);
            }
            if (com.error === -1) {
                return this.searchInputText_searching(3);
            }
            this.searchInputText('');
            this.searchInputText_searching(false);
            const totoalTime = new Date().getTime() - com['startTime'];
            console.log(`total time [${totoalTime / 1000}]`);
            if (com.error) {
                return this.showInputTextAreaError(com.error);
            }
            return this.searchItemList_build(com, true);
        };
        this.searchInputText_searching(1);
        return _view.connectInformationMessage.emitRequest(this.search_form_request, youtube_search_response);
    }
    searchNext() {
        if (this.nextButtonShowError()) {
            return this.nextButtonShowError(false);
        }
        if (this.moreResultsButtomLoading()) {
            return;
        }
        this.moreResultsButtomLoading(1);
        this.search_form_next_request.Args = [this.moreButton_link_url()];
        this.search_form_next_request['startTime'] = new Date().getTime();
        this.search_form_next_request.requestSerial = uuid_generate();
        const error = err => {
            this.nextButtonShowError(_view.connectInformationMessage.getErrorIndex(err));
            this.moreResultsButtomLoading(0);
        };
        const youtube_Next_response = (err, com) => {
            if (err) {
                return error(err);
            }
            if (!com) {
                return this.moreResultsButtomLoading(2);
            }
            if (com.error === -1) {
                return this.moreResultsButtomLoading(3);
            }
            const totoalTime = new Date().getTime() - com['startTime'];
            console.log(`total time [${totoalTime / 1000}]`);
            if (com.error) {
                return error(com.error);
            }
            this.moreResultsButtomLoading(0);
            return this.searchItemList_build(com, false);
        };
        return _view.connectInformationMessage.emitRequest(this.search_form_next_request, youtube_Next_response);
    }
    _exit() {
        return this.exit();
    }
    getItemResponse(url, com, exit) { }
    getLinkClick(index) {
        const currentItem = this.searchItemsArray()[index];
        if (currentItem['showError']()) {
            currentItem['showLoading'](0);
            return currentItem['showError'](false);
        }
        const url = currentItem['url'];
        if (currentItem['showLoading']() === 5) {
            this.showSearchItemResult(false);
            this.showTopMenuHomeButton(false);
            this.currentItem = index;
            return this.getItemResponse(url, currentItem['multimediaObj'], () => {
                this.showSearchItemResult(true);
                this.showTopMenuHomeButton(true);
                this.currentItem = -1;
            });
        }
        if (currentItem['showLoading']() > 0) {
            return;
        }
        this.search_form_item_request.Args = [url];
        this.search_form_item_request.requestSerial = uuid_generate();
        this.search_form_item_request['startTime'] = new Date().getTime();
        const error = err => {
            currentItem['errorIndex'](_view.connectInformationMessage.getErrorIndex(err));
            return currentItem['showError'](true);
        };
        currentItem['multimediaObj'] = [];
        let finished = false;
        const youtube_item_response = (err, com) => {
            if (finished) {
                return;
            }
            if (err) {
                return error(err);
            }
            if (!com) {
                return currentItem['showLoading'](2);
            }
            if (com.error === -1) {
                return currentItem['showLoading'](3);
            }
            currentItem['showLoading'](0);
            finished = true;
            const totoalTime = new Date().getTime() - com['startTime'];
            console.log(`getLinkClick ${currentItem['url']}total time [${totoalTime / 1000}]`);
            if (com.error) {
                return error(com.error);
            }
            currentItem['multimediaObj'].push(com);
            if (typeof this.item_request_get_response === 'function') {
                return this.item_request_get_response(currentItem, com) ? currentItem['showLoading'](5) : null;
            }
            currentItem['showLoading'](5);
        };
        currentItem['showLoading'](1);
        return _view.connectInformationMessage.emitRequest(this.search_form_item_request, youtube_item_response);
    }
}
