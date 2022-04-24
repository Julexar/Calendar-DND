// Calendar and down day counter for Faerun
// Created by Kirsty (https://app.roll20.net/users/1165285/kirsty)

// API Commands:
// !cal - for the GM displays the menu in the chat window, for a player displays date, weather, moon, hour and minute

// Red Colour: #7E2D40

var Calendar = Calendar || (function() {
    'use strict';
    
    var version = '0.2.4',
    
    setDefaults = function() {
        state.Calendar = {
            now: {
                ordinal: 1,
                year: 1486,
                down: 0,
                divider: 1,
                day: 1,
                month: "",
                hour: 5,
                minute: 5,
                weather: "It is a cool but sunny day"
            },
        };
    },
    
    setAlarm1Defaults = function() {
        state.Alarm1 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 1,
                title: "",
            },
        };  
    },
    
    setAlarm2Defaults = function() {
        state.Alarm2 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 1,
                title: "",
            },
        };
    },
    
    setAlarm3Defaults = function() {
        state.Alarm3 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 1,
                title: "",
            },
        };
    },
    
    setAlarm4Defaults = function() {
        state.Alarm4 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 1,
                title: "",
            },
        };
    },
    
    setAlarm5Defaults = function() {
        state.Alarm5 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 1,
                title: "",
            },
        };
    },
    
    setAlarm6Defaults = function() {
        state.Alarm6 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 1,
                title: "",
            },
        };
    },
    
    setAlarm7Defaults = function() {
        state.Alarm7 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 1,
                title: "",
            },
        };
    },
    
    setAlarm8Defaults = function() {
        state.Alarm8 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 1,
                title: "",
            },
        };
    },
    
    setAlarm9Defaults = function() {
        state.Alarm9 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 1,
                title: "",
            },
        };
    },
    
    setAlarm10Defaults = function() {
        state.Alarm10 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 1,
                title: "",
            },
        };
    },
   
    handleInput = function(msg) {
        var args = msg.content.split(",");
        
        if (msg.type !== "api") {
			return;
		}
		
		if(playerIsGM(msg.playerid)){
		    switch(args[0]) {
		        case '!cal':
                    calmenu();
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
                case '!setday':
                    getordinal(msg);
                    weather();
                    calmenu();
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
                case '!setmonth':
                    getordinal(msg);
                    weather();
                    calmenu();
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
                case '!setyear':
                    state.Calendar.now.year=args[1];
                    calmenu();
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
                case '!addday':
                    addday(args[1]);
                    weather();
                    calmenu();
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
                case '!sethour':
                    state.Calendar.now.hour=args[1];
                    calmenu();
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
                case '!setminute':
                    state.Calendar.now.minute=args[1];
                    calmenu();
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
                case '!advtime':
                    advtime(args[1],args[2]);
                    calmenu();
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
                case '!setalarm':
                    setalarm(args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
                case '!weather':
                    weather();
                    calmenu();
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
                case '!playercal':
                    showcal(msg);
                    chkalarm1();
                    chkalarm2();
                    chkalarm3();
                    chkalarm4();
                    chkalarm5();
                    chkalarm6();
                    chkalarm7();
                    chkalarm8();
                    chkalarm9();
                    chkalarm10();
                    break;
    	    }
		}else if(args[0]=='!cal'){
		    showcal(msg);
		}
    },
    
    calmenu = function() {
        var divstyle = 'style="width: 189px; border: 1px solid black; background-color: #ffffff; padding: 5px;"'
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var tablestyle = 'style="text-align:center;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var down = state.Calendar.now.down;
        down = getdown(down);
        var nowdate = getdate(state.Calendar.now.ordinal).split(',');
        var month = nowdate[0];
        var day = nowdate[1];
        var moon = getmoon();
        
        sendChat('Calendar', '/w gm <div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>Calendar</div>' + //--
            '<div ' + substyle + '>Menu</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            '<table>' + //--
            '<tr><td>Day: </td><td><a ' + astyle1 + '" href="!setday,?{Day?|1},' + month +'">' + day + '</a></td></tr>' + //--
            '<tr><td>Month: </td><td><a ' + astyle1 + '" href="!setmonth,' + day + ',?{Month|Hammer|Midwinter|Alturiak|Ches|Tarsakh|Greengrass|Mirtul|Kythorn|Flamerule|Midsummer|Eleasias|Eleint|Highharvestide|Marpenoth|Uktar|Feast of the Moon|Nightal}">' + month + '</a></td></tr>' + //--
            '<tr><td>Year: </td><td><a ' + astyle1 + '" href="!setyear,?{Year?|1486}">' + state.Calendar.now.year + '</a></td></tr>' + //--
            '<tr><td>Hour: </td><td><a ' + astyle1 + '" href="!sethour,?{Hour?|5}">' + state.Calendar.now.hour + '</a></td></tr>' + //--
            '<tr><td>Minute: </td><td><a ' + astyle1 + '" href="!setminute,?{Minute?|5}">' + state.Calendar.now.minute + '</a></td></tr>' + //--
            '</table>' + //--
            '<br>Weather: ' + state.Calendar.now.weather + //--
            '<br><br>Moon: ' + moon + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!advtime,?{Format of Time?|Short Rest|Long Rest|Days|Months|Years},?{Amount?|5}">Advance the Time</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!weather">Roll Weather</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!setalarm,?{Alarmnumber?|Alarm1|Alarm2|Alarm3|Alarm4|Alarm5|Alarm6|Alarm7|Alarm8|Alarm9|Alarm10},?{Day?|5},?{Month?|Hammer|Alturiak|Ches|Tarsakh|Mirtul|Kythorn|Flamerule|Eleasias|Eleint|Marpenoth|Uktar|Nightal},?{Year?|1486},?{Hour?|5},?{Minute?|5},?{Title?|1}">Set an Alarm</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!playercal">Show to Players</a></div>' + //--
            '</div>'
        );
    },
    
    showcal = function(msg) {
        var nowdate = getdate(state.Calendar.now.ordinal).split(',');
        var month = nowdate[0];
        var day = nowdate[1];
        var down = state.Calendar.now.down;
            down = getdown(down);
        var suffix = getsuffix(day);
        var divstyle = 'style="width: 189px; border: 1px solid black; background-color: #ffffff; padding: 5px;"'
        var tablestyle = 'style="text-align:center;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var moon = getmoon();
        var downstr;
        var hour;
        var minute;
        if (Number(state.Calendar.now.hour)<10) {
            hour=`0${state.Calendar.now.hour}`;
        }
        if (Number(state.Calendar.now.minute)<10) {
            minute=`0${state.Calendar.now.minute}`;
        }
        
        
        sendChat(msg.who, '<div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>Calendar</div>' + //--
            '<div ' + substyle + '>Player View</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            day + suffix + ' ' + month + ', ' + state.Calendar.now.year + //--
            '<br>Current Time: ' + hour + ':' + minute + //--
            '<br><br>Today\'s weather:<br>' + state.Calendar.now.weather + //--
            '<br><br>Moon: ' + moon
        );
    },
    
    getdate = function(options){
        var day = Number(options);
        var date;
        var month;
        
        if(day>0 && day<=30){
            month="Hammer"; 
            date=day;
        }else if(day==31){
            month="Midwinter"; 
            date='festival';
        }else if(day>31 && day<=61){
            month="Alturiak"; 
            date=day-31;
        }else if(day>61 && day<=91){
            month="Ches";
            date=day-61;
        }else if(day>91 && day<=121){
            month="Tarsakh";
            date=day-91;
        }else if(day==122){
            month="Greengrass";
            date='festival';
        }else if(day>122 && day<=152){
            month="Mirtul";
            date=day-122;
        }else if(day>152 && day<=182){
            month="Kythorn";
            date=day-152;
        }else if(day>182 && day<=212){
            month="Flamerule";
            date=day-182;
        }else if(day==213){
            month="Midsummer";
            date='festival';
        }else if(day>213 && day<=243){
            month="Eleasias"
            date=day-213;
        }else if(day>243 && day<=273){
            month="Eleint";
            date=day-243;
        }else if(day==274){
            month="Highharvestide";
            date='festival';
        }else if(day>274 && day<=304){
            month="Marpenoth";
            date=day-274;
        }else if(day>304 && day<=334){
            month="Uktar";
            date=day-304;
        }else if(day==335){
            month="Feast of the Moon";
            date='festival';
        }else if(day>335 && day<=365){
            month="Nightal";
            date=day-335;
        }else{
            month="Hammer";
            date='1';
        }
        
        var array=month+','+String(date);
        return array;    
    },
    
    getordinal = function(options){
        var args = options.content.split(",");
        var date = args[1];
        var month = args[2];
        var ordinal = state.Calendar.now.ordinal;
        
        if(date == 'festival'){
            date = 1;
        }else{
            date = Number(args[1]);
        }
        
        switch(month) {
            case 'Hammer':
                ordinal = date;
                break;
            case 'Midwinter':
                ordinal = 31;
                break;
            case 'Alturiak':
                ordinal = 31+date;
                break;
            case 'Ches':
                ordinal = 61+date;
                break;
            case 'Tarsakh':
                ordinal = 91+date;
                break;
            case 'Greengrass':
                ordinal = 122;
                break;
            case 'Mirtul':
                ordinal = 122+date;
                break;
            case 'Kythorn':
                ordinal = 152+date;
                break;
            case 'Flamerule':
                ordinal = 182+date;
                break;
            case 'Midsummer':
                ordinal = 213;
                break;
            case 'Eleasias':
                ordinal = 213+date;
                break;
            case 'Eleint':
                ordinal = 243+date;
                break;
            case 'Highharvestide':
                ordinal = 274;
                break;
            case 'Marpenoth':
                ordinal = 274+date;
                break;
            case 'Uktar':
                ordinal = 304+date;
                break;
            case 'Feast of the Moon':
                ordinal = 334+date;
                break;
            case 'Nightal':
                ordinal = 335+date;
                break;
            }
        state.Calendar.now.ordinal = ordinal;
    },
    
    getsuffix = function(day) {
        
        var date = Number(day)
        var suffix
        
        if (date == 1 || date == 21 ){
            suffix = 'st';
        }else if (date == 2 || date == 22){
            suffix = 'nd';
        }else if (date == 3 || date == 23){
            suffix = 'rd';
        }else{
            suffix = 'th';
        }
        
        return suffix;
    },
    
    getdown = function(days) {
        var down = Number(days);
        var div = state.Calendar.now.div;
        
        if(div!=0){
            down = down/div;
        }
        
        return down;
    },
    
    addday = function(add) {
        var ordinal = Number(add);
        var div = state.Calendar.now.div;
        
        if(div!=0){
            state.Calendar.now.down = Number(state.Calendar.now.down)+ordinal;
        }
        
        
        ordinal = ordinal + Number(state.Calendar.now.ordinal);
        
        if(ordinal>365){
            ordinal=ordinal-365;
            state.Calendar.now.year = Number(state.Calendar.now.year)+1;
        }
        
        state.Calendar.now.ordinal = ordinal;
    },
    
    weather = function() {
        var roll;
        var temperature;
        var wind;
        var precipitation;
        var season;
        var ordinal = state.Calendar.now.ordinal;
        
        if(ordinal > 349 || ordinal <= 75){
            season = 'Winter'
        }else if(ordinal > 75 && ordinal <= 166){
            season = 'Spring'
        }else if(ordinal > 166 && ordinal <=257 ){
            season = 'Summer'
        }else if(ordinal > 257 && ordinal <=349 ){
            season = 'Fall'
        }
        
        roll = Math.floor(Math.random()*(20-1+1)+1);
        if(roll>=15 && roll<=17){
            switch(season) {
                case 'Winter':
                    temperature = 'It is a bitterly cold winter day. ';
                    break;
                case 'Spring':
                    temperature = 'It is a cold spring day. ';
                    break;
                case 'Summer':
                    temperature = 'It is a cool summer day. ';
                    break;
                case 'Fall':
                    temperature = 'It is a cold fall day. ';
                    break;
            }
        }else if(roll>=18 && roll<=20){
            switch(season) {
                case 'Winter':
                    temperature = 'It is a warm winter day. ';
                    break;
                case 'Spring':
                    temperature = 'It is a hot spring day. ';
                    break;
                case 'Summer':
                    temperature = 'It is a blisteringly hot summer day. ';
                    break;
                case 'Fall':
                    temperature = 'It is a hot fall day. ';
                    break;
            }
        }else{
            switch(season) {
                case 'Winter':
                    temperature = 'It is a cold winter day. ';
                    break;
                case 'Spring':
                    temperature = 'It is a mild spring day. ';
                    break;
                case 'Summer':
                    temperature = 'It is a hot summer day. ';
                    break;
                case 'Fall':
                    temperature = 'It is a mild fall day. ';
                    break;
            }
            
        }
        
        roll = Math.floor(Math.random()*(20-1+1)+1);
        if(roll>=15 && roll<=17){
            wind='There is a light breeze and ';
        }else if(roll>=18 && roll<=20){
            wind='There is a howling wind and ';
        }else{
            wind='The air is still and ';
        }
        
        roll = Math.floor(Math.random()*(20-1+1)+1);
        if(roll>=15 && roll<=17){
            precipitation="Light rain or snow.";
            if(season=='Winter'){
                precipitation = 'snow falls softly on the ground.';
            }else{
                precipitation = 'a light rain falls from the sky.';
            }
        }else if(roll>=18 && roll<=20){
            if(season=='Winter'){
                precipitation = 'snow falls thick and fast from the sky.';
            }else{
                precipitation = 'a torrential rain begins to fall.';
            }
        }else{
            roll = Math.floor(Math.random()*(2-1+1)+1);
            if(roll=1){
                precipitation = 'the sky is overcast.';
            }else{
                precipitation = 'the sky is clear.';
            }
        }
        
        var forecast=temperature+wind+precipitation;
        state.Calendar.now.weather = forecast;
    },
    
    getmoon = function() {
        var ordinal = state.Calendar.now.ordinal;
        var moonNo;
        var moon;
        
        moonNo = Math.ceil(ordinal/3)-Math.floor(Math.ceil(ordinal/3)/8)*8;
        
        switch(moonNo) {
            case 1:
                moon = 'First Quarter';
                break;
            case 2:
                moon = 'Waxing Cresent';
                break;
            case 3:
                moon = 'New';
                break;
            case 4:
                moon = 'Waning Cresent';
                break;
            case 5:
                moon = 'Third Quarter';
                break;
            case 6:
                moon = 'Waning Gibbous';
                break;
            case 7:
                moon = 'Full';
                break;
            case 0:
                moon = 'Waxing Gibbous';
                break;
        }
        
        return moon;
    },
    
    advtime = function(type,amount) {
        var hours=0;
        var minutes=0;
        var days=0;
        var years=0;
        var months=0;
        var months=0;
        var rtype = type.toLowerCase();
        var ordinal;
        for (let i=0;i<Number(amount);i++) {
            if (rtype=="short rest") {
                hours+=1;
            } else if (rtype=="long rest") {
                hours+=8;
            } else if (rtype=="days") {
                days+=1;
            } else if (rtype=="months") {
                months+=1;
            } else if (rtype=="years") {
                years+=1;
            }
            if (hours>24) {
                hours-=24;
                days+=1;
            }
            if (minutes>60) {
                minutes-=60;
                hours+=1;
            }
            if (months>12) {
                months-=12;
                years+=1;
            }
            if (days>30) {
                month+=1;
                days-=30;
            }
        }
        if (days>0) {
            adday(days);
        }
        if (hours>0) {
            state.Calendar.now.hour=Number(state.Calendar.now.hour)+hours;
        }
        if (minutes>0) {
            state.Calendar.now.minute=Number(state.Calendar.now.minute)+minutes;
        }
        if (years>0) {
            state.Calendar.now.year=Number(state.Calendar.now.year)+years;
        }
        if (month>0) {
            var monthlist = "Hammer,1;Alturiak,2;Ches,3;Tarsakh,4;Mirtul,5;Kythorn,6;Flamerule,7;Eleasias,8;Eleint,9;Marpenoth,10;Uktar,11;Nightal,12";
            var list1 = monthlist.split(';');
            let list2="";
            for (let i=0;i<list1.length;i++) {
                list2=list2+String(list1[i]);
                if (i!=list1.length-1) {
                    list2=list2+",";
                } 
            }
            var list3=list2.split(',');
            var monnum;
            var month;
            for (let i=0;i<list3.length;i++) {
                if (list3[i]==state.Calendar.now.month) {
                    monnum=i+1;
                }
            }
            for (let i=0;i<amount;i++) {
                monnum=Number(monnum)+2
                if (monnum>23) {
                    monnum=1;
                }
            }
            month=list3[monnum-1];
            state.Calendar.now.month=month;
        }
    },
    
    setalarm = function(anum,tday,tmonth,tyear,thour,tminute,ttitle) {
        var day=Number(tday);
        var month=String(tmonth);
        var year=Number(tyear);
        var hour=Number(thour);
        var minute=Number(tminute);
        var title=String(ttitle);
        var maxday;
        var rday=0;
        var num=anum;
        if (Number(hour)<10) {
            hour=`0${hour}`;
        }
        if (Number(minute)<10) {
            minute=`0${minute}`;
        }
        switch (month) {
            case 'Hammer':
                maxday=31;
                break;
            case 'Ches':
                maxday=30;
                break;
            case 'Tarsakh':
                maxday=30;
                break;
            case 'Mirtul':
                maxday=31;
                break;
            case 'Kythorn':
                maxday=30;
                break;
            case 'Flamerule':
                maxday=31;
                break;
            case 'Eleasias':
                maxday=30;
                break;
            case 'Eleint':
                maxday=31;
                break;
            case 'Marpenoth':
                maxday=30;
                break;
            case 'Uktar':
                maxday=31;
                break;
            case 'Nightal':
                maxday=30;
                break;
        }
        sendChat("Calendar",`/w gm Your Alarm >>${title}<< has been set for Day ${day} of ${month} of the Year ${year} at ${hour}:${minute}`);
        if (day>maxday) {
            sendChat("Calendar","/w gm Error with the Input. The chosen month only has "+maxday+" days!");
        } else {
            
            if (month!="Hammer") {
                rday=Number(day)+31;
                if (month!="Alturiak") {
                    rday+=30;
                    if (month!="Ches") {
                        rday+=30;
                        if (month!="Tarsakh") {
                            rday+=30;
                            if (month!="Mirtul") {
                                rday+=31;
                                if (month!="Kythorn") {
                                    rday+=30;
                                    if (month!="Flamerule") {
                                        rday+=31;
                                        if (month!="Eleasias") {
                                            rday+=30;
                                            if (month!="Eleint") {
                                                rday+=31;
                                                if (month!="Marpenoth") {
                                                    rday+=30;
                                                    if (month!="Uktar") {
                                                        rday+=31;
                                                        if (month=="Nightal") {
                                                            rday+=30;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (num=="Alarm1") {
                state.Alarm1.now.day=Number(rday);
                state.Alarm1.now.month=month;
                state.Alarm1.now.year=Number(year);
                state.Alarm1.now.hour=Number(hour);
                state.Alarm1.now.minute=Number(minute);
                state.Alarm1.now.title=title;
                
            } else if (num=="Alarm2") {
                state.Alarm2.now.day=Number(rday);
                state.Alarm2.now.month=month;
                state.Alarm2.now.year=Number(year);
                state.Alarm2.now.hour=Number(hour);
                state.Alarm2.now.minute=Number(minute);
                state.Alarm2.now.title=title;
            } else if (num=="Alarm3") {
                state.Alarm3.now.day=Number(rday);
                state.Alarm3.now.month=month;
                state.Alarm3.now.year=Number(year);
                state.Alarm3.now.hour=Number(hour);
                state.Alarm3.now.minute=Number(minute);
                state.Alarm3.now.title=title;
            } else if (num=="Alarm4") {
                state.Alarm4.now.day=Number(rday);
                state.Alarm4.now.month=month;
                state.Alarm4.now.year=Number(year);
                state.Alarm4.now.hour=Number(hour);
                state.Alarm4.now.minute=Number(minute);
                state.Alarm4.now.title=title;
            } else if (num=="Alarm5") {
                state.Alarm5.now.day=Number(rday);
                state.Alarm5.now.month=month;
                state.Alarm5.now.year=Number(year);
                state.Alarm5.now.hour=Number(hour);
                state.Alarm5.now.minute=Number(minute);
                state.Alarm5.now.title=title;
            } else if (num=="Alarm6") {
                state.Alarm6.now.day=Number(rday);
                state.Alarm6.now.month=month;
                state.Alarm6.now.year=Number(year);
                state.Alarm6.now.hour=Number(hour);
                state.Alarm6.now.minute=Number(minute);
                state.Alarm6.now.title=title;
            } else if (num=="Alarm7") {
                state.Alarm7.now.day=Number(rday);
                state.Alarm7.now.month=month;
                state.Alarm7.now.year=Number(year);
                state.Alarm7.now.hour=Number(hour);
                state.Alarm7.now.minute=Number(minute);
                state.Alarm7.now.title=title;
            } else if (num=="Alarm8") {
                state.Alarm8.now.day=Number(rday);
                state.Alarm8.now.month=month;
                state.Alarm8.now.year=Number(year);
                state.Alarm8.now.hour=Number(hour);
                state.Alarm8.now.minute=Number(minute);
                state.Alarm8.now.title=title;
            } else if (num=="Alarm9") {
                state.Alarm9.now.day=Number(rday);
                state.Alarm9.now.month=month;
                state.Alarm9.now.year=Number(year);
                state.Alarm9.now.hour=Number(hour);
                state.Alarm9.now.minute=Number(minute);
                state.Alarm9.now.title=title;
            } else if (num=="Alarm10") {
                state.Alarm10.now.day=Number(rday);
                state.Alarm10.now.month=month;
                state.Alarm10.now.year=Number(year);
                state.Alarm10.now.hour=Number(hour);
                state.Alarm10.now.minute=Number(minute);
                state.Alarm10.now.title=title;
            }
        }
    },
    
    chkalarm1 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm1.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm1.now.day)) {
                if (Number(state.Calendar.now.hour)==Number(state.Alarm1.now.hour)) {
                    if (Number(state.Calendar.now.minute)==Number(state.Alarm1.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm1.now.title}<< triggered!`);
                    }
                }
            }
        } 
    },
    
    chkalarm2 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm2.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm2.now.day)) {
                if (Number(state.Calendar.now.hour)==Number(state.Alarm2.now.hour)) {
                    if (Number(state.Calendar.now.minute)==Number(state.Alarm2.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm2.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm3 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm3.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm3.now.day)) {
                if (Number(state.Calendar.now.hour)==Number(state.Alarm3.now.hour)) {
                    if (Number(state.Calendar.now.minute)==Number(state.Alarm3.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm3.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm4 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm4.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm4.now.day)) {
                if (Number(state.Calendar.now.hour)==Number(state.Alarm4.now.hour)) {
                    if (Number(state.Calendar.now.minute)==Number(state.Alarm4.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm4.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm5 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm5.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm5.now.day)) {
                if (Number(state.Calendar.now.hour)==Number(state.Alarm5.now.hour)) {
                    if (Number(state.Calendar.now.minute)==Number(state.Alarm5.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm5.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm6 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm6.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm6.now.day)) {
                if (Number(state.Calendar.now.hour)==Number(state.Alarm6.now.hour)) {
                    if (Number(state.Calendar.now.minute)==Number(state.Alarm6.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm6.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm7 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm7.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm7.now.day)) {
                if (Number(state.Calendar.now.hour)==Number(state.Alarm7.now.hour)) {
                    if (Number(state.Calendar.now.minute)==Number(state.Alarm7.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm7.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm8 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm8.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm8.now.day)) {
                if (Number(state.Calendar.now.hour)==Number(state.Alarm8.now.hour)) {
                    if (Number(state.Calendar.now.minute)==Number(state.Alarm8.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm8.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm9 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm9.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm9.now.day)) {
                if (Number(state.Calendar.now.hour)==Number(state.Alarm9.now.hour)) {
                    if (Number(state.Calendar.now.minute)==Number(state.Alarm9.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm9.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm10 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm10.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm10.now.day)) {
                if (Number(state.Calendar.now.hour)==Number(state.Alarm10.now.hour)) {
                    if (Number(state.Calendar.now.minute)==Number(state.Alarm10.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm10.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    checkInstall = function() {
        // Check if the Calendar property exists, creating it if it doesn't
        if( ! state.Calendar ) {
            setDefaults();
        }
        if ( ! state.Alarm1 ) {
            setAlarm1Defaults();
        }
        if ( ! state.Alarm2 ) {
            setAlarm2Defaults();
        }
        if ( ! state.Alarm3 ) {
            setAlarm3Defaults();
        }
        if ( ! state.Alarm4 ) {
            setAlarm4Defaults();
        }
        if ( ! state.Alarm5 ) {
            setAlarm5Defaults();
        }
        if ( ! state.Alarm6 ) {
            setAlarm6Defaults();
        }
        if ( ! state.Alarm7 ) {
            setAlarm7Defaults();
        }
        if ( ! state.Alarm8 ) {
            setAlarm8Defaults();
        }
        if ( ! state.Alarm9 ) {
            setAlarm9Defaults();
        }
        if ( ! state.Alarm10 ) {
            setAlarm10Defaults();
        }
    },
    
    registerEventHandlers = function() {
        on('chat:message', handleInput);
	};

	return {
	    CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
	
}());

on("ready",function(){
	'use strict';
	Calendar.CheckInstall();
	Calendar.RegisterEventHandlers();
});
