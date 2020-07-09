class genSpalding {
    constructor() {
        this.currentPage = ko.observable('home');
        this.totalImages = 25;
        this.carouselImageBase = 'carousel-image-';
        this.carouselImages = ko.observableArray([]);
        this.currentCarouselIndex = ko.observable(0);
        this.lastCarouselIndex = ko.observable(0);
        this.mobileMenuOpen = ko.observable(false);
        this.contactEmail = ko.observable('');
        this.contactName = ko.observable('');
        this.contactEmailSelected = ko.observable(false);
        this.contactNameSelected = ko.observable(false);
        this.contactMessage = ko.observable('');
        this.tweetTimeline = ko.observableArray([
            {
                created_at: 'Tue Jul 07 15:33:25 +0000 2020',
                id: 1280525336384544800,
                id_str: '1280525336384544770',
                full_text: 'What about those hurt by unemployment? Or business owners who lose everything? Why would you destroy people’s lives for your own political prerogatives? Main reason why no one should vote for politicians who’ve been in DC longer than 10 years.  https://t.co/rODtry8I3W',
                truncated: false,
                display_text_range: [0, 268],
                entities: {
                    hashtags: [],
                    symbols: [],
                    user_mentions: [],
                    urls: [
                        {
                            url: 'https://t.co/rODtry8I3W',
                            expanded_url: 'https://www.realclearpolitics.com/video/2018/06/09/maher_im_hoping_for_a_crashing_economy_so_we_can_get_rid_of_trump_bring_on_the_recession.html#',
                            display_url: 'realclearpolitics.com/video/2018/06/…',
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
                    id_str: '14308180',
                    name: 'General Spalding',
                    screen_name: 'robert_spalding',
                    location: 'Washington, DC',
                    description: 'Author of STEALTH WAR, Fmr Senior Director for Strategy at NSC, USAF B-2 Stealth Pilot https://t.co/GXSsucnn9r',
                    url: 'https://t.co/nQKF3nC35p',
                    entities: {
                        url: {
                            urls: [
                                {
                                    url: 'https://t.co/nQKF3nC35p',
                                    expanded_url: 'http://generalspalding.com',
                                    display_url: 'generalspalding.com',
                                    indices: [0, 23],
                                },
                            ],
                        },
                        description: {
                            urls: [
                                {
                                    url: 'https://t.co/GXSsucnn9r',
                                    expanded_url: 'http://linktr.ee/GeneralSpalding',
                                    display_url: 'linktr.ee/GeneralSpalding',
                                    indices: [87, 110],
                                },
                            ],
                        },
                    },
                    protected: false,
                    followers_count: 88077,
                    friends_count: 2845,
                    listed_count: 451,
                    created_at: 'Sat Apr 05 03:19:39 +0000 2008',
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
                    profile_background_color: '000000',
                    profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
                    profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
                    profile_background_tile: false,
                    profile_image_url: 'http://pbs.twimg.com/profile_images/1133572528230850560/rCvjdGW1_normal.jpg',
                    profile_image_url_https: 'https://pbs.twimg.com/profile_images/1133572528230850560/rCvjdGW1_normal.jpg',
                    profile_banner_url: 'https://pbs.twimg.com/profile_banners/14308180/1590092325',
                    profile_link_color: '1B95E0',
                    profile_sidebar_border_color: '000000',
                    profile_sidebar_fill_color: '000000',
                    profile_text_color: '000000',
                    profile_use_background_image: false,
                    has_extended_profile: false,
                    default_profile: false,
                    default_profile_image: false,
                    following: null,
                    follow_request_sent: null,
                    notifications: null,
                    translator_type: 'none',
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
                lang: 'en',
            },
            {
                created_at: 'Tue Jul 07 14:41:31 +0000 2020',
                id: 1280512274189496300,
                id_str: '1280512274189496324',
                full_text: 'Interesting Op-Ed. My take: 1. Obviously did not read the National Security Strategy as the first 3 recommendations are in there; 2. "Talk to China" recommendation shows the naivety of a "seasoned" diplomat captured by Beijing\'s narrative.\n\nhttps://t.co/A8TDPijTy4',
                truncated: false,
                display_text_range: [0, 264],
                entities: {
                    hashtags: [],
                    symbols: [],
                    user_mentions: [],
                    urls: [
                        {
                            url: 'https://t.co/A8TDPijTy4',
                            expanded_url: 'https://warontherocks.com/2020/07/what-should-come-after-trumps-failed-china-policy/?utm_source=Sailthru&utm_medium=email&utm_campaign=EBB%2007.07.20&utm_term=Editorial%20-%20Early%20Bird%20Brief',
                            display_url: 'warontherocks.com/2020/07/what-s…',
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
                    id_str: '14308180',
                    name: 'General Spalding',
                    screen_name: 'robert_spalding',
                    location: 'Washington, DC',
                    description: 'Author of STEALTH WAR, Fmr Senior Director for Strategy at NSC, USAF B-2 Stealth Pilot https://t.co/GXSsucnn9r',
                    url: 'https://t.co/nQKF3nC35p',
                    entities: {
                        url: {
                            urls: [
                                {
                                    url: 'https://t.co/nQKF3nC35p',
                                    expanded_url: 'http://generalspalding.com',
                                    display_url: 'generalspalding.com',
                                    indices: [0, 23],
                                },
                            ],
                        },
                        description: {
                            urls: [
                                {
                                    url: 'https://t.co/GXSsucnn9r',
                                    expanded_url: 'http://linktr.ee/GeneralSpalding',
                                    display_url: 'linktr.ee/GeneralSpalding',
                                    indices: [87, 110],
                                },
                            ],
                        },
                    },
                    protected: false,
                    followers_count: 88077,
                    friends_count: 2845,
                    listed_count: 451,
                    created_at: 'Sat Apr 05 03:19:39 +0000 2008',
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
                    profile_background_color: '000000',
                    profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
                    profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
                    profile_background_tile: false,
                    profile_image_url: 'http://pbs.twimg.com/profile_images/1133572528230850560/rCvjdGW1_normal.jpg',
                    profile_image_url_https: 'https://pbs.twimg.com/profile_images/1133572528230850560/rCvjdGW1_normal.jpg',
                    profile_banner_url: 'https://pbs.twimg.com/profile_banners/14308180/1590092325',
                    profile_link_color: '1B95E0',
                    profile_sidebar_border_color: '000000',
                    profile_sidebar_fill_color: '000000',
                    profile_text_color: '000000',
                    profile_use_background_image: false,
                    has_extended_profile: false,
                    default_profile: false,
                    default_profile_image: false,
                    following: null,
                    follow_request_sent: null,
                    notifications: null,
                    translator_type: 'none',
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
                lang: 'en',
            },
        ]);
        this.allBlogs = ko.observableArray([
            {
                blog_id: 1,
                created_date: 'March 28, 2020',
                created_date_short: 'Mar 28, 2020',
                category: 'Speaking Tours',
                image_url: '../images/spalding/blog/focus-on-home.jpg',
                title: 'Focusing on Home',
                short_desc: '50K Stealth Warriors on Twitter! To quote Fox Mulder, “The truth is OUT THERE” and the message is continuing to gain momentum every day.',
                long_text: [
                    { img: '../images/spalding/blog/focus-on-home.jpg' },
                    '50K Stealth Warriors on Twitter! To quote Fox Mulder, “The truth is OUT THERE” and the message is continuing to gain momentum every day.',
                    'The last two weeks were light on foreign travel. Not due to the coronavirus, but instead a direct focus on pushing the Stealth War message at home. I was asked to go on Varney & Co, Sean Spicer & Co, and The Hill TV as well as participate in a new documentary by Joshua Philipp. I’m frequently asked about the coronavirus and my answer is always the same: the economic aftershocks from the virus make it clear our supply chain is vulnerable. I had numerous radio and YouTube interviews both nationally and for the UK. I spoke to BENS members in DC and addressed a class of future military and civilian interagency leaders at National Defense University. We talked about the challenges of the 21st century created by the spread of globalization and the internet. NDU provides a good opportunity for these officers and civilians – who were engaged and asked great questions – to take a break from their jobs and think about their role in national security as they rise in responsibility and leadership roles. Nothing could be more important for me as I work to help spread the message.',
                    'I also spoke to intelligence community professionals about the challenge of intelligence collection when the “bad guys” are in our own country. Understanding influence when it is occurring under our noses is difficult, if not impossible, for a community trained to look outside our borders for threats. The non-traditional collectors in corporate America and academia represent a clear and present danger for our economic prosperity and democracy.',
                    'I was asked to participate in a State Department-hosted roundtable on Rule of Law. The gathered academic scholars still have a strong desire to try and influence the Chinese Communist Party to adopt our principles; This shows me we still have a lot of work to do in the academic community educating people about the CCP. The CCP charter is completely counter to our system of openness. The better option is to engage the minds directly under CCP rule, the Chinese people.',
                    "I finished the week with a panel discussion for the Turkish Heritage Organization Center for Turkish America Relations. The discussion was on US-China relations and moderated by Louisa Greve, Director of Global Advocacy, Uyghur Human Rights Project. The other panelists were Robert Ross, Professor of Political Science, Boston College Associate, John King Fairbank Center for Chinese Studies, Harvard University and Sophie Richardson, China Director Human Rights Watch. The discussion was led by Robert Ross and focused on why we needed to continue to appease China's economic expansion so as not to risk turning them into an adversary. I countered that the CCP represented an existential threat to democracy everywhere. It is mind boggling to me that these experts still want to blame Washington DC for the decline in US-China relations. They are completely oblivious to the fact that the coronavirus is causing the rest of the country and the world to awaken to the threat posed by the CCP.",
                    'This panel led to a last-minute request to appear on TRT World News, where again, the narrative focused not on lack of CCP transparency or credibility, but the CCP-influenced tweet by ministry spokesman Zhao LiJian accusing the US Army of coronavirus origins.',
                    'Even as the Stealth War message continues to grow, there is a need for more platforms, more opportunity to speak about the Chinese Communist Party influence and the danger to our democracy.',
                    'The elimination of the US Information Agency and the demise of public diplomacy is preventing a counter to the CCP\'s narrative. Dissident leaders like Lech Walesa of Poland visited agencies like the Voice of America after the end of the Cold War and expressed the hope that VOA gave them in their fight for freedom. Today, the VOA often provides a platform for CCP propaganda as journalists there seek to be "balanced."',
                    "As a last thought, I wanted to share a few books that Stealth War reader Rhea shared with me: Sources of Chinese Tradition, Vol 1 and Bruce Lee: A Life.   I'm not certain what Rhea's background is, but she has great insight into the culture and history of China.  I haven't read these two books yet, but I'm definitely adding the Bruce Lee one to my list!  Send me a message and let me know what books your reading, too. Stay safe and healthy Stealth Warriors!",
                ],
            },
            {
                blog_id: 2,
                created_date: 'March 12, 2020',
                created_date_short: 'March 12, 2020',
                category: 'Speaking Tours',
                image_url: '../images/spalding/blog/E-A-I-R.jpg',
                title: 'Educate, Advocate, Influence and Repeat',
                short_desc: 'The Global Campaign',
                long_text: [
                    { img: '../images/spalding/blog/E-A-I-R.jpg' },
                    '<b>The Global Campaign</b>',
                    'Late February travels took me as far south as sunny Lyford Cay in the Bahamas and north, to winter-chilled Ottawa, Canada.',
                    'In the Bahamas, I listened to the challenges locals face as Chinese investments pour in, and policy from CCP-influenced local politicians flows out into the community. The Stealth War book event, hosted by a PACT donor, was standing room only. I spoke to a crowd of 115 about the threats incurred by the Chinese Communist Party influence, affecting both America and the Bahamas. I also had the pleasure of meeting with Dr. Henry Kissinger once again. We reflected on the Chinese Communist Party and how their influence has evolved since the late 1970s. Our conversation focused on the difference in national security challenges in a digital world; the 20th century was about geography, while the 21st is about data. All during my visit, Chinese vessels marred the beautiful horizon, scraping the sea bottom for sponges and doing grave damage to the ocean ecosystem. This is one more tick on a long list of environmental offenses committed with CCP approval.',
                    'In Ottawa, I was invited to attend the Macdonald-Laurier Institute’s 10th Anniversary Celebration Dinner. I gave the keynote address along with David Mulroney, former Canadian Ambassador to China and Distinguished Fellow, Munk School of Global Affairs and Public Policy. My comments focused on the importance of data security in a 5G world and were well-received by the international attendees. Many, including the German Ambassador, came up to me afterward and remarked how they were unaware of the implications of unsecured 5G. Many of the audience members, including Canadian Members of Parliament, took note and requested a follow-up. It seems I will be going back soon to answer more speaking requests. It is evident that there is a great demand for understanding the geopolitical changes occurring in our world and how best to approach policymaking. Despite the media to the contrary, America still has a lot of friends and influence in the neighborhood.',
                    { img: '../images/spalding/blog/E-A-I-R-2.jpg' },
                    '<b>The Campaign at home</b>',
                    'In addition to the travel, I spoke at several local events including the Global Institute of Taiwan, George Washington University, and the Potomac Culture Salon with PACT board member Dr. Sasha Gong. At the Salon, I had the honor of speaking with not only Chinese-Americans who are passionate about raising awareness of Chinese Communism in the US, but also dissidents and two “Tiananmen Heroes” whose action and dedication earned them time as CCP political prisoners. Several media teams, including Radio Free Asia, broadcast the message globally. Some even drilled the Stealth War message right through the Great Firewall into Mainland China. The day reinforced my absolute belief that there are two distinct Chinas – the Party and the People. My hope is always with the People.',
                    { img: '../images/spalding/blog/E-A-I-R-3.jpg' },
                    { img: '../images/spalding/blog/E-A-I-R-4.jpg' },
                    '<b>The Media Campaign</b>',
                    'The requests for radio, TV and podcast interviews in both Canada and the US, as well as interviews with the UK and Poland, continue. Every radio broadcast, TV appearance, podcast and YouTube video serves the purpose of keeping the issue focused in people’s minds. We have nine months until our November election, and I intend to educate, advocate, influence and repeat the message until the issue is forefront in the election. I look forward to your comments and welcome your thoughts and feedback.',
                    { img: '../images/spalding/blog/E-A-I-R-5.jpg' },
                ],
            },
            {
                blog_id: 3,
                created_date: 'March 12, 2020',
                created_date_short: 'Mar 12, 2020',
                category: 'Speaking Tours',
                image_url: '../images/spalding/blog/Power-of-words.jpg',
                title: 'The Power of Words to Create Momentum',
                short_desc: 'Early February was busy!',
                long_text: [
                    { img: '../images/spalding/blog/Power-of-words.jpg' },
                    'Early February was busy!',
                    'In addition to numerous radio interviews, I was on Fox News with Shannon Bream to talk about the CCP’s complicity in the coronavirus epidemic.',
                    'International outreach is essential to keeping our own nation safe. My letter to the people of the UK posted in the Telegraph, generated several interviews with BBC TV and radio, as well as interviews in Australia and New Zealand. As a result of almost a year-long effort in raising awareness in the UK, I’ve been asked to be a fellow at the Henry Jackson Society in London. ',
                    'The people of Poland are still struggling to repel the CCP; I have done several more interviews with the Polish press on the subject. I also had the honor of meeting with Taiwan’s VP-elect Lai Ching-te at the Hudson Institute. He is the highest-ranking member of the Taiwan government to come for an official visit to our nation’s capital since 1979. You can be absolutely sure Beijing has taken note of this.',
                    "I traveled across the state of Florida spreading the message of the CCP's Stealth War on freedom. Willem de Vogel, PACT board member and advocate, escorted me to Hobe Sound, Boca Grande, Vero Beach, Palm Beach and Miami. In Boca Grande, Congressman Tom Graves from Georgia lent his expertise in cybersecurity to the conversation. In addition to cyber expert, Tom has served since 2010, and sits on the House Committee of Appropriations and the Select Committee on the Modernization of Congress. The reception was exceptional. The men and women I spoke to were abhorred by the depths of CCP deviousness and impassioned to join the call to action.",
                    'Although China is in the news, Americans are constantly surprised by what the mainstream media is not reporting on. People are beginning to understand and react to the message. I believe there will be a powerful outpouring in 2020 as Americans choose to take back control of their future.',
                ],
            },
            {
                blog_id: 4,
                created_date: 'January 17, 2020',
                created_date_short: 'Jan 17, 2020',
                category: 'International',
                image_url: '../images/spalding/blog/stealth-war-goes-global.jpg',
                title: 'Stealth War Goes Global ',
                short_desc: 'Taiwan:',
                long_text: [
                    { img: '../images/spalding/blog/stealth-war-goes-global-2.jpg' },
                    '<b>Taiwan:</b>',
                    "Last week, I spent five days marveling at Taiwan's democracy. I was there for a dual purpose: launching the Chinese version of Stealth War 隐形战 and leading a delegation of 12 scholars.",
                    "There were two exciting, yet peaceful campaign rallies in the nation's capital and not a hostile word said that I could hear. Everyone was respectful and merely showed excitement for their candidate; this despite sharp divisions on policy. The KMT wanted to move closer to China, while the DPP – the victor – favored strengthening the relationship with the US.  There is a lot we can learn from Taiwan. They only recently became a democracy from an authoritarian regime and have a vibrant, civil society.",
                    'I was also able to go to a polling place and watch the votes being counted. It was open to the public and any Taiwanese citizen could dispute any ballot.',
                    'The book launch was a success. I was able to speak to a packed house and give a short reading in Chinese of Stealth War. I signed almost 600 books, with more than 5,000 copies sold! Stealth War Taiwan',
                    'I came back inspired about the future of democracy. Now we must get to work strengthening our own backyard. We must inoculate our institutions against foreign totalitarian influence. We must invest in infrastructure, manufacturing, science and technology and STEM education. We must build a secure nationwide 5G Internet where every citizen’s data is protected.',
                    'We must dream again!',
                    { img: '../images/spalding/blog/stealth-war-goes-global-3.jpg' },
                    '<b>Eastern Europe:</b>',
                    'In December, I traveled to Poland and Lithuania.',
                    'In Poland, we launched the Polish-language version of Stealth War (NIEWIDZIALNA WOJNA, 2019, Wydawnictwo Jeden Świat). The publisher ordered 1500 copies of the book. It immediately sold out (that equals best seller status in Poland) and a second reprint was ordered. I signed books for many excited fans of Stealth War. Unfortunately, Poland is currently under severe pressure by the Chinese government to accept Belt and Road investments, so I hope they choose wisely.  Stealth War Poland',
                    'Lithuania is working to protect all citizens from internet attacks. They can order people’s devices to be disconnected for up to 48 hours if they discover they’ve been hacked. Their ministry of defense has appointed a new Vice Minister for cyber security who is responsible for protecting the country’s data. Protecting data is something written into our own National Security Strategy on page 19 – we will build a "secure nationwide 5G network." Secure 5G means rethinking and redesigning versus reusing what currently exists. More to come on this in another post.',
                    'I look forward to working with Lithuania to help strengthen their cybersecurity for years to come. Thankfully, Lithuania has decided not to accept CCP money.',
                    { img: '../images/spalding/blog/stealth-war-goes-global-4.jpg' },
                ],
            },
            {
                blog_id: 5,
                created_date: 'January 17, 2020',
                created_date_short: 'Jan 17, 2020',
                category: '5G',
                image_url: '../images/spalding/blog/five-g.jpg',
                title: 'Why secure 5G?',
                short_desc: 'When I wrote this report in 2017, I was the Senior Director for Strategy at the National Security Council for the White House. The study covers 5G technology and the opportunities and challenges for US national security....',
                long_text: [
                    { img: '../images/spalding/blog/five-g.jpg' },
                    'When I wrote this report in 2017, I was the Senior Director for Strategy at the National Security Council for the White House. The study covers 5G technology and the opportunities and challenges for US national security.',
                    'It was necessary in 2017 and still relevant today. After a thorough review, it was clear the CCP had moved ahead of the US technologically. America needs to get serious about technological competition, or risk being subsumed by a world where economic, technological and social terms are dictated to the US by the CCP.',
                    'My report was leaked because of the fear expressed by the telco industry. They are currently swimming in debt and do not have the money or interest to invest in secure 5G. More importantly, because they want to sell consumer data, they have no interest in building a secure network. Since use cases like remote surgery create risks for citizens, it is imperative the network be built with military-grade security standards.',
                    'The full report is attached to this Axios article and still offers good insight on 5G technology and the policy ramifications:  https://www.axios.com/trump-team-debates-nationalizing-5g-network-f1e92a49-60f2-4e3e-acd4-f3eb03d910ff.html',
                ],
            },
            {
                blog_id: 6,
                created_date: 'December 31, 2019',
                created_date_short: 'Dec 31, 2019',
                category: 'CCP',
                image_url: '../images/spalding/blog/how-ccp-controls.jpg',
                title: 'How the CCP controls: Technology, Fear, and the Pursuit of Wealth',
                short_desc: 'Why would Michael Bloomberg say that Xi is not a dictator? Why do some Americans believe China is a democracy? It is difficult for people to fathom how a party of 80 million can control a population of almost 1.4 billion...',
                long_text: [
                    { img: '../images/spalding/blog/how-ccp-controls.jpg' },
                    'Why would Michael Bloomberg say that Xi is not a dictator? Why do some Americans believe China is a democracy? It is difficult for people to fathom how a party of 80 million can control a population of almost 1.4 billion. It is all about controlling the narrative – something that modern technology has made easy for totalitarians. When you combine technology like machine learning, artificial intelligence, social media and big data, surveillance and influence can be driven to the level of the individual. This wizardry when combined with the fear created by the People’s Armed Police and the Ministry of State Security makes it easy for the citizens of the PRC to focus on less controversial pursuits. Finally, economic and financial incentives then become the chute for funneling people towards a perceived open, but in reality, almost completely closed version of society that conforms with CCP interests.',
                    'I describe more here in a LinkedIn article titled – What is China? - https://www.linkedin.com/pulse/what-china-dr-rob-spalding-brig-gen-usaf-ret-/',
                    'Watch this to better understand - https://nextshark.com/young-chinese-students-speech-goes-viral-gets-censored-real/',
                ],
            },
            {
                blog_id: 7,
                created_date: 'December 28, 2019',
                created_date_short: 'Dec 28, 2019',
                category: 'Strategy',
                image_url: '../images/spalding/blog/vision-2020.jpg',
                title: 'VISION 2020: Rebuilding American Power',
                short_desc: '',
                long_text: [
                    { img: '../images/spalding/blog/vision-2020.jpg' },
                    { img: '../images/spalding/blog/vision-2020-page2.jpg' },
                    { img: '../images/spalding/blog/vision-2020-page3.jpg' },
                    { img: '../images/spalding/blog/vision-2020-page4.jpg' },
                    { img: '../images/spalding/blog/vision-2020-page5.jpg' },
                    { img: '../images/spalding/blog/vision-2020-page6.jpg' },
                    { img: '../images/spalding/blog/vision-2020-page7.jpg' },
                    { img: '../images/spalding/blog/vision-2020-page8.jpg' },
                    { img: '../images/spalding/blog/vision-2020-page9.jpg' },
                    { img: '../images/spalding/blog/vision-2020-page10.jpg' },
                    { img: '../images/spalding/blog/vision-2020-page11.jpg' },
                ],
            },
            {
                blog_id: 8,
                created_date: 'December 24, 2019',
                created_date_short: 'Dec 24, 2019',
                category: null,
                image_url: null,
                title: 'Happy Holidays!',
                short_desc: '',
                long_text: null,
            },
            {
                blog_id: 9,
                created_date: 'December 5, 2019',
                created_date_short: 'Dec 5, 2019',
                category: 'Reading List',
                image_url: '../images/spalding/blog/educate-and-advocate.jpg',
                title: 'Educate and advocate: the journey continues',
                short_desc: 'Every journey we have is a series of single steps.  If we are lucky, we find fellow travelers to share the path.',
                long_text: [
                    { img: '../images/spalding/blog/educate-and-advocate2.jpg' },
                    '<b>Every journey we have is a series of single steps. If we are lucky, we find fellow travelers to share the path.</b>',
                    '<b>Rob</b>',
                    '\n\n\n\n',
                    '<i>Chinese companies get away with not sharing auditing information despite having access to US capital markets. This enables the fleecing of working Americans as their retirement funds go into companies that eventually go bankrupt. The movie The China Hustle describes some of the schemes these Chinese companies commit. (Subscription to the Financial Times needed https://on.ft.com/372qg4v)</i>',
                    '<b>Chinese companies caught in SEC crossfire </b>',
                    '<b>By Simon Rabinovitch in Beijing and Paul J Davies in Hong Kong</b>',
                    '<b>https://www.ft.com/content/0b08be98-3dce-11e2-b8b2-00144feabdc0</b>',
                    '<i>Tom Wright’s and Bradley Hope’s article shows how the Chinese Communist Party uses infrastructure investment for influence. (Subscription needed to read the full story, WSJ allows three free stories per month)</i>',
                    '<b>WSJ Investigation: China Offered to Bail Out Troubled Malaysian Fund in Return for Deals</b>',
                    '<b>The secret discussions show how China uses its political and financial clout to bolster its position overseas</b>',
                    '<b>By Tom Wright and Bradley Hope</b>',
                    '<b>https://www.wsj.com/articles/how-china-flexes-its-political-muscle-to-expand-power-overseas-11546890449?shareToken=st753df5d517cf4043bac9e2b53151c213&ref=article_email_share</b>',
                    '<i>The Tiananmen Papers detail the doctrine adopted by the Chinese Communist Party after the Tiananmen Massacre in 1989.</i>',
                    '<i>1) The CCP is under attack from the US in league with Chinese students.</i>',
                    '<i>2) The CCP needs globalization and the internet but must strengthen its ideological work to prevent the growth of democracy.</i>',
                    '<i>And the most important point.</i>',
                    '<i>3) If the party is separated from the people it will fail. This led to forced indoctrination at all grade levels and the Great Firewall. (Subscription or registration required)</i>',
                    '<b>The New Tiananmen Papers</b>',
                    '<b>Inside the Secret Meeting That Changed China</b>',
                    '<b>By Andrew J. Nathan</b>',
                    '<b>https://www.foreignaffairs.com/articles/china/2019-05-30/new-tiananmen-papers</b>',
                    '<i>This document shows how the digital world makes it much easier to change history. (Subscription required https://on.ft.com/2q9OI3o)</i>',
                    '<b>China rewrites history with new censorship drive</b>',
                    '<b>By Ben Bland</b> in Hong Kong',
                    '<b>https://www.ft.com/content/4ffac53e-8ee4-11e7-9084-d0c17942ba93</b>',
                    '<i>This shows how much of Chinese language media in the US is controlled by the Chinese Communist Party. This enables the party to control the narrative outside of China. Even the US Agency for Global Media employs Chinese nationals for its programs ensuring the CCP narrative is carried by Radio Free Asia and the VOA. (Subscription needed to read the full story, WSJ allows three free stories per month)</i>',
                    '<b>Justice Department Has Ordered Key Chinese State Media Firms to Register as Foreign Agents</b>',
                    '<b>Order uses law employed in Manafort case, and comes amid an escalating trade conflict between Washington and Beijing</b>',
                    '<b>By Kate O’Keeffe and Aruna Viswanatha</b>',
                    '<b>https://www.wsj.com/articles/justice-department-has-ordered-key-chinese-state-media-firms-to-register-as-foreign-agents-1537296756</b>',
                ],
            },
            {
                blog_id: 10,
                created_date: 'December 2, 2019',
                created_date_short: 'Dec 2, 2019',
                category: 'Reading List',
                image_url: '../images/spalding/blog/journey-to-stealth-war.jpg',
                title: 'Journey to Stealth War',
                short_desc: 'The more that you read, the more things you will know. The more that you learn, the more places you’ll go. —Dr. Seuss',
                long_text: [
                    '<b><i>The more that you read, the more things you will know. The more that you learn, the more places you’ll go.</i>—Dr. Seuss</b>',
                    'The documents, articles and books on this list are important steps on the journey to discovering how to counter the Chinese Communist Party’s Stealth War against the US. To paraphrase the wisest sage – the more you read, the more you will know. The more we learn, the further our fight will go.',
                    'Thank you for joining me on this journey,',
                    'Rob',
                    { img: '../images/spalding/blog/journey-to-stealth-war-2.jpg' },
                    "<i>I first read this report while at the Pentagon on the Joint Staff. When I was hired to be a senior director for strategy on the National Security Council at the White House, I began a series of informal dialogues called “Winning without War.” James Mulvenon was the inaugural speaker. The report serves as a good prelude to the Section 301 investigation by the Office of the United States Trade Representative into China’s acts, policies and practices, from which springs today's tariffs on the CCP.</i>",
                    '<b>Chinese Industrial Espionage: Technology Acquisition and Military Modernisation (Asian Security Studies) 1st Edition</b>',
                    '<b>by William C. Hannas, James Mulvenon and Anna B. Puglisi</b>',
                    'https://www.amazon.com/Chinese-Industrial-Espionage-Acquisition-Modernisation/dp/0415821428',
                    '<i>Most CEOs have not read the Findings but should. This is an important report from 2018. It will be an interesting story when the full explanation of its creation comes out.</i>',
                    '<b>Office of the United States Trade Representative, Executive Office of the President</b>',
                    '<b>Findings of the Investigation into China’s Acts, Policies, and Practices Related to Technology Transfer, Intellectual Property, and Innovation under Section 301 of the Trade Act of 1974</b>',
                    'https://ustr.gov/sites/default/files/Section%20301%20FINAL.PDF',
                    '<i>I had the honor of speaking at the KAS-ASPI conference in Berlin and Brussels, Oct 2019. Samantha Hoffman’s, a fellow attendee and speaker, article describes the importance of data in a globalized and internet-connected world. In the National Security Strategy, we said that data is a strategic resource. This article explains that concept. It also supports the need for a nationwide secure 5G network.</i>',
                    "<b>Engineering global consent: The Chinese Communist Party's data-driven power expansion</b>",
                    '<b>By Samantha Hoffman</b>',
                    'https://www.aspi.org.au/report/engineering-global-consent-chinese-communist-partys-data-driven-power-expansion',
                    '<i>I read this memoir several years ago. Lt Gen Glenn Kent was an interesting character and had a unique approach to thinking about national security. His work on understanding the economics behind deterrence helped the US focus on growing the economy by choosing an efficient means of countering Soviet strategy. Today, the CCP has flipped the script on the US, and arrayed an efficient and asymmetric force against the US in the Indo-Pacific.</i>',
                    "<b>Thinking About America's Defense: An Analytical Memoir</b>",
                    '<b>by Glenn A. Kent, David Ochmanek, Michael Spirtas, Bruce R. Pirnie</b>',
                    'https://www.rand.org/pubs/occasional_papers/OP223.html',
                    '<i>Congressman Adam Smith makes a good point: everything cannot be a priority when it comes to defense spending. America is going broke because we cannot make good trade-offs. Opportunity cost, the loss of potential gain from other alternatives when one alternative is chosen, is an important economic concept missing from American National Security policy until our current National Security Strategy. For example, we could put 200,000 American kids through 4-year STEM programs with the money we spend each year in Afghanistan.</i>',
                    '<b>Adam Smith expects future defense budgets to dip below $716 billion</b>',
                    '<b>by Aaron Mehta</b>',
                    'https://www.defensenews.com/smr/defense-news-conference/2018/09/05/adam-smith-expects-future-defense-budgets-to-dip-below-716-billion/',
                    '<i>Nadège Rolland’s study is the best I have read on the Chinese Communist Party’s Belt and Road. She has spent a great amount of time researching Chinese source documents. I also like how she contrasts US and CCP strategy making.</i>',
                    "<b>China's Eurasian Century?\nPolitical and Strategic Implications of the Belt and Road Initiative</b>",
                    '<b>by Nadège Rolland</b>',
                    'https://www.nbr.org/publication/chinas-eurasian-century-political-and-strategic-implications-of-the-belt-and-road-initiative/',
                    '<i>I spoke with Jonathan Swan after someone at the National Security Council (NSC) leaked my paper. I know this because the version that was leaked only went to the NSC. He said that whoever it was told him it was a stupid idea, and Spalding was sent back to DoD as a result. At the time, I had not even briefed the National Security Advisor on the report. I told Swan that I never considered nationalizing the network, but evidently that narrative is what made the article “news-worthy.” This report, however, has aged well considering the concern about 5G today.</i>',
                    '<b>Scoop: Trump team considers nationalizing 5G network</b>',
                    '<b>by Jonathan Swan, David McCabe, Ina Fried, Kim Hart</b>',
                    'https://www.axios.com/trump-team-debates-nationalizing-5g-network-f1e92a49-60f2-4e3e-acd4-f3eb03d910ff.html',
                ],
            },
        ]);
        this.filteredBlogs = ko.observable(this.allBlogs());
        this.selectedBlog = ko.observable(null);
        this.categoryFilter = ko.observable('');
        this.init = () => {
            this.setupCarouselImages();
            this.contactEmail.subscribe((val) => {
                console.log(this.contactEmailSelected());
                if (this.contactEmailSelected()) {
                    const placeholder = document.getElementsByClassName('placeholder')[1];
                    placeholder.classList.add('placeholderMove');
                }
            });
            this.contactName.subscribe((val) => {
                if (this.contactNameSelected()) {
                    const placeholder = document.getElementsByClassName('placeholder')[0];
                    placeholder.classList.add('placeholderMove');
                }
            });
            this.categoryFilter.subscribe((val) => {
                if (val === '') {
                    this.filteredBlogs(this.allBlogs());
                    return;
                }
                const temp = this.allBlogs().filter((blog) => blog.category === val);
                this.filteredBlogs(temp);
            });
        };
        // switchBlogPage = (id: number) => {
        // 	if (id === 0) {
        // 		console.log(this.blogPageShown())
        // 		this.displayBlogs(this.allBlogs())
        // 		return
        // 	}
        // 	const selected = this.blogFullVersion().filter(
        // 		(item) => item.blog_id === id
        // 	)
        // 	console.log(selected)
        // 	this.displayBlogFullVersion(selected)
        // }
        // getPostbyCategory = (category: string) => {
        // 	if (category === '') {
        // 		this.displayBlogs(this.allBlogs())
        // 		return
        // 	}
        // 	const filtered = this.allBlogs().filter(
        // 		(item) => item.category === category
        // 	)
        // 	this.displayBlogs(filtered)
        // }
        this.getDate = (date) => {
            try {
                const date_now = new Date();
                const date_created = new Date(date);
                const time_difference = date_now.getTime() - date_created.getTime();
                if (time_difference >= 0 && time_difference < 1000) {
                    const milliseconds = 'now';
                    return milliseconds;
                }
                else if (time_difference >= 1000 && time_difference < 60000) {
                    const seconds = Math.floor(time_difference / 1000);
                    const seconds_display = seconds + 's';
                    return seconds_display;
                }
                else if (time_difference >= 60000 && time_difference < 3600000) {
                    const minutes = Math.floor(time_difference / 60000);
                    const minutes_display = minutes + 'm';
                    return minutes_display;
                }
                else if (time_difference >= 3600000 && time_difference < 86400000) {
                    const hours = Math.floor(time_difference / 3600000);
                    const hours_display = hours + 'h';
                    return hours_display;
                }
                else {
                    const month_text = [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                    ];
                    const date = date_created.getDate();
                    const month = month_text[date_created.getMonth()];
                    const year = date_created.getFullYear();
                    const monthDateYear = month + ' ' + date + ',' + ' ' + year;
                    return monthDateYear;
                }
            }
            catch (e) {
                console.log(e, 'Something wrong with data or function');
            }
        };
        this.navigatePage = (page) => {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu ? mobileMenu.classList.remove('openMenu') : null;
            this.currentPage(page);
        };
        this.setupCarouselImages = () => {
            new Promise((res, rej) => {
                const images = [];
                for (let i = 0; i <= this.totalImages; i++) {
                    images.push(`${this.carouselImageBase}${i}`);
                }
                this.carouselImages(images);
            }).then((res) => {
                this.selectCarouselImage(0);
            });
        };
        this.selectCarouselImage = (index, init = false) => {
            this.lastCarouselIndex(this.currentCarouselIndex());
            this.currentCarouselIndex(index);
            const carouselImage = document.getElementById(this.carouselImages()[index]);
            const carouselMenuImage = document.getElementById(`${this.carouselImages()[index]}-menu`);
            carouselMenuImage.classList.add('spalding_selectImageMenuBorder');
            carouselImage.classList.add('spalding_selectedImage');
            if (!init) {
                if (this.lastCarouselIndex() !== this.currentCarouselIndex()) {
                    const lastCarouselMenuImage = document.getElementById(`${this.carouselImages()[this.lastCarouselIndex()]}-menu`);
                    lastCarouselMenuImage.classList.remove('spalding_selectImageMenuBorder');
                }
            }
            carouselMenuImage.scrollIntoView({
                block: 'nearest',
                inline: 'center',
                behavior: 'smooth',
            });
            setTimeout(() => {
                carouselImage.scrollIntoView({
                    block: 'nearest',
                    inline: 'center',
                    behavior: 'smooth',
                });
            }, 200);
            this.removeClass(index);
        };
        this.removeClass = (index) => {
            let before = null;
            let after = null;
            if (index === 0) {
                before = document.getElementById(this.carouselImages()[this.totalImages]);
                after = document.getElementById(this.carouselImages()[index + 1]);
            }
            else if (index === this.totalImages) {
                before = document.getElementById(this.carouselImages()[index - 1]);
                after = document.getElementById(this.carouselImages()[0]);
            }
            else {
                before = document.getElementById(this.carouselImages()[index - 1]);
                after = document.getElementById(this.carouselImages()[index + 1]);
            }
            before ? before.classList.remove('spalding_selectedImage') : null;
            after ? after.classList.remove('spalding_selectedImage') : null;
        };
        this.navigateImage = (direction) => {
            console.log('NAVIGATING IMAGES');
            switch (direction) {
                case 'previous':
                    if (this.currentCarouselIndex() === 0) {
                        this.selectCarouselImage(this.totalImages);
                        return;
                    }
                    this.selectCarouselImage(this.currentCarouselIndex() - 1);
                    break;
                case 'next':
                    if (this.currentCarouselIndex() === this.totalImages) {
                        this.selectCarouselImage(0);
                        return;
                    }
                    this.selectCarouselImage(this.currentCarouselIndex() + 1);
                    break;
                default:
                    break;
            }
        };
        this.scrollMenu = (direction) => {
            const carouselMenu = document.getElementById('carouselMenu');
            console.log(carouselMenu);
            switch (direction) {
                case 'backwards':
                    carouselMenu.scrollBy({ left: -200, behavior: 'smooth' });
                    break;
                case 'forwards':
                    carouselMenu.scrollBy({ left: 200, behavior: 'smooth' });
                    break;
                default:
                    break;
            }
        };
        this.mobileMenuAction = () => {
            const mobileMenu = document.getElementById('spalding_mobileMenu');
            console.log(mobileMenu);
            this.mobileMenuOpen()
                ? mobileMenu.classList.remove('spalding_openMenu')
                : mobileMenu.classList.add('spalding_openMenu');
            this.mobileMenuOpen(!this.mobileMenuOpen());
        };
        // GET TWEETS!!
        this.init();
    }
}
