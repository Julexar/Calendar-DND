/* Calendar and down day counter for Faerun
Created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Updated by Julexar (https://app.roll20.net/users/9989180/julexar)

API Commands:

GM Commands
!cal
Displays the Calendar Menu
    --setday --{Insert Number}
    Sets the Day
    --setmonth --{Insert Number/Name}
    Sets the Month
    --setyear --{Insert Number}
    Sets the Year
    --sethour --{Insert Number}
    Sets the Hour
    --setmin --{Insert Number}
    Sets the Minute
    --advtime --{Insert Number} --{Insert Type}
    Advances the Time
    --weather
    Randomises the Weather
        --toggle
            Toggles the Weather Display
    --setmoon --{Insert Number/Phase}
    Sets the Moon Phase
    --toggle-moon
    Toggles the Moon Display
    --show
    Shows the Calendar to the Players
!month --{Name/Number} --{Insert new Name}
Renames a Month
!alarm
Displays the Alarm Menu
    --{Insert Number/Title}
    Lets you view a certain Alarm
Player Commands:
!cal
Displays the current Calendar
    --new --title {Title} --date {Date} --time {Time}
    Lets you create a new Alarm
    --{number}
    Lets you edit a specific Alarm. Type the Number of the Alarm.
        --settitle {title}
        Sets the title of the Alarm.
        --setdate {date}
        Sets the Alarm to a certain date. This uses the following format: DD.MM.YYYY
        --settime {time}
        Sets the Alarm to a certain time. This uses the following format (24 Hour): HH:MM
*/
const styles = {
    divMenu: 'style="width: 300px; border: 1px solid black; background-color: #ffffff; padding: 5px;"',
    divButton: 'style="text-align:center;"',
    buttonSmall: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 75px;',
    buttonMedium: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;',
    buttonLarge: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;',
    table: 'style="text-align:center; font-size: 12px; width: 100%; border-style: 3px solid #cccccc;"',
    arrow: 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"',
    header: 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"',
    sub: 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"',
    tdReg: 'style="text-align: right;"',
    trTab: 'style="text-align: left; border-bottom: 1px solid #cccccc;"',
    tdTab: 'style="text-align: center; border-right: 1px solid #cccccc;"',
    span: 'style="display: inline; width: 10px; height: 10px; padding: 1px; border: 1px solid black; background-color: white;"'
};

const moonList = ["Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent", "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous"];

const monthList = ["Hammer","Alturiak","Ches","Tarsakh","Mirtul","Kythorn","Flamerule","Eleasias","Eleint","Marpenoth","Uktar","Nightal"];
class Calendar {
    "use strict";
    constructor() {
        this.style = styles;
        this.default = state.calendar;
        this.moons = moonList;
        this.months = monthList;
        this.alarms = state.alarms;
    };

