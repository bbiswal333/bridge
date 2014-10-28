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

			$scope.closeMsgBox = true;
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

			$scope.upComingBookings = function () {
				return $scope.rooms;
			};

			$scope.getFoundRooms = function () {
				return $scope.foundRooms;
			};

			$scope.hasBookings = function () {
				//return true;
				return (($scope.rooms||[]).length !== 0);
				// return ($scope.rooms.length !== 0);
			};
			$scope.selectRoom = function (room) {
				$scope.selectedRoom=room;
			};
			$scope.deselectRoom = function (room) {
				$scope.selectedRoom=undefined;
			};

			$scope.cancelRoom = function(room) {
				$scope.closeMsgBox = false;
				$scope.selectedRoom = undefined;
				ifpservice.cancelRoom(room).then(function(data) {
					if (data.data.RESULT.TYPE == "E") {
						$scope.errMsg = "Error canceling your booking of "+ room.LOCATION +". "+ data.data.RESULT.MESSAGE;
					} 
					if (data.data.RESULT.TYPE == "S") {
						$scope.loadMyReservations();
					}
				},function(error){
					$scope.errMsg = "Error canceling your booking of "+ room.LOCATION;
				});;
			}

			$scope.getRoomsLeftText = function () {
				var cnt = ($scope.rooms||[]).length;
				return cnt + " booking" + (cnt === 1 ? "" : "s") + " till " + calUtils.getWeekdays()[$scope.tillDate.getDay() - 1].long + ", " + $scope.tillDate.getDate() + ". " + calUtils.getMonthName($scope.tillDate.getMonth()).long;
			};

			$scope.isLoading = function () {
				return $scope.loading;
			};


            $scope.loadMyReservations = function() {
				$scope.closeMsgBox = false;
                var today = new Date();
                var till = new Date();
                till.setDate(till.getDate()+7);

                $scope.tillDate = till;

                ifpservice.loadFromIsp(today, till).then(function(data) {
                    $scope.rooms = data.data.RESERVATIONS;
                    $scope.loading = false;
                }, function() {
					$scope.errMsg = "Error fetching your room booking from the backend. Please check back later";
				});
            };
			$scope.closeMsgBoxaction = function () {
				$scope.closeMsgBox = true;
			};

			$scope.getCurrentDate = function () {
				var date = new Date();
				return calUtils.getWeekdays()[date.getDay() - 1].long + ", " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).long;
			};

			$scope.isEmpty = function(obj) {
				return _.isEmpty(obj);
			}
            $scope.loadMyReservations();
		}];

		var linkFn = function ($scope) {
			/* ====================================== */
			/* CONFIGURATION */
			$scope.dayCnt = 2; // Because of time Zone issues
			$scope.hideAllDayEvents = true;
			/* ====================================== */

            $scope.rooms  = [];
			$scope.loading = true;
			$scope.errMsg = null;
			var today = new Date(new Date().toDateString());

			
			if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
			    meetingsConfigService.configItem = $scope.appConfig.configItem;
			}
			$scope.box.boxSize = $scope.appConfig.configItem.boxSize;

		    $scope.$watch("appConfig.configItem.boxSize", function () {
				$scope.box.boxSize = $scope.appConfig.configItem.boxSize;
		    }, true);


			function reload() {
				if (!$scope.isLoading()) {
                    $scope.loadMyReservations();
				}
			}
			
			var refreshInterval = null;

			$scope.$on("$destroy", function(){
				if (refreshInterval != null) {
					$interval.cancel(refreshInterval);
				}
			});
			
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
