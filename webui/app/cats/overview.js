angular.module("app.cats", ["lib.utils", "app.cats.data", "ngRoute"]).directive("app.cats.calendar", ["lib.utils.calUtils", "app.cats.data.catsUtils", "$interval", "$location", "bridgeCounter",
	function (calUtils, catsUtils, $interval, $location, bridgeCounter) {
	var linkFn = function ($scope) {
		var monthRelative = 0;

		$scope.boxTitle = "CATS Compliance";
		$scope.boxIcon = '&#xe81c;';
		$scope.boxNeedsClient = false;
		//$scope.customCSSFile = "app/cats/style.css"; //Not needed anymore, included in index.html because also needed in detail screen


		$scope.year = new Date().getFullYear();
		$scope.month = new Date().getMonth();
		$scope.currentMonth = "";
		$scope.calArray;
		$scope.state = "";
		$scope.loading = true;
		$scope.weekdays = calUtils.getWeekdays();
		$scope.dayClass = $scope.dayClassInput || 'app-cats-day';
	    //bridgeCounter.CollectWebStats('CATS', 'APPLOAD');
    
        $scope.getDescForState = function (state_s) {
			return catsUtils.getDescForState(state_s);
		};

		var data = catsUtils.getCatsComplianceData(handleCatsData);

		function handleCatsData (data) {
			if (data != null) {
				var additionalData = processCatsData(data);
				if (additionalData != null) {
					calUtils.addAdditionalData(additionalData);
					reload();
					$scope.state = "CATS-Data received and processed";
				}
				else {
					$scope.state = "CATS-Data received but during processing an error occurred";
				}
			}
			else {
				$scope.state = "CATS-Data could no be retrieved from system";
			}			

			console.log($scope.state);
		} 

		$scope.jump = function (dayString) {
			$location.path("/detail/cats/" + dayString);
		};

		$scope.canGoBackward = function () {
			if (monthRelative - 1 < -3) { //Go back a maximum of three month (so displays four months alltogether)
				return false;
			}

			return true;
		};

		$scope.prevMonth = function () {
			if (!$scope.canGoBackward()) {
				return;
			}
			monthRelative--;

			if ($scope.month == 0) {
				$scope.month = 11;
				$scope.year--;
			}
			else {
				$scope.month--;
			}

			reload();
		};

		$scope.canGoForward = function () {
			if (monthRelative + 1 > 0) { //Go back a maximum of four month
				return false;
			}

			return true;
		};


		$scope.nextMonth = function () {
			if (!$scope.canGoForward()) {
				return;
			}
			monthRelative++;

			if ($scope.month == 11) {
				$scope.month = 0;
				$scope.year++;
			}
			else {
				$scope.month++;
			}

			reload();
		};

		$scope.reloadCalendar = function () {
			reload();
		};	

		function reload () {
			$scope.loading = true;

			$scope.calArray = calUtils.buildCalendarArray($scope.year, $scope.month);
			$scope.currentMonth = calUtils.getMonthName($scope.month).long;

			$scope.loading = false;
		}

		var refreshInterval = null;

		if ($scope.selectedDay) {
		    while (new Date($scope.selectedDay).getMonth() != $scope.month) {
		        $scope.prevMonth();
		    }
		}

		$scope.$on("$destroy", function(){
			if (refreshInterval != null) {
				$interval.cancel(refreshInterval);
			}
		});

		(function springGun () {
			var dateLastRun = new Date().getDate();

			refreshInterval = $interval(function () {
				if (dateLastRun != new Date().getDate()) {
					catsUtils.getData(handleCatsData);
				}
			}, 3 * 3600000);
		})();
	};

	function processCatsData (cats_o) {
		try {
			var processed = {};
			var days = cats_o;

			for (var i = 0; i < days.length; i++) {
				var dateStr = days[i].DATEFROM;
				var statusStr = days[i].STATUS;
				
				var time = parseDateToTime(dateStr);
				if (time != null) {
					processed[time] = {state: statusStr};
				}
			}

			return processed;
		} catch (error) {
			return null;
		}

		function parseDateToTime (date_s) {
			if (date_s.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) == -1) { //Checks for pattern: YYYY-MM-DD
				return null;
			}

			var year = date_s.substr(0, 4);
			var month = date_s.substr(5, 2) - 1;
			var day = date_s.substr(8, 2);

			return new Date(year, month, day).getTime();
		}
	}

	return {
		restrict: "E",
		templateUrl: "app/cats/overview.html",
		replace: true,
		link: linkFn,
		scope: {
            selectedDay: '=selectedDay',
            dayClassInput: '@dayClass',
		}
	};
}]);