    handleInput(msg) {
        const args = msg.content.split(/\s+--/);
        if (msg.type!="api") {
            return;
        }
        if (playerIsGM(msg.playerid)) {
            switch (args[0]) {
                case "!cal":
                    switch (args[1]) {
                        case undefined:
                            calendarMenu();
                        return;
                        case "setday":
                            const day = Number(args[2]);
                            if (!day) {
                                sendChat("Calendar DND", "/w gm Invalid Number!");
                            } else {
                                state.calendar.ord = day;
                                calendarMenu();
                            }
                        return;
                        case "setmonth":
                            const month = Number(args[2]);
                            if (!month) {
                                sendChat("Calendar DND", "/w gm Invalid Number!");
                            } else {
                                state.calendar.month = month;
                                getOrdinal();
                                calendarMenu();
                            }
                        return;
                        case "setyear":
                            const year = Number(args[2]);
                            if (!year) {
                                sendChat("Calendar DND", "/w gm Invalid Number!");
                            } else {
                                state.calendar.year += year;
                                calendarMenu();
                            }
                        return;
                        case "sethour":
                            const hour = Number(args[2]);
                            if (!hour) {
                                sendChat("Calendar DND", "/w gm Invalid Number!");
                            } else {
                                if (state.calendar.wtype) {
                                    rollWeather();
                                    calendarMenu();
                                } else {
                                    calendarMenu();
                                }
                            }
                        return;
                        case "setmin":
                            const min = Number(args[2]);
                            if (!min) {
                                sendChat("Calendar DND", "/w gm Invalid Number!");
                            } else {
                                calendarMenu();
                            }
                        return;
                        case "advtime":
                            const amount = Number(args[2]);
                            const type = args[3];
                            if (!amount) {
                                sendChat("Calendar DND", "/w gm Invalid Amount!");
                                if (!type) {
                                    sendChat("Calendar DND", "/w gm Invalid Type!");
                                } else {
                                    advDate(amount, type);
                                    calendarMenu();
                                }
                            }
                        return;
                        case "weather":
                            if (!args[2]) {
                                rollWeather();
                                calendarMenu();
                            } else {
                                if (state.calendar.wtype) {
                                    state.calendar.wtype = false;
                                } else {
                                    state.calendar.wtype = true;
                                    rollWeather();
                                }
                                calendarMenu();
                            }
                        return;
                        case "setmoon":
                            const moon = args[2];
                            if (!moon) {
                                sendChat("Calendar DND", "/w gm Invalid Command!");
                            } else {
                                getMoonImg(moon);
                                calendarMenu();
                            }
                        return;
                        case "toggle-moon":
                            if (state.calendar.mtype) {
                                state.calendar.mtype = false;
                            } else {
                                state.calendar.mtype = true;
                            }
                            calendarMenu();
                        return;
                        case "show":
                            showCal();
                        return;
                    }
                return;
                case "!alarm":
                    if (!args[1]) {
                        alarmMenu();
                    } else {
                        if (args[1]=="new") {
                            if (!args[2]) {
                                sendChat("Calendar DND", "/w gm You must define a Title for your Alarm!");
                            } else {
                                let title;
                                let date;
                                let time;
                                for (let i=2;i<=args.length-1;i++) {
                                    if (args[i].includes("title")) {
                                        title=args[i].replace("title ","");
                                    } else if (args[i].includes("date")) {
                                        date=args[i].replace("date ","");
                                    } else if (args[i].includes("time")) {
                                        time=args[i].replace("time ","");
                                    }
                                }
                                createAlarm(title, date, time);
                            }
                        } else if (args[1]!=="" && args[1]!=" ") {
                            if (!args[2]) {
                                alarmMenu(Number(args[1]))
                            } else if (args[2].includes("settitle")) {
                                const title = args[2].replace("settitle ", "");
                                editAlarm(num, "title", title);
                            } else if (args[2].includes("setdate")) {
                                const date = args[2].replace("setdate ", "");
                                editAlarm(num, "date", date);
                            } else if (args[2].includes("settime")) {
                                const time = args[2].replace("settime ", "");
                                editAlarm(num, "time", time);
                            }
                            alarmMenu(num);
                        }
                    }
                return;
                case "!month":
                    const month = args[2];
                    if (!args[3]) {
                        sendChat("Calendar DND", "/w gm You must provide a new Name for the Month!");
                    } else {
                        if (Number(month)==null) {
                            for (let i=0;i<monthList;i++) {
                                if (monthList[i].toLowerCase().includes(month.toLowerCase())) {
                                    sendChat("Calendar DND", `/w gm The Month \"${monthList[i]}\" has been renamed to \"${args[3]}\"!"}`);
                                    monthList[i] = args[3];
                                }
                            }
                        }
                    }
                return;
            }
        } else {
            switch (args[0]) {
                case "!cal":
                    showCal();
                return;
            }
        }
    };

    checkInstall() {
        if (!state.calendar) {
            setDefaults();
        }
        if (!state.alarms) {
            setAlarmDefaults();
        }
    };

    registerEventHandlers() {
        on("chat:message", this.handleInput);
        log("Calendar DND - Registered Event Handlers!");
    };
};

