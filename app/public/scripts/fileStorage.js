class fileStorage {
    constructor() {
        this.isMobile = null;
        this.checkedFiles = ko.observableArray([]);
        this.fileStorageData = ko.observableArray([]);
        this.allFileStorageData = ko.observableArray([]);
        this.usageQuota = ko.observable(null);
        this.suggestedTags = ko.observableArray([]);
        this.availableTags = [];
        this.sortOption = ko.observableArray([null, null]);
        this.showSearchInput = ko.observable(false);
        this.showSuggestions = ko.observable(true);
        this.showCameraOptions = ko.observable(false);
        this.showFileInfo = ko.observable(null);
        this.showEditFilename = ko.observable(false);
        this.showDownloads = ko.observable(false);
        this.selectedVideo = ko.observable('');
        this.searchKey = ko.observable();
        this.selectedFile = ko.observable(null);
        this.editFilenameInput = ko.observable("");
        this.addTagInput = ko.observable("");
        this.selectedInfoFile = ko.observable();
        this.isRecording = ko.observable(false);
        this.videoPlayer = ko.observable(null);
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
        this.formatUsageQuota = (usage, quota) => {
            let sizes = ['TB', 'GB', 'MB', 'KB', 'Bytes'];
            let n = this.formatBytes(usage);
            let m = this.formatBytes(quota);
            while (m.length > n.length) {
                let c = m.shift();
                m[0] = m[0] + (c * 1024);
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
            if (b > 1024) {
                kb = Math.floor(b / 1024);
                b = b % 1024;
            }
            if (kb > 1024) {
                mb = Math.floor(kb / 1024);
                kb = kb % 1024;
            }
            if (mb > 1024) {
                gb = Math.floor(mb / 1024);
                mb = mb % 1024;
            }
            if (gb > 1024) {
                tb = Math.floor(gb / 1024);
                gb = gb % 1024;
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
        this.getFileIndex = (uuid, callback) => {
            let req = window.indexedDB.open("kloak-index", 1);
            req.onsuccess = (e) => {
                const db = e.target['result'];
                db
                    .transaction("kloak-index", "readwrite")
                    .objectStore("kloak-index")
                    .delete(uuid).onsuccess = (e) => {
                    callback();
                };
            };
        };
        this.filterFromTag = (tag) => {
            this.searchKey(`#${tag}`);
            this.showSuggestions(false);
            this.fileStorageData(this.allFileStorageData().filter((file) => file['tag']().includes(tag)));
            return;
        };
        this.setTags = (fileStorageData) => {
            const temp = new Set();
            if (fileStorageData.length === 0) {
                this.availableTags = [];
                return;
            }
            fileStorageData.map(file => {
                file.tag().map(tag => {
                    if (tag) {
                        temp.add(tag.toLowerCase());
                    }
                });
            });
            this.availableTags = [...temp];
        };
        this.getHistory = () => {
            _view.storageHelper.decryptLoad('history', (err, data) => {
                if (err) {
                    return;
                }
                let histories = JSON.parse(Buffer.from(data).toString()).reverse();
                let temp = [];
                histories.forEach((history) => {
                    history['filename'] = ko.observable(history['filename']);
                    history['time_stamp'] = ko.observable(history['time_stamp']);
                    history['last_viewed'] = ko.observable(history['last_viewed']);
                    history['color'] = ko.observable(history['color']);
                    history['tag'] = ko.observableArray(history['tag']);
                    temp.push(history);
                });
                this.allFileStorageData(temp);
                this.fileStorageData(temp);
                this.setTags(this.allFileStorageData());
            });
        };
        this.searchSuggestionClick = (data, event) => {
            this.showSuggestions(false);
            const temp = this.allFileStorageData().filter((file) => file === data);
            this.fileStorageData(temp);
        };
        this.updateHistory = (uuid) => {
            const histories = this.allFileStorageData().filter((file) => file.uuid !== uuid);
            const temp = [];
            histories.map((history) => {
                const n = {};
                n['uuid'] = history['uuid'];
                n['filename'] = history['filename']();
                n['time_stamp'] = history['time_stamp']();
                n['last_viewed'] = history['last_viewed']();
                n['path'] = history['path'];
                n['url'] = history['url'];
                n['domain'] = history['domain'];
                n['tag'] = history['tag']();
                n['color'] = history['color']();
                n['size'] = history['size'] ? history['size'] : null;
                n['videoData'] = history['videoData'] || null;
                n['youtube'] = history['youtube'] || null;
                temp.push(n);
            });
            this.fileStorageData(histories);
            this.allFileStorageData(histories);
            _view.storageHelper.replaceHistory(temp, null);
            this.fileStorageData.valueHasMutated();
            this.selectedFile(null);
            this.detectStorageUsage();
        };
        this.deleteFile = (uuid, callback) => {
            if (!uuid.length) {
                return;
            }
            let pieces = null;
            let count = 0;
            const u = uuid.shift();
            _view.storageHelper.getIndex(u, (err, data) => {
                pieces = JSON.parse(Buffer.from(data).toString()).pieces;
                pieces.forEach(piece => {
                    _view.storageHelper.delete(piece, (err, data) => {
                        count++;
                        if (count === pieces.length) {
                            _view.storageHelper.delete(u, (err, data) => {
                                callback(err, data);
                            });
                        }
                    });
                });
                if (uuid.length) {
                    this.deleteFile(uuid, callback);
                }
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
            this.suggestedTags([]);
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
        this.replaceHistory = () => {
            const temp = this.allFileStorageData().map((history) => {
                const n = {};
                n['uuid'] = history['uuid'];
                n['filename'] = history['filename']();
                n['time_stamp'] = history['time_stamp']();
                n['last_viewed'] = history['last_viewed']();
                n['path'] = history['path'];
                n['url'] = history['url'];
                n['domain'] = history['domain'];
                n['tag'] = history['tag']();
                n['color'] = history['color']();
                n['size'] = history['size'] || null;
                n['videoData'] = history['videoData'] || null;
                n['youtube'] = history['youtube'] || null;
                return n;
            });
            console.log('REPLACE HISTORY', temp);
            _view.storageHelper.replaceHistory(temp.reverse(), (err, data) => {
            });
        };
        this.fileAction = (fileData, event, action) => {
            const updateLastViewed = () => {
                let currentTime = new Date();
                fileData.last_viewed(currentTime);
                const sorted = this.fileStorageData().sort((a, b) => {
                    return Date.parse(b['last_viewed']()) - Date.parse(a['last_viewed']());
                });
                this.fileStorageData(sorted);
                this.replaceHistory();
            };
            switch (action) {
                case 'close':
                    _view.displayMedia(null);
                    const videoPlayer = document.getElementById("videoPlayer");
                    URL.revokeObjectURL(videoPlayer['src']);
                    videoPlayer['src'] = null;
                    this.videoPlayer(null);
                    break;
                case 'editFilename':
                    if (this.editFilenameInput().trim() !== "") {
                        fileData['filename'](this.editFilenameInput());
                        this.replaceHistory();
                    }
                    this.editFilenameInput("");
                    this.showEditFilename(false);
                    break;
                case "delete":
                    this.closeAll();
                    const callback = () => {
                        this.updateHistory(fileData['uuid']);
                    };
                    this.deleteFile(fileData.uuid, callback);
                    break;
                case "download":
                    this.selectedFile(null);
                    return _view.storageHelper.createAssembler(fileData.uuid[0], (err, data) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        const url = _view.storageHelper.createBlob(data.buffer, data.contentType);
                        const filename = fileData.filename().split('.').pop().includes(data.extension) ? fileData.filename() : `${fileData.filename()}.${data.extension}`;
                        _view.storageHelper.downloadBlob(url, filename);
                        updateLastViewed();
                    });
                    break;
                case "play":
                    if (this.selectedVideo() === fileData['uuid'].filter(uuid => uuid !== null)[0]) {
                        this.selectedVideo(null);
                        console.log(this.videoPlayer);
                        this.videoPlayer().terminate();
                        return;
                    }
                    this.selectedVideo(fileData['uuid'].filter(uuid => uuid !== null)[0]);
                    this.videoPlayer(new VideoPlayer('fileStorageYoutubePlayer', () => { }, () => { }));
                    console.log(fileData);
                    if (fileData.tag().includes('recording')) {
                        return this.videoPlayer().recording(fileData);
                    }
                    if (fileData.youtube) {
                        return this.videoPlayer().downloadedYoutube(fileData);
                    }
                    if (fileData.videoData) {
                        return this.videoPlayer().uploadedVideo(fileData);
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
                    if (fileData.tag().includes('snapshot')) {
                        _view.showFileStorage(false);
                        new showWebPageClass(fileData.filename, fileData.uuid[0], null, () => {
                            _view.showFileStorage(true);
                        }, () => { });
                        updateLastViewed();
                        return;
                    }
                    return _view.storageHelper.createAssembler(fileData.uuid[0], (err, data) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        switch (true) {
                            case fileData.tag().includes('image'):
                                _view.displayMedia('image');
                                const imageViewer = document.getElementById('imageViewer');
                                imageViewer['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType);
                                break;
                            case fileData.tag().includes('pdf'):
                                _view.displayMedia('pdf');
                                const pdfViewer = document.getElementById('pdfViewer');
                                pdfViewer['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType);
                                break;
                        }
                        updateLastViewed();
                    });
                case 'deleteMultiple':
                    const uuid = this.checkedFiles.shift();
                    this.deleteFile(uuid, () => {
                        this.updateHistory(uuid);
                        if (this.checkedFiles().length > 0) {
                            this.fileAction(fileData, event, 'deleteMultiple');
                        }
                    });
                    break;
                case 'stopDownload':
                    if (confirm("Stop and remove download?")) {
                        this.getHistory();
                        _view.storageHelper.downloadPool()[fileData].instance['stop']();
                        _view.storageHelper.removeFromPool(_view.storageHelper.downloadPool, fileData);
                        this.fileAction({ uuid: fileData }, null, 'delete');
                    }
                    break;
                case 'addTag':
                    if (!this.addTagInput().trim()) {
                        return;
                    }
                    fileData['tag'].push(this.addTagInput().trim());
                    this.addTagInput("");
                    this.setTags(this.allFileStorageData());
                    this.replaceHistory();
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
            const AMPM = timestamp.getHours() > 12 ? "PM" : "AM";
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
                    });
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
            const fileDragOverlay = document.getElementById("fileDragOverlay");
            fileDragOverlay.style.visibility = "hidden";
            this.selectedFile(null);
            this.closeAll();
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
            this.selectedFile(null);
            const fileDragOverlay = document.getElementById("fileDragOverlay");
            fileDragOverlay.style.visibility = "initial";
        };
        this.dragleave = (e) => {
            const fileDragOverlay = document.getElementById("fileDragOverlay");
            fileDragOverlay.style.visibility = "hidden";
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
                hiddenInput.removeEventListener("change", fileHandler);
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
            val = val.trim().toLowerCase();
            if (val.length > 0) {
                if (val.startsWith('#')) {
                    val = val.slice(1);
                    if (!val) {
                        this.suggestedTags(this.availableTags);
                        return;
                    }
                    this.suggestedTags(this.availableTags.filter(tag => tag.includes(val)));
                    return;
                }
                else {
                    this.suggestedTags([]);
                    const temp = this.allFileStorageData().filter((file) => {
                        if (file['filename']) {
                            return file['filename']().toLowerCase().includes(val);
                        }
                        if (file['url']) {
                            return file['url'].toLowerCase().includes(val);
                        }
                        if (file['domain']) {
                            return file['domain'].toLowerCase().includes(val);
                        }
                        if (file['detail']) {
                            return file['domain'].toLowerCase().includes(val);
                        }
                        if (file['path']) {
                            return file['path'].toLowerCase().includes(val);
                        }
                    });
                    this.fileStorageData(temp);
                }
            }
            else {
                this.fileStorageData(this.allFileStorageData());
                this.suggestedTags([]);
            }
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
