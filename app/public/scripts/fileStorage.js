class fileStorage {
    constructor() {
        this.isMobile = null;
        this.checkedFiles = ko.observableArray([]);
        this.currentProcessFile = ko.observable("");
        this.currentPage = ko.observable(["files"]);
        this.allHistory = ko.observable({});
        this.allFiles = ko.observableArray([]);
        this.allPlaylists = ko.observableArray([]);
        this.favoriteFiles = ko.observableArray([]);
        this.displayedFiles = ko.observableArray([]);
        this.displayedPlaylists = ko.observableArray([]);
        this.playableFiles = ko.observableArray([]);
        this.showSublist = {
            favorites: ko.observable(true),
            files: ko.observable(true)
        };
        this.fileStorageData = ko.observableArray([]);
        this.allFileStorageData = ko.observableArray([]);
        this.usageQuota = ko.observable(null);
        this.searchSuggestions = ko.observableArray([]);
        this.availableTags = [];
        this.previewLoading = ko.observable(false);
        this.isDraggedOver = ko.observable(false);
        this.isRightPanelOpen = ko.observable(false);
        this.sortOption = ko.observableArray([null, null]);
        this.showSearchInput = ko.observable(false);
        this.showSuggestions = ko.observable(true);
        this.showEditTag = ko.observable(false);
        this.currentEditTags = ko.observable("");
        this.showCreatePlaylist = ko.observable(false);
        this.newPlaylistName = ko.observable("");
        this.selectedPlaylist = ko.observable(null);
        this.showCameraOptions = ko.observable(false);
        this.showFileInfo = ko.observable(null);
        this.showEditFilename = ko.observable(false);
        this.showDownloads = ko.observable(false);
        this.showCheckboxSelection = ko.observable(false);
        this.createPlaylistName = ko.observable("");
        this.editPlaylist = ko.observable("");
        this.currentPlaylistList = ko.observableArray([]);
        this.availablePlaylistFiles = ko.observableArray([]);
        this.selectedVideo = ko.observable('');
        this.searchKey = ko.observable();
        this.selectedFile = ko.observable(null);
        this.editFilenameInput = ko.observable("");
        this.addTagInput = ko.observable("");
        this.selectedInfoFile = ko.observable();
        this.isRecording = ko.observable(false);
        this.videoPlayer = ko.observable(null);
        this.playlistPlayer = ko.observable(null);
        this.recorder = ko.observable();
        this.videoPlaying = ko.observable(false);
        this.colorOptions = [
            ["maroon", "red", "olive", "yellow"],
            ["green", "lime", "teal", "aqua"],
            ["navy", "blue", "purple", "fuchsia"],
        ];
        this.capturePhoto = null;
        this.captureVideo = null;
        this.setupMobileActions = () => {
            this.capturePhoto = document.createElement("input");
            this.captureVideo = document.createElement("input");
            this.capturePhoto.accept = "image/*";
            this.captureVideo.accept = "video/*";
            this.capturePhoto.setAttribute("capture", "");
            this.captureVideo.setAttribute("capture", "");
            this.capturePhoto.type = "file";
            this.captureVideo.type = "file";
            const upload = (file, filename) => {
                const uuid = uuid_generate();
                file = new File([file], filename, { type: file.type, lastModified: file.lastModified });
                _view.storageHelper.createUploader(uuid, file, "", ['recording'], (err, data) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (data) {
                        this.getHistory();
                    }
                });
            };
            this.capturePhoto.addEventListener("change", e => {
                upload(e.target['files'][0], `Photo ${new Date().toLocaleString()}.jpeg`);
            });
            this.captureVideo.addEventListener("change", e => {
                upload(e.target['files'][0], `Video ${new Date().toLocaleString()}.mp4`);
            });
        };
        this.detectMobile = (a) => {
            return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((a.substr(0, 4))));
        };
        this.formatTime = (seconds) => {
            let date = new Date(null);
            let s = parseInt(seconds.toString(), 10);
            date.setSeconds(s);
            let time = date.toISOString().substr(11, 8).split(":");
            if (time[0] === '00') {
                return [time[1], time[2]].join(":");
            }
            else {
                return time.join(":");
            }
        };
        this.fileType = (filename) => {
            let ext = null;
            if (typeof filename === 'function') {
                ext = filename().split(".").pop();
            }
            else {
                ext = filename.split(".").pop();
            }
            switch (ext) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'tiff':
                case 'bmp':
                    return "image";
                case 'webm':
                case 'mkv':
                case 'flv':
                case 'avi':
                case 'mov':
                case 'mp4':
                case 'mpg':
                case 'mpeg':
                case '3gp':
                case 'wmv':
                case 'ogg':
                    return "video";
                case 'aac':
                case 'flac':
                case 'm4a':
                case 'mp3':
                case 'opus':
                case 'wma':
                case 'webm':
                case 'wav':
                    return "audio";
                case 'ppt':
                case 'pptx':
                    return "powerpoint";
                case 'xlsx':
                case 'xlsm':
                case 'xlsb':
                case 'xltx':
                case 'xls':
                    return "excel";
                case 'doc':
                case 'docx':
                    return "word";
                case 'pdf':
                    return "pdf";
                case 'tar':
                case 'gz':
                case '7z':
                case 's7z':
                case 'apk':
                case 'dmg':
                case 'jar':
                case 'zip':
                case 'zipx':
                case 'rar':
                    return "archive";
                default:
                    return "";
            }
        };
        this.getExtension = (filename) => {
            return filename.split('.').pop();
        };
        this.getPreview = (file, type) => {
            this.previewLoading(true);
            const uuid = file.uuid[0];
            const getFile = (uuid, callback) => {
                new Assembler(uuid, null, (err, data) => {
                    callback(_view.storageHelper.createBlob(data.buffer, data.contentType));
                });
            };
            switch (type) {
                case 'image':
                    getFile(uuid, url => {
                        const previewImage = document.getElementById("previewImage");
                        previewImage['src'] ? URL.revokeObjectURL(previewImage['src']) : null;
                        previewImage['src'] = url;
                        this.previewLoading(false);
                    });
                    break;
                case 'pdf':
                    getFile(uuid, url => {
                        const previewPdf = document.getElementById("previewPdf");
                        previewPdf['src'] ? URL.revokeObjectURL(previewPdf['src']) : null;
                        previewPdf['src'] = `${url}#toolbar=0`;
                        this.previewLoading(false);
                    });
                    break;
                case 'youtube':
                case 'media':
                    this.previewLoading(false);
                    const { data, mime } = type === 'youtube' ? file.youtube.thumbnail : file.media.thumbnail;
                    return `data:${mime};base64,${data}`;
                default:
                    break;
            }
        };
        this.backToMain = () => {
            this.closeAll();
            _view.showFileStorage(false);
            _view.showMainPage(true);
            _view.bodyBlue(true);
            _view.sectionLogin(true);
            _view.appScript(null);
        };
        this.detectStorageUsage = () => {
            _view.storageHelper.detectStorage((err, data) => {
                if (err) {
                    this.usageQuota(null);
                    return;
                }
                this.usageQuota(data);
            });
        };
        this.numberWithCommas = (x) => {
            return x.toString().replace(/.(?=(?:.{3})+$)/g, '$&,');
        };
        this.formatDetailSize = (size) => {
            let s = parseInt(size);
            const sizes = ['TB', 'GB', 'MB', 'KB', 'Bytes'].reverse();
            const formatted = this.formatBytes(s);
            return `${formatted.shift()} ${sizes[formatted.length]} ( ${this.numberWithCommas(size)} Bytes )`;
        };
        this.formatUsageQuota = (usage, quota) => {
            let sizes = ['TB', 'GB', 'MB', 'KB', 'Bytes'];
            let n = this.formatBytes(usage);
            let m = this.formatBytes(quota);
            while (m.length > n.length) {
                let c = m.shift();
                m[0] = m[0] + (c * 1000);
            }
            sizes = sizes.slice(-n.length);
            const usageText = n.map((size, index) => `${this.numberWithCommas(size)}`);
            const quotaText = m.map((size, index) => `${this.numberWithCommas(size)}`);
            console.log(usageText, quotaText);
            return `${usageText[0]}.${usageText[1].split('').shift()} ${sizes[0]} / ${quotaText[0]} ${sizes[0]}`;
        };
        this.formatBytes = (bytes) => {
            let b = null;
            let kb = null;
            let mb = null;
            let gb = null;
            let tb = null;
            b = bytes;
            if (b > 1000) {
                kb = Math.floor(b / 1000);
                b = b % 1000;
            }
            if (kb > 1000) {
                mb = Math.floor(kb / 1000);
                kb = kb % 1000;
            }
            if (mb > 1000) {
                gb = Math.floor(mb / 1000);
                mb = mb % 1000;
            }
            if (gb > 1000) {
                tb = Math.floor(gb / 1000);
                gb = gb % 1000;
            }
            const result = [tb, gb, mb, kb, b].map(size => {
                return size;
            });
            return result.filter(res => res !== null);
        };
        this.formatFilename = (fileData) => {
            if (typeof fileData === 'string') {
                return fileData.length <= 30 ? fileData : fileData.slice(0, 10) + '...' + fileData.slice(-10);
            }
            if (fileData.filename.length <= 30) {
                return fileData.filename;
            }
            return fileData.tag.includes('snapshot') ? fileData.filename.slice(0, 25) : fileData.filename.slice(0, 10) + '...' + fileData.filename.slice(-10);
        };
        this.progressBarColor = (percent) => {
            switch (true) {
                case (percent > 0 && percent <= 33):
                    return "#FFF59D";
                case (percent > 33 && percent <= 66):
                    return "#FFCC80";
                case (percent > 66):
                    return "#69F0AE";
                default:
                    break;
            }
        };
        this.filterFromTag = (tag) => {
            this.searchKey(`#${tag}`);
            this.showSuggestions(false);
            this.displayedFiles(this.allFiles().filter((file) => file['tags']().includes(tag)));
            return;
        };
        this.setTags = (files) => {
            const temp = new Set();
            if (files.length === 0) {
                this.availableTags = [];
                return;
            }
            files.map(file => {
                file.tags().map(tag => {
                    if (tag) {
                        temp.add(tag.toLowerCase());
                    }
                });
            });
            this.availableTags = [...temp];
        };
        this.getHistory = () => {
            _view.storageHelper.getHistory((err, data) => {
                console.log(data);
                if (data) {
                    this.allHistory(data);
                    let playlists = data['playlists'] ? data['playlists'].reverse() : [];
                    let files = data['files'] ? data['files'].reverse() : [];
                    let temp = [];
                    files.forEach((file) => {
                        file['filename'] = ko.observable(file['filename']);
                        file['time_stamp'] = ko.observable(file['time_stamp']);
                        file['last_viewed'] = ko.observable(file['last_viewed']);
                        file['color'] = ko.observable(file['color']);
                        file['tags'] = ko.observableArray(file['tags']);
                        file['favorite'] = ko.observable(file['favorite'] ? file['favorite'] : false);
                        temp.push(file);
                    });
                    playlists.forEach((playlist) => {
                        playlist['name'] = ko.observable(playlist['name']);
                        playlist['list'] = ko.observable(playlist['list'] || []);
                        playlist['thumbnails'] = ko.observableArray(playlist['thumbnails']);
                    });
                    this.allPlaylists(playlists);
                    this.allFiles(temp);
                    this.favoriteFiles(this.allFiles().filter((file) => file.favorite()));
                    this.displayedFiles(this.allFiles());
                    this.displayedPlaylists(this.allPlaylists());
                    this.setTags(this.allFiles());
                }
            });
        };
        this.searchSuggestionClick = (data, event) => {
            this.showSuggestions(false);
            const temp = this.allFileStorageData().filter((file) => file === data);
            this.fileStorageData(temp);
        };
        this.updateHistory = (uuid, action, silent) => {
            let files = this.allFiles();
            let playlists = this.allPlaylists();
            switch (action) {
                case 'delete':
                    if (!uuid) {
                        return;
                    }
                    this.allPlaylists().map((playlist) => playlist.list(playlist.list().filter(item => item !== uuid)));
                    files = this.allFiles().filter((file) => file.uuid[0] !== uuid);
                case 'update':
                    const temp = {
                        files: [],
                        playlists: []
                    };
                    files.map((file) => {
                        const n = {};
                        const keys = Object.keys(file);
                        keys.map(key => {
                            if (typeof file[key] === 'function') {
                                n[key] = file[key]();
                            }
                            else {
                                n[key] = file[key];
                            }
                        });
                        temp['files'].push(n);
                    });
                    playlists.map((playlist) => {
                        const n = {};
                        const keys = Object.keys(playlist);
                        keys.map(key => {
                            if (typeof playlist[key] === 'function') {
                                n[key] = playlist[key]();
                            }
                            else {
                                n[key] = playlist[key];
                            }
                        });
                        temp['playlists'].push(n);
                    });
                    temp.playlists.reverse();
                    temp.files.reverse();
                    _view.storageHelper.replaceHistory(temp, () => {
                        this.getHistory();
                    });
                    if (!silent) {
                        this.selectedFile(null);
                    }
                    this.detectStorageUsage();
                    break;
            }
        };
        this.deleteFile = (uuid, callback) => {
            let pieces = null;
            this.currentProcessFile(uuid);
            _view.storageHelper.getIndex(uuid, (err, index) => {
                pieces = index ? index.pieces : [];
                const del = () => {
                    const piece = pieces.shift();
                    if (piece) {
                        _view.storageHelper.delete(piece, (err, data) => {
                            if (pieces.length) {
                                return del();
                            }
                            console.log("SHOULD DELETE INDEX");
                            _view.storageHelper.delete(uuid, (err, data) => {
                                this.updateHistory(uuid, "delete");
                                this.currentProcessFile("");
                                callback ? callback(true) : null;
                            });
                        });
                    }
                    else {
                        _view.storageHelper.delete(uuid, (err, data) => {
                            this.updateHistory(uuid, "delete");
                            this.currentProcessFile("");
                            callback ? callback(true) : null;
                        });
                    }
                };
                del();
            });
        };
        this.sortHistory = (type, direction) => {
            let temp = null;
            const nameCompare = (a, b) => {
                const stringA = a[type]().toUpperCase();
                const stringB = b[type]().toUpperCase();
                if (stringA > stringB) {
                    return 1;
                }
                else if (stringA < stringB) {
                    return -1;
                }
            };
            const dateCompare = (a, b) => {
                if (direction === 'up') {
                    return Date.parse(a[type]()) - Date.parse(b[type]());
                }
                return Date.parse(b[type]()) - Date.parse(a[type]());
            };
            if (type === 'filename') {
                temp = this.fileStorageData().sort(nameCompare);
                if (direction === 'up') {
                    temp = temp.reverse();
                }
                this.fileStorageData(temp);
                return;
            }
            temp = this.fileStorageData().sort(dateCompare);
            this.fileStorageData(temp);
            return;
        };
        this.sortHandler = (type) => {
            let current = this.sortOption()[0];
            let sort = this.sortOption()[1];
            if (current == type) {
                sort == 'up' ? this.sortOption([current, 'down']) : this.sortOption([current, 'up']);
            }
            else {
                this.sortOption([type, 'up']);
            }
            this.sortHistory(this.sortOption()[0], this.sortOption()[1]);
        };
        this.closeAll = () => {
            this.editFilenameInput("");
            this.showEditFilename(false);
            this.showFileInfo(null);
            this.showCameraOptions(false);
            // this.suggestedTags([])
            this.showSuggestions(false);
            this.searchKey();
            this.showSearchInput(false);
            this.selectedFile(null);
            this.selectedInfoFile(null);
            this.showFileOptions(null);
            this.selectedVideo(null);
            if (this.videoPlayer()) {
                this.videoPlayer().terminate();
                this.videoPlayer(null);
            }
            return;
        };
        this.toggleSelection = () => {
            if (this.showCheckboxSelection()) {
                this.showCheckboxSelection(false);
                this.checkedFiles([]);
                return;
            }
            this.showCheckboxSelection(true);
        };
        // createPlaylist = () => {
        // 	const playlistHistory: fileHistory = {
        // 		uuid: [uuid_generate()],
        // 		filename: this.createPlaylistName(),
        // 		time_stamp: new Date(),
        // 		playlist: {
        // 			list: []
        // 		}
        // 	}
        // 	this.allFileStorageData.push(playlistHistory)
        // 	this.replaceHistory(() => {
        // 		this.getHistory()
        // 		this.showCreatePlaylist(false)
        // 		this.createPlaylistName("")
        // 	})
        // }
        this.retrieveFromAllFileHistory = (uuid, type) => {
            for (let i = 0; i < this.allHistory()['files'].length; i++) {
                if (this.allHistory()['files'][i].uuid.includes(uuid)) {
                    return this.allHistory()['files'][i][type];
                }
            }
        };
        this.uncheckFile = (uuid) => {
            return this.checkedFiles(this.checkedFiles().filter(checkedUuid => checkedUuid !== uuid));
        };
        this.actionHandler = (currentFile, event, action) => {
            const updateLastViewed = () => {
                let currentTime = new Date();
                currentFile.last_viewed(currentTime);
                const sorted = this.allFiles().sort((a, b) => {
                    return Date.parse(b['last_viewed']()) - Date.parse(a['last_viewed']());
                });
                this.allFiles(sorted);
                this.updateHistory(null, 'update');
            };
            switch (action) {
                case 'close':
                    _view.displayMedia(null);
                    const videoPlayer = document.getElementById("videoPlayer");
                    URL.revokeObjectURL(videoPlayer['src']);
                    videoPlayer['src'] = null;
                    this.videoPlayer(null);
                    break;
                case 'favorite':
                    const idx = this.favoriteFiles().indexOf(currentFile);
                    currentFile.favorite(!currentFile.favorite());
                    this.updateHistory(null, 'update', true);
                    if (idx >= 0) {
                        this.favoriteFiles.splice(idx, 1);
                    }
                    else {
                        this.favoriteFiles([...this.favoriteFiles(), currentFile]);
                    }
                    break;
                case 'selectFile':
                    if (this.selectedFile() === currentFile) {
                        return;
                    }
                    this.videoPlayer(null);
                    this.selectedFile(currentFile);
                    this.selectedPlaylist(null);
                    this.isRightPanelOpen(true);
                    this.showEditTag(false);
                    this.currentEditTags('');
                    break;
                case 'checked':
                    if (this.checkedFiles().includes(currentFile['uuid'][0])) {
                        this.checkedFiles(this.checkedFiles().filter(uuid => uuid !== currentFile['uuid'][0]));
                    }
                    else {
                        this.checkedFiles.push(currentFile['uuid'][0]);
                    }
                    this.checkedFiles.valueHasMutated();
                    console.log(this.checkedFiles());
                    break;
                case 'selectAll':
                    if (this.checkedFiles().length === this.allFiles().length) {
                        return this.checkedFiles([]);
                    }
                    this.checkedFiles(this.allFiles().map(file => file.uuid[0]));
                    break;
                case 'editFilename':
                    if (this.editFilenameInput().trim() !== "") {
                        currentFile['filename'](this.editFilenameInput());
                        this.updateHistory(null, 'update');
                    }
                    this.editFilenameInput("");
                    this.showEditFilename(false);
                    break;
                case "delete":
                    // this.closeAll()
                    this.selectedFile(null);
                    this.deleteFile(currentFile.uuid[0]);
                    break;
                case "downloadAll":
                    const download = (files, callback) => {
                        if (files.length) {
                            const uuid = files.shift();
                            this.uncheckFile(uuid);
                            new Assembler(uuid, null, (err, data) => {
                                if (data) {
                                    callback(null, data, false);
                                    download(files, callback);
                                }
                            });
                        }
                        else {
                            callback(null, null, true);
                        }
                    };
                    if (this.checkedFiles().length === 1) {
                        return download(this.checkedFiles(), (err, data, finish) => {
                            if (data) {
                                const url = _view.storageHelper.createBlob(data.buffer, data.filename);
                                _view.storageHelper.downloadBlob(url, data.filename);
                            }
                        });
                    }
                    if (window.confirm(`Confirm the download of ${this.checkedFiles().length} files?`)) {
                        const zip = new JSZip();
                        download(this.checkedFiles(), (err, data, finish) => {
                            if (data) {
                                zip.file(data.filename, data.buffer);
                            }
                            if (finish) {
                                zip.generateAsync({ type: 'arraybuffer' }).then(arrbuffer => {
                                    const url = _view.storageHelper.createBlob(arrbuffer, 'application/zip');
                                    _view.storageHelper.downloadBlob(url, `download_${new Date().toLocaleString()}.zip`);
                                    this.showCheckboxSelection(false);
                                });
                            }
                        });
                    }
                    break;
                case "deleteAll":
                    console.log("delete");
                    const del = () => {
                        if (!this.checkedFiles().length) {
                            this.showCheckboxSelection(false);
                            return;
                        }
                        const uuid = this.checkedFiles().shift();
                        this.deleteFile(uuid, done => {
                            if (done) {
                                this.uncheckFile(uuid);
                                return del();
                            }
                        });
                    };
                    if (window.confirm(`Are you sure you want to delete ${this.checkedFiles().length} file(s)?`)) {
                        del();
                    }
                    break;
                case 'updateTags':
                    const tags = this.currentEditTags().split(',');
                    this.showEditTag(false);
                    this.currentEditTags("");
                    currentFile.tags(tags);
                    this.setTags(this.allFiles());
                    this.updateHistory(null, 'update', true);
                    break;
                case 'deletePlaylist':
                    if (this.selectedPlaylist().uuid === this.playlistPlayer().currentPlaylist.uuid) {
                        this.playlistPlayer().terminate();
                        this.playlistPlayer(null);
                    }
                    if (this.selectedPlaylist().uuid === currentFile['uuid']) {
                        this.selectedPlaylist(null);
                    }
                    this.allPlaylists(this.allPlaylists().filter((playlist) => playlist['uuid'] !== currentFile['uuid']));
                    this.updateHistory(null, 'update');
                    break;
                case 'createPlaylist':
                    const newPlaylist = {
                        uuid: uuid_generate(),
                        name: this.newPlaylistName(),
                        date_created: new Date(),
                        list: [],
                        thumbnails: []
                    };
                    const temp = this.allPlaylists().reverse();
                    temp.push(newPlaylist);
                    this.updateHistory(null, "update");
                    this.showCreatePlaylist(false);
                    this.newPlaylistName("");
                    break;
                case 'savePlaylist':
                    const thumbnails = [];
                    for (let i = 0; i < this.checkedFiles().length; i++) {
                        if (thumbnails.length === 4) {
                            return;
                        }
                        const u = this.retrieveFromAllFileHistory(this.checkedFiles()[i], 'media');
                        if (u['thumbnail'] && u['thumbnail'].data && u['thumbnail'].mime) {
                            thumbnails.push(u['thumbnail']);
                        }
                    }
                    this.selectedPlaylist().thumbnails(thumbnails);
                    this.selectedPlaylist().list(this.checkedFiles());
                    this.updateHistory(null, "update");
                    this.currentPage(['playlists']);
                    break;
                case 'editPlaylist':
                    if (this.currentPage().length === 1) {
                        this.currentPage([...this.currentPage(), 'edit']);
                    }
                    else {
                        this.actionHandler(null, null, 'savePlaylist');
                    }
                    break;
                case 'playPlaylist':
                    if (!this.selectedPlaylist().list().length || (this.playlistPlayer() && this.playlistPlayer().currentPlaylist.playlistName === this.selectedPlaylist().name())) {
                        return;
                    }
                    this.videoPlayer(null);
                    this.playlistPlayer(new VideoPlayer('', () => { }, () => { }));
                    this.playlistPlayer().playlistPlayer(this.selectedPlaylist().uuid, this.selectedPlaylist().name(), this.selectedPlaylist().list(), this.selectedPlaylist().thumbnails());
                    break;
                case 'shufflePlaylist':
                    if (this.playlistPlayer() && this.playlistPlayer().currentPlaylist.playlistName === this.selectedPlaylist().name()) {
                        return this.playlistPlayer().currentPlaylist.mode('shuffle');
                    }
                    this.videoPlayer(null);
                    this.playlistPlayer(new VideoPlayer('', () => { }, () => { }));
                    this.playlistPlayer().playlistPlayer(this.selectedPlaylist().uuid, this.selectedPlaylist().name(), this.selectedPlaylist().list(), this.selectedPlaylist().thumbnails(), "shuffle");
                    break;
                case "download":
                    return _view.storageHelper.createAssembler(currentFile.uuid[0], (err, data) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        const url = _view.storageHelper.createBlob(data.buffer, data.contentType);
                        const filename = currentFile.filename().split('.').pop().includes(data.extension) ? currentFile.filename() : `${currentFile.filename()}.${data.extension}`;
                        _view.storageHelper.downloadBlob(url, filename);
                        updateLastViewed();
                    });
                case "playVideo":
                    this.videoPlayer(null);
                    this.playlistPlayer(null);
                    if (this.selectedVideo() === currentFile['uuid'].filter(uuid => uuid !== null)[0]) {
                        this.selectedVideo(null);
                        console.log(this.videoPlayer);
                        this.videoPlayer().terminate();
                        return;
                    }
                    this.selectedVideo(currentFile['uuid'].filter(uuid => uuid !== null)[0]);
                    this.videoPlayer(new VideoPlayer('', () => { }, () => { }));
                    console.log(currentFile);
                    if (currentFile.tags().includes('recording')) {
                        return this.videoPlayer().recording(currentFile);
                    }
                    if (currentFile.youtube) {
                        return this.videoPlayer().downloadedYoutube(currentFile);
                    }
                    if (currentFile.media) {
                        return this.videoPlayer().uploadedVideo(currentFile);
                    }
                    // this.mediaViewer = new MediaViewer({player: document.getElementById(fileData['uuid'].filter(uuid => uuid !== null)[0]), fullBar: document.getElementById("fullBar"), bufferBar: document.getElementById('bufferedBar'), currentTimeBar: document.getElementById("currentTimeBar"), playButton: document.getElementById("videoPlayButton"), stopButton: document.getElementById("videoStopButton"), fullscreenButton: document.getElementById("videoFullScreenButton"), durationText: document.getElementById("durationText")}, (err, canPlay, playing) => {
                    // 	if (err) {
                    // 		return console.log(err)
                    // 	}
                    // 	this.videoPlaying(playing)
                    // }, () => {})
                    // if (fileData.youtube) {
                    // 	if (fileData.uuid.length > 1) {
                    // 		this.mediaViewer.downloadedYoutube(fileData.uuid, fileData['youtube'].mimeType, fileData['youtube'].duration, fileData['youtube']['thumbnail'])
                    // 	} else {
                    // 		this.mediaViewer.streamedYoutube(fileData.uuid[0], fileData['youtube'].mimeType, fileData['youtube'].duration, fileData.size, fileData['youtube'].id)
                    // 	}
                    // } else {
                    // 	this.mediaViewer.uploadedVideo(fileData.uuid, fileData['videoData'].mimeType, fileData['videoData'].duration, fileData['videoData'].fastStart)
                    // }
                    updateLastViewed();
                // const type = fileData.tag().filter(tag => tag === 'webm' || tag === 'mp4' || tag === 'mp3')
                // const isRecording = fileData.tag().includes('recording')
                // _view.displayMedia('player')
                // this.mediaViewer = new MediaViewer('video', fileData.filename, document.getElementById("videoPlayer"), () => {
                // })
                // isRecording ? this.mediaViewer.recording(fileData.uuid[0]) : this.mediaViewer.downloaded(fileData.uuid[0])
                case 'youtube':
                    // _view.displayMedia('player')
                    // this.mediaViewer = new MediaViewer('youtube', fileData.filename, document.getElementById("videoPlayer"), () => {})
                    // this.mediaViewer.youtube()
                    // updateLastViewed()
                    break;
                case 'view':
                    if (currentFile.tag().includes('snapshot')) {
                        _view.showFileStorage(false);
                        new showWebPageClass(currentFile.filename, currentFile.uuid[0], null, () => {
                            _view.showFileStorage(true);
                        }, () => { });
                        updateLastViewed();
                        return;
                    }
                    return _view.storageHelper.createAssembler(currentFile.uuid[0], (err, data) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        switch (true) {
                            case currentFile.tag().includes('image'):
                                _view.displayMedia('image');
                                const imageViewer = document.getElementById('imageViewer');
                                imageViewer['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType);
                                break;
                            case currentFile.tag().includes('pdf'):
                                _view.displayMedia('pdf');
                                const pdfViewer = document.getElementById('pdfViewer');
                                pdfViewer['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType);
                                break;
                        }
                        updateLastViewed();
                    });
                case 'stopDownload':
                    if (confirm("Stop and remove download?")) {
                        this.getHistory();
                        _view.storageHelper.downloadPool()[currentFile].instance['stop']();
                        _view.storageHelper.removeFromPool(_view.storageHelper.downloadPool, currentFile);
                        this.actionHandler({ uuid: currentFile }, null, 'delete');
                    }
                    break;
                default:
                    break;
            }
        };
        this.getDate = (timestamp, type) => {
            if (!timestamp) {
                return;
            }
            if (typeof timestamp === 'string') {
                timestamp = new Date(timestamp);
            }
            const month = timestamp.getMonth();
            const monthString = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sept",
                "Oct",
                "Nov",
                "Dec",
            ];
            const hours = timestamp.getHours() > 12
                ? timestamp.getHours() - 12
                : timestamp.getHours();
            const minutes = timestamp.getMinutes() < 10
                ? `0${timestamp.getMinutes()}`
                : timestamp.getMinutes();
            const AMPM = timestamp.getHours() >= 12 ? "PM" : "AM";
            switch (type) {
                case "date":
                    return `${monthString[month]} ${timestamp.getDate()}, ${timestamp.getFullYear()}`;
                case "full":
                    return `${monthString[month]} ${timestamp.getDate()}, ${timestamp.getFullYear()} ${hours}:${minutes} ${AMPM}`;
                default:
                    break;
            }
        };
        this.checkedFile = (data, event, checkAll) => {
            const isChecked = event.target.checked;
            if (checkAll) {
                this.checkedFiles([]);
                if (!isChecked) {
                    return true;
                }
                const temp = [];
                this.allFileStorageData().forEach(file => {
                    temp.push(file.uuid);
                });
                this.checkedFiles(temp);
                return true;
            }
            if (!isChecked) {
                this.checkedFiles(this.checkedFiles().filter(uuid => uuid !== data.uuid));
                return true;
            }
            this.checkedFiles().push(data.uuid);
            this.checkedFiles.valueHasMutated();
            return true;
        };
        this.showFileOptions = (index) => {
            if (index === this.selectedFile()) {
                this.selectedFile(null);
                return;
            }
            this.selectedFile(index);
        };
        // changeColor = (data, event) => {
        // 	const clr = data
        // 	const idx = parseInt(this.colorMenuSelection().split(" ")[1])
        // 	const t = this.fileStorageData()
        // 	t[idx].color = clr
        // 	this.fileStorageData(t)
        // 	this.saveHistoryTable()
        // 	const fileIcon = document.getElementById("icon " + idx)
        // 	fileIcon.style.color = clr
        // 	const colorOptions = document.getElementsByClassName("colorMenuItem")
        // 	for (let i = 0; i < colorOptions.length; i++) {
        // 		if (colorOptions[i].id === clr) {
        // 			colorOptions[i]['style'].border = "3px solid black"
        // 		} else {
        // colorOptions[i]['style'].border = "3px solid transparent"
        // 		}
        // 	}
        // 	const val = event.target.value.split(" ")
        // 	const index = parseInt(val[0])
        // 	const color = val[1]
        // 	const temp = this.fileStorageData()
        // 	temp[index].color = color
        // 	this.fileStorageData(temp)
        // 	this.saveHistoryTable()
        // 	const icon = document.getElementById("icon" + index)
        // 	icon.style.color = color
        // }
        // hideColorOptions = (data, event) => {
        // 	if (event.stopPropagation) {
        // 		event.stopPropagation()
        // 	}
        // 	const colorMenu = document.getElementById("colorMenu")
        // 	colorMenu.style.transform = "scale(0)"
        // 	this.colorMenuSelection(null)
        // }
        // showColorOptions = (data, event) => {
        // 	if (event.stopPropagation) {
        // 		event.stopPropagation()
        // 	}
        // 	const iconIndex = event.target.id.split(" ")[1]
        // 	console.log(iconIndex)
        // 	const { pageX, pageY } = event
        // 	colorMenu.style.left = `${pageX}px`
        // 	colorMenu.style.top = `${pageY + 8}px`
        // 	if (this.colorMenuSelection() === event.target.id) {
        // 		colorMenu.style.transform = "scale(0)"
        // 		this.colorMenuSelection(null)
        // 	} else {
        // 		this.colorMenuSelection(event.target.id)
        // 		colorMenu.style.transform = "scale(1)"
        // 	}
        // 	const color = this.fileStorageData()[iconIndex].color
        // 	const colorOptions = document.getElementsByClassName("colorMenuItem")
        // 	for (let i = 0; i < colorOptions.length; i++) {
        // 		if (colorOptions[i].id === color) {
        // 			colorOptions[i].style.border = "3px solid black"
        // 		} else {
        // 			colorOptions[i].style.border = "3px solid transparent"
        // 		}
        // 	}
        // 	// colorOption.style.border = '2px solid black'
        // }
        this.traverseFileTree = (item, path = "") => {
            if (item.isFile) {
                item.file((file) => {
                    const uuid = uuid_generate();
                    console.log(uuid);
                    _view.storageHelper.createUploader(uuid, file, path, [], (err, data) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        let c = 0;
                        if (c === 0) {
                            console.log("getting history!");
                            this.getHistory();
                            c++;
                        }
                        this.detectStorageUsage();
                        if (data === uuid) {
                            console.log("getting history!");
                            this.getHistory();
                        }
                    }, false);
                });
            }
            else if (item.isDirectory) {
                const dirReader = item.createReader();
                dirReader.readEntries((entries) => {
                    for (let i = 0; i < entries.length; i++) {
                        this.traverseFileTree(entries[i], path + item.name + "/");
                    }
                });
            }
        };
        this.ondrop = (e, data) => {
            this.isDraggedOver(false);
            const items = e.originalEvent.dataTransfer.items;
            const length = e.originalEvent.dataTransfer.items.length;
            for (let i = 0; i < length; i++) {
                const item = items[i].webkitGetAsEntry();
                if (item) {
                    this.traverseFileTree(item);
                }
            }
        };
        this.dragover = (e) => {
            e.preventDefault();
            this.isDraggedOver(true);
        };
        this.dragleave = (e) => {
            this.isDraggedOver(false);
        };
        this.uploadFileClick = (e) => {
            const hiddenInput = document.getElementById("hiddenInput");
            const fileHandler = (e) => {
                const files = e.target.files;
                _view.storageHelper.createUploader(uuid_generate(), files[0], "", [], (err, data) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    let c = 0;
                    if (c === 0) {
                        this.getHistory();
                        c++;
                    }
                    this.detectStorageUsage();
                });
            };
            hiddenInput.addEventListener("change", fileHandler);
            hiddenInput.click();
        };
        this.openRecorder = e => {
            if (this.isMobile) {
                this.showCameraOptions(true);
                return;
            }
            if (this.recorder()) {
                this.recorder().close();
                this.isRecording(false);
                return;
            }
            this.recorder(new Recorder((err, uuid) => {
                if (uuid) {
                    this.getHistory();
                }
            }, () => {
                this.recorder(null);
            }));
        };
        this.takePicture = e => {
            if (this.recorder()) {
                this.recorder().takePicture();
            }
        };
        this.recordVideo = e => {
            this.isRecording(!this.isRecording());
            this.isRecording() ? this.recorder().start() : this.recorder().stop();
        };
        this.mobileCameraActions = (action) => {
            switch (action) {
                case 'photo':
                    this.capturePhoto.click();
                    this.closeAll();
                    console.log(this.capturePhoto);
                    break;
                case 'video':
                    this.captureVideo.click();
                    this.closeAll();
                    break;
                default:
                    break;
            }
        };
        this.mobileShowInformation = () => {
            this.showFileInfo(this.fileStorageData()[this.selectedFile()]);
            this.selectedFile(null);
        };
        this.closeVideo = (e) => { };
        this.isMobile = this.detectMobile(navigator.userAgent || navigator.vendor || window['opera']);
        console.log(this.isMobile);
        this.setupMobileActions();
        this.detectStorageUsage();
        this.getHistory();
        _view.storageHelper.downloadPool.subscribe(val => {
            this.getHistory();
        });
        this.searchKey.subscribe((val) => {
            console.log(val);
            val = val.trim().toLowerCase();
            if (val.length > 0) {
                switch (this.currentPage()[0]) {
                    case 'files':
                        console.log("files");
                        if (val.startsWith('#')) {
                            val = val.slice(1);
                            if (!val) {
                                this.searchSuggestions(this.availableTags);
                                return;
                            }
                            this.searchSuggestions(this.availableTags.filter(tag => tag.includes(val)));
                        }
                        else {
                            this.searchSuggestions([]);
                            const temp = this.allFiles().filter((file) => {
                                return file['filename']().toLowerCase().includes(val);
                            });
                            this.displayedFiles(temp);
                        }
                        break;
                    case 'playlists':
                        break;
                    case 'downloads':
                        break;
                }
            }
            else {
                this.displayedFiles(this.allFiles());
                this.searchSuggestions([]);
            }
        });
        this.createPlaylistName.subscribe(val => {
            const btn = document.getElementById("createPlaylistConfirm");
            if (val.length >= 5) {
                return btn['disabled'] = false;
            }
            return btn ? btn['disabled'] = true : null;
        });
        this.currentPage.subscribe(pages => {
            if (pages[0] !== 'files') {
                this.showCheckboxSelection(false);
            }
            if (pages.length === 1) {
                return;
            }
            if (pages[0] === 'playlists' && pages[1] === 'edit') {
                const playable = ['mp3', 'webm'];
                const temp = this.allFiles().filter((file) => playable.includes(this.getExtension(file.filename())));
                this.playableFiles(temp);
            }
            this.checkedFiles([...this.selectedPlaylist().list()]);
        });
        // this.showSearchInput.subscribe(visible => {
        // 	const input = document.getElementById('searchInput')
        // 	if (visible) {
        // 		input.focus()
        // 		return
        // 	}
        // 	input['value'] = ""
        // 	this.suggestedTags([])
        // 	return
        // })
    }
}
