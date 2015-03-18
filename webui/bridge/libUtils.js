angular.module("lib.utils", []).provider("lib.utils.calUtils", function() {
    var self = this;
    var _additionalData = {};

    var _weekdays = [{
        short: "Mo",
        medium: "Mon",
        long: "Monday"
    }, {
        short: "Tu",
        medium: "Tue",
        long: "Tuesday"
    }, {
        short: "We",
        medium: "Wed",
        long: "Wednesday"
    }, {
        short: "Th",
        medium: "Thu",
        long: "Thursday"
    }, {
        short: "Fr",
        medium: "Fri",
        long: "Friday"
    }, {
        short: "Sa",
        medium: "Sat",
        long: "Saturday"
    }, {
        short: "Su",
        medium: "Sun",
        long: "Sunday"
    }];

    var _weekdaysStartOnSunday = [{
        short: "Su",
        medium: "Sun",
        long: "Sunday"
    }, {
        short: "Mo",
        medium: "Mon",
        long: "Monday"
    }, {
        short: "Tu",
        medium: "Tue",
        long: "Tuesday"
    }, {
        short: "We",
        medium: "Wed",
        long: "Wednesday"
    }, {
        short: "Th",
        medium: "Thu",
        long: "Thursday"
    }, {
        short: "Fr",
        medium: "Fri",
        long: "Friday"
    }, {
        short: "Sa",
        medium: "Sat",
        long: "Saturday"
    }];

    var _months = [{
        short: "Jan",
        long: "January"
    }, {
        short: "Feb",
        long: "February"
    }, {
        short: "Mar",
        long: "March"
    }, {
        short: "Apr",
        long: "April"
    }, {
        short: "May",
        long: "May"
    }, {
        short: "Jun",
        long: "June"
    }, {
        short: "Jul",
        long: "July"
    }, {
        short: "Aug",
        long: "August"
    }, {
        short: "Sep",
        long: "September"
    }, {
        short: "Oct",
        long: "October"
    }, {
        short: "Nov",
        long: "November"
    }, {
        short: "Dec",
        long: "December"
    }];

    this.addAdditionalData = function(data_o) {
        if (typeof data_o !== "object") {
            return false;
        }

        for (var prop in data_o) {
            if (data_o.hasOwnProperty(prop)) {
                _additionalData[prop] = data_o[prop];
            }
        }
        return true;
    };

    var lookupAdditionalDataForDay = function(dateDay_i) {
        for (var prop in _additionalData) {
            if (prop === dateDay_i.toString()) {
                return _additionalData[prop];
            }
        }
        return null;
    };

    this.buildCalendarArray = function(year_i, month_i, startOnSunday_b) {
        var cal = [];
        var firstDayInMonth = new Date(year_i, month_i, 1).getDay();
        var daysInLastMonth = 0;
        var today = new Date(); //Needed as a workaround for strange behaviour of javascript
        var todayInMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime(); //The begin of today (00:00) in milliseconds-format (needed for comparisons)

        cal[0] = [];
        if (startOnSunday_b) {
            daysInLastMonth = firstDayInMonth;
        } else {
            if (firstDayInMonth !== 0) {
                daysInLastMonth = firstDayInMonth - 1; //-1 because sunday is actually 0 but we move it to 6, so all other days shift one to the left
            } else {
                daysInLastMonth = 6;
            }
        }
        var firstDateOfGridInMs = new Date(year_i, month_i, 1 - daysInLastMonth).getTime();
        var firstDateOfGrid = new Date(firstDateOfGridInMs);

        var i;
        var stop = false;
        for (i = 0; !stop; i++) {
            var thisDay = new Date(firstDateOfGrid.getFullYear(), firstDateOfGrid.getMonth(), firstDateOfGrid.getDate() + i);
            var additionalDataForThisDay = lookupAdditionalDataForDay(thisDay.getTime());
            cal[Math.floor(i / 7)][i % 7] = {
                dayNr: thisDay.getDate(),
                inMonth: (thisDay.getMonth() === month_i),
                inFuture: (thisDay.getTime() >= todayInMs),
                today: (thisDay.getFullYear() === today.getFullYear() && thisDay.getMonth() === today.getMonth() && thisDay.getDate() === today.getDate()),
                data: additionalDataForThisDay,
                dayString: self.stringifyDate(thisDay),
                date: thisDay,
                weekNo: self.getWeekNumber(thisDay).weekNo
            };

            if ((i + 1) % 7 === 0) {
                var dateToCheck = thisDay;
                if (!startOnSunday_b) {
                    dateToCheck.setDate(thisDay.getDate() + 1);
                }
                if (dateToCheck.getMonth() !== month_i) {
                    stop = true;
                } else {
                    cal[Math.floor((i + 1) / 7)] = [];
                }
            }
        }
        return cal;
    };

    this.getLengthOfMonth = function(year, month) {
        return new Date(year, month + 1, 0).getDate();
    };

    this.relativeTimeTo = function(dateFrom_o, dateTo_o, short_b) {
        var diffMin = dateTo_o.getTime() - dateFrom_o.getTime();
        diffMin = Math.floor(diffMin / 60000);

        return this.getTimeInWords(diffMin, short_b);
    };

    this.getTimeInWords = function (minutes_i, short_b, only_hours_and_minutes_b) {
        if (!only_hours_and_minutes_b) {
            var days = Math.floor(minutes_i / (24 * 60));
            minutes_i = minutes_i - days * 24 * 60;
        }
        var hours = Math.floor(minutes_i / 60);
        minutes_i = Math.round(minutes_i - hours * 60);

        var res = "";
        if (days > 0) {
            if (short_b) {
                res += days + "d ";
            }
            else {
                res += days + ((days === 1) ? " day, " : " days, ");
            }
        }
        if (hours > 0) {
            if (short_b) {
                res += hours + "h ";
            }
            else {
                res += hours + ((hours === 1) ? " hour, " : " hours, ");
            }
        }
        if (short_b) {
            res += minutes_i + "m";
        }
        else {
            res += minutes_i + ((minutes_i === 1) ? " minute" : " minutes");
        }

        return res;
    };

    this.useNDigits = function(val_i, n_i) {
        var str = val_i.toString();

        for (var i = str.length; i < n_i; i++) {
            str = "0" + str;
        }

        return str;
    };

    this.calcBusinessDays = function(dDate1, dDate2) { // input given as Date objects
        var iWeeks, iDateDiff, iAdjust = 0;
        if (dDate2 < dDate1) {
            return -1; // error code if dates transposed
        }

        var iWeekday1 = dDate1.getDay(); // day of week
        var iWeekday2 = dDate2.getDay();

        iWeekday1 = (iWeekday1 === 0) ? 7 : iWeekday1; // change Sunday from 0 to 7
        iWeekday2 = (iWeekday2 === 0) ? 7 : iWeekday2;

        if ((iWeekday1 > 5) && (iWeekday2 > 5)) {
            iAdjust = 1; // adjustment if both days on weekend
        }
        iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
        iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

        // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
        iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000);

        if (iWeekday1 <= iWeekday2) {
            iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1);
        } else {
            iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2);
        }

        iDateDiff -= iAdjust; // take into account both days on weekend

        return (iDateDiff); // add 1 if the end date should be included
    }; //calcBusinessDays

    //Parses such dates: yyyy-mm-dd
    this.parseDate = function(str) {
        if (typeof str !== "string" || str.length !== 10) {
            return false;
        }

        var day = str.substr(8, 2);
        var mon = str.substr(5, 2) - 1;
        var year = str.substr(0, 4);
        return new Date(year, mon, day);
    };

    //Return the start of today
    this.today = function() {
        var d = new Date();
        var day = d.getDate();
        var mon = d.getMonth();
        var year = d.getFullYear();
        return new Date(year, mon, day);
    };

    //Return strings like: yyyy-mm-dd (Which will be accepted by parseDate() as input again)
    this.stringifyDate = function(date_o) {
        if (!(date_o instanceof Date)) {
            return null;
        }
        return date_o.getFullYear() + "-" + this.useNDigits((date_o.getMonth() + 1), 2) + "-" + this.useNDigits(date_o.getDate(), 2);
    };

    this.getWeekdays = function(startOnSunday_b) {
        if (startOnSunday_b) {
            return angular.copy(_weekdaysStartOnSunday);
        } else {
            return angular.copy(_weekdays);
        }
    };

    this.getWeekday = function (day, format) {
        if (day === 0) {
            day = 6;
        }
        else {
            day--;
        }

        if (format === 0) {
            return _weekdays[day].short;
        }
        else if (format === 1) {
            return _weekdays[day].medium;
        }
        else {
            return _weekdays[day].long;
        }
    };

    this.getMonths = function() {
        return _months;
    };

    this.getMonthName = function(i) {
        if (i >= 0 && i <= 11) {
            return _months[i];
        } else {
            return "";
        }
    };

    this.getWeekNumber = function (date_o) {
        //ISO 8601
        //+ (date_o.getTimezoneOffset() / 60) * 3600000) -
        var res = {};
        var MILLISECS_DAY = 24 * 3600 * 1000;

        var jan4Week = new Date(date_o.getFullYear(), 0, 4);
        var jan4WeekDay = jan4Week.getDay();
        if (jan4WeekDay !== 0) {
            jan4WeekDay = jan4WeekDay - 1; //-1 because sunday is actually 0 but we move it to 6, so all other days shift one to the left
        } else {
            jan4WeekDay = 6;
        }
        //$log.log("-> " +  date_o);
        var monInFirstWeek = new Date(jan4Week.getTime() - (jan4WeekDay * MILLISECS_DAY));
        //$log.log(monInFirstWeek);
        var daysSinceFirstMon = Math.round((date_o.getTime() - monInFirstWeek.getTime()) / MILLISECS_DAY);
        //$log.log(daysSinceFirstMon);
        res.weekNo = 1 + Math.floor(daysSinceFirstMon / 7);

        var monInSelectedWeek = new Date(date_o.getTime() - ((date_o.getDay() !== 0) ? date_o.getDay() - 1 : 6)  * MILLISECS_DAY);

        var date_i = monInSelectedWeek.getTime();
        var cnt = 1;
        var yearOne = monInSelectedWeek.getFullYear();
        for (var i = 1; i < 4; i++) {
            if (new Date(date_i + i * MILLISECS_DAY).getFullYear() === yearOne) {
                cnt++;

                if (cnt === 4) {
                    res.year = parseInt(yearOne);
                    return res;
                }
            }
        }
        res.weekNo = 1;
        res.year = parseInt(yearOne) + 1;
        return res;
    };

    this.getUTC = function (year, month, date) {
        //Date.UTC is a function and not a constructor, cannot be changed here
        /*eslint-disable new-cap*/
        var returnDate = new Date(Date.UTC(year, month, date));
        if (!arguments || arguments.length === 0) {
            var today = new Date();
            returnDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
            return returnDate;
        }
        return returnDate;
        /*eslint-enable new-cap*/
    };

    this.substractMonths = function (date, months) {
        var newDate = date.getUTCDate();
        if (newDate > this.getLengthOfMonth(date.getUTCFullYear(), date.getUTCMonth() - months)) {
            newDate = this.getLengthOfMonth(date.getUTCFullYear(), date.getUTCMonth() - months);
        }

        return this.getUTC(date.getUTCFullYear(), date.getUTCMonth() - months, newDate);
    };

    this.transformDateToABAPFormat = function (date) {
        return date.getUTCFullYear() + this.toNumberOfCharactersString((date.getUTCMonth() + 1), 2) + this.toNumberOfCharactersString(date.getUTCDate(), 2);
    };

    this.transformDateToABAPFormatWithHyphen = function (date) {
        return date.getUTCFullYear() + "-" + this.toNumberOfCharactersString((date.getUTCMonth() + 1), 2) + "-" + this.toNumberOfCharactersString(date.getUTCDate(), 2);
    };

    this.toNumberOfCharactersString = function (str, numberOfCharacters) {
        var result = str.toString();
        while (result.length < numberOfCharacters) {
            result = "0" + result;
        }
        return result;
    };

    this.moveDateToFirstDayInMonth = function (date) {
        return this.getUTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
    };

    this.now = function() {
        return new Date();
    };

    this.utcNowWithOffset = function(millisecondsOffset) {
        var today = this.now();
        return this.addOffsetToDate(today, millisecondsOffset);
    };

    this.addOffsetToDate = function(date, millisecondsOffset) {
        var returnDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()));
        returnDate.setUTCMilliseconds(returnDate.getUTCMilliseconds() + millisecondsOffset);
        return returnDate;
    };

    //Factory-method of provider
    this.$get = function() {
        return self; //This way all methods available at config-Time as provider are also available as factory at runtime
    };
}).factory("lib.utils.encodeForUrl", function() {
    return {
        encode: function(url_s) {
            return encodeURIComponent(url_s).replace(/'/g, "%27").replace(/"/g, "%22");
        }
    };
}).factory("lib.utils.stringUtils", function() {
    function _startsWith(string_s, toStartWith_s) {
        if (typeof string_s === "undefined" || typeof toStartWith_s === "undefined" || toStartWith_s.length > string_s.length) {
            return false;
        }

        for (var i = 0; i < toStartWith_s.length; i++) {
            if (string_s.charAt(i) !== toStartWith_s.charAt(i)) {
                return false;
            }
        }

        return true;
    }

    return {
        startsWith: function(string_s, toStartWith_s) {
            _startsWith(string_s, toStartWith_s);
        }
    };
});