const calendar = new Calendar();

function setDefaults() {
    state.calendar = {
        ord: 1,
        year: 1486,
        day: 1,
        month: 1,
        monthName: "Hammer",
        hour: 1,
        minute: 0,
        weather: "It is a cool but sunny day",
        moon: 1,
        moonImg: "",
        wtype: true,
        mtype: true
    };
    log("Calendar DND - Successfully registered defaults!");
};

function setAlarmDefaults() {
    state.alarms = [];
    log("Calendar DND - Successfully registered Alarm defaults!");
}

function getOrdinal() {
    const date = state.calendar.day;
    const month = state.calendar.month;
    let ordinal = state.calendar.ord;
    ordinal = 30*(month-1) + date;
    state.calendar.ord = ordinal;
};

function getSuffix() {
    const date = state.calendar.day;
    let suffix;
    if (date == 1 || date == 21) {
        suffix = "st";
    } else if (date == 2 || date == 22) {
        suffix = "nd";
    } else if (date == 3 || date == 23) {
        suffix = "rd";
    } else {
        suffix = "th";
    }
    return suffix;
};

function getDate() {
    let day = state.calendar.ord;
    while (day > 360) {
        day-=360;
        state.calendar.year++;
    }
    let date;
    let month;
    if (Math.ceil(day/30) <= 1) {
        month = calendar.months[0];
        date = day;
        state.calendar.month = 1;
    } else {
        month = calendar.months[Math.ceil(day/30)-1];
        date = day - 30*(Math.ceil(day/30) - 1);
        state.calendar.month = Math.ceil(day/30);
    }
    state.calendar.day = date;
    state.calendar.monthName = month;
};

function getMoon() {
    const ord = state.calendar.ord;
    const year = state.calendar.year;
    const remainder = year/4 - Math.floor(year/4);
    let moonArray;
    if (remainder == 0.25) {
        moonArray = getMoonArray(2);
    } else if (remainder == 0.5) {
        moonArray = getMoonArray(3);
    } else if (remainder == 0.75) {
        moonArray = getMoonArray(4);
    } else if (remainder == 0) {
        moonArray = getMoonArray(1);
    }
    const moonNum = moonArray.split(",");
    getMoonImg(moonNum[ord]);
};

function getMoonImg(moonNum) {
    let moon;
    let type;
    if (Number(moonNum)==null) {
        switch (moonNum) {
            case "full moon":

            break;
            case "waning gibbous":

            break;
            case "last quarter":

            break;
            case "waning crescent":

            break;
            case "new moon":

            break;
        }
    } else {
        switch (Number(moonNum)) {
            case 1 || 0:
                type = "Full Moon";
                moon = "https://www.dropbox.com/s/yo8aqiyw8y8zbzh/full%20moon.jpg?dl=1";
            break;
            case 2 || 3 || 4:
                type = "Waning Gibbous";
                moon = "https://www.dropbox.com/s/lgffcyw68w1df9l/waning%20gibbous.jpg?dl=1"
            break;
            case 5:
                type = "Last Quarter";
                moon = "https://www.dropbox.com/s/o509ci5j2goqvqc/last%20quarter.jpg?dl=1";
            break;
            case 6 || 7 || 8:
                type = "Waning Crescent";
                moon = "https://www.dropbox.com/s/3fccjvk2v88hqqo/waning%20crescent.jpg?dl=1";
            break;
            case 9:
                type = "New Moon";
                moon = "https://www.dropbox.com/s/jpq8tl2m00e8m0j/new%20moon.jpg?dl=1";
            break;
            case 10 || 11 || 12:
                type = "Waxing Crescent";
                moon = "https://www.dropbox.com/s/b8p388vrvv3jw2j/waxing%20crescent.jpg?dl=1";
            break;
            case 13:
                type = "First Quarter";
                moon = "https://www.dropbox.com/s/glnn9q9swr5o3wk/first%20quarter.jpg?dl=1";
            break;
            case 14 || 15 || 16:
                type = "Waxing Gibbous";
                moon = "https://www.dropbox.com/s/b4li1bckebp4cua/waxing%20gibbous.jpg?dl=1";
            break;
        }
        state.calendar.moonImg = moon;
        state.calendar.moon = type;
    }
};

