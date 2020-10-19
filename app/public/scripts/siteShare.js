/*!
 * Copyright 2018 CoNET Technology Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const uuid_generate = function () {
    let lut = [];
    for (let i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + i.toString(16);
    }
    let d0 = (Math.random() * 0xffffffff) | 0;
    let d1 = (Math.random() * 0xffffffff) | 0;
    let d2 = (Math.random() * 0xffffffff) | 0;
    let d3 = (Math.random() * 0xffffffff) | 0;
    return (lut[d0 & 0xff] +
        lut[(d0 >> 8) & 0xff] +
        lut[(d0 >> 16) & 0xff] +
        lut[(d0 >> 24) & 0xff] +
        '-' +
        lut[d1 & 0xff] +
        lut[(d1 >> 8) & 0xff] +
        '-' +
        lut[((d1 >> 16) & 0x0f) | 0x40] +
        lut[(d1 >> 24) & 0xff] +
        '-' +
        lut[(d2 & 0x3f) | 0x80] +
        lut[(d2 >> 8) & 0xff] +
        '-' +
        lut[(d2 >> 16) & 0xff] +
        lut[(d2 >> 24) & 0xff] +
        lut[d3 & 0xff] +
        lut[(d3 >> 8) & 0xff] +
        lut[(d3 >> 16) & 0xff] +
        lut[(d3 >> 24) & 0xff]);
};
const bingIcon = `
    <svg viewBox="-650 800 900 400">
    <path style="fill:#008373;fill-opacity:1;stroke:none" d="m -311.5,796.16903 80.6273,28.36401 0,283.80836 113.56729,-65.5599 -55.67962,-26.1246 -35.12739,-87.43067 178.939297,62.86452 0,91.39515 -201.653597,116.3102 -80.67328,-44.875 z" />
    </svg>
`;
const googleIcon = `<svg viewBox="-40 0 150 150">
  <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"></path>
  </svg>
`;
const duckduckgoIcon = `
  <svg viewBox="-6 0 210 210" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(-24.5 -19)">
        <circle cx="127" cy="79" fill="#de5833" r="60"/>
        <path d="m177.8 57.5c-2.8-6.6-6.8-12.5-11.8-17.5-5.1-5.1-11-9-17.5-11.8-6.8-2.9-14-4.3-21.5-4.3-7.4 0-14.7 1.5-21.5 4.3-6.6 2.7-12.5 6.7-17.5 11.8-5.1 5.1-9 11-11.8 17.5-2.9 6.8-4.3 14-4.3 21.5 0 7.5 1.5 14.7 4.3 21.5 2.8 6.6 6.8 12.5 11.8 17.5 5.1 5.1 11 9 17.5 11.8 6.8 2.9 14 4.3 21.5 4.3 7.4 0 14.7-1.5 21.5-4.3 6.5-2.8 12.4-6.8 17.5-11.8 5.1-5.1 9-11 11.8-17.5 2.9-6.8 4.3-14 4.3-21.5 0-7.5-1.4-14.7-4.3-21.5zm-38.8 71c-3.2-5.4-11.6-20.5-11.6-31.7 0-25.8 17.3-3.7 17.3-24.3 0-4.9-2.4-22.1-17.4-25.7-3.7-4.9-12.4-9.6-26.2-7.7 0 0 2.3.7 4.9 2 0 0-5 .7-5.2 4.1 0 0 9.9-.5 15.5 1.3-12.9 1.7-19.5 8.5-18.3 20.8 1.7 17.5 9.1 48.7 11.7 59.6-19.6-7-33.7-25.8-33.7-47.9 0-28.1 22.8-51 51-51 28.2 0 51 22.8 51 51-.1 24-16.7 44.1-39 49.5z" fill="#fff"/>
        <path clip-rule="evenodd" d="m124.2 87.3c0-6.6 9-8.7 12.4-8.7 9.2 0 22.2-5.9 25.4-5.8 3.3.1 5.4 1.4 5.4 2.9 0 2.2-18.4 10.5-25.5 9.8-6.8-.6-8.4.1-8.4 2.9 0 2.4 4.9 4.6 10.3 4.6 8.1 0 16-3.6 18.4-1.9 2.1 1.5-5.5 6.9-14.2 6.9-8.7 0-23.8-4.1-23.8-10.7z" fill="#fed30a" fill-rule="evenodd"/>
        <path d="m140.2 59.3c-2.4-3.1-6.7-3.2-8.2.4 2.3-1.8 5.1-2.2 8.2-.4z" fill="#2d4f8d"/>
        <path d="m113.5 59.4c-3.3-2-8.8-2.2-8.5 4.1 1.6-3.9 3.8-4.6 8.5-4.1z" fill="#2d4f8d"/>
        <path d="m138.2 65.2c-1.8 0-3.3 1.5-3.3 3.3 0 1.8 1.5 3.3 3.3 3.3 1.8 0 3.3-1.5 3.3-3.3 0-1.8-1.5-3.3-3.3-3.3zm1.2 3.1c-.5 0-1-.4-1-1 0-.5.4-1 1-1 .6 0 1 .4 1 1-.1.5-.5 1-1 1z" fill="#2d4f8d"/>
        <path d="m112.6 67c-2.1 0-3.8 1.7-3.8 3.8 0 2.1 1.7 3.8 3.8 3.8 2.1 0 3.8-1.7 3.8-3.8 0-2.1-1.7-3.8-3.8-3.8zm1.4 3.5c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1z" fill="#2d4f8d"/>
        <path d="m104.3 50.8c-4.8 3.5-7 8.9-6.3 16.5 1.7 17.5 9.1 48.8 11.7 59.7.9.3 1.8.6 2.7.9-1.6-6.6-9.3-38.8-12.7-63.5-.9-6.6 1.7-10.5 4.6-13.6z" fill="#d5d7d8"/>
        <path d="m116.2 46.5c.4 0 .7-.1.7-.1-5.2-2.5-13.4-2.6-15.6-2.6-.2.4-.4.9-.4 1.4-.1.1 9.6-.5 15.3 1.3z" fill="#d5d7d8"/>
        <path d="m106.8 41.1c-1.6-1.1-2.9-1.8-3.7-2.2-.7.1-1.3.1-2 .2 0 0 2.3.7 4.9 2 0 0-.1 0-.2 0 .7 0 1 0 1 0z" fill="#d5d7d8"/>
        <path d="m147.1 107.6c-1.7-.4-8.3 4.3-10.8 6.1-.1-.5-.2-.9-.3-1.1-.3-1-6.7-.4-8.2 1.2-4-1.9-12-5.6-12.1-3.3-.3 3 0 15.5 1.6 16.4 1.2.7 8-3 11.4-4.9 0 0 0 0 .1 0 2.1.5 6 0 7.4-.9.2-.1.3-.3.4-.5 3.1 1.2 9.8 3.6 11.2 3.1 1.8-.5 1.4-15.6-.7-16.1z" fill="#67bd47"/>
        <path d="m128.8 122c-2.1-.4-1.4-2.5-1.4-7.4 0 0 0 0 0 0-.5.3-.9.7-.9 1.1 0 4.9-.8 7.1 1.4 7.4 2.1.5 6 0 7.6-.9.3-.2.4-.5.5-1-1.5.9-5.2 1.3-7.2.8z" fill="#43a347"/>                         
    </g>
  </svg>
`;
const YahooIcon = `
  <svg viewBox="-75 0 240 240" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="t" y2="1819.8" gradientUnits="userSpaceOnUse" x2="-190.68" gradientTransform="matrix(.60986 0 0 .60986 -1015.1 -735.2)" y1="1808.7" x1="-209.43">
      <stop stop-color="#1b0041" offset="0"/>
      <stop stop-color="#21004f" offset="1"/>
      </linearGradient>
      <linearGradient id="u" y2="1877.2" gradientUnits="userSpaceOnUse" x2="-249.85" gradientTransform="matrix(.60986 0 0 .60986 -1015.1 -735.2)" y1="1667.8" x1="-149.7">
      <stop stop-color="#5500bd" offset="0"/>
      <stop stop-color="#47008d" offset="1"/>
      </linearGradient>
      <linearGradient id="v" y2="1877.6" gradientUnits="userSpaceOnUse" x2="-250.33" gradientTransform="matrix(.60986 0 0 .60986 -1015.1 -735.2)" y1="1669.7" x1="-349.94">
      <stop stop-color="#5100b2" offset="0"/>
      <stop stop-color="#5500bd" offset="1"/>
      </linearGradient>
      <linearGradient id="w" y2="1838.7" gradientUnits="userSpaceOnUse" x2="-273.09" gradientTransform="matrix(.60986 0 0 .60986 -1015.1 -735.2)" y1="1850.7" x1="-291.09">
      <stop stop-color="#27005d" stop-opacity=".98039" offset="0"/>
      <stop stop-color="#2b005d" offset=".31767"/>
      <stop stop-color="#280055" offset=".59756"/>
      <stop stop-color="#24004d" offset=".80878"/>
      <stop stop-color="#230049" offset="1"/>
      </linearGradient>
      <linearGradient id="y" y2="2047" gradientUnits="userSpaceOnUse" x2="-253.6" gradientTransform="matrix(.60986 0 0 .60986 -1015.1 -735.2)" y1="1878.8" x1="-253.6">
      <stop stop-color="#210045" offset="0"/>
      <stop stop-color="#25004d" offset=".25"/>
      <stop stop-color="#2b005c" offset=".5"/>
      <stop stop-color="#340071" offset=".74854"/>
      <stop stop-color="#3e0088" offset="1"/>
      </linearGradient>
      <linearGradient id="x" y2="2047.3" gradientUnits="userSpaceOnUse" x2="-227.23" gradientTransform="matrix(.60986 0 0 .60986 -1015.1 -735.2)" y1="1877.2" x1="-248.82">
      <stop stop-color="#5500bd" offset="0"/>
      <stop stop-color="#5300b5" offset="1"/>
      </linearGradient>
    </defs>
    <g transform="translate(1009.8 -337.49)">
    <g transform="matrix(.5 0 0 .5 -379.18 197.8)">
      <g>
          <path d="m-1106.6 282.03 6.7084 15.246 17.076-7.9282 6.9443-7.3183c-10.985 2.4918-20.893 2.5746-30.729 0z" fill="#6700e8"/>
          <path d="m-1154.8 414.97-11.587 4.269-7.3183-12.807 72.573-115.87 5.1886-1.7772c7.1618-1.6184 14.973-3.354 20.061-6.7608-11.525 15.569-53.493 88.344-78.917 132.95z" fill="url(#t)"/>
          <path d="m-1170.6 413.15 3.0493-3.0493 71.795-121.34-10.809-6.7347c-8.6682 16.146-40.638 68.392-60.986 101.85l-9.7578 18.296z" fill="url(#u)"/>
          <path d="m-1228.5 282.03c15.916 28.207 40.349 67.667 60.986 101.85v26.224l-4.8789 4.8789-71.354-126.85z" fill="url(#v)"/>
          <path d="m-1240.3 289.7 11.761-7.6717c-12.62 2.6914-17.899 2.8627-30.493 0l4.8789 5.4887z" fill="#6700e8"/>
          <path d="m-1167.6 410.1-5.4887 7.9282-7.3184-3.0493c-13.625-23.55-53.678-95.287-78.672-132.95 5.0665 3.6714 11.911 5.686 19.817 6.9699z" fill="url(#w)"/>
          <path fill="url(#x)" d="m-1152.9 513.16-20.735-9.7578 1.8296-86.6 4.269-6.7085 12.807 4.8789z"/>
          <path d="m-1167.6 506.45-14.637 6.7085 1.8295-98.187 12.807-4.8789z" fill="url(#y)"/>
      </g>
      </g>
      </g>
  </svg>
`;
const uuID = function () {
    return uuid_generate().replace(/-/g, '');
};
Date.isLeapYear = function (year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
Date.getDaysInMonth = function (year, month) {
    return [
        31,
        Date.isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ][month];
};
Date.prototype.isLeapYear = function () {
    return Date.isLeapYear(this.getFullYear());
};
Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};
Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};
const InitKeyPair = function () {
    const keyPair = {
        publicKey: null,
        privateKey: null,
        keyLength: null,
        nikeName: null,
        createDate: null,
        email: null,
        passwordOK: false,
        verified: false,
        publicKeyID: null,
        _password: null,
        image: null
    };
    return keyPair;
};
const conetImapAccount = /^qtgate_test\d\d?@icloud.com$/i;
const isElectronRender = typeof process === 'object';
const cookieName = 'langEH';
const passwdCookieName = 'CoNET';
const EmailRegexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
const Menu = {
    zh: [
        {
            LanguageJsonName: 'zh',
            showName: '简体中文',
            icon: 'flag-icon-cn',
        },
        {
            LanguageJsonName: 'en',
            showName: '英文/English',
            icon: 'flag-icon-gb',
        },
        {
            LanguageJsonName: 'ja',
            showName: '日文/日本語',
            icon: 'flag-icon-jp',
        },
        {
            LanguageJsonName: 'tw',
            showName: '繁体字中文/正體字中文',
            icon: 'flag-icon-tw',
        },
    ],
    ja: [
        {
            LanguageJsonName: 'ja',
            showName: '日本語',
            icon: 'flag-icon-jp',
        },
        {
            LanguageJsonName: 'en',
            showName: '英語/English',
            icon: 'flag-icon-gb',
        },
        {
            LanguageJsonName: 'zh',
            showName: '簡体字中国語/简体中文',
            icon: 'flag-icon-cn',
        },
        {
            LanguageJsonName: 'tw',
            showName: '繁体字中国語/正體字中文',
            icon: 'flag-icon-tw',
        },
    ],
    en: [
        {
            LanguageJsonName: 'en',
            showName: 'English',
            icon: 'flag-icon-gb',
        },
        {
            LanguageJsonName: 'ja',
            showName: 'Japanese/日本語',
            icon: 'flag-icon-jp',
        },
        {
            LanguageJsonName: 'zh',
            showName: 'Simplified Chinese/简体中文',
            icon: 'flag-icon-cn',
        },
        {
            LanguageJsonName: 'tw',
            showName: 'Traditional Chinese/正體字中文',
            icon: 'flag-icon-tw',
        },
    ],
    tw: [
        {
            LanguageJsonName: 'tw',
            showName: '正體字中文',
            icon: 'flag-icon-tw',
        },
        {
            LanguageJsonName: 'en',
            showName: '英文/English',
            icon: 'flag-icon-gb',
        },
        {
            LanguageJsonName: 'ja',
            showName: '日文/日本語',
            icon: 'flag-icon-jp',
        },
        {
            LanguageJsonName: 'zh',
            showName: '簡體字中文/简体中文',
            icon: 'flag-icon-cn',
        },
    ],
};
var lang;
(function (lang) {
    lang[lang["zh"] = 0] = "zh";
    lang[lang["ja"] = 1] = "ja";
    lang[lang["en"] = 2] = "en";
    lang[lang["tw"] = 3] = "tw";
})(lang || (lang = {}));
const initLanguageCookie = () => {
    var cc = localStorage.getItem('lang');
    if (!cc) {
        cc = window.navigator.language;
    }
    cc = cc.substr(0, 2).toLocaleLowerCase();
    switch (cc) {
        case 'zh': {
            break;
        }
        case 'en': {
            break;
        }
        case 'ja': {
            break;
        }
        case 'tw': {
            break;
        }
        default: {
            cc = 'en';
        }
    }
    localStorage.setItem('lang', cc);
    $('html').trigger('languageMenu', cc);
    return cc;
};
const DayTime = 1000 * 60 * 60 * 24;
const monthTime = 30 * DayTime;
const yearTime = 12 * monthTime;
const nextExpirDate = function (expire) {
    const now = new Date();
    const _expire = new Date(expire);
    _expire.setHours(0, 0, 0, 0);
    if (now.getTime() > _expire.getTime()) {
        return _expire;
    }
    const nextExpirDate = new Date(expire);
    nextExpirDate.setMonth(now.getMonth());
    nextExpirDate.setFullYear(now.getFullYear());
    if (nextExpirDate.getTime() < now.getTime()) {
        nextExpirDate.setMonth(now.getMonth() + 1);
        return nextExpirDate;
    }
    return _expire;
};
const getRemainingMonth = function (expire) {
    const _expire = new Date(expire);
    const _nextExpirDate = nextExpirDate(expire);
    return _expire.getFullYear() === _nextExpirDate.getFullYear()
        ? _expire.getMonth() - _nextExpirDate.getMonth()
        : 12 - _nextExpirDate.getMonth() + _expire.getMonth();
};
const getPassedMonth = function (start) {
    const startDate = new Date(start);
    const now = new Date();
    const passwdYear = now.getFullYear() - startDate.getFullYear();
    const nowMonth = now.getMonth();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();
    const nowDay = now.getDate();
    let ret = startMonth >= nowMonth
        ? 12 - startMonth + nowMonth + (passwdYear - 1) * 12
        : passwdYear * 12 + nowMonth - startMonth - 1;
    ret += startDay >= nowDay ? 0 : 1;
    return ret;
};
const getAmount = function (amount) {
    if (!amount)
        return null;
    if (typeof amount === 'number') {
        amount = amount.toString();
    }
    const ret = amount.split('.');
    return ret.length === 1 ? amount + '.00' : amount;
};
const getExpire = function (startDate, isAnnual) {
    const start = new Date(startDate);
    const now = new Date();
    const passedMonth = Math.round((now.getTime() - start.getTime()) / monthTime - 0.5);
    isAnnual
        ? start.setFullYear(start.getFullYear() + 1)
        : start.setMonth(passedMonth + 1);
    return start;
};
function getExpireWithMonths(month) {
    let date = new Date();
    return date.addMonths(month);
}
const initPopupArea = function () {
    const popItem = $('.activating.element').popup('hide');
    const inline = popItem.hasClass('inline');
    return popItem.popup({
        on: 'focus',
        movePopup: false,
        position: 'top left',
        inline: inline,
    });
};
const infoDefine = [
    {
        spalding: {
            mainPage: {
                logo: { name: '罗伯特·斯伯丁博士', title: '美国空军退役准将' },
                rightSectionTitle: '超限战',
                rightSectionSubTitle1: '美国精英们沉睡时',
                rightSectionSubTitle2: '中国阴影正在悄悄合拢',
                menu: [
                    '主頁',
                    '關於我們',
                    '社交媒體',
                    '觀看',
                    '聆聽',
                    '翻譯件',
                    '參考',
                    '聯絡',
                ],
                herotitle: '作家 | 演说家 | 企业家',
            },
        },
        addUser: '添加',
        addUserNameInputPlaceholder: '名称',
        addUserKeyIDInputPlaceholder: '钥匙ID',
        publicKeyTitle: '公开钥',
        privatyKeyTitleShow: '私密钥',
        copied: '已复制',
        privatyKeyTitle: '解密用私密钥不应提供给任何人',
        airplaneMode: '脱机模式',
        coSearch: {
            audio: '音频',
            video480: '低分辨率',
            video720: '720p',
            video2k: '2K',
            video4k: '4K',
            video8k: '8K',
            searchInputPlaceholder: '请输入检索关键字组合或网址',
            SearchText: '搜索',
            totalResults: ['大约有', '条记录'],
            moreResults: '更多结果',
            SearchesRelated: ['', '的相关搜索'],
            label_HTML: 'HTML代码',
            label_picture: '图片',
            imageSize: '图片尺寸：',
            unSafe: ['安全浏览', '非安全浏览（非推荐）'],
            similarImages: '外观类似的图片',
            errorMessage: [
                '无效请求',
                '您的图片格式无法处理，请尝试选择其他图片',
                '您的请求已达最大值，请稍后再试',
            ],
            coSearchConfigMenu: ['搜索设定', '指定检索引擎'],
            coSearchConfigIcon: ['google', ''],
            coSearchEngineName: ['谷歌', ''],
            searchToolBarMenu: ['网站', '新闻', '图片', '视频'],
            timeUnit: {
                hours: '小时前',
                day: '天前',
                mins: '分钟前',
            },
            TimeTolocalTime: function (time) {
                return new Date(time).toLocaleDateString('zh-Hans', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },
        },
        youtube: {
            startup: {
                title: '欢迎使用Co油管',
                detail: '在此您可以检索Youtube视频，下载并播放所选视频',
            },
            search: {
                placeholder: '请输入检索关键字，或输入油管播放链接',
                button_text: '检索',
                error: ['您的检索无效，请重新输入。'],
            },
        },
        perment: {
            serverTitle: '服务器',
        },
        appsManager: {
            mainLoading: '正在获取节点信息...',
            nodeName: '您进入的节点名：',
            connectAddress: '节点接入地址：',
            serviceList: '提供服务一览',
            welcomeTextSub: '隐私安全自由的新互联网',
        },
        twitter: {
            newTwitterAccount: `请输入您的推特APP信息，如何获得和设置推特账号APP信息，请点击<a target="_blank" href='https://github.com/QTGate/QTGate-Desktop-Client/wiki/Create-Twitter-APP')">这里</a>`,
            addAccount: '添加推特账户',
            following: ['正在关注', '解除关注', '关注'],
            followers: '关注者',
            videoSizeOver: '视频超推特限制: 尺寸 < (1280x1024)，文件 < 300MB，总时间 < 140秒，请转换视频后再上传',
            second: '秒',
            min: '分',
            retweeted: '已转推',
            hour: '小时',
            month: '月',
            day: '日',
            replying: '回复: ',
            newTwitterDistroyButtonTitle: ['放弃推文', '舍弃对话串'],
            returnEdit: '回编辑',
            close: '关闭',
            newTwitterTitle: ['撰写新推文', '撰写新对话串'],
            twitterBottonTitle: ['发推', '全部发推'],
            urlInfo: '<h3>推特客户端预览版</h3><p>用户可以无限量免费使用此客户端，免翻墙(不使用VPN，不用连结CoGate代理服务器)匿名访问(您的真实IP地址不会泄露给推特)您的推特账户。</p><p>其他设备可以输入以下网址打开此APP应用</p>',
            accountError: '推特回送错误信息提示：您输入的APP应用设定信息有误。请检查您的推特APP信息后再试。',
        },
        account: {
            title: '账户管理',
            segmentTitle: '账户: ',
            stripePayment: '银行网关支付',
            promoButton: '我有促销码',
            qtgatePayment: 'CoNET网关支付',
            paymentProblem1: '支付遇到问题',
            paymentProblem: '您的当前所在区域看上去银行网关被和谐，您可以使用CoNET网关支付来完成支付',
            QTGatePayRisk: '使用CoNET安全网关支付，如果您有安全疑虑，请使用Stript安全网关支付。',
            willPayNextExpir: '自动扣款 ',
            openAutomatically: '打开自动扣款',
            CancelSuccess: function (PlanExpire, isAnnual, returnAmount) {
                return `中止订阅成功。您可以一直使用您的原订阅到${new Date(PlanExpire).toLocaleDateString()}为止。以后您将会自动成为CoNET免费用户，可以继续使用CoNET的各项免费功能。${isAnnual
                    ? `退款金额us$${returnAmount}会在5个工作日内退还到您的支付卡。`
                    : '下月起CoNET系统不再自动扣款。'} 祝您网络冲浪愉快。`;
            },
            currentPlan: '当前订阅: ',
            cardPaymentErrorMessage: [
                /* 0 */ '输入的信用卡号有误，或支付系统不支持您的信用卡！',
                /* 1 */ '输入的信用卡期限有误！',
                /* 2 */ '输入的信用卡安全码有误！',
                /* 3 */ '输入的信用卡持有人邮编有误！',
                /* 4 */ '支付失败，支付无法完成请稍后再试',
                /* 5 */ '支付数据存在错误',
                /* 6 */ '您的付款被发卡行所拒绝',
                /* 7 */ '发生错误，请稍后再试',
            ],
            planPrice: '订阅原价：',
            cancelPlanButton: '中止当前订阅',
            needPay: '应付金额：',
            currentPlanExpire: ['订阅截止日期：', '下次自动续订日'],
            monthResetDay: '月数据重置日：',
            monthResetDayAfter: '',
            oldPlanBalance: '原计划剩余价值：',
            currentAnnualPlan: ['月度订阅', '年度订阅'],
            MonthBandwidthTitle: '月度代理服務器限额：',
            dayBandwidthTitle: '毎日限额：',
            upgradeTitle: '升级',
            planExpirDate: function (year, month, day) {
                return `${year} 年${month}月${day}日`;
            },
            accountOptionButton: '账户选项',
            paymentProcessing: '正在通讯中...',
            cantUpgradeMonthly: '年度计划不可降级为月度计划。请先终止您当前订阅的年度计划，再重新申请此月度订阅',
            DowngradeTitle: '降级账户选项',
            cancelPlan: '终止订阅计划',
            cantCancelInformation: '您的账户如果是免费用户，CoNET测试用户，或使用优惠码产生的订阅用户，此类账户可以升级但不能被中止',
            MonthBandwidthTitle1: '传送限额',
            bandwidthBalance: '月度数据剩余量：',
            serverShareData: [
                '共享服务器',
                '一台独占服务器*',
                '二台独占服务器*',
                '四台独占服务器',
            ],
            networkShareTitle: '代理服务器网络',
            multiOpn: 'OPN并发多代理技术',
            continue: '下一步',
            paymentSuccessTitile: '謝謝您',
            paymentSuccess: '您的订阅已经完成，祝您网络冲浪愉快。',
            qtgateTeam: 'CoNET开发团队敬上',
            monthlyAutoPay: function (monthCost) {
                return `<span>每月自动扣款</span><span class="usDollar">@ us$</span><span class="amount">${monthCost}</span>/月<span>`;
            },
            annualPay: function (annual_monthlyCost) {
                return `<span>年付款每月只需</span><span class="usDollar">@ us$</span><span class="amount" >${annual_monthlyCost}</span>/月<span>`;
            },
            monthlyPay: '月收费',
            expirationYear: '信用卡期限',
            payAmountTitile: '合计支付金额',
            calcelPayment: '中止付款',
            doPayment: '确认付款',
            cardNumber: '信用卡号',
            canadaCard: '*加拿大持卡人将自动加算GST(BC)5%',
            cvcNumber: '信用卡安全码',
            aboutCancel: '关于中止订阅',
            postcodeTitle: '信用卡持有人邮编',
            serverShareData1: '使用OPN并发多代理技术，同时使用数大于独占数时，会相应分享您所独占的资源',
            internetShareData: [
                '共享高速带宽',
                '独享单线高速带宽*',
                '独享双线高速带宽*',
                '独享四线高速带宽',
            ],
            maxmultigateway: [
                '最大同时可二条并发代理数',
                '最大同时可使用四条并发代理数*',
                '最大同时可使用四条并发代理数',
            ],
            multiRegion: [
                '单一代理区域并发代理',
                '多代理区域混合并发代理',
                '多代理区域混合并发代理',
                '多代理区域混合并发代理',
            ],
            downGradeMessage: '您正在操作降级您的订阅，如果操作成功您将从下月您的订阅之日起，实行新的订阅，如果您是。',
            cancelPlanMessage: 'CoNET的订阅是以月为基本的单位。您的月订阅将在下月您的订阅起始日前被终止，您可以继续使用您的本月订阅计划，您将自动回到免费用户。如果您是每月自动扣款，则下月将不再扣款。如果您是年度订阅计划，您的退款将按普通每月订阅费，扣除您已经使用的月份后计算的差额，将自动返还您所支付的信用卡账号，如果您是使用促销码，或您是测试用户，您的终止订阅将不能被接受。',
            cancelPlanMessage1: function (isAnnual, amount, monthlyPay, expire, passedMonth, totalMonth) {
                return `<span>您的订阅计划是${isAnnual
                    ? `年度订阅，退还金额将按照您已付年订阅费 </span><span class="usDollar">us$</span><span class="amount">${amount / 100}</span> - 该订阅原价 <span class="usDollar">us$</span><span class="amount">${monthlyPay / 100}</span><span> X 已使用月数(包括本月) </span><span class="amount">${passedMonth}</span> = 应该退还的金额 <span class="usDollar">us$</span><span class="amount">${amount - passedMonth * monthlyPay > 0
                        ? (amount - passedMonth * monthlyPay) / 100
                        : 0}</span><span>，将在7个工作日内，退还到您原来支付的信用卡账户。</span>`
                    : `月订阅，您的订阅将下次更新日</span><span class="amount">${nextExpirDate(expire).toLocaleDateString()}</span><span>时不再被自动扣款和更新。</span>`}`;
            },
        },
        QTGateDonate: {
            title: 'CoNET赞助商提供的免流量网站',
            meta_title: '捐赠者：',
            detail: '所有的CoNET用户，使用CoNET代理伺服器，访问赞助商赞助的网站时产生的流量，都不被计入。免费用户需注意的是，如本日或本月流量已用完，无法接入CoNET代理伺服器，则无法利用此功能',
        },
        QTGateInfo: {
            title: '功能简介',
            version: '本机版本：v',
            detail: [
                {
                    header: '隐身匿名自由上网OPN',
                    color: '#a333c8',
                    icon: 'exchange',
                    detail: 'CoNET通过使用<a onclick="return linkClick (`https://zh.wikipedia.org/wiki/%E9%AB%98%E7%BA%A7%E5%8A%A0%E5%AF%86%E6%A0%87%E5%87%86`)" href="#" target="_blank">AES256-GCM</a>和<a onclick="return linkClick (`https://zh.wikipedia.org/wiki/PGP`)" href="#" target="_blank">OpenPGP</a>加密Email通讯，创造了OPN匿名网络通讯技术，CoNET公司首创的@OPN技术，它全程使用加密Email通讯，客户端和代理服务器彼此不用交换IP地址来实现高速通讯。iOPN通讯技术是利用普通HTTP协议下的混淆流量加密技术，能够隐藏变换您的IP地址高速通讯。二种通讯方式都能够让您，隐身和安全及不被检出的上网，保护您的隐私，具有超强对抗网络监控,网络限制和网络阻断。',
                },
                {
                    color: '#e03997',
                    icon: 'talk outline',
                    header: '无IP点对点即时加密通讯服务QTChat',
                    detail: 'CoNET用户之间通过email的点对点即时通讯服务，它具有传统即时通讯服务所不具有的，匿名无IP和用户之保持秘密通讯的功能。QTChat加密通讯服务可以传送文字，图片和视频文件信息，CoNET系统只负责传送信息，不拥有信息，也无法检查信息本身，所以CoNET不承担信息所有的法律责任。QTChat支持群即时通讯，将支持视频流直播服务。',
                },
                {
                    color: '#6435c9',
                    icon: 'cloud upload',
                    header: '加密文件匿名网络云储存及分享功能QTStorage',
                    detail: '用户通过申请多个和不同的免费email服务商账号，可以把一个文件加密拆分成多个部分，分别存储在不同的email账号下，可以保密安全和无限量的使用网络储存。用户还可以通过CoNET系统在CoNET用户之间分享秘密文件。',
                },
                {
                    color: 'darkcyan',
                    icon: 'spy',
                    header: '阻断间谍软件向外送信功能',
                    detail: 'CoNET系统连接全球DNSBL联盟数据库，用户通过订阅CoNET系统黑名单列表，并使用CoNET客户端上网，让潜伏在您电子设备内的间谍软件，它每时每刻收集的信息，不能够被送信到其信息收集服务器，能够最大限的保障您的个人隐私。',
                },
                {
                    color: '#6435c9',
                    icon: 'external share',
                    header: '本地VPN服务器',
                    detail: 'CoNET用户在户外时可以通过连接自己家里的VPN，来使用CoNET客户端隐身安全上网。',
                },
            ],
        },
        cover: {
            firstTitle1: 'Kloak OS',
            firstTitle2: '基于信任隐私和安全的互联网',
            firstTitle3: '革命性的无IP地址通讯网颠覆传统互联网',
            start: '开门',
            proxyStoped: 'CoGate定制代理服务器已经停止，如需使用请重新定制代理服务器。',
        },
        firstNote: {
            title: '欢迎使用CoNET，感谢您使用我们的产品和服务(下称“服务”)。本服务由总部设在加拿大的CoNET技术有限公司.下称“CoNET”提供。',
            firstPart: '您使用我们的服务即表示您已同意本条款。请仔细阅读。使用我们的服务，您必须遵守服务中提供的所有政策。',
            detail: [
                {
                    header: '关于我们的服务',
                    detail: '请勿滥用我们的服务，举例而言: 请勿干扰我们的服务或尝试使用除我们提供的界面和指示以外的方法访问这些服务。您仅能在法律(包括适用的出口和再出口管制法律和法规)允许的范围内使用我们的服务。如果您不同意或遵守我们的条款或政策，请不要使用我们所提供的服务，或者我们在调查可疑的不当行为，我们可以暂停或终止向您提供服务。',
                },
                {
                    header: null,
                    detail: '使用我们的服务并不让您拥有我们的服务或您所访问的内容的任何知识产权。除非您获得相关内容所有者的许可或通过其他方式获得法律的许可，否则您不得使用服务中的任何内容。本条款并未授予您使用我们服务中所用的任何商标或标志的权利。请勿删除、隐藏或更改我们服务上显示的或随服务一同显示的任何法律声明。',
                },
                {
                    header: '关于CoNET无IP通讯技术和隐私保护的局限性',
                    detail: 'CoNET是世界首创的使用Email地址建造一个无IP通讯环境，在您利用CoNET进行通讯过程中，CoNET无法获得您目前所使用的IP地址，可以最大限度的保障您的个人隐私。但是这项技术并不能够保证您的信息绝对的不被泄露，因为您的IP地址有可能被记录在您所使用的Email服务供应商，如果持有加拿大法院令寻求CoNET的Log公开，再和Email服务供应商的Log合并分析，可能会最终得到您的信息。 CoNET并不能够绝对保障您的隐私。 ',
                },
                {
                    header: '关于个人隐私保护，系统日志和接收CoNET传送的信息',
                    detail: '在您使用服务的过程中，我们可能会向您发送服务公告、管理消息和其他信息。您可以选择不接收上述某些信息。',
                },
                {
                    header: null,
                    detail: '当您使用我们的服务时，我们为了计费处理会自动收集非常有限的数据流量信息，并存储到服务器日志中。数据流量信息仅用于计算客户应支付通讯费用而收集的，它收集的数据是：日期，用户帐号，所使用的代理区域和代理服务器IP，数据包大小，下载或上传。例如：',
                },
                {
                    header: null,
                    detail: '<p class="tag info">06/20/2017 18:12:16, info@CoNET.com, francisco, 104.236.162.139, 300322 byte up, 482776323 byte down.</p><p class="tag info">06/21/2017 12:04:18, info@CoNET.com, francisco, 104.236.162.139, 1435226 byte up, 11782238 byte down.</p>',
                },
                {
                    header: null,
                    detail: 'CoNET没有保存除了以上信息以外的任何其他信息。我们会配合并向持有加拿大法院令的执法机构提供此日志文件。如果您是加拿大以外地区的执法机构，有这方面信息披露的需求，请通过加拿大外交部来联系我们：',
                },
                {
                    header: null,
                    detail: '<a class="tag alert" href="http://www.international.gc.ca/">http://www.international.gc.ca/</a>',
                },
                {
                    header: '版权所有权',
                    detail: '该软件是CoNET的智慧产权，并且受到相关版权法，国际版权保护规定和其他在版权授与国家内的相关法律的保护。该软件包含智慧产权材料, 商业秘密及其他产权相关材料。你不能也不应该尝试修改，反向工程操作，反汇编或反编译CoNET服务，也不能由CoNET服务项目创造或衍生其他作品。',
                },
                {
                    header: null,
                    detail: '关于我们服务中的软件，CoNET授予您免许可使用费、不可转让的、非独占的全球性个人许可, 允许您使用由CoNET提供的、包含在服务中的软件。本许可仅旨在让您通过本条款允许的方式使用由CoNET提供的服务并从中受益。您不得复制、修改、发布、出售或出租我们的服务, 或所含软件的任何部分。',
                },
                {
                    header: '修改与终止服务',
                    detail: '我们持续改变和改善所提供的服务。我们可能会新增或移除功能或特性，也可能会暂停或彻底停止某项服务。您随时都可以停止使用服务，尽管我们并不希望您会这样做。 CoNET也可能随时停止向您提供服务，或对服务附加或设定新的限制。',
                },
                {
                    header: '服务的责任',
                    detail: '在法律允许的范围内，CoNET及其供应商和分销商不承担利润损失、收入损失或数据、财务损失或间接、特殊、后果性、惩戒性或惩罚性损害赔偿责任。',
                },
                {
                    header: '法律规定的贸易禁止事项',
                    detail: '当您按下同意按钮，表示您已经确认您不属于加拿大法律所规定的禁止贸易对象的列表之中。 ',
                },
                {
                    header: '服务的商业使用',
                    detail: '如果您代表某家企业使用我们的服务，该企业必须接受本条款。对于因使用本服务或违反本条款而导致的或与之相关的任何索赔、起诉或诉讼，包括因索赔、损失、损害赔偿、起诉、判决、诉讼费和律师费而产生的任何责任或费用，该企业应对CoNET及其关联机构、管理人员、代理机构和员工进行赔偿并使之免受损害。',
                },
                {
                    header: '本条款的变更和约束力',
                    detail: '关于本条款：我们可以修改上述条款或任何适用于某项服务的附加条款，例如，为反映法律的变更或我们服务的变化而进行的修改。您应当定期查阅本条款。我们会在本网页上公布这些条款的修改通知。我们会在适用的服务中公布附加条款的修改通知。所有修改的适用不具有追溯力，且会在公布十四天或更长时间后方始生效。但是，对服务新功能的特别修改或由于法律原因所作的修改将立即生效。如果您不同意服务的修改条款，应停止使用服务。如果本条款与附加条款有冲突，以附加条款为准。',
                },
                {
                    header: null,
                    detail: '本条款约束CoNET与您之间的关系，且不创设任何第三方受益权。如果您不遵守本条款，且我们未立即采取行动，并不意味我们放弃我们可能享有的任何权利（例如，在将来采取行动）。如果某一条款不能被强制执行，这不会影响其他条款的效力。加拿大BC省的法律（不包括BC州的法律冲突规则）将适用于因本条款或服务引起的或与之相关的纠纷。因本条款或服务引起的或与之相关的所有索赔，只能向加拿大BC省法院提起诉讼，且您和CoNET同意上述法院拥有属人管辖权。',
                },
            ],
            disagree: '不同意',
            agreeMent: 'CoNET服务条款和隐私权',
        },
        linuxUpdate: {
            newVersionDownload: '点击这里下载并安装',
            step1: '请更新版本：',
            step2: '授权新版本CoNET为可执行文件',
            step2J1: '/images/linuxUpdate1_tw.jpg',
            step2J2: '/images/linuxUpdate2_tw.jpeg',
            step2_detail1: '右键点击已下载的CoNET图标，选择菜单里的文件属性',
            step2_detail2: '在权限选项里，选勾“允许档案文件执行”。',
            step3: '退出旧版本CoNET后，双击CoNET文件执行安装',
            exit: '退出CoNET',
            tryAgain: '再次尝试',
            refresh: '刷新页面',
        },
        imapInformation: {
            title: '通讯专用Email邮箱设置',
            tempImapAccount: `申请临时邮箱有困难？您可以暂时使用<a href="#" style = "margin-left: 0.5em;" class="ui label teal" onclick="return linkClick ('https://github.com/QTGate/QTGate-Desktop-Client/wiki/IMAP%E8%87%A8%E6%99%82%E5%B8%B3%E6%88%B6')">CoNET提供的临时IMAP帐号供各位测试使用</a>`,
            infomation: `请设置网络通讯用邮箱、或 `,
            coNetTempAccount: '使用CoNet提供的临时邮箱',
            serverDetail: '详细设定：',
            imapServer: 'IMAP服务器设定',
            imapServerInput: 'IMAP服务器IP或域名',
            UserName: '登陆用户名称',
            Ssl: '使用Ssl加密信息传输：',
            portName: '通讯端口号：',
            otherPortNumber: '其他号码：',
            Error_portNumber: '端口号应该是从1-65535之间，并且不等于22的数字',
            smtpServer: 'SMTP服务器设定',
            smtpServerInput: 'SMTP服务器IP或域名',
            emailServerPassword: '邮箱密码(推荐使用应用专用密码)',
            imapAccountConform: function (iamp, account) {
                return `<p class="ui small header brown">警告：</p><p class="grey">当您按下提交按钮时，意味着您已经确认【<B class="red">${iamp}</B>】是为了使用CoNET系统而特别申请的临时邮箱，您同意承担由此带来的风险，并授权CoNET系统可以使用这个Email邮箱传输信息!</p><p class="grey" >CoNET平台将会向CoNET發送包含以下信息的email：【<B class="red">${iamp}</B>】及APP密碼，註冊【<B class="red">${account}</B>】郵箱地址，使用語言，時區，加密公鑰。</p><p class="grey">同时您也同意并授权CoNET可以向您的注册邮箱【<B class="red">${account}</B>】发送CoNET有关服务，促销，账户及其他信息。</p>`;
            },
            agree: '我已经了解风险，并愿意继续',
            imapOtherCheckError: '不能连接到Email服务器，有可能您设定的服务器名称或IP，通讯端口号有误，请检查您的服务器详细设定！',
            CertificateError: 'Email服务器提示的证书不能被系统信任！您的Email服务器有可能是一个仿冒的，您如果想继续，请在下面详细设定里选择【允许连接到不被信任证书的Email服务器】，但您的Email登陆信息有可能泄漏给此服务器！',
            IgnoreCertificate: '允许连接到不被信任证书的Email服务器',
            Certificat: '如果您不确定请别选择这项，这个选择是非常危险，因为它允许连接上一个仿冒的服务器，可能泄露您的用户名和密码。',
            AuthenticationFailed: 'Email服务器提示用户名或密码错误，请仔细检查您的用户名和密码！',
            addAEmail: '添加通讯用Email账户',
            tryAgain: '再试一次',
            connectImap: '连接CoNET',
            cancelConnect: '终止CoNET连接',
            imapItemTitle: '通讯用邮箱详细信息',
            loaderText: [
                '正',
                '在',
                '和',
                'C',
                'o',
                'N',
                'E',
                'T',
                '建',
                '立',
                '通',
                '讯',
                '管',
                '道',
                '...',
            ],
            imapCheckingStep: [
                /* 0 */ '正在尝试连接email服务器',
                /* 1 */ '邮件服务器IMAP连接成功, 正在等待CoNET对接。',
                /* 2 */ '邮件服务器SMTP连接成功',
                /* 3 */ 'CoNET客户端向CoNET系统发出联机请求Email。和CoNET联机需要额外的时间，请耐心等待。',
                /* 4 */ '成功连接CoNET',
                /* 5 */ '邮件服务器IMAP测试成功',
                /* 6 */ '邮件服务器SMTP测试成功',
            ],
            imapResultTitle: 'IMAP服务器CoNET通讯评分：',
            testSuccess: 'email服务器连接试验成功！',
            exitEdit: '退出编辑Email帐户',
            deleteImap: '删除IMAP账户',
            proxyPortError: '本地代理服务器的端口设定从3001-65535之间的数字，或端口号已被其他APP所占用。请尝试填入其他号码。',
            appPassword: '关于APP密码',
            imapCheckError: [
                '不能连接到邮件服务器，有可能您没有互联网，或所在网络不支持邮件IMAP通讯，请检查您的网络，或刷新页面重试一次。',
                '邮件服务器提示用户名或密码错误，请仔细检查您的用户名和密码！ ',
                '邮件伺服器证书错误！您所在网络可能存在网络中间人攻击。如果您使用某些防毒软件如Kaspersky，您设定了让它检测邮件，它会使用中间人拦截技术拦截任何邮件通讯，您需要关闭此项功能。',
                '邮件服务器发送邮件错误，这通常是您使用的密码是普通密码所致，请换用APP密码后再次尝试',
                '未连结互联网，请检查网络',
                '未知错误，请退出CoNET后再试。',
                '您的邮箱无可用空间错误，请检查邮箱删除不必要的邮件后再试。',
            ],
        },
        home_index_view: {
            newVersion: '新版本准备就绪，请安装！',
            clickInstall: '点击安装新版本',
            showing: '系统状态',
            internetLable: '互联网',
            gateWayName: '代理服务器',
            localIpAddress: '本机',
            nextPage: '下一页',
            agree: '同意协议并继续',
            emailAddress: 'Email地址',
            systemAdministratorEmail: 'RSA密钥生成',
            SystemAdministratorNickName: '昵称',
            systemPassword: 'CoNET客户端密码设定',
            creatKeyPair: '创建密钥对...',
            imapEmailAddress: '邮箱账户名',
            cancel: '放弃操作',
            stopCreateKeyPair: '停止生成密钥对',
            keyPairCancel: '生成密钥对被中止',
            keyPairGenerateError: '生成密钥对发生系统错误，请重试！',
            keyPairGenerateSuccess: '完成生成密钥对',
            continueCreateKeyPair: '继续生成',
            newVersionInstallLoading: '更新中请稍候',
            KeypairLength: '请选择加密通讯用密钥对长度：这个数字越大，通讯越难被破解，但会增加通讯量和运算时间。',
            GenerateKeypair: '<em>系统正在生成用于通讯和签名的RSA加密密钥对，计算机需要运行产生大量的随机数字有，可能需要几分钟时间，尤其是长度为4096的密钥对，需要特别长的时间，请耐心等待。关于RSA加密算法的机制和原理，您可以访问维基百科：' +
                `<a href='https://zh.wikipedia.org/wiki/RSA加密演算法' target="_blank" onclick="return linkClick ('https://zh.wikipedia.org/wiki/RSA加密演算法')" >https://zh.wikipedia.org/wiki/RSA加密演算法</a></em>`,
            inputEmail: '加密通讯用钥匙(curve25519)生成',
            accountEmailInfo: '由于CoNET域名在某些国家和地区被防火墙屏蔽，而不能正常收发Email，如果您是处于防火墙内的用户，建议使用防火墙外部的邮件服务商。',
            dividertext: '选项（可不填）',
        },
        Home_keyPairInfo_view: {
            title: '密钥信息',
            emailNotVerifi: '您的密钥未获CoNET签署认证。',
            emailVerified: '您的密钥已获CoNET签署认证。',
            NickName: '昵称：',
            creatDate: '密钥创建日期：',
            keyLength: '密钥位强度：',
            password: '请设定密钥保护密码',
            password1: '请输入密码',
            keyID: '密钥对ID：',
            logout: '退出登录',
            deleteKeyPairHaveLogin: '请使用登陆后的客户端来删除您的密钥',
            deleteKeyPairInfo: '删除密钥将使您的CoNet网络信息包括私密文件将全部丢失。',
            delete: '削除',
            locked: '请输入密码。忘了密码请删除此密钥',
            systemError: '发生系统错误。如果重复发生，请删除您的密钥，再次设定您的系统！',
        },
        error_message: {
            title: '错误',
            errorNotifyTitle: '系统错误',
            EmailAddress: [
                '请按以下格式输入你的电子邮件地址: someone@example.com.',
                '您已有相同的Email账户',
                '此类Email服务器CoNET暂时技术不支持。',
            ],
            required: '请填写此字段',
            doCancel: '终止完成',
            PasswordLengthError: '密码必须设定为5个字符以上。',
            localServerError: '本地服务器错误，请重新启动CoNET！',
            finishedKeyPair: '密钥对创建完成！',
            errorKeyPair: '密钥对创建发生错误，请重试',
            Success: '完成',
            SystemPasswordError: '密钥对密码错误，请重试！如果您已忘记您的密钥对密码，请删除现有的密钥对，重新生成新的密钥对。但您的原有设定将全部丢失！',
            finishedDeleteKeyPair: '密钥对完成删除!',
            offlineError: '您的电脑未连接到互联网，请检查网络后再次尝试！',
            imapErrorMessage: [
                /* 0 */ '未能链接CoNET网络。 CoNET网络可能存在问题，请稍后再次尝试。或联系CoNET服务。 ',
                /* 1 */ '数据格式错误，请重试',
                /* 2 */ '您的电脑未连接到互联网，请检查网络后再次尝试！ ',
                /* 3 */ 'Email服务器提示IMAP用户名或密码错！这个错误通常是由于您使用的密码是普通密码，或者您的APP密码已失效，请到您的Email帐户检查您的APP密码，然后再试一次。 ',
                /* 4 */ 'Email服务器的指定连接埠连结失败，请检查您的IMAP连接埠设定，如果您在一个防火墙内部，则有可能该端口被防火墙所屏蔽，您可以尝试使用该IMAP伺服器的其他连接埠！ <a href="data-html"></a>',
                /* 5 */ '服务器证书错误！您可能正在连接到一个仿冒的Email服务器，如果您肯定这是您希望连接的服务器，请在IMAP详细设定中选择忽略证书错误。 ',
                /* 6 */ '无法获得Email服务器域名信息，请检查您的Email服务器设定！或者您的电脑没有互联网，请检查您的互联网状态。 ',
                /* 7 */ '此Email服务器看来可能不能使用CoNET网络通讯技术，请再测试一次或选择其他email服务供应商！ ',
                /* 8 */ 'Email服务器提示SMTP用户名或密码错！ ',
                /* 9 */ '服务器证书错误！您可能正在连接到一个仿冒的Email服务器，如果您肯定这是您希望连接的服务器，请在SMTP详细设定中选择忽略证书错误。 ',
                /* 10 */ 'SMTP连结提示未知错误',
                /* 11 */ '存在相同Email账号',
                /* 12 */ '您的系统还未连接到CoNET网络！ ',
                /* 13 */ '您的邮箱提示您账号已无可使用容量，请清理邮箱后再试',
                /* 13 */ '通讯遇到未知错误，请重试。',
            ],
            CoNET_requestError: [
                /* 0 */ 'CoNET无响应,正在重新建立CoNET通讯管道，请稍候。',
                /* 1 */ '无效操作！',
            ],
        },
        emailConform: {
            activeViewTitle: '验证您的密钥',
            info1_1: `您的密钥还未完成验证，请点击[发送验证Email]按钮，并检查您的 【`,
            info1_2: `】 邮箱。如果存在多封CoNET的邮件时，请选择最后一封信件。请打开信件并复制邮件内容。如果您还未收到CoNET的邮件，请检查您的密钥邮箱是否准确，或者您可以删除您现有的密钥，重新生成新密钥。`,
            info2: '请复制从“-----BEGIN PGP MESSAGE----- （开始，一直到）-----END PGP MESSAGE-----” 结束的完整内容，粘贴在此输入框中。',
            emailTitle: '感谢您使用CoNET服务',
            emailDetail1: '尊敬的 ',
            emailDetail1_1: '',
            emailDetail2: '这是您的CoNET帐号激活密码，请复制下列框内的全部内容:',
            bottom1_1: '此致',
            buttom1_2: 'CoNET团队',
            conformButtom: '验 证',
            requestReturn: [
                '错误！您的请求被拒绝，这可能是您在短时间内多次请求所致，请稍后再试',
                'CoNET已发送激活邮件！',
            ],
            reSendRequest: '发送验证Email',
            formatError: [
                /** 0 **/ '内容格式错误，请复制从“-----BEGIN PGP MESSAGE----- （开始，一直到）-----END PGP MESSAGE-----” 结束的完整内容，粘贴在此输入框中。 ',
                /** 1 **/ '提供的内容不能被解密，请确认这是在您收到的最后一封从CoNET发送过来的激活信。如果还是没法完成激活，请删除您的密钥重新生成和设定。 ',
                /** 2 **/ '和CoNET连接发生错误，请退出重新尝试！ ',
                /** 3 **/ '无效激活码！如果存在多封CoNET的邮件时，请选择最后一封信件。',
                /** 4 **/ '您的CoNET看上去有问题, 请删除您的密钥，重新设置您的CoNET！ ',
                /** 5 **/ '抱歉，CoNET系统无应答，可能暂时下线，请您稍后再试。',
                /** 6 **/ '您当天的数据通讯量达到上限，请等待明天再试或升级用户类型',
                /** 7 **/ '用来通讯的Email设定有错误，请检查IMAP设定后重试，或CoNET不支持此Email类型',
                /** 8 **/ '您所选区域不能够连结，请稍候再试',
                /** 9 **/ '您的IMAP邮箱发信发生错误。请退出CoNET重试。如果持续发生此故障，您的IMAP帐号有可能被锁住，需要登陆您的IMAP邮箱网站解锁操作。 ',
                /** 10**/ '页面会话已过期，请刷新页面以继续，或退出后重新启动CoNET。',
                /** 11**/ 'CoNET平台故障，请重新启动CoNET。',
            ],
            activeing: '正在通讯中',
        },
        QTGateRegion: {
            title: '高品质定制代理服务器区域',
            speedTest: '代理服务器速度测试：',
            error: [],
            CoGateRegionStoped: '所订制的代理服务器已经被停止，如需使用请再次订制.',
            pingError: '代理服务区域速度检测发生错误，请退出CoNET，以管理员身份再次打开CoNET后，再执行速度检测！',
            connectQTGate: '正在获得代理服务器区域信息...',
            available: '服务中',
            unavailable: '准备中',
            requestPortNumber: '指定代理服务器通讯端口',
            proxyDomain: '域名解释全程使用CoNET代理服务器端',
            setupCardTitle: '使用连接技术:',
            paidUse: '本区域只对收费用户开放',
            MultipleGateway: '同时并发使用代理数',
            dataTransfer: '数据通讯：',
            dataTransfer_datail: ['全程使用代理服务器', '当不能到达目标时使用代理'],
            proxyDataCache: '浏览数据本地缓存:',
            proxyDataCache_detail: ['本地緩存', '不緩存'],
            cacheDatePlaceholder: '缓存失效时间',
            clearCache: '立即清除所有缓存',
            localPort: '本地代理服务器端口号:',
            localPath: '本地代理服务器HTTP链接路径',
            outDoormode: '接受外網訪問',
            GlobalIp: '本机互联网IP地址:',
            option: '高级设置',
            WebRTCleak: '阻止WebRTC漏洞',
            WebRTCleakInfo: '本设置后，浏览器的即时会话，端对点通讯等将不再工作。',
            QTGateRegionERROR: [
                '发送连接请求Email到CoNET发生送信错误， 请检查您的IMAP账号的设定。',
                '',
            ],
            GlobalIpInfo: '注意：当您按下【CoNET连结】时您会把您的本机互联网IP提供给CoNET系统，如果您不愿意，请选择【@OPN】技术来使用CoNET服务！没有显示【@OPN】选项，目前只在旧金山区域有效，并只支持iCloud邮箱。',
            sendConnectRequestMail: [
                '您的CoNET客户端没有联机CoNET网络，客户端已向CoNET系统重新发出联机请求Email。和CoNET联机需要额外的时间，请耐心等待。',
                '当您长时间未使用CoNET时，您的连接会被中断。',
            ],
            cacheDatePlaceDate: [
                { name: '1小时', id: 1 },
                { name: '12小时', id: 12 },
                { name: '1日', id: 24 },
                { name: '15日', id: 360 },
                { name: '1月', id: 720 },
                { name: '6月', id: 4320 },
                { name: '永远', id: -1 },
            ],
            atQTGateDetail: [
                /*0*/ '世界首创的CoNET无IP互联网通讯技术，全程使用强加密Email通讯，客户端和代理服务器彼此不用知道IP地址，具有超强隐身和保护隐私功能，强抗干扰和超強防火墙穿透能力。缺点是有延迟，网络通讯响应受您所使用的email服务供应商的服务器影响，不适合游戏视频会话等通讯。目前该技术只支持iCloud邮箱。',
                /*1*/ 'CoNET独创明码HTTP混淆流量加密通讯技术，能够隐藏变换您的IP地址高速通讯，隐身和保护隐私，抗干扰和超強防火墙穿透能力。缺点是需要使用您的IP来直接连结代理服务器。如果您只是需要自由访问互联网，则推荐使用本技术。',
                /*2*/ '域名解释使用CoNET代理服务器端，可以防止域名服务器缓存污染，本选项不可修改。',
                /*3*/ '互联网数据全程使用CoNET代理，可以匿名上网隐藏您的互联网形踪。',
                /*4*/ '只有当您的本地网络不能够到达您希望访问的目标时，才使用CoNET代理服务器代为连结目标主机，本选项可以加速网速，但失去隐私保护。',
                /*5*/ '通过本地缓存浏览纪录，当您再次访问目标服务器时可以增加访问速度，减少网络流量，缓存浏览纪录只针对非加密技术的HTTP浏览有效。CoNET使用强加密技术缓存浏览纪录，确保您的隐私不被泄漏。',
                /*6*/ '不保存缓存信息。',
                /*7*/ '设置缓存有效时间，您可以及时更新服务器数据,单位为小时。',
                /*8*/ '本地Proxy服务器，其他手机电脑和IPad等可通过连结此端口来使用CoNET服务。请设定为3001至65535之间的数字。',
                /*9*/ '通过设置PATH链接路径可以简单给您的Proxy服务器增加安全性，拒绝没有提供PATH的访问者使用您的Proxy服务器。',
                /*10*/ '同时使用多条代理线路数，可以有效降低大流量集中在一个代理服务线路，降低被网络监控者发现的风险。此选项仅供收费会员使用。',
                /*11*/ '指定同CoNET代理进行通讯使用的端口号，通过此设置可以规避您所在网段被通讯屏蔽的端口。',
                /* 12*/ 'Web实时通讯(WebRTC)客户端浏览器之间通过IP地址直接高速通讯技术，有时被恶意泄漏您的真实IP地址。',
            ],
        },
        useInfoMacOS: {
            title: '<p>本地代理服务器已在后台运行。</p>您的其他电子设备，可通过本地代理设置，来使用CoNET连接到互联网',
            title1: 'MacOS 本地代理服务器设定',
            customProxy: '定制服务器生成完成：',
            proxySetupHelp: '代理设定如需帮助，请点击以下您所使用的系统图案',
            webRTCinfo: '阻止WebRTC漏洞，请使用SOCKS代理设置，检查是否漏洞还在，请点击<a target="_blank" href="/Wrt">这里</a>',
            wrtTest: '以下为测试结果：',
            localIpAddress: '如果能看到这个IP地址，由于是本地局域网地址泄漏，无关紧要。',
            globalIpAddress: '如果显示这个IP，您的浏览器泄漏了您真实的IP地址',
            proxyServerIp: '<p>代理设置选择：<span style="color: brown;">自动代理设置</p>',
            wrtTestAreaTitle: 'WebRTC漏洞数据泄漏区域',
            proxyServerPort: 'HTTP和HTTPS代理设定：',
            proxyServerPassword: 'SOCKS代理设定：',
            info: [
                {
                    title: '打开控制面板，点击网络',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '',
                    image: '/images/userInfoMacos1.jpg',
                },
                {
                    title: '选择网络【高级...】',
                    titleImage: '',
                    detail: '',
                    image: '/images/macosUserInfo2.jpg',
                },
                {
                    title: '选择代理设定，按图示选勾左边自动代理，选勾排除简单服务器名',
                    titleImage: '',
                    detail: '<p>使用HTTP和HTTPS代理请按照蓝色第一行填入，使用SOCKS代理选择蓝色第二行</p>',
                    image: '/images/macosUserInfo3.jpg',
                },
            ],
        },
        thirdParty: {
            comesoon: '即将推出',
            information: '欢迎来到CoNET网络',
            app: [
                'Co定制代理',
                '酷茶',
                '酷存',
                'Co邮件',
                'Co新闻频道',
                '酷检索',
                'Co推特',
                'Co油管',
                '酷钱包',
                'CoNET定制业务',
            ],
            qtgateGateway: 'CoNET提供的高质量上网技术iOPN和@OPN，在CoNET全球16个区域，当场定制您专属的代理服务器，变换您的IP地址隐身无障碍的访问互联网',
            dimmer: [
                '高质量量身定制代理服务器业务，让您隐身安全不受注意的网上冲浪。 ',
                '隐身匿名去中心化不被封锁的社交媒体',
                '安全隐私文件云存储系统',
                '隐身匿名邮件客户端，可免翻墙访问Gmail',
                '免翻墙隐身匿名访问世界头条新闻',
                'QTG承接定制各类公众服务类及跨国企业私有APP业务',
                '免翻墙匿名隐身网页检索',
                '免翻墙匿名隐身推特客户端',
                '免翻墙匿名隐身Youtube客户端，可下载视频',
                'CoNET加密货币钱包和交易所',
            ],
        },
        useInfoAndroid: {
            title1: '安卓设备本地代理服务器设定',
            info: [
                {
                    title: '打开控制面板选择WiFi',
                    titleImage: '/images/androidSetup.jpg',
                    detail: '',
                    image: '/images/android1.jpg',
                },
                {
                    title: '长按当前WiFi连接名称等待菜单出现，选择菜单的修改设定',
                    titleImage: '',
                    detail: '',
                    image: '/images/android2.jpg',
                },
                {
                    title: '打开显示高级选项，在代理服务器设定(Proxy)中选择自动设置',
                    titleImage: '',
                    detail: '使用HTTP和HTTPS代理请按照蓝色第一行填入，使用SOCKS代理选择蓝色第二行',
                    image: '/images/android3.jpg',
                },
            ],
        },
        firefoxUseInfo: {
            title1: '火狐浏览器它单独设定代理服务，可以不影响系统而轻松使用代理上网',
            info: [
                {
                    title: '打开火狐，点击右上角工具图标，选择设定',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '<p><a href="https://www.mozilla.org/zh-CN/firefox/#/" target="_blank">下载Firefox</a></p>',
                    image: '/images/firefox1.jpg',
                },
                {
                    title: '选择常规后，滚动画面至最下部，在网络代理处点击详细设定',
                    titleImage: '',
                    detail: '',
                    image: '/images/firefox2.jpg',
                },
                {
                    title: '选择自动设置，选勾域名使用SOCKS v5',
                    titleImage: '',
                    detail: '使用HTTP和HTTPS代理请按照蓝色第一行填入，使用SOCKS代理选择蓝色第二行',
                    image: '/images/firefox3.jpg',
                },
            ],
        },
        useInfoiOS: {
            title1: 'iOS设备本地代理服务器设定',
            info: [
                {
                    title: '打开控制面板，点击Wi-Fi',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '',
                    image: '/images/iOS1.jpg',
                },
                {
                    title: '选择当前WiFi的圈i符号',
                    titleImage: '',
                    detail: '',
                    image: '/images/iOS2.jpg',
                },
                {
                    title: '选择底部的设置代理服务器',
                    titleImage: '',
                    detail: '',
                    image: '/images/iOS3.jpg',
                },
                {
                    title: '选择自动设置',
                    titleImage: '',
                    detail: '<p>在URL网址处填入：使用HTTP和HTTPS代理请按照蓝色第一行填入，使用SOCKS代理选择蓝色第二行</p>',
                    image: '/images/iOS4.jpg',
                },
            ],
        },
        useInfoWindows: {
            title1: 'Windows 10 代理服务器设定',
            info: [
                {
                    title: '关于Windows其他版本设定',
                    titleImage: '',
                    detail: '<p>Windows其他版本的代理服务器设定请参照<a href="#" onclick="return linkClick (`https://support.microsoft.com/ja-jp/help/135982/how-to-configure-internet-explorer-to-use-a-proxy-server`)">微软公司网站</a></p><p>请按以下参数设置本地代理服务器：</p>',
                    image: '',
                },
                {
                    title: '启动Internet Explorer',
                    titleImage: '/images/IE10_icon.png',
                    detail: '<p>点击右上角工具图标，滑动菜单至最下部选择【设定】</p>',
                    image: '/images/windowsUseInfo1.jpg',
                },
                {
                    title: '滑动菜单至最下部选择高级设定',
                    titleImage: '',
                    detail: '',
                    image: '/images/windowsUseInfo2.jpg',
                },
                {
                    title: '再次滑动菜单选择打开代理服务器设定',
                    titleImage: '',
                    detail: '',
                    image: '/images/windowsUseInfo3.jpg',
                },
                {
                    title: '选择自动设置代理服务器',
                    titleImage: '',
                    detail: '<p>WINDOWS10系统只对应HTTP和HTTPS，如果想使用全局代理的用户，需另外安装浏览器如火狐等，然后在火狐浏览器内单独设定Proxy全局代理SOCKS</p>',
                    image: '/images/windowsUseInfo4.jpg',
                },
            ],
        },
        QTGateGateway: {
            title: 'CoNET服务使用详细',
            processing: '正在尝试连接CoNET网络...',
            error: [
                /* 0 */ '错误：您的账号下已经有一个正在使用CoNET代理服务器的连接，请先把它断开后再尝试连接。',
                /* 1 */ '错误：您的账号已经无可使用流量，如果您需要继续使用CoNET代理服务器，请升级您的账户类型。如果是免费用户已经使用当天100M流量，请等待到明天继续使用，如您是免费用户已经用完当月1G流量，请等待到下月继续使用。',
                /* 2 */ '错误：数据错误，请退出并重新启动CoNET！',
                /* 3 */ '非常抱歉，您请求的代理区域无资源，请选择其他区域或稍后再试',
                /* 4 */ '对不起，您所请求连接的区域不支持这样的连接技术，请换其他连接方法或选择其他区域连接',
                /* 5 */ '@OPN链接技术不支持公用iCloud邮箱，请撤换通讯用IMAP邮箱，换您自有的iCloud邮箱。',
            ],
            connected: '已连接。',
            promo: '促销活动',
            upgrade: '升级账号',
            accountManager: '账户管理',
            userType: ['免费用户', '付费用户'],
            datatransferToday: '日流量限额：',
            datatransferMonth: '月流量限额：',
            todaysDatatransfer: '本日可使用流量',
            monthDatatransfer: '本月可使用流量',
            gatewayInfo: ['代理服务器IP地址：', '代理服务器连接端口：'],
            userInfoButton: '使用指南',
            stopGatewayButton: '停止所定制的服务器',
            disconnecting: '正在销毁中...',
        },
        topWindow: {
            title: '庆祝加拿大150周年特别提供',
        },
        feedBack: {
            title: '使用信息反馈',
            additional: '添附附加信息',
            okTitle: '发送至CoNET',
        },
        qtGateView: {
            title: '发送定制代理请求',
            mainImapAccount: 'CoNET通讯用邮箱',
            QTGateConnectStatus: 'CoNET连接状态',
            QTGateConnectResultWaiting: '已向CoNET发送连接请求Email。由于是首次连接CoNET网络，系统需要几分钟时间来完成与您的对接，请耐心等待。',
            QTGateDisconnectInfo: 'CoNET连结已断开。请选择向CoNET发送请求对接Email的IMAP帐号：',
            QTGateConnectError: [
                '发送连接请求Email错误，请检查IMAP邮件帐户的SMTP设定！',
            ],
            QTGateConnectResult: [
                'CoNET未联机，请点击连接CoNET！',
                '正在和CoNET联中',
                '已经连接CoNET',
                '连接CoNET时发生错误，请修改IMAP账号设定',
                '已经连接CoNET',
            ],
            QTGateSign: [
                '您的密钥状态',
                '还未获得CoNET信任签署,点击完成信任签署',
                '密钥获得CoNET信任签署是CoNET一个重要步骤，您今后在CoNET用户之间分享文件或传送秘密信息时，CoNET可以证明是您本人而非其他冒充者。你也可以通过您的密钥签署信任给其他CoNET用户，用以区别您自己的信任用户和非信任用户。',
                '正在获得CoNET信任签署中',
                '系统错误，请重启CoNET后再试，如果仍然存在，请尝试重新安装CoNET。',
                'CoNET系统错误!',
            ],
        },
    },
    {
        spalding: {
            mainPage: {
                logo: {
                    name: 'ロバート・スポルディング博士',
                    title: 'アメリカ空軍准将退役',
                },
                rightSectionTitle: '見えない戦争',
                rightSectionSubTitle1: 'アメリカのエリート達が眠っている間',
                rightSectionSubTitle2: '中国の影は静かに大きくなっている',
                menu: [
                    'ホーム',
                    '私について',
                    'ソーシャルメディア',
                    'ビデオ',
                    'オーディオ',
                    '通訳',
                    '参照',
                    'お問い合わせ',
                ],
                herotitle: '作家 | 演説家 | 創業者',
            },
        },
        addUser: '追加',
        addUserNameInputPlaceholder: '名前',
        addUserKeyIDInputPlaceholder: 'キーID',
        publicKeyTitle: '公開キー',
        privatyKeyTitleShow: 'プライベトキー',
        copied: 'コピーしました',
        airplaneMode: 'オフラインモードに',
        privatyKeyTitle: 'プライベトキーは誰にも提供しないでください',
        coSearch: {
            audio: '',
            video480: '低い解像度',
            video720: '720p',
            video2k: '2K',
            video4k: '4K',
            video8k: '8K',
            searchInputPlaceholder: 'サーチキーワードまたはウェーブアドレス',
            SearchText: '検索',
            totalResults: ['約', '件'],
            moreResults: '結果をさらに表示',
            SearchesRelated: ['', 'に関連する検索キーワード'],
            label_HTML: 'HTMLコード',
            label_picture: 'イメージ',
            imageSize: 'イメージサイズ:',
            unSafe: ['安全浏览', '非安全浏览（非推荐）'],
            similarImages: '類似の画像',
            errorMessage: [
                '無効なレクエスト',
                '選択された画像は処理ができません、ほかの画像をしてください',
                'レクエスト回数は制限にかかった、後ほど改めてお試しください',
            ],
            coSearchConfigMenu: ['検索の設定', '使用する検索エンジン'],
            coSearchConfigIcon: ['google', ''],
            coSearchEngineName: ['Google', ''],
            searchToolBarMenu: ['ウェイブ', 'ニュース', '画像', 'ビデオ'],
            timeUnit: {
                hours: '時間前',
                day: '天前',
                mins: '分前',
            },
            TimeTolocalTime: function (time) {
                return new Date(time).toLocaleDateString('ja', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },
        },
        appsManager: {
            mainLoading: 'ノードのサービスを取得中...',
            nodeName: 'ノードの名前：',
            connectAddress: 'ノードに接続アドレス：',
            serviceList: 'サービス一覧',
            welcomeTextSub: 'プライバシー、セキュリティー、自由な新なインターネット',
        },
        youtube: {
            startup: {
                title: 'Co for Youtubeへようこそ',
                detail: 'Youtubeビデオを検束し、ダウンロード又はプレーをします。',
            },
            search: {
                placeholder: 'Youtubeを検束し、又はプレーUrlを入力',
                button_text: '検束',
                error: ['検束にエラーが発生しました、もう一回検束をしてみてください'],
            },
        },
        perment: {
            serverTitle: 'サーバー',
        },
        twitter: {
            newTwitterAccount: `TwitterのAPPインフォーメーションを入力してください。APPインフォーメーション作成する事がわからない場合は<a target="_blank" href='https://github.com/QTGate/QTGate-Desktop-Client/wiki/Create-Twitter-APP'">ここ</a>をクリックしてください。`,
            addAccount: 'Twitterアカウントを追加',
            following: ['フォロー中', 'フォローを解除', 'フォロー'],
            followers: 'フォロワー',
            second: '秒',
            videoSizeOver: `ビデオがTwitter規格: 140秒、300MB、(1280x1024)を超えています`,
            month: '月',
            day: '日',
            min: '分',
            hour: '時間',
            replying: '返信先: ',
            retweeted: 'さんがリツイート',
            close: '閉じる',
            newTwitterTitle: ['ツイートする', '新しいスレッドを作成'],
            returnEdit: '中止破棄',
            newTwitterDistroyButtonTitle: ['ツイートを破棄', 'スレッドを破棄'],
            twitterBottonTitle: ['ツイート', 'すべてツイート'],
            urlInfo: '<h3>CoNETからのツイートクライアントのプレビュー版</h3><p>VPNやゲートウェイなど経由しなくて、ユーザはご自分のツイートアカウトにファイヤウォールを回避し安全匿名に無料無制限アクセスができます。</p><p>以下のURLを入力するとセルフォンやその他のデバイスもこちらのアプリケーションで楽しめます。</p>',
            accountError: 'ツイートがアカンウトAPPインフォーメーションにエラーがありまして、通信を拒否されました、APPインフォーメーションをチェックしてください。',
        },
        thirdParty: {
            comesoon: 'まもなく登場します。',
            information: 'CoNETネットワークへようこそ',
            qtgateGateway: 'CoNETご提供する高品質カスタムゲットウェイサービス、グローバルに１６区域とCoNET独自のiOPNと@OPN技術により、貴方のIPアドレスをカバーして、静かに無障害にインターネットの世界へ可能です。',
            app: [
                'CoGate',
                'CoChat',
                'CoBox',
                'CoMail',
                'CoNews',
                'Co検索',
                'Co for',
                'Co for',
                'Coウォレット',
                'Coカスタム',
            ],
            dimmer: [
                '高品質カスタムゲットウェイサービス、自由になるインターネットの世界へ',
                'ツイートスタイルの匿名ソーシャルメディア',
                '匿名プライバシーファイルストレージ',
                '匿名メール端末',
                'グロバールニュースをチェック',
                'CoNETに公衆及び私有ビジネスカスタム業務',
                '匿名ウェーブサーチ端末',
                '匿名Tweet端末',
                '匿名Youtube端末、ビデオダウンロードをサポート',
                '匿名ブロックチェーンウォレットとエクスチェンジ',
            ],
        },
        account: {
            paymentSuccessTitile: 'ありがとうございました。',
            stripePayment: 'オンライン支払い',
            promoButton: 'プロモーション入力',
            qtgatePayment: 'CoNET経由でのお支払い',
            QTGatePayRisk: 'CoNETセキュリティ経由でお支払いです。遠慮の場合はStripeセキュリティでのお支払いをしてください。',
            paymentProblem1: '支払い支障がある',
            willPayNextExpir: '引落とし日に ',
            openAutomatically: '引落とし予約',
            paymentProblem: 'あなた現在いる所在地ではバンク支払いがブラックされている模様です。CoNET経由でのお支払いをしてください。',
            CancelSuccess: function (PlanExpire, isAnnual, returnAmount) {
                return `プランキャンセルしました。${new Date(PlanExpire).toLocaleDateString()}まで、元プランのままCoNETサービスが使えます。そのあとはCoNETのフリーユーザーと戻ります。${isAnnual
                    ? `元プラン残りus$ ${returnAmount}は５日ウォキンデイ内お支払い使ったカードに戻ります`
                    : `プラン代自動落しは中止されます`}。これからもよろしくお願い申し上げます。`;
            },
            paymentSuccess: 'あなたのプランをアップグレードしました。これからもよろしくお願い申し上げます。',
            qtgateTeam: 'CoNETチーム全員より',
            cardPaymentErrorMessage: [
                /* 0 */ 'ご入力したカード番号に間違いがあるか、又支払いシステムはこのタイプのカードがサポートしておりません！',
                /* 1 */ 'ご入力したカードの期限に間違いがあります！',
                /* 2 */ 'ご入力したカードのセキュリティコードに間違いがあります！',
                /* 3 */ 'ご入力したカード所有者の郵便番号に間違いがあります！',
                /* 4 */ '原因不明けど、支払いが失敗しました。後ほどもう一度してみてください。',
                /* 5 */ 'お支払いデータに間違いがあります。',
                /* 6 */ 'お支払いは銀行から拒否されました。',
                /* 7 */ 'エラーが発生しました、後ほどもう一度してみてください。',
            ],
            title: 'アカウト管理',
            segmentTitle: 'アカウトタ: ',
            cancelPlanButton: 'キャンセルプラン',
            planPrice: 'プラン価値：',
            needPay: 'お支払い残高：',
            currentPlanExpire: ['プラン終了日：', '次の引落とし日'],
            cantUpgradeMonthly: '年契約は月契約に戻れないです。一回年契約を中止してから月契約をしてください。',
            currentAnnualPlan: ['月契約', '一年契約'],
            bandwidthBalance: '月残りデータ量：',
            paymentProcessing: 'サーバーとの通信中...',
            oldPlanBalance: '元プラン残り価値：',
            currentPlan: '現在加入中のプラン: ',
            MonthBandwidthTitle: 'ゲットウェイ月制限：',
            monthResetDayAfter: '',
            cantCancelInformation: 'あなたのプランはフリーユーザー、又はCoNETテストユーザーか、クーポンを使ったのためキャンセルすることはできません。',
            monthResetDay: '月レセット日：',
            dayBandwidthTitle: '日制限：',
            upgradeTitle: 'アプグランド',
            planExpirDate: function (year, month, day) {
                return `${year} 年${month}月${day}日`;
            },
            accountOptionButton: 'アカウトオプション',
            DowngradeTitle: 'ダウングレードオプション',
            cancelPlan: 'キャンセルプラン',
            networkShareTitle: 'ゲットウェイ回線',
            MonthBandwidthTitle1: 'データ量',
            payAmountTitile: 'お支払い金額合計',
            cardNumber: 'クレジットカード番号',
            multiOpn: 'OPN並列ゲットウェイ技術',
            monthlyAutoPay: function (monthCost) {
                return `<span>口座振替</span><span class="usDollar" >@ us$</span><span class="amount" >${monthCost}</span>/月<span>`;
            },
            cvcNumber: 'セキュリティコード',
            calcelPayment: 'キャンセル',
            doPayment: 'お支払いにします',
            postcodeTitle: 'カード所有者郵便番号',
            annualPay: function (annual_monthlyCost) {
                return `<span>年払いと月換算</span><span class="usDollar">@ us$</span><span class="amount" >${annual_monthlyCost}</span>/月<span>`;
            },
            aboutCancel: 'プランをキャンセルについて',
            expirationYear: 'カード期限',
            canadaCard: '*おカード所有者はカナダ所在者とGST(BC)5.0% 自動加算されます',
            continue: '次へ',
            multiRegion: [
                'シンプルリジョーン並列ゲットウェイ',
                'マルチリジョーン並列ゲットウェイ',
                'マルチリジョーン並列ゲットウェイ',
                'マルチリジョーン並列ゲットウェイ',
            ],
            serverShareData: [
                'シェアゲットウェイ',
                '一台ゲットウェイ独占*',
                '二台ゲットウェイ独占*',
                '四台ゲットウェイ独占',
            ],
            internetShareData: [
                'シェアハイスピード回線',
                '独占ハイスピード一回線*',
                '独占ハイスピード二回線*',
                '独占ハイスピード四回線',
            ],
            monthlyPay: 'プラン月額利用料',
            serverShareData1: '並列ゲットウェイ技術を使う際に、同時使う数が独占数を超える場合には、独占リソースを他人と割合にチェアする場合もあります。',
            maxmultigateway: [
                '最大二つ並列ゲットウェイ',
                '最大四つ並列ゲットウェイ*',
                '最大四つ並列ゲットウェイ',
            ],
            cancelPlanMessage: 'CoNETプランは月毎に計算し、来月のあなたの最初加入した日まで、今のプランのままご利用ですます。キャンセルした日から自動的にCoNETの無料ユーザーになります。おアカウトは(月)払いの場合は、来月の自動払いは中止となります。年払いの場合は、ご使った分に月普通料金と計算し控除してから、お支払いを使ったクレジットカードに戻ります。販促コードまたはテストユーザーにはキャンセルすることができません。',
            cancelPlanMessage1: function (isAnnual, amount, monthlyPay, expire, passedMonth, totalMonth) {
                return `<span>あなたのプランは${isAnnual
                    ? `一年契約です。キャンセルをした場合は、ご利用して頂いた月に普通料金と請求を計算されます。お返し金額は，お支払って頂いたプラン年契約料金 </span><span class="usDollar">us$</span><span class="amount">${amount / 100}</span><span> - そのプランの普通月料金 </span><span class="usDollar">us$</span><span class="amount">${monthlyPay / 100}</span><span> X ご利用して頂いた月(本月も含めて)：</span><span class="amount">${passedMonth}</span><span> = 戻る金額 </span><span class="usDollar">us$</span><span class="amount">${amount - passedMonth * monthlyPay > 0
                        ? (amount - passedMonth * monthlyPay) / 100
                        : 0}</span><span>とまります。７日内お支払って頂いたクレジットカードへ返金とします。</span>`
                    : `月プランです。キャンセルにすると次の更新日</span><span class="amount">${nextExpirDate(expire).toLocaleDateString()}</span><span>に自動更新はしませんです。</span>`}`;
            },
        },
        QTGateDonate: {
            title: 'スポンサーが提供する無料アクセスウェブサイト',
            meta_title: 'ドナー：',
            detail: 'CoNETユーザーはCoNETのゲットウェイを経由で、スポンサーが提供するウェブサイトにアクセスする際、発生したアクセスデータ量はユーザアカウトに記入しません。ただしCoNETのフリーアカウトは当日または当月データの使用量がリミットになった場合、CoNETゲットウェイに接続ができないの場合はご利用もできないので、ご注意をしてください。',
        },
        QTGateInfo: {
            title: '機能紹介',
            version: 'バージョン：v',
            detail: [
                {
                    color: '#a333c8',
                    icon: 'exchange',
                    header: '自由匿名なインターネットへOPN',
                    detail: '@OPNは本社の世界初のIP不要な通信技術です、<a onclick="return linkClick (`https://ja.wikipedia.org/wiki/Advanced_Encryption_Standard`)" href="#" target="_blank">AES256-GCM</a>と<a onclick="return linkClick (`https://ja.wikipedia.org/wiki/Pretty_Good_Privacy`)" href="#" target="_blank">OpenPGP</a>暗号化したEmailメッセージを通じたゲットウェイに接続します、iOPNは本社の独自のHTTPゲットウェイ暗号化高速通信技術です。どちらとも身を隠して誰も知らないうちにインターネットへ、プライバシー、ネットワーク監視とアクセスを制限・遮断にうまくすり抜けることができます。',
                },
                {
                    color: '#e03997',
                    icon: 'talk outline',
                    header: 'IP不要な匿名プライバシーインスタントメッセージQTChat',
                    detail: 'CoNETユーザー間の無IPペアーツーペアープライバシーインスタントメッセージです。それは伝統的なインスタントメッセージより匿名とプライバシーが可能です。又グループをして複数なユーザーの間でのインスタントメッセージもご利用いただけます。文字をはじめ、写真やビデオ映像、あらゆるファイルの暗号化転送も可能です。CoNETシステムはインスタントメッセージを各ユーザへ転送することだけですから、メッセージの内容をチェックするまたはメッセージ所有することではありませんので、メッセージそのものに法的責任は、メッセージをしたユーザーが負うです。',
                },
                {
                    color: '#6435c9',
                    icon: 'cloud upload',
                    header: 'ファイルを匿名プライバシーストレージとシェアQTStroage',
                    detail: '一つのファイルを暗号化してからスプリットし、多数のフリーメールアカンウトに保存します。無限かつ秘密プライバシーのファイルストレージ事ができます。CoNETユーザー間のファイルシェアも可能です。',
                },
                {
                    color: 'darkcyan',
                    icon: 'spy',
                    header: 'スパイソフトウェア送信を切断',
                    detail: 'CoNETシステムはグロバルDNSBLに加入し、スパイホストダータベースを更新しています。CoNETユーザはCoNETシステムをご利用してインターネットへアクセスした場合、あなたのデバイスに闇活動しているスパイソフト、収集したあなたの個人データの送信を切断することができます。',
                },
                {
                    color: '#6435c9',
                    icon: 'external share',
                    header: 'ローカルVPNサーバ',
                    detail: 'CoNETユーザは自宅のマシンにVPN接続により、外にいても楽々OPNで隠れたネットワークへご利用できます。',
                },
            ],
        },
        useInfoWindows: {
            title1: 'Windows10ロカールプロキシ設定',
            info: [
                {
                    title: ' その他Windowsバージョンの設定について',
                    titleImage: '',
                    detail: '<p>Windowsその他バージョンの設定は<a target="_blank" href="#" onclick="return linkClick (`https://support.microsoft.com/ja-jp/help/135982/how-to-configure-internet-explorer-to-use-a-proxy-server`)">Microsoft社のページ</a>をご参照してください。</p><p>設定する際使うデータは以下です：</p>',
                    image: '',
                },
                {
                    title: 'Internet Explorerを開く',
                    titleImage: '/images/IE10_icon.png',
                    detail: '<p>右上部のツールボタンをクリックして、メニューの一番下にある設定を選択してください。</p>',
                    image: '/images/windowsUseInfo1.jpg',
                },
                {
                    title: 'メニューを一番下にスクロールして高級設定をクリック',
                    titleImage: '',
                    detail: '',
                    image: '/images/windowsUseInfo2.jpg',
                },
                {
                    title: '再びメニューを下にスクロールして、オプンプロキシ設定をクリック',
                    titleImage: '',
                    detail: '',
                    image: '/images/windowsUseInfo3.jpg',
                },
                {
                    title: '自動プロキシをオンに',
                    titleImage: '',
                    detail: '<p>WINDOWS 10 システムはHTTPとHTTPSしかサポートしておりませんが、SOCKSを使うなら、他のブラウザ例えばFireFoxなどをインストールによりお使いは可能です。</p>',
                    image: '/images/windowsUseInfo4.jpg',
                },
            ],
        },
        useInfoMacOS: {
            title: 'ローカルプロキシサーバはバックグランドで実行しています。他のデバイスはローカルプロキシに設定による、CoNET利用してインターネットへアクセスができます。',
            title1: 'MacOS プロキシ設定',
            customProxy: 'サーバ作成しました',
            proxySetupHelp: 'ヘルプなら、以下のそれぞれのOSアイコンをクリックしてください。',
            webRTCinfo: 'WebRTC漏れ対応はSOCKSプロキシ設定をしてください。WebRTC漏れをテストするしたい場合は<a href="/Wrt" target="_blank">ここ</a>をクリックしてください',
            wrtTest: 'テスト結果は以下です：',
            wrtTestAreaTitle: 'WebRTC漏れデーターエリア',
            globalIpAddress: 'このIPアドレスが提示したら、あなたの真実IPがWebRTC漏れてしまいます。',
            localIpAddress: 'ここのIPはローカルネットワークIPアドレス漏れです、大したことはないです。',
            proxyServerIp: '<p>プロキシの設定に：<span style="color:red;">自動設置</span></p>',
            proxyServerPort: 'HTTPとHTTPSプロキシは：',
            proxyServerPassword: 'SOCKSプロキシは：',
            info: [
                {
                    title: 'コントロールパネルを開いて、ネットワークをクリックしてください。',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '',
                    image: '/images/userInfoMacos1.jpg',
                },
                {
                    title: '詳細...をクリックしてください ',
                    titleImage: '',
                    detail: '',
                    image: '/images/macosUserInfo2.jpg',
                },
                {
                    title: 'プロキシ設定を選んで、自動設置をチェック、簡単ホストをチェック',
                    titleImage: '',
                    detail: '<p>右の入力にHTTPとHTTPSは上のブルー行を、SOCKSは下の行を入力してください。</p>',
                    image: '/images/macosUserInfo3.jpg',
                },
            ],
        },
        firefoxUseInfo: {
            title1: 'Firefoxブラウザーは単独プロキシ設定で、システムに影響なしでプロキシをご利用してインタネットアクセスができます。',
            info: [
                {
                    title: 'Firefoxをオプンしてツールアイコンをクリックして、設置を選んでください。',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '<p><a href="https://www.mozilla.org/ja/firefox/#" target="_blank">Firefoxダウンロード</a></p>',
                    image: '/images/firefox1.jpg',
                },
                {
                    title: '一番下にスクロールしてプロキシネットワークに、詳細設定を選択します',
                    titleImage: '',
                    detail: '',
                    image: '/images/firefox2.jpg',
                },
                {
                    title: '自動設定を選んで、ドメインをSOCKS v5を選んで',
                    titleImage: '',
                    detail: 'HTTPとHTTPSは上のブルー行を、SOCKSは下の行を入力してください。',
                    image: '/images/firefox3.jpg',
                },
            ],
        },
        useInfoAndroid: {
            title1: 'Androidロカールプロキシ設定',
            info: [
                {
                    title: `端末の設定アプリを開きます。[Wi-Fi]をタップします`,
                    titleImage: '/images/androidSetup.jpg',
                    detail: '',
                    image: '/images/android1.jpg',
                },
                {
                    title: 'Wi-Fiネットワーク名を押し続けます。[ネットワークを変更]をタップします',
                    titleImage: '',
                    detail: '',
                    image: '/images/android2.jpg',
                },
                {
                    title: '[詳細設定項目]の横にある下矢印をタップして、自動設定を選択します',
                    titleImage: '',
                    detail: 'HTTPとHTTPSは上のブルー行を、SOCKSは下の行を入力してください。',
                    image: '/images/android3.jpg',
                },
            ],
        },
        useInfoiOS: {
            title1: 'iOSロカールプロキシ設定',
            info: [
                {
                    title: 'コントロールパネルを開いて、WiFiをタップしてください',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '',
                    image: '/images/iOS1.jpg',
                },
                {
                    title: 'Wi-Fiネットワーク名の右にあるまるiアイコンをタップしてください',
                    titleImage: '',
                    detail: '',
                    image: '/images/iOS2.jpg',
                },
                {
                    title: '一番下のプロキシ設定をタップしてください',
                    titleImage: '',
                    detail: '',
                    image: '/images/iOS3.jpg',
                },
                {
                    title: '自動設定を選択。',
                    titleImage: '',
                    detail: '<p>URLにHTTPとHTTPSは上のブルー行を、SOCKSは下の行を入力してください。</p>',
                    image: '/images/iOS4.jpg',
                },
            ],
        },
        cover: {
            firstTitle1: 'Kloak OS',
            firstTitle2: '信頼とプライバシー及セキュリティなインターネット',
            firstTitle3: '革命的なIPアドレスない通信網、伝統インターネットルールを挑む',
            start: 'オプンドア',
            proxyStoped: 'カスタマーゲートウェイサーバーが停止しました、再作成をしてください。',
        },
        firstNote: {
            title: 'CoNETの製品およびサービス（以下「本サービス」）をご利用いただきありがとうございます。本サービスはカナダCoNETテクノロジ株式会社（以下はCoNETと言い）が提供しています。',
            firstPart: 'ユーザーは、本サービスを利用することにより、本規約に同意することになります。以下を注意してお読みください。',
            detail: [
                {
                    header: '本サービスのご利用について',
                    detail: '本サービス内で入手できるすべてのポリシーを遵守してください。本サービスを不正に利用しないでください。たとえば、本サービスの妨害や、CoNETが提供するインターフェースおよび手順以外の方法による、本サービスへのアクセスを試みてはなりません。',
                },
                {
                    header: null,
                    detail: 'ユーザーは、法律（輸出、再輸出に関して適用される法規制を含みます）で認められている場合に限り、本サービスを利用することができます。ユーザーがCoNETの規約やポリシーを遵守しない場合、またはCoNETが不正行為と疑う行為について調査を行う場合に、CoNETはユーザーに対する本サービスの提供を一時停止または停止することができます。',
                },
                {
                    header: '無IP通信技術CoNETネットワークはプライベートに限界があります',
                    detail: '無IP通信は弊社の革新的技術であります。あなたはCoNET端末ソフトを使ってCoNETシステムとのコミニュケーションはお客さんが無IPでプライベートな通信を行います。でもお客さんのIPアドレスはeメールプロバイダーのログに記録していたかもしれません。裁判所命令を持つカナダの法執行機関はCoNETのログを得て、eメールプロバイダーのログと合併して、お客さんのプライベートインフォメーションを入手することも可能です。',
                },
                {
                    header: null,
                    detail: 'ユーザーは、本サービスを利用することによって、本サービスまたはアクセスするコンテンツに対するいかなる知的財産権も取得することはありません。ユーザーは、本サービスのコンテンツの所有者から許可を得た場合や、法律によって認められる場合を除き、そのコンテンツを利用することはできません。本規約は、本サービスで使用されている、いかなるブランドまたはロゴを利用する権利もユーザーに与えるものではありません。本サービス内に表示される、または、本サービスに伴って表示されるいかなる法的通知も、削除したり、隠したり、改ざんしてはなりません。',
                },
                {
                    header: '個人情報保護及びCoNETからのインフォーメーションの受信について',
                    detail: '本サービスの利用に関して、CoNETはユーザーに対してサービスの告知、管理上のメッセージ、およびその他の情報を送信することができます。ユーザーは、これらの通知について、受け取らないことを選択できる場合があります。',
                },
                {
                    header: null,
                    detail: 'お客様がCoNETサービスをご利用になる際に、お客様のデータ通信料計算のために、ご利用データ量が自動的に収集および保存されます。限られたログは以下のようです。日付、お客様アカウント、ご利用ゲットウェーエリアとゲットウェーIPアドレス、データ量、アップ又はダウンロード。例：',
                },
                {
                    header: null,
                    detail: '<p class="tag info">06/20/2017 18:12:16, info@CoNET.com, francisco, 104.236.162.139, 300322 byte up, 482776323 byte down.</p><p class="tag info">06/21/2017 12:04:18, info@CoNET.com, francisco, 104.236.162.139, 1435226 byte up, 11782238 byte down.</p>',
                },
                {
                    header: null,
                    detail: 'CoNETは以上の情報以外には保存することしません。CoNETは以上の情報をカナダーの裁判所命令を持つカナダの法執行機関に協力することがありえます。カナダ以外のこのログ情報を協力する要請のあなたは、まずカナダ外務省までお問い合わせ下さい：',
                },
                {
                    header: null,
                    detail: '<a class="tag alert" href="http://www.international.gc.ca/">http://www.international.gc.ca/</a>',
                },
                {
                    header: 'ソフトウェアの版権について',
                    detail: 'CoNETは、本サービスの一環としてユーザーに提供するソフトウェアについて、全世界で適用され、譲渡不可で、非独占的な個人使用ライセンスを無償でユーザーに付与します。このライセンスは、CoNETが提供する本サービスを本規約により許可された方法でユーザーが使用し、その便益を享受できるようにすることを唯一の目的としています。',
                },
                {
                    header: null,
                    detail: 'ユーザーは、本サービスまたは本サービスに含まれるソフトウェアのどの部分も、複製、変更、配信、販売、貸与することはできず、そのソフトウェアのソース コードのリバース エンジニアリングや抽出を試みることはできません。',
                },
                {
                    header: '本サービスの変更または終了',
                    detail: 'CoNETは、常に本サービスの変更および改善を行っています。CoNETは、機能性や機能の追加や削除を行うことができ、本サービス全体を一時停止または終了することができます。ユーザーはいつでも本サービスの利用を終了することができます。CoNETもいつでも、ユーザーに対する本サービスの提供を停止し、または、本サービスに対する制限を追加または新規に設定することができます。',
                },
                {
                    header: '保証および免責',
                    detail: 'CoNETは、商業上合理的な水準の技術および注意のもとに本サービスを提供し、ユーザーに本サービスの利用を楽しんでいただくことを望んでいますが、本サービスについて約束できないことがあります。',
                },
                {
                    header: null,
                    detail: '本規約または追加規定に明示的に規定されている場合を除き、CoNETまたはそのサプライヤーもしくはディストリビューターのいずれも、本サービスについて具体的な保証を行いません。たとえば CoNETは、本サービス内のコンテンツ、本サービスの特定の機能、その信頼性、利用可能性、またはユーザーのニーズに応える能力について、何らの約束もしません。本サービスは「現状有姿で」提供されます。',
                },
                {
                    header: '本サービスに対するCoNETの責任',
                    detail: '法律で認められる場合には、CoNETならびにそのサプライヤーおよびディストリビューターは、逸失利益、逸失売上もしくはデータの紛失、金銭的損失、または間接損害、特別損害、結果損害もしくは懲罰的損害について責任を負いません。',
                },
                {
                    header: 'カナダー法律によるサービス禁止対象者',
                    detail: 'あなたはカナダー法律によってサービス禁止対象者ではありませんと確認していた事。',
                },
                {
                    header: '事業者による本サービスの利用',
                    detail: '本サービスを事業者のために利用する場合、その事業者は本規約に同意するものとします。かかる事業者は、CoNETとその関連会社、役員、代理店、従業員を、本サービスの利用または本規約への違反に関連または起因するあらゆる請求申し立て、訴訟、法的措置について、請求申し立て、損失、損害、訴訟、裁判、告訴から生じる法的責任および費用、弁護士費用を含め、免責および補償するものとします。',
                },
                {
                    header: '本規約について',
                    detail: 'CoNETは、たとえば、法律の改正または本サービスの変更を反映するために、本サービスに適用する本規約または特定の本サービスについての追加規定を修正することがあります。ユーザーは定期的に本規約をご確認ください。CoNETは、本規約の修正に関する通知をこのページに表示します。',
                },
                {
                    header: null,
                    detail: '追加規定の修正については、該当する本サービス内において通知を表示します。変更は、さかのぼって適用されることはなく、その変更が表示されてから 14 日以降に発効します。ただし、本サービスの新機能に対処する変更または法律上の理由に基づく変更は、直ちに発効するものとします。本サービスに関する修正された規定に同意しないユーザーは、本サービスの利用を停止してください。',
                },
                {
                    header: null,
                    detail: '本規約と追加規定との間に矛盾が存在する場合には、追加規定が本規約に優先します。本規約は、CoNETとユーザーとの間の関係を規定するものです。本規約は、第三者の受益権を創設するものではありません。ユーザーが本規約を遵守しない場合に、CoNETが直ちに法的措置を講じないことがあったとしても、そのことによって、CoNETが有している権利（たとえば、将来において、法的措置を講じる権利）を放棄しようとしていることを意味するものではありません。',
                },
                {
                    header: null,
                    detail: 'ある特定の規定が強制執行不可能であることが判明した場合であっても、そのことは他のいずれの規定にも影響を及ぼすものではありません。カナダBC州の抵触法を除き、本規約または本サービスに起因するまたは関連するいかなる紛争に関しても、カナダBC州の法律が適用されます。本規約または本サービスに起因するまたは関連するいかなる主張についても、カナダBC州内に所在する裁判所においてのみ裁判手続を取ることができるものとし、ユーザーとCoNETはその裁判所の対人管轄権に同意するものとします。',
                },
            ],
            disagree: 'キャンセル',
            agreeMent: 'CoNET利用規約とプライバシー',
        },
        linuxUpdate: {
            newVersionDownload: 'クリックしてダウンロードとインストール',
            step1: '最新バージョンにアップデート：',
            step2: 'CoNETを実行ファイルに許可与える。',
            step2J1: '/images/linuxUpdate1_jp.jpg',
            step2J2: '/images/linuxUpdate2_jp.jpg',
            step2_detail1: '右クリックダウンロードしたCoNETファイル、プロパティを選んでください。',
            step2_detail2: 'アクセス権にポログラムとして実行可能をチェック',
            step3: '旧バージョンCoNETを退出して、新しいCoNETバージョンをダブクリックしてインストールをします。',
            exit: '旧CoNETを退出',
            tryAgain: 'もう一度',
            refresh: 'リロードページ',
        },
        topWindow: {
            title: 'カナダ１５０周年特別提供',
        },
        imapInformation: {
            title: '通信専用Emailアカウントを登録',
            tempImapAccount: `IMAP設定に困るなら、<a href="#" style = "margin-left: 0.5em;" class="ui label teal" onclick="return linkClick ('https://github.com/QTGate/QTGate-Desktop-Client/wiki/IMAP%E9%80%9A%E4%BF%A1%E5%B0%82%E7%94%A8%E4%B8%80%E6%99%82%E7%9A%84%E3%81%AA%E3%82%A2%E3%82%AB%E3%83%B3%E3%82%A6%E3%83%88')">CoNETご提供している一時アカンウトをテストのご利用いただけます。</a>`,
            infomation: `通信専用Emailアカウントを設置してください。面倒見ていれば　`,
            coNetTempAccount: 'CoNet提供している一時的なEmailアカウント',
            serverDetail: '詳細設定：',
            imapServer: 'IMAP設定',
            imapServerInput: 'IMAPサーバー名又はIP',
            UserName: 'ログインユーザー名',
            Ssl: 'Ssl暗号化通信：',
            portName: '通信ポート番号',
            otherPortNumber: 'その他：',
            Error_portNumber: '通信ポート番号は1から65535まで、22ではないの数字です。',
            smtpServer: 'SMTP設定',
            smtpServerInput: 'SMTPサーバー名又はIP',
            emailServerPassword: 'Emailパスワード(アプリパスワードお勧め)',
            imapAccountConform: function (iamp, account) {
                return `<p class="ui small header brown">以下の事項をよく確認してから、送信ボタンを押してください：</p><p>このEmailアカンウト「<B class="red">${iamp}</B>」はあなたがCoNETシステムを使用するのために、一時的新たに作ったEmailアカンウトです。あなたはCoNETにこのEmailアカンウトのアクセス権にすることが了承しました。</p><p>以下の内容をCoNETへ送信することを了承すること：メールアカウント「<B class="red">${iamp}</B>」とAPPパスワード、メールアドレス「<B class="red">${account}</B>」、使う言語、タイムゾーン、パブリックキー。</p><p>あなたはCoNETに「<B class="red">${account}</B>」へCoNETに関わるシステム情報、支払い、アカンウト、販促などを送信することを了承と認可をします。</p>`;
            },
            agree: '私はそのリスクが了承して続きする',
            imapOtherCheckError: 'Emailサーバーに接続ができませんでした。Emailサーバー名又はIPアドレス又は通信ポート番号に間違いがあります、詳細設定で再チェックをしてください。',
            CertificateError: 'Emailサーバーに提示したセキュリティ証明書は信頼できないものです。続くをしたい場合は、詳細設定の中の「セキュリティ証明書信頼でき無くとも接続をする」を選択してください。その場合はあなたのEmailインフォメーションを漏れる可能性があります。',
            IgnoreCertificate: 'セキュリティ証明書信頼でき無くとも接続をする',
            Certificat: '危ないこのです、この選択であなたのユーザ情報は盗聴される可能性が大きい。',
            addAEmail: '通信用Email追加',
            AuthenticationFailed: 'Emailサーバはログインエラーが提示しました。ユーザー名とパスワードを再チェックしてください。',
            tryAgain: 'もう一度試しにします',
            connectImap: 'CoNETに接続にします',
            cancelConnect: 'CoNETとの接続を中止します',
            imapItemTitle: '通信用Email詳細設定',
            loaderText: [
                'C',
                'o',
                'N',
                'E',
                'T',
                'へ',
                '接',
                '続',
                'を',
                'し',
                'て',
                'い',
                'ま',
                'す',
                '...',
            ],
            imapCheckingStep: [
                /* 0 */ 'emailサーバへ接続しています。',
                /* 1 */ 'emailサーバへIMAP接続しました、CoNETからレスポンスを待ちます。',
                /* 2 */ 'emailサーバへSMTP接続しました',
                /* 3 */ 'CoNETクライアントは接続要請のメールをCoNETシステムへ送信しました、接続を完了するまで時間がかかるのためしばらくお待ちおください。',
                /* 4 */ 'CoNETへ接続しました',
                /* 5 */ 'emailサーバへIMAP接続しました',
            ],
            imapResultTitle: 'IMAPサーバCoNET評価：',
            testSuccess: 'emailサーバのテストが完了しました',
            exitEdit: '退出編集Emailアカンウト',
            deleteImap: 'IMAPアカウトを削除',
            proxyPortError: 'ポート番号は3001から65535までの数字です。又指定したポートは他のアプリが使っています。番号を直してみてください。',
            appPassword: 'APPパスワードについて',
            imapCheckError: [
                'Emailサーバーに接続ができませんでした。ネットワークがオフラインか、所在しているネットワークはメール通信プロトコルがサポートしておりません。ネット環境をチェンジし、ページを更新してからもう一回してみてください。',
                'Emailサーバはログインエラーが提示しました。ユーザー名とパスワードを再チェックしてください。',
                'Emailサーバーに提示したセキュリティ証明書は信頼できないものです。中間者攻撃があるネット環境にいるあもしれないです。このようなエラーの発生は多くのケースでは、Kasperskyのようなウイルス防止ソフトウェアは、メールウイルスをチェックする設定をしてしまうと、中間者検閲サーバーをローカルで作って通信するメールをチェック仕込みですが、それをオーフすればエラーが無くなるはずです。',
                'メール送信の際にエラーが発生しました。そのようなエラーは多分パスワードをAPPパスワードではなく、普通のパースワードを使った模様です。APPパスワードをチェックしてもう一回してみてください。',
                'ネットはインターネットに接続していない模様です。',
                'エラーが発生しました。CoNETを一回退出してからもう一回してみてください。',
                'メールストレージ容量が一杯です、不要なメールを削除してからもう一回してみてください。',
            ],
        },
        Home_keyPairInfo_view: {
            newVersionDownload: 'クリックしてダウンロードとインストール',
            title: '鍵ペアインフォメーション',
            emailNotVerifi: '鍵ペアはまだCoNETサインされていません。',
            emailVerified: '鍵ペアはCoNETサインされました。',
            NickName: 'ニックネーム：',
            creatDate: '暗号鍵ペア作成日：',
            keyLength: '暗号鍵ペアビット長さ：',
            password: '秘密キー保護パスワードを設定してください',
            password1: 'パスワード',
            logout: 'ログアウト',
            deleteKeyPairHaveLogin: 'ログインした端末で暗号鍵ペアを削除して下さい。',
            keyID: '暗号鍵ID：',
            deleteKeyPairInfo: '鍵ペアを削除することで、CoNet設定及保存している秘密ファイルは回復できません',
            delete: '削除',
            locked: '鍵ペアパスワード、忘れた場合この鍵を削除してください',
            systemError: 'システムエラーが発生しました。鍵ペアを削除して一からシステムを再設定をしてください。',
        },
        home_index_view: {
            newVersion: '新たなパージョンが用意しましたのでインストールをください。',
            newVersionInstallLoading: '更新中お待ちください',
            localIpAddress: 'ローカル',
            clickInstall: 'インストール',
            internetLable: 'Internet',
            gateWayName: 'ゲットウェー',
            showing: 'システム状態',
            nextPage: '次へ',
            agree: '協議を合意し、次へ',
            imapEmailAddress: 'Emailアカウト名',
            emailAddress: 'Email',
            SystemAdministratorNickName: 'ニックネーム',
            creatKeyPair: '暗号鍵ペアを生成...',
            keyPairCancel: '暗号鍵ペアの生成をキャンセルしました',
            keyPairGenerateError: '暗号鍵ペアの生成にエラーが発生しました、後ほどもう一回してみて下さい',
            keyPairGenerateSuccess: '暗号鍵ペアの生成は完了しました',
            systemPassword: 'CoNET端末パスワードの設定',
            stopCreateKeyPair: '暗号鍵ペア生成をキャンセル',
            cancel: '操作停止',
            continueCreateKeyPair: '生成を続きします',
            KeypairLength: 'RSA暗号鍵ペアの長度を選んでください。この数字が長ければ、長いほど秘匿性によいですが、スピードが遅くなります。',
            systemAdministratorEmail: 'RSA暗号鍵ペア生成',
            GenerateKeypair: '<em>強秘匿性通信するのために、RSA暗号鍵ペアを生成中、大量なランダム数字が発生し、数分かかる場合もあります、4096ビットの場合、特に時間がかかります、しばらくお待ち下さい。RSA暗号技術について、ウィキペディア百科辞典を参考してください：' +
                `<a href='https://ja.wikipedia.org/wiki/RSA暗号' target="_blank" onclick="return linkClick ('https://ja.wikipedia.org/wiki/RSA暗号')">https://ja.wikipedia.org/wiki/RSA暗号</a></em>`,
            inputEmail: '暗号化通信の鍵(curve25519)を生成',
            accountEmailInfo: 'CoNETドメイン名は、ファイヤウォールがある場合はブラックリストに入っている可能性がありますから、CoNETシステムへ登録完了することができません。その場合はファイヤウォール外側のEmailシステムを利用してください。',
            dividertext: 'オプション',
        },
        error_message: {
            title: 'エラー',
            errorNotifyTitle: 'システムエラー',
            EmailAddress: [
                'メール アドレスを someone@example.com の形式で入力してください。',
                '同じEmailアカンウトが既に存在します。',
                '入力したメールはCoNETシステム非対応です。',
            ],
            required: 'このフィールドを入力してください。',
            PasswordLengthError: '5文字以上の長さのパスワードが必要。',
            localServerError: 'ローカルサーバーエラーが発生しました、CoNETを再起動をください！',
            finishedKeyPair: '暗号鍵ペア作成完了しました。',
            Success: '完成',
            doCancel: 'キャンセルしました',
            errorKeyPair: '暗号鍵ペア作成際エラーが発生、もう一度してください。',
            SystemPasswordError: '暗号鍵パスワードが違います。パースワードが忘れた場合、現在の鍵ペアを削除してください。この場合は、現有の設定はなくなって、一からシステム設定をやり直しが必要です。',
            finishedDeleteKeyPair: '暗号鍵ペア削除しました。',
            offlineError: 'インターネット接続されていないらしいですが、ネットワークをチェックしてもう一度お試しください！',
            imapErrorMessage: [
                /* 0 */ 'CoNETと接続ができませんでした。CoNETサービスが一時停止しています。後ほどもう一度してみてください。またはCoNETサービスにお問い合わせしてください。',
                /* 1 */ 'データフーマットエラー！',
                /* 2 */ 'インターネット接続されていないらしいですが、ネットワークをチェックしてもう一度お試しください！',
                /* 3 */ 'mailサーバはIMAPユーザー名又はパスワードに間違いがあると提示しました！このエラーは普通パスワードを使っていましたか、またはAPPパスワードが失効と可能性もありますが、メールプロバイダのアカウトページへチェックをしてください。',
                /* 4 */ '指定したPORTでemailサーバへIMAPの接続ができませんでした、PORT番号をチェックしてください、ファイヤウォールの中にいる場合、指定したPORTはファイアウォールにフィルタした可能性があ裏ます、IMAPサーバーのその他有効PORT番号にチェッジしてください。<a href="https://tw.help.yahoo.com/kb/SLN15241.html" target="_blank" onclick="return linkClick (`https://tw.help.yahoo.com/kb/SLN15241.html`)">应用密码</a>',
                /* 5 */ 'IMAPサーバのセキュリティ証明書信頼できません。詐欺や、お使いのコンピューターからサーバーに送信されると情報を盗み取る意図が示唆されている場合があります。',
                /* 6 */ 'Emailサーバドメインは有効ではありません、emailサーバの設定を修正してください。又このPCはインターネットに接続しておりません、ネットワークをチェックしてください。',
                /* 7 */ 'このemailサーバはCoNET通信技術サポートしていません、もう一度テストをするか、他のemailプロバイダにチェンジをしてください。',
                /* 8 */ 'emailサーバはSMTPユーザー名又はパスワードに間違いがあると提示しました！',
                /* 9 */ 'SMTPサーバのセキュリティ証明書信頼できません。詐欺や、お使いのコンピューターからサーバーに送信されると情報を盗み取る意図が示唆されている場合があります。',
                /* 10 */ 'SMTPサーバへ接続ができません。',
                /* 11 */ '同じEmailアカンウトが既に存在します。',
                /* 12 */ 'CoNETと接続ができていません！',
                /* 13 */ 'ご利用メールアドレスのメールボックス容量がいっぱいになっています。',
                /* 14 */ '通信に未知のエラーが発生しました。',
            ],
            CoNET_requestError: [
                /* 0 */ 'CoNETが応答していなかったです。CoNET通信を再確立しています。しばらくお待ちください！ ',
                /* 1 */ '無効な操作です！',
            ],
        },
        emailConform: {
            activeViewTitle: '鍵ペア検証',
            requestReturn: [
                'エラー発生しました、それは短時間内多数の請求をしたことです。',
                '検証メールを発送しました。',
            ],
            info1_1: `鍵ペア検証は未完成です。「検証Emailを発行」を押してからメールボクス「`,
            info1_2: `」をチェックしてください。CoNETから多数メールの場合は、最後のを選んでください。CoNETからのメールが見つからない場合は、鍵ペアを生成するメールアドレスを正しいかどうか、ダブチェックしてください。または鍵ペアを削除して新しい鍵ペアを再作成をしてください。`,
            info2: 'コピーするのは「-----BEGIN PGP MESSAGE-----」から「-----END PGP MESSAGE-----」まで全ての内容をしてください。',
            emailTitle: 'CoNETをご利用頂いて誠に有難うございます',
            emailDetail1: '',
            emailDetail1_1: ' 様',
            emailDetail2: 'あなたのCoNETアカンウト検証暗号です。以下の全ての内容をコピーして、認証フィルターにペーストをしてください。',
            bottom1_1: '以上',
            bottom1_2: 'CoNETチームより',
            conformButtom: '検 証',
            reSendRequest: '検証Emailを発行',
            formatError: [
                'フォーマットエラー、コピーするのは「-----BEGIN PGP MESSAGE-----」から「-----END PGP MESSAGE-----」まで全ての内容をしてください。',
                'この内容で暗号化解除ができませんでした。鍵ペアEmailアカンウトメールボックス再検査し、CoNETから最後のを選んでください。または鍵ペアを削除して、鍵ペア再発行してください。',
                'CoNETに接続するのはエラーが発生した、一回退出し、再起動して接続をしてください。',
                '検証できません！CoNETから多数メールの場合は、最後のを選んでください。',
                'あなたのCoNETには問題があります、鍵ペアを削除して一から再セットアップしてください。',
                /*5*/ 'ごめんなさい、CoNETシステムは応答してくれません、オフラインかもしれません。後からもう一度試しにしてください',
                'あなたの今日データ通信はリミットになっていますので、明日まで待ってください。またはユーザー種類をアップグレードをしてください',
                '通信用IMAPの設定にエラーがあるか又はそのタープのIMAPアカンウトがCoNETサポートしません。よくチェックしてもう一回試しにしてください。',
                '選択していたゲットウェーエリアは只今接続不能になっております、後ほどもう一度試しにしてください。',
                'IMAPアカウトでEMAIL送信する際エラーが発生しました、一回退出し、起動して見てくださいね。重複発生した場合はIMAPアカウトのウェーブページでアカウトをアンロック操作を必要かもしれない。',
                'ページセッションが終了しました。続行するにはページを更新するか、またCoNETを再起動してください',
                'CoNETプラットフォームが故障になったと思いますが、CoNETを再起動してください',
            ],
            activeing: '通信中',
        },
        QTGateRegion: {
            title: '高品質カスタマーゲートウェイサービスエリア',
            speedTest: 'スピードテスト：',
            available: 'サービス中',
            unavailable: '準備しています',
            CoGateRegionStoped: 'ゲートウェイサーバーシャットダウンされました。',
            requestPortNumber: 'ゲートウェイサーバーとの通信ポート:',
            proxyDomain: 'ドメイン検索はCoNETゲットウェイ側に依頼します。',
            setupCardTitle: '接続技術:',
            paidUse: 'このエリアは契約ユーザーだけ使えます。',
            MultipleGateway: '並列使うゲットウェイ数',
            dataTransfer: '通信データは：',
            dataTransfer_datail: [
                '全てのデータをOPN経由',
                'ターゲットサーバへ到達不能時だけ',
            ],
            proxyDataCache: 'Webキャッシュ:',
            proxyDataCache_detail: ['Yes', 'No'],
            clearCache: 'クリアオールキャッシュ',
            cacheDatePlaceholder: 'Webキャッシュ有効期限',
            localPort: 'ローカルプロキシポート番号:',
            option: '詳細設定',
            localPath: 'ローカルプロキシポートPATHを指定します。',
            outDoormode: '接受外網訪問',
            WebRTCleak: 'WebRTC漏れ対応',
            WebRTCleakInfo: 'EtoEのゲイムやチャットなど動作しないかもしれません。',
            pingError: 'CoNETゲットウェイエリアスピードチェックエラーが発生しました。一回CoNETを終了して、管理者としてCoNETを再起動をして、スピードチェックをしてください。',
            QTGateRegionERROR: [
                'CoNETへ接続要請メールの送信ができなかったです。IMAPアカウントの設定を調べてください。',
                '',
            ],
            sendConnectRequestMail: [
                'CoNETクライアントはCoNETシステムとの接続が切れた。再接続要請メールをCoNETシステムへ送信しました、接続を完了するまで時間がかかるのためしばらくお待ちおください。',
                'CoNETに長い間ご利用していなっかた時、接続は切れた場合もあります。',
            ],
            GlobalIp: 'グロバールIP:',
            GlobalIpInfo: '要注意：【CoNET接続】をおすとあなたのグロバールIPアドレスをCoNETシステムに送信しますので、それを遠慮すれば【@OPN】接続を選んでください。@OPN技術がサンフランシスコリージョンに、iCloudメールしか対応しておりません。',
            cacheDatePlaceDate: [
                { name: '1時間', id: 1 },
                { name: '12時間', id: 12 },
                { name: '一日', id: 24 },
                { name: '15日', id: 360 },
                { name: '1月', id: 720 },
                { name: '6月', id: 4320 },
                { name: '永遠', id: -1 },
            ],
            connectQTGate: 'CoNETゲットウェーエリアインフォメーションを取得しています...',
            atQTGateDetail: [
                /*0*/ 'CoNETの世界初のIP不要な通信技術です。暗号化したEmailメッセージを通じたゲットウェイに接続することで、身を隠して誰も知らないうちにインターネットへ、プライバシーと強くファイヤウォールをうまくすり抜けることができます。但しお使いメールサーバの性能に次第スピードが遅くなり、長い遅延など短所があります、ゲームやビデオチャットなどに通信障害出る可能性があります。この技術はiCloudアカンウトのみ対応です',
                /*1*/ 'CoNETオリジナル技術のトラフィックをHTTPに偽装した暗号化通信技術です。あなたのIPを使ってゲットウェイに直接接続することで、高速通信とプライバシー、強くファイヤウォールをうまくすり抜けることができます。インターネット自由アクセスのためにCoNETを使うことになら、これをおすすめです。',
                /*2*/ 'ドメイン検索をCoNETゲットウェイ側にすることで DNS cache pollution を防ぐことができます。この選択は必要です。',
                /*3*/ '全てインターネットデータをCoNETゲットウェイに通じてすることで、匿名でインターネットアクセスします。',
                /*4*/ 'ローカルネットワークが目標サーバに到達不能な際に、CoNETゲットウェイ通じてします。このことはネットスピードがアップできますが、プライバシーが無くなります。',
                /*5*/ 'アクセスしたWebサイトを一時ファイルに保持することで、高速レスポンスが利用可能となります、CoNETはいつも暗号化したデータを本機に保存します。但し暗号化通信には不対応です。',
                /*6*/ 'キャッシュを保存しません。',
                /*7*/ 'キャッシュ有効期限の設定によって、いつもサーバ側の最新情報を入手することができます。単位は時間です。',
                /*8*/ 'ローカルプロキシサーバーが他のデバイスをこのポートに接続によってCoNETデータの通信を利用可能です。3001から65535の間の数字を入れてください。',
                /*9*/ 'ローカルポロックPATHを指定することで、あなたのローカルポロックサーバを簡単セキュリティを与えられます。無断使用を禁止することができます。',
                /*10*/ '同時に使うゲットウェイ数目を指定します。この技術はネットワークの大流量をいくつかのIPアドレスに分散して、監視者から逃げられます。この機能は有料会員しかのです。',
                /*11*/ 'CoNETゲットウェーとの通信ポート番号を指定します。あなた所在するネットワークの制限された通信ポートから避けることができます。',
                /*12*/ 'Web Real-Time Communication (WebRTC)は、ブラウザ間で仲介なしのIPアドレス直接的な、高速やり取りを可能にするオープン標準技術です。悪用の場合は、真実のIPアドレスを検出するをWebRTC漏れと呼ばれるものです',
            ],
        },
        QTGateGateway: {
            title: 'CoNETサービス使用詳細',
            processing: 'CoNETネットワークへ接続中...',
            error: [
                /* 0 */ 'エラー：あなたのアカンウトに既にCoNETゲットウェイに接続しているクライアントがありますが、その接続を退出してからもう一度接続してください。',
                /* 1 */ 'エラー：あなたのアカンウトにCoNETゲットウェイデータ通信制限になっております。もし引き続きご利用を頂きたいなら、アカンウトをアップグレードにしてください。フリーアカウントの場合は毎日100M、毎月1GBの通信制限があります。',
                /* 2 */ 'エラー：データフォーマットエラー、CoNETをリスタートしてください。',
                'ごめんなさい、ご請求したゲットウェイエリアは準備中です。そのたのエリアを選ぶか、後ほど接続をしてください。',
                /* 3 */ 'エラー：請求した接続方法はこのエリアに対応しておりません、他のエリアに変更するか他の接続方法へください。',
                /* 4 */ '@OPN接続をしたいなら、公衆iCloudアカウントに対応できません、ご自分のiCloudアカウントをCoNET通信アカウントにしてください。',
            ],
            connected: '接続しました。',
            promo: 'プロモーション',
            upgrade: 'アップグレードアカンウト',
            accountManager: 'アカンウト',
            userType: ['無料ユーザー', '月契約'],
            datatransferToday: '日通信量制限：',
            datatransferMonth: '月通信量制限：',
            todaysDatatransfer: '今日使える通信量',
            monthDatatransfer: '今月使える通信量',
            gatewayInfo: ['ゲットウェイIPアドレス：', 'ゲットウェイ接続ポート番号：'],
            userInfoButton: '使用ガイド',
            stopGatewayButton: 'ゲットウェイサーバを停止します',
            disconnecting: 'ゲットウェイサーバを破壊しています',
        },
        qtGateView: {
            title: 'CoNETへカスタムサーバーの作成を要請',
            QTGateConnectResultWaiting: 'CoNETへ接続請求メールを送信しました。初めてのCoNETへ接続請求ですから、接続完成したまで数分かかる場合もあるかもしれませんが、暫くお待ちをください。',
            mainImapAccount: 'CoNETへ情報交換用Emailアカンウト',
            QTGateDisconnectInfo: 'CoNETと接続はしておりません、通信専用Emailを選択してCoNETへ接続メールを送信します。',
            QTGateConnectError: [
                'CoNETへメールの送信にエラーが発生しました。通信専用Emailをチェックしてください。',
            ],
            QTGateConnectStatus: 'CoNET接続状態',
            QTGateConnectResult: [
                '未接続、クリックと接続します。',
                'CoNETへ接続中.',
                'CoNETに接続しました。',
                'CoNETへ接続にエラーが発生しました。IMAP設定を立ち直すしてください。',
                'CoNETに接続しました。',
            ],
            QTGateSign: [
                'あなたの鍵ペア状態',
                'CoNETに信頼サインがないです',
                'CoNETに信頼サインを取得したことで、CoNETのユーザーの間にファイル又はインフォーメーションなど秘密情報を交換する際、あなたの身元証明となります。本人以外のを区別することができます。あなたも持っている鍵ペアで他のCoNETユーサーに信頼サインすることで、あるCoNETユーサーを信頼関係確定することができます。',
                'CoNETに信頼サインを取得しています',
                'CoNETシステムエラー、CoNETを再起動してからもう一度してみてください。もし直れないならCoNETを一から再インストールしてください。',
                'CoNETシステムエラー',
            ],
        },
        feedBack: {
            title: 'フィードバック',
            additional: '追加情報を添付する',
            okTitle: 'CoNETへ送信',
        },
    },
    {
        spalding: {
            mainPage: {
                logo: {
                    name: 'Dr. Robert Spalding',
                    title: 'Brig Gen, USAF ret.',
                },
                rightSectionTitle: 'STEALTH WAR',
                rightSectionSubTitle1: `HOW CHINA TOOK OVER WHILE`,
                rightSectionSubTitle2: `AMERICAN'S ELITE SLEPT`,
                menu: [
                    'Home',
                    'About',
                    'Social',
                    'Watch',
                    'Listen',
                    'Translated',
                    'Read',
                    'Contact',
                ],
                herotitle: 'Author | Speaker | Entrepreneur',
            },
        },
        addUser: 'Add',
        addUserNameInputPlaceholder: 'Name',
        addUserKeyIDInputPlaceholder: 'Key ID',
        publicKeyTitleShow: 'Public key',
        privatyKeyTitleShow: 'Private key',
        copied: 'Copied',
        airplaneMode: 'Offline mode',
        privatyKeyTitle: 'This private key should not provide to any body.',
        coSearch: {
            audio: '',
            video480: 'lower',
            video720: '720p',
            video2k: '2K',
            video4k: '4K',
            video8k: '8K',
            searchInputPlaceholder: 'Search or type a URL',
            SearchText: 'Search',
            totalResults: ['About', 'results'],
            moreResults: 'More Results',
            SearchesRelated: ['Searches related to ', ''],
            label_HTML: '</>',
            imageSize: 'Image size:',
            label_picture: 'Picture',
            similarImages: 'Visually similar images',
            unSafe: ['Safe viewer', 'Unsafe viewer'],
            errorMessage: [
                'Invalid request.',
                'This image have issue of format. Select other one please.',
                'Request maximum error. Try again later.',
            ],
            coSearchConfigMenu: ['Search setup', 'Search engines'],
            coSearchConfigIcon: ['google', ''],
            coSearchEngineName: ['Google', ''],
            searchToolBarMenu: ['Website', 'News', 'Picture', 'Video'],
            timeUnit: {
                hours: 'hours ago',
                day: 'days ago',
                mins: 'minutes ago',
            },
            TimeTolocalTime: function (time) {
                return new Date(time).toLocaleDateString('en', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },
        },
        appsManager: {
            mainLoading: 'Loading node information...',
            nodeName: 'Node name: ',
            connectAddress: 'Node address: ',
            serviceList: 'Service list',
            welcomeTextSub: 'Anonymous, private, security and freedom of new Internet.',
        },
        youtube: {
            startup: {
                title: 'Welcome to Co for Youtube',
                detail: 'You may search YouTube video, channel, or playlist that matches the search parameters. And you may play the video at local.',
            },
            search: {
                placeholder: 'Search Youtube, or enter a play url',
                button_text: 'Search',
                error: ['Search error! please search again.'],
            },
        },
        perment: {
            serverTitle: 'Server',
        },
        twitter: {
            newTwitterAccount: `Please input Twitter APP information. How to create Twitter APP please click <a target="_blank" href='https://github.com/QTGate/QTGate-Desktop-Client/wiki/Create-Twitter-APP'">hear</a> to got more information.`,
            addAccount: 'Add an Twitter account',
            following: ['Following', 'Unfollow', 'Follow'],
            followers: 'Followers',
            second: 's',
            min: 'm',
            hour: 'h',
            videoSizeOver: `This video is over Twitter specifications: 140's or 300MB or (1280 x 1024).`,
            retweeted: 'Retweeted',
            month: 'm',
            day: 'd',
            close: 'Close',
            newTwitterTitle: ['Compose new Tweet', 'Compose new thread'],
            returnEdit: 'Cancel',
            replying: 'Replying to ',
            twitterBottonTitle: ['Tweet', 'Tweet all'],
            urlInfo: '<h3>Twitter client previwe version from CoNET.</h3><p>A free and no need VPN or CoGate gateway, anonymous and securety via CoNET network access your Twitter account.</p><p>You also may open this App with URL from your cellphone and other device.</p>',
            newTwitterDistroyButtonTitle: ['Discard', 'Discard'],
            accountError: 'Twitter return error: Invalid or expired token. error. Please check your account APP information and try again.',
        },
        thirdParty: {
            information: 'Welcome to Kloak.',
            comesoon: 'Come soon.',
            qtgateGateway: 'CoGate gateway service. High speed, total privacy, ultra secure and easy to use. Your gateway to a secure and open internet.',
            app: [
                'CoGate',
                'CoChat',
                'CoBox',
                'CoMail',
                'CoNews',
                'CoSearch',
                'Co for',
                'Co for',
                'CoWallet',
                'Co Custom',
            ],
            dimmer: [
                'Advanced private custom gateway service',
                'Private and secure, decentralized social media',
                'Private cloud storage and file sharing',
                'Privacy email client',
                'Discover your world every day',
                'Custom business solution for public or private APPs in CoNET',
                'Web search client',
                'Privacy Tweet client',
                'Privacy Youtube client. May download Youtube video via 3rd-party webside.',
                'CoNET Cryptocurrency wallet',
            ],
        },
        account: {
            QTGatePayRisk: 'Your payment will be processed via CoNET’s secured payment portal. If concerned about privacy, Please use the Stripe payment portal.',
            paymentSuccessTitile: 'Thank you.',
            stripePayment: 'Bank gateway payment',
            willPayNextExpir: `We'll charge your payment at renew day `,
            openAutomatically: 'Auto-renew',
            paymentProblem1: 'Payment via CoNET',
            promoButton: 'Have Promo',
            paymentProblem: 'Looks bank payment gateway was block in your area. You can payment via CoNET gateway.',
            qtgatePayment: 'Payment with CoNET System',
            paymentSuccess: 'Your plan has beed upgraded.',
            qtgateTeam: 'The CoNET Team',
            networkShareTitle: 'Bandwidth',
            CancelSuccess: function (PlanExpire, isAnnual, returnAmount) {
                return `Your subscriptions was cancelled. You may keep use CoNET service with this plan until ${new Date(PlanExpire).toLocaleDateString()}. Restrictions apply to free accounts and accounts using promotions. ${isAnnual
                    ? `Refund amount us$${returnAmount} will return to your paid card account in 5 working day.`
                    : `Automatically canceled.`} `;
            },
            currentPlanExpire: [
                'Plan expires on: ',
                'Renews at',
                'monthly reset day ',
            ],
            currentAnnualPlan: ['Monthly plan', 'Annual plan'],
            cardPaymentErrorMessage: [
                /* 0 */ 'Error: card number or have an unsupported card type.',
                /* 1 */ 'Error: expiration!',
                /* 2 */ 'Error: Card Security Code',
                /* 3 */ 'Error: Card owner postcode',
                /* 4 */ 'Error: payment failed. Please try again late.',
                /* 5 */ 'Error: Payment data format error!',
                /* 6 */ 'Error: Payment failed from bank.',
                /* 7 */ 'Error: Please try again late.',
            ],
            title: 'Manage account',
            segmentTitle: 'Account: ',
            needPay: 'The balance: ',
            cancelPlanButton: 'Cancel plan',
            currentPlan: 'Current Plan: ',
            oldPlanBalance: 'Remaining of old plan: ',
            MonthBandwidthTitle: 'Gateway Bandwidth：',
            dayBandwidthTitle: 'Day limited：',
            bandwidthBalance: 'Bandwidth remaining: ',
            upgradeTitle: 'Upgrade',
            planExpirDate: function (year, month, day) {
                return `${month}/${day} ${year}`;
            },
            accountOptionButton: 'Account option',
            planPrice: 'Plan price：',
            monthResetDay: 'Monthly reset day: ',
            monthResetDayAfter: 'th',
            cantUpgradeMonthly: 'Annual may not downgrade to monthly plan. Please cancel current plan, then select this one.',
            DowngradeTitle: 'Downgrade Option',
            cancelPlan: 'Cancel plan',
            cantCancelInformation: 'This subscription plan may not be cancelled. Free user plans, promotions, special codes and test program plans cannot be cancelled. ',
            multiOpn: 'OPN multi-gateway technology',
            MonthBandwidthTitle1: 'Bandwidth',
            serverShare: 'Gateway',
            monthlyAutoPay: function (monthCost) {
                return `<span>Billed Monthly</span><span class="usDollar" >@ us$</span><span class="amount" >${monthCost}</span>/mo<span>`;
            },
            cardNumber: 'Card number',
            paymentProcessing: 'Connecting...',
            calcelPayment: 'Cancel',
            doPayment: 'Process Payment',
            expirationYear: 'Expiration',
            postcodeTitle: 'Card owner postcode',
            payAmountTitile: 'Amount',
            cvcNumber: 'Card Security Code',
            annualPay: function (annual_monthlyCost) {
                return `<span>Billed Annually</span><span class="usDollar">@ us$</span><span class="amount" >${annual_monthlyCost}</span>/mo<span>`;
            },
            canadaCard: '*For Canadian residents, GST (5%) will be applied automatically.',
            multiRegion: [
                'multi-gateway in single region',
                'multi-gateway in multi-regions*',
                'multi-gateway in multi-regions*',
                'multi-gateway in multi-regions',
            ],
            continue: 'Next step',
            serverShareData: [
                'Shared gateway',
                'Dedicated gateway server*',
                'Dedicated 2 gateway server*',
                'Dedicated 4 gateway server',
            ],
            internetShareData: [
                'Shared High Speed Bandwidth',
                'Dedicated High Speed Bandwidth*',
                'Dedicated 2 High Speed Bandwidth*',
                'Dedicated 4 High Speed Bandwidth',
            ],
            maxmultigateway: [
                'Max: 2 multi-gateway',
                'Max: 4 multi-gateway*',
                'Max: 4 multi-gateway',
            ],
            monthlyPay: 'Monthly pricing',
            aboutCancel: '*About Subscription cancellation',
            cancelPlanMessage: '<span>You may cancel your CoNET subscription at any time from within the this app. You will continue to have access to the CoNET services through the end of your paid period until all remaining subscription time in your account is used up. Please refer to the </span><a class="ui olive tiny label">Terms of Service</a> for cancellation and refund policy. Restrictions may apply to free plans and promotional accounts.',
            serverShareData1: 'Your dedicated server will be share ratio when you connected over your dedicated count via use Multi-gateway technology.',
            cancelPlanMessage1: function (isAnnual, amount, monthlyPay, expire, passedMonth, totalMonth) {
                return `<span>Your are on ${isAnnual
                    ? `annual payment plan</span><span class="usDollar">us$</span><span class="amount">${amount / 100}</span><span>. ${passedMonth} month${totalMonth - passedMonth > 1 ? 's' : ''} are available on your account. Your refund amount will be </span><span class="usDollar">us$</span><span class="amount">${amount - passedMonth * monthlyPay > 0
                        ? (amount - passedMonth * monthlyPay) / 100
                        : 0}</span>.`
                    : `monthly, it will not be renew at </span><span class="amount">${nextExpirDate(expire).toLocaleDateString()}</span><span> if you cancel this plan.</span>`}`;
            },
        },
        QTGateDonate: {
            title: 'Free access website provided by sponsor.',
            meta_title: 'Donor：',
            detail: `CoNET users may access these sponsored websites via CoNET OPN. Free users may not be able to access if your daily limit has been reached.`,
        },
        QTGateInfo: {
            title: 'Features',
            version: 'Installed veriosn：v',
            detail: [
                {
                    color: '#a333c8',
                    icon: 'exchange',
                    header: 'OPN: Security and Privacy while accessing the Open Internet.',
                    detail: `@OPN@ uses CoNET’s “Quiet” technology to create a obfuscated private network by refracting encrypted data packets thru email servers. @OPN provides true stealth internet communications where your IP address is hidden to client or proxy servers. iOPN uses CoNET’s technology to obfuscate data traffic over HTTP. Both @OPN and iOPN offer security, protection and privacy while allowing access to the open internet. All data is kept private with encryption using <a onclick="return linkClick('https://en.wikipedia.org/wiki/Advanced_Encryption_Standard')" href="#" target="_blank">AES256-GCM</a> and <a onclick="return linkClick ('https://en.wikipedia.org/wiki/Pretty_Good_Privacy')" href="#" target="_blank">OpenPGP</a> along with CoNET’s proprietary security measures.`,
                },
                {
                    color: '#e03997',
                    icon: 'talk outline',
                    header: 'QTChat: Private and secure, peer to peer Instant messaging with no IP address.',
                    detail: 'CoNET users can communicate with others via a private and secure instant messaging service. Using the @OPN stealth technology and end-to-end encryption, users are secure and messages kept private with no IP address footprint. Supports group chat with multiple users and can be used for privately transferring, pictures, files and live video streaming. Using end-to-end encryption ensures only the user and the people the user is communicating with can read what is sent, and nobody in between, not even CoNET. This is because messages are secured with an encrypted lock, and only the recipient and original message sender will have the special key needed to unlock and read them.',
                },
                {
                    color: '#6435c9',
                    icon: 'cloud upload',
                    header: 'QTStroage: The secure and Private cloud storage and file sharing.',
                    detail: 'Users can store and share files by using CoNET @OPN to split files into multiple parts, each encrypted to different email accounts. CoNET user can share the file privately between other users on CoNET’s OPN.',
                },
                {
                    color: 'darkcyan',
                    icon: 'spy',
                    header: 'Spam and Spyware detection and blocking.',
                    detail: 'CoNET uses the global DNSBL database to stop spam and spyware. CoNET users will be automatically filtered from spam and spyware to stop them from transmitting your information.',
                },
                {
                    color: '#6435c9',
                    icon: 'external share',
                    header: 'Personal VPN connection.',
                    detail: 'Access your CoNET OPN services anywhere via personal VPN connection from anywhere.',
                },
            ],
        },
        firefoxUseInfo: {
            title1: 'Firefox browser can use separate proxy settings from the system settings. This allows for easy use of a proxy to access the internet without editing the system settings.',
            info: [
                {
                    title: 'CClick Firefox tool icon. Select Preferences or Options.',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '<p><a href="https://www.mozilla.org/en-US/firefox/#" target="_blank">Download Firefox.</a></p>',
                    image: '/images/firefox1.jpg',
                },
                {
                    title: 'In the General tab, scroll to the bottom, click on Settings under Network Proxy.',
                    titleImage: '',
                    detail: '',
                    image: '/images/firefox2.jpg',
                },
                {
                    title: 'Select Automatic proxy configuration URL and insert the URL as shown in blue below (select URL for HTTP/S or SOCKS). Make sure to Check on “Proxy DNS when using SOCKS v5”. Click OK to finish setup.',
                    titleImage: '',
                    detail: 'Chose either HTTP or Socket settings.',
                    image: '/images/firefox3.jpg',
                },
            ],
        },
        cover: {
            firstTitle1: 'Kloak OS',
            firstTitle2: 'AN INTERNET BUILT ON TRUST, PRIVACY & SECURITY',
            firstTitle3: 'A Revolutionary Online Experience: No IP Address--Absolute Security',
            start: 'ENTER NOW',
            proxyStoped: 'Gateway server shutdown. Please rebuild try again.',
        },
        useInfoiOS: {
            title1: 'iOS device local proxy setup.',
            info: [
                {
                    title: 'Open the control panel and select the WiFi settings.',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '',
                    image: '/images/iOS1.jpg',
                },
                {
                    title: 'Select the icon on the right side of the connected Wifi name.',
                    titleImage: '',
                    detail: '',
                    image: '/images/iOS2.jpg',
                },
                {
                    title: 'Turn On Configure Proxy',
                    titleImage: '',
                    detail: '',
                    image: '/images/iOS3.jpg',
                },
                {
                    title: 'Select Automatic.',
                    titleImage: '',
                    detail: '<p>Check Automatic proxy and insert the URL as shown in blue below (select URL for HTTP/S or SOCKS). Save to finish setup.</p>',
                    image: '/images/iOS4.jpg',
                },
            ],
        },
        useInfoAndroid: {
            title1: 'Android device local proxy setup.',
            info: [
                {
                    title: `Open your device’s Settings. Under Networks, Select Wi-Fi.`,
                    titleImage: '/images/androidSetup.jpg',
                    detail: '',
                    image: '/images/android1.jpg',
                },
                {
                    title: 'Tap and hold the connected Wi-Fi network name until a pop up menu appears. Then tap Modify network or Manage network settings.',
                    titleImage: '',
                    detail: '',
                    image: '/images/android2.jpg',
                },
                {
                    title: 'Tap to show Advanced options. Under Proxy, select Proxy Auto-Config.',
                    titleImage: '',
                    detail: 'Insert the PAC URL as shown in blue below (select URL for HTTP/S or SOCKS) and Save to finish setup',
                    image: '/images/android3.jpg',
                },
            ],
        },
        useInfoWindows: {
            title1: 'Windows 10 proxy setup',
            info: [
                {
                    title: 'For all other Windows versions.',
                    titleImage: '',
                    detail: '<p>For other Windows versions’ proxy setup info, please visit <a href="#" target="_blank" onclick="return linkClick (`https://support.microsoft.com/en-us/help/135982/how-to-configure-internet-explorer-to-use-a-proxy-server`)">Microsoft website.</a></p><p>This is the data for proxy server setup:</p>',
                    image: '',
                },
                {
                    title: 'Open Microsoft Edge',
                    titleImage: '/images/IE10_icon.png',
                    detail: 'Click the tool icon at the top of right, Scroll down menu to the bottom and select Settings.</p>',
                    image: '/images/windowsUseInfo1.jpg',
                },
                {
                    title: 'Scroll to bottom of menu and click View advanced settings.',
                    titleImage: '',
                    detail: '',
                    image: '/images/windowsUseInfo2.jpg',
                },
                {
                    title: 'Scroll down menu and click Open proxy settings.',
                    titleImage: '',
                    detail: '',
                    image: '/images/windowsUseInfo3.jpg',
                },
                {
                    title: 'Select Proxy, turn On Automatically detect settings and Use setup script. Insert the Script address as shown in blue below. Then click save to finish.',
                    titleImage: '',
                    detail: '<p>Windows 10 system only supports HTTP & HTTPS proxy, SOCKS5 users will need install a browser like Firefox, then setup the SOCKS5 PROXY in Firefox.',
                    image: '/images/windowsUseInfo4.jpg',
                },
            ],
        },
        useInfoMacOS: {
            proxyServerIp: '<p>Proxy setup: <span style="color: brown;">Automatic or Auto-Config</span></p>',
            proxyServerPort: 'HTTP & HTTPS proxy setup:',
            webRTCinfo: 'Stop WebRTC leak: Please use SOCKS proxy setup. Click <a href="/Wrt" target="_blank">here</a> to check WebRTC leak.',
            wrtTest: 'Test result: ',
            customProxy: 'Custom gateway server ready',
            proxySetupHelp: 'Need help? Please click the icon which is your OS.',
            wrtTestAreaTitle: 'WebRTC leak area',
            proxyServerPassword: 'SOCKS proxy setup:',
            localIpAddress: 'This is intronet IP address, No leak.',
            globalIpAddress: 'This is your real IP address, If show this it is WebRTC leak.',
            title: 'Local proxy server is running at background. All other devices can access internet via local proxy setup to use the CoNET OPN.',
            title1: 'MacOS proxy setup',
            info: [
                {
                    title: 'Open the control panel, click on network.',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '',
                    image: '/images/userInfoMacos1.jpg',
                },
                {
                    title: 'click on Advanced... ',
                    titleImage: '',
                    detail: '',
                    image: '/images/macosUserInfo2.jpg',
                },
                {
                    title: 'Select Proxies, check Automatic Proxy Configuration, check Exclude simple hostnames.',
                    titleImage: '',
                    detail: '<p>Insert Proxy URL shown in blue in the image below (select URL for HTTP/S or SOCKS). Click OK to finish.</p>',
                    image: '/images/macosUserInfo3.jpg',
                },
            ],
        },
        topWindow: {
            title: '150th anniversary of Canada',
        },
        firstNote: {
            title: 'Thank you for using our products and services (the “Services” or “Service”). The Services are provided by CoNET Technology Inc. (“CoNET”).',
            firstPart: 'By using our Services, you are agreeing to these terms. Please read them carefully.',
            detail: [
                {
                    header: 'Terms of Service',
                    detail: 'This Terms of Service document (the “Terms”) outlines the terms and conditions of use of Services provided by CoNET Technology Inc. These Terms also govern the use of and access to CoNET’s content (the “Content”), which includes the CoNET’s website (the “Site”), applications (the “Apps”), and any tools, software provided by CoNET (the “Software”).',
                },
                {
                    header: null,
                    detail: 'Before using CoNET’s Services, please read this agreement thoroughly. If You have any questions concerning the content of this agreement or what it implies, please contact CoNET at email address: support@CoNETTech.ca',
                },
                {
                    header: null,
                    detail: 'We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct. Using our Services does not give you ownership of any intellectual property rights in our Services or the content you access. You may not use content from our Services unless you obtain permission from its owner or are otherwise permitted by law. These terms do not grant you the right to use any branding or logos used in our Services. Don’t remove, obscure, or alter any legal notices displayed in or along with our Services.',
                },
                {
                    header: 'Eligibility for Service',
                    detail: 'By accessing the Content or Services, you are agreeing on behalf of yourself or those you represent (“You”) to comply with and be legally bound by these Terms in their entirety. These Terms constitute a legally binding agreement (the “Agreement”) between you and CoNET. If you do not agree with any part of the Terms, you may not use our Services.',
                },
                {
                    header: null,
                    detail: 'By creating an account for using our Services, you represent that you are at least eighteen (18) years of age or that you are a valid legal entity, and that the registration information you have provided is accurate and complete. If You are accepting the terms of this agreement on behalf of a company or other legal entity, You represent and warrant that You have the authority to bind that company or other legal entity to the terms of this agreement. If You are accepting this agreement on behalf of an enterprise’s end user, it is Your responsibility to communicate the information in this agreement to the enterprise end users and ensure compliance with the terms and conditions contained herein. By agreeing to these Terms, you are also agreeing to the End User License Agreement (“EULA”), which you can read on CoNET’s website.',
                },
                {
                    header: 'Privacy Policy',
                    detail: 'Your privacy is highly important to us, since privacy is every person’s natural right! CoNET is committed to your privacy and does not collect or log browsing history, traffic destination, data content, or DNS queries from Subscribers using our Services. – hence, we DO NOT store details of, or monitor the websites you access while using our Services.',
                },
                {
                    header: null,
                    detail: 'During your registration, we will ask you for some personal information such as your email address and/or payment information. We only collect information that are necessary for the proper delivery of the Site and Services. This information is for our eyes only and will be stored on secured servers. The little bit of information we collect is the minimal usage statistics to maintain our quality of service. We may know: choice of server location, times when our Services was used by user and amount of data transferred by one user in one day. We store this information in order learn from it, and eventually deliver the best possible experience to you. This information which is gathered and analyzed generically is also kept on secured servers. We stand by our firm commitment to our customers’ privacy by not possessing any data related to a user’s online activities.',
                },
                {
                    header: null,
                    detail: 'We reserve the right to modify the Privacy Policy at any time, so please review it frequently. Your continued use of the our Services will signify your acceptance of the changes to the Privacy Policy. If you have any questions regarding our Privacy Policy and how we handle your information, please feel free to contact CoNET at the following email address: support@CoNETTech.ca',
                },
                {
                    header: 'Subscriptions',
                    detail: 'CoNET Services are available to you upon registration on the Site or Software. By subscribing to the Services, you agree to become a subscriber (“Subscriber”) for the period you have elected. A full list of subscription plans and pricing is available on the Site. CoNET reserves the right to amend subscription fees or institute new fees at any time upon reasonable advance notice posted on the Site or sent via email. Any changes to the pricing will not affect the Subscriber’s current subscription period and will become effective upon subscription renewal.',
                },
                {
                    header: null,
                    detail: 'When supported by your payment method, plans renew automatically by default at the completion of the billing term. By default, the renewal term is for the same duration as the billing term for the original subscription. The subscription fee will be charged automatically to the payment method you last selected. If you would like to discontinue automatic renewal, you may turn off auto-renewal. By default, auto-renewal is turned on when you use a payment method that supports auto-renewal (such as a credit card or Paypal), and turned off when you use a payment method that does not support auto-renewal (such as bitcoin).',
                },
                {
                    header: null,
                    detail: 'Your Subscription is Yours and Yours only. You may not lend it, rent it, hire it out or share it with people or any other legal entity such as a company, partnership etc, who are not You yourself. Each paid subscription grants you one (1) license to use.',
                },
                {
                    header: 'Subscription Cancellation and Suspension',
                    detail: 'We want you to be fully satisfied with our services. However, we will troubleshoot an issue you experience first. There are several nuances to an OPN service configuration and we solve 99% of issues encountered. ',
                },
                {
                    header: null,
                    detail: 'You may cancel your CoNET subscription at any time, and you will continue to have access to the CoNET services through the end of your paid period until all remaining subscription time in your account is used up. Subscription plan monthly billing cycle starts on the 1st day of each month. Subscription period will end on the last day of the month cancellation was requested. Restrictions apply to free accounts and accounts using promotions.',
                },
                {
                    header: null,
                    detail: 'You can cancel your Subscription within the client app. Refunds are subject to the CoNET’s Refund Policy. Please let us know, via email to support@CoNETTech.ca, any reasons to your decision in stopping use of our Service so we can be better for the future. Thank you.',
                },
                {
                    header: null,
                    detail: 'CoNET is entitled to impose Service limits, revoke any Service, suspend it, or block any type of usage made by You at its sole discretion if it is reasonable to believe that the You violate or have violated the Terms of Service or if the way You use the Services may render CoNET liable to any offence or breach of any third party rights or disturb other users use of the Service. CoNET does not undertake to provide You with any prior notice of these measures. The application of any of these measures will not entitle You to a refund.',
                },
                {
                    header: 'Refund Policy',
                    detail: 'Cancellations to annual subscription may be entitled to a pro-rated refund of your current annual subscription payment amount minus the months of service used calculated at the standard monthly rate. (For example, accounts canceling within 3 months of an annual plan will be entitled to a refund of the amount paid subtracted by the 3 months of service used at the standard monthly rate.)',
                },
                {
                    header: null,
                    detail: `<p>We refund annual subscription purchase only. We will refund your order if:</p><div class="ui ordered list"><div class="item">It is the first time you've ordered our Services and there have not been previous purchases on your account.</div><div class="item">If you have made less than one hundred connections to our Service and your bandwidth usage is less than 500 MB.</div><div class="item">If you haven't violated CoNET’s Terms of Service in any way.</div></div>`,
                },
                {
                    header: null,
                    detail: `It is the first time you've ordered our Services and there have not been previous purchases on your account.`,
                },
                {
                    header: null,
                    detail: ``,
                },
                {
                    header: null,
                    detail: 'We will refund your order if: <p class="tag info">It is the first time you’ve ordered our Services and there have not been previous purchases on your account.</p><p class="tag info">If you have made less than one hundred connections to our Service and your bandwidth usage is less than 500 MB.</p><p class="tag info">If you haven’t violated CoNET’s Terms of Service in any way.</p><p class="tag info">As stated above, if the refund request is made within 7 days since the purchase has been made.</p><p class="tag info">Refunds are generally processed within seven (7) days, and are made to the original form of payment used for purchase. All refunds are sent in USD and therefore the refund amount could differ from the amount originally paid in local currency or bitcoin. How long it takes until you will see the refunded amount in your bank account varies according to the payment method you used, bank regulations, etc.</p>',
                },
                {
                    header: 'Acceptable Use Policy',
                    detail: 'You must follow any policies made available to you within the Services. You shall use CoNET Services in compliance with all applicable laws and not for any unlawful Purpose. CoNET Services may be accessed from all around the world, so it is your responsibility to assess whether using the Apps, Services, Sites or Software is in compliance with local laws and regulations. You may only use the Services as permitted by law. Services may NOT be used for any illegal activity. Whenever you use the Apps, Services, Sites or Software, you should comply with these Terms and applicable laws, regulations, and policies. You agree to not to use the Service in a way that may result in a violation of any laws of any jurisdiction. Don’t misuse our Services. For example, don’t interfere with our Services or try to access them using a method other than the interface and the instructions that we provide. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.',
                },
                {
                    header: null,
                    detail: 'You understand that it is your responsibility to keep your CoNET account information confidential. You are responsible for all activity under your account. You agree to not make any illegal or unauthorized use of the Services through Your user id/password and not to enable access to your account to users who are not You. If you ever discover or suspect that someone has accessed your account without your authorization, you are advised to inform us immediately so that we may revoke your account credentials and issue new ones. You will be held accountable and liable for any and all actions performed on the CoNET’s servers where the login is identified by Your user id/password. In order to protect the Services from being misused or used to harm someone, CoNET reserves the right to take appropriate measures when our Services are being used contrary to these Terms and applicable laws. You agree that CoNET may terminate your account, without providing a refund for Services already paid, if you misuse the Service.',
                },
                {
                    header: null,
                    detail: 'In using our Services, you agree not to: <p class="tag info">Send spam, uninvited emails or  transmit unsolicited advertisements or content (i.e., “spam”), or any other versions of spam, large quantities of emails even if such are sent-off from another server and sending opt-in emails.</p><p class="tag info">Send, post, or transmit over the Service any content which is illegal, hateful, threatening, insulting, or defamatory; infringes on intellectual property rights; invades privacy; or incites violence.</p><p class="tag info">Upload, download, post, reproduce, or distribute any content that includes sexual or explicit depictions of minors.</p><p class="tag info">Attempt to access, probe, or connect to computing devices without proper authorization (i.e., port scanning, scanning for open proxies, or any form of “hacking”).</p><p class="tag info">Attempt to compile, utilize, or distribute a list of IP addresses operated by CoNET in conjunction with the Service.</p><p class="tag info">Use for distribution of viruses, hacking, cracking, network sabotage, phishing; any fraudulent behavior is strictly prohibited.</p><p class="tag info">Use the Service for anything other than lawful purposes.You shall be held responsible for any damages caused by Your negligence or exposure to vulnerabilities, whether your actions were intentional or not.</p>',
                },
                {
                    header: 'License',
                    detail: 'Subject to your compliance with these Terms, CoNET grants to you a worldwide, non-assignable, non-exclusive and limited license to use the software provided to you by CoNET as part of the Services. This license is for the sole purpose of enabling you to use and enjoy the benefit of the Services as provided by CoNET, in the manner permitted by these terms. You may not copy, modify, distribute, sell, or lease any part of our Services or included Software, nor may you reverse engineer or attempt to extract the source code of that Software, unless laws prohibit those restrictions or you have our written permission. Using the Software and our Services in any way not expressly authorized by CoNET is strictly prohibited.',
                },
                {
                    header: null,
                    detail: 'Usage of any material which is subject to CoNET’s intellectual property rights is prohibited unless you have been provided with explicit written consent by CoNET. Using our Services does not give you ownership of any intellectual property rights in our Services or the content you access. These terms do not grant you the right to use any branding or logos used in our Services. Don’t remove, obscure, or alter any legal notices displayed in or along with our Services.',
                },
                {
                    header: 'Disclaimers and Warranties',
                    detail: 'CoNET undertakes to provide the best Service possible in the circumstances and make the Service available at all times except for when maintenance work is being performed for repair and improvement or in case of circumstances beyond the control of the CoNET, including force majeure. The Service provided may also become unavailable due to other factors beyond the CoNET’s control such as third party service failure or malfunction. The accuracy and timeliness of data received is not guaranteed and may vary based on compressions, configuration, network congestion and other factors that may affect it. The Service’s network speed is an estimate and is no indication or guarantee to the speed which You or the Service will send or receive data. We provide our Services using a commercially reasonable level of skill and care and we hope that you will enjoy using them. But there are certain things that we don’t promise about our Services. CoNET does not monitor Your sessions for inappropriate use nor does it keep logs of Your internet activities. However, the CoNET reserves the right to monitor and investigate matters which it considers at its own discretion to be a violation or potential violations of these Terms of Use.',
                },
                {
                    header: null,
                    detail: 'Other than as expressly set out in these terms or additional terms, neither CoNET nor its suppliers or distributors make any specific promises about the Services. The Service, the Software and any third party services and software are provided by the CoNET on an “as is” basis and CoNET hereby disclaims all warranties of any kind, whether expressed or implied. Some jurisdictions provide for certain warranties, like the implied warranty of merchantability, fitness for a particular purpose and non-infringement. To the extent permitted by law, we exclude all warranties.',
                },
                {
                    header: null,
                    detail: 'CoNET also reserves the right, but is not obligated to, at its sole discretion and without providing prior notice, to block, delete, filter or restrict by any means, any materials or data it deems potential or actual violations of the restrictions set forth in these Terms of Use and also any other actions that may subject the CoNET or its customers to any liability. CoNET disclaims any and all liability for any failure on our part to prevent such materials or information from being transmitted over the Service and/or into Your computing device.',
                },
                {
                    header: 'Limitation of Liability',
                    detail: 'CoNET will not be liable for any damages or loss caused by viruses, denial-of-service, attacks or any other technologically harmful material that my infect Your computer, its peripherals, data stored on it or on its peripherals, computer programs or any other proprietary material due to the use of the Services or due to Your downloading of anything which is posted on the CoNET’s website or any website which is linked there to. In no event will CoNET, its suppliers, distributors,  partners, affiliates, subsidiaries, members, officers, or employees be liable for lost profits, revenues, or data, financial losses or indirect, special, consequential, exemplary, or punitive damages, or for any other loss or damages of any kind, even if they have been advised of the possibility thereof. The foregoing shall not apply to the extent prohibited by applicable law. To the extent permitted by law, the total liability of CoNET, and its suppliers and distributors, for any claims under these terms, including for any implied warranties, is limited to the amount You paid CoNET to use the Services.',
                },
                {
                    header: 'Indemnification',
                    detail: 'You agree to hold harmless and indemnify CoNET, its officers, directors, agents, employees,  members, partners, suppliers, their affiliates, and its or their shareholders, directors, and employees from any and all claims, suit or action arising from or related to the use of CoNET’s Services, Apps, Content, Site, or Software or violation of these terms, including any liability or expense arising from claims, losses, damages, suits, judgments, litigation costs and attorney’s’ fees. We may, at our sole discretion, assume the exclusive defense and control of any matter subject to indemnification by you. The assumption of such defense or control by us, however, shall not excuse any of your indemnity obligations. If you are using our Services on behalf of a business, that business accepts these terms.',
                },
                {
                    header: 'About these Terms',
                    detail: 'CoNET may update the Terms or any additional terms that apply to a Service, from time to time without notice. You understand and agree that it is your obligation to review these Terms regularly in order to stay informed on current rules and obligations. If you continue to use CoNET’s Services, Apps, Content, Site, or Software after these changes take effect, then you agree to the revised Terms. The current version of the Terms is available on the Site. Notification on any core changes to the Terms will be provided to subscribers through an email message or update to the Site. If you do not agree to the modified terms for a Service, you should discontinue your use of that Service. If there is a conflict between these terms and the additional terms, the additional terms will control for that conflict. These terms control the relationship between CoNET and you. They do not create any third party beneficiary rights.',
                },
                {
                    header: null,
                    detail: 'If you do not comply with these terms, and we don’t take action right away, this doesn’t mean that we are giving up any rights that we may have (such as taking action in the future). If it turns out that a particular term is not enforceable, this will not affect any other terms. All of our Content was originally written in English. Any translation of our Content is done on a best-effort basis. We cannot guarantee the accuracy of translated Content. In the event of any discrepancy between the translated Content and the English Content, the English Content shall prevail. The laws of British Columbia, Canada, excluding British Columbia’s conflict of laws rules, will apply to any disputes arising out of or relating to these Terms or the Services.',
                },
            ],
            disagree: 'I Disagree',
            agreeMent: 'I Agree to the CoNET Terms of Service',
        },
        linuxUpdate: {
            newVersionDownload: 'click here to download and install!',
            step1: 'Update new CoNET: ',
            step2: 'Allow executing file as program',
            step2J1: '/images/linuxUpdate1.jpg',
            step2J2: '/images/linuxUpdate2.jpeg',
            step2_detail1: 'Right click downloaded CoNET file and select the properties.',
            step2_detail2: 'Check allow executing file as program in Permissions tab.',
            step3: 'Exit old version of CoNET and double click the new CoNET file to run install.',
            exit: 'Exit CoNET',
            tryAgain: 'Try again',
            refresh: 'Refresh page.',
        },
        imapInformation: {
            title: 'IMAP account settings.',
            tempImapAccount: `Have problem with your IMAP enabled email account? <a href="#" style = "margin-left: 0.5em;" class="ui label teal" onclick="return linkClick ('https://github.com/QTGate/QTGate-Desktop-Client/wiki/IMAP-temporary-account')"> Get temporary account.</a>`,
            infomation: `Setup Email account which is for CoNet network communication, or `,
            coNetTempAccount: 'use the temporary mailbox provided by CoNet.',
            serverDetail: 'settings:',
            imapServer: 'IMAP server setup',
            imapServerInput: 'IMAP server name or IP address',
            UserName: 'Login username',
            Ssl: 'By SSL connection:',
            portName: 'Port number:',
            otherPortNumber: 'Other:',
            smtpServer: 'SMTP server setup',
            smtpServerInput: 'SMTP server name or IP address',
            emailServerPassword: 'Email account password ( app password )',
            Error_portNumber: 'Port number should be from 1 to 65535 and not be 22.',
            imapAccountConform: function (imap, account) {
                return `<p class="ui small header brown">By clicking submit you are agreeing to:</p><p class="grey">This [<B class="red">${imap}</B>] email is a temporary account for use with CoNET services. CoNET may have full access to this account in use of CoNET’s services.</p><p>Kloak platform will send a email include: [<B class="red">${imap}</B>] & APP password, email [<B class="red">${account}</B>] address, public key, timezone, used language.</p><p>You may receive emails from CoNET.</p>`;
            },
            agree: `I understand and agree to continue.`,
            imapOtherCheckError: 'Cannot connect to email server! Server name, IP address or Port number may have a mistake. Please check the details of your email setup!',
            CertificateError: 'Certificate for this email server is not trusted. Please select "Keep connected even if certificate is not trusted" in settings if you still want to connect. Your email login information maybe leaked to this email server!',
            IgnoreCertificate: 'Keep connected even when certificate is not trusted',
            Certificat: 'Warning! Do not select this if you are not sure, it may reveal your information.',
            AuthenticationFailed: 'Invalid login username or password! Please check username and password.',
            addAEmail: 'Add a new Email account',
            tryAgain: 'Try again.',
            connectImap: 'Connect to CoNET',
            cancelConnect: 'Stop connecting to CoNET.',
            imapItemTitle: 'Email account details:',
            loaderText: [
                'C',
                'o',
                'n',
                'n',
                'e',
                'c',
                't',
                ' ',
                't',
                'o',
                ' ',
                'C',
                'o',
                'N',
                'E',
                'T',
                ' ',
                'n',
                'e',
                't',
                'w',
                'o',
                'r',
                'k',
                '...',
            ],
            imapCheckingStep: [
                /* 0 */ 'Trying to connect to email server.',
                /* 1 */ 'Connected to email server with IMAP. Waiting response from CoNET.',
                /* 2 */ 'Connected to email server with SMTP.',
                /* 3 */ 'Please wait a moment, connecting to CoNET network.',
                /* 4 */ 'Connected to CoNET',
                /* 5 */ 'Connected to email server with IMAP',
            ],
            imapResultTitle: 'IMAP Server CoNET Communication Rating: ',
            testSuccess: 'Email server setup success!',
            exitEdit: 'Exit edit email account',
            deleteImap: 'Delete IMAP account.',
            proxyPortError: 'Port number should be a number from 3001 to 65535. Or this port is being used by another process. Please try another port number.',
            appPassword: 'About APP password.',
            imapCheckError: [
                /* 0 */ 'Cannot connect to email server! Your network may offline or do not support IMAP protocol. Please check your network and try again after reflash page.',
                /* 1 */ 'Invalid login username or password! Please check username and password.',
                /* 2 */ `Certificate for this email server is not trusted. You may have Man-in-the-middle attack in your network. This error is happening maybe your anti-virus software's firewall is blocking imap and smtp connections to the mail exchange server. Please add mail server to the encrypted connection scanning exclusion's list if you are using Kaspersky or similar for other anti-virus software. This should resolve this issue`,
                /* 3 */ 'Sent mail error. It may happened when you use normail password. Check your mail APP password.',
                /* 4 */ 'Your network have not internet.',
                /* 5 */ 'Unknow error. Please exit CoNET and try it again.',
                /* 6 */ 'Over Quota error. Please access your mail account, delete some mail.',
            ],
        },
        Home_keyPairInfo_view: {
            title: 'Key pair information',
            deleteKeyPairHaveLogin: 'Please delete the key pair use the client that is logging on.',
            emailNotVerifi: 'Key pair has not been signed by CoNET yet.',
            emailVerified: 'Key pair signed by CoNET.',
            NickName: 'Nick name：',
            creatDate: 'Creation date：',
            keyLength: 'Bit Length：',
            password: 'Setup Private Key protected password.',
            password1: 'Password',
            logout: 'Logout',
            keyID: 'ID：',
            deleteKeyPairInfo: 'Note: By deleting your key pair, you will lose your current account settings include privacy files in CoNet.',
            delete: 'Delete',
            locked: 'Enter your key pair password to continue.',
            systemError: 'System error! Please delete this key pair and set up CoNET again.',
        },
        home_index_view: {
            newVersion: 'A new version is ready to install.',
            newVersionInstallLoading: 'Updateing...',
            localIpAddress: 'Local',
            internetLable: 'Internet',
            gateWayName: 'Gateway',
            showing: 'Status',
            nextPage: 'next',
            agree: 'I AGREE & CONTINUE',
            emailAddress: 'Email Address',
            imapEmailAddress: 'Email Account Name',
            creatKeyPair: 'Generate key pair...',
            cancel: 'Cancel',
            clickInstall: 'Install',
            keyPairCancel: 'Generate key pair was canceled.',
            keyPairGenerateError: 'It was system error when generate key pair. Try again please.',
            keyPairGenerateSuccess: 'Generate key pair was success.',
            continueCreateKeyPair: 'Keep generate.',
            stopCreateKeyPair: 'Cancel generate key pair',
            KeypairLength: 'Select the bit length of your key pair. Larger bit lengths are stronger and harder for a hacker to crack but may result in slower network transfer speeds.',
            SystemAdministratorNickName: 'Nick name',
            systemAdministratorEmail: 'Generate RSA Key pair',
            GenerateKeypair: '<em>Generating RSA Key pair. Please wait, as it may take a few minutes. More time will be needed if you selected 4096 bit key length. Information about RSA keypair system can be found here:' +
                `<a href='hhttp://en.wikipedia.org/wiki/RSA_(cryptosystem)' target="_blank" onclick="return linkClick ('https://en.wikipedia.org/wiki/RSA_(cryptosystem)')">https://en.wikipedia.org/wiki/RSA_(cryptosystem)</a></em>`,
            systemPassword: 'CoNET Client System Password',
            inputEmail: `Generation key pair (curve25519) for secure communications`,
            accountEmailInfo: `Because CoNET may be on a firewall's black list in some regions. It is best to choose an email account with servers outside your region’s firewall.`,
            dividertext: 'Optional',
        },
        error_message: {
            title: 'Error',
            errorNotifyTitle: 'System Error',
            EmailAddress: [
                'Please enter your email address in this format name@example.com.',
                'Sorry, CoNET currently support Apple iCloud mail, Microsoft Outlook and Yahoo mail only.',
            ],
            required: 'Please fill in this field.',
            PasswordLengthError: 'Passwords must have at least 5 characters.',
            localServerError: 'Local CoNET server error. restart please!',
            finishedKeyPair: 'Generate new key pair down.',
            Success: 'Success',
            doCancel: 'Canceled generating key pair!',
            errorKeyPair: 'here was an ERROR in generating new key pair, Please try again!',
            SystemPasswordError: 'Your key pair password does not match. Please try again. If you forgot your password, please delete this key pair. Beware you will lose you current account settings.',
            finishedDeleteKeyPair: 'Key pair deleted!',
            offlineError: 'There is no internet connection detected. Please check your network and try again!',
            imapErrorMessage: [
                /* 0 */ 'There was an error in establishing connection to CoNET. Please try to connect again or try at a later time. If you continue to receive this error, please contact CoNET support. ',
                /* 1 */ 'Data format error!',
                /* 2 */ 'This computer does not detect an internet connection. Please check your network and try again!',
                /* 3 */ `Email server did respond to username or an error in password. You may need use APP password to pass this test if you did normal password. Or your app passwords need to be updated.`,
                /* 4 */ `Error in connecting to email server with the current IMAP port. Please check the email account to make sure IMAP is enabled and the IMAP port settings. The port may be filtered by a firewall on your network.`,
                /* 5 */ `There is a problem with this IMAP email server's security certificate!`,
                /* 6 */ `Error in email server’s address. Please check the email server’s domain. Or have not internet, please check your network.`,
                /* 7 */ 'This email provider currently looks does not support CoNET’s @OPN technology, please try do test again, or change to another email provider.',
                /* 8 */ `Email server did respond to SMTP's username or an error in password.`,
                /* 9 */ `There is a problem with this SMTP email server’s security certificate!`,
                /* 10 */ `Connecting to SMTP Email server received an unknown error!`,
                /* 11 */ 'Please check email account!',
                /* 12 */ 'Does not establishing connection to CoNET yet.',
                /* 13 */ 'Your mail account has exceeded (over quota). ',
                /* 14 */ 'Twitter return unknow error, please try again.',
            ],
            CoNET_requestError: [
                /* 0 */ 'Did not received response from CoNET. Try reconnect to CoNET, please wait.',
                /* 1 */ 'Invalid request!',
            ],
        },
        emailConform: {
            activeViewTitle: 'Active your keypair.',
            emailTitle: 'Welcome to Kloak.',
            info1_1: `Please complete key pair verification. Click the button 'Request verification email' to request mail. Please check your [`,
            info1_2: '] mailbox. If you received more then one email from CoNET, please choose the newest email. If you not find the email, please double check your key pair email address. If you have an error, you may delete your key pair and generate a new key pair.',
            info2: 'Copy all content from [-----BEGIN PGP MESSAGE-----] ... to [-----END PGP MESSAGE-----]. Paste into this text box.',
            emailDetail1: 'Dear ',
            emailDetail1_1: ' ,',
            emailDetail2: 'This is your secret verification code to validate your CoNET account. Please copy and paste all the content in the text area.',
            bottom1_1: 'Best regards,',
            bottom1_2: 'The CoNET team',
            requestReturn: [
                'ERROR! CoNET system refuse your request, may be you did request repeatedly, please try again late.',
                'Verification mail has been sent.',
            ],
            conformButtom: 'Confirm',
            reSendRequest: 'Request verification email',
            formatError: [
                'Format error! Copy all content from [-----BEGIN PGP MESSAGE-----] ... to [-----END PGP MESSAGE-----]. Paste into this text box.',
                'Decrypt message failed. Find the lasest mail from CoNET in your key pair email mailbox. Or delete this key pair and rebuild new key pair please.',
                'Connection to CoNET had an error!. Please exit and restart CoNET.',
                'This secret verification code was invalid. If you received more then one email from CoNET, please choose the newest email. Do validate again!',
                'Your CoNET account may have a problem, Please delete your key pair and setup again!',
                /**5**/ 'Sorry there is an error in connection to CoNET, may be CoNET is offline. Please try again late.',
                `Your data transfer has hit the daily limit today, please try again tomorrow or upgrade your user type.`,
                'Your transfer email account may not be working, please check the IMAP account. Or your IMAP accout may not support CoNET system.',
                'Selected region is unavailable, try again later.',
                'Your IMAP account recieved an error. Please restart CoNET and try again. If the error is not fixed, You may need check your IMAP account setting to enable third party IMAP applications.',
                'The page session has expired! Refresh page or restart CoNET plesee.',
                'Sorry looks Kloak platform failure, please restart CoNET.',
            ],
            activeing: 'sending...',
        },
        QTGateRegion: {
            title: 'Advanced private custom gateway service area.',
            available: 'Available',
            CoGateRegionStoped: 'Custom gateway server was stopped.',
            speedTest: 'Speed test：',
            unavailable: 'Unavailable',
            proxyDomain: 'Domain lookup via CoNET gateway side.',
            setupCardTitle: 'connecting with:',
            paidUse: 'This area offer for subscription user.',
            MultipleGateway: 'Multi-Gateway:',
            dataViaGateway: 'All internet data transfered via CoNET gateway.',
            dataTransfer: 'Data:',
            dataTransfer_datail: [
                'All data on CoNET gateway.',
                `Only when cannot connect to target server.`,
            ],
            proxyDataCache: 'Web cache:',
            proxyDataCache_detail: ['Yes', 'No'],
            clearCache: 'Delete all cache now',
            localPort: 'Local proxy port number:',
            localPath: 'HTTP/HTTPS conect path name:',
            requestPortNumber: 'Gateway server port number:',
            GlobalIp: 'Global IP:',
            option: 'option',
            WebRTCleak: 'Stop WebRTC leak',
            WebRTCleakInfo: 'End-to-End game and chat may not work.',
            pingError: 'CoNET gateway area speed check error! Please exit CoNET and reopen CoNET as administrator. Then do check speed again.',
            QTGateRegionERROR: [
                'Send connect request mail has an error. Please check your IMAP account settings.',
                '',
            ],
            GlobalIpInfo: `Please note: Both iOPN and @OPN will conceal your IP from others. iOPN offers the highest level of data speeds. @OPN offers additional layer of anonymity with some speed as a trade off. [@OPN] option is available in San Francisco, and currently only supports your owniClould Email. Please refer to the Terms of Service for our privacy policy.`,
            cacheDatePlaceholder: 'Web cache freshness lifetime.',
            sendConnectRequestMail: [
                'CoNET connection maybe down. Please wait a moment, re-connecting to CoNET gateway.',
                'Your connection will reset if you long time non use.',
            ],
            cacheDatePlaceDate: [
                { name: '1 hour', id: 1 },
                { name: '12 hour', id: 12 },
                { name: '1 day', id: 24 },
                { name: '15 days', id: 360 },
                { name: '1 month', id: 720 },
                { name: '6 months', id: 4320 },
                { name: 'forever', id: -1 },
            ],
            atQTGateDetail: [
                /*0*/ `Recommended for full privacy. @OPN@ uses CoNET’s “Quiet” technology to create a obfuscated private network by refracting encrypted data packets thru email servers. @OPN provides stealth internet communications where your IP address is hidden to client or proxy servers. Gaming and video stream my not be supported due to stability and speeds affected by email server choice. Currently iCloud mail is only supported.`,
                /*1*/ 'Recommended for high speed open internet access. iOPN uses CoNET’s “Quiet” technology to obfuscate encrypted data traffic to look like normal HTTP communications. iOPN offer security and protection of privacy while allowing access to the open internet.',
                /*2*/ 'Use CoNET’s gateway for domain search to get the right IP address from DNS cache. This is default.',
                /*3*/ 'Transfer all internet data over OPN.',
                /*4*/ 'Transfer select data over OPN. Only when unable to connect to certain servers. Network access may speed up but lost your privacy.',
                /*5*/ 'Web cache (or HTTP cache) is an used for the temporary storage (caching) of web documents, to reduce bandwidth usage, server load, and perceived lag. CoNET always encrypts all web cache data. This does not work for HTTPS connections.',
                /*6*/ 'Do not use web cache.',
                /*7*/ 'By setting the cache expiration date, you can always obtain the latest information on the server side.',
                /*8*/ 'Local proxy server port number is provided for other devices to use CoNET’s OPN connection. Please set a number from 3001 to 65535.',
                /*9*/ 'Local proxy server http/https access can secure your server.',
                /*10*/ 'The number of gateways to use. This will further help to obfuscate traffic by using multiple servers. This is available for subscription only.',
                /*11*/ 'This is your current CoNET gateway port number, You may change the port number if current one is blocked on your network.',
                /*12*/ 'Web Real-Time Communication (WebRTC) is a collection of standardized technologies that allows web browsers high speed to communicate with each other directly via IP address. It also may used for detect your real IP address even you hide IP address via VPN or other tools.',
            ],
            connectQTGate: 'Connecting, Retrieving CoNET gateway information...',
        },
        QTGateGateway: {
            title: 'CoNET service user detail',
            processing: 'Trying to connect to CoNET network...',
            error: [
                /* 0 */ 'Error: Your account has a connection that is using the CoNET proxy server. Please disconnect it before attempting to connect again.',
                /* 1 */ 'Error: Bandwidth maximum. If you would like to continue using OPN, please upgrade your account. Free accounts have a bandwidth maximum of 100MB per a day, 1 GB every month.',
                /* 2 */ 'Error: Data format error. Please restart CoNET.',
                'Error: This area does not have the resources. Please select another area or try connecting again later.',
                /* 3 */ 'Error: This region does not support OPN technology. Please select another area, or change other connect type.',
                /* 4 */ '@OPN support your own iCloud account only. Please change the email account that used to communication with CoNET.',
            ],
            connected: 'connected.',
            promo: 'Promotions',
            upgrade: 'Upgrade account',
            accountManager: 'Account',
            userType: ['Free user', 'Subscription'],
            datatransferToday: 'The daily bandith limit.：',
            datatransferMonth: 'The monthly bandwidth limit.：',
            todaysDatatransfer: 'Available bandwidth today.',
            monthDatatransfer: 'Available bandwidth this month.',
            gatewayInfo: ['Gateway Ip address：', 'Gateway connection port：'],
            userInfoButton: 'How to use?',
            stopGatewayButton: 'Stop gateway server',
            disconnecting: 'Destroying...',
        },
        qtGateView: {
            QTGateConnectResultWaiting: 'Please wait. It will may take a few minutes to establish your connection to CoNET.',
            title: 'Send custom server request',
            mainImapAccount: 'Email account for communicating with CoNET',
            QTGateDisconnectInfo: 'CoNET disconnected. Please select an IMAP account to use for connection request. ',
            QTGateConnectStatus: 'Status of CoNET connection',
            QTGateConnectResult: [
                'CoNET disconnected, click to connect to CoNET.',
                'Connecting to CoNET.',
                'CoNET Connected.',
                'Connection stopped with error! Please check IMAP account settings!',
                'CoNET Connected.',
            ],
            QTGateSign: [
                'Keypair status',
                'Your key pair is not signed by CoNET.',
                'CoNET certification authority is a trusted thus certifying your public keys is yoursalf in CoNET users when you share files of send message to other CoNET user. You also can signing another CoNET users with your keypair for make your trust relationship.',
                'Getting CoNET certification authority.',
                'Opps. System error. Try restart CoNET, if still have please re-install CoNET.',
                'System error!',
            ],
        },
        feedBack: {
            title: 'FEEDBACK',
            additional: 'Additional info',
            okTitle: 'Send to CoNET',
        },
    },
    {
        spalding: {
            mainPage: {
                logo: {
                    name: '羅伯特·斯伯丁博士',
                    title: '美國空軍退役準將',
                },
                rightSectionTitle: '超限戰',
                rightSectionSubTitle1: '美國精英們沉睡時',
                rightSectionSubTitle2: '中國陰影正在悄悄合攏',
                menu: [
                    '主頁',
                    '關於我們',
                    '社交媒體',
                    '觀看',
                    '聆聽',
                    '翻譯件',
                    '參考',
                    '聯絡',
                ],
                herotitle: '作家 | 演說家 | 企业家',
            },
        },
        addUser: '添加',
        addUserNameInputPlaceholder: '名稱',
        addUserKeyIDInputPlaceholder: '鑰匙ID',
        publicKeyTitle: '公開鑰',
        privatyKeyTitleShow: '私密鑰',
        copied: '已複製',
        airplaneMode: '脫機模式',
        privatyKeyTitle: '解密用私密鑰不應提供給任何人',
        coSearch: {
            audio: '',
            video480: '低分辨率',
            video720: '720p',
            video2k: '2K',
            video4k: '4K',
            video8k: '8K',
            searchInputPlaceholder: '請輸入檢索關鍵字組合或網址',
            SearchText: '搜尋',
            totalResults: ['大約有', '條記錄'],
            moreResults: '更多結果',
            SearchesRelated: ['', '的相關搜尋'],
            label_HTML: 'HTML代碼',
            imageSize: '圖片尺寸',
            label_picture: '圖片',
            similarImages: '看起來相似的圖片',
            errorMessage: [
                '無效請求',
                '您的圖片格式無法處理，請嘗試選擇其他圖片',
                '您的請求已達最大值，請稍後再試',
            ],
            coSearchConfigMenu: ['搜尋設定', '搜尋引擎指定'],
            coSearchEngineSelectArray: [
                {
                    name: 'google',
                    icon: 'google',
                    iconColor: '',
                    textColor: '',
                    showName: 'Google',
                    image: null,
                },
            ],
            coSearchConfigIcon: ['google', 'images/bing.svg', ''],
            coSearchEngineName: ['Google', '', ''],
            searchToolBarMenu: ['網頁', '新聞', '圖片', '視頻'],
            timeUnit: {
                hours: '小時前',
                day: '天前',
                mins: '分鐘前',
            },
            TimeTolocalTime: function (time) {
                return new Date(time).toLocaleDateString('zh-TW', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },
        },
        appsManager: {
            mainLoading: '正在獲取結點信息...',
            nodeName: '您進入的節點名：',
            connectAddress: '接入地址：',
            welcomeTextSub: '隱私安全自由的新互聯網',
            serviceList: '提供服務一覽',
        },
        youtube: {
            startup: {
                title: '歡迎使用Co for Youtube',
                detail: '在此您可以檢索Youtube視頻，下載並播放所選視頻',
            },
            search: {
                placeholder: '請輸入檢索關鍵字，或輸入Youtube的播放鏈接',
                button_text: '檢索',
                error: ['您的檢索無效，請再次檢索。'],
            },
        },
        perment: {
            serverTitle: '伺服器',
        },
        twitter: {
            newTwitterAccount: `請輸入您的推特APP信息，如何獲得和設置推特賬號APP信息，請點擊<a target="_blank" href='https://github.com/QTGate/QTGate-Desktop-Client/wiki/Create-Twitter-APP'">這裡</a>獲得更多信息`,
            addAccount: '添加推特賬戶',
            following: ['正在關注', '解除關注', '關注'],
            followers: '關注者',
            second: '秒',
            min: '分',
            hour: '小時',
            retweeted: '已轉推',
            month: '月',
            day: '日',
            close: '關閉',
            replying: '回覆: ',
            videoSizeOver: '視頻超推特限制: 尺寸 <(1280x1024)，文件 <  300MB，時間 < 140秒，請轉換視頻後再上傳',
            twitterBottonTitle: ['發推', '全部發推'],
            newTwitterTitle: ['撰写新推文', '撰写新对话串'],
            returnEdit: '回編輯',
            newTwitterDistroyButtonTitle: ['放棄推文', '捨棄對話串'],
            urlInfo: '<h3>推特客户端預覽版</h3><p>用戶可以无限量免费使用此客戶端，免翻牆(不使用VPN，不用連結CoGate代理服務器)匿名訪問(您的真實IP地址不會洩露給推特)您的推特帳戶。</p><p>其他设备可以输入以下网址打开此APP应用</p>',
            accountError: '推特回送錯誤信息提示：您輸入的APP應用設定信息有誤。請檢查您的推特APP信息後再試。',
        },
        thirdParty: {
            information: '歡迎來到CoNET網絡',
            comesoon: '即將登場',
            app: [
                'CoGate',
                '酷茶',
                '酷存',
                'Co邮箱',
                'Co新闻频道',
                '酷檢索',
                '酷推特',
                'Co for',
                '酷錢包',
                'CoNet業務訂製',
            ],
            qtgateGateway: 'CoNET提供的高質量上網技術iOPN和@OPN，在CoNET全球16個區域，當場定制您專屬的代理服務器，變換您的IP地址隱身無障礙的訪問互聯網',
            dimmer: [
                '高質量量身定制代理伺服器業務，讓您隱身安全不受注意的網上沖浪。',
                '隱身匿名去中心化不被封鎖的社交媒體',
                '安全隱私文件雲存儲系統',
                '隱身匿名邮件客户端，可免翻牆访问Gmail',
                '免翻墙隱身匿名訪問世界頭條新闻',
                'QTG承接定制各類公眾服務類及跨國企業私有APP業務',
                '免翻牆匿名隱身網頁檢索',
                '免翻牆匿名隱身推特客戶端',
                '免翻牆匿名隱身Youtube客戶端',
                'CoNET加密貨幣錢包',
            ],
        },
        account: {
            willPayNextExpir: '自動扣款 ',
            openAutomatically: '打開自動扣款',
            QTGatePayRisk: '使用CoNET安全網關支付，如果您有安全疑慮，請使用Stript安全網關支付。',
            paymentSuccessTitile: '謝謝您',
            networkShareTitle: '代理伺服器網絡',
            stripePayment: '銀行網關支付',
            promoButton: '我有促銷碼',
            qtgatePayment: 'CoNET網關支付',
            paymentProblem1: '支付遇到問題',
            paymentProblem: '您目前的所在區域看上去銀行網關被和諧，您可以使用CoNET網關支付來完成支付',
            title: '賬戶管理',
            currentPlanExpire: [
                '訂閱截止日期：',
                '下一次自動續訂日',
                '每月數據重置日',
            ],
            CancelSuccess: function (PlanExpire, isAnnual, returnAmount) {
                return `中止訂閱成功。您可以一直使用您的原訂閱到${new Date(PlanExpire).toLocaleDateString()}為止。以後您將會自動成為CoNET免費用戶，可以繼續使用CoNET的各項免費功能。 ${isAnnual
                    ? `退款金額us$${returnAmount}會在5個工作日內退還到您的支付卡。 `
                    : '下月起CoNET系統不再自動扣款。 '} 祝您網絡衝浪愉快。`;
            },
            currentAnnualPlan: ['月度訂閱', '年度訂閱'],
            cardPaymentErrorMessage: [
                /* 0 */ '輸入的信用卡號有誤！',
                /* 1 */ '輸入的信用卡期限有誤！',
                /* 2 */ '輸入的信用卡安全碼有誤！',
                /* 3 */ '輸入的信用卡持有人郵編有誤！',
                /* 4 */ '支付失敗，支付無法完成請稍後再試',
                /* 5 */ '支付數據存在錯誤',
                /* 6 */ '您的付款被銀行所拒絕',
                /* 7 */ '發生錯誤，請稍後再試',
            ],
            cantUpgradeMonthly: '年度計劃不可降級為月度計劃。請先終止您當前訂閱的年度計劃，再重新申請此月度訂閱',
            segmentTitle: '賬戶Email: ',
            currentPlan: '當前訂閱: ',
            oldPlanBalance: '原計劃剩餘價值：',
            needPay: '應付金額：',
            monthResetDay: '月重置日：',
            cancelPlanButton: '中止當前訂閱',
            monthResetDayAfter: '',
            bandwidthBalance: '月度數據剩余量：',
            planPrice: '訂閱價格：',
            MonthBandwidthTitle: '月度代理伺服器限額：',
            dayBandwidthTitle: '每日限額：',
            upgradeTitle: '升級',
            planExpirDate: function (year, month, day) {
                return `${year} 年${month}月${day}日`;
            },
            accountOptionButton: '賬戶選項',
            paymentSuccess: '您的訂閱已經完成,祝您網絡衝浪愉快。',
            qtgateTeam: 'CoNET開發團隊敬上',
            paymentProcessing: '正在通訊中...',
            DowngradeTitle: '降級賬戶選項',
            multiOpn: 'OPN併發多代理技術',
            cancelPlan: '終止當前訂閱',
            cantCancelInformation: '您的賬戶可能是CoNET測試用戶，或使用優惠碼產生的訂閱用戶，此類賬戶可以升級但不能被中止',
            MonthBandwidthTitle1: '傳送限額',
            monthlyAutoPay: function (monthCost) {
                return `<span>每月自動扣款</span><span class="usDollar">@ us$</span><span class="amount" >${monthCost}</span>/月<span>`;
            },
            annualPay: function (annual_monthlyCost) {
                return `<span>年付款每月只需</span><span class="usDollar">@ us$</span><span class="amount" >${annual_monthlyCost}</span>/月<span>`;
            },
            expirationYear: '信用卡期限',
            serverShare: '代理伺服器',
            cardNumber: '信用卡號',
            cvcNumber: '信用卡安全碼',
            calcelPayment: '中止付款',
            doPayment: '確認付款',
            postcodeTitle: '信用卡擁有者郵編',
            aboutCancel: '關於中止訂閱',
            payAmountTitile: '支付合計',
            canadaCard: '*加拿大持卡人將自動加算GST(BC)5%',
            multiRegion: [
                '單一代理區域並發代理',
                '多代理區域混合併發代理',
                '多代理區域混合併發代理',
                '多代理區域混合併發代理',
            ],
            maxmultigateway: [
                '最大同時可二條並發代理數',
                '最大同時可使用四條並發代理數*',
                '最大同時可使用四條並發代理數',
            ],
            continue: '下一步',
            serverShareData: [
                '共享伺服器',
                '獨佔一台伺服器*',
                '獨佔二台伺服器*',
                '獨佔四台伺服器',
            ],
            monthlyPay: '月租費',
            internetShareData: [
                '共享高速帶寬',
                '獨享高速帶寬*',
                '獨享雙線高速帶寬*',
                '獨享四線高速帶寬',
            ],
            serverShareData1: 'OPN併發多代理技術，同時使用數大於獨占數時，會相應分享您所獨占的資源',
            cancelPlanMessage: '可隨時終止您的訂閱，CoNET的訂閱是以月為基本的單位。您的月訂閱將在下月您的訂閱起始日前被終止，您可以繼續使用您的本月訂閱計劃，您將自動回到免費用戶。如果您是每月自動扣款，則下月將不再扣款。如果您是年度訂閱計劃，您的退款將按普通每月訂閱費，扣除您已經使用的月份後計算的差額，將自動返還您所支付的信用卡賬號，如果您是使用促銷碼，或您是測試用戶，您的終止訂閱將不能被接受。 ',
            cancelPlanMessage1: function (isAnnual, amount, monthlyPay, expire, passedMonth, totalMonth) {
                return `<span>您的訂閱計劃是${isAnnual
                    ? `年度訂閱，退還金額將按照您已付年訂閱費</span><span class="usDollar">us$</span><span class="amount">${amount / 100}</span><span> - 該訂閱原價 </span><span class="usDollar">us$</span><span class="amount">${monthlyPay / 100}</span><span> X 已使用月數(包括本月) </span><span class="amount">${passedMonth}</span><span> = 餘額 </span><span class="usDollar">us$</span><span class="amount">${amount - passedMonth * monthlyPay > 0
                        ? (amount - passedMonth * monthlyPay) / 100
                        : 0}</span><span>，將在7個工作日內，退還到您用來支付的信用卡帳戶。</span>`
                    : `月訂閱，您的訂閱將下次更新日</span><span class="amount">${nextExpirDate(expire).toLocaleDateString()}</span><span>時不再被自動扣款和更新。</span>`}`;
            },
        },
        QTGateDonate: {
            title: 'CoNET贊助商提供的免流量網站',
            meta_title: '捐贈者：',
            detail: '所有CoNET用戶，使用CoNET代理伺服器，訪問贊助商贊助的網站時產生的流量，都不被計入。免費用戶需注意的是，如本日或本月流量已用完，無法接入CoNET代理伺服器，則無法利用此功能。',
        },
        useInfoiOS: {
            title1: 'iOS設備本地代理伺服器設定',
            info: [
                {
                    title: '打開控制面板，點擊Wi-Fi',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '',
                    image: '/images/iOS1.jpg',
                },
                {
                    title: '選擇當前WiFi的圈i符號',
                    titleImage: '',
                    detail: '',
                    image: '/images/iOS2.jpg',
                },
                {
                    title: '選擇底部的設置代理伺服器',
                    titleImage: '',
                    detail: '',
                    image: '/images/iOS3.jpg',
                },
                {
                    title: '選擇自動設置',
                    titleImage: '',
                    detail: '<p>在URL網址處，HTTP和HTTPS代理按照藍色第一行填入，SOCKS代理按藍色第二行填入</p>',
                    image: '/images/iOS4.jpg',
                },
            ],
        },
        firefoxUseInfo: {
            title1: '火狐瀏覽器它單獨設定代理服務，可以不影響系統而輕鬆使用代理上網',
            info: [
                {
                    title: '打開火狐，點擊右上角工具圖標，選擇設定',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '<p><a href="https://www.mozilla.org/zh-TW/firefox/#" target="_blank">下载Firefox</a></p>',
                    image: '/images/firefox1.jpg',
                },
                {
                    title: '選擇常規項，滾動畫面至最下部，在網絡代理處，點擊詳細設定',
                    titleImage: '',
                    detail: '',
                    image: '/images/firefox2.jpg',
                },
                {
                    title: '選擇自動設置代理伺服器，選勾DNS使用SOCKS v5',
                    titleImage: '',
                    detail: 'HTTP和HTTPS代理按照藍色第一行填入，SOCKS代理按藍色第二行填入',
                    image: '/images/firefox3.jpg',
                },
            ],
        },
        useInfoWindows: {
            title1: 'Windows10本地代理伺服器設定',
            info: [
                {
                    title: '關於Windows其他版本',
                    titleImage: '',
                    detail: '<p>Windows其他版本的代理伺服器設定請參照<a target="_blank" href="#" onclick="return linkClick (`https://support.microsoft.com/ja-jp/help/135982/how-to-configure-internet-explorer-to-use-a-proxy-server`)">微軟公司網站</a></p><p>请按以下参数设置本地代理伺服器：</p>',
                    image: '',
                },
                {
                    title: '啟動Internet Explorer',
                    titleImage: '/images/IE10_icon.png',
                    detail: '<p>點擊右上角工具圖標，滑動設定菜單至最下部選擇【設定】</p>',
                    image: '/images/windowsUseInfo1.jpg',
                },
                {
                    title: '滑動菜單至最下部點擊高級設定',
                    titleImage: '',
                    detail: '',
                    image: '/images/windowsUseInfo2.jpg',
                },
                {
                    title: '再次滑動菜單，點擊打開代理伺服器設定',
                    titleImage: '',
                    detail: '',
                    image: '/images/windowsUseInfo3.jpg',
                },
                {
                    title: '選擇自動設置代理伺服器。',
                    titleImage: '',
                    detail: '<p>WINDOWS10系統只對應HTTP和HTTPS，如果想使用全局代理的用戶，需另外安裝瀏覽器如火狐等，然後在火狐瀏覽器內單獨設定Proxy全局代理SOCKS</p>',
                    image: '/images/windowsUseInfo4.jpg',
                },
            ],
        },
        useInfoAndroid: {
            title1: '安卓設備本地代理伺服器設定',
            info: [
                {
                    title: '打开控制面板，选择Wi-Fi设定',
                    titleImage: '/images/androidSetup.jpg',
                    detail: '',
                    image: '/images/android1.jpg',
                },
                {
                    title: '長按當前WiFi連接名稱等待菜單出現，選擇菜單的修改設定',
                    titleImage: '',
                    detail: '',
                    image: '/images/android2.jpg',
                },
                {
                    title: '打開顯示高級選項，在代理伺服器設定(Proxy)中選擇自動設置',
                    titleImage: '',
                    detail: 'HTTP和HTTPS代理按照藍色第一行填入，SOCKS代理按藍色第二行填入',
                    image: '/images/android3.jpg',
                },
            ],
        },
        useInfoMacOS: {
            title: '本地代理伺服器已在後台運行。您的其他電子設備，可通過設置本地代理，來使用CoNET連接到互聯網',
            wrtTestAreaTitle: 'WebRTC漏洞数据泄漏区域',
            customProxy: '訂製伺服器完成',
            title1: 'MacOS 本地代理伺服器設定',
            localIpAddress: '如果能看到這個IP地址，由於是本地局域網地址洩漏，無關緊要。',
            proxySetupHelp: '如需幫助，請點擊下列您的OS系統所屬圖案',
            globalIpAddress: '如果顯示這個IP，您的瀏覽器洩漏了您真實的IP地址',
            webRTCinfo: '阻止WebRTC漏洞，請使用SOCKS代理設定，檢查是否漏洞還在，請點擊<a href="/Wrt" target="_blank">這裡</a>',
            wrtTest: '以下為測試結果：',
            proxyServerIp: '<p>代理設定選擇：<span style="color: brown;">自動設定</p>',
            proxyServerPort: 'HTTP和HTTPS代理的設定為：',
            proxyServerPassword: 'SOCKS代理的設定為：',
            info: [
                {
                    title: '打開控制面板，點擊【網絡】',
                    titleImage: '/images/macOsControl.jpg',
                    detail: '',
                    image: '/images/userInfoMacos1.jpg',
                },
                {
                    title: '選擇網絡【高級...】',
                    titleImage: '',
                    detail: '',
                    image: '/images/macosUserInfo2.jpg',
                },
                {
                    title: '點擊代理伺服器設定，選勾自動代理，選購排除簡單Host名',
                    titleImage: '',
                    detail: '<p>HTTP和HTTPS代理按照藍色第一行填入，SOCKS代理按藍色第二行填入</p>',
                    image: '/images/macosUserInfo3.jpg',
                },
            ],
        },
        QTGateInfo: {
            title: '功能簡介',
            version: '本機安裝版本：v',
            detail: [
                {
                    color: '#a333c8',
                    icon: 'exchange',
                    header: '隱身匿名自由上網CoNET',
                    detail: 'CoNET通過使用<a href="https://zh.wikipedia.org/wiki/%E9%AB%98%E7%BA%A7%E5%8A%A0%E5%AF%86%E6%A0%87%E5%87%86" target="_blank">AES256-GCM</a>和<a href="https://zh.wikipedia.org/wiki/PGP" target="_blank">OpenPGP</a >加密Email通訊，創造了OPN匿名網絡通訊技術，CoNET公司首創的@OPN技術，它全程使用加密Email通訊，客戶端和代理伺服器彼此之間不用交換IP地址，實現高速網絡通訊。iOPN通訊技術是一種HTTP協議下的加密混淆代理技術，能夠隱藏變換您的IP地址高速通訊。二種通訊方式都能夠讓您，隱身和安全及不被檢出的上網，保護您的隱私，具有超強對抗網絡監控,網絡限制和網絡阻斷。',
                },
                {
                    color: '#e03997',
                    icon: 'talk outline',
                    header: '無IP點對點即時加密通訊服務QTChat',
                    detail: 'CoNET用戶之間通過email的點對點即時通訊服務，它具有傳統即時通訊服務所不具有的，匿名無IP和用戶之保持秘密通訊的功能。 QTChat加密通訊服務可以傳送文字，圖片和視頻文件信息，CoNET系統只負責傳送信息，不擁有信息，也無法檢查信息本身，所以CoNET不承擔信息所有的法律責任。 QTChat支持群即時通訊，將支持視頻流直播服務。',
                },
                {
                    color: '#6435c9',
                    icon: 'cloud upload',
                    header: '加密文件匿名網絡雲存儲分享功能QTStorage',
                    detail: '用戶通過申請多個和不同的免費email服務商賬號，可以把一個文件加密拆分成多個部分，分別存儲在不同的email賬號下，可以保密安全和無限量的使用網絡儲存。用戶還可以通過CoNET系統在CoNET用戶之間分享秘密文件。',
                },
                {
                    color: 'darkcyan',
                    icon: 'spy',
                    header: '阻斷間諜軟件',
                    detail: 'CoNET系統連接全球DNSBL聯盟數據庫，用戶通過訂閱CoNET系統黑名單列表，並使用CoNET客戶端上網，讓潛伏在您電子設備內的間諜軟件，它每時每刻收集的信息，不能夠被送信到其信息收集伺服器，能夠最大限的保障您的個人隱私。',
                },
                {
                    color: '#6435c9',
                    icon: 'external share',
                    header: '本地VPN伺服器',
                    detail: 'CoNET用戶在戶外時可以通過連接自己家裡的VPN，來使用CoNET客戶端隱身安全上網。',
                },
            ],
        },
        cover: {
            firstTitle1: 'Kloak OS',
            firstTitle2: '基於信任隱私和安全的互聯網',
            firstTitle3: '革命性的無IP地址通訊網顛覆傳統互聯網',
            start: '開門',
            proxyStoped: 'CoGate定制代理伺服器已經停止，如需使用請重新定制代理伺服器。',
        },
        topWindow: {
            title: '慶祝加拿大150週年特別提供',
        },
        firstNote: {
            title: '歡迎使用CoNET，感謝您使用我們的產品和服務(下稱“服務”)。本服務由總部設在加拿大的CoNET Technology Inc.下稱“CoNET”提供。 ',
            firstPart: '您使用我們的服務即表示您已同意本條款。請仔細閱讀。使用我們的服務，您必須遵守服務中提供的所有政策。',
            detail: [
                {
                    header: '關於我們的服務',
                    detail: '請勿濫用我們的服務，舉例而言: 請勿干擾我們的服務或嘗試使用除我們提供的界面和指示以外的方法訪問這些服務。您僅能在法律(包括適用的出口和再出口管制法律和法規)允許的範圍內使用我們的服務。如果您不同意或遵守我們的條款或政策，請不要使用我們所提供的服務，或者我們在調查可疑的不當行為，我們可以暫停或終止向您提供服務。',
                },
                {
                    header: null,
                    detail: '使用我們的服務並不讓您擁有我們的服務或您所訪問的內容的任何知識產權。除非您獲得相關內容所有者的許可或通過其他方式獲得法律的許可，否則您不得使用服務中的任何內容。本條款並未授予您使用我們服務中所用的任何商標或標誌的權利。請勿刪除、隱藏或更改我們服務上顯示的或隨服務一同顯示的任何法律聲明。',
                },
                {
                    header: '關於CoNET無IP通訊技術和隱私保護的局限性',
                    detail: 'CoNET世界首創的使用Email的IMAP協議建造一個無IP通訊環境，在您利用CoNET進行通訊過程中，CoNET無法獲得您目前所使用的IP地址，可以最大限度的保障您的個人隱私。但是這項技術並不能夠保證您的信息絕對的不被洩露，因為您的IP地址有可能被記錄在您所使用的Email服務供應商，如果持有加拿大法院令尋求CoNET的Log公開，再和Email服務供應商的Log合併分析，可能會最終得到您的信息。CoNET並不能夠絕對保障您的隱私。',
                },
                {
                    header: '關於個人隱私保護，系統日誌和接收CoNET傳送的信息',
                    detail: '在您使用服務的過程中，我們可能會向您發送服務公告、管理消息和其他信息。您可以選擇不接收上述某些信息。',
                },
                {
                    header: null,
                    detail: '當您使用我們的服務時，我們為了計費處理會自動收集非常有限的數據流量信息，並存儲到伺服器日誌中。數據流量信息僅用於計算客戶應支付通訊費用而收集的，它收集的數據是：日期，用戶帳號，所使用的代理服務區域和代理伺服器IP，數據包大小，下載或上傳。例如：',
                },
                {
                    header: null,
                    detail: '<p class="tag info">06/20/2017 18:12:16, info@CoNET.com, francisco, 104.236.162.139, 300322 byte up, 482776323 byte down.</p><p class="tag info">06/21/2017 12:04:18, info@CoNET.com, francisco, 104.236.162.139, 1435226 byte up, 11782238 byte down.</p>',
                },
                {
                    header: null,
                    detail: 'CoNET沒有保存除了以上信息以外的任何其他信息。我們會配合並向持有加拿大法院令的執法機構提供此日誌文件。如果您是加拿大以外地區的執法機構，有這方面信息披露的需求，請通過加拿大外交部來聯繫我們：',
                },
                {
                    header: null,
                    detail: '<a class="tag alert" href="http://www.international.gc.ca/">http://www.international.gc.ca/</a>',
                },
                {
                    header: '版權所有權',
                    detail: '該軟件是CoNET的智慧產權，並且受到相關版權法，國際版權保護規定和其他在版權授與國家內的相關法律的保護。該軟件包含智慧產權材料, 商業秘密及其他產權相關材料。你不能也不應該嘗試修改，反向工程操作，反彙編或反編譯CoNET服務，也不能由CoNET服務項目創造或衍生其他作品。',
                },
                {
                    header: null,
                    detail: '關於我們服務中的軟件，CoNET授予您免許可使用費、不可轉讓的、非獨占的全球性個人許可, 允許您使用由CoNET提供的、包含在服務中的軟件。本許可僅旨在讓您通過本條款允許的方式使用由CoNET提供的服務並從中受益。您不得複制、修改、發布、出售或出租我們的服務, 或所含軟件的任何部分。',
                },
                {
                    header: '修改與終止服務',
                    detail: '我們持續改變和改善所提供的服務。我們可能會新增或移除功能或特性，也可能會暫停或徹底停止某項服務。您隨時都可以停止使用服務，儘管我們並不希望您會這樣做。 CoNET也可能隨時停止向您提供服務，或對服務附加或設定新的限制。',
                },
                {
                    header: '服務的責任',
                    detail: '在法律允許的範圍內，CoNET及其供應商和分銷商不承擔利潤損失、收入損失或數據、財務損失或間接、特殊、後果性、懲戒性或懲罰性損害賠償責任。',
                },
                {
                    header: '法律規定的貿易禁止事項',
                    detail: '當您按下同意按鈕，表示您已經確認您不屬於加拿大法律所規定的禁止貿易對象的列表之中。',
                },
                {
                    header: '服務的商業使用',
                    detail: '如果您代表某家企業使用我們的服務，該企業必須接受本條款。對於因使用本服務或違反本條款而導致的或與之相關的任何索賠、起訴或訴訟，包括因索賠、損失、損害賠償、起訴、判決、訴訟費和律師費而產生的任何責任或費用，該企業應對CoNET及其關聯機構、管理人員、代理機構和員工進行賠償並使之免受損害。',
                },
                {
                    header: '本條款的變更和約束力',
                    detail: '关于本条款：我们可以修改上述条款或任何适用于某项服务的附加条款，例如，为反映法律的变更或我们服务的变化而进行的修改。您应当定期查阅本条款。我们会在本网页上公布这些条款的修改通知。我们会在适用的服务中公布附加条款的修改通知。所有修改的适用不具有追溯力，且会在公布十四天或更长时间后方始生效。但是，对服务新功能的特别修改或由于法律原因所作的修改将立即生效。如果您不同意服务的修改条款，应停止使用服务。如果本条款与附加条款有冲突，以附加条款为准。',
                },
                {
                    header: '',
                    detail: '本条款约束CoNET与您之间的关系，且不创设任何第三方受益权。如果您不遵守本条款，且我们未立即采取行动，并不意味我们放弃我们可能享有的任何权利（例如，在将来采取行动）。如果某一条款不能被强制执行，这不会影响其他条款的效力。加拿大BC省的法律（不包括BC州的法律冲突规则）将适用于因本条款或服务引起的或与之相关的纠纷。因本条款或服务引起的或与之相关的所有索赔，只能向加拿大BC省法院提起诉讼，且您和CoNET同意上述法院拥有属人管辖权。',
                },
            ],
            disagree: '不同意',
            agreeMent: 'CoNET服務條款和隱私權',
        },
        linuxUpdate: {
            newVersionDownload: '點擊這裡下載並安裝',
            step1: '請更新版本: ',
            step2: '授權新版本CoNET為可執行文件',
            step2J1: '/images/linuxUpdate1_tw.jpg',
            step2J2: '/images/linuxUpdate2_tw.jpeg',
            step2_detail1: '右鍵點擊已下載的CoNET圖標，選擇菜單裡的文件屬性',
            step2_detail2: '在權限選項裡，選勾“允許檔案文件執行”。',
            step3: '退出舊版本CoNET後，雙擊CoNET文件執行安裝',
            exit: '退出CoNET',
            tryAgain: '再次嘗試',
            refresh: '刷新頁面',
        },
        imapInformation: {
            title: '通訊專用Email郵箱設置',
            tempImapAccount: `臨時郵箱申請有困難？您可以暫時使用<a href="#" style = "margin-left: 0.5em;" class="ui label teal" onclick="return linkClick ('https://github.com/QTGate/QTGate-Desktop-Client/wiki/IMAP%E8%87%A8%E6%99%82%E5%B8%B3%E6%88%B6')">CoNET網絡提供的臨時IMAP帳號供各位測試</a>`,
            infomation: `請設置網絡通訊用郵箱、或 `,
            coNetTempAccount: '使用CoNet提供的臨時郵箱',
            serverDetail: '詳細設定：',
            imapServer: 'IMAP伺服器設定',
            UserName: '登陸用戶名稱',
            Ssl: '使用Ssl加密信息傳輸：',
            imapServerInput: 'IMAP伺服器IP或域名',
            portName: '通訊連接埠：',
            otherPortNumber: '其他號碼：',
            smtpServer: 'SMTP伺服器設定',
            smtpServerInput: 'SMTP伺服器設定',
            Error_portNumber: '連接埠應該是從1-65535之間，並且不是22的數字',
            emailServerPassword: '郵箱密碼(推薦使用應用專用密碼)',
            imapAccountConform: function (iamp, account) {
                return `<p class="ui small header brown">警告：</p><p class="grey">當您按下提交按鈕時，意味著您已經確認【<B class="red">${iamp}</B>】是為了使用CoNET系統而特別申請的臨時郵箱，您同意承擔由此帶來的風險，並授權CoNET系統可以使用這個Email郵箱傳輸信息!</p><p class="grey" >CoNET平台將會向CoNET發送包含以下信息的email：【<B class="red">${iamp}</B>】及APP密碼，註冊【<B class="red">${account}</B>】郵箱地址，使用語言，時區，加密公鑰。 </p><p class="grey">同時您也同意並授權CoNET可以向您的註冊郵箱【<B class="red">${account}</B>】發送CoNET有關服務，促銷，賬戶及其他信息。 </p>`;
            },
            agree: '我已經了解風險，並願意繼續',
            imapOtherCheckError: '不能連接到Email伺服器，有可能您設定的伺服器名稱或IP，通訊連接埠有誤，請檢查您的伺服器詳細設定！',
            CertificateError: 'Email伺服器提示的證書不能被系統信任！您的Email伺服器有可能是一個仿冒的，您如果想繼續，請在詳細設定裡選擇【允許連接到不被信任證書的Email伺服器】，但您的Email登陸信息有可能洩漏給此伺服器！',
            IgnoreCertificate: '允許連接到不被信任證書的Email伺服器',
            Certificat: '如果您不確定請別選擇這項，這個選擇是非常危險，因為它允許連接上一個仿冒的伺服器，可能洩露您的用戶名和密碼。',
            AuthenticationFailed: 'Email伺服器提示用戶名或密碼錯誤，請仔細檢查您的用戶名和密碼！',
            addAEmail: '添加通訊用Email賬戶',
            tryAgain: '再試一次',
            connectImap: '連結CoNET網絡',
            cancelConnect: '終止CoNET網絡連接',
            imapItemTitle: '通訊用郵箱詳細信息',
            loaderText: [
                '正',
                '在',
                '和',
                'C',
                'o',
                'N',
                'E',
                'T',
                '建',
                '立',
                '通',
                '訊',
                '管',
                '道',
                '...',
            ],
            imapCheckingStep: [
                /* 0 */ '正在尝试连接邮件伺服器',
                /* 1 */ '邮件伺服器IMAP連接成功，正在等待CoNET對接。',
                /* 2 */ '邮件伺服器SMTP連接成功',
                /* 3 */ 'CoNET客户端向CoNET系统发出联机请求Email。和CoNET联机需要额外的时间，请耐心等待。',
                /* 4 */ '成功連接CoNET',
                /* 5 */ '邮件伺服器IMAP連接成功',
            ],
            imapResultTitle: 'IMAP伺服器CoNET通訊評分：',
            testSuccess: '電子郵件伺服器連接試驗成功！',
            exitEdit: '退出編輯Email帳戶',
            deleteImap: '刪除IMAP帳戶',
            proxyPortError: '連接埠應該是從3001-65535之間的數字，或此端口已被其他APP所占用，請嘗試填入其他號碼。',
            appPassword: '關於APP密碼',
            imapCheckError: [
                '不能连接到郵件伺服器，有可能您沒有互聯網，或所在網絡不支持郵件IMAP通訊，請檢查您的網絡，或刷新頁面重試一次',
                '郵件伺服器提示用户名或密码错误，请仔细检查您的用户名和密码！',
                '郵件伺服器證書錯誤！您所在網絡可能存在網絡中間人攻擊。如果您使用某些防毒軟件如Kaspersky，您設定了讓它檢測郵件，它會使用中間人攔截技術攔截任何郵件通訊，您需要關閉此項功能。',
                '郵件伺服器發送郵件錯誤，這通常是您使用的密碼是普通密碼所致，請換用APP密碼後再次嘗試',
                '未連結互聯網，請檢查網絡',
                '未知錯誤，請退出CoNET後再試。',
                '您的郵箱無可用空間錯誤，請檢查郵箱刪除不必要的郵件後再試。',
            ],
        },
        Home_keyPairInfo_view: {
            deleteKeyPairHaveLogin: '請使用登陸後的客戶端來刪除您的密鑰',
            title: '密鑰信息',
            emailNotVerifi: '您的密鑰未獲CoNET簽署認證。 ',
            emailVerified: '您的密鑰已獲CoNET簽署認證。 ',
            NickName: '暱稱：',
            creatDate: '密鑰創建日期：',
            keyLength: '密鑰位強度：',
            password: '請設定密鑰保護密碼',
            password1: '請輸入密碼',
            logout: '退出登錄',
            deleteKeyPairInfo: '刪除密鑰將使您的CoNet網絡信息包括私密文件將全部丟失。',
            delete: '刪除',
            keyID: '密鑰對ID：',
            locked: '請輸入密碼。忘了密碼請刪除此密鑰',
            systemError: '發生系統錯誤。如果重複發生，請刪除您的密鑰，再次設定您的系統！',
        },
        home_index_view: {
            newVersion: '新版本準備就緒，請安裝！',
            newVersionInstallLoading: '更新中請稍候',
            localIpAddress: '本機',
            clickInstall: '點擊安裝新版本',
            internetLable: '互聯網',
            gateWayName: '代理伺服器',
            showing: '系統狀態',
            nextPage: '下一頁',
            agree: '同意協議並繼續',
            imapEmailAddress: '郵箱帳戶名',
            emailAddress: 'Email地址',
            stopCreateKeyPair: '停止生成密鑰對',
            creatKeyPair: '創建密鑰對..',
            keyPairCancel: '生成密鑰對被中止',
            keyPairGenerateError: '生成密鑰對發生系統錯誤，請重試！ ',
            keyPairGenerateSuccess: '完成生成密鑰對',
            cancel: '放棄操作',
            systemPassword: 'CoNET客戶端密碼設置',
            continueCreateKeyPair: '繼續生成',
            SystemAdministratorNickName: '暱稱',
            KeypairLength: '請選擇加密通訊用密鑰對長度：這個數字越大，通訊越難被破解，但會增加通訊量和運算時間。',
            systemAdministratorEmail: 'RSA密鑰生成',
            GenerateKeypair: '<em>系統正在生成用於通訊和簽名的RSA加密密鑰對，計算機需要運行產生大量的隨機數字，可能需要幾分鐘時間，尤其是長度為4096的密鑰對，需要特別長的時間，請耐心等待。關於RSA加密算法的機制和原理，您可以訪問維基百科：' +
                `<a href='#' target="_blank" onclick="return linkClick ('https://zh.wikipedia.org/wiki/RSA加密演算法')">https://zh.wikipedia.org/wiki/RSA加密演算法</a></em>`,
            inputEmail: '加密通訊用(curve25519)鑰匙生成',
            accountEmailInfo: `由於CoNET域名在某些國家和地區被防火牆屏蔽，而不能正常收發CoNET的Email，如果您是處於防火牆內的用戶，建議使用防火牆外部的郵件服務商。`,
            dividertext: '選項（可不填）',
        },
        error_message: {
            title: '錯誤',
            errorNotifyTitle: '系統錯誤',
            Success: '完成',
            localServerError: '本地伺服器錯誤，請重新啟動CoNET！',
            required: '請填寫此字段',
            EmailAddress: [
                '請按照下列格式輸入你的電子郵件地址: someone@example.com.',
                '您已有相同的Email賬戶',
                '此類Email伺服器CoNET暫時不對應。',
            ],
            PasswordLengthError: '密碼必須設定為5個字符以上。',
            finishedKeyPair: '密鑰對創建完成',
            doCancel: '終止生成',
            errorKeyPair: '密鑰對創建發生錯誤，請重試',
            SystemPasswordError: '密鑰對密碼錯誤，請重試！如果您已忘記您的密鑰對密碼，請刪除現有的密鑰對，重新生成新的密鑰對。',
            finishedDeleteKeyPair: '密鑰對完成刪除!',
            offlineError: '您的電腦視乎未連結到互聯網，請檢查網路連結',
            imapErrorMessage: [
                /* 0 */ '未能夠與CoNET網絡對接成功。CoNET網絡可能存在問題，請稍後再次嘗試建立連結。或聯繫CoNET服務。',
                /* 1 */ '數據格式錯誤，請重試',
                /* 2 */ '您的電腦未連接到互聯網，請檢查網絡後再次嘗試！',
                /* 3 */ 'Email伺服器提示IMAP用戶名或密碼錯！這個錯誤通常是由於您使用的密碼是普通密碼，或者您的APP密碼已失效，請到您的Email帳戶檢查您的APP密碼，然後再試一次。',
                /* 4 */ 'Email伺服器的指定連接埠連結失敗，請檢查您的IMAP連接埠設定，如果您在一個防火牆內部，則有可能該端口被防火牆所屏蔽，您可以嘗試使用該IMAP伺服器的其他連接埠！',
                /* 5 */ '伺服器證書錯誤！您可能正在連接到一個仿冒的Email伺服器，如果您肯定這是您希望連接的伺服器，請在IMAP詳細設定中選擇忽略證書錯誤。',
                /* 6 */ '無法獲得Email伺服器域名信息，請檢查您的Email伺服器設定！或您的電腦沒有連結互聯網，請檢查網絡狀態。',
                /* 7 */ '此Email伺服器看來不能使用CoNET網絡通訊技术，請再測試一次或选择其他email服务供应商！',
                /* 8 */ 'email伺服器提示SMTP用戶名或密碼錯！',
                /* 9 */ '伺服器證書錯誤！您可能正在連接到一個仿冒的Email伺服器，如果您肯定這是您希望連接的伺服器，請在SMTP詳細設定中選擇忽略證書錯誤。',
                /* 10 */ 'SMTP連結提示未知錯誤',
                /* 11 */ '您已有相同的Email賬戶',
                /* 12 */ '您的系統還未連接到CoNET網絡！',
                /* 13 */ '您的郵箱提示您賬號已無可使用容量，請清理郵箱後再試',
                /* 14 */ '通訊遇到未知錯誤，請重試！',
            ],
            CoNET_requestError: [
                /* 0 */ 'CoNET無響應,正在重新建立CoNET通訊管道，請稍候！',
                /* 1 */ '無效操作！',
            ],
        },
        emailConform: {
            activeViewTitle: '驗證您的密鑰',
            emailTitle: '感謝您使用CoNET服務',
            info1_1: '您的密鑰還未完成驗證，請點擊按鈕[發送驗證Email]，並檢查您的【',
            info1_2: '】郵箱。如果存在多封CoNET的郵件時，請選擇最後一封信件。請打開信件並複制郵件內容。如果您還未收到CoNET的郵件，請檢查您的密鑰郵箱是否準確，或者您可以刪除您現有的密鑰，重新生成新的密鑰。',
            info2: '複制內容從“-----BEGIN PGP MESSAGE----- （ 開始，一直到 ）----- END PGP MESSAGE-----” 結束的完整內容，粘貼到此輸入框中',
            emailDetail1: '尊敬的 ',
            emailDetail1_1: '',
            reSendRequest: '發送驗證Email',
            requestReturn: [
                '錯誤！您的請求被拒絕，這可能是您在短時間內多次請求所致，請稍後再試',
                'CoNET系統已發送激活郵件！',
            ],
            emailDetail2: '這是您的CoNET帳號激活密碼，請複制下列框內的全部內容:',
            bottom1_1: '此致',
            bottom1_2: 'CoNET團隊',
            conformButtom: '驗 證',
            formatError: [
                '內容格式錯誤，請複制從“-----BEGIN PGP MESSAGE----- （開始，一直到）-----END PGP MESSAGE-----” 結束的完整內容，粘貼在此輸入框中。',
                '提供的內容不能被解密，請確認這是在您收到的最後一封從CoNET發送過來的激活信。如果還是沒法完成激活，請刪除您的密鑰重新生成和設定。',
                '和CoNET網絡連接發生錯誤，請退出重新嘗試！',
                '無效激活碼！如果存在多封CoNET的郵件時，請選擇最後一封信件。',
                '您的CoNET看上去有問題, 請刪除您的密鑰，重新設置您的CoNET！',
                'CoNET網絡系統無應答故障，可能暫時下線中，請稍後再試。 ',
                '您當天的數據通訊量達到上限，請等待明天再試或升級用戶類型',
                '用來通訊的Email設定有錯誤，請檢查IMAP設定後重試，或CoNET網絡不支持此Email類型',
                '您所選區域不能夠連結，請稍候再試',
                '您的IMAP郵箱發信發生錯誤。請退出CoNET重試。如果持續發生此故障，您的IMAP帳號有可能被鎖住，需要登陸您的IMAP郵箱網站解鎖操作。',
                '頁面會話已過期，請刷新頁面以繼續，或退出後重新啟動CoNET。',
                'CoNET平台故障，請重新啟動CoNET。',
            ],
            activeing: '正在通訊中',
        },
        QTGateRegion: {
            title: '高品質訂製代理伺服器區域',
            available: '服務中',
            speedTest: '代理伺服器速度測試',
            CoGateRegionStoped: '所訂製的代理伺服器已經被停止，如需使用請再次訂製.',
            unavailable: '準備中',
            proxyDomain: '域名解釋全程使用CoNET代理伺服器端',
            setupCardTitle: '使用連接技術:',
            paidUse: '本區域只對收費用戶開放',
            MultipleGateway: '同時併發使用代理數:',
            connectQTGate: '正在獲得代理伺服器區域信息...',
            dataTransfer: '數據通訊:',
            dataTransfer_datail: [
                '全程使用CoNET代理伺服器',
                '當不能夠到達目標時使用',
            ],
            proxyDataCache: '瀏覽數據本地緩存:',
            proxyDataCache_detail: ['本地緩存', '不緩存'],
            dataViaGateway: '全部互聯網數據通過CoNET代理伺服器',
            cacheDatePlaceholder: '緩存失效時間',
            requestPortNumber: '代理伺服器通訊連接埠',
            clearCache: '立即清除所有緩存',
            GlobalIp: '本機互聯網IP地址:',
            option: '高級設置',
            WebRTCleak: '阻止WebRTC漏洞',
            WebRTCleakInfo: '本設置後，瀏覽器的即時會話，端對點通訊等將不再工作。',
            pingError: '代理服務區域速度檢測錯誤發生，請退出CoNET，以管理員身份再次打開CoNET後，再執行速度檢測！',
            QTGateRegionERROR: [
                '發送連接請求Email到CoNET系統發生送信錯誤， 請檢查您的IMAP賬號的設定。 ',
                '',
            ],
            sendConnectRequestMail: [
                '客戶端未連結到CoNET網絡，已向CoNET重新發出聯網請求Email。這需要額外的時間，請耐心等待。',
                '當長時間未連結CoNET網絡，您的連接會被中斷。',
            ],
            GlobalIpInfo: '注意：當您按下【CoNET連結】時您會把您的本機互聯網IP提供給CoNET網絡，如果您不願意，請選擇【@OPN】技術來使用CoNET服務！沒有顯示【@OPN】選項是@OPN連結技術，只在洛杉磯區域，並只支持使用iCloud郵箱。',
            localPort: '本地代理伺服器連接埠:',
            cacheDatePlaceDate: [
                { name: '1小时', id: 1 },
                { name: '12小时', id: 12 },
                { name: '1日', id: 24 },
                { name: '15日', id: 360 },
                { name: '1月', id: 720 },
                { name: '6月', id: 4320 },
                { name: '永遠', id: -1 },
            ],
            atQTGateDetail: [
                /*0*/ '世界首创的CoNET无IP互联网通讯技术，全程使用強加密Email通訊，客户端和代理服务器彼此不用知道IP地址，具有超强隐身和保护隐私，超強防火牆穿透能力。缺点是有延遲，网络通讯响应受您所使用的email服务供应商的伺服器影响，不適合遊戲視頻會話等通訊。目前該技術只支持iCloud郵箱。',
                /*1*/ 'CoNET獨創HTTP明碼強加密混淆流量代理技術，能夠隱藏變換您的IP地址高速通訊，隐身和保护隐私，抗干擾超強防火牆穿透能力。缺點是需要使用您的IP來直接連結代理伺服器。如果您只是需要自由訪問互聯網，則推薦使用本技術。',
                /*2*/ '域名解釋使用CoNET代理伺服器端，可以防止域名伺服器緩存污染，本選擇不可修改。',
                /*3*/ '互聯網數據全程使用CoNET代理，可以匿名上網隱藏您的互聯網形踪。',
                /*4*/ '只有當本地網絡不能夠到達您希望訪問的目標時，才使用CoNET代為您連結目標伺服器，本選項可以加速網速，但無隱私。',
                /*5*/ '通過本地緩存瀏覽紀錄，當您再次訪問目標伺服器時可以增加訪問速度，減少網絡流量，緩存瀏覽記錄只針對非加密技術的HTTP瀏覽有效。CoNET使用強加密技術緩存瀏覽紀錄，確保您的隱私不被洩漏',
                /*6*/ '不保存緩存信息。',
                /*7*/ '設置緩存有效時間，您可以及時更新伺服器數據，單位為小時。',
                /*8*/ '本地Proxy服务器，其他手机电脑和IPad等可通過连结此端口來使用CoNET服务。請設定為3001至65535之間的數字',
                /*9*/ '通過設置PATH鏈接路徑可以簡單給您的Proxy伺服器增加安全性，拒絕沒有提供PATH的訪問者使用您的Proxy伺服器。',
                /*10*/ '同時使用多條代理線路數，可以有效降低大流量集中在一個代理服務線路，降低被網絡監控者發現的風險。此選項僅供收費會員使用。',
                /*11*/ '指定同CoNET代理進行通訊使用的連接埠，通過此設置可以規避您所在網段被通訊屏蔽的連接埠。',
                /*12*/ 'Web实时通讯(WebRTC)是客戶端的瀏覽器之間，通過IP地址直接高速通訊技術，有時被惡用洩漏您的真實IP地址。',
            ],
        },
        QTGateGateway: {
            title: 'CoNET服務使用詳細',
            promo: '促銷活動',
            processing: '正在嘗試连接CoNET網絡...',
            error: [
                '錯誤：您的賬號下已經有一個正在使用CoNET代理伺服器的連接，請先把它斷開後再嘗試連接。',
                '錯誤：您的賬號已經無可使用流量，如果您需要繼續使用CoNET代理伺服器，請升級您的賬戶類型。如果是免費用戶已經使用當天100M流量，請等待到明天繼續使用，如您是免費用戶已經用完當月1G流量，請等待到下月繼續使用。',
                '錯誤：數據錯誤，請退出並重新啟動CoNET！',
                '非常抱歉，您請求的代理區域無資源，請選擇其他區域或稍後再試',
                '對不起，您所請求連接的區域不支持這樣的連接技術，請換其他連接方法或選擇其他區域連接',
                '@OPN链接技术不支持公用iCloud邮箱，请撤換通訊用IMAP郵箱，換您自有的iCloud邮箱。',
            ],
            connected: '已連接。',
            upgrade: '升級賬號',
            accountManager: '賬號管理',
            userType: ['免費用戶', '付費用戶'],
            datatransferToday: '日流量限額：',
            datatransferMonth: '月流量限額：',
            todaysDatatransfer: '本日可使用流量',
            monthDatatransfer: '本月可使用流量',
            gatewayInfo: ['代理伺服器IP地址：', '代理伺服器連接端口：'],
            userInfoButton: '使用指南',
            stopGatewayButton: '停止所定制伺服器',
            disconnecting: '正在銷毀中...',
        },
        qtGateView: {
            title: '發送訂製請求',
            QTGateConnectResultWaiting: '已向CoNET網絡發送連接請求Email。由於是首次連接CoNET網絡，系統需要幾分鐘時間來完成與您的對接，請耐心等待。',
            mainImapAccount: 'CoNET網絡通訊用郵箱',
            QTGateDisconnectInfo: 'CoNET網絡已斷開。請選擇CoNET網絡通訊用IMAP帳號',
            QTGateConnectStatus: 'CoNET網絡連接狀態',
            QTGateConnectResult: [
                'CoNET網絡未連結，請點擊連接CoNET網絡',
                '正在連接CoNET網絡',
                '已經連接CoNET網絡',
                '連接連接CoNET網絡時發生錯誤，請修改IMAP賬號設定',
                '已經連接CoNET網絡',
            ],
            QTGateSign: [
                '您的密鑰狀態',
                '還未獲得CoNET網絡信任簽署,點擊完成信任簽署',
                '密钥获得CoNET網絡信任签署是一个重要步骤，您今后在CoNET網絡用户之间分享文件或传送秘密信息时，CoNET網絡可以證明是您本人而非其他冒充者。你也可以通过您的密钥签署信任给其他CoNET網絡用户，用以区别您自己的信任用户和非信任用户。',
                '正在獲得CoNET信任簽署中',
                '系統錯誤，請重啓CoNET後再試，如果仍然存在，請嘗試重新安裝CoNET。',
                'CoNET系統錯誤!',
            ],
        },
        feedBack: {
            title: '使用信息反饋',
            additional: '添附附加信息',
            okTitle: '發送至CoNET',
        },
    },
];
const linkClick = function (url) {
    return window.open(url, '_blank');
};
function cmpVersions(a, b) {
    let diff;
    const regExStrip0 = /(\.0+)+$/;
    const segmentsA = a.replace(regExStrip0, '').split('.');
    const segmentsB = b.replace(regExStrip0, '').split('.');
    const l = Math.min(segmentsA.length, segmentsB.length);
    for (let i = 0; i < l; i++) {
        diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
        if (diff) {
            return diff;
        }
    }
    return segmentsA.length - segmentsB.length;
}
function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
const QTGateRegionsSetup = [
    {
        title: '@OPN',
    },
    {
        title: 'iOPN',
    },
];
const _QTGateRegions = [
    {
        icon: 'india',
        content: ['班加罗尔', 'バンガロール', 'Bangalore', '班加羅爾'],
        meta: ['亚洲・印度', 'アジア・インド', 'India. Asia.', '亞洲・印度'],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'Asia.Bangalore',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'singapore',
        content: ['新加坡', 'シンガポール', 'Singapore', '新加坡'],
        meta: [
            '亚洲・新加坡',
            'アジア・シンガポール',
            'Singapore. Asia.',
            '亞洲・新加坡',
        ],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'singapore',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'japan',
        content: ['东京', '東京', 'Tokyo', '東京'],
        meta: ['亚洲・日本', 'アジア・日本', 'Japan. Asia.', '亞洲・日本'],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'tokyo',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'france',
        content: ['巴黎', 'パリ', 'Paris', '巴黎'],
        meta: [
            '欧洲・法国',
            'ヨーロッパ・フランス',
            'France. Europe.',
            '歐洲・法國',
        ],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'paris',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(true),
    },
    /*
    ,{
        icon: 'netherlands',
        content: ['阿姆斯特丹1','アムステルダム1','Amsterdam1','阿姆斯特丹1'],
        meta: ['欧洲・荷兰','ヨーロッパ・オランダ','Netherlands. Europe.','歐洲・荷蘭'],
        description: ['','','',''],
        canVoe: ko.observable(true),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable ( false ),
        showExtraContent: ko.observable ( false ),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'amsterdam1',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable ( false ),
        showConnectedArea: ko.observable ( false ),
        ping: ko.observable ( -2 ),
        downloadSpeed: ko.observable (-2)
    }
    */
    {
        icon: 'netherlands',
        content: ['阿姆斯特丹', 'アムステルダム', 'Amsterdam', '阿姆斯特丹'],
        meta: [
            '欧洲・荷兰',
            'ヨーロッパ・オランダ',
            'Netherlands. Europe.',
            '歐洲・荷蘭',
        ],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'amsterdam',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'germany',
        content: ['法兰克福', 'フランクフルト', 'Frankfurt', '法蘭克福'],
        meta: [
            '欧洲・德国',
            'ヨーロッパ・ドイツ',
            'Germany. Europe.',
            '歐洲・德國',
        ],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'frankfurt',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'united kingdom',
        content: ['爱尔兰', 'アイルランド', 'Ireland', '愛爾蘭'],
        meta: [
            '欧洲・英国',
            'ヨーロッパ・英国',
            'United Kingdom. Europe.',
            '歐洲・英國',
        ],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'Ireland',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'united kingdom',
        content: ['伦敦', 'ロンドン', 'London', '倫敦'],
        meta: [
            '欧洲・英国',
            'ヨーロッパ・英国',
            'United Kingdom. Europe.',
            '歐洲・英國',
        ],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'London',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'australia',
        content: ['悉尼', 'シドニー', 'Sydney', '悉尼'],
        meta: ['澳洲・澳大利亚', 'オーストラリア', 'Australia.', '澳洲・澳大利亚'],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'Sydney',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'united states',
        content: ['纽约', 'ニューヨーク', 'New York City', '紐約'],
        meta: [
            '北美洲东海岸・美国',
            '北アメリカ東海岸・アメリカ',
            'USA. North American Eastern.',
            '北美洲東海岸・美國',
        ],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'new-york-city',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'canada',
        content: ['多伦多', 'トロント', 'Toronto', '多倫多'],
        meta: [
            '北美洲东海岸・加拿大',
            '北アメリカ東海岸・カナダ',
            'Canada. North American Eastern.',
            '北美洲東海岸・加拿大',
        ],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'toronto',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'united states',
        content: ['旧金山', 'サンフランシスコ', 'San Francisco', '舊金山'],
        meta: [
            '北美洲西海岸・美国・旧金山',
            '北アメリカ西海岸・アメリカ',
            'USA. North American Western.',
            '北美洲西海岸・美國',
        ],
        description: ['', '', '', ''],
        canVoe: ko.observable(true),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'francisco',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'hong kong',
        content: ['香港', '香港', 'Hong Kong', '香港'],
        meta: ['亚洲・中国', 'アジア・中国', 'China. Asia.', '亞洲・中國'],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'HK',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'china',
        content: ['上海市', '上海市', 'Shanghai', '上海市'],
        meta: ['亚洲・中国', 'アジア・中国', 'China. Asia.', '亞洲・中國'],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'shanghai',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'china',
        content: ['北京市', '北京市', 'Beijing', '北京市'],
        meta: ['亚洲・中国', 'アジア・中国', 'China. Asia.', '亞洲・中國'],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'beijing',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
    {
        icon: 'china',
        content: ['无锡市', '無錫市', 'Wuxi', '無錫市'],
        meta: [
            '亚洲・中国江苏省',
            'アジア・中国江蘇省',
            'Jiangsu China. Asia.',
            '亞洲・中國江蘇省',
        ],
        description: ['', '', '', ''],
        canVoe: ko.observable(false),
        canVoH: ko.observable(true),
        available: ko.observable(false),
        selected: ko.observable(false),
        showExtraContent: ko.observable(false),
        QTGateRegionsSetup: QTGateRegionsSetup,
        qtRegion: 'Wuxi',
        error: ko.observable(-1),
        showRegionConnectProcessBar: ko.observable(false),
        showConnectedArea: ko.observable(false),
        ping: ko.observable(-2),
        downloadSpeed: ko.observable(-2),
        freeUser: ko.observable(false),
    },
];
const kloakSearchIcon_svg = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve">
	<style type="text/css">
		.ssrt0{fill:url(#SVG__ID_1_);}
		.ssrt1{fill:#eeeeee;}
		.ssrt2{fill:#ffffff;}
	</style>
	<defs>
		<filter id="cosearch_Filter3" x="-0.1" y="-0.1" width="200%" height="200%">
			<feDropShadow dx="-0.5" dy="0.5" stdDeviation="0.5" flood-color="#333" flood-opacity="0.9" />
		</filter>
	</defs>
	<g>
		<linearGradient id="SVG__ID_1_" gradientUnits="userSpaceOnUse" x1="-1.8575" y1="64.1664" x2="82.196" y2="15.6381">
			<stop  offset="1.299629e-02" style="stop-color:#558888"/>
			<stop  offset="1" style="stop-color:#458888"/>
		</linearGradient>
		<path class="ssrt0" d="M68.5,77.5h-57c-5,0-9-4-9-9v-57c0-5,4-9,9-9h57c5,0,9,4,9,9v57C77.5,73.5,73.5,77.5,68.5,77.5z" filter = "url(#cosearch_Filter3)"/>
		<g filter = "url(#cosearch_Filter3)" >
			<path class="ssrt1" d="M65.2,33.1C65.2,33.1,65.2,33.1,65.2,33.1H14.8c-0.5,0-0.9-0.3-1.1-0.8c-0.2-0.5,0-1,0.4-1.3l25.2-18.3
				c0.4-0.3,0.9-0.3,1.3,0l25,18.1c0.4,0.2,0.7,0.6,0.7,1C66.3,32.6,65.8,33.1,65.2,33.1z"/>
			<path class="ssrt1" d="M65.1,67.4H14.9c-0.6,0-1.1-0.5-1.1-1.1v-4.6c0-0.6,0.5-1.1,1.1-1.1h50.2c0.6,0,1.1,0.5,1.1,1.1v4.6
				C66.3,66.9,65.8,67.4,65.1,67.4z"/>
			<path class="ssrt1" d="M24,58.3h-6.9c-0.6,0-1.1-0.5-1.1-1.1V36.6c0-0.6,0.5-1.1,1.1-1.1H24c0.6,0,1.1,0.5,1.1,1.1v20.6
				C25.2,57.8,24.7,58.3,24,58.3z"/>
			<path class="ssrt1" d="M62.9,58.3H56c-0.6,0-1.1-0.5-1.1-1.1V36.6c0-0.6,0.5-1.1,1.1-1.1h6.9c0.6,0,1.1,0.5,1.1,1.1v20.6
				C64,57.8,63.5,58.3,62.9,58.3z"/>
			<path class="ssrt2" d="M34.3,54.4c2.2,0,4.2,0.5,5.7,1.3c1.6-0.8,3.6-1.3,5.8-1.3c1.7,0,3.3,0.3,4.6,0.8V38.3
				c-1-0.5-2.6-0.8-4.3-0.8c-2,0-3.8,0.4-4.8,1v10.6c0,0.6-0.5,1.1-1.1,1.1c-0.6,0-1.1-0.5-1.1-1.1V38.5c-1-0.6-2.8-1-4.8-1
				c-1.8,0-3.4,0.3-4.3,0.8v16.9C31,54.7,32.6,54.4,34.3,54.4z"/>
		</g>
	</g>
</svg>

`;
const canadaGov = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve">
<style type="text/css">
	.st00100010{fill:url(#SVGID_111000_);}
	.st10001000{fill:#FF0000;}
</style>

	<linearGradient id="SVGID_111000_" gradientUnits="userSpaceOnUse" x1="5.8656" y1="74.1344" x2="73.6577" y2="6.3423">
		<stop  offset="0" style="stop-color:#FFFFFF;stop-opacity:0.7"/>
		<stop  offset="0.3231" style="stop-color:#EEEEEE"/>
		<stop  offset="0.5072" style="stop-color:#F6F6F6"/>
		<stop  offset="0.8407" style="stop-color:#FFFFFF"/>
	</linearGradient>
	<path class="st00100010" d="M68.5,77.5h-57c-5,0-9-4-9-9v-57c0-5,4-9,9-9h57c5,0,9,4,9,9v57C77.5,73.5,73.5,77.5,68.5,77.5z" filter = "url(#cosearch_Filter3)"/>
<g transform="translate(-1, -1)" filter = "url(#cosearch_Filter3)">
	<path class="st10001000" d="M67.4,50.6h2.1v4.3h-2.1V50.6z M63.7,52.8l-0.1,0c0,0,0.7,0.6,0.7,0.7c0,0,0.1,0,0,0.2c0,0.1-0.1,0.2-0.1,0.2
		s0.7-0.1,0.7-0.2c0.1,0,0.1,0,0.1,0.1c0,0.1,0,0.8,0,0.8h0.2c0,0,0-0.7,0-0.8c0-0.1,0-0.1,0.1-0.1c0.1,0,0.7,0.2,0.7,0.2
		s0-0.2-0.1-0.2c0-0.1,0-0.1,0-0.2s0.7-0.7,0.7-0.7l-0.1,0c-0.1,0,0-0.1,0-0.1c0,0,0.1-0.5,0.1-0.5s-0.3,0.1-0.4,0.1
		c0,0-0.1,0-0.1,0c0,0-0.1-0.2-0.1-0.2s-0.4,0.4-0.4,0.5c-0.1,0.1-0.2,0-0.1-0.1c0-0.1,0.2-0.9,0.2-0.9s-0.2,0.1-0.3,0.2
		c-0.1,0-0.1,0-0.1,0c0-0.1-0.3-0.5-0.3-0.6c0,0-0.2,0.5-0.3,0.6c0,0.1-0.1,0.1-0.1,0c-0.1,0-0.3-0.2-0.3-0.2s0.2,0.9,0.2,0.9
		s0,0.1-0.1,0.1L64.2,52c0,0,0,0.1-0.1,0.2c0,0,0,0.1-0.1,0c-0.1,0-0.4-0.1-0.4-0.1s0.1,0.4,0.2,0.5C63.8,52.6,63.8,52.7,63.7,52.8z
		 M61,50.6h2.1v4.3H61V50.6z"/>
	<path class="st10001000" d="M70,63.4c-0.2,0.4-0.5,0.5-0.7,0.5c-0.2,0-1,0-1-2c0,0,0-3.9,0-4.1c0-1.3-1-2.3-3.5-2.3
		c-2.7,0-2.8,1.4-2.8,1.7c0,0.4,0.2,0.8,0.9,0.8c0.6,0,0.8-0.7,0.9-0.9c0.1-0.3,0.1-1.1,1.2-1.1c0.9,0,1.5,0.8,1.6,2
		c0,0.2,0,0.3,0,0.5c0,0.1,0,0.1,0,0.2l0,0l0,0v0c-0.1,0.4-0.3,0.6-0.7,0.8c-0.5,0.2-1.9,0.5-2.1,0.5c-0.6,0.1-2.2,0.5-2.1,2.2
		c0,1.6,1.7,2.2,2.8,2.2c1.1,0,1.8-0.5,2.1-0.7c0.2-0.1,0.2-0.1,0.3,0c0.2,0.2,0.7,0.7,2,0.7c1.3,0,1.5-0.6,1.6-0.8
		C70.4,63.3,70.1,63.2,70,63.4z M64.9,63.9c-1.1,0-1.4-0.9-1.4-1.4c0-0.5,0.2-1.4,1.4-2.1c0,0,0.5-0.3,1.6-0.7c0,0,0.1,0,0.1,0
		s0,0,0,0.1l0,0l0,0v0l0,0l0,0v0l0,0l0,0l0,0v1.7C66.5,62.9,65.9,63.9,64.9,63.9z M61.1,63.8c-0.2,0-1.2,0.1-1.2-3s0-9.8,0-9.8
		c0-0.1,0-0.5-0.4-0.5c-0.4,0-2.8,0.1-3,0.2c-0.2,0-0.3,0.2,0,0.2c0.3,0,1.6,0.1,1.6,2.3c0,1.1,0,2.1,0,2.9c0,0,0,0.1,0,0.1
		c0,0.1,0,0.1,0,0.2c0,0,0,0,0,0l0,0c0,0-0.1,0-0.2-0.1c-0.2-0.2-1.1-0.7-2.3-0.7c-1.9,0-4.3,1.4-4.3,4.3c0,3.1,2.2,4.6,4.4,4.6
		c1.1,0,1.9-0.5,2.2-0.7c0.3-0.2,0.3-0.2,0.3,0.1c0,0.2,0,0.6,0.6,0.6c0.6-0.1,2.1-0.2,2.4-0.3C61.4,64,61.4,63.9,61.1,63.8z M56,64
		c-1.8,0-2.7-2.1-2.7-4.2c0-2.3,1.3-3.8,2.6-3.7c1.8,0.1,2.2,1.5,2.3,4c0,0.2,0,0.3,0,0.5C58.1,63.1,57.1,64,56,64z M51.2,63.4
		c-0.2,0.4-0.5,0.5-0.7,0.5c-0.2,0-1,0-1-2c0,0,0-3.9,0-4.1c0-1.3-1-2.3-3.5-2.3c-2.7,0-2.8,1.4-2.8,1.7c0,0.4,0.2,0.8,0.9,0.8
		c0.6,0,0.8-0.7,0.9-0.9c0.1-0.3,0.1-1.1,1.2-1.1c0.9,0,1.6,0.8,1.6,2.1v0c0,0,0,0.1,0,0.1v0.1c0,0,0,0.1,0,0.2
		c0,0.6-0.2,0.8-0.7,1.1c-0.5,0.2-1.9,0.5-2.1,0.5c-0.6,0.1-2.2,0.5-2.1,2.2c0,1.6,1.7,2.2,2.8,2.2c1.1,0,1.8-0.5,2.1-0.7
		c0.2-0.1,0.2-0.1,0.3,0c0.2,0.2,0.7,0.7,2,0.7c1.3,0,1.5-0.6,1.6-0.8C51.6,63.3,51.4,63.2,51.2,63.4z M46.1,63.9
		c-1.1,0-1.4-0.9-1.4-1.4c0-0.5,0.2-1.4,1.4-2.1c0,0,0.5-0.3,1.6-0.7c0,0,0.1,0,0.1,0v0l0,0l0,0c0,0,0,0.1,0,0.2v0c0,0,0,0,0,0v1.7
		C47.7,62.9,47.1,63.9,46.1,63.9z M42.2,63.8c-0.3-0.1-0.9-0.5-0.9-2.3v-3.3c0-0.8,0.1-2.8-3-2.8c-1.6,0-2.5,0.8-2.6,0.9
		c-0.1,0.1-0.2,0.2-0.2,0c0-0.2-0.1-0.4-0.2-0.6c0-0.1-0.1-0.2-0.4-0.2c-0.3,0-2.1,0.3-2.4,0.4c-0.3,0.1-0.2,0.2,0,0.2
		c0.2,0,1.2,0.1,1.2,1.8s0,3.5,0,3.5c0,2.1-0.4,2.2-0.8,2.3c-0.5,0.1-0.2,0.3,0,0.3c0,0,3.7,0,3.7,0c0.2,0,0.4-0.2-0.1-0.3
		s-0.9-0.4-0.9-2c0-0.2,0-1.9,0-2.3c0-0.9-0.2-3.5,2.2-3.5c1.7,0,1.8,1.4,1.8,2.3v3.5c0,1.4-0.4,1.9-0.9,2c-0.5,0.1-0.4,0.3-0.1,0.3
		c0.1,0,3.8,0,3.8,0C42.5,64.2,42.7,64,42.2,63.8z M32.2,63.4c-0.2,0.4-0.5,0.5-0.7,0.5c-0.2,0-1,0-1-2c0,0,0-3.9,0-4.1
		c0-1.3-1-2.3-3.5-2.3c-2.7,0-2.8,1.4-2.8,1.7c0,0.4,0.2,0.8,0.9,0.8c0.6,0,0.8-0.7,0.9-0.9c0.1-0.3,0.1-1.1,1.2-1.1
		c0.9,0,1.5,0.8,1.6,2c0,0.2,0,0.3,0,0.5c0,0.1,0,0.2,0,0.2v0l0,0c-0.1,0.4-0.3,0.6-0.7,0.8c-0.5,0.2-1.9,0.5-2.1,0.5
		c-0.6,0.1-2.2,0.5-2.1,2.2c0,1.6,1.7,2.2,2.8,2.2c1.1,0,1.8-0.5,2.1-0.7c0.2-0.1,0.2-0.1,0.3,0c0.2,0.2,0.7,0.7,2,0.7
		c1.3,0,1.5-0.6,1.6-0.8C32.6,63.3,32.3,63.2,32.2,63.4z M27.1,63.9c-1.1,0-1.4-0.9-1.4-1.4c0-0.5,0.2-1.4,1.4-2.1
		c0,0,0.5-0.3,1.6-0.7c0,0,0.1,0,0.1,0s0,0,0,0.1l0,0l0,0l0,0c0,0,0,0,0,0.1l0,0l0,0v0l0,0l0,0l0,0v1.7
		C28.8,62.9,28.1,63.9,27.1,63.9z M23.2,60.3c-0.4,1.3-1.2,3.4-4,3.5c-3,0-4.7-2-4.8-5.7c-0.1-4,1.6-7,4.3-7.1c3,0,4.1,3.5,4.1,4.1
		c0,0.4,0.6,0.4,0.6,0c0-0.2-0.2-3.7-0.3-4.1c-0.1-0.4-0.4-0.2-0.5-0.1c0,0.1,0-0.1-0.1,0.2c-0.2,0.4-0.6,0.2-0.8,0.1
		c-0.5-0.2-1.4-0.7-3-0.7c-3.5,0.1-7.1,2.7-7,7.2c0.1,4.4,3.6,6.8,6.9,6.8c3,0,4.7-1.9,5.2-4.1C23.9,59.9,23.3,59.8,23.2,60.3z"/>
	<path class="st10001000" d="M54.7,19.1h13.6v27.2H54.7V19.1z M31.2,32.7l-0.8,0.3c0,0,4.7,3.9,4.7,4.2c0.3,0.3,0.5,0.3,0.3,1
		c-0.3,0.8-0.5,1.6-0.5,1.6s4.2-0.8,4.7-1c0.5,0,0.8,0,0.8,0.5s-0.3,5-0.3,5h1.3c0,0-0.3-4.7-0.3-5c0-0.5,0.3-0.5,0.8-0.5
		c0.5,0,4.7,1,4.7,1s-0.3-1-0.5-1.6c-0.3-0.8,0-0.8,0.3-1c0.3-0.3,4.7-4.2,4.7-4.2l-0.8-0.3c-0.5-0.3-0.3-0.5-0.3-0.8
		c0-0.3,0.8-2.9,0.8-2.9s-2.1,0.5-2.4,0.5c-0.3,0-0.5,0-0.5-0.3c0-0.3-0.5-1.3-0.5-1.3s-2.4,2.6-2.6,2.9c-0.5,0.5-1,0-0.8-0.5
		c0-0.5,1.3-6,1.3-6s-1.3,0.8-1.8,1c-0.5,0.3-0.8,0.3-0.8-0.3c-0.3-0.5-1.8-3.4-1.8-3.7c0,0-1.6,3.1-1.8,3.7
		c-0.3,0.5-0.5,0.5-0.8,0.3c-0.5-0.3-1.8-1-1.8-1s1.3,5.5,1.3,6c0,0.5-0.3,0.8-0.8,0.5l-2.6-2.9c0,0-0.3,0.8-0.5,1
		c0,0.3-0.3,0.5-0.5,0.3c-0.5,0-2.6-0.5-2.6-0.5s0.8,2.6,1,2.9C31.7,31.9,31.7,32.4,31.2,32.7z M13.7,19.1h13.6v27.2H13.7V19.1z"/>
</g>
</svg>

`;
const KloakFortress = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve">
<style type="text/css">
	.st0_0_0_0{fill:url(#SVGID_1_1_1_1);}
	.st1_1_1_1{fill-rule:evenodd;clip-rule:evenodd;fill:#FFFFFF;}
</style>
<g>
	<linearGradient id="SVGID_1_1_1_1" gradientUnits="userSpaceOnUse" x1="4.0144" y1="75.9856" x2="75.0832" y2="4.9168">
		<stop  offset="0" style="stop-color:#6D6E71"/>
		<stop  offset="0.1012" style="stop-color:#909193"/>
		<stop  offset="0.2148" style="stop-color:#B0B1B3"/>
		<stop  offset="0.3101" style="stop-color:#C4C5C7"/>
		<stop  offset="0.3748" style="stop-color:#CBCCCE"/>
		<stop  offset="0.3852" style="stop-color:#C9CACC"/>
		<stop  offset="0.5041" style="stop-color:#B3B4B7"/>
		<stop  offset="0.6339" style="stop-color:#A3A5A8"/>
		<stop  offset="0.7827" style="stop-color:#9A9C9F"/>
		<stop  offset="0.9912" style="stop-color:#97999C"/>
	</linearGradient>
	<path class="st0_0_0_0" d="M68.5,77.5h-57c-5,0-9-4-9-9v-57c0-5,4-9,9-9h57c5,0,9,4,9,9v57C77.5,73.5,73.5,77.5,68.5,77.5z" filter = "url(#cosearch_Filter3)" />
	<g filter = "url(#cosearch_Filter3)" >
		<path class="st1_1_1_1" d="M24.3,42.1v-2.8h1.8v-7h-1.8v-1.5l-4.6-6.5v-2.3c2.7-2.2,4.7,1.1,7.4-1.3c-2.9,1.5-4.6-2.7-7.4-1.5v-0.2H19
			v5.2l-4.5,6.5v1.5h-1.8v7h1.8v2.8H24.3z"/>
		<path class="st1_1_1_1" d="M64.6,30.8L60,24.4v-2.3c2.7-2.2,4.7,1.1,7.4-1.3c-2.9,1.5-4.6-2.7-7.4-1.5v-0.2h-0.7v5.2l-4.5,6.5v1.5h-1.9
			v7h1.9v2.8h9.8v-2.8h1.8v-7h-1.8V30.8z"/>
		<path class="st1_1_1_1" d="M35,35.1h9.8v-2.8h1.9v-7h-1.9v-1.5l-4.6-6.5v-2.3c2.7-2.2,4.7,1.1,7.4-1.2c-2.9,1.4-4.6-2.8-7.4-1.5v-0.3
			h-0.7v5.4L35,23.9v1.5h-1.8v7H35V35.1z"/>
		<path class="st1_1_1_1" d="M56,49.1H45.4V36.5H34.6v12.6H23v-5.7h-7.4v21.9c15.9,0,31.8,0,47.7,0V43.4H56V49.1z M25.9,62.4h-5.4v-6.1
			c0-3,5.4-3,5.4,0V62.4z M42.7,62.4h-5.4v-6.1c0-3,5.4-3,5.4,0V62.4z M59.5,56.3v6.1h-5.4v-6.1C54.1,53.3,59.5,53.3,59.5,56.3z"/>
	</g>
</g>
</svg>

`;
const Kloak_youtube = `
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 24.3.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve">
<style type="text/css">
	.st0__2__2{fill:url(#SVGID_1_0_1_0);}
	.st1__1__1{fill:#FFFFFF;}
</style>
<g>
	<linearGradient id="SVGID_1_0_1_0" gradientUnits="userSpaceOnUse" x1="-1.31" y1="63.9666" x2="81.7128" y2="16.0334">
		<stop  offset="0" style="stop-color:#FF0000"/>
		<stop  offset="1" style="stop-color:#FF5555"/>
	</linearGradient>
	<path class="st0__2__2" d="M68.7,77.5h-57c-5,0-9-4-9-9v-57c0-5,4-9,9-9h57c5,0,9,4,9,9v57C77.7,73.5,73.7,77.5,68.7,77.5z" filter = "url(#cosearch_Filter3)" />
	<g filter = "url(#cosearch_Filter3)" >
		<path class="st1__1__1" d="M65.3,27.8c-0.6-2.7-2.9-4.8-5.6-5.1c-6.4-0.7-13-1.2-19.4-1.2c-6.5,0-13,0.4-19.4,1.2
			c-2.7,0.3-5,2.3-5.6,5.1c-0.9,3.9-0.9,8.2-0.9,12.2c0,4,0,8.3,0.9,12.2c0.6,2.7,2.9,4.8,5.6,5.1c6.4,0.7,13,1.2,19.4,1.2
			c6.5,0,13-0.4,19.4-1.2c2.7-0.3,5-2.3,5.6-5.1c0.9-3.9,0.9-8.2,0.9-12.2S66.2,31.7,65.3,27.8 M49.1,41.2l-12.2,6.6
			c-1.2,0.7-2.2,0.1-2.2-1.3v-13c0-1.4,1-2,2.2-1.3l12.2,6.6C50.3,39.5,50.3,40.5,49.1,41.2"/>
	</g>
</g>
</svg>

`;
const Kloak_twitter = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve">
<style type="text/css">
	.sst0{fill:url(#SV_GID_1_);}
	.sst1{fill:none;stroke:#FFFFFF;stroke-width:2;stroke-miterlimit:10;}
	.sst2{fill:#C2E8FF;}
</style>
<defs>
    <filter id="ff33" x="-0.1" y="-0.1" width="200%" height="200%">
	  	<feDropShadow dx="-0.5" dy="0.5" stdDeviation="0.5" flood-color="#333" flood-opacity="0.9" />
    </filter>
</defs>
<g>
	<linearGradient id="SV_GID_1_" gradientUnits="userSpaceOnUse" x1="74.864" y1="5.136" x2="5.136" y2="74.864">
		<stop  offset="0" style="stop-color:#67BFF6"/>
		<stop  offset="1" style="stop-color:#1DA1F2"/>
	</linearGradient>
	<path class="sst0" d="M68.5,77.5h-57c-5,0-9-4-9-9v-57c0-5,4-9,9-9h57c5,0,9,4,9,9v57C77.5,73.5,73.5,77.5,68.5,77.5z" filter = "url(#ff33)"/>
</g>
<path class="sst1" d="M61.5,14.8c10.6,6.8,0,50.3,0,50.3" />
<path class="sst1" d="M52.1,14.8c23.4,12.3,0,50.3,0,50.3"/>
<path class="sst2" d="M37.4,58.9c-4.7,0-9.3-1.1-13.5-3.3c4.9-0.1,9.5-1.7,13.3-4.7l1.5-1.2l-1.9,0c-3.9-0.1-7.3-2.4-8.9-5.9
	c0.3,0,0.6,0,1,0c1,0,2-0.1,3-0.4l2.8-0.8L31.9,42c-4.3-0.9-7.5-4.5-7.9-8.8c1.3,0.5,2.7,0.9,4.1,0.9l2.4,0.1l-2-1.3
	c-2.8-1.9-4.4-5-4.4-8.3c0-1.4,0.3-2.9,0.9-4.2c5.5,6.4,13.4,10.2,21.7,10.6l0.9,0l-0.2-0.9c-0.2-0.7-0.3-1.5-0.3-2.3
	c0-5.5,4.5-10,9.9-10c2.7,0,5.4,1.2,7.3,3.2l0.3,0.3l0.4-0.1c1.8-0.4,3.6-0.9,5.2-1.8c-0.8,1.6-2,2.9-3.5,3.8L66,23.6l0.5,1l0.5,0
	c1.3-0.2,2.6-0.5,3.9-0.9c-1.1,1.3-2.4,2.5-3.7,3.5l-0.3,0.2l0,0.4c0,0.4,0,0.9,0,1.4c0,7.2-2.8,14.5-7.6,20.1
	C55.5,53.6,48.5,58.9,37.4,58.9z" filter = "url(#ff33)" />
<g>
	<line class="sst1" x1="14.5" y1="15" x2="14.5" y2="65.2"/>
	<path class="sst1" d="M23.9,15c-9.4,10.4,0,50.3,0,50.3"/>
	<path class="sst1" d="M33.3,14.8C14.5,35,33.3,65,33.3,65"/>
	<path class="sst1" d="M42.7,14.8c-25.8,12.7,0,50.3,0,50.3"/>
</g>
</svg>

`;
const Kloak_encrypted = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve">
<style type="text/css">
	.sttt0{fill:url(#SVGID__1_);}
	.sttt1{fill:#FFFFFF;}
</style>
<g>
	<g>
		<g transform="translate(0,-952.36218)">
			<linearGradient id="SVGID__1_" gradientUnits="userSpaceOnUse" x1="74.938" y1="957.7485" x2="5.2101" y2="1027.4764">
				<stop  offset="0" style="stop-color:#ED9798"/>
				<stop  offset="1" style="stop-color:#EB5556"/>
			</linearGradient>
			<path class="sttt0" d="M68.6,1030.1h-57c-5,0-9-4-9-9v-57c0-5,4-9,9-9h57c5,0,9,4,9,9v57C77.6,1026.1,73.5,1030.1,68.6,1030.1z" filter = "url(#ff33)" />
			<g transform="translate(-254.16013,-111.35431)">
				<path class="sttt1" d="M308.2,1087.5c-0.2,0-0.3,0.1-0.3,0.3v28.1c0,0.2,0.1,0.3,0.3,0.3h19.3h0c0,0,0.1,0,0.1,0
					c0,0,0.1,0,0.1-0.1c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0-0.1c0,0,0,0,0,0c0,0,0,0,0-0.1c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0-0.1
					l0-22.2c0,0,0-0.1,0-0.1c0-0.1,0-0.2-0.1-0.2l-5.6-5.7c-0.1-0.1-0.2-0.1-0.3-0.1c0,0,0,0-0.1,0L308.2,1087.5L308.2,1087.5z
					 M322.3,1088.6l4.5,4.5h-3.7h-0.8V1088.6z M311.2,1092.2C311.2,1092.2,311.2,1092.2,311.2,1092.2
					C311.2,1092.2,311.3,1092.2,311.2,1092.2h8.7c0.2,0,0.3,0.1,0.3,0.3c0,0.2-0.1,0.3-0.3,0.3c0,0,0,0,0,0h-8.6
					c-0.2,0-0.3-0.1-0.4-0.3C310.9,1092.4,311,1092.3,311.2,1092.2L311.2,1092.2z M311.2,1095.2
					C311.2,1095.2,311.2,1095.2,311.2,1095.2C311.2,1095.2,311.2,1095.2,311.2,1095.2h13.4c0.2,0,0.3,0.1,0.3,0.3
					c0,0.2-0.1,0.3-0.3,0.3c0,0,0,0,0,0h-13.3c-0.2,0-0.4-0.1-0.4-0.3C310.9,1095.4,311,1095.3,311.2,1095.2L311.2,1095.2z
					 M311.2,1098.4C311.2,1098.4,311.2,1098.4,311.2,1098.4C311.2,1098.4,311.3,1098.4,311.2,1098.4h13.4c0.2,0,0.3,0.1,0.3,0.3
					s-0.1,0.3-0.3,0.3c0,0,0,0,0,0h-13.3c-0.2,0-0.3-0.1-0.4-0.3C310.9,1098.6,311,1098.4,311.2,1098.4L311.2,1098.4L311.2,1098.4z
					 M311.2,1101.6C311.2,1101.6,311.2,1101.6,311.2,1101.6C311.2,1101.6,311.3,1101.6,311.2,1101.6h13.4c0.2,0,0.3,0.1,0.3,0.3
					s-0.1,0.3-0.3,0.3c0,0,0,0,0,0h-13.3c-0.2,0-0.3-0.1-0.4-0.3S311,1101.7,311.2,1101.6L311.2,1101.6z M311.2,1104.8
					C311.2,1104.8,311.2,1104.8,311.2,1104.8C311.2,1104.8,311.2,1104.8,311.2,1104.8h13.4c0.2,0,0.3,0.1,0.3,0.3
					c0,0.2-0.1,0.3-0.3,0.3c0,0,0,0,0,0h-13.3c-0.2,0-0.4-0.1-0.4-0.3C310.9,1105,311,1104.9,311.2,1104.8L311.2,1104.8z
					 M311.2,1108.3C311.2,1108.3,311.2,1108.3,311.2,1108.3C311.2,1108.3,311.2,1108.3,311.2,1108.3h13.4c0.2,0,0.3,0.1,0.3,0.3
					c0,0.2-0.1,0.3-0.3,0.3c0,0,0,0,0,0h-13.3c-0.2,0-0.4-0.1-0.4-0.3S311,1108.3,311.2,1108.3L311.2,1108.3z M311.2,1111.6
					C311.2,1111.6,311.3,1111.6,311.2,1111.6h13.3c0.2,0,0.3,0.1,0.3,0.3c0,0.2-0.1,0.3-0.3,0.3c0,0,0,0,0,0h-13.3
					c-0.2,0-0.3-0.1-0.3-0.3C310.9,1111.7,311,1111.6,311.2,1111.6z"/>
			</g>
		</g>
		<path class="sttt1" d="M48.2,38.1L44,33.9c-0.1-0.1-0.3-0.2-0.5-0.1c-0.2,0.1-0.3,0.2-0.3,0.4v2h-3.2c-0.2,0-0.4,0.2-0.4,0.4
			s0.2,0.4,0.4,0.4h3.6c0.2,0,0.4-0.2,0.4-0.4v-1.4l3.2,3.2l-3.2,3.2v-1.4c0-0.2-0.2-0.4-0.4-0.4h-6.9c0-0.2,0-0.5,0-0.8v-1.2
			c0-0.2-0.1-0.3-0.3-0.4c-0.2-0.1-0.3,0-0.5,0.1l-4.2,4.2c-0.2,0.2-0.2,0.4,0,0.6l4.2,4.2c0.1,0.1,0.2,0.1,0.3,0.1
			c0.1,0,0.1,0,0.2,0c0.2-0.1,0.3-0.2,0.3-0.4v-2h3.2c0.2,0,0.4-0.2,0.4-0.4s-0.2-0.4-0.4-0.4h-3.6c-0.2,0-0.4,0.2-0.4,0.4
			c0,0,0,0,0,0c0,0,0,0.8,0,1.4l-3.2-3.2l3.2-3.2c0,0.6,0,1.3,0,1.4c0,0,0,0.1,0,0.1c0,0.2,0.2,0.3,0.4,0.3h6.9v2
			c0,0.2,0.1,0.3,0.3,0.4c0.2,0.1,0.3,0,0.5-0.1l4.2-4.2C48.4,38.6,48.4,38.3,48.2,38.1z"/>
	</g>
	<g>
		<path class="sttt1" d="M29.8,45.7h-0.4v-3.2c0-1.8-1.1-3.2-2.4-3.2c-0.3,0-0.6,0.1-0.8,0.2V26.7c0-1.5-0.9-2.7-2-2.7H8.9
			c-1.1,0-2,1.2-2,2.7v21.7c0,1.5,0.9,2.7,2,2.7h14v3.8c0,0.9,0.5,1.6,1.2,1.6h5.6c0.7,0,1.2-0.7,1.2-1.6v-7.6
			C31,46.4,30.4,45.7,29.8,45.7z M28.6,42.4v3.2h-3.2v-3.2c0-0.1,0-0.3,0-0.4c0,0,0,0,0-0.1c0.2-1.2,1.1-1.9,1.9-1.6
			C28.1,40.5,28.6,41.4,28.6,42.4z M8.9,50c-0.7,0-1.2-0.7-1.2-1.6V26.7c0-0.9,0.5-1.6,1.2-1.6h15.3c0.7,0,1.2,0.7,1.2,1.6V40
			c0,0-0.1,0.1-0.1,0.1c-0.3,0.4-0.6,1-0.6,1.6c0,0,0,0,0,0c0,0.1,0,0.2,0,0.3c0,0,0,0,0,0.1c0,0.1,0,0.2,0,0.3v3.2h-0.4
			c-0.7,0-1.2,0.7-1.2,1.6V50H8.9z M30.2,54.9c0,0.3-0.2,0.5-0.4,0.5h-5.6c-0.2,0-0.4-0.2-0.4-0.5v-7.6c0-0.3,0.2-0.5,0.4-0.5h5.6
			c0.2,0,0.4,0.2,0.4,0.5V54.9z"/>
		<path class="sttt1" d="M27,47.8c-0.9,0-1.6,1-1.6,2.2c0,1,0.5,1.8,1.2,2.1v1.7c0,0.3,0.2,0.5,0.4,0.5c0.2,0,0.4-0.2,0.4-0.5v-1.7
			c0.9-0.3,1.4-1.5,1.2-2.6C28.3,48.5,27.7,47.8,27,47.8z M27,51.1c-0.4,0-0.8-0.5-0.8-1.1s0.4-1.1,0.8-1.1s0.8,0.5,0.8,1.1
			S27.4,51.1,27,51.1z"/>
		<path class="sttt1" d="M11.9,34.3c-0.8,0-1.4,0.8-1.4,1.9l0,0v2.7c0,1,0.6,1.9,1.4,1.9s1.4-0.8,1.4-1.9v-2.7
			C13.3,35.1,12.7,34.3,11.9,34.3L11.9,34.3z M12.5,38.9c0,0.4-0.3,0.8-0.6,0.8s-0.6-0.4-0.6-0.8l0,0v-2.7c0-0.4,0.3-0.8,0.6-0.8
			s0.6,0.4,0.6,0.8V38.9z"/>
		<path class="sttt1" d="M15.5,26.7c-0.8,0-1.4,0.8-1.4,1.9v2.7c0,1,0.6,1.9,1.4,1.9c0.8,0,1.4-0.8,1.4-1.9v-2.7
			C16.9,27.6,16.3,26.7,15.5,26.7z M16.1,31.3c0,0.4-0.3,0.8-0.6,0.8c-0.3,0-0.6-0.4-0.6-0.8v-2.7c0-0.4,0.3-0.8,0.6-0.8
			c0.3,0,0.6,0.4,0.6,0.8V31.3z"/>
		<path class="sttt1" d="M11.9,26.7c-0.8,0-1.4,0.8-1.4,1.9v2.7c0,1,0.6,1.9,1.4,1.9s1.4-0.8,1.4-1.9v-2.7
			C13.3,27.6,12.7,26.7,11.9,26.7z M12.5,31.3c0,0.4-0.3,0.8-0.6,0.8s-0.6-0.4-0.6-0.8v-2.7c0-0.4,0.3-0.8,0.6-0.8s0.6,0.4,0.6,0.8
			V31.3z"/>
		<path class="sttt1" d="M23.8,38.9v-2.7c0-1-0.6-1.9-1.4-1.9S21,35.1,21,36.2l0,0v2.7c0,1,0.6,1.9,1.4,1.9S23.8,39.9,23.8,38.9z
			 M23,38.9c0,0.4-0.3,0.8-0.6,0.8s-0.6-0.4-0.6-0.8l0,0v-2.7c0-0.4,0.3-0.8,0.6-0.8s0.6,0.4,0.6,0.8V38.9z"/>
		<path class="sttt1" d="M16.5,39.7h-0.4v-4.9c0-0.3-0.2-0.5-0.4-0.5c-0.1,0-0.2,0.1-0.3,0.2l-0.8,1.1c-0.2,0.2-0.1,0.6,0,0.8
			c0.2,0.2,0.4,0.2,0.6,0l0.1-0.2v3.6h-0.4c-0.2,0-0.4,0.2-0.4,0.5s0.2,0.5,0.4,0.5h1.6c0.2,0,0.4-0.2,0.4-0.5S16.8,39.7,16.5,39.7z
			"/>
		<path class="sttt1" d="M19.8,32.1h-0.4v-4.9c0-0.3-0.2-0.5-0.4-0.5c-0.1,0-0.2,0.1-0.3,0.2L17.9,28c-0.2,0.2-0.1,0.6,0,0.8
			c0.2,0.2,0.4,0.2,0.6,0l0.1-0.2v3.6h-0.4c-0.2,0-0.4,0.2-0.4,0.5s0.2,0.5,0.4,0.5h1.6c0.2,0,0.4-0.2,0.4-0.5S20,32.1,19.8,32.1z"
			/>
		<path class="sttt1" d="M21.4,32.1c-0.2,0-0.4,0.2-0.4,0.5s0.2,0.5,0.4,0.5H23c0.2,0,0.4-0.2,0.4-0.5s-0.2-0.5-0.4-0.5h-0.4v-4.9
			c0-0.3-0.2-0.5-0.4-0.5c-0.1,0-0.2,0.1-0.3,0.2L21.1,28c-0.2,0.2-0.1,0.6,0,0.8c0.2,0.2,0.4,0.2,0.6,0l0.1-0.2v3.6H21.4z"/>
		<path class="sttt1" d="M15.5,41.9c-0.8,0-1.4,0.8-1.4,1.9v2.7c0,1,0.6,1.9,1.4,1.9c0.8,0,1.4-0.8,1.4-1.9v-2.7
			C16.9,42.7,16.3,41.9,15.5,41.9z M16.1,46.5c0,0.4-0.3,0.8-0.6,0.8c-0.3,0-0.6-0.4-0.6-0.8v-2.7c0-0.4,0.3-0.8,0.6-0.8
			c0.3,0,0.6,0.4,0.6,0.8V46.5z"/>
		<path class="sttt1" d="M11.9,41.9c-0.8,0-1.4,0.8-1.4,1.9v2.7c0,1,0.6,1.9,1.4,1.9s1.4-0.8,1.4-1.9v-2.7
			C13.3,42.7,12.7,41.9,11.9,41.9z M12.5,46.5c0,0.4-0.3,0.8-0.6,0.8s-0.6-0.4-0.6-0.8v-2.7c0-0.4,0.3-0.8,0.6-0.8s0.6,0.4,0.6,0.8
			V46.5z"/>
		<path class="sttt1" d="M19.8,47.3h-0.4v-4.9c0-0.3-0.2-0.5-0.4-0.5c-0.1,0-0.2,0.1-0.3,0.2l-0.8,1.1c-0.2,0.2-0.1,0.6,0,0.8
			c0.2,0.2,0.4,0.2,0.6,0l0.1-0.2v3.6h-0.4c-0.2,0-0.4,0.2-0.4,0.5s0.2,0.5,0.4,0.5h1.6c0.2,0,0.4-0.2,0.4-0.5S20,47.3,19.8,47.3z"
			/>
		<path class="sttt1" d="M19.8,39.7h-0.4v-4.9c0-0.3-0.2-0.5-0.4-0.5c-0.1,0-0.2,0.1-0.3,0.2l-0.8,1.1c-0.2,0.2-0.1,0.6,0,0.8
			c0.2,0.2,0.4,0.2,0.6,0l0.1-0.2v3.6h-0.4c-0.2,0-0.4,0.2-0.4,0.5s0.2,0.5,0.4,0.5h1.6c0.2,0,0.4-0.2,0.4-0.5S20,39.7,19.8,39.7z"
			/>
		<path class="sttt1" d="M8.9,28.9c-0.2,0-0.4,0.2-0.4,0.5v18.9c0,0.3,0.2,0.5,0.4,0.5s0.4-0.2,0.4-0.5V29.4
			C9.3,29.1,9.1,28.9,8.9,28.9z"/>
		<path class="sttt1" d="M8.9,26.2c-0.2,0-0.4,0.2-0.4,0.5v0.5c0,0.3,0.2,0.5,0.4,0.5s0.4-0.2,0.4-0.5v-0.5
			C9.3,26.4,9.1,26.2,8.9,26.2z"/>
	</g>
</g>
</svg>


`;
const Kloak_Daggr = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve">
	<style type="text/css">
		.st__0{fill:url(#SVG__11_ID_1_);}
		.sstss1{fill-rule:evenodd;clip-rule:evenodd;fill:#FFFDFD;}
		.sstss2{fill:#FFFFFF;}
	</style>
	<g>
		<g>
			<linearGradient id="SVG__11_ID_1_" gradientUnits="userSpaceOnUse" x1="-1.8575" y1="64.1664" x2="82.196" y2="15.6381">
				<stop  offset="1.299629e-02" style="stop-color:#aaaa"/>
				<stop  offset="1" style="stop-color:#eeeeee"/>
			</linearGradient>
			<path class="st__0" d="M68.5,77.5h-57c-5,0-9-4-9-9v-57c0-5,4-9,9-9h57c5,0,9,4,9,9v57C77.5,73.5,73.5,77.5,68.5,77.5z" filter = "url(#cosearch_Filter3)"/>
		</g>
		<g filter = "url(#cosearch_Filter3)">
			<polygon class="sstss1" points="21.7,28.4 19.6,13.9 21.4,13.6 32.6,40.2 32.4,45.3 		"/>
			<polygon class="sstss1" points="15.7,24.9 17.5,23.7 32.9,48.9 33.1,54 19.9,38.9 		"/>
			<polygon class="sstss1" points="14.4,37.7 15.8,36.4 34.2,58 34.8,62.6 20.7,50.8 		"/>
			<polygon class="sstss1" points="16.6,51.5 17.7,49.8 36.2,65.5 37,70.4 24.6,63.2 		"/>
			<polygon class="sstss1" points="58.3,28.4 60.4,13.9 58.6,13.6 47.4,40.2 47.6,45.3 		"/>
			<polygon class="sstss1" points="64.3,24.9 62.5,23.7 47.1,48.9 46.9,54 60.1,38.9 		"/>
			<polygon class="sstss1" points="65.6,37.7 64.2,36.4 45.8,58 45.2,62.6 59.3,50.8 		"/>
			<polygon class="sstss1" points="63.4,51.5 62.3,49.8 43.8,65.5 43,70.4 55.4,63.2 		"/>
			<path class="sstss2" d="M49.9,26h-8.3c1.4-5.8,0.1-11.8-0.2-12.9c0.1-0.1,0.2-0.1,0.2-0.2c0.5-0.5,0.7-1.1,0.7-1.8
				c0-0.7-0.3-1.3-0.7-1.8c-0.5-0.5-1.1-0.7-1.8-0.7s-1.3,0.3-1.8,0.7c-0.5,0.5-0.7,1.1-0.7,1.8c0,0.8,0.4,1.6,1,2
				c-0.3,1.1-1.6,7.1-0.2,12.9H30c0,1.2-0.5,2.2-1.2,2.9c1.9-0.5,3.8-0.7,5.8-0.7c0.8,0,1.6,0,2.4,0.1l3,47.8l2.7-47.9
				c0.8-0.1,1.5-0.1,2.3-0.1c2.1,0,4.1,0.3,5.9,0.8C50.4,28.2,49.9,27.2,49.9,26z M39.9,65.7l-0.4-37.1c0.1,0,0.2,0,0.3,0.1
				c0.2,0,0.3-0.1,0.5-0.1L39.9,65.7z"/>
		</g>
	</g>
</svg>


`;
const Kloak_generalspalding = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve">
<style type="text/css">
	.st000{fill:url(#SVGID_1_);}
	.st1{clip-path:url(#SVGID_3_1);}
</style>
<defs>
    <filter id="f43" x="-0.1" y="-0.1" width="200%" height="200%">
	  	<feDropShadow dx="-0.5" dy="0.5" stdDeviation="0.5" flood-color="#333" flood-opacity="0.9" />
    </filter>
</defs>
<path d="M66.9,77.5H11.5c-4.9,0-8.8-4-8.8-8.8V11.9c0-4.9,4-8.8,8.8-8.8h55.3c4.9,0,8.8,4,8.8,8.8v56.7
	C75.7,73.5,71.7,77.5,66.9,77.5z" filter = "url(#f43)"/>
<g>
	<defs>
		<path id="SVGID_2_1" d="M68.5,77.4h-57c-5,0-9-4-9-9v-57c0-5,4-9,9-9h57c5,0,9,4,9,9v57C77.5,73.4,73.5,77.4,68.5,77.4z"/>
	</defs>
	<clipPath id="SVGID_3_1">
		<use xlink:href="#SVGID_2_1"  style="overflow:visible;"/>
	</clipPath>
	<g id="x9tJls.tif" class="st1">
		
			<image style="overflow:visible;" width="300" height="173" id="Layer_1_2_" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACvCAYAAABHLuO3AAAACXBIWXMAABmHAAAZhwF8o32qAAAA
GXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAs/tJREFUeNrsvWeQJOd5JvikLV/V
3ox3wMANDAlDkaBWopYSSVHmbmXilrF7G3sR0t1F3O2vi7s/G3cXt78v4i7ElVbapXZXPGlJylCk
6ARKhOhEA5DwgzEY09Mz7bvLm6w097zvl9XdAwLCDDgA0UB+iMJ0VWVlZWbl93zP81ogG9nIRjb2
yLCeuvPBg/z3Ny3AkxeS0Rvpv2+H59auE77Vz99O47XO7Y2+lnvveQLLivki30ksJInN961b+P5P
7r5+iz4fut6ge4R//x9IASsb2cjGzUB8sg04ZopZt/D9bLxsDF0nHPAKWX5swZPrNrpcsWWu41vh
eZI+t2/iebL781aK0Lf4uZ3sHCv2+POXX3s5QfuVrmX2PH2evMr71q7nyY/5/s7+t3+rlGbJ8+3P
pvfmO+C55SaOw0uPYWJZnuGd5srwOd4qz5P0eXKTz9MXzHv6x619nux6jr3+/BWufWJEi1n8t69t
9vwn8Xz7t4KZwfI82fVb4p3xfOiOdLGV7FbKI0R/azyX43Nu8rmV7OxrtBq+Uc/tXd/1dnsu0Gzt
zKDs+U/sefrbYCQfX+E+fwc8t6/X0y/X53v5eTZura0me57d6z/5YWeTMRvZyEYGWNnIRjaykQFW
NrKRjQywspGNbGQjA6xsZCMb2cgAKxvZyEYGWNnIRjaykQFWNrKRjWxkgJWNbGQjA6xsZCMb2cgA
KxvZyEY2MsDKRjaykQFWNrKRjWxkgJWNbGQjGxlgZSMb2cgAKxvZyEY2MsDKRjaykY0MsLKRjWxk
gJWNbGQjGxlgZSMb2chGBljZyEY2MsDKRjaykY0MsLKRjWxkIwOsbGQjG3t2uNklyMZbbYz6Ho86
/drY6YR83UbpSBILsTxkGytrqJsBVjay8WaBFfHGJfj4lg3bsRDxhTiJU4TSxu2wzJ/yl6CVApZl
OXBkB3GAIIkwVIjLBEQGWNnIxhsAUjaBxyMS2batYLNJjFoMAlyJe+gSgKxEUMpBbAmbUtiCK9vz
swn/Lbgu9tkO9nNnNYJXmfuR7QZxjEi2MQiHd3Kb9wywspGNH2MI2LhEE2FGsWOjSZBZTEKci3o4
PRzg9CDEtWiAICJgRQZrBJxiZVKELwG6lG35/Oy07eKw5+K2XAEnc0Wc4N+zjg9BrH4cIZIPWdl1
zwArG9l4jTHiNcqT4oRAxb8JPn3HQT1vYznv4zRZ1DODHi5HFjbzHvqVHD9YUdk36PXRbXcQRiEc
ApNgzzAM+VaseyfO4aW4j+8NgFq/jf1uDqdyefyjQhXv9ouYpryUz/a5vbA0K2NaGWBlIxuvIvqU
ErlkOR7ZTkjAqed8LOVcnMtbOE+qtEKqtE7AqtsepVwJYzkPBT9vbFT8dEhwarfbClzBYIDBYIhB
6JA8RQJXSAiCYUj5F0bYIjBtcPuzgy6e7Hbx06UafqFawT0e98lt+olyrVcy5WcjA6xsvJNxyiKQ
OMOY8o2cxnPQLHu4UC3hBd8nI4pxKQ6wHgRIAjInAadIWFOIHkEpcgPkC3llYhEBqEgAq1Du9ft9
NJpN2MMhActFOAxV7omRPkzMd0ZWjIBs6sWgg2thgGeCLkGrhg/lS9ifOJSZIQbbvshsZICVjXc0
UmlIwjBS6RUWfKx5BVzMOThTsnCu4GEDDiWahW6PIDUMgCgWMoXhcKBeQZsg1W11YNUtVKpV0Y8Y
9AN4ros82dnY+BjanQ7BK+BN7KjcG1qhbscnfMTKziwH6BAAv9tt4vKwj4XKGH69PIZ7HA8OQbDP
44szzMoAKxvvYLii5HKJArHjY2WsgDNjHp4jfpwVIzpBprM14PsJaqUCSnyQSmGr3lBPoEcgiQlg
CcEmn8uh1e5gfWMT4+MTsGybINVFn6AmoCXvxwSmICZQEbQsWz6fKHBxD2RRKhb1dQlxWCET+7Ot
TSwFQ/yz8iTe6+aQSwL0tgViNjLAysY7aojnTuRfy3dxpprHk1UPz5LZLG620SNQWHEEm48uJV+n
voWp6SmUq2UU8nk0Gy0kdgSfYDToUxIStMqVMjbqTWxsbmFmcgqRR7nY66odK0dZaTu2xkUIKNnE
nZhPBcz8nIt+ILYuMrbYeBNFMvYIpo+3t9AUW1ZtBo96LnIEvIASMrEy0MoAKxvvmOETrOLExiUC
yRMVD99xAizU2xh0Kb06PTWQ+wQy1zW3Xbfbxfr6hkrBYqGIhIyoUa8jorwr5PJokY2JR69SqWBr
q4HeoE9GVqTiC7hNRPk4hOd7CkQxZaBH8OmL7SsxoGfZOeVNQ0rTKE6Mh5IsLbIT/GDYhtWz4XvT
+CnXgRuZYNOMab21RxYKnI1bBFaJ2p2e8y38WdnFlzwLpynnuq0emY8xiLu+YUMSipCjnKtWqwog
YkDvtNsKZOVyGUMyMfEKVglUwYDijmCSIwA12y1Y3E+xWIQjkfDCiITROY4CmGCNgNYwHJJZBfpe
joBWyOfgubZhWfw+n98j+3kq7OGzSQeXvAQuX7e3LXCvPoSFjR43Mm5me4HU7e2Rbf9K22eAlY1b
AFaWyrdvJwH+NJfgmYKFTjwA0YbgE6hHznYlfSahPIv0MwJYJQJPnlJQNFuHbKrX7VHO5QlkNbUq
5Qk0ebK1XrejgCPMq00QdMmIBHwU2Lh/3/XgErQk5EEAUIBP2FfIh4CdKzKRQMa3TNwWv8+DpRHw
Tw0H+J7EeVkecuLNbHMfzT7cfqiBrT8CPsDO4zVA6Oa2N5H4o23N/LVeY7Lv2v6GwGHvb58BVjZ+
rOGpfcjGk1R5nyWzujI5ppHrCQFIUmccx4bjOZRoOd3OdYwc7Pd6oh+RI9gIKLm2Q/AZUNqFKBUK
6g0Uw7vYtqLU4+cTdLqdNp8PFbRA8AkDAaWY+8gjJgJJ+IMY4z19P4HH78vJw/NQJAD6BLZEjFr8
rE9YXB+GOM3P9QhYRb+EZHoKwew04nwR7oAyM4xSn6elKURpYP2NZfm8bHsrSf7hjZOX7zv5B+At
ue54Xmu8XbbPbFjZeN1D4qac2MEZUpG/rfho759FTbxxCwvoEpBcglGx4JNdecpsEtdXJiT0qUdA
swhEOYKIQ8BKUptW0O8TmAxjCoOQwOOpcV1u1jxf7/Y6qcE9R8YVa6iDsDgvZ/Y9pBQsl0uwCVrC
snIEOQHJgH87bk5tY3JsAT8jhKcfB7gcdPAiQXJlfAILB6aAUg7j9TbmFlcwsbIJnyAY510etkm2
vg5kXmOSKS3AjaBbtv2NbJ8BVjZen/GTACRVFSSl5utFG6vTZdSKJaxcWUSz2dTbK0pSywRloAR/
it1JJJp48TyrqOwoJ3pNAkPJehK+Luk2cRyacCoxqhNwSsWcMjLXIlMT8OkPlHnlch7CMCBRM2EN
nmfzM5F+h6fgNaDU7CrjEm+iMCthfNVSEQMyuEC+izLzUqeOP+BnkqSNBv/LE7xmKhXcffIAHioV
cNuFReT6Alrea06u3bLPMKqbjaVP/kFZBGs3e3vn7T8DrGzc9FBvm7Abx8PZmXEsTpb4yhDN1TV0
Wi1lNANKLYmRklgDmea2hB1Ygl0ROVhMFpRHOBCJaJKZA07unC8yMKKsG2gNLMdK1P5UIkuLhj34
rsXtTaR7LGDGN4sEEQGehCCXp/RMCHACQmJEV8YlwaHDAYr8nCN2rwEZHBlbhUDU7nE//RhNSsxv
bq0haqyhuE7GZ7l4MV/AS0cOYnNujsd9CHdcWYJDcAxd+zVtVjsXynoNGXgzMGDtkBHcel/mXtl/
BljZeH23Xz9Cd2oCW8cOYBD30Ly8gvZWnewoRpFMK9JEZYJT4imzEgDRBZYg53PS51yypcRPq/RZ
puYVPyuMS/+W0jHiWeTHbIKQ2J/EUC/Bo3E0JBgOuZ+cykSRaeJVdGzHsC6yLAHHQl7itBK1bZF2
KbtKBLUk0DR29ZjEwyiJ2DnbxGEZmxzBuFHH+eeaaDdawNwh5CfLOLq2TvwlG7TtV06eTkyg/fUM
61YtEql8eoOiLvbK/jPAysbNy0GplMB/WzM1NKp5bJxfQKfe0ARkCUNwCBLirRNQ8QgQYpMSnDDe
PKljZexRFplYJHKR24qNaxAE6uGTgnxDsiSJYBfGJfAgEs9NPYAhGZIY1y0JZUjEriEeSFuN9B5B
S0DKFXsHP+Ml/MuK1XAuNbfAYxBgEwd5qDVKzX++q+X/1IsZW2Ks5/7I4q5dvIQv1FvIVav4WCGP
6SBGL4m3PXo/jk3mdU/6d/D+M8DKxs0DFhnLoOjjUsHCudVlDFpt9cIFSaAeu96gqyAgNigrKaHI
iS4G+mo+jyIZEPWcyj2Z9CLvJIaqSDmXc/IEjES9goOhrQzFTuOrfAE+si2P1MmnnAvTWK0oUVM4
WQ8UMIVaJQpuCQpERtv1FTgFsKQsjcRhCWBJ2s6ATE0ANLFctaULCI5qbml8lwApQfPa5iq+TJl6
vDqFjxAwfZ7X4FVLMd/4RHxlm87rtxG9E/afAVY2bn6lJMGICjlc7faw3G1qOeOYE7lDGagTnyAT
DAdkUiLxYkzViih5PnzecqWcrzYsSXKWm7EooQrdrqbRWAQtx8kp0xIZ6XuSHwitHErEUvkm92/e
y8Mu5tHt9/g9ZGKhgBcln0TpyHwQuUktWcr7ysrC0IRIuJSj4rmMCapNifkiqSr6LoHW1vSdnjBH
gpE4CWxhXBJMquEPFq50Ovgc/z1cnMJ9NsGZHDO+oXDHf8ASuIulqZRMbl3Bm7erzSsDrGzc9K0k
E3lg+2j1AxCaFFQkNkqM3a1Ol+wowETJw5G5aRw+sA/zc3MEjwKGvR6SUAI5XWVHYquSm7JbLKJJ
ltaXXEO+J2Dl2MZ7qAGn5k9lScLgJEZLgEiM8WJUHwz6fPQ09MGxHN1O7WSerVJRbFixJhRKtLuj
4JYn0yvyA5K2w5Pgv7HGecnpCQhKyRr5XvliV0CYIPaDXhNfJqAezI1jjN/R/bFsVEYeWdcppMzm
9Vr7fxsA1o+uSq+kkl9r7Xo9yvrVPvPy12+FVcB6XaT6xz/Hl39e0mzEDrSUs3HNkhy9EJ5kHIsE
pMQKhn2Mlwt4393H8Z5Td2BqclJlmNSokqBQKbA3ivoecl9S/ngQhGRLARqtLjrdnsZMhWmJGQkA
FSBxUztXkpah0f+JR5HgGAQSc1VMY6Rs/cey5PNS2E9t+crSRD6K3EwoG/NkXyLr+gJvBLe+GN0J
vnKWYieTnERherKtGOtdolebn/9G0MJDXgEfIMsiV0P4Y0/KN3JmvP32v2cBy9Jib6YapZXG8pgu
T7G+J6tsbO20ixo94lHLlcQYXAXF7d2T2bZ+5HvMTn6Uotrpe1pn3NrZ3t7d9MAyTRasdMHY2W5n
R9cB2y6NkOyCF90VJ70ew3buVWKuw640jp0feed4LVx/DD+yb+08Y87D2iVRXulezEcW6j7wTC7C
MkHLHTrKmvqSgkOWdXC6hvfedRs+8OA9OH5gntjmGVuTGMlhmkwIGA0lSl1itVJA6Qcx6q0OWs22
pugMpY672KI09spRb2EsSc/cj+xP4614PSTWKiDACIOSRyhNJ+LIgJvcA2ITk3ruAo6hXKtEvYAe
mVuJkBPyvbZkCzl5cUciocyUzxRUikYaMqFMSCeLgwWe47fCFu73xzBJKdmx4hues9fZZHBrvYhv
Drd+PTarWzv2FmClcS1xW2RH13inxXLhxhpb4xVKCOodDLlu4mUXV/vbOS78YsV4pNqN1Ee0M0nF
GOsXq7ALnt60Ulhu0GxonJC+lyvDKhXUc5WQEfQ6bSn/Bo+Sxi6VtWjcsNNBFPSuA4wRQAkWeqWS
soABt8PoszxusbFEvQ5Cyiau8XCLZdh5X/cvY9jlefW6Eh4Jr8LjEPc9vz/kBLMpz7xSRW1Aw04L
EV9z/Lz5LjKUWACg21UJJpLJK5ZgFXLmGKXUsOwnHm7nr8m1Ep+ZRxlnSRUFy0R4S+mY2HJxjrLt
Bccyxe/6lGPdPgEmwUSligdvO4Cfe+ge3HZgjkxFWnVJJYbC9lUWiSaVEwaUj5F2yXH5fTxuvjYx
VkGPv22f+xMgEddiLMAURFpjK4k8MqlAS8YMCZJSp2/A7+hxhZDI9WFoAhHNmmM6Gkrwqhxbwt/G
5nbiQZSJJsJRDP1hSNChFOVX8D1Pj3UgUfGxSNECer2Bykb1QEp5GgLYU/x9z+areK/lwYpMAcDX
nrzWj3oWb2Gc1psBVm+kzertB1jCCmT1bHQRupygDz0Ie9+83nrh8jXEFy5z4gxh3XUXcrM1bhtp
rpo1ujHEfkGQweUriLi65h64T1BIASFJt7F7fP/iIqJ2nVfG5YTy4L7rAVg1ghHlSnxuCV6rj4jM
Ii5XYN95GxKff19bg7Xa4Az3Yd92O5ypmjnm2DAXrdckBmNObixcVWbo3nkHEoJJcnUJ8dYWmR3f
37cfvuSxcZIkl5f5L8FL+i1I/tvhw3BmpuA0CIZXFghKbWD/Pvhz87AI0vKaFL6zjx6HM0sZVufx
XL6GcKuNeKwK9+TtPA8C48YW4oVFWL2+BEXx+HNwTx2Dy/fEmq5xSiKb1tcxvHIVLgHEIagKCvhS
/oXHfLqcw6pUAG21CZB8nwvBGMHx6NQYHjh5FAfmJ3j5EhOS4JjCenZqiBLAkkJ9lgR4yt+ao2dr
15scAVrirSSSXcokyyMgeA3avOZBqNDtER0cSW7mZwMnVgM+Is8sIlrf3TZMMjFeSP0nNnYwlZUS
bhHHGEFzwcuhnBfDf0gJODReRAuaq5jzihoE2+JvH5JZmRCKBJd4LN/g8+NuDuPC4tJF5aZsVnuM
Yb3RNqu3H2AJWBFQgsoYxv6bf4LJX/4Q3PlZwz6W11B//JtY/MwXsP9jv4np973HAFayA1hicO0T
rC5//OOICz7u/Nf/O+erbWRhKt0GV67hyu98HMHXzqEsgPSuR7DvX/8vcKtl9K9dw9If/BGGX3wM
+WoF0b13Yua3/yXsWg0rn/gken/yZ8gd3I/qr/wSxj/4AXPMGrBoJJt817DdxsXf+30Fk8P/w29h
SBa1/B/+E8K/+HOyphIqP/MzmPiNf4LO5YtY/t3/AOuHz6DASRE5EUqPvo/v/Tr6Fy/j2u/9LsIz
pzH/4Q9j7Fd+Fe2nn8HS7/1bgswG5n75l1D70M9j7W8fw+bv/gGw0UT5Z38O07/9z+FPTaJz6QK3
/XdIvvMEfOFRd+3D5L/85yifukcZXyLXhNRluLGBxte+hs5nv8R9NJAr5jS9ZqEQ40x+CHI4ney1
yYJ67ybKRdxzZA5H5yaQk1ABYXMCVqq+Yy2sZ6nlXMDD4VphpR2dNaZdpbjKeTG4EyzENhUHA75N
+WcrLKlEi9IYKHmIjcqxE/UmEnnNzywGc2Fv8p1paoxlCzu0lTaKh9C1jD1MUKyULyKmxB06QzR5
fwm7kqoQEo9lyjHnFPRarZYa+AWcO9z3d3ptPELgflRsXIna7X/iNp83B7QywLoxSsrVj7cSyr/4
c5j/V7+tzODa17+uN+j4PacwOH4EW3aMSUq9rc0lIF/CzL0PaKWArQsXsXXpIqL1NWySIdUOHUT5
wfsREEDWnnkGvZUV+JQ+nc11rPN7yqFERCcovu8hlN/7CAb9LkqHDsF98SLWvvRV5MkArGoRxdtP
wpqYwKBc1WqavnQc5rYbK8uwKNsmT55EcXIKjYUFHsN59Bp1rA7aGCfjKfG9DuVHm0CQ9FpqU7HG
x1AkcPQoc9oVn/vjsTiUoP0ObEq20pGDiAmQzfk5WASn8v0PoPLgA5RFDtoH9nMbHvPddyJ3121o
feNvUO/UMTE9jur73ovSex5R0C4ePAg8+QwG33+W7KkBt5RH4fhRFO8/hfrZs9h69jnkJ8Yx8a77
UbjrTiwOE3Q/+Scokkm1+d3PUEletCNKpxJmq+PKRhAGOEpWe/uhaYzzfEy/QNsAVBKnxnB5UUIF
XI12V4BSm5bx6ikRjfivRCZogjS5DBmU5Q5NVVHb5CZGyUjIGyCU/boSe0XGJraxEbOCxG8JaBll
aRSifF5ZngSRjtwwib4v8WGJeBgHss6E6PYoEymtCwQ0aYQh4Q5Bs23Ox7OxhhALXEj6CSX60Ow3
szm98cfv7h2CRbpfoPR4+AHk5/dh/cyLOPPJTyI8/SImT92LbrOB/NJl9P/kT7D8hb+ARWlU+T//
L/ilIl764hdx4TOfxtxgCGd1E5X3P2yqA6ys4tl//4fYevJ7mNSKlzHya2Qk5RqGE2UUH34X+pRr
iz94EvvuvQ81ysil+Xn0r1yAK7WWJIdtwBU94ETh553+EK2//BxWvvRXsCnB7vmt30L+4Qlce/xb
OP+fPkE5uYnkyjI8Mh41DouhOpCYcZ9g7CHk8cUDMgvJWZPUE5lcOf5EfcqVixcwWLpGuTmLhPLL
mZ6Bx4eM3Pw03LkZxPUW7GoNva0NtF86h2RzC4UH34PC3SfQXFpEkyxx8sRJVO8mKFJ6DjeX4Ysh
iOcd8XwWHnsMZ//d72Oc1/eef/U/Y/6jH0Xu4Xdj80ufR3hlBZvOBC6ScUR5G+MELynAJ46Has7B
7QfHMT1W1MBOY9cf2awszSMcgRVXEH3YKs8UsgyW6E0Za80qiZRXZiqG95EnQh0Dadv6FJNUUCYp
a7MM+NkiE1N7m6BfwkXM4rW2NLA00n/lcBzbTN9hxGsdiZCUCPiRd0IO0eU1SdAjaOVyBHUuLmLL
6nT63GeCPrdZ5gLa4RSaSC10yVtssr8VbE63+vj3DGBptn8/Rn95XSl7cXISx3/lV9Cem8Pg+eeR
O30OY1Jm5DJXxS4Z0DBHNTFAPCQQLF5F/smnMZ0nm8l78LmaCoX3igXM3nuKk6+CCidt8PxpOM9f
4Ou80cmeKu96F1qUiRf+02dQ+5/GUD40TxC7g7LqWYztDhGQieJ7Yk2Df+Uqys1NZRhOu6v2kiEZ
nEd5N9tpq/zJc3ttr06mdfDDH0I8M0/JVUDx0Z+Cw8lh7aqsqF5LbhusbyJY20TxyFHkpyeMfJoa
R5eszeF5VY4cQ6felUxh9Lnt8OoK3NBB7ra7kDt+DKs/+B6ufv0bKPzab6Jy21GsnziMwWlKzrST
soKBpNVIQGUolkGTqiJJyV3p+cftOj5lNeW0z3P1HV8lU5nffWC8gtnxEjwnSiWYnQKIiXsSCUid
p8zKUrBy1JaE1GM7ClMwoGWM5lbKqNTjm7o4Bfi05VcSpxYo819sgrTUTiiBnpqyo7mIUPmnntmE
v07M9+1Iq40KG5UZIYk/JExcMBw1yuvvpaVnLJSLRf4dagkbqVpaE1NAGKvhvcdrtUYwG/i+iRlL
4rfWfHmL2Jxu9fHvGcCSmkouaXrjC1+Bw8lWfe97cdvHPoaIE75DGdN67GtofvrTiDfqqOWqJC1V
tTfIklrwfEy7PqqlKjphVxmFjOLMDE79d/8SNp+LB27xk3+Mtb99HE5lgpLxp+BT7jX+/rtY//73
EVz6CMbvuB3VR96F1U9/dlcIQhpOERl/o1cqYzzow6Jk9b2cfo9fymmHmLFA6oZb25OzNFbDkV/9
CPDRX1ADuCT5WpLMO2IOI2eATNL1LQz5cDmJikePqYE+4LbrTz2L2vws8mSUPXEM5H30CWw9PgrT
0yjedx+82Rl0Liyi9d3nMXz/BmofvAsFAvXW176WxhERRnmNDn3wg5SQs6jMzqNCNrn50nlc+/a3
EW024YoH1rU0BUZAyOP1lIqh07UyZierBC6x5QwUaKwUqCQVRsBKPIEWfz94nv6tsnAUWpFKs1jt
RrGGHQjTlRrtyogEqEh9JPLcDu2dgm+pI8UY8Q0rsuzYgFoa96WeX8d4JsXra6WfEduaYW22VpJw
+dt5cv3tnRAFOQYJWq1WKPfd/nbTixIl9KDZ0rAK8SwaiYm3pG3q7Wgz2ztGdwke5E0VPPs8Fv7N
v0H+/e/H1Hvfh9Kpu9VGkzt2XPvYNX/39ylRbIT28HpJyTOXZIpAQCU1aQyaTSz+zePonb8Ip8jJ
/4MndLUuj02h/MC7FYCqhw9R2v0L1G4/AZc3b/W+d2N1/36u8qkMEFd/THkYdJB0KK148w850Vy1
tMQYRUxpCRWJCFe/phkBGdjq959E+8wZMjQHY/fdi6n77sd1v5PmtJEl1juUhCtqyC8dO6ETuddo
Y+Vb34Pz7vvgH9hPRsXjkDroL57FYGMdtRMHkD91DDbZwfRDDyFXqKFGqZofG0dVAOvQQQUsDQDg
eZf2kUGSseanptDnpDz7uc9j/fNfxOEhr1m1jJ6wUDk311bJ5EptqaKPsZJL+TrUUAENEhW7FNmX
LDKCGALCNgE8keYTVsq01OubrqJpHJi4QGTyS9hDlAyNbE4M0Nhaw902UtJJTWNkRPKQkjUKdnGc
BuLbaow33kCRo4l26zEgZ2lox2hREBk4EI9kFKj31ngIpeZWYGpwcYMaz73dsfi8b/bNcwo0xMM4
A3CD3r43Og7rjbZZvRX2v3cAKxKqH8PjpPIppXpfeQwvPfZV5P7xP8Y9/+v/hvzMNPyHH8Tg438I
WxpzWlFqnE1GplWzkqcXRq5Lb3UdZ//jJ9H5m69iemJMk8nKuRqckydQetdduhqPkc2U/tlBIO+q
8aNy+Ci8R96twCcTNJIoACfRx9DYipWFOMavZb7NMkcSW7vDQIHu5hbO/8VfoPWZT6PMCR3/1m9h
/OQdhmXsWrVtykR0uxhcfAnh1hbGTxzR11vPnUX3iR8iJIMa+8gHYU1PwatVESwuwl1epaS9D7mj
R5UtTNx/Lyr33A4352uj0QpBzyHIC2jKNZLUmstf/SraZ8/ixK/9Gvz9B2F1A1Q6fdTS8+jzoAL1
vg3VEyexUQWeb45gZSfhjh1JwYpvaEcbz7ArlYSupt6oTDQmJq3MkGjDUxPQmYitXOKmRgGmwraS
1BYm5ZYdV8vLRJb0eo7UQB4mKWBF8U7IQmrUj+OdEFm1e9k2ti1nEn0vEpQSOJL68/2h3mdSGUIq
lorpodfr8NBtlMmQI+m+Q6YlgCUMa6BG/BvnC29kHNY7pV7WHvISmojmyn/9y5j9uZ/B4OwZrD79
LJyDR+CSqgdcDTc4UXsWJ45ELctN6Xl648vKHnFZlngfK/UYyT+58TEc/eWPIrnrNoxREgXNPra+
/104BKs8ZVZ7cQmn//CPEK4vEyhncfs//Q0UJqdQed/70Pv235tEXEqi/R/+BQWNCuVCKK2rvvwl
BTT5Io1DkuBNExyUesYME5GbPe52UF5dw2ShinwQp/Yek3i7/aup2z5AuLSAcJPM6bbb9OXNx/8O
w9PPIXngfrLCcZSmJxE2mmgvLMAnyI0/8CCP+wDWnzuNS1/8ErrLlwmIJ3H0Ix9F6fgxFE7cid6T
T5ngTEk9OX8JS3/4nzFZKePgb/33OPaRD+Eq5Xb05cc4UQMEtQKGiTmPPMGoUigSx0V+hWmIgZMy
kB1wGv1rZuvIxG5tp+eYaHQDSiOJPZJYqRPQbK92KmMPs5xIqygIs5JEawW46+qh7wKB1Fh/XcaA
XFvBK4l8H9VsFzbHcxTDugQjS/yVK7FiZGb9/gAuWe5YtYKNrVCZnOwyTNOErOsg8dWn5BsZh/VO
qZe1NwBLbjpZDUVOjNfgHjmKwnseQa3ZpjTx0I8GuPKVr+DKn/8lJglecc4zMkxy0jTZdWhYlUgA
vdNCDEnvvVoNJ/7bj8ERIy1BovHSS7gSd1A8dBRBd4DFb38LF/+f/xfzWw2Ex/ehc+QYir/6X1FO
3YXWE99Dn2BT4Up86Od/DskHP6Dg1L6yiCsXLyB56RKSYax5cYGU8VWmZfxhMtnkmCJJOYkd+MhR
rpXgEASiYahsRwzH2xk3qR0rJiMMrq0gf/sdGrneurSA+NoCoisXEFICenOzaC2tYuPqNUrkwyie
OkXpEmHx8cex9PGPI798Bd13PYjOgUMo/tJHkT95G+XoefTaHXjSfSZXQKHdQ/trj6NFuV2hPK1+
9BfQfJqgtrbFBWMcntjmiiagUsq2QIv0OSqthLuYiW6YlVq904DRJKUX2wGdlgEwg3+xAoMwGtvk
V6WpT9hmSfE2mNnbtiv9vBTUE9BKUpxKDfBJGrRrJHtsnqfuRWsUCS+y0TLxWAKy2iCDLGvI32BA
1ij6UDIo5Lskul7ajhUKediUy+J4EIBW8HqL2JTeCfvfG4AlE5aMQTqYtP7kj1F/8Qy8d72b7Kag
qSlr589j86tfQ+WZs5ipTWiFuYQTePmT/wU9TrDeD57WMiZyMVyLkujZF3Hl47+HvgCGGMYTU8qt
X2+ge3kZXfcMzm/8O1z9u8cx2e3hYLmGAQGs82dfRHd1C431K7BX1rHy6c9i9VvfNZNAypFI5YFm
A52Ll1FZ38LWl76CxReeweZ3vgM/FMbnq0yMCWrLn/40mqRY4fkLKHMiSNeYwRM/wMIn/iPqK8tI
Lq/AE0vYMNRyJ47Dzy5vYvNPP4/N0+fQ4ffUv/pNVCUL6dlnsPgHv0+WN4/6hcuInz2Ncr6Ixje+
g8vPPIWtLz6G6c02pnJVJItraP3pZ9FcvobGC2dg1evY/PJXsXbpLDb//pvIEwTiH57G8r/997Af
egAtAmKcdxDlHAzzHrxCQe1H9Y0N1GJK7wn+LrKQpLlHYrcSA75E7mvUubIZeztRMkk9f7uJB1JQ
MYnRsUptAyrxdkUHY8gfeU8tIyXVw2lCHSJlUiMDwM6ORV5r0nMS7xCvlHHJf/J6qAGrlnqPCwJW
QZe4RUYrHlLxmubz6hGVEjjFUgmV2gDxYIi8ky6A12WjZnFWb+TxW6eP3v5+/vtlcZq9tTHLSI+A
QNCWtkzjFViUYJrv16gj348xYxWQG6tqln08XkSXF6PH1dAdhJzAeeRkFZecMoJUOxqiJWVzpbZS
wVFbhsRT5bVA2wB93sDCgmqNIYrlvBRuQtAaolvMae5apRPpfdrLUdqJglP7SaiG21xooywT0I/R
lEkccHvKIt83aR8JpWmbE7An7a94TCVOhJw4FMhU6pD6TvJjOJSYngZFqgeNUiXkeQRkAcNSQb1W
NkF0zM9zpY+5vxh919ZjLvC7KlZOE4wbYZcsziKulLSKZhwMMeDxNh0p72KhmPiwyQDbyUABZswr
IC9t3MlCWz7ZKa/NmEgn7vOx/RP4Jq/FoNclsAH3HJnHT915BPsn+BnPVvDPESh9spBEdbetDFjC
DZLRbyi5RiPmBWM8l+jzUGPP+grO0h4sHPTR2NpEj0xSMUFCK7p9stqulqGRiHQtLcNr1xcpl9q6
FOZiI9tEUUrO4SCNflfpKY4Qy9jOxFms58n9NvjoSuFAST9KnwcS8R+aGHaPTGuMsrs2NoZGp4MN
3lc/6+TwPzoFHOK5dpMbZVovryHy+rZPXiFX9UebOlg3se+b3d76sc71tY//Ffff3UM2LN7QnDTu
+96PGidxrrvOE/YMY7JC5GpTiPsDdNeuqScqd9sRRMtkKZxcnl+BN0nmJYDBSS8pOIViAW6/hZBs
qPbwz6h0DFY3UJqoYLh4GfliVb2CaA+IHmWAr9n5Fmp3nESRxCImM/HLJVQnqxg2NhHbppWV5CoW
xmcImFV023VUYhMLJOAa5XOS48FtFlGZmcPE/mkEzzyLZHIKwwNzCFtNAo0Fz+Pxjo8jcbiSS35j
oSLdE4A1ng/fz/UoFwOC7ew0r4k4Dm1UpczvC8/CmxhHXqL4N+qInzuLcSqb3B23wz96kGzUWNa8
pSVUFhbgHTpI+UzJQwmZ5/bebSeA+Tm15UiTd58T3S2V4Z27ivrVyyrZNPGY+xmvllEtF5HzHGWH
UhhPbIZQcDISMM3E2dUTNL0hR7FVMLXck8SEI4gsS0Y0yLJTt4atBA3q5U3SlBsTUColkBOpBiFh
KVGQyj3LBIyq9DbpOcnLJqbGnKknchSVYmrCh6Gp8CCpPgVJDh8MldlJF2mJxeoSxGynraWVi7xu
NbJen5I+iW4mButmmZh1kzYf600/ltez/es9/j0BWHJvSyT2oGCj8vM/wwl4HM7qCoKrqyjkq8au
NTfHOd3C4M//lKAzC2dmFkl5DOUHTvHGtdWA6lTIMrhKblJ6+QSMYq+Nzd/7t8CJ2xGPTSDXaSJ3
YD98Tsr2Zh0Ogco/ckDtKK1//wm4Y8dh//RPI6FM8MisvHxZQav14mlgcga+VBv4q88jd/AQ8h/8
IOKtJrpLy1I+Cna5TInBm3vxKvDDJ1F44H44VW6/uITie96H6P57EK4tYPzQIa0KMeyROSwQJBtt
OCdOgjABv9OgLA7R+94zBKZJFN//EM/lKYJZDP/uOwmIPooVHtOj3N/6KsBztbtt+Cdvx4AAHAY9
FA8dQPTks4g7PId/xHOZnoH90kXgpQvInboLw8lJTUORCHunSQAtTyJc/xvEF3sElDEVP1KfSsoe
e76rHjTxmtna/l2DngzTsVJfbLK7lI61k6YzCjlQA3a0zaKFfUmEu4nDNEZ6rdCRGrpHu7LT3MQ4
tndVgkjtYrHxNJpSM/G2bUvjsBJTG0vtYjDtxYwNLPUmxrGeo9Scl/AK2U5sW8K0up2uFv9DzgT/
ViRhW0E3uY4tZHFWb9zx751Id42/oUQhQ3FWVxE2WloQLg7aSNY4mcoFONJJeMC7tdUBpiO1XwQb
TWU4tnQQbnbUm5WbrkrrYXiJhzyZWf/0aQynppEv53ijzxFoOrD6ISKXj626zrhIJjClncNVNqpv
ETAIlL0NBGRRQ8pLq90k+wnJtrqUiZSogx4KFqUVZY029JyXX8bjBCcjPHQYoUtptd5ASKZiVcn2
pBBe4iLqUIq0e2RDkqbDKUWGZW+uargA+Dyh5HPGyPgmpDNNCz5ZV9BoID40R5bJYxpaGG60RAvB
3TcNq5FDssnvubLB0xjCJmu0eN5xhzJqq4H83AHYE9NqoxtIEjInpU05NnzukiZA54+eQNxYpOyk
NObtInXV5VpoFDnBSozSGsJgmxLGtm1v34TWLi+dtUsCGEO1ldq0TBfmJC0BJKEfxi6VBo3aO7EA
Vgo6uxucx4p9ybZ9Soz3ypbSGljJKMSBwGaaURiGFal9zN6uo6VOHQmd4fFL0UCtbEr9PrTMeQrj
ExubSO7YTpB3EpT48F/D8vKjfQr3rs0qq4d1oxdKrpNPcBGP0OcfQzc2K6JTpRxLAkSbWwhVQnHS
UNoMwj68KwvwCTrDbz7NsyRI5HK82Qbo5LlqF3mbNQl0pPQ5AkP0wmnY/kuI/RwGT72A6Ooy7PEJ
AlYObQKSLZ/hzRq1h5pAbZFh9SSyXfLRKB2kwWZCYOlxpXYIDsNLy9i4fEmrBHh1qY81xJCAKnIp
kiRbTvLhs2elLi8BqYH2l79AFUtgiWw0Iy3ypcGekDZVBC+pfy71r5LA0lQZd6KI6HSEzhcf57G0
+SPyuNY2CZo8BpnAK5c5KQlOlMy2FCoXb6pMRgmcfWlRJ32OUjn62jcx+P7T6t2U2LGBeEtFmvH8
rKVrCgKdy6tw6muUqQXkKS/9IqWztp73tUONAojtbLMh295hOwYc4jSa3U4LEMZqP4pT72AS74QJ
WMku6aiG8ETBQm1cu8MTrF3hDilgjTyOcRqLpWBlpUnYSZKWn0HqcUy2o/Os7f92tpGoejlWsR+K
PBSm5UuTVtsAqe3lMU72PYMCvCB51eIyr69P4Q3arF4n5LzePdzY97/+/d/ose8dhqUhALwJKZOI
UkZVWCaGXJqIx5RWUmEhoUR0ooCTdlOL2Nmpv1uovFbyFfUhruyEYCbZIsWKNsiUX0OCoaPBeZPH
trYmeRf8Tn7e4+SXmlB8PlxaMnFFcZrnJ8GMEiclQMPv8Ip5je0Jry2YCedxYksIwHKk/fBilz88
pZT0yZIASpt/R/0umSLBLvH0fDSgUliBJ5OQqz0lquWmP5fYXq6YoEcJm7AIalLCF0sbGiYhtb6S
lSgNBeFnpfefyC/HSKD42hK/k6BEkI3JoKQQYSQpQRLkOUqNEcBM02HCxStSSIrXsoAqj3e8XEHT
JUvNFfQaSDBlmhdjICBOtJ+gAJcJLYiMD82xtrWhiVw36S9qk5KAzNBUCZUyPHL949SOpelVI1Az
EaR63ZTx6N5C3a/mFSTJdtsuATeTyyjtvKJtD2UcY1tuYjvMwUo/L8b/RBm5o3WxpESzVEw1m7tc
+Npk2FIvbCxfxERSgB10FEzxCtUarJe9fmMM62ZtVm+kDepmv/+N1MXW3gIslRVyvUppYk2C7RQX
vYm3l2i1QHAi78TdmDh3R024o3K3ZgVMq0XavmkDJe8UTOkTJ62lZan7PL3ROOksv2zigUaoP7oH
fU8l3yjEwctVdi60rNrS3kqrYaY0wk22Yw3tYsn4aJM0bWd3hQIBgoK/fQwudtmERmVZ5OEWTNKw
lk12Xlbj2EYyMoBLKH5qWHKLZHFiXE4vk5NG2I+COpUXOaY9u0XQnCHTO5ifwlV+Juek7MpKV99k
FCiA7aRmkWf67brtzu9jp5NYJZnWYI/S9JpQi+0hlYEKVmnjCQ24tVKblnobTY34OO1NqECfpEb2
NPHasey0DI0JX4jTh/6UMCERIwdAoh7k0BwTFzQnJwtBrGaGvGQhiGNAvbAxWv0++v2eJoJH9j9c
DOvWB4fuLZvTO1ISXkcKU3f49WCe7HJFJdsycmej67lsct1PYGowbX+BlXb1tUbR2K+0cuzyO1mv
srpYr/S3df0xWS+j0tbLdjCqP/8qx7DzarJdK347KvxVFrzEtq8/rnSb+GUfsHYtBmaDENVmE3PD
WXSnp8Gpamrp22kD0iTZCdwcAall7/weaRCnlZ6LASBowrFl7RyT5gOmGsuRulnyHiW1kY077CkS
z+Aw1NCGkTE+TL9N2JHW0BKjfJpnKNtHo3pZKcyL7BNAESYln9FkBJGfVqjVYDXvMGWGEgLikkmP
18pwBgH6fG0LpqGsFLKObgG72OtxVW/G+e3prjnWLoiKt8vA7Vyc7VYLowYVP/L8ZcpbFF4azBNb
1o9c0O1GFm8w/U2u4083apO4UZqevOqnE1iv8p0GYNzuAONkE1PVKvrDPgErUgkXp7x2VFrPHhnf
bdMowtRWN1+oLDBJAQOmqoNth8YwnqRePGVNJu8v5v4lnGJIkJDWW/KWJphrTffQSLyRjUzzDXeS
zTUMNc0tFFSLRwtNbP6npC9OlIkVyKICSuy2VLWNpMmFKcXsea52gJb4OjnuYj6PQqWMki91+AuI
W4Gx/Ns/rh3pVvQpvNm4qr1nA3P3LFSJvUPywFL3tMn1T7Z7x2AbcBJNwdgO70l2opK3J6dtbmph
93Zsp+wgNRq7dhrInHbp6Zmb95UbbyXXewpeiQm+AgRa28wvpSBStM93DPMIOO16PU2BGcV5J7sa
eCbXsbad73j5Fi+Hwt1wqPvjxLRFIjr2TixUss1BEXMy25UcpmfGMZisYrkhiNDfBouRzcmENjhq
/B51Uh41JU12yVljcB8xqlhDGUTWK/ClcU1iB4u072CgwcBRmMZPxQa0RL6ZCqaWxoI5yvSMNNRQ
iCjatpltX98dtb1tMhAbYIESUOSe5gdKkGpqDpA68JFtb/cHkO8v5gsYr4wh15dJ2Nh+L7nhZfZV
JuuP3afQeuPn3U/YBrYnAUsZleshkCqhcrP3B+qmj7kCj2wwYle3tZKkGLEjxKM1PXa2KyeYXLWY
q3isycm6wktp3vTiiSTxSz7cvDHKSu2joeNr8bydZNcd+wm2paSlsV/WiAKnM9W41ZPrsMPYZMwB
bzfD4MR3UzudpLhEYshXQLW2i9ypZBJbmZfTWKShVCuNR8bl3atZDFe6Jktc0XCgBm6isAGX1Fit
NZ2kDbwcX7LTz3h7lRdJJTav+UmMH5rFoJBDf1CAM1TLl7kCEjnOh1TvDIIehvxNomioDErs85LS
Y6fGbW3DpUnLBqhCiVSX0i2SliMAkbaWT8h0AmmS2u1pg4hkFL6lNjlJHud5i3dTuuaEaTxVap9z
Rsb9NC4rSYtnJNuxq+m1TFN+vMgkdIexdk3VumWjhOwcwSxyIwW0oVaEjZEXL2loGp3cKtPOXo+r
ejPOz92LaOXE0tarhGB2Hwb7p+BJaZlcTdMuhmEPcb8nPnr1EGqzA8dMqFFZE73H7JSvaNlcY9zW
4EHLSYGeE0Jirp57GslLZ2Fz1kXzsyi8/1E4Y1UkYaB2EgkqtFP2oJ+3jdHYVADQXp9GUDnGeC8M
QPNt0xVUDM7RqJ6TFoOi3HnxLIIfPAs06tqZp/yhD6JwYP8uW3yigbSBtNgi8xAmUqKkUSN1slNE
R3FSvWxm8tuOlXYfSkwXGdfk+sVkKe0zZ9H6yl/DWV2DWyimxvF0URRvH4G7R4bVbnbUwD8p1yPv
qSSMUk/ssMPrFbUNU0ntS8JIHK+NCmVURQJ3JTpdrnmk7ZZNxQUJCu52FLzEZiQSUKtWcLc9/ga9
nmmumqSAKAwr4Dl1ybi6BLIWf+9Wu61pOnJ+OQKPRKLnhdlFhjVFypzSyhAj72BaU16+KLJNWZm8
Mi0jSeUzsp0vITECsp2uNk8tkn/lrZALhpG1cWK9Zq2Gd4LN6c2wwe05wJJJ7fE6TLYoR6IVtP0C
rBMn4N/7APInT8KeHucK2DdNCBR3TMccuXah3pzGdjEqq+ulEdfqrZIKS7a9ncoaLS1h6Xd+B1tP
fgel4iSSU5OY/tivI3fsiObf2WmCr2wt7m8nLccruYUCKmIPc1MvY2ib71BWF6XdiOOh9g7WxqvS
FFQlYICtT30GjSefQlDfJKOZh/WRD6E+O6s9AE1weKJlfDutFhavLGB8vIp3P/AAxiq1XRw0BSyC
0dL3nsDKd7+N+Yd+CrMPPqzts1rdNtY21vXaSJXR4vefwub3vofuwmVO9pzmPDop+7MIQFalgG7O
wXqjSUAoIj+Z13gsYaZhbLxvUuCuQ+AwJVosNNsdPtp6naqSNFwsapWDIhljRbxwAgISiElgE/DV
ag26wFjazj7QGuqGXQkxHEjeH7+jKwDHC90hq+wSpDr9LppaBXSoP7fvSh5mAQUpX6y1vgxwathK
mkyNkddRbGgwxn+pJe/zN5Ba+toX0TZlZnLaqNXSMskliW7nItNZuoprVg7NvItJiY8ZdfN5891Q
b4gkvNm4r9cXJ3bzNrG9x7DScit+lxNn+RryV5fRu3Aazb/7WzSOnkDu9tsxdu99KN92B5K5abQQ
YaXT0vioza1NlCnzCpxoa1vrmgg9NznFiSE3fR95ypYWJ4jcwCVOsP3T0whKZWyk1UPFTjLMl7WE
csU1dprllRVscuKXy0XMTE5jwJnVbvaVNUl6x9RYDb1BD8urq8riJsfGleJJS3bxcklO4xy/R1tb
SdkZ6cNHwKjz+7gXVHlMVzbW8NSLp2H3esrmCjy2HF+X75D9SiG5UJqv5orXdXSWi9Ul6F78/F/i
zJ9+ivvuYPruU/AJbJ32Fp5//hy6BIDbT53CdOJg4OfRSEyunlRt8GEaodpiv5KJTGAcn51BrsbP
8yJ1hn1KZAF6kYhDNAhmzUZLAUYk2iafb9brCnoFXgvfNuVaxifGMTM+hnLOI6Cbcj8DXiOR1eVy
iSynoDYqyd1radPciCwqQLM3wHqnjfV2Cx1pyRXGCrjCmSTHUeLfhCVJpHtA6eZL6pDEhMEY1pVf
q2PTRMwno+YVsuBIrJwba+ecnDRn5XWRtKNCvqAgpuENZJ5F7r++Wcfi8joC/gaHJ2ZQy0sWxPBl
1/7NmgxvpHy78biv1xcnZr0DGJZyJKk1KVaGPrweV+VLHYSbK1h/+glsBTHW7roPk3fdj7G77kV3
PI+2mGyOHUDEG86fnocnya3qBrcwJAhcvHiBE7eD/fsPoLHVxMbmFiampjB94hjanARripERSpyU
/SYlz1YDdco1YVGtdpOTpQs7CrDUH/DvoQKJ/BgdTibp2Cy1xkMyjSAI0VBbTKSdiiXWtN9sKpDI
xJJOzT4nTpsAuhYHPLsY02QvvVYbW8vLmK1UMcPjGp+cwBaB4NLiAqpkLbMTk8rSXj5CgvDlL38Z
Fz77OQw327CGUpGCLEQM+CJNyUi2VlaxNrGMMkGhwfNZj9WibYq8WFLrPA0GtR3tHCNFD/0q5XfQ
R71r6lCJrBTZ1eBxtsmqZBcdAoiAssCBMJx6p8ljjDSEYIsTfouyelranVHKqt2MbFOqepa4QAhI
NMiYmvz8Cq91k8C1JQ+C15ZUSmg1ubB01Skh5V5yAnwSd+UblivSss/j60gjWst0bJbFQ3oM+hJX
Zu2UoYk1Ns5S04EAq9oFxctJgJQ0KjHGCxj50gqMTMu1jTMnCiKsDptY4Pff5dRQk3sJMd5O42Zt
Tm+GDW5vegmT1MbkUTYUQ01Zyd1RxhzZS++Ldax8/1m89OwTmLvnEPbfNYv95xxszlbhHjqM/sk7
gP0HMXfwMMpHD3GVJPOirMgTOCYmyJzKZZ2cxUpFpU6dN/819UhKS64YM2pQH+LKtUWNUq+Qbezf
N6cNF1ZWyNokKVZy+nhj9wdkCASyyeo49k/NULa01aAsUTtSAyscRNhc38TW4lVlAXMEzKlxMjLK
kWUxOPO1gwQCKZ88RVA6ceQo7iEbklrj9R/8QBtfCGObGp8wnVtwfSTV+g9/gDOf+hM0z5zF8Y98
GEc//CF4/F5tcuqa9JpiqYgS2WHIY1vjuW7w+3yRgGl3mbIkjqc2L8kVlC7U0mVGKo3mpUIDjJNA
wKAs145/C1DF3S5fI6vyfMpPqY8eoysdlAmiUj56dX0FGxNjZKDjKkFrPIZybRzl6pjGQgljW9+q
4+K1a1hrdrApDIvsVxhhn/sQdiRgpVkMkjeZ9+F6pqu0hlZIxrlI9EjK0Ag7jrdtLMkuL9x27Jht
XRe6IpUg8ry/8npZJVrflA4SG2e5lOfx5tHiNdviwtMvJpiQUtkJfqwk6L1ek/3NsKHtOcAatSEP
JG0mP4nwlIfwIGXHw+u8YadQe66Car2GBaxT9lzB1rCLwpk2xv6eqzXpwsoUJ8TsPniHjmDszpOY
ft+jOPbAA4jn9xkjLS/K+PikaYdeb2C1Tzknq6vc0wS23uIi8kUH87bxRuUFfCRxWTx7ZAhSu0pS
fZLIMK2EjKnIz8mFLqvHUuJ7clrkLi446iKXhFpt5kkGJTKkw7/XEmmYAbT47zgn9Mz0jFac6JO5
tMg+SsUS7r77brUZra+v48CBA9etda2Fyzj9mU/h8ne+iwlud/s//aeYuP9+jcK3LTsNFxhoe/ix
sQoisqNVvrbJa1vmcYv8zZnqUSYanCCiAZaSskOmJMGSOcdPI/cTMhEPMzOT2Ny0sLa+qgUGfUrM
PgGv7uTQqRSwsFpHY62O+WoOE3HaDj6XN3YtSsGJmWkUCfatjS0yNbGxbWJpdQ1LjQ62hN0Ojb2v
wM+UCLy2VAMlcxqQuS6vNXh8McYo/aU3oshM3zFAqt5T27QHC8WwD5N6o1xp1HHHScsvx6ZyqhRA
lOaqLhenMBlq4OyAzNeOPS2pU8p7oDJFnSxVzA6J1muLbwCw3sg4rFttY/rxbU63+nj3HmDJesfV
sp70yXg4uYazyL8nD+eXziMZrlBileE/PoujT81hbXETi8O69hk8Nj+FuTWuxCuUGlsvoPfiaaw+
9hU+voqJRx/F7HsfQeXdDyN3+AiZQlW/a5Wsq00kqVtSbM9Df2sJy5/5JHpTkxrx7Pum1USXk8Lj
Q4zpkTCAbps3NieMzRuer/cl+981LbzEgyaxYH6xDGt6AuVJSiyCj5SfEUtUUKygx19Kwpwkiroj
ibfcxxjlrADVCqVhjcC2f98+nWznzp9XYJROL6MxpGy68IW/wrm//BzlWxV3/LOP4cDP/4J6DAWo
tIuN2KSkGitlrIRESH5ch5+l0EWbjwp2mnVISoo0fbXES6a5gbGm5qitSY5S457k5AO0m3VO5IaC
W4HA7Pol9HgdWr0BugSYASWsJK0XpeKBa/L18ny9WimTXZXgEHBigp6AqYCz2BYblJmNQagBqTVK
xgof1fFx7ofSlIC/TJa6uLAKV46B4FhyE8QiB7lojPO7SsWCAoAY3oU1a1CrlswexTkYT69pVE02
RtmYk4KP/O0DsrpYS1bHpnFrWq7aS4FfEvGbAuzSXCPCDYjCNzIO61bbmN48m9mNHu8e9BJCJZu4
1NcoGTrPO5h6uozcb04gqTYRvTfA1a+vYapPVhJWEV2NsTETo/UzNVjfD1Dd4kQtyGoZqNG9fvoM
rjz/PK7+9Zew7z2P4sCD78H44UOIxstoDI38kCaiAaXAoMmV/4Vvwq4VOImLqIpNRKo99KQGuKth
DdJ4UwvScakeSuChZaUVAFytWil15gec+C2J6SpJzqN4zoqwK5Q3Rw4hOX4CredeIGswsUDS9EFa
pRfFW8XzF/knz/siuzi5Tpw4QUlXUjlmQrQSLH/nOzj3Xz6N/oVLOPiP3o8DjzysPQolfECDOTlk
H3NzcxrHleNDSvtJRxyKLa0IEaVttDTXMu8qENtLm7AGZI/FnNraRKp2IwG1gSagi2wWm9e+2RkU
8hWUCmNSVhBzBJ4JssDJQ/MI5yZRkFCHQZcsJ1APnESPlwo5ZW/aJJVsSABYPIZDsUcRUMNhjCJZ
qZsGcVYLZcwdPkoGTem4UcdUraLybZzXoiDHTbDptpuUkF2t3yWhDhrrnljXJSQnaY9IAUNh1aE0
43VtlZcxf3/xOAc9YbV9Ncznps25O5apTJFoWIidxvm9teOw9lqc197uS5iu+HJjiLcnny9jUEtw
OVjHYD3EkW+M8T4sYtgcYP3iCoJmjH35MezLVVHjzbXxfAdXVpso8e8DThle7GIz6mGMN92k5WH9
8jUsnP8jrH7lMRzdtx9FAtZVTurG2bO8UT0EQ0oK8Rodd3HgnhLc74fId/twyxK0yaW1H3Hie+r6
drQ+lJ0yDxMhL3WPvXYfvgQ18u1eNEDUIBiubaIjdds5Wf1L54Cnn0Cw0UI86BEobWUEeUqg8swM
Act4CFvUItIX0Od3iAHeE+YWm6DJ5ktncfpTf4z1J59AmecWXFnE2rPPUA4+gFxtHG7k65WUMISA
zKHVaaImjDAxbdGkvnmUdrHR1BYJLqUESpo9Us46bAIXJktq0yk5mlGo5+hyu0qpiIO8dkNlfHk+
Clp2eowgN00AaBD46lxkmpSLAUGyUBInwjgmxmsanBlLf0DKLjkTBXjX02sqAFLh8zGCeqlQ0PCN
mWoFNQHfbhdHfRf7CYa2FZnOz3L8eQdtD7rgyE8hZWJs20S1a66h/j6JiZUTpwIXpHy+mCZyiwTm
cYQS/xVgs97Dympba4HlCWyF2Sn1dgqoejnjidzuXP0Oirv6SXz/nkt+loc0JJWW84XCHIqDAhYX
u+j8303st8g+3jWJYpU3WbKCaFDHNLlDrT+OsWUbqwSWK1EbwcDCIbKamnjFgrYC0uFcEdO8aS+v
r+LFpQWMC7vRVBNbWVCYpNUFPLnhB3DaA9hBDnHRIrAMNa1EIu3jTpwW03QAiYYukY15zg7r5wou
3VYsSiOxe0gDB1e6/IxVUK6MqS3Ju7aqAa1iWB5GoQLT7MysBnCKy16aImjTBAkVEJklHkd+6aC+
hQuf+yyufPnLPLY+gc7GYOESzn/iP6MwMYsjv/orGnGuMWkElVanhdW1VU66PCaHkTY/TWPlt6tF
qUctLcESbTWRbDXgHZpS75vDCW2qWphQcjHC52slDCVOTGKxpKsOQSSMycAsnocn5Z+BQpESMFfB
1MwEpico2Qr8HFmbln+RgFiCRC8YqPSqkTFN1Xoa1T5Rq6JS4XUSb6pLYO02UOJ1OljNI4hc7U4k
8VziCZVSQhZZmzA3sfeJjc1UhYjTKH/bBK2KnEu78uQoL8WO1W03yCgH2m1tyB++3upTOoc6W1qt
DiYJsCLTRTaWyfrKYuSXAGBrb4PVG9l38FZ9/54CLFPuhZLFdbBFSVB0CqhVx9De2MTZjQ00vS6O
92qYdY4jHk+w1llHo9vC7GSC/b9wCHedJ53/whIudLjKcyW/nSxttlDD1aCDNrfb5xdwj1fDEoFo
M+hpl2Oxhsd2WprFidE908Hykkv2NoX8FFne2hria3Xt6jOQNl3SLkoNvVIXiqsvmYTm6uUoOYpk
HDzWsCMxWIkW6yv7JUxUZsjUqly+8yoXQ+3jt5PzKHaVoQRIEsxarRZW+J1jY2M4cfw4Fq5cwXqj
odJw65vfwPk//hSwtIKy5u8RHAoW2qefw9k//xzGTt2HmXvv3ulUI52OReYIAEb9FKx2ZxpuwxbP
jwyo3kVw/hoKdx4GSmR1PFZ5VxijSiSkFQ9SJmxSlqThakA2kqBUMQ0qNI6OcrJY9FAuSOKxo0nG
o+7N4l1ttFoKxMW8j8mxMsEo4XaeBoN6IsHEGB6bnMRIG6lGaXljYXvGiJ7PlbRnpXhChaWFQ9Ow
ItTcv7SmmGUqkmqWgfQM8EwJG5HOjspSJ60AIZ7DnfLKIiF9sukJMsmxIT8RDbW+/t4OYbB+YuH6
b6++hLtxWKg3pUizNo813kFTvEnKpUk0qxO42NxAb62Pk2OzmNh3Jwat0whmelhKHE60LRzqVXH3
2DTyoYfT7Tp+yBv4eImysVDBUreO870G5rjyH/KKmOWN+NKwCxNcYMLTJagwye+Hf+xO2IcO4PK1
y5zw4yjM3IGXNtfgH9yP2TvvwCplU4VAOjszhwYBStufc1Jtra8hLy79ly7g2uUFVLj6l6VzMSdo
fPkyhtymJ1HWEpdkm0qZVtrXb4OAvL6ygkvcbmlpGQ89/AiuXr2Kb377W6hOTGCeV+fFT30a9eee
Q40SyUtz4WQi2+UC8tMTcPP5beSXtJM22YKkvmi3Zk3rSWtvWqOkbFM9Qb2EwhK5bXjhGuL1Buzq
nCmIODT5gq6WYzF2HfM5RwIBNKPAUxZi8v+QtpzX9l8CZFagfWKRGrwlwbndbKFB2Sh2RgkXqeSF
tZkW8gJWIhOlRpVjmxLHEm7hRVwsQkfC3MlEi6mnjWDK5668JmVsYgexyPUw7VOoNeQt/fx25dS0
PpZCrpTcJpAW+PleyjLVm2iZxPQaF6BZLprFnoXkbZADuBfqbbl7DK9UegwluHJ6HnVOxNagi4mE
N/LkFLytDSw2NtGJBjhWnEJt/j7k37uOq0+t4cwXmgjGgMPVEo4n03pzPt2r45nuFo7HZUyJl483
5MKghU1roBJxPydKJeCtG0ibK0qCqRlUf/GXMPPBD6Dfj/CNv/4KTjx0GA8+8jB++L3vYnxqGvGJ
Y7j0wgu48/Y74B49hie++hhlzwROHD6Ma2fP4siB/eiev4SVZ17A4TuOo79wHk98+xuY53lVMdTm
rLHbG5FkU1iPx7q2vo7l5SVlFPPz86iN1SiFFzFOpnWQUunin34aS3/zt9p+y4Wp6SXBkIE0k6kW
MXfqLowdO/wjjml7ZM8B0iamJv0pHtXi2tWlWXsvbjYQXFmBd3gerjR/jdua/6hVRrVEsqOxV1Lo
NCBwB9I+TIO4XFN62E4boaYF3DWvMjZ9BQXIlF1RemoslzaftRSc8jBgIe3ElGnlCmpIt9KOOomm
+ZicpyRt56YF+4RIWcYup41exWEj6USyiHjudgcdrVDqmH6HVpoELhJfsDTnm2liamKZjtCSfzoV
u5gdUNaH8S0JGd1rcVg/iVxDd8+tAFrf20V9eg5rs1Nw2000BhGqvGP8sRlY9TUsNNZR5516vLIf
+7ZqiAIH7fEczvFGHPDGPeT6mJmYwp1NG2dbm3i+38D+MIcTbhmeb+PSoI16d6AR1+Kpk3xAMWK5
1RoqDz2E/Kl70b+2isbUFFpz8/DvvAdTPK6KxARxErVEbnBCbfV6+O6Lp3Hb4SO4jXKsT9YVVMZQ
vv1Ors5VTDxwCs8/PYavkzF94N77cOTIIbQvnEXui1+FdfVbOmm0qjOPeX1zE5cXrmBmZlZlyerK
Kv+eQYmg9OJffQ7rZFc1SkXJoxNDvdavE2O4JBMTBFe/9Q3MPPwQJh94UOWMJCOfPHlyu8WVyqlR
SR3r+sfo6kskedIiCF1ahfNgpLXlnUFPC+xZyU7RHnX926Yonq32stD8dg4URF1JGpaEcy0WakJD
NNo9CNEj6+u0u7vKGEcmCt02FSUk0lxYlrY7kzguAS0rrQEvjDIMVc7JOYnHcSi9LKNku+29NSr5
IGEd0hRWE6y7RlImcSpmzUovAanq5BGvIa9joeChRHmpNcCSIarisBnyOghg2TcaM/X2iMNK0iq2
N7q/W2Uj23NhDVIyJiFgbZBRLc4fQoHyIdcL0CRg5KRyQW0C/fYUNprraJIUbV2ehUsGFR2/htXO
JtrtIdpcZffHQ+2EHBLYnuvXcUG8csMEBwhmR8gG1nhTXu130JC68E7OJCgHfbTPvIAtUQ9kGrdf
u4pKu4GtMEBpeQWlYhFBnuzi/AV0C0V4UwSn+gacQh7BxQuIXuRn11ZQJFhWhx3p8oqxchlHT92P
8Xc/gvH77sXYQz+FsY0B4u/8AHGrqRIlShNxRbaJzOsSgIaUS9Iy/jJl4dLjX4d/8bJKH3HnW2ki
rkR9+6mrfplMb+LBd2P83vtTwKrirrvuUum1xWuo1QxSXaN1wbZbyiOt8prWmG/3Ea1sAX1KOb9q
yh0nJsVldBOKTFPo007QrlbXEHYl0kvYoildbIzdkjMYBlIwT8q2ROg2GpTIA1M2KDKVLVRm7gpQ
EomteYkCfpapbKo16GES3SWBncTYhK6kVcQkWDS2DCgJOAnouG5O2WUg6VTbHsO0QplW74jRk4oS
/M6pyTImx6qa69gXGcxXJyMHE2Tf4pkMrbdCPaw3Lw7rzck13OsMSwvsJRoX1RmvkeHMwqFscyX9
QlZoWcklV647CbczgwYZzjWC2ywBp9w/gu7GFU72EJe4iveDDuZ5Q3vc/lCnh0vdTSyGfYSk+4f4
+qF6mzd0CWcl9UPMLQSLsLGKzT///+CUaxgn0N1J0JMs/+53/w5laVgqVmvXw+38xz93GnYlj59f
34C7soz+S2cxRrCypQM02eHBSgnJuecwy/38NCdN8fTTaHYayE9PaSdnsWGFMIGIwlRmJdKdk0gi
w2XSTXM7Kd8yf/wEnEcfxaXz500H7FEtemFEYg+T2k783Ng9d2OCAGU5ptDhSAru27cfE5MDtM5d
1G7Ko4KCo1I2WiNsVLXBMvFlCQEuqZNHxpNp6XjTAEKknZs2jlBbj3R9FmN6Gvu1Y9CHgpNpjiM1
pvpaaUGaamAgadwp00uDNV3HSEktw6w9C0P14LlpLX8tZSyVFbTiKK+btGWLrO02YwLAjspcU+Md
aTNWqZUlcWiyEERSSy21+4166YgEbDZ7mh+6b3oCU5Tf4l3t8v6YIjM82HNQkm5K9o82a30nxGH9
JHIN95wkVNuCKLRCGcOa5KIVcThHKbG1Ad/KYdAfcMX2cHzqCNqtLkGK7MHLI28dhL8xpY0WNijB
yhMTWOk20bm8gGnkcXL/NM6tX8Uwl8Pi8hVUPv8YjpQnUQ26BENOZMej/Bkid+UKpdFVXrmC8T5J
n75BoMgS9/g+1/JjZE3RylXtpHMbZYeARpfgNpvjVOwP4Z4/pw1YxfMnssUv5tHzfXRKFVjzc9i8
tgJL0kCkzpYm5roYr9VQ5L4EvKTuk+Q9imu9x2sQffjDaF5ZwNZXvqLxWyKbNHOIn+1JWeHJMez7
pY9i30//rDGu76rmIGlBsj8T7Jo2h0iXQXvbjhbvSEXH9E4crG8iN9ifSoOdZVOOz5OEZt8zrCuQ
BPCehhpolL0kKKutKDJlZcj+hJFptYQw1lYhuTT+qmP11aMXjeSqCUXXwoBip0Jiqkjo+doGlEZV
99Rwbo+klQkQFbAJI9OoIpb0Ke7D470hJXg0BswyifVpDx4NexCAzJO5SvyXJ2EfksHA7Q6QUs31
Yw1nGDpvTYv727GP4d5MfhbmYPno2RILAxyruVhqUq51B5wgvMHzZRy//QCWL1zGmc0tdPxI+/WF
XCGb7SbaEstz6h4k3RYWZTK5Zdz9gUcxvXyVN6+H1sUX8NQX/xYFYQdkaNYwMNNYK5DWUClInh1v
XvGO6SptitJF0v9QygPDBF7GloumyAcxhIuhWTpSub7aUaR6gy1eMKmI1W+rnWcgtcQvnBZnHN8b
Gm9aWqtcwLFYLKhMcbiyFykH5X1x/0+cPInqv/gXeHptDetf/7pWGB1VJBBDsoRnNJZW0SXIVA6V
tnv6yRCP4/L6mjI9ievCyHSSduUynkoTx6199mxHwyFiSkJpTbbdJUcrOqTyTctKm8BZbQVGydeX
Kg5qyyoomMjEl+qdAYFMKrt6vO69oGdCCLTNlgknkMJ9w35P46MkhzBHYNfigBK1Ly3U0oBQk7ts
5J7Wcd8uxWzquksw60BjvIamd6F2e45MhLsjhQgDU3gxLT1j6meFvAeksWpe62Jpxx2e20zs4ljH
0pzL2HrrgtVbv4/hOwGwUuuuXBCxT7TIqC431tBc20KrFymodOwyzl5aw5WzF9AIXY1/6rUbWmGz
zZWxHXtY3GqixIntzx5AmyD37OWr2maqyBu2N7DRmjyA05wJkp6Ti9N2URI8qWEHiSbE2lIYTjpN
9wiUkmybeqyG2m8PKsVCKfgpxmKCVUGLxVlpPh+ZgTR0zXkG8IR1OInKGp8SCdu9E0zNc6nuMHou
aThqLO73USVT0w4xj7wHx3/j11FfWED70iU9t1Et+nCjjq0XzqG1tKKVS91dnXOkZMwYWZortqmU
ndhpB5w4nfDG1T8q/Wxkl6S7II2BclJQEBvRyHgtfR8jgtqA8rvdaKLX1CLwBAHKcAmvkARskXwE
dd/1TTVYe2j4nLIqE8wpslei1UWeBYOIoDVUtlXIB8hLWpE4AmLDiBJ1UJiWYdqCPky7QKePOC3L
vN1sNYq28zBdz1R3EMlup52AxE4Ykn16tjlX8ZwW/AKOkNzt05JCfM0Fbp1p/K0WV2X9hL//bQBY
ph67Wc0lG3+rk+CJa9JaXnLBTAG7VjfE1dOr2FxPMD49gX5SQL3fNUmr+XE0KRlXl9qo5F3MVKaQ
cEI3nr3A1VS8jZw0awS3o3djo9dAd9CC00mbDMTCFAK0hpF6A/OUoNJRukR5KiuwNCf1amVOpKJW
EBCpZdvS4UUSogfKCgUsEsq2IOyR9Q0JdJSI0oWZE2LgkcUViqZ7sp1WLeXfzU4bjYsXNH9QwYkT
VAJIRU5NT0+jSrlY4+PYL34Um+fO4cwn/hCDXkulUl/qj+8/hEOPPgpvbhYtMh0/TfSVibpvfh6z
c/NYe+4FjTBPUTHtMoPtmKz/n703f7Lkus7Ezs3t7fVq6+odQAMNggBIggIpUpRoUSMpZuQYhz0z
mglpxr/4T/F/4bAd4bDDI2s0Yc84ZuywLYmyRUmUxBUEQBDdQAON3qu61rcvmXl9vnPuzcxX3U2i
gWqgG6wmH6q76lW+fPnyfvcs3/k+6z38XPiVO9fm3A1DA6NQlgpQQ2TAtVND0+GY+nv71N8/4L8P
BbCQlrVNKFpTiJpAWkWNSsCzbSiq7QtICcBIfSoQBjqOP+HNCXLJ+D6UIEB3AHCKYW2oZhgAKQgj
oiY252s7d18RlWHwHECWuihs7lj14tEIkmgYuYZBUAxD+0gVaWhqY3F7vjCx1EEkH3gfTHukUHNv
dPPRnv9Z9DF88mYJrZo41Tj7aomxJe+E7RNUX95gwHA1BgaLKDO0vLLKAAW2OVETqQTfZMuczi1t
zGg0z6VucX04p84qBoBbZCecLvZ2qdHk33muS5PeXcp2OfLavcvAElPOkZq9cJqC8yeovb5Bre4q
tVfWqbNxmurtJQbCGR+vT73pXKKg8yfWacQpaTib0EmOhN689I5wk168+Cx1eZHMdrYo39kl4mgv
5ecQbOtvfECTg1symoNoDDN21+/cpr//q7+iuzdvigYUJFPw/SiKZYD5qaeepgvPXqDz556il/75
v6D+T9+i23/+ZxKpxHwOz/7BP6fzv/9PKVjtyiDvTDz+MlUv5QgL6eUOlW41pcWGtzxTyRVZGokR
8bopg7oAU+js30nTQnQk8776Bo4YHAFY+3wN0NlM6gk1OkucYiUcdYbSWLCI1FCcFzJrKvrs2wf8
O4O+0DMSTgNRO0IBHunccDTg4xtVU4DrdYR7ImbA0k4moigAFDqEYMoD1CeQ0uHvj1NNCfE6SGsB
VrPpUKKsQOSQQ/57qM7SVjWxUDeEmeyII8PmzND6NKIT+5yWox4WmyJ1Pvqaj3lIXpP5zPkYfgYA
iwrzgJxvNjtFusbpVUtrGTC6hN17q5bTy90GXVxK6Mqta3T7YI9W6x0K+AZ7eg0LtEs3trZl3OS1
Wwe0euo5ak9TGvV2aM6pYzhBqpdSvH+CgvffpOwqR10MQmF3jdb/4L+kM1/9Gq2vrojMSY0BxDRb
Ykm/c+MG/cW/+3f0V3/1Hfrmf/JN+q/+4e/Rpe//UNKb3/qt36S3bv+PdHX3Pbrwla/Tc5/7HKW8
+LKxOsyga2YZ7Lb//m/ozX/zJ5Tdfa0YqJWowEUO0E0PnfrnXIwZrIDB7s6OREtrX36Vnvkn/4S2
377EqeEHdPbp8/T073yL4vNnacRRTuBJmuSkVOoAv5oWoosB3lLMzktSF93DWsARZ0r28i3KXzpD
dH5FUl4Us3WeckaGzxPNjx5HVnc3t0SvCynvmZXz1OBIEEB10O+JvlVzqSPcJpzL5q1NevvKVf7M
NjlNn0tToV4LncONUjVQhB9wirjP76XRrIsMsnV8NV+zQrQ642PjMcU1S7U+OAVgZeqViEgK0tiI
fj2FQJoMoRbEJjOnv8Upayoa75ZOjzN6mgG/MbFltvPQFPeH4WE9+PkPrhE9TN3pUfsY/pIDlnFW
7+BhDffGND3oU7OGKMSIkmcGJUqpvSByWKJWMKeDm9c5qhjR0nIuapejeY06J09RZz6kOu/0q8GU
F4ahsIZuUZtmdRIpkzjkaKAPnaqma9lnMrDceO7z1L74Mr9mQFGi0rze/Rgf993bd+jSWz+lr33l
Vfm9ty6/Ld2vX/v612jc69Ota9dpwIsVAn4hR2hZVz8E73Z+iqOktVscdb1+mVJelDjGmdOn6GtL
Xdp75hkGp7EYUID4efv2TeE2ra2tCbtcitH8/M43f4M2/vHvUf+P/g0d3LlLW2+9RfVXXuXzbUjk
gYWKyKGztCRghWNkogvveFjkvfzMPTdx4NyQ0/fv0PwHl8h0v0SBAE4qI0Uyn5da6vF7vHb9Gm1t
3pUo6dSZ0yLQF3JUBAXQHY4sb93ZotX1E/xYpSFHYx+8f53ev75JOxz1DhHBcCpci8bUbcb8lUEE
554q+xxaWYPRRLp3pjhnXYKImDB8DWNUaMsjxZSCO8CqYqiKSAsRIVJBASsR99M0tA/F095YlDBa
DOpPRU361Wmdzk+0LpgFH7V29TA8rAc//8E1InME53IMWEeW3ctua2E2kFErzKldD2hjFSqToRAO
IaE75tTvZq9H79y4Ru/e2KZnnz5HE85rDgZj2utzmmIDTikNRxxzanLUVTdTqicALA7/G5Hc3IgC
xnZEs8j1xqNQ+EKDn7zOi3FfduEZirUyMsIpJC/a+XhILzL4Jd/6Tfr1l16mfH+Puii4txriDvPl
r3yVOligG6doxuc329sVdQJ00aTbtNSkuN2hZHWN06RE7lmkJYim4rl2tABgSGU2ePF3u0tSO2vz
7ywvd6WrNeB0Kj6xQRf/xR/S+N0P6Oaf/Sn97I/+LTXOXaBTv/t7NOMFGGZzASoc14/laEtfF0qw
GGNRafjqKAMNThD3x5S/c4vMV55l0OrI+5ACPQPWiKPGqzeu09Xbt6jNKeCZZ5+j9ZMnJCWc5crJ
gmJoba+ntmGcgu0ywN2GvhlHakPeHG7tQ4ZmQg2+7mdPdKjTiGkwHAsYQdpZdORBNEXEaYw0VMgV
3dNUH4iS4LSj0dZcCbgOZcDdQoMAhfVYuGOkChmomdWadK6+QkucBqKWdoYB+lezmF6cBRRbPlaY
P5L068PVfKoGuZ9tH8MnHrC8XG8cZHR2gxfxep1mW7fp+u6E2rz41la7tL5U4101oK29EV0d8M21
skF7UYtBgXfLpWUGuJhmbQYQjIcw8K012lTv1GTBIsVKGXQwh1bjCCZo1EXDHAJtIITagwMa/Ol/
pN5qU1b3ZJapEiVMC+Bnx3fPr/AN9JW1k9T9yY9o/vab9OuDkZi+jv7s/6ZXnnqKvvyrv0KN/V06
+MlrNNvclE5aBqeZ3jZRkxfOqVPUf+0tkWMOqHSPluiBAQnrsunE9zDTdolTv83NOxxlrQrje85R
JGpU3Ze+QM//wR/Q4IOrtPPmT+ndP/kTSs6dp6WXXhJN8rYU96sFYyt2ZAJcplxAprLd+5QcKVIG
7hNHUnDfhkFs7swWUUO6xVHmu5yONhhEL3zhJWpxdJiGYJ8bIf6iVt1eWaZzDEb7ewfSUc0ZtFK+
jjBFPeBUGcJ7OpLDAAgKRaYu0hiXEjMJAC8fE2nykEEL5YBInIdcMZ03iAlSQAAWiu6IroyLYtw7
BviBhxZxpO2F/DAc3Wh16AtLKZ2oM6DxJthJI1qFCoRlAAvdtXINCfMJTj3/MtasnvwuoTUyJ7fU
CGnCC3zI6c21qzdpn3fkFgPRKd7JwZvZ3x+JFRS6atd7d0RviYMWqWdMUhiRZhK9tLsxmd5dEcXb
3tnmlIvTx3aXnoZdGIPWNUjGyELlFHAyJbp9g4Jxneohp4OZLeo8uHFrHOWtxXUK9gc0fPddAquo
W2sI+bD/7T+l7MQqNU6u0j5USadWpE9ACo34NUfX+fn7nGYxGPX2+bwnY+EjIf2DwuX5s2co4MU5
5u8jOlpZWaHhaEgHDKLoEGIsCFFDxJEioiwI253gSO9zN67Sm//tf0/X/+o7DFYv0gvnzxKjm2vr
pxJlhJWUtuBbPaAjXS4RNwpjHctbKAGWr/mArt24QTNOD1949lnqcrQoXCoAe2BlMNuKOCCn3fxe
lwA6M07X+Xou9Ud0++6OKorWtQOIc4NeWQwKisgSkxTYsUkIzYRIIuIJiLagW4DmwE/C5pEazJ1q
Z9K6VK+oOzmWvXQPY94InD8lNqaEP8PVcEDP5uCE8eefM9jy+c5CL3GkYOU5aEcLWg9bszqK+tkx
YD3i1NBQg2/GbhzQ+ulTdIJTkttbm7S5tUVbdzbFHw/DwfPhDAhFUyze02c5HeQ0jBd5HRFW0qTl
pQ6trnfF2BNDzy2OPM4w4K3xIjuxskS1dCaLxEuthEZldG2K8RFVDJBBWF742Nlxs3PeIzd5C4Jw
SJNGY5l3a6D4++4Vmrz5E5k7S1tLUIwTLfh6I6F6zNFJjaO/KUdkk6muKQYBLEYsiDOnTisBk6MJ
pILo7IGfdObMGRmC1ple5WthLAaEUrO8TJ//w39FB5cu09t/9Mc0u31bzBnG4ymluQKfOGPXAtmx
rSvyGregvX+0/m8xSQxckR5KDaA6yHwg/xvHRlG8vbwqkdVURPwUZMgVxFVDTzy15LoDyBp8UdBZ
XeL0dqXTFWBGBAXVUdSRMDCNcxWqh9GZwbm8fqq2XAFoD2OOxsbSSUXaCFBEaoiUU2pvkZ5jNldu
mxhTgIuFKDFxM5AYqkZNi5+Dgn0o0WPo1CsWdk6VmznyCOtha1ZHUT87BqxHVnSXVn1m6BxHP+vr
yxQmGLDt0gsX1hmonuIFPRV7qGu3b9HO5g5t37lLmzcHdLB7nfbvHsgOXFut08qZVXr6zCnaWOty
ClCjDoMX5Iah5olUCdpRZpBzdBMWS5bE+y7hG3VOGact88FQCrU5ROE4bcE66Cc1EfBrdloKHnEo
SpRRd5nqZpUmNzZpsrvDO/ZIfh81mGHAr9OI4Z1FAb9uCAAJ5q5DqODR4hTuFECLXw+Md0QHSwxc
Tz39lIApOF9LoAzw4sZ9PRTr95S6z12k5/7Z78vw8YXf/V1OxVbFPXnCx4klmqip5pYvZHlFg6Jr
uGjC7iMUSRdz1ZXybX2BdcjLALTrdZFYHgyHAhpdBqO6FOdVhlnds7RAjxQc4AuIXFtdleegiwiC
LdK8QLqQc9c9U/Y/OR11sPhR/4NRa8AR2QF/9ijOnzp1kjpRm/I5ojdVb4VxBK4bvmftoR4d2O0A
Q0TKHH0no7l2E5PA4URZLyo6eY8kHXx8eVUPe76P4vlPHA8LO2zMjy7f/LOlJg0n+3xjz8Stt7u+
IozlnM5Tf3JRVAj24bjS44jr5h2OtKa0gYjs1AY1GwwovKhg7QUREevoEtBfz/KZGG4mtVCGeWUd
B5r2mAz66Qw3U16IjEQWFvWNBtW7axS2lyhtc2rGqQ6GqMdwX2l1yHZ54bQaUjMLVu9QcneP6uAz
8Tua8vkNIFaXjcjOB5TtHJDtO+1PU+6oANEugyo5009hiTsBOwE0jipipEO4PkkiiqSQT8avn/sH
v0UnfuXL1GCwMvUGNSQdzOXniBhzKoeStVZYGVT2GjOm/Fmh4iCmq0oetaL0ie5sU5jzM5lnNJya
H9DVq9cYcFv09PlztLrCwI0OKdZepmoN0+lEABfzhBvrq9Tmz3Z7Z1c6jTJqg+uWGpWI8QPKRr8a
vTjqCQhuF28wsK3H6yBSnsKtZzwSQJIaVwpQVet66NsYB77WaYFJJM2RbDidOtuu8LhGdUTnexTP
fyI13ZFdwDMOrZ0pdI1cJw1phhRY+SZfb7WpCVVK/vlJTk9eeOoZLayi7oHQXzRvOSKajGRnxfhF
Q5QstTYCc4FI/PkCXSD4XczRddcpXTtNwYkVam2coRqcZ7orRHGDZgCl5SWOkhpinTXvjzhyalKD
o4ZJzqnYqC+qnWCDQxEUWlbQaV/iNHAw7HP09T4N3nyD6PVLlA+u64hLGdao2QFp6oZ0CTWZOqgW
AN5avYgUpCidJMXAcHNlTR7yHkB74EgMhWnRaa/UsILqjVK+bLVHu1DjQm6H9Dh330eqV+fPYYM3
hP3hSLpuKFpv392hrfkubd3YF2ONE6c36PNPn6VuPVHVBn4e9ODDZiyg0qgzgI3H/BjBu0NoIca5
1GS5yu3MMx0BkkFqAFauAIoIDyAOyRpEos1GjUFTP/fAifcJe99YN3aUl/eWe18Yysb8qPHPPfK7
+H4p2lHoYX1yvKqHrakd1fOfPLUGcnrcTooXNlHw/8OCFdtPRCC869/e3JRO1Y1bd3gjNZIiwOsO
GugAqKhdp9XTJ4Vs2Wm2VQ6Xd/ilZl3ndpFa8U4stRbc2Bj07TSp+bvfpI2vvkInzj5L0XJXOomo
XfX7A472xrLbIy21MQPR6acoY2DZz51CQGtJTWDnU0mRVrtdTUN40a0gOhgMaHrnNr39r/81mf/h
f+J/972iOhXjMT72cTuO7Q1peGdHdO4l4gp1aBgpIB7zwZjsRN9HtMwgDqlkeCSKDtRUFRKSsOCH
GlPlYRXrqNgN/VlgwBm/m/Wnktph6BtTBhCrWlrpSp0OtT00Az538TkyaUS97SH98M2f0RvvvkfD
/Kv00vPPUoIaEwweUlWEQOSXjmfy78DLvIj5hpvPTB2TfcYpOGgHmWqvL3P6vYy5SqNjNRgW7zB4
9pDuikaP0XTSlLrzPmIUwUEHyHLtOGUM8Pq2jDYfdY3qaPSwPn3fwEf9/CfS+VluNCefAslbErG2
qURWYjHO0cXmrVv01huvU5DUhahYa9bE8eTO1l25mS2nG3aa0rOnztGppRUGuZxaSURtjk7A6cHo
yIwmomaHWgZyDss7du3Fz1P7i1+huLlEb79zmd7hB/z+IG28zAAEusA2v8bZsxxBPP88/ZgjJjjT
nD1zllY4VcLuf+vOTeFSWZF3Senzn3+BXnr5C9TgSC3odKl59rwI39n73ITVihKiR8sR2+TurkRw
UOxMMe4SauQVcJQ43trnFIevC597EnH0tb4M32NZ1Bh5gVqCdcXmQsldiskLaFWcicInnwV0dfj6
0VafcgBOI3TUAEv1utYEEQ1hAqAJ70XeDJILAT11okNvvvMuzQ72aeugLyM2mCKIhhNKp2MajGEI
MqY+R1cDzFxmyqEai7FqKi428m/QNyD6x++7zZsP5HeQFg8YzDp8Dc+eOS3SxqmTr5Fb3bgBI+O7
oYXFhos+Id3P3+Hjh1AfDcwnviE/6b6BH//5P59n9kQaqdoKcIGhLZ0eq1wbuK+0ebGeP32G9i8e
iAEqFChr/L0Ydk9L6uqM6g525VX+3hrvxAAqdIQgv4uIB1P7Q9FUcgmPpBAMMFO4AU/EeHTCi663
s61Suvzay5xqBS5NW1lfpxh1NkRzEN3j7+8fHLjGQS4FZTg5T3nhDTnKs7CmijOxqZJRHevhKi+T
YVv1ALUSWXQ4vUo6bRr3+5TyI0LEgs5arSbjLLDdwnuvrS5TxBFi6Lp1EonC1MFFGIsCdDqmImU7
ewglHWpC3930Gag2e5y+TuAfrwYhbgYPdSgoc04BiDaV4eS1lTadWX2Rnjm3QVdvbNH+7W2ac1oY
xLypQAKHr8+Nmzdpa3+fRtBPjhVYca0GA6TNE752plCVaMDqjcFwZWWJo9UVma1EDe0Mp6RnGLAO
dnfELiyXCYkyPsx9ziURTShAho5sTjoxgeF0cbI2T35X7UmrUf+iGteTV3Rf+LeVwjXeI2a95rnW
VAAg586cp954Qq/zbg45GMjhpqlab6EI2+EFvHH2JKcsNTHgrCWBs6oyYtQK5vyU1JY8L7pEmd7U
GA5hEHr5lVfo4vMXZTAXf6RDR+pWjDk47NBf/fKr0nYHN2g0nUkdph6HIl0sg7q8qBEZ1FptUt0D
fT27ENXYkrVZgJYRLlKNIxl05ABG+byrKp1BJGkzhrtx/mG9Ic8JvQKBr1EhQnUaWPfE3uaw4Npi
PcV6sbxtTlt3+2TWl5xHiOvABSqFk6Yz5V9FqnTKoRatnT5F9UaHdjkyHHNUGCQtoSA0EchC1YKj
nARyPRhu5tcdD4cy2dCsa3cwgKFtI2FQbEitEdZhNSmoz2VM6ZlnnpET2IEW2nisQ9RS+1MZaOOV
JyhwHVIjgIVuLrhuNXQnrS02x8e7qvvZoC18Rn0JbVGQBAhgcc+wMzqGtmiIB67tDQt0TsGaHEVh
EHeKkZ3hQAqv65w+nDl1ks6dZsCCrAjpXJl40Bmd6wsdMASy8rToDrAB2RE1oJCP1+QnLWMURGgN
ExCBhLA5G/f4tfqUcapUt4HwsEIGsOV2V0Z44sTxlpZXyZxYFeWA+e4uGXgTBj6C1NhK+oW2zMuk
oAzFTat6TlhwsTgQM1jWQodmgVPp1KuWWeULwdgURFQSeRYGA1ABHKXBLNh6mWIzsIW7hD0U6VoZ
hDYHQ7Lvb5I9t6Zp7Fw1suZibjEXkIR6aBJEOsQtsscchS61aIOvJUiZQVSXMzh1ckNS572DnvDI
MKw96g+oF/doygCXh1a7tYFzuEHkxBE1zGFzlZCn1eWuaGTtcnS1swOViKncJ9iorOtMApm8rpcH
rMBJMBsG2CaDVkJ2YQE9rivis/Lns+lL6DhCAlDYZTG0227LVD1qDiAAguA34ZtzimFljj6effEl
xpEZ3bl9h1IGpKc4/XrpuQvUbLdomXfoDK7J8ymnbdCqUjVxGY6FO7PwigLnRxdJ2ja59BYd7N+k
bHuLdvu7xP+gfG9McwawYDSmmNMWm49UXnBmacJACGE+KJQ2wyZFSY0GSDkZYJKnzxOdPUszTndm
HK10/tE/oubXv0E1sOPxPvgtT/ic0Kr30TIAbCR66Jw+crqDBbcUa71IOGowneD3PhPCplIBEHEB
mPHzg/FQiuTLMGEooivnuVeAl8JT7ucL78kJ3fc44on7nIq/c4dmnztD2ZkVZ2xqJcrETdjk64pm
RkjlrB8cZgQXIxfpBamQbRkBaTlaplanRZ1ei/b3dmnAEVSNgXg0nTIIphxFz+V9YwYQCCXu13Es
77lWQ0pYE5rEHnS4cF1RzHf2YpDPycRVx0WB8n2fEho5Zm2i8kRB/mkB1sPylB6343/01//s+RIa
dTNB6rfdO6D6aEARg0gttWLpjiLsZDrXWhNGMqBAkFoRlmu0lqTesbG+Tu16TZxcsuFI1B+QiGEg
WGyirJH5NIAEWOaIEoQegMV9sEcH//uf8EIZSa0pxqQ/L55orBc6E6E3ksilzgsnynSObcqANZxb
Gs/F6UqaajHqL9ffky7imKOrCeo4p07QyVe+JOAbuBqWxejIcEwzjjREhhmXwKeguXa8oLGeSrqK
56s4nSd/knOIgeux0DeshiIZX6cxZiEFMPiacupks7leD5M5ZVfXoXzQzmc0Uow3Qcm4S9O1psq7
zDK5FoisIDOdBKGrxoHpnip0yYQAMfikQkEwHIliXApNAIDabD4Rg48ahtHTiIbZSAAl8xLIfH6I
pABWuFYQJew06zJrORz0JUIbzibCsQuDWCI7gJqI+uWpgLhOPGv9Ct3HKT9/iVE6SZUUS8EnvR+X
aZF5BDysvFIjMp8Cz+soXv/JqmEBOHihhwwWe//bf6DR975HsViPG9pj8NjJZnyTzqX9rXzHgGZw
jZFZEMykGdrmO/ptAAqsxp1UCmoskkoiJQQtiBcOFvFkMqSdd65QB+kTxkT4dYOr1/lM5tTDsDOO
bxNJubBA54aXhwQtMUVTtcvKs0DIihgWzhJd5NbqJF4CygGE5jiNTOu86L77d9Tqj+jmD35CNQaU
U7AYe/8DuvQ//y90Z2NdOoowncJcG5SZIbQCGlHmFpdERKJ1ZVwqq0J9xc6FNDTUtDHLVP9c/AY5
+rrz3ns056ixLWmSVtuNF+4rxZ/u7VhCIHHIwP3OJqXPrFHabYlll7jdcBqMWqCci6sHiZSyVZ0p
Gf/JUlESRdQDkAXVAvQTMN91iDml4XTMERaDts2cyKDViQWOqOSzM8pLA00Nv9/n63nAoAWLLnRM
cV3QWbSSEs/lmgWxOjiTqy/CEGQGAw9bo+aYQQ4M/NA8Eli6f0q3WMOxzqbtKH0JP80M8qhe/4mL
sAxSjOmIav/2P1DfTBmkMtrjhbeDB9/wA+sMIEpjmEXmduUWkMUYLAoDkpZIdDTFwLorpXVO0VCD
iW3ozBHqtDvnKI936j2OgAbYnTH5j/1cuk/TQtfN+OOSdcV0UfVS+ykRpcul8wXgyv/iO2S+/R1O
Sfh1+blroCbcuEFX/uiPqYb6D7+3AS/2A164B5BxQaPB1bqsoaLTZ7ww1D1tClPRZihTPaSCImPD
d0M3TigxyvAPqpIy9wvj8TIM0BFHj42rd2l86RbNXrnAqV5I+Sx1M3qBptg4yUAL70jLADRob6AW
JQV5YeeqczReVZQUcnVUxqYzTTXVNGL7hflCx1lCrS7U94xordcfClgdcEQ64U0MjjgheFy8mSH9
J8j0CMcukM9KNhrI1oKxj0J/HlGDd4MQUXpgjtTM9OfXnWxlY6DH1Jfw03/9J7DobsS4ssk76VI2
lVmyKfTQGTym1joDF4WmoPLZ53Tv6MlCvaYCaFWT9gbv0O0kElWBJigPDn5iNLwQJaFh6DhhmYll
EVhfACrOIK/o6AZaRJeTcalX6E5imgnzPQ4wDB1Rh1+kzQdr8iJryJyxDI44gIXIoJUB4Ny36qsL
4j7iew/e8I2YX7R45XdRE+PoB4YZMTnfP5N7geSCuloWFfn/jZDq/Ql1fnidspUuTTjSygNN79Ja
xhGc1uCkS+nY9sKwD9WeCwPmqHEJORRznCADJzWJfkRni1TRFNcYkZWoNoBuwuANl5tQTFoVDAcc
Xe3uH9A+AIvvkSjiaAxGIGiO8PlErsAux0R6iY0CjHm4ZRsVcswaDGwjU9Sx7Ce6qJ/c438Sr/8E
qjWocaZZajBo1KidSU4kNagIhWiIjFdIj7n3pbtPyc8cTm+qV1M2hJwwadeQRUzU4UcdxWrSGT4L
IUAUx+GOI4qdgYuwKjSEQjHOQaKtxnnhAu9EyJgeEDkCaUKgEK/JUUoMQzB+PXQvE36fLViwk6qE
FtLGVqnqfpzEuByjrIvQ4r/zMtND7SoO8F4Nv8+QmpgigIWZMYWSp3V/OVx7gERywMjdud2n/MfX
aNaMODVsSMPBiHoCSKuxRKeBZ5pbHZpGZBV5AT7UmdznK0x9xKIc9cT8s04jkSZBJOoZuUtpScAK
AId8cJrOGKh60mUcjqdS60xQjyOnqAHQg44W1BfQCUUECO38XP0HG602bTEg/jCc0Df4nNb43MZe
yvSXUHvqcfzzhPoSKtsaJaE2eDkgUQYxLzD11NLRCysLKTcPCq/tzw/R3dwh9n6kR+AItbDDky5g
cKCiHC57qF1ZSVd8mmWLNKL6msGh116ETFvR+Qy0Ji1gAUCswXrK2ZkimmtAnwla45S7yMqTEjyw
uDTO+n876KxipopPOBVX/aFxbspNBsY2BpkhpyOAVXbMHjTjlkNpgoG0+c6mDHYPXjlDKW8qiIDR
jUMaJ109/pxwPXMh26oVvRFz10CK9f79B85QAkDSqdeoVdPfxyjOBMV0jM6AXsKRKE4HBFVEVdu7
B9QbjDSFxDURCoOme6LIYDRCzTOlfQj1Q+YZrUhm3+b3+qP+HoUcef2nmHpAof4YJ44B6+OXszgd
s9Z1tUJZ3B2jw8SlipNfW9Xc2d6n8Hmo1Wor6Y7SC8UwFXUlYX8hysGwNCy8kKpFLmKoKEh92A25
LLS683AGEVo4J4kGtJ6kaR8AOHOd0szDlaMj2IUE2B76HhXOztaFWoGPwIRzpD6G0gywoThYxzKX
R4v1q0Pg7yNTHDNv8DXan9L6pS0ar7Vo80JIsygVGWdYcjXgCC1qEyo7nWcKqhIhSbQ5lXOEdhbS
vtnUaJQk6Z7j26HelyktAZsGClgAq529fdrmyApgNZzOVCtLqAqZOlBz2qfeg2pRhi6gmL4iPURj
gi+ZyO00O3SVf/ZnkwG93KzT04ies+wRDEEf//mlAqzAljNhuJcSP14SZmV6VIBbdcmV0Y8p/muK
OMXLjFD1uygGG9890+ehvpNQhatkXIr3EKmDfUCcV8z0WQWtahJp3YSyWGRV9JhkMftr42yqvNnC
YY12DzLG19sOv7YMAwcUmMrvPrAIbIsfWfGLtFLfa0R10draH/ZpDgciSO1Ae0s8STN1UUa9KlDn
5Uz9K+QBgLORpopS83KUBM8vS+docDjWxmRG/d6Qtrb3aGc4pMlclRyk6uakm2F+G7suMLos4KOJ
dIx1/oo2lQ0P0xJL7RVaWl6jv711m748ndK/TFpUz6cuNfxk9a+ejON/sq//5EZYpB0jWdChLYTl
7IJxwuFLVtpYLXYMbQWwDv9epaUfFL1FMtU4xpYVMIDbw1Xkymiu+u48aAVurq+ImwxVunbBQk1M
Iyd3dsaX4hVwjbEVkPTHz4uZukN9Q/es/KFsQtGNM0lE79Q4teI07tTKikgX7+wdqO8fR1iQnUbT
BEPGUmqPYqFaZJO5RFwCtDLSoyNW4GbNBYTmOpuYwlNyJmoQ+CRAgdjd2add6IrBbEJcn31ESQLs
onbq5Hik+5t7d2t0LGUEXTqbI3QJkzqtnjxDly9fpj+fDumV1jK9OuOIbz6hWXK0i94u1BePeVef
acAqo4FyYVNV4usBnm35PYBlF2DiMAnAViv0RkdXjJMM9sP8C+mCffjO7f04KsZFjl5DvCyYH4bc
yuChPSStsHABHAhVNZeK1Le8GuZQovww+2PC4eY2g9W3k4DGnM79YatLjZMz2h8MaKc3oDjZF+Bq
JYmk2LiJUyG5pkItkNEnBq/xaEzT4Uj4cFAHnYLkyoAF/f7hZCRRVhAnNGeQQ4G9x88dZdotTp2g
odSrHLcpEA14B1aoZbm0O3fwHQrlxFB/mknDYf3EBi0vLdMb/S36X8MJNdtNutifUMxAN/O68B95
8R2ax6yUBo55V59xwNLU8FDX6n7a21UYKDpolkp70PuBWwkLtkCL6oIueSXmwQd4qKD5nhvbmkPx
3+GsxB5CyGqx394XbqxdPMj9F5+lB1X8HghWMiMY0+sMON+t1ehi6wTFMTS/xnRydYVu3Nmnu5y2
4aU3VpYZtGqSVkNxVMik6PQGJDZgcGtGUT2X6QEjo1f96YT6szENMVoknAS460wYCHviEpQb1c2S
aDLQhzQuQo2wlLKVq+gfIqsKEQQgOubjYUqizj/vtJrUajXo1uaU/oJT2uaJhH7f1Oj53lzIuPPw
44BK5W685yM65l19xiOs+8wj2QcvPqqs1YcJT80v+lAe4T71829i+wv+fe/3TaW+Z37B733YK4T0
Cq7tH3B09ef89y1Oq76wcZb6cYe6030621mmQS+lnX5fHLehWrHW6VCHnycuOgArJGac6g1HI5qC
KMovPobLM0dE++OJ1MLAdoc+vHhGjjlygzFulmu9yvrUVwvp4GVFEC0MHS3DkVCDQ3CMUhocfg5I
mxkkOmFGlDcg0t9jUPwuHLIbCf2zWUgXZ1OpeWXmHgO0D3H32Ht/Yj+qSJ/9kKDx6dWkHsXrP/ER
1sMus6PP4588fs5RX4OEwWKL07z/ox7Q3w3HwpWKOyt0N1yh7uwWrSQxnVtdkhm+7d6Irm/t0P5B
n1aaTVqqNxjsIlEvHUMKJlNLsJFosU9pF3r8B/t0MBzImA7+oAM4gIgf+FMmKBQnrIugvTR0aa5R
tjakM+g6x9bVu4YMgvuYRay3xJFbXcs0aQzwOnNLfxNk1Ajn9K+igDZSQyNwwUQQ0P6cbeKQZMrH
rON8FmtSx4B1/OcT2BB8hJZRzBHKKGzR/8vR0rdNRj2ORjYwEB036MC26ebQ0HNJTqeW6ww4bUn1
tvtDutvr0wE/YASC7iEAC/QBPKbOhh6iffuDPu0NejSGcqijJIg5KtqK0mGsdD59B5W0oC7gBRKq
cfOV7jmBTENkUL2m2ZSjKw7nsm6LWu2uKHbMpjM3Z6n67gFHfuPE0P83H9Oajeg/53Cyxa8/poAq
veUPH5of16SOAev4zycXn/k0sMHgMolq9NccJf1fcUR7INg63ljCkcrUxPTeXkr1xoyeOtGkUytt
UZvAMMJu39BsMqUtThOz7EDSQkQ7qF9hGHo8mcmYzQiOOulcUjBRqkbNC7t7qFpeRc/WKM/MuLqm
sOeljhUWBFF0JxFtYcxnPktFeqY/mdPQ1mh95SR1u6vSvJnPJlqcF/WNXOYiO0mNtvgYfzwfienH
f2ESajPQjQIqIq3DKaKxFYlY+/Ei289qTeoYsD7FRfz4cGkezfOtE/iLM5KxnVGtSX/daNC/Dy1d
NSmnTJFEPdKVixmV+Gd3pvx727u84APqthu0sazqnrBRGzAwYYQG3oXD6VAiKvg0QuplNk+FEIoJ
AqhJAJxy6zhmxoGUdaavjh8XOFIqABM1LBVzdOkhqXwzVCEgH4Sv0zmnnpjOXF2l7sZJBtam1Lqg
ngHVB3JD8OlcBRNrSUhXpyn9yWRIJ5IufQvTFcTRV1Edo3uiraP0LnxYTfSjvvc+Wk3qmIf1mCVI
j1bD6GGP/6ieL1ELOmwYUmZg+oAjqu/UE/p/OCW7ZlMZBIfCAZydU9JRpbjRorzVpffe3adVGtLz
F05RzNHJequpjkdj6O/Xqd2q034vEVAScmimvoxhGMpDAFDo/8YRP0mK7xjdURkI6+zfQhEwFN16
J4msoKbSyKrWmjm9/ECIomFnmZbPnaPmSldGiPDz4XAkWvveRQhqtNDRwlhWmwHzZ9Mx/XfZPk0b
S/SbfD4daJ0B2IJP914sCcwFhn+qNaujPp9jwDqy3efw9+yndPyjfb6qnueUOCWDMYPHtTimt5KE
/p7//hr/fM9mHGXkItInY3mQR4ZUyxzs9hp1Vk/R3bxGP71yjaIoo1MnT1JSa8gwM7TZx1CiaNSo
1ahTq1Z3JrE7OpSMbl2oulfo9qkOYMipHOpcM/E8RB3eOv0vBbigkDtGGQpjNzpXaQsF2UDMJvgX
kzotnTxHy+snxXwWvCjoZg1R4Ic0jSPpwpkHJFa8Rh1uSnwOP5wMCFYkg+Ya/YO4Tsv8ngG2U2OL
GYoH1wAfpsj14Z5v6X7zq+Yhjr34fPvz7Mg+xLHvPZ8PQ0H+xed+DFgfO/4x9+FGfVrHP7rnI6KK
EVHxD0cctQCoXuevrwURXeJFuyPjgJkUnwOoSKCmJLN5EpIIYGGBd1ZOULi0Tteuv0Xt9zYRV1F3
hX+v06Q2R2hxYqWW1Ob0sdNsiUopgGL3oCcAIjOIYqChphaYeQTjfdDvS5cwCnzhW8Mh45QVjERX
ean1bLTojg4mlBtSyAJ1T1KXAQuu1GI2kqlr0QD+kHB+JgU8KJ3O51M+h0hTQyPCEvTGaEz/Tb5L
l5qcHiYtetEmtJTNxAgFM6bpfWzC7JFsWvdPF6uUlY97bD9Jcu8Jf9TzsUfyXo8B6whA5dM/fvWm
sB/r+FFOMiOJQ454wV2LE/pRXKMfcIRzhVf8vlXgqMs8pbrVB45aUMw2QkeKFy0It2GzScn6Og34
Vrt2c5ta9YYOH/Pxm0tt1XyvCcZRs64RVp7PJeoCYOF7kKbJXQcRacZ4CqPVmQKjNa42laljD6kC
KwQA/XA1iKGobWmlSbW4AgaZ+qlnqNVd4Z9paomoazIaUa/XE8DS96JjQoi4oK2Vi/O0psYgoL47
GdJt/vn3ayn9Br+3b/F1eoGBrQ0BCNTiqJoqmnumKz579/ajreceA9YveQ3Nkxdjq0NNOeyxOJy5
ypHIm2FEr4cJvctP6hmdpUTUBYY6CJ+YwxP7PmhZwQTDZtLtA7hk2VzkbzJYkS1vULiyQXeuvk7d
zTuid2+c4mcb4zgMWgAqUB46zZhOb6xSsxFL17DGaSLUUFH4BmhM5+pxmM4aAlKIztDJE2Iohpkz
BSvUuOQGxwxjpEqxonbB55UxoNRXz1BzfYMiKJfCsCMzApojTgeH/Z5EVVGgvoXW1cys1bTGOgsw
jBc1+HtQOn1ttkfvjXoMXDX6OkeKvxo36HN83qucTibQ9ofqaVAVdfzs6Wt9EjytY8D6JauhqRqF
FYXNyKoYIYrZUwaQO7w4L8UB/YQX+FsMVnf4Aa6R6Fyp55l06sKCWe7s352kBKR9ZARGAEPNJAJO
FdtLa9TeOEu3OS28ub1LS0srfKyIvBQFIi34OMZxKGCUJMucItZpPJnqAsfrxhFNpD41leI5Zg6h
6pBB6wqv6zTs1RlHv6JYL0V71K0CrXOheG4aHF2dfIrq7SYj0YEOgUNumsEQBhbj0VBciYzrSOZi
ZpJLCmwOjX6h0YDSGsMrjeYZfX82p5+NJ/SdRpNebTfomxyhvmJqtJJrLWyGuUlzVMD1qH0JP3w9
zH6k17YPfe7HgPVLUkNTfpIaPahMcEhjBoe7vNzuRhG9w8DyY15Il/mO2EVEg44bTF+hFpH5dA9S
yrFqc0EjyrrB4kiHi60NxY3GWvUkRKQTwo252abOKkdY9VXa2rxG3e0dChOO0wLXOgrVbisWn8SI
oNUXtgKpGSGyEWkZq11DST1dRKXL3jhKqPKz0PkTowqrXcPI8bW02E4MFhzxcXTVWjuNKUXpAIrj
EegMMLBAbWwylppW4AxXrXMXV+Bz16IYHHckVSLV7eK/j9IpvTac0uVsQN+Pm/Rr4RJ9I67Ti3xt
19GkwOhRbiRVtEe+YT3qDfFha15He/7HgHWkH+ynwcOy9+50XoIG4AQJYufSYxkM5iiY88K6mQQM
UkTv8DOvMwjdDRLaDTJRT23wczpi4aVF09w1eJQlHkpdB+PD6rqmRh45lWa2mmVaUQeNTUJxvUmN
7ho1Vk7S3ZvX6M7uHjWbDZG8ybUSLkI29UZdCKdCS7BGUkF89dZeekzVikd9CqlaLsPTqvk+d6M2
uVVRwwjqphyFSVrIh0ThPOisUPvsRdGMnwz3JDqT6IrTOowG9VG/giFumS87I91cwQ3aDrYMZO2C
YKOVbmoN3UpSlYk3pkO6YnL6G/7eq82Ifr1ep18JGnQCGl12rtZjooT6UVOoR8e7evzquceA9anX
kI7y+KrmwBGRpHtWUpqUo5Q+f7/HK3YrrNE1jnjeizJ6L8jpNi+rPrhPYIXDC8igJgMUSFX6BERQ
h39BUGpbWLFHi1Ss55B0jYiJBiqSh+gorjFw1BoUNZepc/Is7Vx9m/YHPVFZgF+i5eOYKBHAgrpo
vca/E0fOGsy7XVv3UIDKBJwszfgxSdVNeo6Fj0hMoi9+LxzBNZJEVUQRBaYzSpMGNZ95kZobJ2nW
3+HUcSzPBat9zuAyGY2lhgXLe0R/udOQLWSEkHLmQdGJtMY6+X5TCCV6rbEgR1PC8mvD7WhCP5vl
dIXP9++nDfp60qXf4HN5iYH0JKYDYN1mnSjhQ0QdR10zehxmBY8B6zGrIR3d8TX8DvlGDyqyyjkv
zgmnQQe8GLYZCK7zgv2Ad/gbDFJbHEnt8kc+YCCbO5YVlFob4mumBXPrdLjEu9BFNVpqCtyMXl7I
Z9lAIyz1dDRSdPf1LJGMQaE65qgDvo71NrU5DWuvnaSDq7u0D30sPjcI+IWQToZjNR8P5rUwR61z
JBIzmIkiKOnr4OucAWomhquZ/F2c560CBwANURCY7vVajR91kZcJOZLJ+FrUz71Mtae/SPm8T+n0
QExmUbiHV6F2CMc0gaGsm0MEMJda9pr0FPI8TgzfVqzSHKq5wWs9H9T1AFqYeZzyN94ZD+k6g+Pf
M6B+mc/xK7UWfZGjr6cYCFu5c/exqkefBR4A7RHVjB4cEdlPuQZ2DFiPWQ3pqI4vKqASRYmIMacg
SPMs9Th72uNFv8kp1a2YIykGresMVJv83H1+3tgo8xts9Yh/p+6MPAInrYzIwWc6YahRRCpMcnKq
9uTcedR0VnhNrqZDbiHb4rlGASvXbmFcZ7BYXqbG8gnqrp2h/WtXRHu9Ua9RgJQNgIZRnpBcl0/r
UXGkNTcvnQyy6BBR0GQmYCWADWBF2gjwgucgv3ajBu5Wg1OzSADdcjRTO/8iNZ7/OoFddbBzg3JQ
IyC9DMlldA4zpISe4a6pL/T0ZZmJ3ZdKOueBdVcjUF9FmxcqEV4VQn4faW6WupRTCPpU4+uOOUps
BFemY7qWz+hvOU19CXWuqE1fAnChzoXPlq/BmJ83ewBF/KPVjB68IXpbu6OVSzr6GtsxYB3pLvJo
agjGGVyAIxVLTSmkIS+IXQanLV6Ut3n3vhnndJMjgju8IvZ5YQwQrUB+hRcsll0s0ZgVhQXjXKD9
/e7HVrCQZEg4UMAKRR/qkMifcfs9Oo2e32R94dk4nXgFKyxWvH7cqNHSiXUaH2xQ68QpBq5lGu9v
UX8y5YU9oag3FPcbvBa6cfPUSgQFcwpEYfgDcb3+cEIDyM5M51KvMm5+kETqWMEVUVWz2aQ6nHoY
ZJKlNQoZrOannqURP2HW26ZsOpI0UM4xU6uvlFNGz3AnKrllgTOoFeCB6oNVF3EP2NZZlvlrY/xX
o2kzEj21NPOyN/Bd1KcjBbzDEeXd+ZBeD1N6OjL0xXpEr0QNusjX9hS8IoXTlsHBkgDHNqjyuB5F
zevxplscA9Zjllr62wXgAkneKA+F3T3jddvnRb1vEo6iYrrKf7/M6+YDXlFQSZjy4pzDyh3td761
OQuhGkhSeWmC6iVLTXWQ1VRuYKuhgHVA439Pxlwc98g4gBOHZuE2WTezR4WsSy6egaruCcyDIF4j
iWh5Y4Py556nzfdeo527tyjhSAk1K4jkmVjrZYiu0lSjOCzw2DndgOKw3x/zc6dCHE2zvCjuS7Eb
qSm/Ro2jqyQMxdexffIU5aeep9tpg65+//vU39ui1dUunVxti+M0hqxR98IlADl0MtGuoY8aPaWC
tPegYjK5qusL3gdq2mszDS9NJdrUcwpEmgJ0CZIupx7SUyMSmKcEsUSPu/mYtvl5P7URfTuc08Wo
Tl/m9/MljjxR61rO4NGYiazOTOzrHj56eRJqVL/o/I8B6zGCrMCZI6DAbYUbFdJdU6NtXrS3eN1+
EAf0vvClOK3hO7+PTpRNZTSmBhcfaxd9cQodev17HphCK34hKnDRQqEnBTY3LxAQLgu3Q6OFd6Ey
uLk9eaXMFlwsAJREHUaTJjT7wGu6eemntHP9KqeD63Tu4udpsP1r9MH1a7Td26cWuoIcckBpVBY4
unC5EUARt0YGKixopIGi3T6eaKpaEadHJAizVSOk1kz0tdpnn6b5xhm6st2jn77+d3T76nuUTka0
cvIk0csv0sbaklAlRJoZ6S8K7/N5kdL5wWdync/COciqeik5ZVMnDl/5vaAEcEdiFZ5YWBbkvdOT
+5t0YxuB6+LyB3V9NqFbfD6vzTlF5NT+m7UGfYEjzef4GCf5582MtMHg6lwftrjwyWYb5oiPbI4j
rE8fpKw4zUAiHLZlAKlxBF5USLeTWDp6V3gHvsF39y4vggFHR5AyQXqADhTSvLrbKb32kjcJdaN1
xYxd1RmaCoMLUxjGGlPq3We+++cWpRJCTSF+JwXmIoVUTpe3DANgIdWJhDNl6Wev/Yh++Kf/kfZu
XqH18xfot3//X9LnfuN3aDSzdPm7f0GD/VsU9Pb46MsMkDX+/YlEZwk6hSG5tCsQuZlUalRqDWac
GQRSSBtoZ5RzPWotdWntuZdp2DpBr737Pl259Db1dralTgWQ3t/coltLS9Rq1uS6q7msodk0lUjI
XwevYlqgEamjtqaAxgGXc24KwkpKrD+XgWk4/zh5HNHlkppfWAxVF6Vuf01RN0PkFUkLhPp8zm9y
VPUen9cpBuRnk4S+yj98lY93npGqiyYJBA/xmQU/H5SOpub1ydesDp//MWA9orrTA59pVfwOtAMs
mJTDkD4D1D5/vc035BVeqFf4eLf45t3mGxwjMTOrzi6o5tSsa5sX4OG7VZWdyC0I1Y7ShVXwiXxf
y5S2V9ZWvButL6prZGEr97g3YjWuC0g+NTRuZCV3qaOkggEd7O3RpR9+l95/428pn3NKt3cgcjPf
/M/+KT3/6/+YVjeeoms/+ksa3XyPxvMxBYOBCO+RdANTjbKMjsf4FDAUUT5PVAVgjWnKkROE/VZO
PE3Lz36e9upL9Obld+nKu+/QaNh3qZARdj1S5n5/QH1OQ5dqsdbzrC06hfI+XdfTExZ88lR48tqS
ZiFA5IHKlPwzfyxQNMIoocCrkzp/S1shc/kIVwBRGilq2JsY9fSZ8Hu/MhvTlXxOP05DuhhG9JWo
SV/ja/AsH2GZf6cG8UNQI0y5cT0e9amj1Gazx4B1FKHqh+VJIZqqpRrRDDnNu8s38vs1gBSnAbxA
boGKwDf0yOo4CFIcRA6Yt1ObqtzLP5G3LNMmkuMFWZe+mEPejIEtDFl9fSk0h80RgsrO72yyvNqB
AytNGRX8hOHuummWyhTTRxrgSt29s0Xbt68zWI0kmAduXvvgBv349Z9R/NVlap5/gdbDJo3OXaHR
tTdofOd9Cg4OVEsLYCIdQIVYAclU378I+vECh8geUs6c08oTz79ErZMX6PpBjy797Me0t7vLaSu/
T94MptNMgTxSg1lEa2P+Xos/g9DV4ObpTMZ8TPV9mrLrSVUVCHfdrRvb8ZcZRXwArVAr+LOs8XkF
vnAltS1TsOSNCYqNxXtOemFCYZnomcm5tGRWMxAt+wMZ/8noLX7SX3K6+CV+vMr3z8v8eZzkn7dd
l3VmfnHU9UnUnB6mZvZhnn8MWJ/EDiMqnVqb2qtzmgdNqXpC7yZ1+oB3/V20r+HEkiuw4P4UQMmN
Y21Tpd5U/t1meQFK1lYZ12WL3QOJT6Hk4QvJTt3AVI/rjBrIO83kFYt764r1ouypqZAsRBT2TSnv
YlwdbDIc0WwyLi9FrUHLGyfpc2dW6amlnA5Gc5rzNbCnLtLK+jqNLzepf/l1yg76lDRbuAgkXjfC
/XL0AKMqCRM+7mw6oub6SVp9/lWaNtfppx+8T9feeYtGvZ6MBIEhDxCSixqq6zOSrdRC98rZ3Rtv
3DqT2pgp3sMh78ei/uTkd/SiCvlVr6WO76DLiOsCfS1I7izECr6b6kixVcaeZuulkiq5ZoLQVwNN
zdGEqUGhDBI7/L5+yu/vnWxGf83X5QsM4r/Kr/klBuUzqaE2H7AOAIU8DnrMptxczX3lmi09FqLt
x13CR1+HMvfR/DGu0xeJV15Ig7hGl1s1+h4D1hthIHSECWb2MuVDSS0qqOSN1hMzw8IwVllYeelf
HRTsGSUpmqCMrtzu77toeWoXreeFW+RaXXRY8sRUjFzzSspoHNdK0zRyfCtbkCV9ROcZ6qkWqF3H
Lai16Py5M/QbL52iLz27RDe3hzTZv0W355Ya557jdNBSb2eHxlu3+WwmZGuhekJWtK2koD+dCeVh
47mX6cSLX6E7o5x+8OPX6db1KxSB98XXei5mFnN1eQabHsCCWlPE6V8Q0xQmra7mljmGvDy3aEAE
LuU2i2wlE1LFo6e0oMC0QOjmIMNIZiLzsq/hSof+c6vK2+X6Wp4h76P2YsPJtcaIc8+VKGuCXHh0
NXSGGYBvzInu8I30I34fz9Uieims0ecpoYs2otOcRrbdaJPUuhx4BW4jNR9SkO+j/AkWeF32SJ5/
DFhH3B0p/KddajTkm/du0qDXOm366ySi9/hmnUo7OxSQkvKq3KlhcRyhBrioougrVTp5Uj/yzzbe
tD4oajxSD8GR0aFyPCVbGMe6RYB/h17rXMmZUpOSqMGUsGV08XgyKVI9z+q27ri2olsunURPOpVz
iSS9wdFivg4oiscJ2JND2mhO6EJ3Qjs7e9TfrlFj6SzVnvoC9XsHRPOpUDpyKgFLitnZTN7t2sUv
0NqXvkHvb+7RD37wd3R385aI+WFhpzJTmAuoGi+v7DhMGV9TcE5Bk5hnbbIJhrXVJUeuSWDKSKdC
B/HXoUCgSjPDAzqAClGVERlnBQljDh2niNOKKcSijqgdV1sJdlxDRcNirSlmTvbZqNYXZJsTo42O
nVlKOwzEP+HPb83M6QKH6l/i6/8K//siA+gyngtV1Dxzs4vmQ23JH6/+ZR/y+PY4wvqkM8AwV6B6
ixfDG7ybfxAl9AGv0V5gRcGzhQ8ltYXrsd+BPd3AqwMUh5TFoDQCfFXgyEoqArl6StFu15QMXyMT
FMX2gvvpR1mEte7qVYgwCq6VWZBR8eM3hVIB2UoEUKadoci5RFrcFqG7VDWkTCxziTVoucdten8H
2la36EQbwDalzWvXKGuH9OxLX6bOuRdocPt9Gt64TLUxqZKDsYXfINLC+tIy5d2T9KPL79NPX/sR
jQZ7HNlECr55VnQ3IbEs2lkZCYhp80FnZobDIQ2mHWrVmzre4/SzFHTCspNqyuhRrmFOBV3EIaG7
VkHRJQ0CH4Eu1vaso6wUA5ouepMNAJG0iy7wnNwRRLWGrp95FFrRzPeNAeujEatiiomIE8K3MaWb
HIXd4vcLBY6zvMxfjZv0RX7Sixztn0fKOM+kJjYLHaerLMQWsGGr98Aj4G19FF7YMWAddY6NAi4v
0O8lLfr3LURUKA7PyUwGtGQalESR1lYyGWXzsXCxg1tH0izqQf7D9XN9MlishXMUdE1lUQRuAQlY
ZLnblE3ZPXR3YhBrDQVtd+noOVAKHUUhCMsIqixCU/F3H+H5c/LPq+6Z+Bn8A0VIj3f3oN6mVneZ
mo0mbU9CqV8t7+a0sx3Q0HQoyFIa9PaojiHpcy/S1vYdmu7dFWNTOPBggDl2qV283KWD6YRufHCL
b/QZLS8vKa3DpY25DdR5R3TWSZQl0EX0qRtOdTQc0fZejzrthrxvCPtBziaKaw7EFxsQxTvz0uSm
rAdRFeArEaekeu4zyUSOxzU8QlOQTI2/5pLy6UyoanjpbKZ1iq7a1SXX0MgW038fs8nIFgO60XsD
GxKiqUucFl4zI/pL/vkXefP87ahGX+alf5Y3TZCLYQo79ymiKcsDRzkVe79m1Uf5rWPAOuKcHYB1
hSOrb9cSuszglEBTim/SOebfZnOpc2hHLpcIwBTpnilBwGk9+WjKj84sgIgroh8GM8+H8vwhR8wu
uom+oxc6Kyw1aigjuSCsRGguDS2SE58CViIGOnSepcuyFrI1UuTzYiCw/LzxZCg282PboLs7+HtM
nY2n5HWm/LOk06VVTvfm0yHd+t63OXPsUa3ZAF1e3yOfn3UjOyvdJaqHVrhI1l03KX7zKUD33fAj
TDUk8iCeS20wELDe2TugLh+jE3GaCDHDSEmsJEJ9PjIyxTX1dJKig1iAVQkeprg22s7F+/IAZD3v
zep4lAARaAwyL+rkeVwQGEo3IBDQKSknrnSQ55T72pgld66enmIl9ZXFDY9I3H/8fmYmpU3+KPY5
or3M996Xojp9ox7S5whk1IA6Y+V+ibigyavKOo+u9vsR9LOOAeuIdgt8AHFmaBTW6Me1mN6rq8NK
DZrgsJQygYtoykiorPsEBYtc1REWg2OfEvo0sZoKLkYAtFhAd8eTXdqtMC82IDUyKo9bFNYdZctH
codTGv89119cOBeNvrJi9Gc06NF01JPUycR1ZMG0t7dHjXaHgWKFokaLASfmqBNM9dApFcyJn0DN
Cy9TjVPF/nuvSWqZWR00Npxu41FjcOk0m5x+K3/KOlkZvC9Y3eeiNmHlmEilUAxPofeVarQFwJ9M
U9reH1HWqVPOEXFUnzBoOVU9m5WbQ4Uv5SMnX4+qml84OpoD+2Dh2uHZoUupM2c1FkGtwkWs/pgS
XedFfUD16qGeGpS1MF+NNF6Ty5a6ZJQXdorSoPEqHkmuOmcQOLwx5zScz+EHiaHziaVf43v2d/KE
noaefz6T6zdHMyIwRbfyY9VIHlibevjjHgPWEYCVJxOGWUQ7UZPeacQ0jnlRiQKCtqXB/C7m60y0
ADZlETu/B4Qk9XOgUE0bD/+9+tBaVlB0Fk2wWDT2XCBfkwpcPeYw8FWPpzLE7h0bqizeMsrT1IcB
ZNyn7Zs3aGdzk2ajAwo4QmqdOE1r6yc5BWuLqcTSUoeWV1cFqNToYSYW8RNO9UYcidY6q3Tipa+R
mY1otvuBqyW5hWi15gGSaY2PBXXU3IWKwl+bp9Il9NwxpLixSwUlncJnFkSShk3mkDZmMGl0KJ70
COPKmP9zQhXlCM3CBlFNA8tZQ0/ENYcUD8qmhD4fPC181khByRM9TclIqaZ4i5+H/xwDZxyr5QRr
S8oL7rdQawySUgZODFEjT20C1KHRRRO6zRvszQnRZX7KZc4K/mGY0ItTSxtzKx3uuXfU/oh4dexL
+DhW2A9FNgcMVLv8yNwNZSUdcDpHQirM3Mzc4Z3GLNzc1QVyuBOndRBXfM/zQoNpoQhfATXP4/Hp
SuZlY3x9yjkk5zZfiKTK1/edRSoKx+WA8OLCBPP7oHdAl378A5oOBnKenTPn6OSF5+jc+WdodX1d
HJZDp3m1trJMMf/OdDYVvXUU/yfTKQ04bVzlKKweZXTru32yg201UTXKModPoJU5wAC+9FK38rUz
/Nwz4qNQIyKXyDIAes5TQDV+/Rr8CB03KgKRNLfFtckynY/0DYtyxtARRl1X1oOoXEWX+uWVaHgx
QrVF+u4/QxKWexnZlhtUoPQxB9SlnE/musga++VUkvWkQVIU0EsRxLLDqXSZiLTDmPN77HPU+e18
QJfDiJ7nd/GtRkLf4HC4OZ8LDaIKog+69+9fozr2JXwsk0En7S1aSRPUQ8jtaqTcJ3LDwhiulRsZ
C6Na9zG0UNSuRlcLu/ShiMrXu6zTO78fWFmnIhBUIrTDxXJPOi1fz9VsTIWQ6m5cTfaCIg2ylQWo
58ExynxGe7vXKJ9NqLtxgp6++DwD1rO0snaSVtdWKWAUQdpx0B9ItNXmCEzr5bzY+Np0khqDSSrD
0nE2pP2ffY96u3cYUCJd3KRWW74zGThxv1z9vvR7blg7ClyH1YO7RLOqyADAbLZbYsiBVFHremop
JjXGQF2mfQGrmpb5Goxxkawsx1yZqJLSV4bKqxuOGrvqhoPrYL0qvfyOo5UUAFX+PmYmNZzyCz93
nUtauGcWyK0yjElS45PzdEx96f6hPuYmJppGNfjf503jEj//7aBNAafIv82fUZIp8fRhZbKOfQkf
a9ByzOdAw2CTu5Cc8nLuz3eLHDdHFlFFE1zqL24RGvOLDTitq5Xkjq0eVDhRnv9TMFuEcFiCSvHz
Soqox9EIiQpl0bLLpfN1uPvTsrBv701bhBqB4+eca+RTcW0+deosneIoK4qhVdWipFHniGomAA6V
Bh8honsqXUDUdvgrJI7byyuUdFZ4fUWy0IQ6gWFiGF9EoaYrgXe2SaV2pbQCxzwoqBaBFOK9dwQs
7WHQ2mg0yHA6OiEnrxz6FF0JryIFbRfJsYej3SK69RuLMfdEyD7aKDq6DmjzIhdUPXiR2PEGG8Xn
ZUu6gT8P58dYzoM6uoPSLwtCqm+eqNSNUmhy6xsQusHI5AJUIPA++HtXJiP6P6M6Xag16OJ4UN2a
6dPWywqOAefouh4+V9cSUa7dFtfB0U6R41JFURERVetT1b8frmMdJmn6Fn1QiZ7oPt07X9QFOPiH
1nFKykPBeHAdLL3Zy/paqWBgSlqFk00p05QK8LkFh4sB/lPCKeDy2holiQ4BN2t16rQ7Yu014Z19
OB2Lvb2lEoSVLgW7+jrVl9c5f4nl34iCIrGkj0TVE9LKxg1g+zk84/W73KKP4kTcc4Ty4LhqtZqC
Z73e4PNSUb2iM0hll89fh2qjpOzGLgK+qUREVUDzIzaeTKr8q6CowwW+nWvpnhTb/35RFTJeO7+o
8C987pZ8+g4lh1RByjdfbDUGyytUstxJ4oDmAAWQnF7PpvR3fM3HUfRYgcQxYB0xrwQFUb9rSofG
cWgCV1MxrnYRibWVK2oGpX/e4QJ6IIszrPjrVWocLt0p0stcd00fwQWH6xeHC/3+526GJKhIqxzu
QlZra1USZMG+t177KV8oyqMeNeUUEY44ES+AeTaXhdGs16jF0Y1QK0hTKVPhLIHIie5fnYFt5cxT
ZHi3x/wgcrTApVB+1sgEi6GotVQ0OHAdJGJDYd6Sq2+FElk1GLAg+KdzkRx1JbEAoXGfmZ8WKHhm
hwDef27V9N4eGnKqXno/HajSNaYQQixlpu+NWP3GEwZlKlg2Z4y75pnj5FVY9DYrGhG22GDyovZV
6HkZT6WxRY0SRrlD3khe5w13CzOR0Dq1OT0OaqTHgHVE8ZVxY1CTyAiXJbCl2WjgAAtpgJgeQIGy
Ej3luXcr1qK8XyR+bfgoyi8Q+T3PPaqkIH7MwxQE0jL9xOxd5CI7P7qTZyXI+JqHHy2xtuQTHaY0
VAHWn790oXK3SKiUs5mOxjIfiMVUY5CYMHihwB7xtUDtqsGRjteeqkaJmZMubrbbtH72AiXNJUoZ
/DJXByxItVa1wKQ2k+tITl5cOyNkU6R/Ig7tFiUsvlqtNoNoQ2zFJL2SRkZURMIyfxiEC0x+AZbQ
pVzGp3UlaFnjOmOBKUxiq2KJPr0rpwZciccd189gliJ/1ei1jJJ8tzZ3c5o691gIoGmKbCpKsVVq
Sq5zp8IvEyJuJLw0Mb3wUSmpi9L1IKMbSSzfCyk/jrA+U5CFaRvOR/oxRPZcpG4X5wBF3C7FWMp0
gePkwcWDRwEC7qb0IFZwoKrfq7Dji4VVSSmjSvpZrcOgtZ47hdDD0d39IjI5jnuOfy95bhfeR+DS
tUIXwvDePJ1R7+5d/jqVqAZaUcPxSIrcSS3hKKehg8J5pVDsoxVXn4s7XUraK1JwnvO1m81n5cIW
XXaI+83EXl60qACauZJjIxECVEpJKhpVhs+jRS3QKzjqQ3ou4zy50h2Mp7kXm0x4T/fWbwJl1OsE
BavRqSf3ViIznVfMS3lpZ+CaVyKmYgMsrnNYjuD4In8QlcX+yiZmHLVCNcrCYvRHmg+a87roUy3g
JE0uJ0wLlQj8KxYtNqI7fP1SGwv37aN30o9usPq46H5UCSEj1ggqDHwjjd3MRi4WBLmqijrulV84
EkFUogp/4y0OElcimAqTfaEb6I9RKaabQx3Barexqq7gIy9ttecLtajDQOtfo1pfsy4NrNZ4MOwM
jazALSyoKwwO9mjIj+6JdXlefzim9mRCtWZdaknTSSqjMdaxvVM34It3B3CboA7V3eDXqcnEACgN
khqKWF4uYAU9dtAihFKQ5kVNKRTACjRlhSggnytMKlodAFZDQHGeTuT1E6eM4YvjxfWtvH/y6quB
KoRal1ovDJeTzud5GoR1XorCqTO+CRCWqafU/GwBVCXpNHBzhND10ghINPe1jiBGsVr7sgs2XR44
PUveqOZG0eVFpImJCwA69LuMXEuN6gPHuo/4g5jw103YkyFKTbOHHtV5FDys4wjriAruuD12o5iu
c4ox5YUSu3lS6cg40PALu0j5fBRhbaXIXXlUuDqHi/HVIrCppIvV7/sIzUdIkRSogwKs/BC1P58q
wBUFa0mnVAE0PQR81UZB4NLILMsqeudguMdizbW9tSlKmgCLCUddB4OR+AuKB2GiOz2irgkDEmRh
RGOdAWjEgEVxjZY2zlIQNTjCypzSqEoQC9l0PJGoNZ3PZXYRx8mEzR4Km7xQcGDQANeqweeABwru
UkPj1wldZDoXN53cFclT5/ZMZa2qYJmXm0Z+qL5X5VMV0ZWLkCVSdQKEJjDFsLo3ZzWVLqfn53mA
NJUaWuCjuSBwEZp1xNi0mFwQ8C5MaPNi/Evs0aKw0MW3npcjwzmuqO/unX3+nUkSPPRg4b2zgkcT
ZR0D1lFcRMiJc7B6I67TjSgQPo10f6w4Bwqjubq4lbhpixRLAWCx4Kobel5KyARmgQSY20WO1uG2
e17pOlU7eUGFw5U6dUxrlXnta1C+QVAWwFXX6n7dyKKWVZyTdkb9eYMgCrDYurvFYDOj5W5XogQY
qSLSwnVqNWoiDZM5F+fM6cWnUtfLRN+qc4oBa3lZGxp8+WAr3xsNacBfx9OpgN88QxQSiE0YgjR0
B+OkLkEIbMJw7IT/3Wy1GQMb/LOaXhuoHYSJ8rucl6B176VqCindSAAgOpSieVXhGzlyi7pFy9CT
e5TZFlK1iF9TAcuoZE6Wlsyuok6o/86dTZvSGEjVTqXpYA9ZjBVxnZsIKOc9fcpZyHFlpZUbRp7k
NXKdsczJlhQJ0Fc46hxgxCqJFjrhH34T11puYM2RJYXHgHUE6WAEOZmgTu+FNdoT55u0UA4IK5GP
36VzJxZnqjtwnh8Cl8oNXN2hivqOU/6sREo6q+g4XW4ExacXqYscFs+81HdCpIH6EyIQWGt5VYBq
9LVYxwkWC7r3G9lxwnNYIfucEvZ6B9RpcTrWaNJoOKXdvZ46PdcSBpLYRYKx0B1M6Lp6UF2YzYk6
HYrW1ylMmqK4eTAe0EG/RyNOBXEMiaocv0jcbzCCUm8JQGFMZwwLL37/KPy32h0GrLqAqSRLLoqS
GpzU/ILi/IPi+rkOqL+mLoqo0j7IBFRakuZKEXF6+sYJ/MUS8TkqSsEEL1UbTNGAoIX7omgzVnTm
i7KAc5nOc1uhyFS0UivmGT7yVEmhzE035IuCgS59RpNjn/8+jAKqZHcPtTYWH8eA9Rikg7pj7Ydw
Ww4k7w8ro2NSOpfR/EAWSBwn8tGhcOwL64cLugU3OC+LoOX3Slnj4FCqWAUP3Ij+ZlSp4GyBmKpR
VChFZRRfRakg1Pk6WUpOP6qqg1VdPKYysVGes1PkdHIpUm9BzSaOOMIZ0972FtX5WOsry3L/7uzt
0/Z+XzpUNSmAh7Lm9WuoqQyUQ2Efb2qULJ2huLtBttWgcTYR+WVtHjilA+NmGTnFA/DWOZKyfJzR
ZEoTThkRGbU6S9TstCXS8e7MaTpRZ2dT1pDUsbR0GbKuCwlwk6+5LSSSy5Q8cGCnulxIKXObVSgW
gUjL4K4AoMBG7TAPr5xYMIfmGM0iOaLSvS3Z7qofr9F1LsqmxefjOpcZVakUen9lcq+kjvaAc1cV
j3SeSz127PiDj8Of46L7EdSvcFvs8Ge6GUCb3YhHoF/EttJF8x0b7F6wXUd7Xbs+tqAnWJce6o0W
FBpFvv4wr3YXHT2BKm33apevqnhpyVas1Gmh01XYe2WZK3iXIOSL/b4BUJ1XlCZBZc6O/JSR64JJ
eoI0iFM6ZFd7O7uUclqI+cHm5g7tHBzQ5vYeLS21qR5H0tGbjjkSmmsdBu7MANrZlMGJg6Bw9SlK
zo8pr/H7HqvDjjK4Sbt6EYaWZ3IuzVZTOpBwiR6MRmI8geiqs9SlWr0pIApbNQxdQ5lBWOeVTm1V
pEBrSkHR6dM6e1BESs4O5JCUdMlb8nQEKbaTObRBLUbX1Y2neK6rb1lTqpJ6NVovLOi5WRppQcU2
c6ocVhUuAuXKySA+RoK8ukVeqaO6ESQtRahsMxLQrHwn9Gnrvh9HWEdAZ5jxTbAVGzpwBqK+YIDd
VXlCVPCEPGIogVnFP/xgqyeSanoSqrywH0cJvc546IqwWoj1FZSiBW/MIa5UWEQM8rsmWOg6Bi6d
nM+10J05C3eZf4zCRUnm+w1m57ZSgDcVMU031CvgFUkdr9fv087+DjXqCa2uLMmC2Oe0cI8fSNcQ
FaGDhWhoBvUGjpRAPEWnsDc8oNrJU9R94YvSZgeC1ZNE3GmQyqqdViQMckSLmvbVJF0cjSZy3Faz
TV0AFn9fHaUtzfn4+HyiICw2Cc3urBtkrgyWS5SijCS/wG1eDoWXvLfISUO7oneWu6gmdiwnnePz
IzKHaSs+zdPPR2cntegeutpZWJjZerXYKiVGkcsWDYDiZ07BInCFeo3M1EIusKaYY8zyuXhK4naa
wcjicaoXH0POx4muUFDklIMX9p16TBO+SWNSZUi/W1cJf7rLhgVvxt+QZMuIRwqzUVTwf0r+jf4s
DBzzXegDgQq9VVJEKigLkWNtl8eUEZUoKkaEclfcLhnqrpYVOT/DSu3KVrpg1UVWjeaKGboiuijt
sQAqUwYHFN+tnYvzMsxMB8Mx3d3eFY11OM0I8MAhJlYVhSmEDyepSEpvbGzQ+unT2tJHrQtpnVuA
XltKmNq1OtWbHSnQo0OJLiKuVZvTwU63K7+HawHoyDh6E+KpH5tyn4kpG/OF4qqPdgQ0XJHIp/R+
hKaUSNbPLHfNg0CGnSPH7wrVHs0e7vqWg+TGAaSqv/p6ZSR1MOPSbR2edtpm5nA66Yr+lY6y3H+e
w1XlxVcZ9qbKv4Ot2Ji2pYgfUfCRoquj5WEdA9bHLLhjaLTHi+UGR1gT0BmkBuRF4ErGeTHi4cch
EH0ZlTH2elWBYyyrG05eLBgUSrNUC/V+xzfOaiusjOsUFIjAR26mWEASLYVa5PeRk0RVWVpxJC4b
BOrVlxb6UYF5cJu6GEvJVYlA6kGlrzupOoGC1/7+AY0HA1pu1Wml26SUf+fu7j7t7ffk6RjXwVAy
Vle/P+Ln9/k8c1rtnqATK+sU5hPxG2xwtBTwdUeNzAbOoMEpIdSaTUoabU4DLY2GE5ksgIwMNLhA
ZzDgZgGwADTTobr7uGvgKQiSMmWOvEuemKv2a9DwCoTZ7qR5/ADyISKt51nJQpO5x7AiYuXmCZ3y
a1BIJlPRRBGKhXXMfVe8l44euplwzEE9zVBllMoUzPrcViVw9J7E/YAmBKI/69JbbD4p6pze19IG
RQkBnpi9bErv82v10Sx4yG6ffPLINIw9sqGeY8D6WOmgfhibcUA3xaI9F66RkBlC5T0VtSHP73EP
FIaxUKRH7xvTnuWeuYKtU+8UVXIX0Qj/yAnAkVevLGpVRSNJ7bVsUYJ3s2VzLfgWs4S0qIvl6meF
okRlZrGoxZBTtwzNYuV9IWV0v0fe7cbNqPH1mHAktbOzSzEv+PUVpGch9QdDuruzT6PxmOq1RHhZ
s9GIaiaj58+v0wvPrNLGiY5c28mwL18TjqLEmNR3ImWWkqSwXm+1BJDA9xpzdIW1jrlBRFhhAqlm
HZrGdc4mY7LOpdnXqIohZVcjyp2cDd4qUsfDgnY+PaeqLn9eFsZVMaKkOCzYwZlyBKf0dCxBL/Pp
u1cgFYHBvPiMA5eK66aYLkRMnh5hXZUN1wrNBhIuoN5fohtvy1qsj8REOQP0G37A6WmzFokSqvmU
J3Qit1biY/j5CGjPH+yIV8/7kaHtsnTlLNaDyhCuLTTRBVzwFTcM2u/Oby4PglKX3AGHL3ILudHJ
/Xp7p7LeUZqpFima8WoRXpNcOTreGQbbMhZCeHgm0IvV5aXnIRWLb7EIrFFV5oLA0qwVs4gxrNm9
W4+bXcOOL1ItfIy9gx6d56hppbtMS+0WR1JDqWOtrfQ5wkooiUM6vb5EL3zhPH2eAWuejunNa9v0
xqWbNB/0ZaeH1G8m7OvARaa43qGksyiq470MxgMaTcfyXtrtTgFYOicYqOb8bCqLEpMncH+ezafK
TXPvWaJPmbPLnTKo04ZyrHChNtmsmC3UmlFafD7YYBDhiIFGAei2RIZKuu25b+gqhw70M2dka13B
NHdRbOAK+Ea6fPYQUKnul34GWTGUDXNZXB90qGdiHDsr9OXdECH5qY1U7NzmHNHWaJNB8hZ/Jhdx
rW1O+YeMlwJ3r1U4GR/3DxTRtMtOj8Mo9pOWDvJ/93iBvssh9hBX0+mki814QXFSbSXjzDnjyMpN
M5motngikY5TWaCqGapZ6CSpHntepG+5b2PlVM6r+Z24iIbyIl0Qjo6L5TLn3uKL48INK6RJSkv7
Ql/eLvKPTOUezIsupsqlCFUiiEpOkiv+Sqzoisaj8VQK8J3lVQapLm3v7Egnb4dTQ7jYtBp1eu7p
M/T159ZoKcIYTkwdpN3vXhGdeABghgWHCNVU2/7GLcpE5gqHnHrOZhNh0y91u9RkwBLiJgaecdOP
h9KJlMZDheXv6SZUkdXxQIVrFzhCaOGy5UA7L2w+3Lyma2LIzGJYCub5uNe6zp+YSlSdn4uIV81K
ZOMDuDjBdltw6CqcPNeZLDfITDcrooLUGznGulA/co3UjRsX8rFYcX5QdeWfR5xOH/DGcIMBaxrB
SzP7CFysI/szB2Bd5cd/fRxlfYRSIv9nyIsToIWPMbFe0bLKjtY72wa6mEOj7e3c8u4uKY1ylSRy
yr1HXWVkY6HwrkahJB0d6ygSc9dVNCLHbCtcK7/o/MBrOVhMYgNf7ISuwKtNTVsaYuRWfQEXnFt8
C9yJyJEtJHKqRfiyXWgdB1vfZxDqmMyQU7XuKkc+rQandzFHWWMpkKP43m43qdWsc1SS037vgJIg
oXWOxFqceqODGPh0S9xdggXZF1+w9rbxSPtqSDMbTYpqidTv0I3E72b8c2FkM8jlxqXKBTUjcLr4
QRE9ymyeTAKEqq5gaMGowkeoQeB9Cm2ZzlUcIiwVdjdlV9kxzTXLDsr6l4umTeA6zpUNzRbQVbrm
+BTfOh0sckYSqMd501xL3knbltRVD/q2TPMlLcZ1xIhOYmjO90wjNQvpYwlL5r6UnyP+M///BRgA
SKoVL7PIwHgAAAAASUVORK5CYII=" transform="matrix(0.433 0 0 0.4335 -13.9579 2.3968)">
		</image>
	</g>
</g>
</svg>

`;
const getUrlDomain = (url) => {
    const start = url.replace(/(https?:\/\/)?(www.)?/i, '');
    if (!start) {
        return null;
    }
    return start.split('/')[0];
};
