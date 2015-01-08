angular.module("app.worldClock").directive("app.worldClock.linearClock", ["lib.utils.calUtils", "$interval", "bridgeInBrowserNotification", "$modal", function(calUtils, $interval, bridgeInBrowserNotification, $modal) {
	var C_1_MINUTE = 60000;
	var C_10_SECONDS = 10000;
	var C_15_MINUTES = 15 * C_1_MINUTE;
	var incrementInterval;

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
			var dragInfo;

			function createTimeArray() {
				var timeArray = [];
				var now = getNowWithoutMinutesAndSeconds();
				for(var i = -12; i <= 12; i++) {
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

			function stopIncrementInterval() {
				if(incrementInterval !== undefined) {
					$interval.cancel(incrementInterval);
					incrementInterval = undefined;
				}
			}

			function incrementBy(value) {
				if(incrementInterval !== undefined) {
					return undefined;
				}

				var counter = 0;
				incrementInterval = $interval(function() {
					$scope.clockOffset += (value > 0 ? 2 : -2);
					if(dragInfo.active) {
						dragInfo.mouseDownEvent.clientX += (value > 0 ? 2 : -2);
					}
					counter += 2;
				}, 1, Math.abs(value) / 2);
				incrementInterval.then(function() {
					stopIncrementInterval();
					if(dragInfo.active && (dragInfo.mouseMoveEvent.clientX - $element.offset().left > $element.parent().width() * 3 / 4 || dragInfo.mouseMoveEvent.clientX - $element.offset().left < $element.parent().width() / 4)) {
						$scope.handleMouseMove(dragInfo.mouseMoveEvent);
					}
				});
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
				$scope.timeOffsetInMilliseconds = Math.abs(offset) >= 500 ? offset : 0;
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

			calculateNowFromOffset();
			calculateClockVariables();
			$interval(calculateNowFromOffset, C_10_SECONDS);

			var addedInTotal = 0;
			function checkEasterEgg() {
				if(Math.abs(addedInTotal) === 24) {
					bridgeInBrowserNotification.addAlert('info', 'Are you bored?', 10);
				}
				if(Math.abs(addedInTotal) === 50) {
					bridgeInBrowserNotification.addAlert('info', 'You can try, but it won\'t break.', 10);
				}
				if(Math.abs(addedInTotal) === 80) {
					bridgeInBrowserNotification.addAlert('info', 'You better stop, before you feel dizzy.', 10);
				}
				if(Math.abs(addedInTotal) === 110) {
					bridgeInBrowserNotification.addAlert('info', 'You could spend some time playing tetris! Just enter "tetris" into the search field.', 10);
				}
				if(Math.abs(addedInTotal) === 140) {
					bridgeInBrowserNotification.addAlert('info', 'Did you know "Spot the Odd"? It\'s another game app provided by bridge', 10);
				}
				if(Math.abs(addedInTotal) === 170) {
					$modal.open({templateUrl: "lib/asteroidsGame/asteroids.html"});
				}
			}

			function checkTimeArray() {
				if($scope.now !== undefined && $scope.timeArray[12].getHours() !== $scope.now.getHours()) {
					var adjusted = false;
					for(var i = 0; i < $scope.timeArray.length; i++) {
						if($scope.timeArray[i].getHours() === $scope.now.getHours() && $scope.timeArray[i].getDate() === $scope.now.getDate()) {
							var hoursDifference = Math.abs(i - 12);
							if(i > 12) {
								for(var j = 0; j < hoursDifference; j++) {
									var dateAdd = new Date($scope.timeArray[$scope.timeArray.length - 1]);
									dateAdd.setHours(dateAdd.getHours() + 1);
									$scope.timeArray.push(dateAdd);
									$scope.timeArray.splice(0, 1);


									$scope.clockOffset += $scope.oneHourWidth;
									$scope.cursorOffset += $scope.oneHourWidth;
									adjusted = true;
									addedInTotal++;
									checkEasterEgg();
								}
							} else if(i < 12) {
								for(var k = 0; k < hoursDifference; k++) {
									var dateSubstract = new Date($scope.timeArray[0]);
									dateSubstract.setHours(dateSubstract.getHours() - 1);
									$scope.timeArray.unshift(dateSubstract);
									$scope.timeArray.pop();


									$scope.clockOffset -= $scope.oneHourWidth;
									$scope.cursorOffset -= $scope.oneHourWidth;
									adjusted = true;
									addedInTotal--;
									checkEasterEgg();
								}
							}
							break;
						}
					}

					if(!adjusted) {
						createTimeArray();
						calculateClockVariables();
					}
				}
			}

			$scope.$watch("now", function() {
				calculateTimeOffsetInMillisecondsFromNowToActualTime();
				calculateCursorOffset();
				checkTimeArray();
			});

			//$interval(createTimeArray, C_10_MINUTES);

			function resetDragInfo() {
				dragInfo = {
					active: false,
					nowAtDragStart: null,
					clockOffsetAtStart: null,
					mouseDownEvent: null,
					mouseMoveEvent: null,
					dragDistance: 0
				};
			}
			resetDragInfo();

			function turnOffDragging() {
				stopIncrementInterval();
				resetDragInfo();
				if($scope.clockOffset - $scope.cursorOffset > $element.parent().width() - $scope.cursorWidth) {
					$scope.clockOffset -= $scope.clockOffset - $scope.cursorOffset - $element.parent().width() + ($scope.cursorWidth * 3);
				}
				if($scope.clockOffset - $scope.cursorOffset < $scope.cursorWidth) {
					$scope.clockOffset += Math.abs($scope.clockOffset - $scope.cursorOffset) + $scope.cursorWidth * 3;
				}
			}

			function calculateNowFrom($mouseEvent) {
				var distanceInPixel = $mouseEvent.clientX - dragInfo.mouseDownEvent.clientX;
				dragInfo.dragDistance = distanceInPixel;
				var distanceInMilliseconds = C_1_MINUTE * 60 * distanceInPixel / $scope.oneHourWidth;
				var forward = distanceInMilliseconds >= 0 ? true : false;
				var now = calUtils.addOffsetToDate(dragInfo.nowAtDragStart, distanceInMilliseconds);
				if(now.getTime() % C_15_MINUTES !== 0) {
					if(forward) {
						now = calUtils.addOffsetToDate(now, C_15_MINUTES - now.getTime() % C_15_MINUTES);
					} else {
						now = calUtils.addOffsetToDate(now, -now.getTime() % C_15_MINUTES);
					}
				}
				return now;
			}

			$scope.handleMouseDown = function($event) {
				dragInfo.active = true;
				dragInfo.nowAtDragStart = new Date($scope.now);
				dragInfo.mouseDownEvent = {clientX: $event.clientX};
				dragInfo.mouseMoveEvent = {clientX: $event.clientX};
				dragInfo.clockOffsetAtStart = $scope.clockOffset;
			};

			$scope.handleMouseMove = function($event) {
				if(dragInfo.active) {
					stopIncrementInterval();

					dragInfo.mouseMoveEvent = {clientX: $event.clientX};
					$scope.now = calculateNowFrom($event);
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