function getMoonArray(num) {
    let moonArray;
    switch (num) {
        case 1:
            moonArray = '0,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,4,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1';
        break;
        case 2:
            moonArray = '0,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1';
        break;
        case 3:
            moonArray = '0,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1';
        break;
        case 4:
            moonArray = '0,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16';
        break;
    }
    return moonArray;
};

function calendarMenu() {
    getDate();
    const suffix = getSuffix();
    const day = state.calendar.day;
    const month = state.calendar.monthName;
    const year = state.calendar.year;
    let hour = state.calendar.hour;
    let min = state.calendar.minute;
    if (hour<10) {
        hour = `0${hour}`;
    }
    if (min<10) {
        min = `0${min}`;
    }
    const weather = state.calendar.weather;
    getMoon();
    const moon = state.calendar.moon;
    if (state.calendar.wtype && state.calendar.mtype) {
        sendChat("Calendar DND", "/w gm <div " + calendar.style.divMenu + ">" + //--
            '<div ' + calendar.style.header + '>Calendar Menu</div>' + //--
            '<div ' + calendar.style.arrow + '></div>' + //--
            '<table>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Day: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setday --?{Day?|' + day + '}">' + day + suffix + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Month: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setmonth --?{Month?|' + state.calendar.month + '}">' + month + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Year: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setyear --?{Year?|' + year + '}">' + year + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Hour: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --sethour --?{Hour?|' + state.calendar.hour + '}">' + hour + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Minute: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setmin --?{Minute?|' + state.calendar.minute + '}">' + min + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Moon: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setmoon --?{Moon?|' + calendar.moons.join("|") + '}">' + moon + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Weather: </td><td ' + calendar.style.tdReg + '>' + weather + '</td></tr>' + //--
            '</table>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --advtime --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Hour|Minute|Day|Week|Month|Year}">Advance the Date</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --weather --toggle">Toggle Weather Display</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --toggle-moon">Toggle Moon Display</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --weather">Randomise Weather</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!alarm --new --title ?{Title?|Insert Title} --date ?{Date?|DD.MM.YYYY} --time ?{Time?|HH:MM}">Create Alarm</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --show">Show to Players</a></div>' + //--
            '</div>'
        );
    } else if (state.calendar.wtype && !state.calendar.mtype) {
        sendChat("Calendar DND", "/w gm <div " + calendar.style.divMenu + ">" + //--
            '<div ' + calendar.style.header + '>Calendar Menu</div>' + //--
            '<div ' + calendar.style.arrow + '></div>' + //--
            '<table>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Day: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setday --?{Day?|' + day + '}">' + day + suffix + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Month: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setmonth --?{Month?|' + state.calendar.month + '}">' + month + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Year: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setyear --?{Year?|' + year + '}">' + year + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Hour: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --sethour --?{Hour?|' + state.calendar.hour + '}">' + hour + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Minute: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setmin --?{Minute?|' + state.calendar.minute + '}">' + min + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Weather: </td><td ' + calendar.style.tdReg + '>' + weather + '</td></tr>' + //--
            '</table>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --advtime --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Hour|Minute|Day|Week|Month|Year}">Advance the Date</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --weather --toggle">Toggle Weather Display</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --toggle-moon">Toggle Moon Display</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --weather">Randomise Weather</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!alarm --new --title ?{Title?|Insert Title} --date ?{Date?|DD.MM.YYYY} --time ?{Time?|HH:MM}">Create Alarm</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --show">Show to Players</a></div>' + //--
            '</div>'
        );
    } else if (!state.calendar.wtype && state.calendar.mtype) {
        sendChat("Calendar DND", "/w gm <div " + calendar.style.divMenu + ">" + //--
            '<div ' + calendar.style.header + '>Calendar Menu</div>' + //--
            '<div ' + calendar.style.arrow + '></div>' + //--
            '<table>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Day: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setday --?{Day?|' + day + '}">' + day + suffix + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Month: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setmonth --?{Month?|' + state.calendar.month + '}">' + month + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Year: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setyear --?{Year?|' + year + '}">' + year + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Hour: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --sethour --?{Hour?|' + state.calendar.hour + '}">' + hour + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Minute: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setmin --?{Minute?|' + state.calendar.minute + '}">' + min + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Moon: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setmoon --?{Moon?|' + calendar.moons.join("|") + '}">' + moon + '</a></td></tr>' + //--
            '</table>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --advtime --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Hour|Minute|Day|Week|Month|Year}">Advance the Date</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --weather --toggle">Toggle Weather Display</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --toggle-moon">Toggle Moon Display</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!alarm --new --title ?{Title?|Insert Title} --date ?{Date?|DD.MM.YYYY} --time ?{Time?|HH:MM}">Create Alarm</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --show">Show to Players</a></div>' + //--
            '</div>'
        );
    } else if (!state.calendar.wtype && !state.calendar.mtype) {
        sendChat("Calendar DND", "/w gm <div " + calendar.style.divMenu + ">" + //--
            '<div ' + calendar.style.header + '>Calendar Menu</div>' + //--
            '<div ' + calendar.style.arrow + '></div>' + //--
            '<table>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Day: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setday --?{Day?|' + day + '}">' + day + suffix + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Month: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setmonth --?{Month?|' + state.calendar.month + '}">' + month + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Year: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setyear --?{Year?|' + year + '}">' + year + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Hour: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --sethour --?{Hour?|' + state.calendar.hour + '}">' + hour + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Minute: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!cal --setmin --?{Minute?|' + state.calendar.minute + '}">' + min + '</a></td></tr>' + //--
            '</table>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --advtime --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Hour|Minute|Day|Week|Month|Year}">Advance the Date</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --weather --toggle">Toggle Weather Display</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --toggle-moon">Toggle Moon Display</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!alarm --new --title ?{Title?|Insert Title} --date ?{Date?|DD.MM.YYYY} --time ?{Time?|HH:MM}">Create Alarm</a></div>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!cal --show">Show to Players</a></div>' + //--
            '</div>'
        );
    }
};

