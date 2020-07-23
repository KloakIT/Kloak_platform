class fileStorage {
    constructor() {
        this.checkedFiles = ko.observableArray([]);
        this.fileStorageData = ko.observableArray([]);
        this.allFileStorageData = ko.observableArray([]);
        this.suggestedTags = ko.observableArray([]);
        this.availableTags = [];
        this.sortOption = ko.observableArray([null, null]);
        this.currentUploads = ko.observableArray([]);
        this.showSearchInput = ko.observable(false);
        this.showSuggestions = ko.observable(true);
        this.showOverlay = ko.observable(false);
        this.searchKey = ko.observable();
        this.selectedFile = ko.observable();
        this.colorMenuSelection = ko.observable();
        this.assemblyQueue = ko.observableArray([]);
        this.assemblyRunning = false;
        this.mobileShowSearch = ko.observable(false);
        this.colorOptions = [
            ["maroon", "red", "olive", "yellow"],
            ["green", "lime", "teal", "aqua"],
            ["navy", "blue", "purple", "fuchsia"],
        ];
        this.init = () => {
            this.getHistoryTable();
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
        this.setTags = (fileStorageData) => {
            const temp = new Set();
            fileStorageData.map(file => {
                file.tag.map(tag => {
                    console.log(tag);
                    temp.add(tag.toLowerCase());
                });
            });
            this.availableTags = [...temp];
        };
        this.getHistoryTable = () => {
            const fs = this.db.transaction("history", "readonly").objectStore("history");
            fs.get(0).onsuccess = (e) => {
                if (e.target['result']) {
                    const temp = e.target['result'].sort((a, b) => {
                        return b.time_stamp.getTime() - a.time_stamp.getTime();
                    });
                    this.fileStorageData(temp);
                    this.allFileStorageData(temp);
                    this.setTags(temp);
                    this.fileStorageData.valueHasMutated();
                }
            };
        };
        this.fileTagClick = (tag) => {
            this.searchKey(tag);
        };
        this.searchSuggestionClick = (data, event) => {
            this.showSuggestions(false);
            const temp = this.allFileStorageData().filter((file) => file === data);
            this.fileStorageData(temp);
        };
        this.saveHistoryTable = (shouldGet = false) => {
            const fs = this.db
                .transaction("history", "readwrite")
                .objectStore("history");
            console.log(fs);
            fs.put(this.allFileStorageData(), 0).onsuccess = (e) => {
                if (shouldGet) {
                    this.getHistoryTable();
                }
            };
        };
        this.updateHistory = (uuid) => {
            const temp = this.allFileStorageData().filter((file) => file.uuid !== uuid);
            this.fileStorageData(temp);
            this.allFileStorageData(temp);
            this.fileStorageData.valueHasMutated();
            this.saveHistoryTable();
            this.selectedFile(null);
        };
        this.deleteFile = (uuid, callback) => {
            const deleteIndex = (uuid) => {
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
            const removePieces = (uuids, callback) => {
                let req = window.indexedDB.open("kloak-files", 1);
                req.onsuccess = (e) => {
                    const db = e.target['result'];
                    const fs = db
                        .transaction("kloak-files", "readwrite")
                        .objectStore("kloak-files");
                    while (uuids.length > 0) {
                        fs.delete(uuids.shift()).onsuccess = (e) => {
                            console.log("DELETED PIECE!");
                        };
                    }
                    callback();
                };
            };
            let req = window.indexedDB.open("kloak-index", 1);
            req.onsuccess = (e) => {
                const db = e.target['result'];
                db
                    .transaction("kloak-index", "readwrite")
                    .objectStore("kloak-index")
                    .get(uuid).onsuccess = (e) => {
                    const pieces = e.target.result[uuid].pieces;
                    const uuids = Object.values(pieces);
                    removePieces(uuids, () => {
                        deleteIndex(uuid);
                        callback();
                    });
                };
            };
        };
        this.sortHistory = (type, direction) => {
            console.log(type, direction);
            let temp = null;
            const nameCompare = (a, b) => {
                const stringA = a[type].toUpperCase();
                const stringB = b[type].toUpperCase();
                if (stringA > stringB) {
                    return 1;
                }
                else if (stringA < stringB) {
                    return -1;
                }
            };
            const dateCompare = (a, b) => {
                if (direction === 'up') {
                    return a[type] - b[type];
                }
                return b[type] - a[type];
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
        this.deleteMultiple = () => {
            this.checkedFiles().forEach(uuid => {
                this.deleteFile(uuid, () => {
                    this.updateHistory(uuid);
                    const temp = this.checkedFiles().filter(uuid => uuid !== uuid);
                    this.checkedFiles(temp);
                    this.checkedFiles.valueHasMutated();
                });
            });
            this.getHistoryTable();
        };
        this.closeAll = () => {
            this.suggestedTags([]);
            this.showSuggestions(false);
            this.searchKey();
            this.showSearchInput(false);
            this.selectedFile(null);
            this.showFileOptions(null);
            return;
        };
        this.fileAction = (data, event, action) => {
            switch (action) {
                case 'close':
                    const videoPlayer = document.getElementById('fileStorageVideo');
                    const assembler = videoPlayer['assembler'];
                    URL.revokeObjectURL(videoPlayer['src']);
                    videoPlayer['src'] = null;
                    this.showOverlay(false);
                    assembler.terminate();
                    break;
                case "delete":
                    const callback = () => {
                        const temp = this.allFileStorageData().filter((file) => file !== data);
                        this.fileStorageData(temp);
                        this.allFileStorageData(temp);
                        this.fileStorageData.valueHasMutated();
                        this.saveHistoryTable();
                        this.selectedFile(null);
                    };
                    this.deleteFile(data.uuid, callback);
                    break;
                case "download":
                    this.assemblyQueue.push(data.uuid);
                    this.assemblyQueue.valueHasMutated();
                    if (!this.assemblyRunning) {
                        this.assemblyRunning = true;
                        new Assembler(data.uuid, document.getElementById("hiddenAnchor"), (err, data) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            this.assemblyRunning = false;
                        });
                    }
                    break;
                case "play":
                    const n = new Assembler(data.uuid, null, (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        this.showOverlay(true);
                        const videoPlayer = document.getElementById("fileStorageVideo");
                        videoPlayer['assembler'] = n;
                        videoPlayer['src'] = data.url;
                        videoPlayer['play']();
                    });
                    break;
                default:
                    break;
            }
        };
        this.getDate = (timestamp, type) => {
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
            console.log(this.checkedFiles());
            return true;
        };
        this.showFileOptions = (index) => {
            if (index === this.selectedFile()) {
                this.selectedFile(null);
                return;
            }
            this.selectedFile(index);
        };
        this.changeColor = (data, event) => {
            const clr = data;
            const idx = parseInt(this.colorMenuSelection().split(" ")[1]);
            const t = this.fileStorageData();
            t[idx].color = clr;
            this.fileStorageData(t);
            this.saveHistoryTable();
            const fileIcon = document.getElementById("icon " + idx);
            fileIcon.style.color = clr;
            const colorOptions = document.getElementsByClassName("colorMenuItem");
            for (let i = 0; i < colorOptions.length; i++) {
                if (colorOptions[i].id === clr) {
                    colorOptions[i]['style'].border = "3px solid black";
                }
                else {
                    colorOptions[i]['style'].border = "3px solid transparent";
                }
            }
            const val = event.target.value.split(" ");
            const index = parseInt(val[0]);
            const color = val[1];
            const temp = this.fileStorageData();
            temp[index].color = color;
            this.fileStorageData(temp);
            this.saveHistoryTable();
            const icon = document.getElementById("icon" + index);
            icon.style.color = color;
        };
        this.hideColorOptions = (data, event) => {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            const colorMenu = document.getElementById("colorMenu");
            colorMenu.style.transform = "scale(0)";
            this.colorMenuSelection(null);
        };
        this.showColorOptions = (data, event) => {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            const iconIndex = event.target.id.split(" ")[1];
            console.log(iconIndex);
            const { pageX, pageY } = event;
            colorMenu.style.left = `${pageX}px`;
            colorMenu.style.top = `${pageY + 8}px`;
            if (this.colorMenuSelection() === event.target.id) {
                colorMenu.style.transform = "scale(0)";
                this.colorMenuSelection(null);
            }
            else {
                this.colorMenuSelection(event.target.id);
                colorMenu.style.transform = "scale(1)";
            }
            const color = this.fileStorageData()[iconIndex].color;
            const colorOptions = document.getElementsByClassName("colorMenuItem");
            for (let i = 0; i < colorOptions.length; i++) {
                if (colorOptions[i].id === color) {
                    colorOptions[i].style.border = "3px solid black";
                }
                else {
                    colorOptions[i].style.border = "3px solid transparent";
                }
            }
            // colorOption.style.border = '2px solid black'
        };
        this.sliceArrayBuffer = (arrayBuffer, start, chunkSize) => {
            return [arrayBuffer.slice(start, start + chunkSize), uuid_generate()];
        };
        this.prepareData = (file, path = "") => {
            let offset = 0;
            const chunkSize = 2097152;
            const filename = file.name;
            const fileExtension = file.name.split(".").slice(-1)[0];
            const totalLength = file.size;
            const contentType = file.type;
            const pieces = {};
            const files = [];
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = (e) => {
                console.log(e.target.result);
                while (offset <= totalLength) {
                    const data = this.sliceArrayBuffer(e.target.result, offset, chunkSize);
                    pieces[offset] = data[1];
                    files.push({ [data[1]]: data[0] });
                    offset += chunkSize;
                }
            };
            const index = {
                [uuid_generate()]: {
                    filename,
                    fileExtension,
                    totalLength,
                    contentType,
                    pieces,
                    finished: true,
                },
            };
            return {
                index,
                files,
            };
        };
        this.traverseFileTree = (item, path = "") => {
            console.log(path);
            if (item.isFile) {
                item.file((file) => {
                    const upload = {
                        filename: file.name,
                        date: new Date(),
                    };
                    console.log(file);
                    const cb = () => {
                        const temp = this.currentUploads().filter((upload) => upload !== upload);
                        this.currentUploads(temp);
                        this.getHistoryTable();
                    };
                    this.currentUploads.push(upload);
                    new Uploader(file, 2097152, path, cb);
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
                for (let i = 0; i < files.length; i++) {
                    const upload = {
                        filename: files[i].name,
                        date: new Date(),
                    };
                    const cb = () => {
                        const temp = this.currentUploads().filter((upload) => upload !== upload);
                        this.currentUploads(temp);
                        this.getHistoryTable();
                    };
                    this.currentUploads.push(upload);
                    new Uploader(files[i], 2097152, "", cb);
                }
                hiddenInput.removeEventListener("change", fileHandler);
            };
            hiddenInput.addEventListener("change", fileHandler);
            hiddenInput.click();
        };
        this.closeVideo = (e) => { };
        let req = window.indexedDB.open("kloak-history", 1);
        req.onupgradeneeded = (e) => {
            this.db = e.target['result'];
            this.db.createObjectStore("history");
        };
        req.onsuccess = (e) => {
            this.db = e.target['result'];
            this.getHistoryTable();
        };
        req.onerror = (e) => {
            console.log("Unable to open IndexedDB!");
        };
        this.mobileShowSearch.subscribe((val) => {
            console.log(val);
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
                    const temp = this.allFileStorageData().filter((file) => {
                        if (file.detail.toLowerCase().includes(val)) {
                            return true;
                        }
                        if (file.domain.toLowerCase().includes(val)) {
                            return true;
                        }
                        if (file.url.toLowerCase().includes(val)) {
                            return true;
                        }
                        if (file.filename.toLowerCase().includes(val)) {
                            return true;
                        }
                        if (file.path.toLowerCase().includes(val)) {
                            return true;
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
        this.showSearchInput.subscribe(visible => {
            const input = document.getElementById('searchInput');
            if (visible) {
                input.focus();
                return;
            }
            input['value'] = "";
            this.suggestedTags([]);
            return;
        });
    }
}
