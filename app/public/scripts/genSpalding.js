class genSpalding {
    constructor() {
        this.isScrolling = false;
        this.mobileOpen = ko.observable(false);
        this.selectedPage = ko.observable("HOME");
        this.selectedIndex = ko.observable(0);
        this.videoList = ko.observableArray([{ url: "https://www.youtube.com/watch?v=TNHCSo-taoA", image: "video1.jpg", title: "Life After Coronavirus - Will It Ever Be the Same?" }, { url: "https://www.youtube.com/watch?v=MeB5tlCILBk", image: "video2.jpg", title: "General Robert Spalding - The Adam Carolla Show" }, { url: "https://www.youtube.com/watch?v=Gdd7dtDaYmM", image: "video3.jpg", title: "1st documentary movie on the origin of CCP virus, Tracking Down the Origin of the Wuhan Coronavirus" }, { url: "https://www.youtube.com/watch?v=P3T8ZlWiNzE", image: "video4.jpg", title: "WHAT IS 5G? | DID CHINA GIVE US CO.... ? | BRIGADIER GENERAL ROBERT SPALDING ANSWERS LIVE" }, { url: "https://www.youtube.com/watch?v=NdbO7Id7cq8", image: "video5.jpg", title: "The Future of U.S.-China Relations" }, { url: "https://www.youtube.com/watch?v=KXB_ntyGmqs", image: "video6.jpg", title: "175: China’s Stealth War On America—Brig. Gen (Ret) Robert Spalding" }, { url: "https://www.youtube.com/watch?v=DfuV7K3A08g", image: "video7.jpg", title: "Gen. Spalding: How China’s Communist Party Uses the Coronavirus Pandemic to Expand Global Influence" }, { url: "https://www.youtube.com/watch?v=nZiL33Ui-9E", image: "video8.jpg", title: "General Robert Spalding on Spicer and Co. speaking about the CCP" }, { url: "https://www.youtube.com/watch?v=MlozqUJoGg8", image: "video9.jpg", title: "What Coronavirus reveals about capitalism" }, { url: "https://www.youtube.com/watch?v=-JS-IjVF9Lw", image: "video10.jpg", title: "DID CHINA CREATE CORONAVIRUS? | Brig. Gen. Robert Spalding, USAF (Ret.)" }, { url: "https://www.youtube.com/watch?v=tr4TwzfkAjA", image: "video11.jpg", title: "Gen. Robert Spalding's Keynote Speech - MLI's 2020 Annual Dinner" }, { url: "https://www.youtube.com/watch?v=h8IEtlOVzq4", image: "video12.jpg", title: "China’s Silent Takeover While America's Elite Slept" }, { url: "https://www.youtube.com/watch?v=oiRHDTnvfDc", image: "video13.jpg", title: "Dems' Iran Over-Reaction Analyzed By Victor Davis Hanson, Michael Waltz & Brig Gen Robert Spalding" }, { url: "https://www.youtube.com/watch?v=TJBwQEMcBpo", image: "video14.jpg", title: "Tariffs will likely go up because China is not ready to deal, policy pro says" }, { url: "https://www.youtube.com/watch?v=AGkU7HmAAAc", image: "video15.jpg", title: "The Threat of 5G" }, { url: "https://www.youtube.com/watch?v=X3VbBNZPfhM", image: "video16.jpg", title: "China’s ‘Stealth War’ Exposed by General Robert Spalding" }, { url: "https://www.youtube.com/watch?v=ghpL0VZvwRU", image: "video17.jpg", title: "Coronavirus Pandemic: Robert Spalding, Senior Fellow at Hudson Institute" }, { url: "https://www.youtube.com/watch?v=PAK025woVLs", image: "video18.jpg", title: "China Expert, General Robert Spalding on China's Six-Front War on the US" }]);
        this.showTwitterObjResult = ko.observable(false);
        this.twitterObj = null;
        this.tweetTimeline = ko.observableArray([
            {
                created_at: "Tue Jul 07 15:33:25 +0000 2020",
                id: 1280525336384544800,
                id_str: "1280525336384544770",
                full_text: "What about those hurt by unemployment? Or business owners who lose everything? Why would you destroy people’s lives for your own political prerogatives? Main reason why no one should vote for politicians who’ve been in DC longer than 10 years.  https://t.co/rODtry8I3W",
                truncated: false,
                display_text_range: [0, 268],
                entities: {
                    hashtags: [],
                    symbols: [],
                    user_mentions: [],
                    urls: [
                        {
                            url: "https://t.co/rODtry8I3W",
                            expanded_url: "https://www.realclearpolitics.com/video/2018/06/09/maher_im_hoping_for_a_crashing_economy_so_we_can_get_rid_of_trump_bring_on_the_recession.html#",
                            display_url: "realclearpolitics.com/video/2018/06/…",
                            indices: [245, 268],
                        },
                    ],
                },
                source: '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
                in_reply_to_status_id: null,
                in_reply_to_status_id_str: null,
                in_reply_to_user_id: null,
                in_reply_to_user_id_str: null,
                in_reply_to_screen_name: null,
                user: {
                    id: 14308180,
                    id_str: "14308180",
                    name: "General Spalding",
                    screen_name: "robert_spalding",
                    location: "Washington, DC",
                    description: "Author of STEALTH WAR, Fmr Senior Director for Strategy at NSC, USAF B-2 Stealth Pilot https://t.co/GXSsucnn9r",
                    url: "https://t.co/nQKF3nC35p",
                    entities: {
                        url: {
                            urls: [
                                {
                                    url: "https://t.co/nQKF3nC35p",
                                    expanded_url: "http://generalspalding.com",
                                    display_url: "generalspalding.com",
                                    indices: [0, 23],
                                },
                            ],
                        },
                        description: {
                            urls: [
                                {
                                    url: "https://t.co/GXSsucnn9r",
                                    expanded_url: "http://linktr.ee/GeneralSpalding",
                                    display_url: "linktr.ee/GeneralSpalding",
                                    indices: [87, 110],
                                },
                            ],
                        },
                    },
                    protected: false,
                    followers_count: 88077,
                    friends_count: 2845,
                    listed_count: 451,
                    created_at: "Sat Apr 05 03:19:39 +0000 2008",
                    favourites_count: 19453,
                    utc_offset: null,
                    time_zone: null,
                    geo_enabled: true,
                    verified: false,
                    statuses_count: 16290,
                    lang: null,
                    contributors_enabled: false,
                    is_translator: false,
                    is_translation_enabled: false,
                    profile_background_color: "000000",
                    profile_background_image_url: "http://abs.twimg.com/images/themes/theme1/bg.png",
                    profile_background_image_url_https: "https://abs.twimg.com/images/themes/theme1/bg.png",
                    profile_background_tile: false,
                    profile_image_url: "http://pbs.twimg.com/profile_images/1133572528230850560/rCvjdGW1_normal.jpg",
                    profile_image_url_https: "https://pbs.twimg.com/profile_images/1133572528230850560/rCvjdGW1_normal.jpg",
                    profile_banner_url: "https://pbs.twimg.com/profile_banners/14308180/1590092325",
                    profile_link_color: "1B95E0",
                    profile_sidebar_border_color: "000000",
                    profile_sidebar_fill_color: "000000",
                    profile_text_color: "000000",
                    profile_use_background_image: false,
                    has_extended_profile: false,
                    default_profile: false,
                    default_profile_image: false,
                    following: null,
                    follow_request_sent: null,
                    notifications: null,
                    translator_type: "none",
                },
                geo: null,
                coordinates: null,
                place: null,
                contributors: null,
                is_quote_status: false,
                retweet_count: 57,
                favorite_count: 180,
                favorited: false,
                retweeted: false,
                possibly_sensitive: false,
                lang: "en",
            },
            {
                created_at: "Tue Jul 07 14:41:31 +0000 2020",
                id: 1280512274189496300,
                id_str: "1280512274189496324",
                full_text: 'Interesting Op-Ed. My take: 1. Obviously did not read the National Security Strategy as the first 3 recommendations are in there; 2. "Talk to China" recommendation shows the naivety of a "seasoned" diplomat captured by Beijing\'s narrative.\n\nhttps://t.co/A8TDPijTy4',
                truncated: false,
                display_text_range: [0, 264],
                entities: {
                    hashtags: [],
                    symbols: [],
                    user_mentions: [],
                    urls: [
                        {
                            url: "https://t.co/A8TDPijTy4",
                            expanded_url: "https://warontherocks.com/2020/07/what-should-come-after-trumps-failed-china-policy/?utm_source=Sailthru&utm_medium=email&utm_campaign=EBB%2007.07.20&utm_term=Editorial%20-%20Early%20Bird%20Brief",
                            display_url: "warontherocks.com/2020/07/what-s…",
                            indices: [241, 264],
                        },
                    ],
                },
                source: '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>',
                in_reply_to_status_id: null,
                in_reply_to_status_id_str: null,
                in_reply_to_user_id: null,
                in_reply_to_user_id_str: null,
                in_reply_to_screen_name: null,
                user: {
                    id: 14308180,
                    id_str: "14308180",
                    name: "General Spalding",
                    screen_name: "robert_spalding",
                    location: "Washington, DC",
                    description: "Author of STEALTH WAR, Fmr Senior Director for Strategy at NSC, USAF B-2 Stealth Pilot https://t.co/GXSsucnn9r",
                    url: "https://t.co/nQKF3nC35p",
                    entities: {
                        url: {
                            urls: [
                                {
                                    url: "https://t.co/nQKF3nC35p",
                                    expanded_url: "http://generalspalding.com",
                                    display_url: "generalspalding.com",
                                    indices: [0, 23],
                                },
                            ],
                        },
                        description: {
                            urls: [
                                {
                                    url: "https://t.co/GXSsucnn9r",
                                    expanded_url: "http://linktr.ee/GeneralSpalding",
                                    display_url: "linktr.ee/GeneralSpalding",
                                    indices: [87, 110],
                                },
                            ],
                        },
                    },
                    protected: false,
                    followers_count: 88077,
                    friends_count: 2845,
                    listed_count: 451,
                    created_at: "Sat Apr 05 03:19:39 +0000 2008",
                    favourites_count: 19453,
                    utc_offset: null,
                    time_zone: null,
                    geo_enabled: true,
                    verified: false,
                    statuses_count: 16290,
                    lang: null,
                    contributors_enabled: false,
                    is_translator: false,
                    is_translation_enabled: false,
                    profile_background_color: "000000",
                    profile_background_image_url: "http://abs.twimg.com/images/themes/theme1/bg.png",
                    profile_background_image_url_https: "https://abs.twimg.com/images/themes/theme1/bg.png",
                    profile_background_tile: false,
                    profile_image_url: "http://pbs.twimg.com/profile_images/1133572528230850560/rCvjdGW1_normal.jpg",
                    profile_image_url_https: "https://pbs.twimg.com/profile_images/1133572528230850560/rCvjdGW1_normal.jpg",
                    profile_banner_url: "https://pbs.twimg.com/profile_banners/14308180/1590092325",
                    profile_link_color: "1B95E0",
                    profile_sidebar_border_color: "000000",
                    profile_sidebar_fill_color: "000000",
                    profile_text_color: "000000",
                    profile_use_background_image: false,
                    has_extended_profile: false,
                    default_profile: false,
                    default_profile_image: false,
                    following: null,
                    follow_request_sent: null,
                    notifications: null,
                    translator_type: "none",
                },
                geo: null,
                coordinates: null,
                place: null,
                contributors: null,
                is_quote_status: false,
                retweet_count: 55,
                favorite_count: 205,
                favorited: false,
                retweeted: false,
                possibly_sensitive: false,
                lang: "en",
            },
        ]);
        this.showTwitter = (self, twitterObj, twitterHref, serialNumber, buffer, showAccount) => {
            self.twitterObj = new twitter(twitterObj, twitterHref, serialNumber, buffer, showAccount);
            console.log(self);
            console.log(twitterObj);
            self.showTwitterObjResult(true);
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
                console.log(com);
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
                if (com.subCom === 'twitter') {
                    const twObj = com.Args[0];
                    const twitterHref = com.Args[1];
                    const serialNumber = com.requestSerial;
                    const fileBuffer = null; //com.Args[2]
                    return this.showTwitter(this, twObj, twitterHref, serialNumber, null, false);
                }
            });
        };
        this.navigateCarousel = (action, init) => {
            if (init) {
                this.selectedIndex(0);
            }
            if (!this.isScrolling) {
                const length = this.videoList().length;
                let index = this.selectedIndex();
                // console.log(index)
                if (action === 'next') {
                    index += 1;
                    console.log(index);
                    if (index > length - 1) {
                        this.selectedIndex(0);
                        console.log(this.selectedIndex());
                    }
                    else {
                        this.selectedIndex(index);
                    }
                    // this.selectedIndex(selectedIndex + 1)
                }
                if (action === 'previous') {
                    index -= 1;
                    // console.log(index)
                    if (index < 0) {
                        this.selectedIndex(length - 1);
                    }
                    else {
                        this.selectedIndex(index);
                    }
                }
            }
        };
        window.addEventListener("scroll", (e) => {
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const homeSection = document.getElementById("HOME");
            const rect = homeSection.getBoundingClientRect();
            const isInViewport = rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <=
                    (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <=
                    (window.innerWidth || document.documentElement.clientWidth);
            if (isInViewport) {
                this.selectedPage("HOME");
            }
            // console.log(
            // 	window.scrollY + document.getElementById("WATCH").offsetHeight / 2
            // )
            // console.log(
            // 	document.getElementById("WATCH").offsetTop +
            // 		document.getElementById("WATCH").offsetHeight / 2
            // )
        });
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
        this.selectedIndex.subscribe(async (val) => {
            this.isScrolling = true;
            const id = this.videoList()[val].image;
            const videoItem = document.getElementById(id);
            const videoMenuItem = document.getElementById(`carouselItem ${val}`);
            videoMenuItem.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
            setTimeout(() => {
                videoItem.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
                this.isScrolling = false;
            }, 300);
        });
        this.getTwitter();
    }
}