function showCal() {
    getDate();
    const suffix = getSuffix();
    const day = state.calendar.day;
    const month = state.calendar.monthName;
    const year = state.calendar.year;
    let hour = state.calendar.hour;
    let min = state.calendar.minute;
    if (hour<10) {
        hour = `0${hour}`;
    }
    if (min<10) {
        min = `0${min}`;
    }
    const weather = state.calendar.weather;
    getMoon();
    const moon = state.calendar.moon;
    const moonImg = '<img src="' + state.calendar.moonImg + '" style="width:30px; height:30px;">';
    if (state.calendar.wtype && state.calendar.mtype) {
        sendChat("Calendar DND", "<div " + calendar.style.divMenu + ">" + //--
            '<div ' + calendar.style.header + '>Calendar</div>' + //--
            '<div ' + calendar.style.sub + '>Player View</div>' + //--
            '<div ' + calendar.style.arrow + '></div>' + //--
            day + suffix + ' of ' + month + ', ' + year + //--
            '<br>Current Time: ' + hour + ':' + min + //--
            '<br><br>Today\'s Weather:<br>' + weather + //--
            '<br><br>Moon: ' + moon + //--
            '<br>' + moonImg + //--
            '</div>'
        );
    } else if (state.calendar.wtype && !state.calendar.mtype) {
        sendChat("Calendar DND", "<div " + calendar.style.divMenu + ">" + //--
            '<div ' + calendar.style.header + '>Calendar</div>' + //--
            '<div ' + calendar.style.sub + '>Player View</div>' + //--
            '<div ' + calendar.style.arrow + '></div>' + //--
            day + suffix + ' of ' + month + ', ' + year + //--
            '<br>Current Time: ' + hour + ':' + min + //--
            '<br><br>Today\'s Weather:<br>' + weather + //--
            '</div>'
        );
    } else if (!state.calendar.wtype && state.calendar.mtype) {
        sendChat("Calendar DND", "<div " + calendar.style.divMenu + ">" + //--
            '<div ' + calendar.style.header + '>Calendar</div>' + //--
            '<div ' + calendar.style.sub + '>Player View</div>' + //--
            '<div ' + calendar.style.arrow + '></div>' + //--
            day + suffix + ' of ' + month + ', ' + year + //--
            '<br>Current Time: ' + hour + ':' + min + //--
            '<br><br>Moon: ' + moon + //--
            '<br>' + moonImg + //--
            '</div>'
        );
    } else if (!state.calendar.wtype && !state.calendar.mtype) {
        sendChat("Calendar DND", "<div " + calendar.style.divMenu + ">" + //--
            '<div ' + calendar.style.header + '>Calendar</div>' + //--
            '<div ' + calendar.style.sub + '>Player View</div>' + //--
            '<div ' + calendar.style.arrow + '></div>' + //--
            day + suffix + ' of ' + month + ', ' + year + //--
            '<br>Current Time: ' + hour + ':' + min + //--
            '</div>'
        );
    }
};

