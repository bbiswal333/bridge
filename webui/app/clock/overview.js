/*global document*/
/*eslint eqeqeq: 0*/

angular.module('app.clock', []);

angular.module('app.clock').directive('app.clock', ['app.clock.configService', function(configService) {

    var directiveController = ['$scope', function($scope) {

        // Required information to get settings icon/ screen
        $scope.box.settingsTitle = "Configure the Clock";
        $scope.box.settingScreenData = {
            templatePath: "clock/settings.html",
            controller: angular.module('app.clock').appClockSettings,
            id: $scope.boxId
        };

				// Bridge framework function to enable saving the config
        $scope.box.returnConfig = function(){
            return angular.copy(configService);
        };

    } ];

    var linkFn = function($scope) {

        // initialize settings from "backend" server (NOTE: $scope.appConfig is an internal variable that
        // contains the configuration retrieved from the "backend".  If configuration does not exist at the server, default
        // values are set by "initialize" function).

        configService.initialize($scope.appConfig);
    };

    return {
        restrict: 'E',
        templateUrl: 'app/clock/overview.html',
        controller: directiveController,
        link: linkFn
    };
} ]);

angular.module('app.clock').controller('app.clock.time', ['$scope', '$window', 'app.clock.configService', function($scope, $window, configService) {

    // set flags denoting which color is active for each clock so that in the HTML we can "show" the element corresponding
    // to the configured color (including color of mouse "hoving" over element)

    $scope.color = {
        clock0: {
            blue: false,
            grey: false,
            red: false,
            yellow: false,
            orange: false,
            green: false,
            purple: false
        },
        clock1: {
            blue: false,
            grey: false,
            red: false,
            yellow: false,
            orange: false,
            green: false,
            purple: false
        },
        clock2: {
            blue: false,
            grey: false,
            red: false,
            yellow: false,
            orange: false,
            green: false,
            purple: false
        },
        clock3: {
            blue: false,
            grey: false,
            red: false,
            yellow: false,
            orange: false,
            green: false,
            purple: false
        }
    };

    // an array of "clock" objects
    var clocktime = [];

    var clockSeparator;
    var clockFacePlace;
    var multipleClocks;
    var clockFaceHours;
    var clockMeridiem;
    var dateSeparator;
    var dateType;
    var clockSeconds;
    var clockZeroToHour;
    var dateCentury;
    var dateText;
    var multipleClockOrder;
    var showActiveDST;
    var isActiveDST;
    var datetextOrder;
    var sc;
    var mn;
    var hr;
    var dy;
    var mt;
    var yr;


    // FUNCTION: "setTheClock" - determines and displays "clock" time
    $scope.setTheClock = function(clkidx) {

        // buffer for formatting the clock time
        var tmdsp = '';
        var tmstr = "";
        var caltxt = "";
        var caldte = "";
        var tmzdte;
        var clkhrs;
        var clksep;
        var clkmrd;
        var clkfrm;
        var clksec;
        var dtetyp;
        var dtesep;
        var dtetxt;
        var dteyrc;

        isActiveDST = false;

        // display empty strings if multiple clock face not to be displayed in order to ensure gap is
        // created where clock face would have otherwise been displayed...

        if (multipleClocks == 'X') {
            if (parseInt(multipleClockOrder.substring((clkidx - 1), clkidx)) == 0) {
                tmstr = ' ';

                tmdsp = 'worldPlace';
                tmdsp = tmdsp.concat(clkidx.toString());
                tmdsp = tmdsp.concat('_', $scope.getClockMouseHoverColor(clocktime[clkidx].color));
                document.getElementById(tmdsp).innerHTML = tmstr;
                tmdsp = 'clockTime';
                tmdsp = tmdsp.concat(clkidx.toString());
                tmdsp = tmdsp.concat('_', $scope.getClockMouseHoverColor(clocktime[clkidx].color));
                document.getElementById(tmdsp).innerHTML = tmstr;
                tmdsp = 'calendarText';
                tmdsp = tmdsp.concat(clkidx.toString());
                tmdsp = tmdsp.concat('_', $scope.getClockMouseHoverColor(clocktime[clkidx].color));
                document.getElementById(tmdsp).innerHTML = tmstr;
                tmdsp = 'calendarDate';
                tmdsp = tmdsp.concat(clkidx.toString());
                tmdsp = tmdsp.concat('_', $scope.getClockMouseHoverColor(clocktime[clkidx].color));
                document.getElementById(tmdsp).innerHTML = tmstr;

                return;
            }
        }

        tmzdte = new Date();

        //    **** (TORONTO: DST - "BEGIN")

        //    1:00AM (TORONTO) = 6:00AM UTC on the 9th
        //    tmzdte.setHours(1, 0, 0, 0);
        //    tmzdte.setFullYear(2015, 2, 8);

        //    3:00AM (2nd SUN in MAR @ 2:00AM) (TORONTO) = 7:00AM UTC (-4) on the 9th
        //    tmzdte.setHours(2, 0, 0, 0);
        //    tmzdte.setFullYear(2015, 2, 8);

        //    4:00AM (TORONTO) = 8:00AM UTC on the 9th
        //    tmzdte.setHours(4, 0, 0, 0);
        //    tmzdte.setFullYear(2015, 2, 8);

        //    **** (TORONTO: DST - "END")

        //    1:00AM (TORONTO) = 5:00AM UTC on the 2nd
        //    tmzdte.setHours(1, 0, 0, 0);
        //    tmzdte.setFullYear(2015, 10, 1);

        //    1:00AM (1st SUN in NOV @ 2:00AM) (TORONTO) = 6:00AM UTC (-5) on the 2nd
        //    tmzdte.setHours(2, 0, 0, 0);
        //    tmzdte.setFullYear(2015, 10, 1);

        //    2:00AM (TORONTO) = 7:00AM UTC on the 2nd
        //    tmzdte.setHours(3, 0, 0, 0);
        //    tmzdte.setFullYear(2015, 10, 1);

        //    **** (WALDORF: DST - "BEGIN")

        //    1:00AM (WALDORF) = 12:00AM UTC on the 30th
        //    tmzdte.setHours(20, 0, 0, 0);
        //    tmzdte.setFullYear(2015, 2, 29);

        //    3:00AM (last SUN in MAR @ 2:00AM) (WALDORF) = 1:00AM UTC (+2) on the 30th
        //    tmzdte.setHours(21, 0, 0, 0);
        //    tmzdte.setFullYear(2014, 2, 29);

        //    4:00AM (WALDORF) = 2:00AM UTC on the 26th
        //    tmzdte.setHours(22, 0, 0, 0);
        //    tmzdte.setFullYear(2014, 2, 29);

        //    **** (WALDORF: DST - "END")

        //    2:00AM (WALDORF) = 12:00AM UTC on the 25th
        //    tmzdte.setHours(20, 0, 0, 0);
        //    tmzdte.setFullYear(2015, 9, 24);

        //    2:00AM (last SUN in OCT) (WALDORF) = 1:00AM UTC (+1) on the 25th
        //    tmzdte.setHours(21, 0, 0, 0);
        //    tmzdte.setFullYear(2015, 9, 24);

        //    3:00AM (WALDORF) = 2:00AM UTC on the 25th
        //    tmzdte.setHours(22, 0, 0, 0);
        //    tmzdte.setFullYear(2015, 9, 24);

        //    **** (LONDON: DST - "BEGIN")

        //    12:00AM (LONDON) = 12:00AM UTC on the 30th
        //    tmzdte.setHours(20, 0, 0, 0);
        //    tmzdte.setFullYear(2014, 2, 29);

        //    2:00AM (last SUN in MAR @ 1:00AM) (LONDON) = 1:00AM UTC (+1) on the 30th
        //    tmzdte.setHours(21, 0, 0, 0);
        //    tmzdte.setFullYear(2014, 2, 29);

        //    3:00AM (LONDON) = 2:00AM UTC on the 26th
        //    tmzdte.setHours(22, 0, 0, 0);
        //    tmzdte.setFullYear(2014, 2, 29);

        //    **** (LONDON: DST - "END")

        //    1:00AM (LONDON) = 12:00PM UTC on the 25th
        //    tmzdte.setHours(20, 0, 0, 0);
        //    tmzdte.setFullYear(2014, 9, 25);

        //    1:00AM (last SUN in OCT @ 2:00AM) (LONDON) = 1:00AM UTC (+0) on the 26th
        //    tmzdte.setHours(21, 0, 0, 0);
        //    tmzdte.setFullYear(2014, 9, 25);

        //    2:00AM (LONDON) = 2:00AM UTC on the 26th
        //    tmzdte.setHours(22, 0, 0, 0);
        //    tmzdte.setFullYear(2014, 9, 25);

        //    **** (ADELAIDE (South Australia): DST - "END")

        //    2:00AM (ADELAIDE (South Australia)) = 3:30PM UTC on the 5th
        //    tmzdte.setHours(11, 30, 0, 0);
        //    tmzdte.setFullYear(2014, 3, 5);

        //    2:00AM (1st SUN in APR @ 3:00AM) (ADELAIDE (South Australia)) = 4:30PM UTC (+9.5) on the 5th
        //    tmzdte.setHours(12, 30, 0, 0);
        //    tmzdte.setFullYear(2014, 3, 5);

        //    3:00AM (ADELAIDE (South Australia)) = 4:30PM UTC on the 5th
        //    tmzdte.setHours(13, 30, 0, 0);
        //    tmzdte.setFullYear(2014, 3, 5);

        //    **** (ADELAIDE (South Australia): DST - "BEGIN")

        //    1:00AM (ADELAIDE (South Australia)) = 3:30PM UTC on the 4th
        //    tmzdte.setHours(11, 30, 0, 0);
        //    tmzdte.setFullYear(2014, 9, 4);

        //    3:00AM (1st SUN in OCT @ 2:00AM) (ADELAIDE (South Australia)) = 4:30PM UTC (+10.5) on the 4th
        //    tmzdte.setHours(12, 30, 0, 0);
        //    tmzdte.setFullYear(2014, 9, 4);

        //    4:00AM (ADELAIDE (South Australia)) = 5:30PM UTC on the 4th
        //    tmzdte.setHours(13, 30, 0, 0);
        //    tmzdte.setFullYear(2014, 9, 4);

        // calcuate date according to time zone configurations
        tmzdte = $scope.getTheDate($scope.getUTCDate(tmzdte), clkidx);

        // show the "calendar" location
        tmdsp = 'worldPlace';
        tmdsp = tmdsp.concat(clkidx.toString());
        tmdsp = tmdsp.concat('_', $scope.getClockMouseHoverColor(clocktime[clkidx].color));
        tmstr = ((isActiveDST == true) && (showActiveDST == 'X')) ? tmstr.concat('*', clocktime[clkidx].location) : clocktime[clkidx].location;
        document.getElementById(tmdsp).innerHTML = tmstr;

        tmstr = '';

        // extract date parts
        $scope.getDatePartUTC(tmzdte);

        clkhrs = (clockFaceHours == '0') ? "12" : "24"; // clock time represented as "24 hour clock" (military time)
        clksep = clockSeparator;  // character used to separate time parts
        clkmrd = clockMeridiem;  // clock time includes "AM/PM" time period
        clkfrm = clockZeroToHour;  // append leading zero (ASCII 48) to hour
        clksec = clockSeconds;   // clock time include seconds
        dtetyp = dateType;  // type of calendar date to display
        dtesep = dateSeparator;  // character used to separate calendar parts
        dtetxt = dateText;  // calendar text: name of weekday or month
        dteyrc = dateCentury;  // format year with/without centry

        // if clock separator is empty, default to space
        clksep = (clksep == "") ? " " : clksep;
        // if date separator is empty, default to space
        dtesep = (dtesep == "") ? " " : dtesep;

        // not enough room to display time with both seconds and a time period...
        if ((clksec == "X") && (clkmrd == "X")) {
            // force time to be displayed "without" time period
            clkmrd = "";
        }
        // incorporate seconds into clock time?
        if (clksec == "X") {
            tmstr = clksep + $scope.formatTimeVal(sc);
        }
        else {
            // clock time displayed without second so toggle between separator character and 
            // blank space every second to give appearance time is progressing...
            clksep = $scope.setTimeSeparator(sc, clksep);
        }
        // include "AM/PM" time period?
        if (clkmrd == "X") {
            tmstr = tmstr + " " + $scope.setTimePeriod(hr);
        }
        // display clock time as 12 hour clock?
        if (clkhrs == "12") {
            // format clock time as 12 hour clock
            hr = $scope.setTwelveHourClock(hr, clkmrd);
        }
        // append leading zero "0" to hour?
        if (clkfrm == "X") {
            hr = $scope.formatTimeVal(hr);
        }

        // construct clock time formatted per configuration...
        tmstr = hr + clksep + $scope.formatTimeVal(mn) + tmstr;

        // show the "clock" time
        tmdsp = 'clockTime';
        tmdsp = tmdsp.concat(clkidx.toString());
        tmdsp = tmdsp.concat('_', $scope.getClockMouseHoverColor(clocktime[clkidx].color));
        document.getElementById(tmdsp).innerHTML = tmstr;

        if (dtetxt == "M") {
            // set calendar text to month of year
            tmstr = $scope.formatMonth(mt, false);
        }
        else if (dtetxt == "W") {
            // set calendar text to day of week
            tmstr = $scope.formatWeekDay(wd, false);
        }
        else {
            // do not display calendar text
            tmstr = "";
        }

        // capture calendar text
        caltxt = tmstr;

        // display year with/without centry...
        if (dteyrc != "X") {
            yr = (yr % 100);
        }

        // construct calendar date formatted per configuration...
        if (dtetyp == "1") {
            // format date: DDD dd yyyy            
            tmstr = $scope.formatWeekDay(wd, true) + " " + $scope.formatTimeVal(dy) + " " + yr;
        }
        else if (dtetyp == "2") {
            // format date: MMM dd yyyy
            tmstr = $scope.formatMonth(mt, true) + " " + $scope.formatTimeVal(dy) + " " + yr;
        }
        else if ((dtetyp >= "3") && (dtetyp <= "6")) {

            // display actual month of year
            mt = mt + 1;

            // format date according to specified type...
            if (dtetyp == "3") {
                tmstr = $scope.formatTimeVal(mt) + dtesep + $scope.formatTimeVal(dy) + dtesep + yr;  // format: MM/DD/YYYY
            }
            else if (dtetyp == "4") {
                tmstr = $scope.formatTimeVal(dy) + dtesep + $scope.formatTimeVal(mt) + dtesep + yr;  // format: DD/MM/YYYY
            }
            else if (dtetyp == "5") {
                tmstr = yr + dtesep + $scope.formatTimeVal(mt) + dtesep + $scope.formatTimeVal(dy);  // format: YYYY/MM/DD
            }
            else if (dtetyp == "6") {
                tmstr = yr + dtesep + $scope.formatTimeVal(dy) + dtesep + $scope.formatTimeVal(mt); // format: YYYY/DD/MM
            }
        }
        else {
            // clear calendar date
            tmstr = "";
        }

        // capture calendar date
        caldte = tmstr;

        // show the "calendar" text (according to date/text order configuration)
        tmdsp = 'calendarText';
        tmdsp = tmdsp.concat(clkidx.toString());
        tmdsp = tmdsp.concat('_', $scope.getClockMouseHoverColor(clocktime[clkidx].color));
        document.getElementById(tmdsp).innerHTML = ((datetextOrder == 'T') || (dateText == '')) ? caltxt : caldte;

        // show the "calendar" date (according to date/text order configuration)
        tmdsp = 'calendarDate';
        tmdsp = tmdsp.concat(clkidx.toString());
        tmdsp = tmdsp.concat('_', $scope.getClockMouseHoverColor(clocktime[clkidx].color));
        document.getElementById(tmdsp).innerHTML = ((datetextOrder == 'T') || (dateText == '')) ? caldte : caltxt;
    };

    // FUNCTION: "setTwelveHourClock" - formats "clock" time as a value of 12 hours
    $scope.setTwelveHourClock = function(tmval, clkmrd) {

        var clktm;
        
        clktm = tmval;

        // if hour is greater than noon "12 pm", format hour into 12 hour clock
        if (clktm > 12) {
            clktm = clktm - 12;
        }
        // if displaying AM/PM then when hour = 0 ("midnight") default hour to 12 for display purposes
        if ((clktm == 0) && (clkmrd == "X")) {
            clktm = 12;
        }

        return clktm;
    };

    // FUNCTION: "formatTimeVal" - prefix time element with zero (ASCII 48)
    $scope.formatTimeVal = function(tmval) {

        var tmfrm;
        
        tmfrm = tmval;

        // append a zero character (ASCII 48) in front of time if less than 10
        if (tmfrm < 10) {
            tmfrm = "0" + tmfrm;
        }
        return tmfrm;
    };

    // FUNCTION: "setTimePeriod" - postfix time period "AM/PM" to "clock" time
    $scope.setTimePeriod = function(tmval) {

        var tmprd;
        
        tmprd = "";

        // determine time period AM/PM, otherwise default empty string if not specified
        tmprd = " " + "AM";
        if (tmval >= 12) {
            tmprd = " " + "PM";
        }
        return tmprd;
    };

    // FUNCTION: "setTimeSeparator" - separates time elements with "separating" character
    $scope.setTimeSeparator = function(tmval, tmsep) {

        var tmchr;
        
        tmchr = " ";

        // toggle clock time separator character every other second...
        if ((tmval % 2) == 0) {
            tmchr = tmsep;
        }

        return tmchr;
    };

    // FUNCTION: "formatWeekDay" - format day of week into abrevation
    $scope.formatWeekDay = function(dtval, dtabv) {

        var wkdlst = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var dtstr;
        
        dtstr = wkdlst[dtval];

        // abrievate name of weekday if necessary...
        if (dtabv == true) {
            dtstr = dtstr.substring(0, 3);
            dtstr = dtstr.charAt(0).toUpperCase() + dtstr.charAt(1).toUpperCase() + dtstr.charAt(2).toUpperCase();
        };

        return dtstr;
    };

    // FUNCTION: "formatMonth" - format month of year into abrevation
    $scope.formatMonth = function(dtval, dtabv) {

        var mthlst = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var dtstr;

        dtstr = mthlst[dtval];

        // abrievate name of month if necessary...
        if (dtabv == true) {
            dtstr = dtstr.substring(0, 3);
            dtstr = dtstr.charAt(0).toUpperCase() + dtstr.charAt(1).toUpperCase() + dtstr.charAt(2).toUpperCase();
        }

        return dtstr;
    };

    // FUNCTION: "getTheDate" - local time converted into UTC time is used to calculate date/time for specified time zone location
    $scope.getTheDate = function(utcdte, clkidx) {

        var tmzhr = []; // time zone adjustments for hours - 1st element = begin, 2nd element = end
        var tmzmn = []; // time zone adjustments for minutes - 1st element = begin, 2nd element = end

        var isDST = false;

        var strbfr;
        var dstmt;
        var dstrk;
        var dstwd;
        var dsthr;
        var dstmn;
        var dstbgn;
        var dstend;
        var adjmn;
        var adjhr;

        adjmn = 0;

        // IMPORTANT: date ranges for "daylight saving" beginning and ending dates represented in local time for specified 
        // time zone, therefore need to convert them to UTC time for comparison purposes...

        // determine if "DST" is active for this location
        isDST = (clocktime[clkidx].isDST == 'X') ? true : isDST;

        if (clocktime[clkidx].DSTbgnOFS.length > 0) {
            strbfr = clocktime[clkidx].DSTbgnOFS.substring(3);
            // set DST hour "begin" offset (accounting for sign(+/-))
            tmzhr[0] = parseInt(strbfr.substring(1));
            tmzhr[0] = (strbfr.substring(0, 1) == '-') ? tmzhr[0] * -1 : tmzhr[0];
            // set DST minute "begin" offset (accounting for sign(+/-))
            tmzmn[0] = parseInt(clocktime[clkidx].DSTbgnMIN);
            tmzmn[0] = (tmzhr[0] < 0) ? -tmzmn[0] : tmzmn[0];
        }
        else {
            tmzhr[0] = 0;
            tmzmn[0] = 0;
        }

        // set for when DST for time zone "begins"
        if (isDST == true) {
            // set date time change occurs on
            dstmt = parseInt(clocktime[clkidx].DSTbgnMTH);
            dstrk = parseInt(clocktime[clkidx].DSTbgnRNK);
            dstwd = parseInt(clocktime[clkidx].DSTbgnDAY);
            // set hour time change occurs
            dsthr = parseInt(clocktime[clkidx].DSTbgnTCH);
            // ensure hour is represented in military time
            dsthr = ((clocktime[clkidx].DSTbgnMRD == 'AM') && (clocktime[clkidx].DSTbgnTCH == 12)) ? 0 : dsthr;
            dsthr = ((clocktime[clkidx].DSTbgnMRD == 'PM') && (clocktime[clkidx].DSTbgnTCH < 12)) ? dsthr + 12 : dsthr;
            // set minute time change occurs
            dstmn = parseInt(clocktime[clkidx].DSTbgnTCM);
                        
            // set time change for when DST in time zone "begins"
            dstbgn = $scope.getPeriodDateForDST(dstmt, dstrk, dstwd, dsthr, dstmn, new Date());            
        };

        if (clocktime[clkidx].DSTendOFS.length > 0) {
            strbfr = clocktime[clkidx].DSTendOFS.substring(3);
            // set DST hour "end" offset (accounting for sign(+/-))
            tmzhr[1] = parseInt(strbfr.substring(1));
            tmzhr[1] = (strbfr.substring(0, 1) == '-') ? tmzhr[1] * -1 : tmzhr[1];
            // set DST minute "end" offset (accounting for sign(+/-))
            tmzmn[1] = parseInt(clocktime[clkidx].DSTendMIN);
            tmzmn[1] = (tmzhr[1] < 0) ? -tmzmn[1] : tmzmn[1];
        }
        else {
            tmzhr[1] = 0;
            tmzmn[1] = 0;
        }

        // set for when DST for time zone "ends"
        if (isDST == true) {
            // set date time change occurs on
            dstmt = parseInt(clocktime[clkidx].DSTendMTH);
            dstrk = parseInt(clocktime[clkidx].DSTendRNK);
            dstwd = parseInt(clocktime[clkidx].DSTendDAY);
            // set hour time change occurs
            dsthr = parseInt(clocktime[clkidx].DSTendTCH);
            // ensure hour is represented in military time
            dsthr = ((clocktime[clkidx].DSTendMRD == 'AM') && (clocktime[clkidx].DSTendTCH == 12)) ? 0 : dsthr;
            dsthr = ((clocktime[clkidx].DSTendMRD == 'PM') && (clocktime[clkidx].DSTendTCH < 12)) ? dsthr + 12 : dsthr;
            // set minute time change occurs
            dstmn = parseInt(clocktime[clkidx].DSTendTCM);
            // set time change for when DST in time zone "ends"
            dstend = $scope.getPeriodDateForDST(dstmt, dstrk, dstwd, dsthr, dstmn, new Date());
        };

        // all dates are now converted to UTC time so we can figure out whether we are in DST or not...

        if (isDST == true) {

            // the dates/times when time changes occur are represented in local time for specified time zone location (not our own local
            // time) so we need to convert date/time to UTC in order to compare against our local own time converted into UTC time to 
            // determine if DST is active or not for this time zone location.  IMPORTANT: Only when these "starting/ending" dates/times 
            // are reached, does the time change for the time zone.  Therefore since these periods do not reflect DST we need to continue
            // to use offsets before time change occurred to get correct UTC time at the exact second when time changes).

            dstbgn = $scope.adjustDate(-tmzhr[1], -tmzmn[1], dstbgn);
            dstend = $scope.adjustDate(-tmzhr[0], -tmzmn[0], dstend);

            // determine what adjustments will need to be made when converting UTC time back into local time for time zone location (taking 
            // into account DST being "active/not active" in locations' time zone

            if (dstbgn.getTime() < dstend.getTime()) {
                if ((utcdte.getTime() < dstbgn.getTime()) || (utcdte.getTime() >= dstend.getTime())) {
                    adjhr = tmzhr[1];  // move time backward (dst "end")
                    adjmn = tmzmn[1];
                }
                else {
                    adjhr = tmzhr[0]; // move time forward (dst "begin")
                    adjmn = tmzmn[0];
                    isActiveDST = true;
                }
            } else {
                if ((utcdte.getTime() < dstend.getTime()) || (utcdte.getTime() >= dstbgn.getTime())) {
                    adjhr = tmzhr[0];  // move time forward  (dst "begin")
                    adjmn = tmzmn[0];
                    isActiveDST = true;
                }
                else {
                    adjhr = tmzhr[1];  // move time backward (dst "end")
                    adjmn = tmzmn[1];
                }
            }
        }
        else {
            // DST is not represented in this location's time zone
            adjhr = tmzhr[0];
            adjmn = tmzmn[0];
        }

        // convert UTC into time zone location's local time
        return $scope.adjustDate(adjhr, adjmn, utcdte);
    }

    // FUNCTION: "daysInMonth" - determines days in a given month
    $scope.daysInMonth = function(dtmt, dtyr) {

        //        J   F   M   A   M   J   J   A   S   O   N   D
        var dimlst = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var dimdy;
        
        dimdy = dimlst[dtmt];

        // account for Feb 29th in a leap year...
        if (dtmt == 1) {
            if ((dtyr % 4) == 0) {
                dimdy = dimdy + 1;
            }
        }

        return dimdy;
    }

    // FUNCTION: "adjustDate" - adjusts date according to specified hour and minute
    $scope.adjustDate = function(adjhr, adjmn, adjdte) {

        // extract date parts
        $scope.getDatePartUTC(adjdte);

        // adjust the clock hour
        hr = hr + adjhr;
        // adjust the clock minutes
        mn = mn + adjmn;

        // when adjusting minutes, does the hour also need adjustment (IE: 1 hour and 45 minutes)?
        if (mn > 60) {
            hr = hr + 1;
            mn = mn % 60;
        }
        else if (mn < 0) {
            hr = hr - 1;
            mn = mn * -1;
        }

        // if necessary we calculate new date according to "previous" or "next" day
        if (hr < 0) {
            // calculate hour for previous date
            hr = (hr + 24) % 24;
            // calculate day for previous date
            dy = dy - 1;
            // should date be set to last day of previous month?
            if (dy < 1) {
                // calculate month for previous date
                mt = mt - 1;
                // should date be set to last day of previous year?
                if (mt < 0) {
                    mt = 11;
                    yr = yr - 1;
                }
                // calculate day for previous month
                dy = $scope.daysInMonth(mt, yr);
            }
        }
        else if (hr >= 24) {
            // calculate hour for next date
            hr = (hr - 24) % 24;
            // calculate day for next date
            dy = dy + 1;
            // should date be set to first day of next month?
            if (dy > $scope.daysInMonth(mt, yr)) {
                // calculate month for next date
                mt = mt + 1;
                // should date be set to first day of next year?
                if (mt > 11) {
                    mt = 0;
                    yr = yr + 1;
                }
                // calculate day for next month
                dy = 1;
            }
        }

        // set adjusted date to UTC date/time
        adjdte.setUTCHours(hr, mn, sc, ms);
        adjdte.setUTCFullYear(yr, mt, dy);

        return adjdte;
    }

    // FUNCTION: "getUTCDate" - converts calendar date to UTC date
    $scope.getUTCDate = function(utcdte) {

        // extract UTC date parts
        $scope.getDatePartUTC(utcdte);

        // reset date/time to UTC date/time so that we don't need to 
        // worry about daylight saving time in our date calculations
        
        utcdte.setUTCHours(hr, mn, sc, ms);
        utcdte.setUTCFullYear(yr, mt, dy);

        return utcdte;
    }

    // FUNCTION: "getDatePart" - extracts date parts
    $scope.getDatePart = function(caldte) {

        // extract hours
        hr = caldte.getHours();
        // extract minutes
        mn = caldte.getMinutes();
        // extract seconds
        sc = caldte.getSeconds();
        // extract milliseconds
        ms = caldte.getMilliseconds();

        // extract day of week
        wd = caldte.getDay();
        // extract day in month
        dy = caldte.getDate();
        // extract month
        mt = caldte.getMonth();
        // extract year
        yr = caldte.getFullYear();

    }

    // FUNCTION: "getDatePartUTC" - extracts UTC date parts
    $scope.getDatePartUTC = function(utcdte) {

        // extract UTC hours
        hr = utcdte.getUTCHours(); 
        // extract UTC minutes
        mn = utcdte.getUTCMinutes();
        // extract UTC seconds
        sc = utcdte.getUTCSeconds();
        // extract UTC milliseconds
        ms = utcdte.getUTCMilliseconds();

        // extract UTC day of week
        wd = utcdte.getUTCDay();
        // extract UTC day in month
        dy = utcdte.getUTCDate();
        // extract UTC month
        mt = utcdte.getUTCMonth();
        // extract UTC year
        yr = utcdte.getUTCFullYear();

    }

    // FUNCTION: "getPeriodDateForDST" - contructs date/time for DST (start/end) period using configurations taken from specified time zone location
    $scope.getPeriodDateForDST = function(dstmt, dstrk, dstwd, dsthr, dstmn, dstdte) {

        // transform day of week from "Mon = 1 ... Sun = 0" to "Mon = 1 ... Sun = 7"
        wkdlst = [7, 1, 2, 3, 4, 5, 6];

        // initial week counter to start from 1st week of month
        wk = 0;
        // initialize day counter starting from 1st day of month
        dy = 1;

        // reset date/time to first of month in which dst period occurs (assume current year)
        dstdte.setDate(dy);
        dstdte.setMonth(dstmt);
        dstdte.setHours(dsthr, dstmn, 0, 0);

        // are we to figure out last occurance of week day in the month or a specified occurance of week day within the month?
        if (dstrk == 5) {
            // get last day of the month
            dy = $scope.daysInMonth(dstmt, dstdte.getYear());
            dstdte.setDate(dy);
            // check each day of week starting from end of month to find the day of the week...
            for (idx = 7; idx > 0; idx--) {
                wd = dstdte.getDay();
                // quit if we found last week day of the month
                if (wd == dstwd) {
                    idx = 0;
                }
                else {
                    // set to check previous day of the month
                    dy = dy - 1;
                    dstdte.setDate(dy);
                }
            }
        }
        else {
            // get day of week 1st of month occurs to start our search
            wd = dstdte.getDay();

            // now calculate day of month the week day occurs within specifiec week
            for (idx = 0; idx < dstrk; idx++) {
                if (wkdlst[wd] > wkdlst[dstwd]) {
                    dy = dy + (7 - wkdlst[wd]) + wkdlst[dstwd]; // advance to matching week day in the following week
                    wd = dstwd;
                }
                else if (wkdlst[wd] < wkdlst[dstwd]) {
                    dy = dy + (wkdlst[dstwd] - wkdlst[wd]);  // advance to matching week day
                    wd = dstwd;
                }
                else {
                    // do we need to advance to next week?
                    if ((wk + 1) < dstrk) {
                        dy = dy + 7;
                        wk = wk + 1;
                    }
                    else {
                        // quit because we have found our day of week in corresponding week of month
                        idx = dstrk;
                    }
                }
            }

            // set resulting day of month
            dstdte.setDate(dy);
        }

        // set date/time as a UTC date/time to avoid changes due to DST
        dstdte.setUTCHours(dsthr, dstmn, 0, 0);
        dstdte.setUTCFullYear((dstdte.getFullYear()), dstmt, dy);

        return dstdte;
    }

    // FUNCTION: "showClockTime" - sets and displays each of the four clocks
    $scope.showClockTime = function() {

        if (multipleClocks == 'X') {
            $scope.setTheClock(1);
            $scope.setTheClock(2);
            $scope.setTheClock(3);
        }
        else {
            $scope.setTheClock(0);
        }

    }

    // FUNCTION: "setClockMouseHoverColor" - sets mouse over (hover) color of the clock
    $scope.setClockMouseHoverColor = function(theClock, theColor) {

        if (theColor == "basic-blue-font") {
            theClock.blue = true;
        };
        if (theColor == "grey-font") {
            theClock.grey = true;
        };
        if (theColor == "red-font") {
            theClock.red = true;
        };
        if (theColor == "yellow-font") {
            theClock.yellow = true;
        };
        if (theColor == "orange-font") {
            theClock.orange = true;
        };
        if (theColor == "green-font") {
            theClock.green = true;
        };
        if (theColor == "purple-font") {
            theClock.purple = true;
        };

    };

    // FUNCTION: "getClockMouseHoverColor" - extracts mouse over (hover) color of the clock
    $scope.getClockMouseHoverColor = function(theColor) {

        var clr;
        var idx;

        // default to color "blue" until we know otherwise...
        clr = 'blue';

        // extract the name of the color
        idx = theColor.search("-");
        if (idx > 0) {
            clr = theColor.substring(0, idx);
            // if necessary transform "basic-blue-font" into color "blue"
            if (clr == 'basic') {
                clr = 'blue';
            }
        };

        return clr;
    };

    // initialize settings from "backend" server only when webpage is "refreshed" because of interval setting triggering
    // display of clock every second.  We want to make the client do the work of calculating the time and formatting the
    // clock for each iteration.  So that we don't bog down the server, the client will only request data from server 
    // when the web page is refreshed.  (NOTE: $scope.appConfig is an internal variable that contains the configurations 
    // retrieved from the "backend".  If configuration does not exist at the server, default values for the configuration
    // are set by "initialize" function).

    configService.initialize($scope.appConfig);

    // load clock formats
    clockFacePlace = configService.getValue('clockFacePlace');
    multipleClocks = configService.getValue('multipleClocks');
    clockFaceHours = configService.getValue('clockFaceHours');
    clockMeridiem = configService.getValue('clockMeridiem');
    clockSeparator = configService.getValue('clockSeparator');
    dateSeparator = configService.getValue('dateSeparator');
    dateType = configService.getValue('dateType');
    clockSeconds = configService.getValue('clockSeconds');
    clockZeroToHour = configService.getValue('clockZeroToHour');
    dateCentury = configService.getValue('dateCentury');
    dateText = configService.getValue('dateText');
    multipleClockOrder = configService.getValue('multipleClockOrder');
    showActiveDST = configService.getValue('showActiveDST');
    datetextOrder = configService.getValue('datetextOrder');

    // load "clock" object configurations
    if (multipleClocks == 'X') {
        // load the set of mulitple clocks in the specified order
        for (idx = 1; (idx <= 3); idx++) {
            // extract index of the clock to be displayed
            clk = parseInt(multipleClockOrder.substring((idx - 1), idx));
            // initialize time zone configurations (if "none" default to settings for "clock-1" for initialization
            // purposes only.  We are not going to display this clock face anyway so it does not matter so long as
            // we initialize the configuration with something...)
            clocktime[idx] = (clk > 0) ? configService.getClock(clk - 1) : configService.getClock(0);
            switch (idx) {
                case 1:
                    $scope.clockcolor1 = clocktime[idx].color;
                    $scope.setClockMouseHoverColor($scope.color.clock1, $scope.clockcolor1);
                    break;
                case 2:
                    $scope.clockcolor2 = clocktime[idx].color;
                    $scope.setClockMouseHoverColor($scope.color.clock2, $scope.clockcolor2);
                    break;
                case 3:
                    $scope.clockcolor3 = clocktime[idx].color;
                    $scope.setClockMouseHoverColor($scope.color.clock3, $scope.clockcolor3);
                    break;
            }
        }
    }
    else {
        switch (clockFacePlace) {
            case '0': clocktime[0] = configService.getClock(0); break;
            case '1': clocktime[0] = configService.getClock(1); break;
            case '2': clocktime[0] = configService.getClock(2); break;
            case '3': clocktime[0] = configService.getClock(3); break;
        }
        $scope.clockcolor0 = clocktime[0].color;
        $scope.setClockMouseHoverColor($scope.color.clock0, $scope.clockcolor0);
    }

    // set clock face to match number of clocks being displayed...
    $scope.box.boxSize = configService.getValue('boxSize');
    $scope.isMultipleClock = (multipleClocks == 'X') ? true : false;

    // display dummy row to vertically center clock face and hide row displaying calendar text
    // if the text is not being displayed...
    $scope.isEmptyText_SNG = (($scope.isMultipleClock == false) && (dateText == '')) ? true : false;
    $scope.isClockText_SNG = (($scope.isMultipleClock == false) && (dateText != '')) ? true : false;
    $scope.isEmptyText_MLT = (($scope.isMultipleClock == true) && (dateText == '')) ? true : false;
    $scope.isClockText_MLT = (($scope.isMultipleClock == true) && (dateText != '')) ? true : false;


    $scope.fontsize = "5pt";

    // initialize "clock" timer
    $scope.showClockTime();

    // start timer to refresh the "clock(s)" every second
    $window.setInterval(function() { $scope.showClockTime(); }, 1000);

} ]);

