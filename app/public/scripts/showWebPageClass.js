class showWebPageClass {
    constructor(showUrl, zipBase64Stream, zipBase64StreamUuid, exit) {
        this.showUrl = showUrl;
        this.zipBase64Stream = zipBase64Stream;
        this.zipBase64StreamUuid = zipBase64StreamUuid;
        this.exit = exit;
        this.showLoading = ko.observable(true);
        this.htmlIframe = ko.observable(null);
        this.showErrorMessage = ko.observable(false);
        this.showHtmlCodePage = ko.observable(false);
        this.showImgPage = ko.observable(true);
        this.png = ko.observable('');
        this.mHtml = ko.observable('');
        this.urlBlobList = [];
        const self = this;
        _view.sharedMainWorker.decryptStreamWithAPKeyAndUnZIP(zipBase64StreamUuid, zipBase64Stream, (err, data) => {
            //showHTMLComplete ( zipBase64StreamUuid, zipBase64Stream, ( err, data: { mhtml: string, img: string, html: string, folder: [ { filename: string, data: string }]} ) => {
            if (err) {
                return self.showErrorMessageProcess();
            }
            _view.bodyBlue(false);
            let html = data.html;
            //      support HTMLComplete
            if (html) {
                html = html
                    .replace(/ srcset="[^"]+" /gi, ' ')
                    .replace(/ srcset='[^']+' /gi, ' ');
                let det = data.folder.shift();
                const getData = (filename, _data, CallBack) => {
                    const pointStart = html.indexOf(`${filename}`);
                    const doCallBack = () => {
                        det = data.folder.shift();
                        if (!det) {
                            return CallBack();
                        }
                        return getData(det.filename, det.data, CallBack);
                    };
                    if (pointStart > -1) {
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
                                    .replace(/\)/g, '\\)');
                                const regex = new RegExp(` src=("|')\.\/${_filename}("|')`, 'g');
                                const regex1 = new RegExp(` href=("|')\.\/${_filename}("|')`, 'g');
                                /*
                            if ( /^ src/i.test( hrefTest )) {
                                
                                const data1 = `data:${ mime };base64,` + _data
                                html = html.replace ( regex, data1 ).replace ( regex, data1 )
                                return doCallBack ()
                                
                            }
                            */
                                const blob = new Blob([
                                    /^image/.test(mime)
                                        ? Buffer.from(_data, 'base64')
                                        : Buffer.from(_data, 'base64').toString(),
                                ], { type: mime });
                                const link = (URL || webkitURL).createObjectURL(blob);
                                html = html
                                    .replace(regex, ` src="${link}"`)
                                    .replace(regex1, ` href="${link}"`);
                                this.urlBlobList.push(link);
                            }
                            doCallBack();
                        });
                    }
                    doCallBack();
                };
                return getData(det.filename, det.data, (err) => {
                    self.png(data.img);
                    const htmlBolb = new Blob([html], { type: 'text/html' });
                    const _url = (URL || webkitURL).createObjectURL(htmlBolb);
                    self.showLoading(false);
                    self.htmlIframe(_url);
                    self.urlBlobList.push(_url);
                });
            }
            html = mhtml2html.convert(data.mhtml);
            self.png(data.img);
            self.showLoading(false);
            self.mHtml(html);
        });
    }
    showErrorMessageProcess() {
        this.showLoading(false);
        this.showErrorMessage(true);
    }
    close() {
        this.showImgPage(false);
        this.showHtmlCodePage(false);
        this.png(null);
        this.htmlIframe(null);
        this.urlBlobList.forEach((n) => {
            ;
            (URL || webkitURL).revokeObjectURL(n);
        });
        this.exit();
    }
    imgClick() {
        this.showHtmlCodePage(false);
        this.showImgPage(true);
    }
    htmlClick() {
        this.showHtmlCodePage(true);
        this.showImgPage(false);
        const docu = this.mHtml();
        if (docu) {
            $('iframe')
                .contents()
                .find('head')
                .html(docu['window'].document.head.outerHTML);
            $('iframe')
                .contents()
                .find('body')
                .html(docu['window'].document.body.outerHTML);
        }
    }
}