function advDate(amount, type) {
    let year = state.calendar.year;
    let month = state.calendar.month;
    let day = state.calendar.day;
    let hour = state.calendar.hour;
    let min = state.calendar.minute;
    let ordinal = state.calendar.ord;
    switch (type.toLowerCase()) {
        case "short rest":
            hour += amount;
        break;
        case "long rest":
            hour += 8 * amount;
        break;
        case "day":
            ordinal += amount;
            day += amount;
        break;
        case "week":
            ordinal += 5 * amount;
            day += 5 * amount;
        break;
        case "month":
            month += amount;
        break;
        case "year":
            year += amount;
        break;
    }
    while (hour > 24) {
        hour -= 24;
        day++;
        ordinal++;
    }
    while (ordinal > 360) {
        ordinal -= 360;
        year++;
    }
    while (day > 30) {
        day -= 30;
        month++;
    }
    while (month > 12) {
        month -= 12;
        year++;
    }
    state.calendar.year = year;
    state.calendar.month = month;
    state.calendar.day = day;
    state.calendar.ord = ordinal;
    state.calendar.hour = hour;
    state.calendar.minute = min;
    getDate();
};

function rollWeather() {
    let temp;
    let wind;
    let precip;
    let season;
    const ordinal = state.calendar.ord;
    if (ordinal > 330 || ordinal <= 75) {
        season = "Winter";
    } else if (ordinal <= 170) {
        season = "Spring";
    } else if (ordinal <= 240) {
        season = "Summer";
    } else if (ordinal <= 330) {
        season = "Fall";
    }
    let roll = randomInteger(21);
    if (roll>=15 && roll <=17) {
        switch (season) {
            case 'Winter':
                temp="It is a bitterly cold winter day. ";
            break;
            case 'Spring':
                temp="It is a cold spring day. ";
            break;
            case 'Summer':
                temp="It is a cool summer day. ";
            break;
            case 'Fall':
                temp="It is a cold fall day. ";
            break;
        }
    } else if (roll>=18 && roll<=20) {
        switch (season) {
            case 'Winter':
                temp="It is a mild winter day. ";
            break;
            case 'Spring':
                temp="It is a hot spring day. ";
            break;
            case 'Summer':
                temp="It is a blisteringly hot summer day. ";
            break;
            case 'Fall':
                temp="It is a hot fall day. ";
            break;
        }
    } else {
        switch (season) {
            case 'Winter':
                temp="It is a cold winter day. ";
            break;
            case 'Spring':
                temp="It is a mild spring day. ";
            break;
            case 'Summer':
                temp="It is a warm summer day. ";
            break;
            case 'Fall':
                temp="It is a mild fall day. ";
            break;
        }
    }
    roll=randomInteger(21);
    if (roll>=15 && roll<=17) {
        if (season=="Winter") {
            precip="snow falls softly on the ground.";
        } else {
            precip="it is raining lightly.";
        }
    } else if (roll>=18 && roll<=20) {
        if (season=="Winter") {
            precip="snow falls thick and fast from the sky.";
        } else {
            precip="a torretial rain is falling.";
        }
    } else {
        roll=randomInteger(2);
        if (roll==1) {
            precip="the sky is overcast.";
        } else {
            precip="the sky is clear.";
        }
    }
    const forecast = temp+wind+precip;
    state.calendar.weather = forecast;
};

