/*
Calendar for Eberron, Faerun, Greyhawk, Modern and Tal'Dorei Settings
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Using NoteLog Script from Aaron (https://app.roll20.net/users/104025/the-aaron)

API Commands:
!cal - Shows the menu to the person that issued the Command. GM menu has more Options.
    --world {world}- Allows the GM to change the world to one of the Options (Eberron, Faerun, Greyhawk, Modern, Tal'Dorei)
    --adv {type} --{amount} - Allows the GM to advance the time by a certain amount and a certain type (Short Rest, Long Rest, Hour, Minute, Day, Week, Month, Year)
    --set {type} --{amount} - Allows the GM to set the day, month, year etc. Putting "random" in either will randomise it.
    --weather {type} - Allows the GM to set the weather. Putting "Random" will randomise the weather.
    --moon {type} - Allows the GM to set the moon state. Putting "Random" will randomise it.
    --enc - Rolls on the Encounter table.
    --reset - Will reset everything.
!alarm --{number} - Lets you set a specific Alarm. Type a number from 1 to 10 in {number}.
    --title {title} - Sets the title of the Alarm.
    --date {date} - Sets the Alarm to a certain date. This uses the following format: DD.MM.YYYY
    --time {time} - Sets the Alarm for a certain time. This uses the following format (24 Hour): HH:MM
*/
var Calendar = Calendar || (function() {
    'use strict';
    
    var version = "5.0a",
    
    setDefaults = function() {
        state.calendar = {
            now: {
                world: 1,
                ordinal: 1,
                year: 1486,
                divider: 1,
                day: 1,
                month: "Hammer",
                hour: 1,
                minute: 0,
                weather: "It is a cool but sunny day",
                moon: "Full Moon",
                mtype: "ON",
                wtype: "ON"
            }
        };
    },
    
    setAlarmDefaults = function() {
        state.Alarm1 = {
            now: {
                day: 1,
                month: "",
                year: 1486,
                hour: 1,
                minute: 0,
                title: ""
            }
        };
    },
    
    handleInput = function(msg) {
        var args=msg.content.split(/\s+--/);
        if (msg.type!=="api") {
            return;
        }
        
        if (playerIsGM(msg.playerid)) {
            if (args[0]=="!cal") {
                if (!args[1] || args[1]=="") {
                    calmenu();
                    chkalarms();
                } else if ((args[1].toLowerCase()).includes("world")) {
                    let option=(args[1].toLowerCase()).replace("world ","");
                    if (option.includes("random")) {
                        let rand=randomInteger(5);
                        state.calendar.now.world=rand;
                    } else if (option.includes("eberron")) {
                        state.calendar.now.world=4;
                    } else if (option.includes("faerun")) {
                        state.calendar.now.world=1;
                    } else if (option.includes("greyhawk")) {
                        state.calendar.now.world=2;
                    } else if (option.includes("modern")) {
                        state.calendar.now.world=3;
                    } else if (option.includes("tal")) {
                        state.calendar.now.world=5;
                    }
                } else if ((args[1].toLowerCase()).includes("adv")) {
                    let type=String(args[1].toLowerCase()).replace("adv ","");
                    let amount=Number(args[2]);
                    switch (type) {
                        case 'short rest':
                            addtime(amount,"hour");
                            return;
                        case 'long rest':
                            addtime(amount*8,"hour");
                            return;
                        case 'hour':
                            addtime(amount,"hour");
                            return;
                        case 'minute':
                            addtime(amount,"minute");
                            return;
                        case 'day':
                            advdate(amount,"day");
                            return;
                        case 'weel':
                            advdate(amount,"week");
                            return;
                        case 'month':
                            advdate(amount,"month");
                            return;
                        case 'year':
                            advdate(amount,"year");
                            return;
                    }
                } else if ((args[1].toLowerCase()).includes("set")) {
                    let type=String(args[1].toLowerCase()).replace("set ","");
                    let amount=Number(args[2]);
                    if (type.includes("hour")) {
                        state.calendar.now.hour=amount;
                    } else if (type.includes("minute")) {
                        state.calendar.now.minute=amount;
                    } else if (type.includes("day")) {
                        switch (Number(state.calendar.now.world)) {
                            case 1:
                                getFaerunOrdinal(amount,state.calendar.now.month);
                                return;
                            case 2:
                                getGreyhawkOrdinal(amount,state.calendar.now.month);
                                return;
                            case 3:
                                getModernOrdinal(amount,state.calendar.now.month);
                                return;
                            case 4:
                                getEberronOrdinal(amount,state.calendar.now.month);
                                return;
                            case 5:
                                getTalOrdinal(amount,state.calendar.now.month);
                        }
                    } else if (type.includes("month")) {
                        let month=args[2].toLowerCase();
                        switch (Number(state.calendar.now.world)) {
                            case 1:
                                getFaerunOrdinal(state.calendar.now.day,month);
                                return;
                            case 2:
                                getGreyhawkOrdinal(state.calendar.now.day,month);
                                return;
                            case 3:
                                getModernOrdinal(state.calendar.now.day,month);
                                return;
                            case 4:
                                getEberronOrdinal(state.calendar.now.day,month);
                                return;
                            case 5:
                                getTalOrdinal(state.calendar.now.day,month);
                                return;
                        }
                    } else if (type.includes("year")) {
                        state.calendar.now.year=Number(args[2]);
                    }
                    calmenu();
                    chkalarms();
                } else if ((args[1].toLowerCase()).includes("weather")) {
                    weather((args[1].toLowerCase()).replace("weather ",""));
                    calmenu();
                    chkalarms();
                } else if ((args[1].toLowerCase()).includes("moon")) {
                    moon((args[1].toLowerCase()).replace("moon ",""));
                    calmenu();
                    chkalarms();
                } else if ((args[1].toLowerCase()).includes("enc")) {
                    encounter();
                    calmenu();
                    chkalarms();
                } else if ((args[1].toLowerCase()).includes("reset")) {
                    reset();
                    calmenu();
                }
            } else if (args[0]=="!alarm") {
                if (!args[2]) {
                    alarmmenu(args[1]);
                } else {
                    createAlarm(args[1],args[2]);
                }
            }
        } else if (!playerIsGM(msg.playerid)) {
            if (args[0]=="!cal") {
                showcal(msg);
            }
        }
    },

    calmenu = function() {
        var divstyle = 'style="width: 220px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var tablestyle = 'style="text-align:center;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var tdstyle = 'style="padding: 2px; padding-left: 5px; border: none;"';
        var world=getWorld();
        var moMenu = getMoMenu();
        var ordinal = state.calendar.now.ordinal;
        var nowDate;
        switch (Number(state.calendar.now.world)) {
            case 1:
                nowDate=getFaerunDate(ordinal).split(',');
                return;
            case 2:
                nowDate=getGreyhawkDate(ordinal).split(',');
                return;
            case 3:
                nowDate=getModernDate(ordinal).split(',');
                return;
            case 4:
                nowDate=getEberronDate(ordinal).split(',');
                return;
            case 5:
                nowDate=getTalDate(ordinal).split(',');
                return;
        }
        var month=nowDate[0];
        var day=nowDate[1];
        var suffix=getSuffix(day);
        var moon=state.calendar.now.moon;
        var hour=state.calendar.now.hour;
        var min=state.calendar.now.minute;
        var year = state.calendar.now.year;
        if (hour<10) {
            hour="0"+hour;
        }
        if (min<10) {
            min="0"+min;
        }
        
        sendChat("Calendar","/w gm <div " + divstyle + ">" + //--
            '<div ' + headstyle + '>Calendar</div>' + //--
            '<div ' + substyle + '>Menu</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            '<table' + tablestyle + '>' + //--
            '<tr><td ' + tdstyle + '>World: </td><td ' + tdstyle + '>' + world + '</td></tr>' + //--
            '<tr><td ' + tdstyle + '>Day: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set Day --?{Day?|1}">' + day + suffix + '</a></td></tr>' + //--
            '<tr><td ' + tdstyle + '>Month: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set Month --' + moMenu + '">' + month + '</a></td></tr>' + //-- 
            '<tr><td ' + tdstyle + '>Year: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set Year --?{Year?|'+year+'}">' + year + '</a></td></tr>' + //--
            '<tr><td ' + tdstyle + '>Hour: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set Hour --?{Hour?|'+state.calendar.now.hour+'}">' + hour + '</a></td></tr>' + //--
            '<tr><td ' + tdstyle + '>Minute: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set Minute --?{Minute?|'+state.calendar.now.minute+'}">' + min + '</a></td></tr>' + //--
            '<tr><td ' + tdstyle + '>Moon: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --moon ?{Moon?|Full Moon|Waning Gibbous|Last Quarter|Waning Crescent|New Moon|Waxing Crescent|First Quarter|Waxing Gibbous|Random}">' + moon + '</a></td></tr>' + //--
            '</table>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --adv ?{Type?|Short Rest|Long Rest|Hour|Minute|Day|Week|Month|Year} --?{Amount?|1}">Advance the Date</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --enc'
        );
    },

    alarmmenu = function(num,title,date,time) {
        var divstyle = 'style="width: 220px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var tablestyle = 'style="text-align:center;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var tdstyle = 'style="padding: 2px; padding-left: 5px; border: none;"';
        num=Number(num);
        if (title && date && time) {
            let splitDate=date.split('.');
            let splitTime=time.split(':');
            sendChat("Calendar","/w gm <div " + divstyle + ">" + //--
                '<div ' + headstyle + '>Alarm</div>' + //--
                '<div ' + substyle + '>Menu</div>' + //--
                '<div ' + arrowstyle + '></div>' + //--
                '<table ' + tablestyle + '>' + //--
                '<tr><td ' + tdstyle + '>Alarm: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!alarm --?{Number?|'+num+'}">' + num + '</a></td></tr>' + //--
                '<tr><td ' + tdstyle + '>Title: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!alarm --' + num + ' --title ?{Title?|'+title+'}">' + title + '</a></td></tr>' + //--
                '<tr><td ' + tdstyle + '>Date: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!alarm --' + num + ' --date ?{Day?|'+splitDate[0]+'}.?{Month?|'+splitDate[1]+'}.?{Year?|'+splitDate[2]+'}">' + date + '</a></td></tr>' + //--
                '<tr><td ' + tdstyle + '>Time: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!alarm --' + num + ' --time ?{Hour?|'+splitTime[0]+'}:?{Minute?|'+splitTime[1]+'}">' + time + '</a></td></tr>' + //--
                '</table>' + //--
                '</div>'
            );
        } else {
            getAlarm(num);
        }
    },

    createAlarm = function(num,type) {
        num=Number(num.replace("num ",""));
        let alarm=findObjs({
            _type: "handout",
            name: "Alarm #"+num
        }, {caseInsensitive: true})[0];
        if (!alarm) {
            alarm=createObj("handout",{
                name: "Alarm #"+num
            });
        }
        if (type.includes("title")) {
            type=type.replace("title ","");
            alarm.set("notes",type);
        } else if (type.includes("date")) {
            type=type.replace("date ","");
            alarm.get("gmnotes",function(gmnotes) {
                let notes=String(gmnotes);
                if (notes.includes(";")) {
                    notes=notes.split(';');
                    alarm.set("gmnotes",type+';'+notes[1]);
                } else {
                    alarm.set("gmnotes",type+";");
                }
            });
        } else if (type.includes("time")) {
            type=type.replace("time ","");
            alarm.get("gmnotes",function(gmnotes) {
                let notes=String(gmnotes);
                if (notes.includes(";")) {
                    notes=notes.split(';');
                    alarm.set("gmnotes",notes[0]+';'+type);
                } else {
                    alarm.set("gmnotes",";"+type);
                }
            });
        }
    },

    getAlarm = function(num) {
        let alarm=findObjs({
            _type: "handout",
            name: "Alarm #"+num
        }, {caseInsensitive: true})[0];
        if (!alarm) {
            sendChat("Calendar","/w gm Could not find an Alarm with that Number!");
        } else {
            alarm.get("notes",function(notes) {
                let title=String(notes);
                alarm.get("gmnotes",function(gmnotes) {
                    let datetime=String(gmnotes);
                    datetime=datetime.split(';');
                    let date=String(datetime[0]);
                    let time=String(datetime[1]);
                    alarmmenu(num,title,date,time);
                });
            });
        }
    },
    chkalarms = function() {
        let alarms=findObjs({
            _type: 'handout'
        });
    },

    checkInstall = function() {
        if (!state.Calendar) {
            setDefaults();
        }
        if (!state.Alarm) {
            setAlarmDefaults();
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
on("ready",function() {
    'use strict';
    Calendar.CheckInstall();
    Calendar.RegisterEventHandlers();
});
