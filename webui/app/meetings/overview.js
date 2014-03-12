angular.module("app.meetings", ["app.meetings.ews", "lib.utils"]).directive("app.meetings", ["$timeout", "$http", "app.meetings.ewsUtils", "lib.utils.calUtils", "$interval", function ($timeout, $http, ewsUtils, calUtils, $interval) {
	var linkFn = function ($scope) {
		/* ====================================== */
		/* CONFIGURATION */
		$scope.dayCnt = 1;
		$scope.hideAllDayEvents = true;
		/* ====================================== */

		$scope.boxTitle = "Meetings";
		$scope.boxIcon = '&#xe050;';
		$scope.currentEvent = 0;
		$scope.events = [];
		$scope.eventsRaw = {};
		$scope.loading = true;
		$scope.errMsg = null;
		var eventsRaw = {};		

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
          
			$http.get(ewsUtils.buildEWSUrl(new Date(new Date().toDateString()), $scope.dayCnt)).success(function (data, status) {
				try{
					eventsRaw = {};
					eventsRaw = eval(data)["s:Envelope"]["s:Body"][0]["m:FindItemResponse"][0]["m:ResponseMessages"][0]["m:FindItemResponseMessage"][0]["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"];
					if (typeof eventsRaw != "undefined") {
						parseExchangeData(eventsRaw);
					}
        			$scope.currentEvent = 0;
					$scope.loading = false;
        $timeout(function () { $scope.$broadcast('recalculateMBScrollbars'); }, 250);
        					$scope.errMsg = null;
				}catch(error){
					$scope.errMsg = "Unable to connect to Exchange Server";
					$scope.loading = false;
					console.log((error || $scope.errMsg));
				}
			});
		};

		function parseExchangeData(events) {
			var dateFn = ewsUtils.parseEWSDateStringAutoTimeZone;
			var today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			$scope.events = [];

			if (typeof events == "undefined") {
				return;
			}

			for (var i = 0; i < events.length; i++) {
				//ignore events, which are over already
				if (dateFn(events[i]["t:End"][0]).getTime() <= new Date().getTime()) {
					continue;
				}

				//ignore allday events
				if ($scope.hideAllDayEvents && events[i]["t:IsAllDayEvent"][0] != "false") {
					continue;
				}

				var start = dateFn(events[i]["t:Start"][0]);
				var end = dateFn(events[i]["t:End"][0]);

				$scope.events.push({
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
					isCurrent: (start.getTime() < new Date().getTime())
				});
			}

			$scope.events = $scope.events.sort(sortByStartTime);
		}

		$scope.upComingEvents = function () {
		    $scope.$broadcast('recalculateScrollbars');
		    return $scope.events;
		};

		$scope.hasEvents = function () {
		    return ($scope.events.length != 0);
		};

		$scope.getMeetingsLeftText = function () {
			var cnt = 0;
			for (var i = 0; i < $scope.events.length; i++) {
				if ($scope.events[i].end.getTime() > new Date().getTime()) {
					cnt++;
				}
			}

		    return cnt + " meeting" + (cnt == 1 ? "" : "s") + " left for today.";
		}

		$scope.isLoading = function () {
			return $scope.loading;
		};

		function reload() {
			if (!$scope.isLoading()) {
				loadFromExchange();
			}
		};

		$scope.getCurrentDate = function () {
		    var date = new Date();
		    return calUtils.getWeekdays()[date.getDay() - 1].long + ", " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).long;
		};

		var refreshInterval = null;

		$scope.$on("$destroy", function(){
			if (refreshInterval != null) {
				$interval.cancel(refreshInterval);
			}
		});

		(function springGun() {
			var i = 1;
			//Full reload every 300 seconds, refresh of UI all 30 seconds
			refreshInterval = $interval(function () {
				if (i % 10 == 0) {
					reload();
					i = 1;
				}
				else {
					parseExchangeData(eventsRaw);
					i++;
				}
			}, 30000);
		})();

		loadFromExchange();
	};

	return {
		restrict: "E",
		scope: false,
		templateUrl: "app/meetings/overview.html",
		replace: true,
		link: linkFn
	};
}]);