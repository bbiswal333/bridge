angular.module("app.rooms", ["lib.utils", "notifier"]).
directive("app.rooms", [
	"$timeout",
	"$http",
	"lib.utils.calUtils",
	"$interval",
	"app.rooms.configservice",
	"notifier",
  "ifpservice",
	function ($timeout, $http, calUtils, $interval, meetingsConfigService, notifier, ifpservice) {

		var directiveController = ['$scope', function ($scope){

			$scope.closeMsgBox = true;
	        $scope.boxSize = "1";

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
				return (($scope.rooms || []).length !== 0);
				// return ($scope.rooms.length !== 0);
			};
			$scope.selectRoom = function (room) {
				$scope.selectedRoom = room;
			};
			$scope.deselectRoom = function () {
				$scope.selectedRoom = undefined;
			};

			$scope.cancelRoom = function(room) {
				$scope.closeMsgBox = false;
				$scope.selectedRoom = undefined;
				ifpservice.cancelRoom(room).then(function(data) {
					if (data.data.RESULT.TYPE === "E") {
						$scope.errMsg = "Error canceling your booking of " + room.LOCATION + ". " + data.data.RESULT.MESSAGE;
					}
					if (data.data.RESULT.TYPE === "S") {
						$scope.successMsg = data.data.RESULT.MESSAGE;
						$scope.loadMyReservations();
					}
				},function(){
					$scope.errMsg = "Error canceling your booking of " + room.LOCATION;
				});
			};

			$scope.getRoomsLeftText = function () {
				var cnt = ($scope.rooms || []).length;
				return cnt + " booking" + (cnt === 1 ? "" : "s") + " till " + calUtils.getWeekdays()[$scope.tillDate.getDay() - 1].long + ", " + $scope.tillDate.getDate() + ". " + calUtils.getMonthName($scope.tillDate.getMonth()).long;
			};

			$scope.isLoading = function () {
				return $scope.loading;
			};


            $scope.loadMyReservations = function() {
				$scope.closeMsgBox = false;
                var today = new Date();
                var till = new Date();
                till.setDate(till.getDate() + 14);

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
				$scope.errMsg = undefined;
				$scope.successMsg = undefined;
			};

			$scope.getCurrentDate = function () {
				var date = new Date();
				return calUtils.getWeekdays()[date.getDay() - 1].long + ", " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).long;
			};

			$scope.isEmpty = function(obj) {
				return _.isEmpty(obj);
			};

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

            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                meetingsConfigService.configItem = $scope.appConfig.configItem;
            } else {
                $scope.appConfig.configItem = meetingsConfigService.configItem;
            }

			$scope.box.boxSize = $scope.appConfig.configItem.boxSize;

            $scope.$watch("appConfig.configItem.boxSize", function () {
                if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                    $scope.box.boxSize = $scope.appConfig.configItem.boxSize;
                }
            }, true);

			var refreshInterval = null;

			$scope.$on("$destroy", function(){
				if (refreshInterval != null) {
					$interval.cancel(refreshInterval);
				}
			});
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
