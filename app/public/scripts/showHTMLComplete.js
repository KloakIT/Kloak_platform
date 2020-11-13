window.URL = window.URL || window.webkitURL;
const getFilenameMime = (fileName, CallBack) => {
    const exc = fileName.split('.');
    if (exc.length < 2) {
        CallBack();
    }
    const exc1 = exc[exc.length - 1];
    const ret = $.cookie(`mime.${exc1}`);
    if (ret && ret.length) {
        return CallBack(null, ret);
    }
    return _view.connectInformationMessage.sockEmit('mime', fileName, (err, data) => {
        if (err) {
            return CallBack(err);
        }
        $.cookie(`mime.${exc1}`, data, { expires: 720, path: '/' });
        return CallBack(null, data);
    });
};
