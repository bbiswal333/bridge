angular.module("nextEventBoxApp", ["ewsHelperModule"]).directive("nexteventbox", function ($http, ewsHelperUtils) {
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
			var dateFn = ewsHelperUtils.parseEWSDateStringAutoTimeZone;
			var today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);

			$http.get(ewsHelperUtils.buildEWSUrl(new Date(), $scope.dayCnt)).success(function (data, status) {
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
			ret.start = ewsHelperUtils.relativeTimeTo(new Date(), evt.start);
			ret.end = ewsHelperUtils.relativeTimeTo(new Date(), evt.end);

			return ret;
		};

		$scope.getCurrentEvent = function () {
			var evt = $scope.getCurrentEventAbsolute();
			if ((evt.start.getTime() - new Date()) >= (2 * 24 * 3600000)) {
				//Return date in absolute format
				function format(val) {
					return ewsHelperUtils.useNDigits(val, 2);
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