// Calendar and down day counter for Faerun
// Created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
// Updated by Julexar (https://app.roll20.net/users/9989180/julexar)

/* API Commands:
!cal - pulls up the Calendar Menu
    --adv {type} --{amount} - Advances the Time.
    --set {type} --{amount} - Sets the day, month, year etc.
    --weather - Pulls up the Weather Menu
        --setclimate {climate} - Sets the climate of the region
        --setterrain {terrain} - Sets the terrain of the region
        --setseason {season} - Sets the season of the region
        --random - Sets a random Weather based on climate, terrain and season
            --ignorepreset - Sets a completely random Weather, ignoring climate, terrain and season
    --toggle weather/moon - Toggles the Weather/Moon Output
    --moon {type} - Sets the Moon state.
    --reset - Resets the Calendar to defaults
    --show - Shows the Calendar to the Players
!alarm - Pulls up the Alarm Menu
    --{number} - Lets you view a certain Alarm
        --set title/date/time --{title/date/time} - Lets you set the title/date/time of the Alarm
        --rem - Removes the Alarm
        --reset - Resets the selected Alarm
    --new - Creates a new Alarm
        --title {title} - Sets the Title of the new Alarm
        --date {date} - Sets the Date of the new Alarm
        --time {time} - Sets the Time of the new Alarm
    --reset - Resets all Alarms

The following format is used:

Time: HH:MM (24 Hour)
Date: DD.MM.YYYY
*/

