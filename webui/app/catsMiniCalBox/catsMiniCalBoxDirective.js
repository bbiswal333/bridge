angular.module("catsMiniCalBoxApp", ["utils", "cats"]).directive("catsminicalbox", function (calUtils, catsDataRequest) {
	var linkFn = function ($scope) {
		$scope.year = new Date().getFullYear();
		$scope.month = new Date().getMonth();
		$scope.calArray;
		$scope.state = "";		
		$scope.loading = true;
		$scope.weekdays = calUtils.getWeekdays();

		var data = catsDataRequest.getData(handleCatsData);

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
		} 

		$scope.prevMonth = function () {
			if ($scope.month == 0) {
				$scope.month = 11;
				$scope.year--;
			}
			else {
				$scope.month--;
			}

			reload();
		};

		$scope.nextMonth = function () {
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
			$scope.currentMonth = calUtils.getMonthName($scope.month).long + " " + $scope.year;
			$scope.loading = false;
		}
	};

	function processCatsData (cats_o) {
		try {
			var processed = {};
			var days = cats_o["asx:abap"]["asx:values"][0].CATSCHK[0].ZCATSCHK_STR;

			for (var i = 0; i < days.length; i++) {
				var dateStr = days[i].DATEFROM[0];
				var statusStr = days[i].STATUS[0];
				
				var time = parseDateToTime(dateStr);
				if (time != null) {
					processed[time] = {state: statusStr};
				}
			}

			console.log(processed);

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
		scope: false,
		templateUrl: "catsMiniCalBoxTemplate.html",
		replace: true,
		link: linkFn
	};
});