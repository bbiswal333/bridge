angular.module("app.cats")
	.directive("app.cats.calendar", 
		["lib.utils.calUtils", 
		 "app.cats.data.catsUtils", 
		 "$interval", 
		 "$location", 
		 "bridgeDataService",
		 "app.cats.monthlyData",
		 "bridgeInBrowserNotification",
	function (calUtils, catsUtils, $interval, $location, bridgeDataService, monthlyDataService, bridgeInBrowserNotification) {
		var linkFn = function ($scope) {
			var monthRelative = 0;

			$scope.bridgeSettings = bridgeDataService.getBridgeSettings();

			$scope.year = new Date().getFullYear();
			$scope.month = new Date().getMonth();
			$scope.currentMonth = "";
			$scope.calArray;
			$scope.state = "";
			$scope.loading = true;
			$scope.hasError = false;
			$scope.weekdays = calUtils.getWeekdays();
			$scope.dayClass = $scope.dayClassInput || 'app-cats-day';
			$scope.calUtils = calUtils;
			
			var selectedDates = $scope.selectedDates;
			var data = catsUtils.getCatsComplianceData(handleCatsData);

			$scope.getDescForState = function (state_s) {
				return catsUtils.getDescForState(state_s);
			};

			function handleCatsData(data) {
				if (data != null) {
					var additionalData = processCatsData(data);
					if (additionalData != null) {
						calUtils.addAdditionalData(additionalData);
						reload();
						$scope.state = "CATS-Data received and processed";
					}
					else {
						$scope.state = "CATS-Data received from ISP but during processing an error occurred";
						$scope.hasError = true;
					}
				}
				else {
					$scope.state = "CATS-Data could no be retrieved from system ISP";
					$scope.hasError = true;
				}
			}

			$scope.jump = function (dayString, event) {
				
				var range_click = event.shiftKey;
				var multi_click = (event.ctrlKey || event.metaKey) && !range_click;
				var single_click = !range_click && !multi_click;			

				console.log("RANGE:" + range_click);
				console.log("MULTI:" + multi_click);
				console.log("SINGLE:" + single_click);				

				if (single_click) {
					$location.path("/detail/cats/" + dayString);
				} else if (multi_click) {
					selectRange([monthlyDataService.days[dayString]]);
				} else if (range_click) {
					selectRange(collectRange(dayString));
				}
			};

			$scope.selectWeek = function (index) {
				var week = $scope.calArray[index];
				var range = [];
				week.forEach(function(day){
					if (day.inMonth) {
						range.push(day);
					};
				})
				selectRange(range);
			};

			$scope.weekIsSelected = function(index){
				var week = $scope.calArray[index];
				var allSelected = true;
				var weekIsSelectable = false;
				week.some(function(calDay){
					if (calDay.inMonth && isSelectable(calDay)) {
						weekIsSelectable = true;
						if (!$scope.isSelected(calDay.dayString)) {
							allSelected = false;
							return false;
						};
					};
				});

				if (weekIsSelectable && allSelected) 
					return true;
				else
					return false;
			};

			function collectRange(dayString) {
				var range = [];
				var lastDate = calUtils.parseDate($scope.selectedDates[$scope.selectedDates.length - 1]);
				var selectedDate = calUtils.parseDate(dayString);

				if(!lastDate || lastDate == false) {
					lastDate = selectedDate;
				}

				function collectDates(a, b){
					var dateStrings = [];

					if (a < b) {
						var first = a;
						var last = b;
					} else {
						var first = b;
						var last = a;
					}

					while(first.getTime() != last.getTime()){
						dateStrings.push(calUtils.stringifyDate(first));
						first.setDate(first.getDate() + 1);
					}
					dateStrings.push(calUtils.stringifyDate(first));

					return dateStrings;
				}

				collectDates(lastDate, selectedDate).forEach(function(dateString){
					range.push(monthlyDataService.days[dateString]);
				})

				return range;
			}

			function isSelectOperation(daysArray){
				var hasSelectableDay = false;
				var hasSelectedDays  = false;
				daysArray.forEach(function(calDay){
					if(!$scope.isSelected(calDay.dayString) &&
					   isSelectable(calDay) &&
					   !hasVacationTask(monthlyDataService.days[calDay.dayString])) {
						hasSelectableDay = true;
					}
					if($scope.isSelected(calDay.dayString)) {
						hasSelectedDays = true;
					}
				});
				if(hasSelectableDay || (!hasSelectableDay && !hasSelectedDays)) {
					return true;
				}
				return false;
			}

			function selectRange(daysArray){
				var toSelect = getUnselectedDays(daysArray);
				if (toSelect && toSelect.length > 0) {
					toSelect.forEach(function(calDay){
						selectDay(calDay);
					})
				} else {
					daysArray.forEach(function(calDay){
						unSelectDay(calDay);
					});
				}
				if(containsVacationDay(daysArray) && isSelectOperation(daysArray)) {
					bridgeInBrowserNotification.addAlert('info', 'Days with vacation can not be selected.');
				}
			}

			function selectDay(calDay) {
				var dayString = calDay.dayString;
				monthlyDataService.getDataForDate(dayString).then(function(){
					if (isSelectable(calDay)) {
						var ok = $scope.onDateSelected({dayString: dayString});
					};
				})
			}

			function unSelectDay(calDay) {
				var dayString = calDay.dayString;
				monthlyDataService.getDataForDate(dayString).then(function(){
					if ($scope.isSelected(dayString)) {
						var ok = $scope.onDateDeselected({dayString: dayString});
					}
				})
			}

			function isSelectable(calDay){
				if (monthlyDataService.days[calDay.dayString] &&
					monthlyDataService.days[calDay.dayString].targetHours > 0 &&
					!hasVacationTask(monthlyDataService.days[calDay.dayString])) {
					return true;
				}
				return false;
			}

			$scope.isSelected = function(dayString){
				if (!selectedDates)
					return false;
				return selectedDates.indexOf(dayString)!=-1;
			}

			function hasVacationTask(day){
				var hasVacationTask = false;
				day.tasks.forEach(function(task){
					if (task.TASKTYPE === "VACA") {
						hasVacationTask = true;
					};
				})
				return hasVacationTask;
			}

			function containsVacationDay(daysArray){
   				var containsVacationDay = false;
				daysArray.forEach(function(calDay){
					if(hasVacationTask(monthlyDataService.days[calDay.dayString])) {
						containsVacationDay = true;
					}
				});
				return containsVacationDay;
			}

			function getUnselectedDays(daysArray){
				var unselected = [];
				daysArray.forEach(function(day){
					if (isSelectable(day) && !$scope.isSelected(day.dayString)) {
						unselected.push(day);
					};
				});	
				return unselected;
			}

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

			function reload() {
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

			$scope.$on("$destroy", function () {
				if (refreshInterval != null) {
					$interval.cancel(refreshInterval);
				}
			});

			(function springGun() {
				var dateLastRun = new Date().getDate();

				refreshInterval = $interval(function () {
					if (dateLastRun != new Date().getDate()) {
						catsUtils.getData(handleCatsData);
					}
				}, 3 * 3600000);
			})();

			$scope.$on("refreshAppReceived", function () {
				catsUtils.getCatsComplianceData(handleCatsData, true);
				//catsUtils.getData(handleCatsData);
			});
		};

		function processCatsData(cats_o) {
			try {
				var processed = {};
				var days = cats_o;

				for (var i = 0; i < days.length; i++) {
					var dateStr = days[i].DATEFROM;
					var statusStr = days[i].STATUS;

					var time = parseDateToTime(dateStr);
					if (time != null) {
						processed[time] = { state: statusStr };
					}
				}

				return processed;
			} catch (error) {
				return null;
			}

			function parseDateToTime(date_s) {
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
			templateUrl: "app/cats/cats.calendar.html",
			replace: true,
			link: linkFn,
			scope: {
				selectedDay: '=selectedDay',
				selectedDates: '=selectedDates',
				onDateSelected: "&ondateselected",
				onDateDeselected: "&ondatedeselected",
				dayClassInput: '@dayClass',
				maintainable: '=',
			}
		};
	}]);