var Calendar = Calendar || (function() {
    'use strict';
    
    var version = '4.5',
    
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
                wtype: "ON",
                mtype: "ON",
                moon: "",
                moonImg: "",
                prevType: "normal",
                weather: "It is a cool but sunny day.",
                climate: "temperate",
                terrain: "forest",
                season: "spring",
                monlist: "Hammer|Alturiak|Ches|Tarsakh|Mirtul|Kythorn|Flamerule|Eleasis|Eleint|Marpenoth|Uktar|Nightal",
            },
        };
    },

    setTemperatureDefaults = function() {
        state.temp = [
            {
                name: "fall arctic desert",
                temps: [
                    { high: 15, low: 2},
                    //Add remaining temps
                ],
                wind: [
                    { type: "calm breeze" },
                    //Add remaining winds
                ]
            }
            //Add remaining Regions, Temps, etc.
        ]
    },
    
    setAlarmDefaults = function() {
        state.Alarm = []; 
    },
   
    handleInput = function(msg) {
        var args = msg.content.split(/\s+--/);
        
        if (msg.type !== "api") {
			return;
		}
		
		if (playerIsGM(msg.playerid)){
		    switch(args[0]) {
		        case '!cal':
                    if (!args[1]) {
                        if (state.Calendar.now.wtype=="ON") {
                            weather();
                            if (state.Calendar.now.mytype=="ON") {
                                moon(state.Calendar.now.prevType);
                                calmenu();
                                chkalarms();
                            } else if (state.Calendar.now.mtype=="OFF") {
                                calmenu();
                                chkalarms();
                            }
                        } else if (state.Calendar.wtype=="OFF") {
                            if (state.Calendar.now.mtype=="ON") {
                                moon(state.Calendar.now.prevType);
                                calmenu();
                                chkalarms();
                            } else if (state.Calendar.now.mtype=="OFF") {
                                calmenu();
                                chkalarms();
                            }
                        }
                    } else if (args[1].includes("adv")) {
                        let type=args[1].toLowerCase().replace("adv ","");
                        let amount=Number(args[2].replace("amount ",""));
                        if (!type.includes("min") && state.Calendar.now.wtype=="ON") {
                            weather();
                        }
                        if ((!type.includes("min") && !type.includes("short")) && state.Calendar.now.mtype=="ON") {
                            moon(state.Calendar.now.prevType);
                        }
                        advtime(type,amount);
                        calmenu();
                        chkalarms();
                    } else if (args[1].includes("set")) {
                        let type=args[1].toLowerCase().replace("set ","");
                        let amount=Number(args[2].replace("amount ",""));
                        if (!type.includes("min") && state.Calendar.now.wtype=="ON") {
                            weather();
                            if (state.Calendar.now.mtype=="ON") {
                                moon(state.Calendar.now.prevType);
                            }
                        }
                        setTime(type,amount);
                        calmenu();
                        chkalarms();
                    } else if (args[1].includes("toggle")) {
                        let option=args[1].replace("toggle ","");
                        if (option=="weather") {
                            if (state.Calendar.now.wtype=="ON") {
                                state.Calendar.now.wtype="OFF";
                                sendChat("Calendar","/w gm Weather has been toggled off.");
                                calmenu();
                                chkalarms();
                            } else if (state.Calendar.now.wtype=="OFF") {
                                state.Calendar.now.wtype="ON";
                                sendChat("Calendar","/w gm Weather has been toggled on.");
                                calmenu();
                                chkalarms();
                            }
                        } else if (option=="moon") {
                            if (state.Calendar.now.mtype=="ON") {
                                state.Calendar.now.mtype="OFF";
                                sendChat("Calendar","/w gm Moon has been toggled off.");
                                calmenu();
                                chkalarms();
                            } else if (state.Calendar.now.mtype=="OFF") {
                                state.Calendar.now.mtype="ON";
                                sendChat("Calendar","/w gm Moon has been toggled on.");
                                calmenu();
                                chkalarms();
                            }
                        }
                    } else if (args[1].includes("weather")) {
                        if (!args[2]) {
                            weatherMenu();
                        } else if (args[2].includes("set")) {
                            let climate,terrain,season;
                            for (let i=2;i<args.length;i++) {
                                if (args[i].includes("climate")) {
                                    climate=args[i].replace("setclimate ","").toLowerCase();
                                } else if (args[i].includes("terrain")) {
                                    terrain=args[i].replace("setterrain ","").toLowerCase();
                                } else if (args[i].includes("season")) {
                                    season=args[i].replace("setseason ","").toLowerCase();
                                }
                            }
                            calmenu();
                            chkalarms();
                        } else if (args[2]=="random") {
                            if (!args[3]) {
                                weather(state.Calendar.now.climate,state.Calendar.now.terrain,state.Calendar.now.season);
                            } else if (args[3]=="ignorepreset") {
                                weather();
                            }
                            calmenu();
                            chkalarms();
                        }
                    } else if (args[1].includes("moon")) {
                        let type=args[1].toLowerCase().replace("moon ","");
                        if (type=="normal" || type=="random") {
                            state.Calendar.now.prevType=type;
                        } else if (type!=="" && type!==" ") {
                            state.Calendar.now.prevType="custom";
                        }
                        moon(type);
                        calmenu();
                        chkalarms();
                    } else if (args[1]=="reset") {
                        setDefaults();
                        sendChat("Calendar","/w gm Calendar has been reset.");
                        calmenu();
                        chkalarms();
                    } else if (args[1]=="show") {
                        showcal();
                    }
                return;
                case '!alarm':
                    if (!args[1]) {
                        alarmMenu(args[1]);
                    } else if (args[1]) {
                        if (args[1]!=="new" && !args[1].includes("reset") && !args[1]=="" && !args[1]==" ") {
                            let alarm=Number(args[1]);
                            if (!args[2]) {
                                alarmMenu(alarm);
                            } else if (args[2].includes("set ")) {
                                let option=args[2].replace("set ","").toLowerCase();
                                if (!option.includes("title") && !option.includes("date") && !option.includes("time")) {
                                    sendChat("Calendar","/w gm Invalid option, please use \`title\`, \`date\` or \`time\`!");
                                } else {
                                    let title,date,time;
                                    for (let i=2;i<args.length;i+=2) {
                                        if (args[i].includes("title")) {
                                            title=args[i+1].replace("title ","");
                                        } else if (args[i].includes("date")) {
                                            date=args[i+1].replace("date ","");
                                        } else if (args[i].includes("time")) {
                                            time=args[i+1].replace("time ","");
                                        }
                                    }
                                }
                            } else if (args[2]=="rem") {
                                removeAlarm(alarm);
                            } else if (args[2]=="reset") {
                                resetAlarm(alarm);
                            }
                        } else if (args[1].includes("new")) {
                            let option=args[2].replace("set ","").toLowerCase();
                            if (!option.includes("title") && !option.includes("date") && !option.includes("time")) {
                                sendChat("Calendar","/w gm Invalid option, please use \`title\`, \`date\` or \`time\`!");
                            } else {
                                let title,date,time;
                                for (let i=2;i<args.length;i++) {
                                    if (args[i].includes("title")) {
                                        title=args[i].replace("title ","");
                                    } else if (args[i].includes("date")) {
                                        date=args[i].replace("date ","");
                                    } else if (args[i].includes("time")) {
                                        time=args[i].replace("time ","");
                                    }
                                }
                            }
                        } else if (args[1]=="reset") {
                            resetAlarm();
                        }
                    }
                return;
            }
		} else if (!playerIsGM(msg.playerid)) {
            if (args[0]=="!cal" || args[0]=="!showcal") {
                showcal();
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
        var nowdate = getdate(state.Calendar.now.ordinal).split(',');
        var month = nowdate[0];
        var day = nowdate[1];
        var moon = state.Calendar.now.moon;
        var weather = state.Calendar.now.weather;
        var suffix = getsuffix(day);
        var moList=state.Calendar.now.monlist;
        var hour=state.Calendar.now.hour;
        var min=state.Calendar.now.minute;
        var year=state.Calendar.now.year;
        if (hour<10) {
            hour="0"+hour;
        }
        if (min<10) {
            min="0"+min;
        }
        if (state.Calendar.now.wtype=="ON") {
            if (state.Calendar.now.mtype=="ON") {
                sendChat("Calendar","/w gm <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Calendar Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<table>' + //--
                    '<tr><td ' + tdstyle + '>Day: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set day --?{Day?|'+day+'}">' +  day + suffix + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Month: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set month --?{Month?|' + moList + '}">' + month + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Year: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set year --?{Year?|'+year+'}">' + year + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Hour: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set hour --?{Hour?|'+hour+'}">' + hour + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Minute: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set min --?{Minute?|'+min+'}">' + min + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Moon: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --moon ?{Moon?|Full|Waning Gibbours|Last Quarter|Waning Crescent|New|Waxing Crescent|First Quarter|Waxing Gibbous|Random|Normal}">' + moon + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Weather: </td><td ' + tdstyle + '>' + weather + '</td></tr>' + //--
                    '</table>' + //--
                    '<br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --adv ?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year} --?{Amount?|1}">Advance the Date</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --weather">Weather Menu</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --toggle weather">Toggle Weather Display</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --toggle moon">Toggle Moon Display</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!alarm">Alarm Menu</a></div>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --show">Show to Players</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --reset">Reset Calendar</a></div>' + //--
                    '</div>'
                );
            } else if (state.Calendar.now.mtype=="OFF") {
                sendChat("Calendar","/w gm <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Calendar Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<table>' + //--
                    '<tr><td ' + tdstyle + '>Day: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set day --?{Day?|'+day+'}">' +  day + suffix + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Month: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set month --?{Month?|' + moList + '}">' + month + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Year: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set year --?{Year?|'+year+'}">' + year + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Hour: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set hour --?{Hour?|'+hour+'}">' + hour + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Minute: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set min --?{Minute?|'+min+'}">' + min + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Weather: </td><td ' + tdstyle + '>' + weather + '</td></tr>' + //--
                    '</table>' + //--
                    '<br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --adv ?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year} --?{Amount?|1}">Advance the Date</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --weather">Weather Menu</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --toggle weather">Toggle Weather Display</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --toggle moon">Toggle Moon Display</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!alarm">Alarm Menu</a></div>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --show">Show to Players</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --reset">Reset Calendar</a></div>' + //--
                    '</div>'
                );
            }
        } else if (state.Calendar.now.wtype=="OFF") {
            if (state.Calendar.now.mtype=="ON") {
                sendChat("Calendar","/w gm <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Calendar Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<table>' + //--
                    '<tr><td ' + tdstyle + '>Day: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set day --?{Day?|'+day+'}">' +  day + suffix + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Month: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set month --?{Month?|' + moList + '}">' + month + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Year: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set year --?{Year?|'+year+'}">' + year + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Hour: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set hour --?{Hour?|'+hour+'}">' + hour + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Minute: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set min --?{Minute?|'+min+'}">' + min + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Moon: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --moon ?{Moon?|Full|Waning Gibbours|Last Quarter|Waning Crescent|New|Waxing Crescent|First Quarter|Waxing Gibbous|Random|Normal}">' + moon + '</a></td></tr>' + //--
                    '</table>' + //--
                    '<br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --adv ?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year} --?{Amount?|1}">Advance the Date</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --weather">Weather Menu</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --toggle weather">Toggle Weather Display</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --toggle moon">Toggle Moon Display</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!alarm">Alarm Menu</a></div>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --show">Show to Players</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --reset">Reset Calendar</a></div>' + //--
                    '</div>'
                );
            } else if (state.Calendar.now.mtype=="OFF") {
                sendChat("Calendar","/w gm <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Calendar Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<table>' + //--
                    '<tr><td ' + tdstyle + '>Day: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set day --?{Day?|'+day+'}">' +  day + suffix + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Month: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set month --?{Month?|' + moList + '}">' + month + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Year: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set year --?{Year?|'+year+'}">' + year + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Hour: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set hour --?{Hour?|'+hour+'}">' + hour + '</a></td></tr>' + //--
                    '<tr><td ' + tdstyle + '>Minute: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --set min --?{Minute?|'+min+'}">' + min + '</a></td></tr>' + //--
                    '</table>' + //--
                    '<br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --adv ?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year} --?{Amount?|1}">Advance the Date</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --weather">Weather Menu</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --toggle weather">Toggle Weather Display</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --toggle moon">Toggle Moon Display</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!alarm">Alarm Menu</a></div>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --show">Show to Players</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --reset">Reset Calendar</a></div>' + //--
                    '</div>'
                );
            }
        }
    },
    
    showcal = function() {
        var nowdate = getdate(state.Calendar.now.ordinal).split(',');
        var month = nowdate[0];
        var day = nowdate[1];
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
        } else {
            hour=state.Calendar.now.hour;
        }
        if (Number(state.Calendar.now.minute)<10) {
            minute=`0${state.Calendar.now.minute}`;
        } else {
            minute=state.Calendar.now.minute;
        }
        
        
        sendChat("Calendar", '<div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>Calendar</div>' + //--
            '<div ' + substyle + '>Player View</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            day + suffix + ' of ' + month + ', ' + state.Calendar.now.year + //--
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
            state.Calendar.now.month=String(month);
            date=day;
        }else if(day>30 && day<=60){
            month="Alturiak";
            state.Calendar.now.month=String(month);
            date=day-30;
        }else if(day>60 && day<=90){
            month="Ches";
            state.Calendar.now.month=String(month);
            date=day-60;
        }else if(day>90 && day<=120){
            month="Tarsakh";
            state.Calendar.now.month=String(month);
            date=day-90;
        }else if(day>120 && day<=150){
            month="Mirtul";
            state.Calendar.now.month=String(month);
            date=day-120;
        }else if(day>150 && day<=180){
            month="Kythorn";
            state.Calendar.now.month=String(month);
            date=day-150;
        }else if(day>180 && day<=210){
            month="Flamerule";
            state.Calendar.now.month=String(month);
            date=day-180;
        }else if(day>210 && day<=240){
            month="Eleasias";
            state.Calendar.now.month=String(month);
            date=day-210;
        }else if(day>240 && day<=270){
            month="Eleint";
            state.Calendar.now.month=String(month);
            date=day-240;
        }else if(day>270 && day<=300){
            month="Marpenoth";
            state.Calendar.now.month=String(month);
            date=day-270;
        }else if(day>300 && day<=330){
            month="Uktar";
            state.Calendar.now.month=String(month);
            date=day-300;
        }else if(day>330 && day<360){
            month="Nightal";
            state.Calendar.now.month=String(month);
            date=day-335;
        }
        state.Calendar.now.month=String(month);
        state.Calendar.now.day=date;
        state.Calendar.now.ordinal=getordinal(month+","+date);
        var array=month+','+String(date);
        return array;    
    },
    
    getordinal = function(options){
        var args = options.content.split(",");
        var date = args[1];
        var month = args[2];
        var ordinal = state.Calendar.now.ordinal;
        date=date.replace("st","");
        date=date.replace("nd","");
        date=date.replace("rd","");
        date=date.replace("th","");
        date = Number(date);
        
        switch(month) {
            case 'Hammer':
                ordinal = date;
                state.Calendar.now.month=String(month);
                break;
            case 'Alturiak':
                ordinal = 30+date;
                state.Calendar.now.month=String(month);
                break;
            case 'Ches':
                ordinal = 60+date;
                state.Calendar.now.month=String(month);
                break;
            case 'Tarsakh':
                ordinal = 90+date;
                state.Calendar.now.month=String(month);
                break;
            case 'Mirtul':
                ordinal = 120+date;
                state.Calendar.now.month=String(month);
                break;
            case 'Kythorn':
                ordinal = 150+date;
                state.Calendar.now.month=String(month);
                break;
            case 'Flamerule':
                ordinal = 180+date;
                state.Calendar.now.month=String(month);
                break;
            case 'Eleasias':
                ordinal = 210+date;
                state.Calendar.now.month=String(month);
                break;
            case 'Eleint':
                ordinal = 240+date;
                state.Calendar.now.month=String(month);
                break;
            case 'Marpenoth':
                ordinal = 270+date;
                state.Calendar.now.month=String(month);
                break;
            case 'Uktar':
                ordinal = 300+date;
                state.Calendar.now.month=String(month);
                break;
            case 'Nightal':
                ordinal = 330+date;
                state.Calendar.now.month=String(month);
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
    
    weatherMenu = function() {
        var divstyle = 'style="width: 220px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var tablestyle = 'style="text-align:center;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var tdstyle = 'style="padding: 2px; padding-left: 5px; border: none;"';
        if (state.Calendar.now.wtype=="ON") {
            let climate=state.Calendar.now.climate;
            let terrain=state.Calendar.now.terrain;
            let season=state.Calendar.now.season;
            sendChat("Calendar","/w gm <div " + divstyle + ">" + //--
                '<div ' + headstyle + '>Weather Menu</div>' + //--
                '<div ' + arrowstyle + '></div>' + //--
                '<div style="text-align:center;">Weather Display: <a ' + astyle1 + '" href="!cal --toggle weather">Toggle off</a></div>' + //--
                '<br>' + //--
                '<table>' + //--
                '<tr><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --weather --setclimate ?{Climate?|Arctic|Subarctic|Subtropical|Temperate|Tropical}">' + climate + '</a></td></tr>' + //--
                '<tr><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --weather --setterrain ?{Terrain?|Desert|Forest|Hills|Mountains|Plains|Seacoast}">' + terrain + '</a></td></tr>' + //--
                '<tr><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --weather --setseason ?{Season?|Spring|Summer|Fall|Winter}">' + season + '</a></td></tr>' + //--
                '</table>' + //--
                '<br>' + //--
                '<div style="text-align:center;">Current Weather</div>' + //--
                '<div style="text-align:left;">' + state.Calendar.now.weather + '</div>' + //--
                '<br><br>' + //--
                '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --weather --random">Roll Weather</a></div>' + //--
                '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --weather --random --ignorepreset">Random Weather</a></div>' + //--
                '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal">Go Back</a></div>' + //--
                '</div>'
            );
        } else if (state.Calendar.now.wtype=="OFF") {
            sendChat("Calendar","/w gm <div " + divstyle + ">" + //--
                '<div ' + headstyle + '>Weather Menu</div>' + //--
                '<div ' + arrowstyle + '></div>' + //--
                '<div style="text-align:center;">Weather Display: <a ' + astyle1 + '" href="!cal --toggle weather">Toggle on</a></div>' + //--
                '<br>' + //--
                '<table>' + //--
                '<tr><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --weather --setclimate ?{Climate?|Arctic|Subarctic|Subtropical|Temperate|Tropical}">' + climate + '</a></td></tr>' + //--
                '<tr><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --weather --setterrain ?{Terrain?|Desert|Forest|Hills|Mountains|Plains|Seacoast}">' + terrain + '</a></td></tr>' + //--
                '<tr><td ' + tdstyle + '><a ' + astyle1 + '" href="!cal --weather --setseason ?{Season?|Spring|Summer|Fall|Winter}">' + season + '</a></td></tr>' + //--
                '</table>' + //--
                '<br>' + //--
                '<div style="text-align:center;">Current Weather</div>' + //--
                '<div style="text-align:left;">' + state.Calendar.now.weather + '</div>' + //--
                '<br><br>Info: Weather will not appear on Calendar!<br><br>' + //--
                '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --weather --random">Roll Weather</a></div>' + //--
                '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal --weather --random --ignorepreset">Random Weather</a></div>' + //--
                '<div style="text-align:center;"><a ' + astyle2 + '" href="!cal">Go Back</a></div>' + //--
                '</div>'
            );
        }
    },

    weather = function(climate,terrain,season) {
        if (climate && terrain && season) {
            let tempData = state.temp.find(t => t.name==`${season} ${climate} ${terrain}`);
            let randomIndex = randomInteger(tempData.temps.length - 1);
            let low = tempData.temps[randomIndex].low;
            let high = tempData.temps[randomIndex].high;
            randomIndex=randomInteger(tempsData.weather.length-1);
            let forecast = "The sky is " + tempData.weather[randomIndex].type;
            randomIndex=randomInteger(tempsData.wind.length-1);
            let wind = "with " + tempData.wind[randomIndex].speed + tempData.wind[randomIndex].wind + `(${tempData.wind[randomIndex].direction}).`; 
            let weather = `Today's Temperatures lay at a low of ${low}°C and a high of ${high}°C\n${forecast} ${wind}`;
            state.Calendar.now.weather=weather;
        } else if (!climate && !terrain && !season) {
            let randomSeason = randomInteger(4);
            let randomClimate = randomInteger(5);
            let randomTerrain = randomInteger(6);
            if (randomSeason==1) {
                randomSeason="spring";
            } else if (randomSeason==2) {
                randomSeason="summer";
            } else if (randomSeason==3) {
                randomSeason="fall";
            } else if (randomSeason==4) {
                randomSeason="winter";
            }
            if (randomClimate==1) {
                randomClimate="arctic";
            } else if (randomClimate==2) {
                randomClimate="subarctic";
            } else if (randomClimate==3) {
                randomClimate="subtropical";
            } else if (randomClimate==4) {
                randomClimate="temperate";
            } else if (randomClimate==5) {
                randomClimate="tropical";
            }
            if (randomTerrain==1) {
                randomTerrain="desert";
            } else if (randomTerrain==2) {
                randomTerrain="forest";
            } else if (randomTerrain==3) {
                randomTerrain="hills";
            } else if (randomTerrain==4) {
                randomTerrain="mountains";
            } else if (randomTerrain==5) {
                randomTerrain="plains";
            } else if (randomTerrain==6) {
                randomTerrain="seacost";
            }
            let tempData = state.temp.find(t => t.name==`${randomSeason} ${randomClimate} ${randomTerrain}`);
            let randomIndex = randomInteger(tempData.temps.length-1);
            let low = tempData.temps[randomIndex].low;
            let high = tempData.temps[randomIndex].high;
            randomIndex=randomInteger(tempsData.weather.length-1);
            let forecast = "The sky is " + tempData.weather[randomIndex].type;
            randomIndex=randomInteger(tempsData.wind.length-1);
            let wind = "with " + tempData.wind[randomIndex].speed + tempData.wind[randomIndex].wind + `(${tempData.wind[randomIndex].direction}).`; 
            let weather = `Today's Temperatures lay at a low of ${low}°C and a high of ${high}°C\n${forecast} ${wind}`;
            state.Calendar.now.weather=weather;
        }
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
        var hour=Number(state.Calendar.now.hour);
        var minute=Number(state.Calendar.now.minute);
        var day=Number(state.Calendar.now.day);
        var year=Number(state.Calendar.now.year);
        var month=0;
        var rtype = type.toLowerCase();
        var ordinal=Number(state.Calendar.now.ordinal);
        var cmonth=String(state.Calendar.now.month);
        var rmonth;
        switch (cmonth) {
            case 'Hammer':
                rmonth=1;
                break;
            case 'Alturiak':
                rmonth=2;
                break;
            case 'Ches':
                rmonth=3;
                break;
            case 'Tarsakh':
                rmonth=4;
                break;
            case 'Mirtul':
                rmonth=5;
                break;
            case 'Kythorn':
                rmonth=6;
                break;
            case 'Flamerule':
                rmonth=7;
                break;
            case 'Eleasias':
                rmonth=8;
                break;
            case 'Eleint':
                rmonth=9;
                break;
            case 'Marpenoth':
                rmonth=10;
                break;
            case 'Uktar':
                rmonth=11;
                break;
            case 'Nightal':
                rmonth=12;
                break;
        }
        month=rmonth;
        for (let i=0;i<Number(amount);i++) {
            if (rtype=="short rest") {
                hour+=1;
            } else if (rtype=="long rest") {
                hour+=8;
            } else if (rtype=="days") {
                ordinal+=1;
                day+=1;
            } else if (rtype=="months") {
                ordinal+=30;
                month+=1;
            } else if (rtype=="years") {
                ordinal+=360;
            }
        }
        year+=Math.floor(ordinal/360);
        while (ordinal>360) {
            ordinal-=360;
        }
        day+=Math.floor(hour/24);
        while (hour>24) {
            hour-=12;
        }
        while (day>30) {
            day-=30;
        }
        while (month>12) {
            month-=12;
        }
        switch (month) {
            case 1:
                cmonth="Hammer";
                break;
            case 2:
                cmonth="Alturiak";
                break;
            case 3:
                cmonth="Ches";
                break;
            case 4:
                cmonth="Tarsakh";
                break;
            case 5:
                cmonth="Mirtul";
                break;
            case 6:
                cmonth="Kythorn";
                break;
            case 7:
                cmonth="Flamerule";
                break;
            case 8:
                cmonth="Eleasias";
                break;
            case 9:
                cmonth="Eleint";
                break;
            case 10:
                cmonth="Marpenoth";
                break;
            case 11:
                cmonth="Uktar";
                break;
            case 12:
                cmonth="Nightal";
                break;
        }
        state.Calendar.now.ordinal=ordinal;
        state.Calendar.now.day=day;
        state.Calendar.now.month=cmonth;
        state.Calendar.now.year=year;
        state.Calendar.now.hour=hour;
        state.Calendar.now.minute=minute;
    },
    
    setalarm = function(anum,tday,tmonth,tyear,thour,tminute,ttitle) {
        var day=Number(tday);
        var month=String(tmonth);
        var year=Number(tyear);
        var hour=Number(thour);
        var minute=Number(tminute);
        var title=String(ttitle);
        var maxday=30;
        var rday=0;
        var num=anum;
        if (Number(hour)<10) {
            hour=`0${hour}`;
        }
        if (Number(minute)<10) {
            minute=`0${minute}`;
        }
        sendChat("Calendar",`/w gm Your Alarm >>${title}<< has been set for Day ${day} of ${month} of the Year ${year} at ${hour}:${minute}`);
        if (day>maxday) {
            sendChat("Calendar","/w gm Error with the Input. The chosen month only has "+maxday+" days!");
        } else {
            
            if (month!="Hammer") {
                rday=Number(day)+30;
                if (month!="Alturiak") {
                    rday+=30;
                    if (month!="Ches") {
                        rday+=30;
                        if (month!="Tarsakh") {
                            rday+=30;
                            if (month!="Mirtul") {
                                rday+=30;
                                if (month!="Kythorn") {
                                    rday+=30;
                                    if (month!="Flamerule") {
                                        rday+=30;
                                        if (month!="Eleasias") {
                                            rday+=30;
                                            if (month!="Eleint") {
                                                rday+=30;
                                                if (month!="Marpenoth") {
                                                    rday+=30;
                                                    if (month!="Uktar") {
                                                        rday+=30;
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
                if (Number(state.Calendar.now.hour)>=Number(state.Alarm1.now.hour)) {
                    if (Number(state.Calendar.now.minute)>=Number(state.Alarm1.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm1.now.title}<< triggered!`);
                    }
                }
            }
        } 
    },
    
    chkalarm2 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm2.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm2.now.day)) {
                if (Number(state.Calendar.now.hour)>=Number(state.Alarm2.now.hour)) {
                    if (Number(state.Calendar.now.minute)>=Number(state.Alarm2.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm2.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm3 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm3.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm3.now.day)) {
                if (Number(state.Calendar.now.hour)>=Number(state.Alarm3.now.hour)) {
                    if (Number(state.Calendar.now.minute)>=Number(state.Alarm3.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm3.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm4 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm4.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm4.now.day)) {
                if (Number(state.Calendar.now.hour)>=Number(state.Alarm4.now.hour)) {
                    if (Number(state.Calendar.now.minute)>=Number(state.Alarm4.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm4.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm5 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm5.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm5.now.day)) {
                if (Number(state.Calendar.now.hour)>=Number(state.Alarm5.now.hour)) {
                    if (Number(state.Calendar.now.minute)>=Number(state.Alarm5.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm5.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm6 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm6.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm6.now.day)) {
                if (Number(state.Calendar.now.hour)>=Number(state.Alarm6.now.hour)) {
                    if (Number(state.Calendar.now.minute)>=Number(state.Alarm6.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm6.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm7 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm7.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm7.now.day)) {
                if (Number(state.Calendar.now.hour)>=Number(state.Alarm7.now.hour)) {
                    if (Number(state.Calendar.now.minute)>=Number(state.Alarm7.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm7.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm8 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm8.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm8.now.day)) {
                if (Number(state.Calendar.now.hour)>=Number(state.Alarm8.now.hour)) {
                    if (Number(state.Calendar.now.minute)>=Number(state.Alarm8.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm8.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm9 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm9.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm9.now.day)) {
                if (Number(state.Calendar.now.hour)>=Number(state.Alarm9.now.hour)) {
                    if (Number(state.Calendar.now.minute)>=Number(state.Alarm9.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm9.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    chkalarm10 = function() {
        if (Number(state.Calendar.now.year)==Number(state.Alarm10.now.year)) {
            if (Number(state.Calendar.now.ordinal)==Number(state.Alarm10.now.day)) {
                if (Number(state.Calendar.now.hour)>=Number(state.Alarm10.now.hour)) {
                    if (Number(state.Calendar.now.minute)>=Number(state.Alarm10.now.minute)) {
                        sendChat("Calendar",`/w gm Alarm >>${state.Alarm10.now.title}<< triggered!`);
                    }
                }
            }
        }
    },
    
    encounter = function(loc) {
        var rand=Math.random();
        if (String(loc)=="Wilderness") {
            if (rand<=0.125) {
                sendChat("Calendar","/w gm No Encounters today!");
            } else if (rand<=0.5) {
                sendChat("Calendar","/w gm There is 1 Encounter today!");
            } else if (rand<=0.875) {
                sendChat("Calendar","/w gm There are 2 Encounters today!");
            } else {
                sendChat("Calendar","/w gm There are 3 Encounters today!");
            }
        } else if (String(loc)=="City") {
            if (rand<=0.125) {
                sendChat("Calendar","/w gm There are 2 Encounters today!");
            } else if (rand<=0.5) {
                sendChat("Calendar","/w gm There are 3 Encounters today!");
            } else if (rand<=0.875) {
                sendChat("Calendar","/w gm There are 4 Encounters today!");
            } else {
                sendChat("Calendar","/w gm There are 5 Encounters today!");
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
