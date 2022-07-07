/*
Calendar for Eberron, Faerun, Greyhawk, Modern and Tal'Dorei Settings
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Using NoteLog Script from Aaron (https://app.roll20.net/users/104025/the-aaron)

API Commands:
!cal - Shows the menu to the person that issued the Command. GM menu has more Options.
    --world {world}- Allows the GM to change the world to one of the Options (Eberron, Faerun, Greyhawk, Modern, Tal'Dorei)
    --adv {amount} --{type} - Allows the GM to advance the time by a certain amount and a certain type (Short Rest, Long Rest, Hour, Minute, Day, Week, Month, Year)
    --set {type} --{amount} - Allows the GM to set the day, month, year etc. Putting "random" in either will randomise it.
    --weather {type} - Allows the GM to set the weather. Putting "Random" will randomise the weather.
    --moon {type} - Allows the GM to set the moon state. Putting "Random" will randomise it.
    --end - Rolls on the Encounter table.
    --reset - Will reset everything.
*/
var Calendar = Calendar || (function() {
    'use strict';
    
    var version = "5.0",
    
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
            }
        };
    },
    
    setAlarm1Defaults = function() {
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
    
    setAlarm2Defaults = function() {
        state.Alarm2 = {
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
    
    setAlarm3Defaults = function() {
        state.Alarm3 = {
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
    
    setAlarm4Defaults = function() {
        state.Alarm4 = {
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
    
    setAlarm5Defaults = function() {
        state.Alarm5 = {
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
    
    setAlarm6Defaults = function() {
        state.Alarm6 = {
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
    
    setAlarm7Defaults = function() {
        state.Alarm7 = {
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
    
    setAlarm8Defaults = function() {
        state.Alarm8 = {
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
    
    setAlarm9Defaults = function() {
        state.Alarm9 = {
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
    
    setAlarm10Defaults = function() {
        state.Alarm10 = {
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
                    } else if (type.includes("random")) {
                        let rand=randomInteger(5);
                        if (rand==1) {
                            if (args[2].toLowerCase()=="random") {
                                let amount=randomInteger(24);
                                state.calendar.now.hour=amount-1;
                            } else {
                                let amount=Number(args[2]);
                                state.calendar.now.hour=amount;
                            }
                        } else if (rand==2) {
                            if (args[2].toLowerCase()=="random") {
                                let amount=randomInteger(60);
                                state.calendar.now.minute=amount-1;
                            } else {
                                let amount=Number(args[2]);
                                state.calendar.now.minute=amount;
                            }
                        } else if (rand==3) {
                            if (args[2].toLowerCase()=="random") {
                                switch (Number(state.calendar.now.world)) {
                                    case 1:
                                        let amount=randomInteger(30);
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
                                        return;
                                }
                            } else {

                            }
                        } else if (rand==4) {
                            
                        } else if (rand==5) {
                            
                        }
                    }
                }
            }
        } else if (!playerIsGM(msg.playerid)) {
            
        }
    },

    checkInstall = function() {
        if (!state.Calendar) {
            setDefaults();
        }
        if (!state.Alarm1) {
            setAlarm1Defaults();
        }
        if (!state.Alarm2) {
            setAlarm2Defaults();
        }
        if (!state.Alarm3) {
            setAlarm3Defaults();
        }
        if (!state.Alarm4) {
            setAlarm4Defaults();
        }
        if (!state.Alarm5) {
            setAlarm5Defaults();
        }
        if (!state.Alarm6) {
            setAlarm6Defaults();
        }
        if (!state.Alarm7) {
            setAlarm7Defaults();
        }
        if (!state.Alarm8) {
            setAlarm8Defaults();
        }
        if (!state.Alarm9) {
            setAlarm9Defaults();
        }
        if (!state.Alarm10) {
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
on("ready",function() {
    'use strict';
    Calendar.CheckInstall();
    Calendar.RegisterEventHandlers();
});
