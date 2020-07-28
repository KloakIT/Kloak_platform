const OneMin = 1000 * 60
const OneHour = OneMin * 60
const OneDay =  OneHour * 24
const limit = 4
const eachLine = 1

class twitter {
    public text_following = ['正在关注','フォロー中','Following','個跟隨中']
    public text_follower = ['个关注者','フォロワー','Followers','位跟隨者']
    public retweeted = ['转推了','さんがリツイート','Retweeted','已轉推']
    public twitterTimeArray = ko.observableArray ( this.twitterObj )
    public showTimeData = [
        dataTimeString => {
            return this.getTime ( dataTimeString, 0 )
        },
        dataTimeString => {
            return this.getTime ( dataTimeString, 1 )
        },
        dataTimeString => {
            return this.getTime ( dataTimeString, 2 )
        },
        dataTimeString => {
            return this.getTime ( dataTimeString, 3 )
        },
    ]

    public showUserTimeData = [
        dataTimeString => {
            return this.getTimeUser ( dataTimeString, 0 )
        },
        dataTimeString => {
            return this.getTimeUser ( dataTimeString, 1 )
        },
        dataTimeString => {
            return this.getTimeUser ( dataTimeString, 2 )
        },
        dataTimeString => {
            return this.getTimeUser ( dataTimeString, 3 )
        },
    ]

    private min = ['分','分','m','分']
    private hours = ['小时','時間','h','小時']
    private mouth = ['月','月','','月']
    private month_eng = ['Jan','Feb','Mar','Apr','May','June','Jul','Aug','Sep','Oct','Nov','Dec']

    private getmonth ( mon, leng ) {
        if ( leng === 2 ) {
            return this.month_eng [ mon ]
        }
        return `${ mon + 1 }${ this.mouth [ leng ]}`
    }

    constructor ( public twitterObj: any [], public twitterHref, public serialNumber, private buffer, public showAccount: boolean ) {

    }

    public getTimeUser (  timeString, lang ) {
        const now = new Date()
        const create = new Date ( timeString )
        const range = now.getTime() - create.getTime ()
        if ( range < OneDay ) {
            return this.getTime ( timeString, lang ).replace ('·','')
        }
        if (  lang === 2 ) {
            return `${ this.getTime ( timeString, lang ).replace ('·','') } ${ create.getFullYear() }`
        }

        return `${ create.getFullYear() }年${ this.getTime ( timeString, lang ).replace ('·','') }日`
        
    }

    public getTime ( timeString, lang ) {
        const now = new Date()
        const create = new Date ( timeString )
        const range = now.getTime() - create.getTime ()
        /**
         *      less than one day
         */
        if ( range < OneDay ) {
            /**
             *      less than one hour
             */
            if ( range < OneHour ) {
                const mins = Math.round ( range / OneMin )
                return `· ${ mins }${ this.min [ lang ]}`
            }
            const hour = Math.round ( range / OneHour )
            return `· ${ hour }${ this.hours [ lang ]}`
        }
        const month = create.getMonth()
        const day = create.getDate()
        return `· ${ this.getmonth( month, lang ) }${ lang === 2 ? ' ': ''}${ day }`
    }

    public textareaHeight ( index, Quoted = false ) {
        const twitterObj: any = this.twitterTimeArray()[ index ]
        const id = twitterObj.id
        const d = document.getElementById( id )
        const lines = twitterObj.full_text.split ('\n')
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
        const high = d.scrollTop + d.scrollHeight + ( Quoted ? 16: 0 )
        
		return high + 'px'
    }

    public userTextareaHeight ( id ) {
        
       
        const d = document.getElementById( id )
       
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
        const high = d.scrollTop + d.scrollHeight
		return high + 'px'
    }

    public userCountFormat ( cc: number ) {
        const hh = cc.toString()
        return hh.replace(/\B(?=(\d{3})+(?!\d))/g,',')
    }
 }