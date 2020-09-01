class forTwitter extends sharedAppClass {
    constructor(exit) {
        super(exit);
        this.inputPlaceholder = [
            '尝试搜索用户、话题或关键词', 'アカウント、トピック、キーワードで検索してみましょう', 'Try searching for people, topics, or keywords', '嘗試搜尋人物、主題或關鍵字'
        ];
        this.search_form_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'twitter_search',
            requestSerial: uuid_generate()
        };
        this.search_form_item_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'getSnapshop',
            requestSerial: uuid_generate()
        };
        this.searchInputText = ko.observable('');
    }
    getItemResponse(url, multimediaObj, exit) {
    }
    item_request_get_response(currentItem, cmd) {
        const Arg = cmd.Args;
        if (!currentItem['twitterFiles']) {
            currentItem['twitterFiles'] = [];
        }
        if (Arg[2]) {
            currentItem['twitterFiles'].push(Arg[2]);
            return false;
        }
        currentItem['TwObj'] = Arg[0];
        currentItem['Href'] = Arg[1];
        currentItem['twitterObj'] = new twitter(currentItem['TwObj'], currentItem['Href'], cmd.requestSerial, true, () => {
            /*
            self.twitterObj = null
            self.showTwitterObjResult ( false )
            self.showMain( true )
            if ( self.searchItemsArray() && self.searchItemsArray().length ) {
                return
            }
            self.showMainSearchForm ( true )
            _view.CanadaBackground ( true )
            */
        });
        return true;
    }
}
