angular.module("lib.utils", []).factory("lib.utils.calUtils", function () {
	var MILLISECS_DAY = 24 * 3600 * 1000;

	var _additionalData= {};

	var _weekdays = [
		{short: "Mo", medium: "Mon", long: "Monday"},
		{short: "Tu", medium: "Tue", long: "Tuesday"},
		{short: "We", medium: "Wed", long: "Wednesday"},
		{short: "Th", medium: "Thu", long: "Thursday"},
		{short: "Fr", medium: "Fri", long: "Friday"},
		{short: "Sa", medium: "Sat", long: "Saturday"},
		{short: "Su", medium: "Sun", long: "Sunday"}
	];

	var _months = [
		{short: "Jan", long: "January"},
		{short: "Feb", long: "February"},
		{short: "Mar", long: "March"},
		{short: "Apr", long: "April"},
		{short: "May", long: "May"},
		{short: "Jun", long: "June"},
		{short: "Jul", long: "July"},
		{short: "Aug", long: "August"},
		{short: "Sep", long: "September"},
		{short: "Oct", long: "October"},
		{short: "Nov", long: "November"},
		{short: "Dec", long: "December"}
	];

	function _addAdditionalData (data_o) {
		if (typeof data_o != "object") {
			return false;
		}
		
		for (var prop in data_o) {
			if(data_o.hasOwnProperty(prop)) {
				var key = Math.floor(prop / MILLISECS_DAY);
				_additionalData[key] = data_o[prop];
			}
		}

		return true;
	}

	function _lookupAdditionalDataForDay (dateDay_i) {
		for (var prop in _additionalData) {
			if (prop == dateDay_i) {
				return _additionalData[prop];
			}
		}

		return null;
	}

	function _buildCalendarArray (year_i, month_i) {
		var cal = new Array();
		var firstDayInMonth = new Date(year_i, month_i, 1).getDay();
		var daysInLastMonth = 0;
		var today = new Date(); //Needed as a workaround for strange behaviour of javascript
		var todayInMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime(); //The begin of today (00:00) in milliseconds-format (needed for comparisons)	

		cal[0] = new Array();
		if (firstDayInMonth != 0) {
			daysInLastMonth = firstDayInMonth - 1; //-1 because sunday is actually 0 but we move it to 6, so all other days shift one to the left
		}
		else {
			daysInLastMonth = 6;
		}

		var firstDateOfGridInMs = new Date(year_i, month_i, 1).getTime() - (daysInLastMonth * MILLISECS_DAY);
		var firstDateOfGridAsDays = Math.floor(firstDateOfGridInMs / MILLISECS_DAY);

		var i;
		var week = 0;
		var stop = false;
		for (i = 0; !stop; i++) {
			var additionalDataForThisDay = _lookupAdditionalDataForDay(firstDateOfGridAsDays + i);
			var thisDay = new Date(firstDateOfGridInMs + i * MILLISECS_DAY);
			cal[Math.floor(i / 7)][i % 7] = {
				dayNr: thisDay.getDate(), 
				inMonth: (thisDay.getMonth() == month_i), 
				inFuture: (thisDay.getTime() >= todayInMs),
				today: (thisDay.getFullYear() == today.getFullYear() && thisDay.getMonth() == today.getMonth() && thisDay.getDate() == today.getDate()),
				data: additionalDataForThisDay
			};

			if ((i + 1) % 7 == 0) {
				if (new Date(firstDateOfGridInMs + i * MILLISECS_DAY).getMonth() != month_i) {
					stop = true;
				}
				else {
					cal[Math.floor((i + 1) / 7)] = new Array();
				}
			}
		}

		return cal;
	}

	function _getLengthOfMonth (year_i, month_i) {
		var days = 28;
		while (true) {
			var d = new Date(year_i, month_i, days + 1);
			if (d.getMonth() != month_i) {
				return days;
			}
			days++;
		}
	}

	function _relativeTimeTo(dateFrom_o, dateTo_o, short) {
	    var diffMin = dateTo_o.getTime() - dateFrom_o.getTime();
	    diffMin = Math.floor(diffMin / 60000);

	    var days = Math.floor(diffMin / (24 * 60));
	    diffMin = diffMin - days * 24 * 60;

	    var hours = Math.floor(diffMin / 60);
	    diffMin = diffMin - hours * 60;

	    var res = "";
	    if (days > 0) {
	        if(short)
	            res += days + "d ";
            else
	            res += days + ((days == 1) ? " day, " : " days, ");
	    }
	    if (hours > 0) {
	        if(short)
	            res += hours + "h ";
            else
	            res += hours + ((hours == 1) ? " hour, " : " hours, ");
	    }
	    if(short)
	        res += diffMin + "m";
        else
	        res += diffMin + ((diffMin == 1) ? " minute" : " minutes");

	    return res;
	}

	function _useNDigits (val_i, n_i) {
	    var str = new String(val_i);

	    for (var i = str.length; i < n_i; i++) {
	        str = "0" + str;
	    }

	    return str;
	}

	return {
		addAdditionalData: function (data_o) { //data_o should be an object with the days (new Date(year, month, day).getTime()) as keys for arbitrary values (currently not applicable: order has to be chronological - oldest first)
			_addAdditionalData(data_o);
		},
		buildCalendarArray: function (year_i, month_i) {
			return _buildCalendarArray(year_i, month_i);
		},
		getLengthOfMonth: function (year_i, month_i) {
			return _getLengthOfMonth(year_i, month_i);
		},
		getWeekdays: function () {
			return _weekdays;
		},
		getMonths: function () {
			return _months;
		},
		getMonthName: function (i) {
			if (i >= 0 && i <= 11) {
				return _months[i];	
			}
			else {
				return "";
			}
		},
		getMillisecsDay: function () {
			return MILLISECS_DAY;
		},
		relativeTimeTo: function (dateFrom_o, dateTo_o, short) {
		    return _relativeTimeTo(dateFrom_o, dateTo_o, short);
		},
		useNDigits: function (val_i, n_i) {
		    return _useNDigits (val_i, n_i);
		}
	};
}).factory("lib.utils.encodeForUrl", function () {
	return {
		encode: function (url_s) {
			return encodeURIComponent(url_s).replace(/'/g,"%27").replace(/"/g,"%22");
		}
	};
}).factory("lib.utils.stringUtils", function () {
	function _startsWith (string_s, toStartWith_s) {
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
		startsWith: function (string_s, toStartWith_s) {
			_startsWith(string_s, toStartWith_s);
		}
	};
});