angular.module("utils", []).factory("calUtils", function () {
	const MILLISECS_DAY = 24 * 3600 * 1000;

	var _additionalData= {};

	var _weekdays = [
		{short: "Mo", long: "Monday"},
		{short: "Tu", long: "Tuesday"},
		{short: "We", long: "Wednesday"},
		{short: "Th", long: "Thursday"},
		{short: "Fr", long: "Friday"},
		{short: "Sa", long: "Saturday"},
		{short: "Su", long: "Sunday"}
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

	/*  function _hash (date_o, earliest) {
		var days = date_o.getTime() / 24 * 3600000;
	} */
 
	function _buildCalendarArray (year_i, month_i) {
		var cal = new Array();
		var firstDayInMonth = new Date(year_i, month_i, 1).getDay();
		var firstDateOfGrid;
		var daysInLastMonth = 0;
		var todayInMs = Math.floor(new Date().getTime() / MILLISECS_DAY) * MILLISECS_DAY; //The begin of today (00:00) in milliseconds-format (needed for comparisons)
		

		cal[0] = new Array();
		if (firstDayInMonth != 0) {
			daysInLastMonth = firstDayInMonth - 1; //-1 because sunday is actually 0 but we move it to 6, so all other days shift one to the left
		}
		else {
			daysInLastMonth = 6;
		}

		firstDateOfGrid = new Date(year_i, month_i, 1).getTime() - (daysInLastMonth * MILLISECS_DAY);
		var firstDateOfGridAsDays = Math.floor(firstDateOfGrid / MILLISECS_DAY);

		console.log(new Date(firstDateOfGrid));

		var i;
		var week = 0;
		var stop = false;
		for (i = 0; !stop; i++) {
			var additionalDataForThisDay = _lookupAdditionalDataForDay(firstDateOfGridAsDays + i);
			console.log(new Date((firstDateOfGridAsDays + i) * MILLISECS_DAY));
			console.log(additionalDataForThisDay);
			var thisDay = new Date(firstDateOfGrid + i * MILLISECS_DAY);
			cal[Math.floor(i / 7)][i % 7] = {
				dayNr: thisDay.getDate(), 
				inMonth: (thisDay.getMonth() == month_i), 
				inFuture: (thisDay.getTime() > todayInMs),
				data: additionalDataForThisDay
			};

			if ((i + 1) % 7 == 0) {
				if (new Date(firstDateOfGrid + i * MILLISECS_DAY).getMonth() != month_i) {
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
		}
	};
}).factory("encodeForUrl", function () {
	return {
		encode: function (url_s) {
			return encodeURIComponent(url_s).replace(/'/g,"%27").replace(/"/g,"%22");
		}
	};
});