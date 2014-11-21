angular.module("app.worldClock").directive("app.worldClock.linearClock", ["lib.utils.calUtils", "$interval", function(calUtils, $interval) {
	var C_1_MINUTE = 60000;
	var C_10_SECONDS = 10000;
	var C_15_MINUTES = 15 * C_1_MINUTE;

	function getNowWithoutMinutesAndSeconds() {
		var now = calUtils.now();
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		return now;
	}

	return {
		restrict: 'E',
		scope: {
			"timeOffsetInMilliseconds": "="
		},
		controller: function($scope, $element) {
			function createTimeArray() {
				var timeArray = [];
				var now = getNowWithoutMinutesAndSeconds();
				for(var i = -24; i <= 24; i++) {
					var date = new Date(now);
					date.setHours(date.getHours() + i);
					timeArray.push(date);
				}
				$scope.timeArray = timeArray;
			}

			function calculateNowFromOffset() {
				$scope.now = calUtils.utcNowWithOffset($scope.timeOffsetInMilliseconds);
			}

			function getDiffBetweenNowAndStartOfClockInMilliseconds() {
				return $scope.timeArray[0] - $scope.now;
			}

			var incrementInterval;

			var dragX = 0;
			function incrementBy(value) {
				if(incrementInterval !== undefined) {
					return;
				}

				var counter = 0;
				incrementInterval = $interval(function() {
					$scope.clockOffset += (value > 0 ? 2 : -2);
					dragX += (value > 0 ? 2 : -2);
					counter += 2;
					if(counter >= Math.abs(value)) {
						$interval.cancel(incrementInterval);
						incrementInterval = undefined;
					}
				}, 1);
			}

			function calculateCursorOffset() {
				$scope.cursorOffset = Math.round(getDiffBetweenNowAndStartOfClockInMilliseconds() * $scope.oneHourWidth / (C_1_MINUTE * 60) + Math.ceil($scope.cursorWidth / 2));
				if(Math.abs($scope.cursorOffset + ($element.children().width() / 2) - $scope.clockOffset) > ($scope.oneHourWidth * 1.5)) {
					var offsetAdd = (($scope.cursorOffset + ($element.children().width() / 2) - $scope.clockOffset) > 0 ? 1.5 : -1.5) * $scope.oneHourWidth;
					incrementBy(offsetAdd);
				}
			}

			function calculateClockOffset() {
				$scope.clockOffset = Math.round(getDiffBetweenNowAndStartOfClockInMilliseconds() * $scope.oneHourWidth / (C_1_MINUTE * 60) + Math.ceil($scope.cursorWidth / 2) + ($element.children().width() / 2));
			}

			function calculateTimeOffsetInMillisecondsFromNowToActualTime() {
				var offset = $scope.now - calUtils.now();
				$scope.timeOffsetInMilliseconds = Math.abs(offset) >= 5 ? offset : 0;
			}

			function calculateClockVariables() {
				calculateTimeOffsetInMillisecondsFromNowToActualTime();
				calculateCursorOffset();
				calculateClockOffset();
			}

			$scope.cursorOffset = 0;
			$scope.oneHourWidth = 80;
			createTimeArray();
			$scope.useNDigits = calUtils.useNDigits;
			$scope.textOffset = -15;
			$scope.cursorWidth = 15;

			$interval(calculateNowFromOffset, C_10_SECONDS);
			calculateNowFromOffset();
			calculateClockVariables();

			$scope.$watch("now", function() {
				calculateTimeOffsetInMillisecondsFromNowToActualTime();
				calculateCursorOffset();
			});

			//$interval(createTimeArray, C_10_MINUTES);

			var dragXDistance = 0;
			var dragActive = false;
			var dragStartedNow = null;

			function turnOffDragging() {
				dragStartedNow = null;
				dragActive = false;
				dragXDistance = 0;
				dragX = 0;
			}

			function calculateNowFromDragDistance(distanceInPixel, foward) {
				var distanceInMilliseconds = C_1_MINUTE * 60 * distanceInPixel / $scope.oneHourWidth;
				var now = calUtils.addOffsetToDate(dragStartedNow, distanceInMilliseconds);
				if(now.getTime() % C_15_MINUTES !== 0) {
					if(foward) {
						now = calUtils.addOffsetToDate(now, C_15_MINUTES - now.getTime() % C_15_MINUTES);
					} else {
						now = calUtils.addOffsetToDate(now, -now.getTime() % C_15_MINUTES);
					}
				}
				return now;
			}

			$scope.handleMouseDown = function($event) {
				dragActive = true;
				dragStartedNow = new Date($scope.now);
				dragX = $event.clientX;
			};

			$scope.handleMouseMove = function($event) {
				if(dragActive) {
					dragXDistance = $event.clientX - dragX;
					$scope.now = calculateNowFromDragDistance(dragXDistance, (dragXDistance >= 0 ? true : false));
				}
			};

			$scope.handleMouseUp = function() {
				turnOffDragging();
			};

			$scope.handleMouseLeave = function() {
				turnOffDragging();
			};

			$scope.clearTimeOffset = function() {
				$scope.now = calUtils.now();
				calculateClockOffset();
				calculateClockVariables();
			};
		},
		templateUrl: "app/worldClock/linearClockTemplate.html"
	};
}]);