function alarmMenu(num) {
    const alarm = state.alarms[num];
    const len = state.alarms.length;
    let list = [];
    for (let i=0;i<len;i++) {
        list.push(i);
    }
    let alarmList = list;
    for (let i=0;i<len;i++) {
        alarmList = String(alarmList).replace(",","|");
    }
    if (!alarm) {
        if (!len || len == 0) {
            sendChat("Calendar DND", "/w gm <div " + calendar.style.divMenu + ">" + //--
                '<div ' + calendar.style.header + '>Alarm Menu</div>' + //--
                '<div ' + calendar.style.arrow + '></div>' + //--
                '<div ' + calendar.style.divButton + '>Alarm: None</div>' + //--
                '<br><br>' + //--
                '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!alarm --new --title ?{Title?|Insert Title} --date ?{Date?|DD.MM.YYYY} --time ?{Time?|HH:MM}">Create Alarm</a></div>' + //--
                '</div>'
            );
        } else if (len >= 1) {
            sendChat("Calendar DND", "/w gm <div " + calendar.style.divMenu + ">" + //--
                '<div ' + calendar.style.header + '>Alarm Menu</div>' + //--
                '<div ' + calendar.style.arrow + '></div>' + //--
                '<table>' + //--
                '<tr><td>Alarm: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!alarm --?{Alarm?|' + alarmList + '}">Not selected</a></td></tr>' + //--
                '</table>' + //--
                '<br><br>' + //--
                '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!alarm --new --title ?{Title?|Insert Title} --date ?{Date?|DD.MM.YYYY} --time ?{Time?|HH:MM}">Create Alarm</a></div>' + //--
                '</div>'
            );
        }
    } else {
        const title = alarm.title;
        const date = `${alarm.day}.${alarm.month}.${alarm.year}`;
        const time = `${alarm.hour}:${alarm.minute}`;
        const splitDate = date.split(".");
        const splitTime = time.split(":");
        sendChat("Calendar DND", "/w gm <div " + calendar.style.divMenu + ">" + //--
            '<div ' + calendar.style.header + '>Alarm Menu</div>' + //--
            '<div ' + calendar.style.arrow + '></div>' + //--
            '<table>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Alarm: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!alarm --?{Alarm?|' + alarmList + '}">Alarm #' + num + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Title: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!alarm --' + num + ' --settitle ?{Title?|Insert Title}">' + title + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Date: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!alarm --' + num + ' --setdate ?{Day?|' + splitDate[0] + '}.?{Month?|' + splitDate[1] + '}.?{Year?|' + splitDate[2] + '}">' + date + '</a></td></tr>' + //--
            '<tr><td ' + calendar.style.tdReg + '>Time: </td><td ' + calendar.style.tdReg + '><a ' + calendar.style.buttonMedium + '" href="!alarm --' + num + ' --settime ?{Hour?|' + splitTime[0] + '}:?{Minute?|' + splitTime[1] + '}">' + time + '</a></td></tr>' + //--
            '</table>' + //--
            '<br><br>' + //--
            '<div ' + calendar.style.divButton + '><a ' + calendar.style.buttonLarge + '" href="!alarm --new --title ?{Title?|Insert Title} --date ?{Date?|DD.MM.YYYY} --time ?{Time?|HH:MM}">Create Alarm</a></div>' + //--
            '</div>'
        );
    }
};

