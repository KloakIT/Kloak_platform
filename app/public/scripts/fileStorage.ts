class fileStorage {
	private checkedFiles = ko.observableArray([])
	private fileStorageData = ko.observableArray([])
	private allFileStorageData = ko.observableArray([])
	private usageQuota = ko.observable(null)
	private suggestedTags = ko.observableArray([])
	private availableTags = []
	private sortOption = ko.observableArray([null, null])
	private currentUploads = ko.observableArray([])
	private showSearchInput = ko.observable(false)
	private showSuggestions = ko.observable(true)
	private showOverlay = ko.observable(false)
	private searchKey = ko.observable()
	private selectedFile = ko.observable()
	private colorOptions = [
		["maroon", "red", "olive", "yellow"],
		["green", "lime", "teal", "aqua"],
		["navy", "blue", "purple", "fuchsia"],
	]
	constructor() {
		this.detectStorageUsage()
		
		this.getHistory()

		this.searchKey.subscribe((val: string) => {
			val = val.trim().toLowerCase()
			if (val.length > 0) {
				if (val.startsWith('#')) {
					val = val.slice(1)
					if (!val) {
						this.suggestedTags(this.availableTags)
						return
					}
					this.suggestedTags(this.availableTags.filter(tag => tag.includes(val)))
					return
				} else {
					this.suggestedTags([])
					const temp = this.allFileStorageData().filter((file: fileHistory) => {
						if (file['filename']) {
							return file['filename'].toLowerCase().includes(val)
						}

						if (file['url']) {
							return file['url'].toLowerCase().includes(val)
						}

						if (file['domain']) {
							return file['domain'].toLowerCase().includes(val)
						}

						if (file['detail']) {
							return file['domain'].toLowerCase().includes(val)
						}

						if (file['path']) {
							return file['path'].toLowerCase().includes(val)
						}
					})
					this.fileStorageData(temp)
				}
			} else {
				this.fileStorageData(this.allFileStorageData())
				this.suggestedTags([])
			}

		})

		this.showSearchInput.subscribe(visible => {
			const input = document.getElementById('searchInput')
			if (visible) {
				input.focus()
				return
			}
			input['value'] = ""
			this.suggestedTags([])
			return
		})
	}

	backToMain = () => {
		_view.showFileStorage(false)
		_view.showMainPage ( true )
		_view.bodyBlue ( true )
		_view.sectionLogin ( true )
		_view.appScript(null)
	}

	detectStorageUsage = () => {
		_view.storageHelper.detectStorage((err, data) => {
			if (err) {
				this.usageQuota(null)
				return
			}
			this.usageQuota(data)
		})
	}

	numberWithCommas = (x) => {
		return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}

	formatUsageQuota = (usage: number, quota: number) => {
		let sizes = ['TB', 'GB', 'MB', 'KB', 'Bytes']
		let n = this.formatBytes(usage)
		let m = this.formatBytes(quota)
		while (m.length > n.length) {
			let c = m.shift()
			console.log(n.length, m.length)
			m[0] = m[0] + (c * 1024)
		}
		sizes = sizes.slice(-n.length)
		const usageText = n.map((size, index) => `${this.numberWithCommas(size)}`)
		const quotaText = m.map((size, index) => `${this.numberWithCommas(size)}`)
		console.log(usageText, quotaText)
		return `${usageText[0]}.${usageText[1].split('').shift()} ${sizes[0]} / ${quotaText[0]} ${sizes[0]}`
	}

	formatBytes = (bytes: number) => {
		let b = null
		let kb = null
		let mb = null
		let gb = null
		let tb = null
		b = bytes
		if (b > 1024) {
			kb = Math.floor(b/1024)
			b = b % 1024
		}
		if (kb > 1024) {
			mb = Math.floor(kb/1024)
			kb = kb % 1024
		}
		if (mb > 1024) {
			gb = Math.floor(mb/1024)
			mb  = mb % 1024
		}
		if (gb > 1024) {
			tb = Math.floor(gb/1024)
			gb  = gb % 1024
		}

		const result = [tb, gb, mb, kb, b].map(size => {
			return size
		})

		return result.filter(res => res !== null)
	}

	formatFilename = (fileData) => {
		if (fileData.filename.length <= 30) {
			return fileData.filename
		}
		return fileData.tag.includes('snapshot') ? fileData.filename.slice(0,25) : fileData.filename.slice(0,10) + '...' + fileData.filename.slice(-10)
	}

	progressBarColor = (percent: number) => {
		switch (true) {
			case (percent > 0 && percent <= 33):
				return "#FFF59D"
			case (percent > 33 && percent <= 66):
				return "#FFCC80"
			case (percent > 66):
				return "#69F0AE"
			default:
				break;
		}
	}

	getFileIndex = (uuid: string, callback: Function) => {
		let req = window.indexedDB.open("kloak-index", 1)

		req.onsuccess = (e) => {
			const db = e.target['result']
			db
				.transaction("kloak-index", "readwrite")
				.objectStore("kloak-index")
				.delete(uuid).onsuccess = (e) => {
				callback()
			}
		}
	}

	filterFromTag = (tag: string) => {
		this.searchKey(`#${tag}`)
		this.showSuggestions( false )
		this.fileStorageData(this.allFileStorageData().filter(file => file.tag.includes(tag)))
		return
	}

	setTags = (fileStorageData: Array<fileHistory>) => {
		const temp = new Set()
		fileStorageData.map(file => {
			file.tag.map(tag => {
				console.log(tag)
				temp.add(tag.toLowerCase())
			})
		})
		this.availableTags = [...temp]
	}

	getHistory = () => {
		_view.storageHelper.decryptLoad('history', (err, data) => {
			if (err) {
				return
			}
			this.allFileStorageData(JSON.parse(Buffer.from(data).toString()).reverse())
			this.fileStorageData(this.allFileStorageData())
			this.setTags(this.allFileStorageData())
		})
	}

	searchSuggestionClick = (data, event) => {
		this.showSuggestions(false)
		const temp = this.allFileStorageData().filter((file) => file === data)
		this.fileStorageData(temp)
	}

	updateHistory = (uuid) => {
		const temp = this.allFileStorageData().filter((file) => file.uuid !== uuid)
		this.fileStorageData(temp)
		this.allFileStorageData(temp)
		_view.storageHelper.replaceHistory(this.allFileStorageData(), null)
		this.fileStorageData.valueHasMutated()
		this.selectedFile(null)
		this.detectStorageUsage()
	}

	deleteFile = (uuid: string, callback: Function) => {
		let pieces = null
		let count = 0
		_view.storageHelper.getIndex(uuid, (err, data) => {
			pieces = JSON.parse(Buffer.from(data).toString()).pieces
			pieces.forEach(piece => {
				_view.storageHelper.delete(piece, (err, data) => {
					count++
					console.log(count, pieces.length)
					if (count === pieces.length) {
						_view.storageHelper.delete(uuid, (err, data) => {
							callback(err, data)
						})
					}
				})
			})
		})
	}

	sortHistory = (type: string, direction: string) => {
		console.log(type, direction)
		let temp = null;
		const nameCompare = (a, b) => {
			const stringA = a[type].toUpperCase()
			const stringB = b[type].toUpperCase()
			if (stringA > stringB) {
				return 1
			} else if (stringA < stringB) {
				return -1
			}
		}

		const dateCompare = (a, b) => {
			if (direction === 'up') {
				return Date.parse(a[type]) - Date.parse(b[type])
			}
			return Date.parse(b[type]) - Date.parse(a[type])
		}
		
		if (type === 'filename') {
			temp = this.fileStorageData().sort(nameCompare)
			if (direction === 'up') {
				temp = temp.reverse()
			}
			this.fileStorageData(temp)
			return
		}
		
		temp = this.fileStorageData().sort(dateCompare)
		this.fileStorageData(temp)
		return

	}

	sortHandler = (type: string) => {
		let current = this.sortOption()[0]
		let sort = this.sortOption()[1]
		if (current == type) {
			sort == 'up' ? this.sortOption([current, 'down']) : this.sortOption([current, 'up'])
		} else {
			this.sortOption([type, 'up'])
		}
		this.sortHistory(this.sortOption()[0], this.sortOption()[1])

	}

	closeAll = () => {
		this.suggestedTags([])
		this.showSuggestions(false)
		this.searchKey()
		this.showSearchInput(false)
		this.selectedFile(null)
		this.showFileOptions(null)
		return
	}

	fileAction = (fileData, event, action: string) => {
		switch (action) {
			case 'close':
				_view.displayMedia(null)
				const videoPlayer = document.getElementById("videoPlayer")
				URL.revokeObjectURL(videoPlayer['src'])
				videoPlayer['src'] = null;
				break;
			case "delete":
				const callback = () => {
					const temp = this.allFileStorageData().filter((file) => file !== fileData)
					this.checkedFiles(this.checkedFiles().filter(uuid => uuid !== fileData.uuid))
					this.fileStorageData(temp)
					this.allFileStorageData(temp)
					_view.storageHelper.replaceHistory(temp, (err, data) => {
						if (err) {
							return
						}
					})
					this.fileStorageData.valueHasMutated()
					this.selectedFile(null)
				}
				this.deleteFile(fileData.uuid, callback)
			case "download":
				let t0 = performance.now()
				console.time(`STARTING DOWNLOAD: ${fileData.uuid}`)
				return _view.storageHelper.createAssembler(fileData.uuid, (err, data) => {
					if (err) {
						console.log(err)
						return
					}
					let t1 = performance.now()
					console.log(`TOTAL DOWNLOAD TIME: ${(t1-t0).toFixed(2)}ms | ${((t1-t0)/1000).toFixed(2)} s`)
					console.timeEnd(`STARTING DOWNLOAD: ${fileData.uuid}`)
					const url = _view.storageHelper.createBlob(data.buffer, data.contentType)
					const filename = data.filename.split('.').pop().includes(data.extension) ? data.filename : `${data.filename}.${data.extension}`
					_view.storageHelper.downloadBlob(url, filename)
				})
			case "play":
				console.time(`STARTING DOWNLOAD: ${fileData.uuid}`)
				return _view.storageHelper.createAssembler(fileData.uuid, (err, data) => {
					console.timeEnd(`STARTING DOWNLOAD: ${fileData.uuid}`)
					_view.displayMedia('player')
					const videoPlayer = document.getElementById("videoPlayer")
					videoPlayer['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType)
					videoPlayer['play']()
				})
				// let mediaSource = null
				// let buffers = []
				// _view.displayMedia('player')
				// const vidPlayer = document.getElementById("videoPlayer")
				// console.log(vidPlayer)
				// function sourceOpen(e) {
				// 	console.log(e)
				// 	// URL.revokeObjectURL(vidPlayer['src']);
				// 	var mime = 'video/mp4; codecs="avc1.4D401F"';
				// 	console.log(MediaSource.isTypeSupported(mime))
				// 	var mediaSource = e.target;
				// 	var sourceBuffer = mediaSource.addSourceBuffer(mime);
				// 	const nextSeg = (e) => {
				// 		console.log(e)
				// 		if (buffers.length === 0) {
				// 			sourceBuffer.removeEventListener('update', nextSeg);
				// 		}
				// 		sourceBuffer.appendBuffer(new Uint8Array(buffers.shift()))
				// 	}
				// 	sourceBuffer.addEventListener('update', nextSeg);
				// }
				// return _view.storageHelper.createAssembler(fileData.uuid, (err, data) => {
				// 	if (err) {
				// 		console.log(err)
				// 		return
				// 	}
				// 	buffers.push(data)
				// 	if (data === fileData.uuid) {

				// 	if (mediaSource === null) {
				// 		if (window.MediaSource) {
				// 			mediaSource = new MediaSource();
				// 			vidPlayer['src'] = URL.createObjectURL(mediaSource);
				// 			mediaSource.addEventListener('sourceopen', sourceOpen);
				// 		} else {
				// 			console.log("The Media Source Extensions API is not supported.")
				// 		}
				// 	}
				// 	}
					
				// })
			case 'view':
				if ( fileData.tag.includes('snapshot')) {
					_view.showFileStorage(false)
						new showWebPageClass ( fileData.filename , fileData.uuid , null, () => {
							_view.showFileStorage(true)
					})
				}
				return _view.storageHelper.createAssembler(fileData.uuid, (err, data) => {
					if (err) {
						console.log(err)
						return
					}
					console.log(data)
					switch (true) {
						case fileData.tag.includes('image'):
							_view.displayMedia('image')
							const imageViewer = document.getElementById('imageViewer')
							imageViewer['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType)
							break;
						case fileData.tag.includes('pdf'):
							_view.displayMedia('pdf')
							const pdfViewer = document.getElementById('pdfViewer')
							pdfViewer['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType)
							break;
					}
					
				})
				// _view.storageHelper.createAssembler(currentItem.snapshotUuid, (err, data) => {
				// 	if (err) {
				// 		console.log(err)
				// 		return
				// 	}
				// 	let y = null
				// 	self.showMain (false)
				// 	self.showSnapshop (true)
				// 	self.showWebPage(
				// 		(y = new showWebPageClass(
				// 			isImage ? currentItem.clickUrl : currentItem.url,
				// 			Buffer.from( data.buffer ).toString('base64'),
				// 			currentItem.snapshotUuid, 
				// 			currentItem.multimediaObj,
				// 			() => {
				// 				self.showWebPage((y = null))
				// 				self.showMain(true)
				// 				self.showSnapshop(false)
				// 			}
				// 		))
				// 	)
				// })
				break;
			case 'deleteMultiple':
				const uuid = this.checkedFiles.shift()
				this.deleteFile(uuid, () => {
					this.updateHistory(uuid)
					if (this.checkedFiles().length > 0) {
						this.fileAction(fileData, event, 'deleteMultiple')
					}
				})
				break;
			case 'downloadMultiple':
				const files = this.checkedFiles()
				files.forEach(uuid => {
					_view.storageHelper.createAssembler(uuid, (err, data) => {
						if (err) {
							return console.log(err)
						}
						this.checkedFiles.shift()
						const url = _view.storageHelper.createBlob(data.buffer, data.contentType)
						const filename = data.filename.split('.').pop().includes(data.extension) ? data.filename : `${data.filename}.${data.extension}`
						_view.storageHelper.downloadBlob(url, filename)
					})
				})
				break;
			default:
				break
		}
	}

	getDate = (timestamp: Date | string, type: string) => {
		if (typeof timestamp === 'string') {
			timestamp = new Date(timestamp)
		}
		const month = timestamp.getMonth()
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
		]
		const hours =
			timestamp.getHours() > 12
				? timestamp.getHours() - 12
				: timestamp.getHours()
		const minutes =
			timestamp.getMinutes() < 10
				? `0${timestamp.getMinutes()}`
				: timestamp.getMinutes()
		const AMPM = timestamp.getHours() > 12 ? "PM" : "AM"

		switch (type) {
			case "date":
				return `${
					monthString[month]
				} ${timestamp.getDate()}, ${timestamp.getFullYear()}`
			case "full":
				return `${
					monthString[month]
				} ${timestamp.getDate()}, ${timestamp.getFullYear()} ${hours}:${minutes} ${AMPM}`
			default:
				break
		}
	}

	checkedFile = (data, event, checkAll?: boolean) => {
		const isChecked = event.target.checked
		if (checkAll) {
			this.checkedFiles([])
			if (!isChecked) {
				return true;
			} 
			const temp = []
			this.allFileStorageData().forEach(file => {
				temp.push(file.uuid)
			})
			this.checkedFiles(temp)
			return true;
		}
		if (!isChecked) {
			this.checkedFiles(this.checkedFiles().filter(uuid => uuid !== data.uuid))
			return true;
		}
		this.checkedFiles().push(data.uuid)
		this.checkedFiles.valueHasMutated()
		console.log(this.checkedFiles())
		return true;
	}

	showFileOptions = (index: number) => {
		if (index === this.selectedFile()) {
			this.selectedFile(null)
			return
		}
		this.selectedFile(index)
	}

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
	// 			colorOptions[i]['style'].border = "3px solid transparent"
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

	traverseFileTree = (item, path = "") => {
		console.log(path)
		if (item.isFile) {
			item.file((file: File) => {
				const uuid = uuid_generate()
				_view.storageHelper.createUploader(uuid, file, path, (err, data) => {
					if (err) {
						console.log(err)
						return
					}
					let c = 0;

					if (c === 0) {
						this.getHistory()
						c++
					}

					this.detectStorageUsage()

					if (data === uuid) {
						this.getHistory()
					}
				})
			})
		} else if (item.isDirectory) {
			const dirReader = item.createReader()
			dirReader.readEntries((entries) => {
				for (let i = 0; i < entries.length; i++) {
					this.traverseFileTree(entries[i], path + item.name + "/")
				}
			})
		}
	}

	ondrop = (e, data) => {
		const fileDragOverlay = document.getElementById("fileDragOverlay")
		fileDragOverlay.style.visibility = "hidden"
		this.selectedFile(null)
		const items = e.originalEvent.dataTransfer.items
		const length = e.originalEvent.dataTransfer.items.length
		for (let i = 0; i < length; i++) {
			const item = items[i].webkitGetAsEntry()
			if (item) {
				this.traverseFileTree(item)
			}
		}
	}

	dragover = (e) => {
		e.preventDefault()
		this.selectedFile(null)
		const fileDragOverlay = document.getElementById("fileDragOverlay")
		fileDragOverlay.style.visibility = "initial"
	}

	dragleave = (e) => {
		const fileDragOverlay = document.getElementById("fileDragOverlay")
		fileDragOverlay.style.visibility = "hidden"
	}

	uploadFileClick = (e) => {
		const hiddenInput = document.getElementById("hiddenInput")
		const fileHandler = (e) => {
			const files = e.target.files
			_view.storageHelper.createUploader(uuid_generate(), files[0], "", (err, data) => {
				if (err) {
					console.log(err)
					return
				}
				let c = 0;

				if (c === 0) {
					this.getHistory()
					c++
				}

				this.detectStorageUsage()
			} )
			hiddenInput.removeEventListener("change", fileHandler)
		}
		hiddenInput.addEventListener("change", fileHandler)
		hiddenInput.click()
	}

	closeVideo = (e) => {}
}
