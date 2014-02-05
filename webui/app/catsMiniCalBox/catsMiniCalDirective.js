angular.module("catsMiniCalBoxApp", []).directive("catsminicalbox", function (calUtils) {
	var linkFn = function ($scope) {
		var data = {};
		data[new Date(2014, 1, 4).getTime()] = {state: "free"};
		data[new Date(2014, 1, 5).getTime()] = {state: "busy"};
		data[new Date(2018, 6, 5).getTime()] = {state: "busy"};

		calUtils.addAdditionalData(data);

		$scope.weekdays = calUtils.getWeekdays();
		$scope.year = 2014;
		$scope.month = 1;
		$scope.calArray;

		//$scope.$watch("year", function () {
		//	$scope.calArray = calUtils.buildCalendarArray($scope.year, $scope.month);
		//});
		
		$scope.$watch("month", function () {
			$scope.calArray = calUtils.buildCalendarArray($scope.year, $scope.month);
		});		

		$scope.getCalArray = function () {
			return calArray;
		};	
	};

	return {
		restrict: "E",
		scope: false,
		templateUrl: "catsMiniCalBoxTemplate.html",
		replace: true,
		link: linkFn
	};
}).factory("calUtils", function () {
	const MILLISECS_DAY = 24 * 3600000;

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
		var monthLength = _getLengthOfMonth(year_i, month_i);
		var firstDayInMonth = new Date(year_i, month_i, 1).getDay();
		var firstDateAsDay = Math.floor(new Date(year_i, month_i, 1).getTime() / MILLISECS_DAY);
		var weekday = 0;
		var week = 0;

		cal[0] = new Array();
		if (firstDayInMonth != 0) {
			skipNDays(cal[0], firstDayInMonth - 1);
			weekday = firstDayInMonth - 1;
		}
		else {
			skipNDays(cal[0], 6);
			weekday = 6
		}

		console.log(_additionalData);

		var i;
		for (i = 0; i < monthLength; i++) {
			var additionalDataForThisDay = _lookupAdditionalDataForDay(firstDateAsDay + i);
			console.log(firstDateAsDay + i);
			console.log(additionalDataForThisDay);
			cal[week][weekday] = {dayNr: i + 1, valid: true, data: additionalDataForThisDay};
			weekday++;

			if (weekday == 7) {
				week++;
				weekday = 0;
				cal[week] = new Array();
			}
		}

		//Fill up last week
		skipNDays(cal[week], 7 - weekday); //7 because it got incremented once more in the loop above

		return cal;

		function skipNDays (ar, n) {
			for (var j = 0; j < n; j++) {
				ar.push({dayNr: -1, valid: false});
			}
		}
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
		addAdditionalData: function (data_o) { //data_o should be an object with the days (new Date(year, month, day).getTime()) as keys for arbitrary values, order has to be chronological - oldest
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
		}
	};
}).factory("catsDataRequest", function ($http, encodeForUrl) {
	const NODE_GET_API = "http://localhost:8000/api/get?url=";
	const CATS_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA";
	var url = NODE_GET_API + encodeForUrl(CATS_WEBSERVICE) + "&json=true";

	function _requestCatsData (callback_fn) {
		$http.get(url).success(function (data, status) {
			if (between(status, 200, 299)) {
				callback_fn(JSON.parse(data));
			}
		}).error(function (data, status, header, config) {
			console.log("GET-Request to " + url + " failed. HTTP-Status: " + status + ".\nData provided by server: " + data);
			callback_fn(null);
		});

		function between (val_i, min_i, max_i) {
			return (val_i >= min__i && val_i <= max_i);
		}
	}

	return {
		getData: function () {		//Returns either an object generated from json string or null in case Request wasn't successful. In the last case the method will internaly invoke a console.log()
			return _requestCatsData();
		}
	};
}).factory("encodeForUrl", function () {
	return {
		encode: function (url_s) {
			return encodeURIComponent(val_s).replace(/'/g,"%27").replace(/"/g,"%22");
		}
	};
});