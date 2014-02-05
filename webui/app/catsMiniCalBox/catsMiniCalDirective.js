angular.module("catsMiniCalBoxApp", []).directive("catsminicalbox", function (calUtils, catsDataRequest) {
	var linkFn = function ($scope) {
		$scope.weekdays = calUtils.getWeekdays();
		$scope.year = 2014;
		$scope.month = 1;
		$scope.calArray;
		$scope.state = "";		

		var data = catsDataRequest.getData(handleCatsData);

		function handleCatsData (data) {
			if (data != null) {
				var additionalData = processCatsData(data);
				if (additionalData != null) {
					calUtils.addAdditionalData(additionalData);
					$scope.calArray = calUtils.buildCalendarArray($scope.year, $scope.month);
					$scope.state = "CATS-Data received and processed";
				}
				else {
					$scope.state = "CATS-Data received but during processing an error occurred";
				}
			}
			else {
				$scope.state = "CATS-Data could no be retrieved from system";
			}			
		} 

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

	function processCatsData (cats_o) {
		try {
			var processed = {};
			var days = cats_o["asx:abap"]["asx:values"][0].CATSCHK[0].ZCATSCHK_STR;

			for (var i = 0; i < days.length; i++) {
				var dateStr = days[i].DATEFROM[0];
				var statusStr = days[i].STATUS[0];
				
				var time = parseDateToTime(dateStr);
				if (time != null) {
					processed[time] = {state: statusStr};
				}
			}

			console.log(processed);

			return processed;
		} catch (error) {
			return null;
		}

		function parseDateToTime (date_s) {
			if (date_s.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) == -1) { //Checks for pattern: YYYY-MM-DD
				return null;
			}

			var year = date_s.substr(0, 4);
			var month = date_s.substr(5, 2) - 1;
			var day = date_s.substr(8, 2);

			return new Date(year, month, day).getTime();
		}
	}

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
		var firstDateOfGrid;
		var weekday = 0;
		

		cal[0] = new Array();
		if (firstDayInMonth != 0) {
			weekday = firstDayInMonth - 1; //-1 because sunday is actually 0 but we move it to 6, so all other days shift one to the left
		}
		else {
			weekday = 6
		}

		firstDateOfGrid = new Date(year_i, month_i, 1).getTime() - weekday * MILLISECS_DAY;
		firstDateOfGridAsDays = Math.floor(firstDateOfGrid / MILLISECS_DAY);

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
				valid: (thisDay.getMonth() == month_i), 
				data: additionalDataForThisDay
			};

			if ((i + 1) % 7 == 0) {
				if (new Date(firstDateOfGrid + i * MILLISECS_DAY).getMonth() > month_i) {
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
		getMillisecsDay: function () {
			return MILLISECS_DAY;
		}
	};
}).factory("catsDataRequest", function ($http, encodeForUrl) {
	const NODE_GET_API = "http://localhost:8000/api/get?url=";
	const CATS_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA";
	var url = NODE_GET_API + encodeForUrl.encode(CATS_WEBSERVICE) + "&json=true";

	function _requestCatsData (callback_fn) {
		$http.get(url).success(function (data, status) {
			if (between(status, 200, 299)) {
				console.log("Data:");
				console.log(eval(data));
				callback_fn(eval(data));
			}

			console.log(status);
		}).error(function (data, status, header, config) {
			console.log("GET-Request to " + url + " failed. HTTP-Status: " + status + ".\nData provided by server: " + data);
			callback_fn(null);
		});

		function between (val_i, min_i, max_i) {
			return (val_i >= min_i && val_i <= max_i);
		}
	}

	return {
		getData: function (callback_fn) {		//Returns either an object generated from json string or null in case Request wasn't successful. In the last case the method will internaly invoke a console.log()
			return _requestCatsData(callback_fn);
		}
	};
}).factory("encodeForUrl", function () {
	return {
		encode: function (url_s) {
			return encodeURIComponent(url_s).replace(/'/g,"%27").replace(/"/g,"%22");
		}
	};
});