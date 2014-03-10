angular.module("lib.utils", []).provider("lib.utils.calUtils", function() {
    var self = this;

    var MILLISECS_DAY = 24 * 3600 * 1000;

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
        if (typeof data_o != "object") {
            return false;
        }

        for (var prop in data_o) {
            if (data_o.hasOwnProperty(prop)) {
                var key = Math.floor(prop / MILLISECS_DAY);
                _additionalData[key] = data_o[prop];
            }
        }

        return true;
    };

    this.lookupAdditionalDataForDay = function(dateDay_i) {
        for (var prop in _additionalData) {
            if (prop == dateDay_i) {
                return _additionalData[prop];
            }
        }

        return null;
    };

    this.buildCalendarArray = function(year_i, month_i) {
        var cal = new Array();
        var firstDayInMonth = new Date(year_i, month_i, 1).getDay();
        var daysInLastMonth = 0;
        var today = new Date(); //Needed as a workaround for strange behaviour of javascript
        var todayInMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime(); //The begin of today (00:00) in milliseconds-format (needed for comparisons)	

        cal[0] = new Array();
        if (firstDayInMonth != 0) {
            daysInLastMonth = firstDayInMonth - 1; //-1 because sunday is actually 0 but we move it to 6, so all other days shift one to the left
        } else {
            daysInLastMonth = 6;
        }

        var firstDateOfGridInMs = new Date(year_i, month_i, 1).getTime() - (daysInLastMonth * MILLISECS_DAY);
        var firstDateOfGridAsDays = Math.floor(firstDateOfGridInMs / MILLISECS_DAY);

        var i;
        var week = 0;
        var stop = false;
        for (i = 0; !stop; i++) {
            var additionalDataForThisDay = self.lookupAdditionalDataForDay(firstDateOfGridAsDays + i);
            var thisDay = new Date(firstDateOfGridInMs + i * MILLISECS_DAY);
            cal[Math.floor(i / 7)][i % 7] = {
                dayNr: thisDay.getDate(),
                inMonth: (thisDay.getMonth() == month_i),
                inFuture: (thisDay.getTime() >= todayInMs),
                today: (thisDay.getFullYear() == today.getFullYear() && thisDay.getMonth() == today.getMonth() && thisDay.getDate() == today.getDate()),
                data: additionalDataForThisDay,
                dayString: self.stringifyDate(thisDay)
            };

            if ((i + 1) % 7 == 0) {
                if (new Date(firstDateOfGridInMs + i * MILLISECS_DAY).getMonth() != month_i) {
                    stop = true;
                } else {
                    cal[Math.floor((i + 1) / 7)] = new Array();
                }
            }
        }

        return cal;
    };

    this.getLengthOfMonth = function(year_i, month_i) {
        var days = 28;
        while (true) {
            var d = new Date(year_i, month_i, days + 1);
            if (d.getMonth() != month_i) {
                return days;
            }
            days++;
        }
    };

    this.relativeTimeTo = function(dateFrom_o, dateTo_o, short) {
        var diffMin = dateTo_o.getTime() - dateFrom_o.getTime();
        diffMin = Math.floor(diffMin / 60000);

        var days = Math.floor(diffMin / (24 * 60));
        diffMin = diffMin - days * 24 * 60;

        var hours = Math.floor(diffMin / 60);
        diffMin = diffMin - hours * 60;

        var res = "";
        if (days > 0) {
            if (short)
                res += days + "d ";
            else
                res += days + ((days == 1) ? " day, " : " days, ");
        }
        if (hours > 0) {
            if (short)
                res += hours + "h ";
            else
                res += hours + ((hours == 1) ? " hour, " : " hours, ");
        }
        if (short)
            res += diffMin + "m";
        else
            res += diffMin + ((diffMin == 1) ? " minute" : " minutes");

        return res;
    };

    this.useNDigits = function(val_i, n_i) {
        var str = new String(val_i);

        for (var i = str.length; i < n_i; i++) {
            str = "0" + str;
        }

        return str;
    };

    this.calcBusinessDays = function(dDate1, dDate2) { // input given as Date objects
        var iWeeks, iDateDiff, iAdjust = 0;
        if (dDate2 < dDate1) return -1; // error code if dates transposed

        var iWeekday1 = dDate1.getDay(); // day of week
        var iWeekday2 = dDate2.getDay();

        iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1; // change Sunday from 0 to 7
        iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;

        if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; // adjustment if both days on weekend
        iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
        iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

        // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
        iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

        if (iWeekday1 <= iWeekday2) {
            iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
        } else {
            iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
        }

        iDateDiff -= iAdjust // take into account both days on weekend

        return (iDateDiff); // add 1 if the end date should be included
    }; //calcBusinessDays

    this.parseDate = function(str) {
        if (typeof str != "string" || str.length != 8) return false;
        var day = str.substr(0, 2);
        var mon = str.substr(2, 2) - 1;
        var year = str.substr(4, 4);
        return new Date(year, mon, day);
    };

    this.today = function() {
        var d = new Date();
        var day = d.getDate();
        var mon = d.getMonth();
        var year = d.getFullYear();
        return new Date(year, mon, day);
    };

    this.stringifyDate = function(date_o) {
        if (!(date_o instanceof Date)) return null;
        return this.useNDigits(date_o.getDate(), 2) + "" + this.useNDigits((date_o.getMonth() + 1), 2) + "" + date_o.getFullYear();
    };

    this.getWeekdays = function() {
        return _weekdays;
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
        if (typeof string_s == "undefined" || typeof toStartWith_s == "undefined" || toStartWith_s.length > string_s.length) {
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
