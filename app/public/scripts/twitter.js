const OneMin = 1000 * 60;
const OneHour = OneMin * 60;
const OneDay = OneHour * 24;
const limit = 4;
const eachLine = 1;
class twitter {
    constructor(twitterObj, twitterHref, serialNumber, buffer, showAccount) {
        this.twitterObj = twitterObj;
        this.twitterHref = twitterHref;
        this.serialNumber = serialNumber;
        this.buffer = buffer;
        this.showAccount = showAccount;
        this.text_following = ['正在关注', 'フォロー中', 'Following', '個跟隨中'];
        this.text_follower = ['个关注者', 'フォロワー', 'Followers', '位跟隨者'];
        this.retweeted = ['转推了', 'さんがリツイート', 'Retweeted', '已轉推'];
        this.twitterTimeArray = ko.observableArray(this.twitterObj);
        this.showTimeData = [
            dataTimeString => {
                return this.getTime(dataTimeString, 0);
            },
            dataTimeString => {
                return this.getTime(dataTimeString, 1);
            },
            dataTimeString => {
                return this.getTime(dataTimeString, 2);
            },
            dataTimeString => {
                return this.getTime(dataTimeString, 3);
            },
        ];
        this.showUserTimeData = [
            dataTimeString => {
                return this.getTimeUser(dataTimeString, 0);
            },
            dataTimeString => {
                return this.getTimeUser(dataTimeString, 1);
            },
            dataTimeString => {
                return this.getTimeUser(dataTimeString, 2);
            },
            dataTimeString => {
                return this.getTimeUser(dataTimeString, 3);
            },
        ];
        this.min = ['分', '分', 'm', '分'];
        this.hours = ['小时', '時間', 'h', '小時'];
        this.mouth = ['月', '月', '', '月'];
        this.month_eng = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    getmonth(mon, leng) {
        if (leng === 2) {
            return this.month_eng[mon];
        }
        return `${mon + 1}${this.mouth[leng]}`;
    }
    getTimeUser(timeString, lang) {
        const now = new Date();
        const create = new Date(timeString);
        const range = now.getTime() - create.getTime();
        if (range < OneDay) {
            return this.getTime(timeString, lang).replace('·', '');
        }
        if (lang === 2) {
            return `${this.getTime(timeString, lang).replace('·', '')} ${create.getFullYear()}`;
        }
        return `${create.getFullYear()}年${this.getTime(timeString, lang).replace('·', '')}日`;
    }
    getTime(timeString, lang) {
        const now = new Date();
        const create = new Date(timeString);
        const range = now.getTime() - create.getTime();
        /**
         *      less than one day
         */
        if (range < OneDay) {
            /**
             *      less than one hour
             */
            if (range < OneHour) {
                const mins = Math.round(range / OneMin);
                return `· ${mins}${this.min[lang]}`;
            }
            const hour = Math.round(range / OneHour);
            return `· ${hour}${this.hours[lang]}`;
        }
        const month = create.getMonth();
        const day = create.getDate();
        return `· ${this.getmonth(month, lang)}${lang === 2 ? ' ' : ''}${day}`;
    }
    textareaHeight(index, Quoted = false) {
        const twitterObj = this.twitterTimeArray()[index];
        const id = twitterObj.id;
        const d = document.getElementById(id);
        const lines = twitterObj.full_text.split('\n');
        /*
        if ( lines < 2 ) {
            const totalText = twitterObj.full_text.length
            if ( totalText > 119 ) {
                return '3rem'
            }
            if ( totalText > 119 ) {
                return '3rem'
            }
        }
        */
        //const high = limit + lines.length * eachLine 
        //return high + 'rem'
        const high = d.scrollTop + d.scrollHeight + (Quoted ? 16 : 0);
        return high + 'px';
    }
    userTextareaHeight(id) {
        const d = document.getElementById(id);
        /*
        if ( lines < 2 ) {
            const totalText = twitterObj.full_text.length
            if ( totalText > 119 ) {
                return '3rem'
            }
            if ( totalText > 119 ) {
                return '3rem'
            }
        }
        */
        //const high = limit + lines.length * eachLine 
        //return high + 'rem'
        const high = d.scrollTop + d.scrollHeight;
        return high + 'px';
    }
    userCountFormat(cc) {
        const hh = cc.toString();
        return hh.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}
