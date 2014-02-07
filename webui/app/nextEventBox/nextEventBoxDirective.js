angular.module("nextEventBoxApp", ["ews", "utils"]).directive("nexteventbox", function ($http, ewsUtils, calUtils) {
	var calData = {};
	var events = {};

	var linkFn = function ($scope) {
		/* ====================================== */
		/* CONFIGURATION */
		$scope.dayCnt = 3;
		$scope.daysInRelativeFormat = 1;
		$scope.hideAllDayEvents = true;
		/* ====================================== */

		$scope.boxTitle = "Meetings";
		$scope.boxIcon = '&#xe050;';
		$scope.customCSSFile = "app/nextEventBox/nextEventBoxDirective.css";
		$scope.currentEvent = 0;
		$scope.events = [];
		$scope.loading = true;

		/*$scope.$watch('dayCnt', function(newValue, oldValue, scope) {
			if (newValue != "" && newValue > 0) {
				$scope.loadFromExchange();
			}	
		});*/

		function sortByStartTime(a, b) {
		    if (a.start > b.start)
		        return 1;
		    else if (a.start < b.start)
		        return -1;
		    else
		        return 0;
		};

		function loadFromExchange () {
			$scope.loading = true;
			var dateFn = ewsUtils.parseEWSDateStringAutoTimeZone;
			var today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);

			$http.get(ewsUtils.buildEWSUrl(new Date(), $scope.dayCnt)).success(function (data, status) {
				calData = eval(data);

				events = calData["s:Envelope"]["s:Body"][0]["m:FindItemResponse"][0]["m:ResponseMessages"][0]["m:FindItemResponseMessage"][0]["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"];
				$scope.events = [];
				if (typeof events != "undefined") {
					var j = 0;
					for (var i = 0; i < events.length; i++) {
						//ignore events, which are over already
						if (dateFn(events[i]["t:End"][0]).getTime() <= new Date().getTime()) {
							continue;
						}

						//ignore allday events
						if ($scope.hideAllDayEvents && events[i]["t:IsAllDayEvent"][0] != "false") {
							continue;
						}

						//console.log(events[i]["t:End"][0]);
						//console.log("to");
						//console.log(dateFn(events[i]["t:End"][0]));

						var start = dateFn(events[i]["t:Start"][0]);
						var end = dateFn(events[i]["t:End"][0]);

						$scope.events[j] = {
							subject: events[i]["t:Subject"][0],
							start: start,
							startRel: calUtils.relativeTimeTo(new Date(), start, true),
							startTime: calUtils.useNDigits(start.getHours(), 2) + ":" + calUtils.useNDigits(start.getMinutes(), 2),
							end: end,
							endRel: calUtils.relativeTimeTo(new Date(), end, true),
							endTime: calUtils.useNDigits(end.getHours(), 2) + ":" + calUtils.useNDigits(end.getMinutes(), 2),
							timeZone: events[i]["t:TimeZone"][0],
							location: events[i]["t:Location"] ? events[i]["t:Location"][0] : "",
							getEventTime: function () {
							    if ($scope.events.indexOf(this) == 0)
							        return "<b>" + this.startRel + "</b>";
							    else
							        return this.startTime + "<br />" + this.endTime;
							},
						};

						j++;
					}
				}

				$scope.events = $scope.events.sort(sortByStartTime);

				$scope.currentEvent = 0;
				$scope.loading = false;
			});
		};

		$scope.upComingEvents = function () {
		    var upComingEvents = [];
		    var now = new Date();
		    for (var i = 0; i < $scope.events.length; i++) {
		        if ($scope.events[i].start > now && $scope.events[i].start.getYear() == now.getYear() && $scope.events[i].start.getMonth() == now.getMonth() && $scope.events[i].start.getDate() == now.getDate())
		            upComingEvents.push($scope.events[i]);
		    }
		    return upComingEvents;
		};

		$scope.hasEvents = function () {
		    return ($scope.events.length == 0) ? false : true;
		};

		$scope.getNumberOfEvents = function () {
		    return $scope.upComingEvents().length;
		}

		$scope.isLoading = function () {
			return $scope.loading;
		};

		$scope.reload = function () {
			if (!$scope.isLoading()) {
				loadFromExchange();
			}
		};

		$scope.getCurrentDate = function () {
		    var date = new Date();
		    return calUtils.getWeekdays()[date.getDay() - 1].short + "., " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).short + ".";
		}

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