class genSpalding {
    constructor() {
        // window.addEventListener("scroll", (e) => {
        // 	const viewportWidth =
        // 		window.innerWidth || document.documentElement.clientWidth
        this.isScrolling = false;
        this.mobileOpen = ko.observable(false);
        this.selectedPage = ko.observable("HOME");
        this.selectedIndex = ko.observable(0);
        this.selectedVideo = ko.observable(null);
        this.videoList = ko.observableArray([{ url: "https://www.youtube.com/watch?v=TNHCSo-taoA", image: "video1.jpg", title: "Life After Coronavirus - Will It Ever Be the Same?" }, { url: "https://www.youtube.com/watch?v=MeB5tlCILBk", image: "video2.jpg", title: "General Robert Spalding - The Adam Carolla Show" }, { url: "https://www.youtube.com/watch?v=Gdd7dtDaYmM", image: "video3.jpg", title: "1st documentary movie on the origin of CCP virus, Tracking Down the Origin of the Wuhan Coronavirus" }, { url: "https://www.youtube.com/watch?v=P3T8ZlWiNzE", image: "video4.jpg", title: "WHAT IS 5G? | DID CHINA GIVE US CO.... ? | BRIGADIER GENERAL ROBERT SPALDING ANSWERS LIVE" }, { url: "https://www.youtube.com/watch?v=NdbO7Id7cq8", image: "video5.jpg", title: "The Future of U.S.-China Relations" }, { url: "https://www.youtube.com/watch?v=KXB_ntyGmqs", image: "video6.jpg", title: "175: China’s Stealth War On America—Brig. Gen (Ret) Robert Spalding" }, { url: "https://www.youtube.com/watch?v=DfuV7K3A08g", image: "video7.jpg", title: "Gen. Spalding: How China’s Communist Party Uses the Coronavirus Pandemic to Expand Global Influence" }, { url: "https://www.youtube.com/watch?v=nZiL33Ui-9E", image: "video8.jpg", title: "General Robert Spalding on Spicer and Co. speaking about the CCP" }, { url: "https://www.youtube.com/watch?v=MlozqUJoGg8", image: "video9.jpg", title: "What Coronavirus reveals about capitalism" }, { url: "https://www.youtube.com/watch?v=-JS-IjVF9Lw", image: "video10.jpg", title: "DID CHINA CREATE CORONAVIRUS? | Brig. Gen. Robert Spalding, USAF (Ret.)" }, { url: "https://www.youtube.com/watch?v=tr4TwzfkAjA", image: "video11.jpg", title: "Gen. Robert Spalding's Keynote Speech - MLI's 2020 Annual Dinner" }, { url: "https://www.youtube.com/watch?v=h8IEtlOVzq4", image: "video12.jpg", title: "China’s Silent Takeover While America's Elite Slept" }, { url: "https://www.youtube.com/watch?v=oiRHDTnvfDc", image: "video13.jpg", title: "Dems' Iran Over-Reaction Analyzed By Victor Davis Hanson, Michael Waltz & Brig Gen Robert Spalding" }, { url: "https://www.youtube.com/watch?v=TJBwQEMcBpo", image: "video14.jpg", title: "Tariffs will likely go up because China is not ready to deal, policy pro says" }, { url: "https://www.youtube.com/watch?v=AGkU7HmAAAc", image: "video15.jpg", title: "The Threat of 5G" }, { url: "https://www.youtube.com/watch?v=X3VbBNZPfhM", image: "video16.jpg", title: "China’s ‘Stealth War’ Exposed by General Robert Spalding" }, { url: "https://www.youtube.com/watch?v=ghpL0VZvwRU", image: "video17.jpg", title: "Coronavirus Pandemic: Robert Spalding, Senior Fellow at Hudson Institute" }, { url: "https://www.youtube.com/watch?v=PAK025woVLs", image: "video18.jpg", title: "China Expert, General Robert Spalding on China's Six-Front War on the US" }]);
        this.showTwitterObjResult = ko.observable(false);
        this.twitterObj = null;
        this.mediaLoading = ko.observable(false);
        this.videoCanPlay = ko.observable(false);
        this.videoPlayer = null;
        this.videoShowMore = ko.observable(false);
        this.backToMain = () => {
            if (this.videoPlayer) {
                this.videoPlayer.terminate();
                this.videoPlayer = null;
            }
            _view.showGeneralSpalding(false);
            _view.showMainPage(true);
            _view.bodyBlue(true);
            _view.sectionLogin(true);
            _view.appScript(null);
        };
        // const cmd = {
        // 	command: 'CoSearch',
        // 	Args: [videoData.url],
        // 	error: null,
        // 	subCom: 'getSnapshop',
        // 	requestSerial: uuid_generate()
        // }
        this.playVideo = (videoData) => {
            if (videoData.url === this.selectedVideo()) {
                return;
            }
            if (this.videoPlayer) {
                this.videoPlayer.terminate();
                this.videoPlayer = null;
            }
            this.videoPlayer = new VideoPlayer("spaldingVideoCss", (err) => { }, () => { });
            this.selectedVideo(videoData.url);
            this.videoPlayer.youtubePlayer(null, videoData.url);
        };
        this.showTwitter = (self, twitterObj, twitterHref, serialNumber, showAccount) => {
            self.twitterObj = new twitter(twitterObj, twitterHref, serialNumber, showAccount, () => {
            });
            self.showTwitterObjResult(true);
            if (self['fileBuffer']) {
                self.twitterObj.getFilesFromFileArray(self['fileBuffer']);
            }
        };
        this.getTwitter = () => {
            const com = {
                command: 'CoSearch',
                Args: null,
                error: null,
                subCom: null,
                requestSerial: uuid_generate(),
            };
            com.Args = ["https://twitter.com/robert_spalding", 0, 0];
            com.subCom = 'getSnapshop';
            return _view.connectInformationMessage.emitRequest(com, (err, com) => {
                if (err) {
                    return;
                }
                if (!com) {
                    return;
                }
                if (com.error === -1) {
                    return;
                }
                if (com.error) {
                    return;
                }
                console.log(com);
                if (com.subCom === 'twitter') {
                    const twObj = com.Args[0];
                    const twitterHref = com.Args[1];
                    const serialNumber = com.requestSerial;
                    const fileBuffer = com.Args[2];
                    if (fileBuffer) {
                        if (this.twitterObj) {
                            return this.twitterObj.getFilesFromFileArray(fileBuffer);
                        }
                        return this['fileBuffer'] = fileBuffer;
                    }
                    return this.showTwitter(this, twObj, twitterHref, serialNumber, false);
                }
            });
        };
        // 	const viewportHeight =
        // 		window.innerHeight || document.documentElement.clientHeight
        // 	const homeSection = document.getElementById("HOME")
        // 	const rect = homeSection.getBoundingClientRect()
        // 	const isInViewport =
        // 		rect.top >= 0 &&
        // 		rect.left >= 0 &&
        // 		rect.bottom <=
        // 			(window.innerHeight || document.documentElement.clientHeight) &&
        // 		rect.right <=
        // 			(window.innerWidth || document.documentElement.clientWidth)
        // 	if (isInViewport) {
        // 		this.selectedPage("HOME")
        // 	}
        // 	// console.log(
        // 	// 	window.scrollY + document.getElementById("WATCH").offsetHeight / 2
        // 	// )
        // 	// console.log(
        // 	// 	document.getElementById("WATCH").offsetTop +
        // 	// 		document.getElementById("WATCH").offsetHeight / 2
        // 	// )
        // })
        const temp = [];
        this.videoList().forEach(video => {
            ['audio', '480', '720'].forEach(type => {
                const cmd = {
                    command: 'CoSearch',
                    Args: [video.url, type],
                    error: null,
                    subCom: 'getMediaData',
                    requestSerial: uuid_generate(),
                };
                const multimediaObj = {
                    title: video.title
                };
                if (type === 'audio') {
                    video['audio'] = new buttonStatusClass(['', '', '', ''], 'volume up', cmd, multimediaObj, false);
                }
                else {
                    video[`video${type}`] = new buttonStatusClass([type, type, type, type], 'film', cmd, multimediaObj, false);
                }
            });
            temp.push(video);
        });
        this.videoList(temp);
        this.getTwitter();
    }
}