function createAlarm(title, date, time) {
    const num = state.alarms.length;
    date=date.split(".");
    const day = Number(date[0]);
    const month = Number(date[1]);
    const year = Number(date[2]);
    time=time.split(":");
    const hour = Number(time[0]);
    const min = Number(time[1]);
    state.alarms.push({
        day: day,
        month: month,
        year: year,
        hour: hour,
        min: min,
        title: title
    });
    sendChat("Calendar DND", `/w gm Alarm #${num}: \"${title}\" created!`);
    alarmMenu(num);
};

function editAlarm(num, option, val) {
    const alarm = state.alarms[Number(num)];
    if (!alarm) {
        sendChat("Calendar DND", "/w gm No such Alarm exists!");
    } else {
        let hand = findObjs({
            _type: "handout",
            name: "Alarm #" + num
        }, {caseInsensitive: true})[0];
        if (!hand) {
            hand=createObj("handout", {
                name: "Alarm #" + num
            });
        }
        if (option=="title") {
            if (title && title!=="" && title!==" ") {
                hand.set("notes", title);
            }
            state.alarms[num].title = val;
        } else if (option=="date") {
            hand.get("gmnotes",function(gmnotes) {
                let datetime=String(gmnotes).split(";")
                let rdate=datetime[0];
                let rtime=datetime[1];
                if (val) {
                    rdate=val;
                }
                if (rdate==undefined) {
                    rdate="";
                }
                if (rtime==undefined) {
                    rtime="";
                }
                datetime=rdate+";"+rtime;
                hand.set("gmnotes", datetime);
            });
            const splitDate = val.split(".");
            state.alarms[num].day = Number(splitDate[0]);
            state.alarms[num].month = Number(splitDate[1]);
            state.alarms[num].year = Number(splitDate[2]);
        } else if (option=="time") {
            hand.get("gmnotes",function(gmnotes) {
                let datetime=String(gmnotes).split(";")
                let rdate=datetime[0];
                let rtime=datetime[1];
                if (val!==undefined) {
                    rtime=val;
                }
                if (rdate==undefined) {
                    rdate="";
                }
                if (rtime==undefined) {
                    rtime="";
                }
                datetime=rdate+";"+rtime;
                hand.set("gmnotes", datetime);
            });
            const splitTime = val.split(":");
            state.alarms[num].hour = Number(splitTime[0]);
            state.alarms[num].minute = Number(splitTime[1]);
        }
    }
};

function chkAlarms() {
    const alarmList = state.alarms;
    for (let i=0;i<alarmList.length;i++) {
        const alarm = alarmList[i];
        if (alarm.hour) {
            if (alarm.year == state.calendar.year) {
                if (alarm.month == state.calendar.month) {
                    if (alarm.day>=state.calendar.day && !alarm.day>state.calendar.day+7) {
                        if (alarm.hour>=state.calendar.hour && !alarm.hour>state.calendar.hour + 12) {
                            if (alarm.minute>=state.calendar.minute && !alarm.minute>state.calendar.minute + 30) {
                                sendChat("Calendar DND", `/w gm Alarm #${i}: \"${alarm.title}\" triggered!`);
                                state.alarms.splice(i);
                            }
                        }
                    }
                }
            }
        } else {
            if (alarm.year == state.calendar.year) {
                if (alarm.month == state.calendar.month) {
                    if (alarm.day>=state.calendar.day && !alarm.day>state.calendar.day+7) {
                        sendChat("Calendar DND", `/w gm Alarm #${i}: \"${alarm.title}\" triggered!`);
                        state.alarms.splice(i)
                    }
                }
            }
        }
    }
}

on("ready", () => {
    "use strict";
    calendar.checkInstall();
    calendar.registerEventHandlers();
});