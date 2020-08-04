class fileStorage {
	private checkedFiles = ko.observableArray([])
	private fileStorageData = ko.observableArray([])
	private allFileStorageData = ko.observableArray([])
	private suggestedTags = ko.observableArray([])
	private availableTags = []
	private sortOption = ko.observableArray([null, null])
	private currentUploads = ko.observableArray([])
	private showSearchInput = ko.observable(false)
	private showSuggestions = ko.observable(true)
	private showOverlay = ko.observable(false)
	private searchKey = ko.observable()
	private selectedFile = ko.observable()
	private colorMenuSelection = ko.observable()
	private assemblyQueue = ko.observable()
	private assemblyRunning = false
	private mobileShowSearch = ko.observable(false)
	private colorOptions = [
		["maroon", "red", "olive", "yellow"],
		["green", "lime", "teal", "aqua"],
		["navy", "blue", "purple", "fuchsia"],
	]
	constructor() {
		this.getHistory()

		this.mobileShowSearch.subscribe((val) => {
			console.log(val)
		})

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
					const temp = this.allFileStorageData().filter((file: fileHistory) => {
						if (file.detail.toLowerCase().includes(val)) {
							return true
						}
						if (file.domain.toLowerCase().includes(val)) {
							return true
						}
						if (file.url.toLowerCase().includes(val)) {
							return true
						}
						if (file.filename.toLowerCase().includes(val)) {
							return true
						}
						if (file.path.toLowerCase().includes(val)) {
							return true
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

	formatFilename = (filename: string) => {
		if (filename.length <= 30) {
			return filename
		}
		return filename.slice(0,13) + '...' + filename.slice(-13)
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
		})
	}

	fileTagClick = (tag: string) => {
		this.searchKey(tag)
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

	deleteMultiple = () => {
		const uuid = this.checkedFiles.shift()
		this.deleteFile(uuid, () => {
			this.updateHistory(uuid)
			if (this.checkedFiles().length > 0) {
				this.deleteMultiple()
			}
		})
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

	fileAction = (data, event, action: string) => {
		switch (action) {
			case 'close':
				const videoPlayer = document.getElementById('fileStorageVideo')
				const assembler = videoPlayer['assembler']
				URL.revokeObjectURL(videoPlayer['src'])
				videoPlayer['src'] = null;
				this.showOverlay(false)
				assembler.terminate()
				break;
			case "delete":
				const callback = () => {
					const temp = this.allFileStorageData().filter((file) => file !== data)
					this.fileStorageData(temp)
					this.allFileStorageData(temp)
					this.fileStorageData.valueHasMutated()
					this.selectedFile(null)
				}
				this.deleteFile(data.uuid, callback)
				break
			case "download":
				return _view.storageHelper.createAssembler(data.uuid, (err, data) => {
					if (err) {
						console.log(err)
						return
					}
					const a = document.getElementById("hiddenAnchor")
					a['href'] = _view.storageHelper.createBlob(data.buffer, data.contentType)
					a['download'] = data.filename.split('.').pop().includes(data.extension) ? data.filename : `${data.filename}.${data.extension}`
					a.click()
				})
			case "play":
				_view.storageHelper.createAssembler(data.uuid, (err, data) => {
					if (err) {
						console.log(err)
						return
					}
					_view.displayVideo(true)
					const videoPlayer = document.getElementById("videoPlayer")
					videoPlayer['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType)
				})
				break
			case 'view':
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
				_view.storageHelper.createUploader(uuid_generate(), file, path, (err, data) => {
					if (err) {
						console.log(err)
						return
					}
					this.getHistory()
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
			for (let i = 0; i < files.length; i++) {
				const upload = {
					filename: files[i].name,
					date: new Date(),
				}
				const cb = () => {
					const temp = this.currentUploads().filter(
						(upload) => upload !== upload
					)
					this.currentUploads(temp)
					this.getHistory()
				}
				this.currentUploads.push(upload)
				new Uploader(files[i], "", cb)
			}
			hiddenInput.removeEventListener("change", fileHandler)
		}
		hiddenInput.addEventListener("change", fileHandler)
		hiddenInput.click()
	}

	closeVideo = (e) => {}
}
