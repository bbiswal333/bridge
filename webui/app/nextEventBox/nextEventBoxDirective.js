angular.module("nextEventBoxApp", []).factory("ewsUrlBuilder", function () {
	var EWS_BASE_URL = "/api/CalDataSSO";

	function _buildEWSUrl (dateFrom_o, days_i) {
		var dateFrom_s = buildDateString(dateFrom_o);
		var dateTo_s = buildDateString(new Date(dateFrom_o.getTime() + (days_i * 86400000))); //Adds days by multiplying the milliseconds of one day

		return EWS_BASE_URL + "?from=" + encodeForUrl(dateFrom_s) + "&to=" + encodeForUrl(dateTo_s) + "&format=json";
	
		function buildDateString (date_o) {
			var year = date_o.getFullYear();
			var month = _useNDigits(date_o.getMonth() + 1, 2);
			var day = _useNDigits(date_o.getDate(), 2);
			var hour = _useNDigits(date_o.getHours(), 2);
			var minute = _useNDigits(date_o.getMinutes(), 2);
			var second = _useNDigits(date_o.getSeconds(), 2);

			return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "Z"; 
		}

		function encodeForUrl (val_s) {
			return encodeURIComponent(val_s).replace(/'/g,"%27").replace(/"/g,"%22");
		}
	}

		//Testes by a separate test
	function _useNDigits (val_i, n_i) {
		var str = new String(val_i);

		for (var i = str.length; i < n_i; i++) {
			str = "0" + str;
		}

		return str;
	}

	function _parseEWSDateString (ewsDateStr_s, offsetUTC_i) {
		var s = ewsDateStr_s;

		//Check whether this string seems to be valid
		if (s.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/) == -1) {
			return null;
		}

		var year = s.substr(0, 4);
		var month = parseInt(s.substr(5, 2)) - 1;
		var day = s.substr(8, 2);
		var hour = s.substr(11, 2);
		var minute = s.substr(14, 2);
		var second = s.substr(17, 2);

		var d = new Date(year, month, day, hour, minute, second);

		return new Date(d.getTime() + (offsetUTC_i * 3600000)); //3600000 milliseconds are one hour
	}	

	function _relativeTimeTo(dateFrom_o, dateTo_o) {
		var diffMin = dateTo_o.getTime() - dateFrom_o.getTime();
		diffMin = Math.floor(diffMin / 60000);

		var days = Math.floor(diffMin / (24 * 60));
		diffMin = diffMin - days * 24 * 60;

		var hours = Math.floor(diffMin / 60);
		diffMin = diffMin - hours * 60;

		var res = "";
		if (days > 0) {
			res += days + ((days == 1) ? " day, " : " days, ");
		}
		if (hours > 0) {
			res += hours + ((hours == 1) ? " hour, " : " hours, ");
		}
		res += diffMin + ((diffMin == 1) ? " minute" : " minutes");

		return res;
	}


	return {
		buildEWSUrl: function(dateFrom_o, days_i) {
			return _buildEWSUrl(dateFrom_o, days_i);
		},
		parseEWSDateString: function (ewsDateStr_s, offsetUTC_i) {
			return _parseEWSDateString(ewsDateStr_s, offsetUTC_i);		
		},
		parseEWSDateStringAutoTimeZone: function (ewsDateStr_s) {
			return _parseEWSDateString(ewsDateStr_s, (new Date().getTimezoneOffset() / -60));			
		},
		relativeTimeTo: function (dateFrom_o, dateTo_o) {
			return _relativeTimeTo(dateFrom_o, dateTo_o);
		},
		useNDigits: function (val_i, n_i) {
			return _useNDigits (val_i, n_i);
		}
	};
}).	directive("nexteventbox", function ($http, ewsUrlBuilder) {
	var calData = {};
	var events = {};

	var linkFn = function ($scope) {
		$scope.boxTitle = "Meetings";
		$scope.boxIcon = '&#xe050;';
		$scope.customCSSFile = "app/nextEventBox/nextEventBoxDirective.css";
		$scope.currentEvent = 0;
		$scope.nextEvents = [];
		$scope.dayCnt = 3;
		$scope.loading = true;

		/*$scope.$watch('dayCnt', function(newValue, oldValue, scope) {
			if (newValue != "" && newValue > 0) {
				$scope.loadFromExchange();
			}	
		});*/

		function loadFromExchange () {
			$scope.loading = true;
			var dateFn = ewsUrlBuilder.parseEWSDateStringAutoTimeZone;
			var today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);

			$http.get(ewsUrlBuilder.buildEWSUrl(new Date(), $scope.dayCnt)).success(function (data, status) {
				calData = eval(data);

				events = calData["s:Envelope"]["s:Body"][0]["m:FindItemResponse"][0]["m:ResponseMessages"][0]["m:FindItemResponseMessage"][0]["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"];
				console.log(events);
				$scope.nextEvents = [];
				if (typeof events != "undefined") {
					var j = 0;
					for (var i = 0; i < events.length; i++) {
						//ignore events, which are over already
						if (dateFn(events[i]["t:End"][0]).getTime() <= new Date().getTime()) {
							continue;
						}

						console.log(events[i]["t:End"][0]);
						console.log("to");
						console.log(dateFn(events[i]["t:End"][0]));

						$scope.nextEvents[j] = {
							subject: events[i]["t:Subject"][0],
							start: dateFn(events[i]["t:Start"][0]),
							end: dateFn(events[i]["t:End"][0]),
							timeZone: events[i]["t:TimeZone"][0]
						};

						j++;
					}
				}

				$scope.currentEvent = 0;
				$scope.loading = false;
			});
		};

		$scope.getCurrentEventAbsolute = function () {
			return $scope.nextEvents[$scope.currentEvent];
		};

		$scope.getCurrentEventRelative = function () {
			var evt = $scope.getCurrentEventAbsolute();
			var ret = {};
			ret.subject = evt.subject;
			ret.start = ewsUrlBuilder.relativeTimeTo(new Date(), evt.start);
			ret.end = ewsUrlBuilder.relativeTimeTo(new Date(), evt.end);

			return ret;
		};

		$scope.getCurrentEvent = function () {
			var evt = $scope.getCurrentEventAbsolute();
			if ((evt.start.getTime() - new Date()) >= (2 * 24 * 3600000)) {
				//Return date in absolute format
				function format(val) {
					return ewsUrlBuilder.useNDigits(val, 2);
				}

				var ret = {};
				ret.subject = evt.subject;

				ret.start = format(evt.start.getHours()) + ":" + format(evt.start.getMinutes()) + ", " + format(evt.start.getDay()) + "." + format(evt.start.getMonth() + 1) + "." + evt.start.getFullYear();
				ret.end = format(evt.end.getHours()) + ":" + format(evt.end.getMinutes()) + ", " + format(evt.end.getDay()) + "." + format(evt.end.getMonth() + 1) + "." + evt.end.getFullYear();
				return ret;
			}
			else {
				return $scope.getCurrentEventRelative();
			}
		};

		$scope.showNextEvent = function () {
			$scope.currentEvent++;
		};

		$scope.showPreviousEvent = function () {
			$scope.currentEvent--;
		};

		$scope.hasPreviousEvent = function () {
			if ($scope.currentEvent > 0) {
				return true;
			}
			return false;
		};

		$scope.hasNextEvent = function () {
			if ($scope.currentEvent < events.length - 1) {
				return true;
			}
			return false;
		};

		$scope.hasEvents = function () {
			return ($scope.nextEvents.length == 0) ? false : true;
		};

		$scope.isLoading = function () {
			return $scope.loading;
		};

		$scope.reload = function () {
			if (!$scope.isLoading()) {
				loadFromExchange();
			}
		};

		loadFromExchange();
	};

	return {
		restrict: "E",
		scope: false,
		templateUrl: "app/nextEventBox/nextEventBoxTemplate.html",
		replace: true,
		link: linkFn
	};
});

//templateUrl: ,