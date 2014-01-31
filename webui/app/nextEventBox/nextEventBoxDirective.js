angular.module("nextEventBoxApp", []).factory("ewsUrlBuilder", function () {
	var EWS_BASE_URL = "/api/CalDataSSO";

	function _buildEWSUrl (dateFrom_o, days_i) {
		var dateFrom_s = buildDateString(dateFrom_o);
		var dateTo_s = buildDateString(new Date(dateFrom_o.getTime() + (days_i * 86400000))); //Adds days by multiplying the milliseconds of one day

		return EWS_BASE_URL + "?from=" + encodeForUrl(dateFrom_s) + "&to=" + encodeForUrl(dateTo_s) + "&format=json";
	
		function buildDateString (date_o) {
			var year = date_o.getFullYear();
			var month = useNDigits(date_o.getMonth() + 1, 2);
			var day = useNDigits(date_o.getDate(), 2);
			var hour = useNDigits(date_o.getHours(), 2);
			var minute = useNDigits(date_o.getMinutes(), 2);
			var second = useNDigits(date_o.getSeconds(), 2);

			return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "Z"; 
		}

		function encodeForUrl (val_s) {
			return encodeURIComponent(val_s).replace(/'/g,"%27").replace(/"/g,"%22");
		}

		//Testes by a separate test
		function useNDigits (val_i, n_i) {
			var str = new String(val_i);

			for (var i = str.length; i < n_i; i++) {
				str = "0" + str;
			}

			return str;
		}
	}	

	return {
		buildEWSUrl: function(dateFrom_o, days_i) {
			return _buildEWSUrl(dateFrom_o, days_i);
		}
	};
}).	directive("nexteventbox", function ($http, ewsUrlBuilder) {
	var calData = {};
	var events = {};

	var linkFn = function ($scope, element, attrs) {
		$scope.boxTitle = "Meetings";
		$scope.boxIcon = '&#xe050;'
		$scope.currentEvent = 0;
		$scope.nextEvents = [];
		$scope.dayCnt = (typeof attrs.days != "undefined") ? attrs.days : 3;

		/*$scope.$watch('dayCnt', function(newValue, oldValue, scope) {
			if (newValue != "" && newValue > 0) {
				$scope.loadFromExchange();
			}	
		});*/

		$scope.loadFromExchange = function () {
			$http.get(ewsUrlBuilder.buildEWSUrl(new Date(), $scope.dayCnt)).success(function (data, status) {
				console.log(data);
				calData = eval(data);
				console.log(calData);

				events = calData["s:Envelope"]["s:Body"][0]["m:FindItemResponse"][0]["m:ResponseMessages"][0]["m:FindItemResponseMessage"][0]["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"];
				$scope.nextEvents = [];
				for (var i = 0; i < events.length; i++) {
					$scope.nextEvents[i] = {
						subject: events[i]["t:Subject"][0],
						start: events[i]["t:Start"][0],
						end: events[i]["t:End"][0]
					};
				}
			});
		};

		$scope.getCurrentEvent = function () {
			return $scope.nextEvents[$scope.currentEvent];
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

		$scope.loadFromExchange();
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