angular.module("app.rooms", ["app.rooms.ews", "lib.utils", "notifier"]).
directive("app.rooms", [
	"$timeout",
	"$http",
	"app.rooms.ews.ewsUtils",
	"lib.utils.calUtils",
	"$interval",
	"app.rooms.configservice",
	"notifier",
  "ifpservice",
	function ($timeout, $http, ewsUtils, calUtils, $interval, meetingsConfigService, notifier, ifpservice) {

		var directiveController = ['$scope', function ($scope){

			$scope.box.settingsTitle = "Configure box size";
			$scope.box.settingScreenData = {
				templatePath: "rooms/settings.html",
					controller: angular.module('app.rooms').appMeetingsSettings,
					id: $scope.boxId
			};

	        $scope.configService = meetingsConfigService;

			$scope.box.returnConfig = function(){
	            return angular.copy($scope.configService);
	        };



            $scope.loadMyReservations = function() {
                var today = new Date();
                var till = new Date();
                till.setDate(till.getDate()+7);

                $scope.tillDate = till;

                ifpservice.loadFromIsp(today, till, function(data) {
                    $scope.rooms = [];
                    var i = 0;
                    for(var index in data) {
                        for(var index2 in data[index]) {
                            var booking = data[index][index2];
                            $scope.rooms[i] = [];
                            $scope.rooms[i].isCurrent = false;
                            $scope.rooms[i].subject = booking.SUBJECT;
                            $scope.rooms[i].date = booking.VALIDFROMDATE.getDate() + "." + (booking.VALIDFROMDATE.getMonth() + 1) + ".";
                            $scope.rooms[i].startTime = calUtils.useNDigits(booking.VALIDFROMDATE.getHours(), 2) + ":" + calUtils.useNDigits(booking.VALIDFROMDATE.getMinutes(), 2);
                            $scope.rooms[i].startRel = calUtils.relativeTimeTo(new Date(), booking.VALIDFROMDATE, true);
                            $scope.rooms[i].endRel = calUtils.relativeTimeTo(new Date(), booking.VALIDTODATE, true);
                            $scope.rooms[i].endTime = calUtils.useNDigits(booking.VALIDTODATE.getHours(), 2) + ":" + calUtils.useNDigits(booking.VALIDTODATE.getMinutes(), 2);
                            $scope.rooms[i].location= booking.BUILDING + ", " + booking.ROOM;
                            i++;
                        }
                    }
                });
            };

            $scope.loadMyReservations();
		}];

		var linkFn = function ($scope) {
			/* ====================================== */
			/* CONFIGURATION */
			$scope.dayCnt = 2; // Because of time Zone issues
			$scope.hideAllDayEvents = true;
			/* ====================================== */

			$scope.events = [];
            $scope.rooms  = [];
			$scope.loading = true;
			$scope.errMsg = null;
			var eventsRaw = {};
			var today = new Date(new Date().toDateString());

			
			if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
			    meetingsConfigService.configItem = $scope.appConfig.configItem;
			}
			$scope.box.boxSize = $scope.appConfig.configItem.boxSize;

			function sortByStartTime(a, b) {
			    if (a.start > b.start) {
			        return 1;
			    } else if (a.start < b.start) {
			        return -1;
			    } else {
			        return 0;
			    }
			}

			function parseExchangeData(events) {
				
				var dateFn = ewsUtils.parseEWSDateStringAutoTimeZone;
				$scope.events = [];

				if (typeof events === "undefined") {
					return;
				}

				for (var i = 0; i < events.length; i++) {
					//ignore events, which are over already
					if (dateFn(events[i]["t:End"][0]).getTime() <= new Date().getTime()) {
						continue;
					}

					//ignore allday events
					if ($scope.hideAllDayEvents && events[i]["t:IsAllDayEvent"][0] !== "false") {
						continue;
					}

					var start = dateFn(events[i]["t:Start"][0]);
					var end = dateFn(events[i]["t:End"][0]);

					if (start.getDate() === today.getDate()) {
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
							    if ($scope.events.indexOf(this) === 0) {
							        return "<b>" + this.startRel + "</b>";
							    } else {
							        return this.startTime + "<br />" + this.endTime;
							    }
							},
							isCurrent: (start.getTime() < new Date().getTime())
						});
					}
				}
				$scope.events = $scope.events.sort(sortByStartTime);
			}

			function loadFromExchange (withNotifications) {
				$scope.loading = true;
				$scope.errMsg = null;
				var oldEventsRawLength = 0;
				if(withNotifications){
					oldEventsRawLength = eventsRaw.length;
				}

				var dateForewsCall = new Date();
				dateForewsCall.setDate(today.getDate() - 1);
				// FIXME this needs to be fixed in order to only request "searchString"
				$http.get(ewsUtils.buildEWSUrl(dateForewsCall, $scope.dayCnt, $scope.searchString)).success(function (data, status) {
					
					try{						
						// FIXME Parsing of Returned Meeting Rooms still not implemented
						eventsRaw = {};
						roomData = [];
						roomData = data["m:ResolveNamesResponse"]["m.ResponseMessages"][0]["m.ResolveNamesResponseMessage"][0]["m:ResolutionSet"][0]["t:Resolution"]
						
						eventsRaw = data["m:FindItemResponse"]["m:ResponseMessages"][0]["m:FindItemResponseMessage"][0]["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"];
						if (typeof eventsRaw !== "undefined") {
							parseExchangeData(eventsRaw);
						}
						if(withNotifications){
							if (eventsRaw.length > oldEventsRawLength) {
								if (eventsRaw.length === oldEventsRawLength + 1) {
									notifier.showInfo("Rooms", "You have a new meeting", "MeetingsApp");
								}
								else {
									notifier.showInfo("Rooms", "You have new meetings", "MeetingsApp");
								}
							}
						}
	        			$scope.errMsg = null;
					}catch(error){
						$scope.errMsg = "Unable to connect to Exchange Server";
						console.log((error || $scope.errMsg));
					}
					$scope.loading = false;
				});
			}

		    $scope.$watch("appConfig.configItem.boxSize", function () {
				$scope.box.boxSize = $scope.appConfig.configItem.boxSize;
		    }, true);

			$scope.upComingEvents = function () {
			    return $scope.rooms;
			};

			$scope.hasEvents = function () {
                //return true;
			    return ($scope.rooms.length !== 0);
			};

			$scope.getMeetingsLeftText = function () {
                var cnt = $scope.rooms.length;
				return cnt + " booking" + (cnt === 1 ? "" : "s") + " till " + calUtils.getWeekdays()[$scope.tillDate.getDay() - 1].long + ", " + $scope.tillDate.getDate() + ". " + calUtils.getMonthName($scope.tillDate.getMonth()).long;
			};

			$scope.isLoading = function () {
				return $scope.loading;
			};

			function reload() {
				if (!$scope.isLoading()) {
					loadFromExchange(true);
				}
			}

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
			
			$scope.searchButton_click = function () {
				loadFromExchange(false);
			};

			(function springGun() {
				var i = 1;
				//Full reload every 300 seconds, refresh of UI all 30 seconds
				refreshInterval = $interval(function () {
					if (i % 10 === 0) {
						reload();
						i = 1;
					}
					else {
						parseExchangeData(eventsRaw);
						i++;
					}
				}, 30000);
			})();

			loadFromExchange(false);

        };

		return {
			restrict: "E",
			controller: directiveController,
			scope: false,
			templateUrl: "app/rooms/overview.html",
			replace: true,
	        link: linkFn 
		};
}]);
