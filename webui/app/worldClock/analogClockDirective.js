angular.module("app.worldClock").directive("app.worldClock.analogClock", ["lib.utils.calUtils", function(calUtils) {
	return {
		restrict: 'E',
		scope: {
			"width": "@",
			"height": "@",
			"timezoneOffset": "=",
			"locationName": "=",
			"clockIsPaused": "="
		},
		controller: function($scope, $interval) {
			function calculateRotation() {
				var timezoneOffset = $scope.timezoneOffset ? $scope.timezoneOffset : 0;
				$scope.now = calUtils.utcNowWithOffset(parseInt(timezoneOffset));
				$scope.hourRotation   = 360 * ($scope.now.getHours() * 60 + $scope.now.getMinutes()) / 60   / 12;
				$scope.minuteRotation = 360 * $scope.now.getMinutes() / 60;
				$scope.secondRotation = 360 * $scope.now.getSeconds() / 60;
			}

			function updateClock() {
				if(!$scope.clockIsPaused) {
					calculateRotation();
				}
			}
			$interval(updateClock, 1000);
			updateClock();

			$scope.getWeekday = calUtils.getWeekday;
			// console.log($scope.getWeekday(2, 1));

			$scope.useNDigits = calUtils.useNDigits;

			$scope.$watch("timezoneOffset", calculateRotation);
		},
		templateUrl: "app/worldClock/analogClockTemplate.html"
	};
}]);
