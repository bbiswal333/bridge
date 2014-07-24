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

			function parseExchangeDataRooms(fRooms) {
				
				$scope.foundRooms = [];

				if (typeof fRooms === "undefined") {
					return;
				}

				try {
					for (var i = 0; i < fRooms.length; i++) {
						if (typeof fRooms[i]["t:Contact"] === "undefined") {
							break;
						}
						var phoneNumber = "no Number defined"
						if (typeof(fRooms[i]["t:Contact"][0]["t:PhoneNumbers"]) != "undefined") {
							
							var phones = fRooms[i]["t:Contact"][0]["t:PhoneNumbers"][0]["t:Entry"]
							for (var j = 0; j < phones.length; j++) {
								if ( phones[j].$["Key"] == "BusinessPhone" ) {
									phoneNumber = phones[j]._ 
									break;
								} 
							}
						}

						$scope.foundRooms.push({
							phoneNumber: phoneNumber,
							displayName: fRooms[i]["t:Contact"][0]["t:DisplayName"][0],
							eMail: fRooms[i]["t:Contact"][0]["t:EmailAddresses"][0]["t:Entry"][0]._
						});
					}
				} catch (error) {
						$scope.errMsg = "Error parsing Exchange Data";
					console.log((error || $scope.errMsg));
				}
				console.log($scope.foundRooms);

			}

			function loadFromExchange (withNotifications) {
				$scope.loading = true;
				$scope.errMsg = null;
				var oldEventsRawLength = 0;
				if(withNotifications){
					oldEventsRawLength = eventsRaw.length;
				}
				
				var url = ewsUtils.buildEWSUrl("0", "0", $scope.searchString);
				$http.get(url).success(function (data, status) {
					
					try{						
						eventsRaw = {};
						roomData = [];
						if (status == "200") {
							roomData = data["m:ResolveNamesResponse"]["m:ResponseMessages"][0]["m:ResolveNamesResponseMessage"][0]["m:ResolutionSet"][0]["t:Resolution"]
							parseExchangeDataRooms(roomData);
						}
	        			$scope.errMsg = null;
					}catch(error){
						$scope.errMsg = "Unable to connect to Exchange Server or problem parsing the response.";
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
			
			$scope.getFoundRooms = function () {
				return $scope.foundRooms;
			};

			$scope.hasEvents = function () {
                //return true;
			    return ($scope.rooms.length !== 0);
			};

			$scope.getRoomsLeftText = function () {
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
//
// 		disable regular refresh on Room app
//
//			(function springGun() {
//				var i = 1;
//				//Full reload every 300 seconds, refresh of UI all 30 seconds
//				refreshInterval = $interval(function () {
//					if (i % 10 === 0) {
//						reload();
//						i = 1;
//					}
//					else {
//						parseExchangeData(eventsRaw);
//						i++;
//					}
//				}, 30000);
//			})();

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
