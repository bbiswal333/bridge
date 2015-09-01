angular.module("app.cats")
	.directive("app.cats.calendar",
		["lib.utils.calUtils",
		 "app.cats.cat2BackendZDEVDB",
		 "app.cats.catsUtils",
		 "$interval",
		 "$location",
		 "bridgeDataService",
		 "app.cats.monthlyData",
		 "bridgeInBrowserNotification",
		 "$q",
		 "$log",
		 "$window",
		 "$timeout",
	function (calUtils, catsBackend, catsUtils, $interval, $location, bridgeDataService, monthlyDataService, bridgeInBrowserNotification, $q, $log, $window, $timeout) {
		function processCatsData(cats_o) {
			function parseDateToTime(date_s) {
				if (date_s.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) === -1) { //Checks for pattern: YYYY-MM-DD
					return null;
				}

				var year = date_s.substr(0, 4);
				var month = date_s.substr(5, 2) - 1;
				var day = date_s.substr(8, 2);

				return new Date(year, month, day).getTime();
			}

			try {
				var processed = {};
				var days = cats_o;

				for (var i = 0; i < days.length; i++) {
					var dateStr = days[i].DATEFROM;
					var statusStr = days[i].STATUS;
					var time = parseDateToTime(dateStr);

					// special handling for popular frensh part time contract days
					if (days[i].STATUS === "Y" && days[i].QUANTITYH === 7.9 && days[i].STDAZ === 8.2 && days[i].CONVERT_H_T === 7.9) {
						statusStr = "G";
						days[i].STATUS = "G";
					}
					// special handling for overbooked days
					if (days[i].STATUS === "Y" && days[i].QUANTITYH > Math.round(days[i].STDAZ * 8 / days[i].CONVERT_H_T * 1000) / 1000) {
						statusStr = "OVERBOOKED";
						days[i].STATUS = "OVERBOOKED";
					}
					if (days[i].STATUS === "R" && (time > new Date().getTime())) {
						statusStr = "R_INTHEFUTURE";
						days[i].STATUS = "R_INTHEFUTURE";
					}
					if (days[i].STATUS === "Y" && (time > new Date().getTime())) {
						statusStr = "Y_INTHEFUTURE_part_maint";
						days[i].STATUS = "Y_INTHEFUTURE_part_maint";
					}
					if (time !== null) {
						processed[time] = { state: statusStr };
					}
				}
				return processed;
			} catch(err) {
				$log.log("parseDateToTime(): " + err);
				return null;
			}
		}

		function monthDiff(d1, d2) {
			var months;
			months = (d2.getFullYear() - d1.getFullYear()) * 12;
			months -= d1.getMonth();
			months += d2.getMonth();
			return months;
		}

		var linkFn = function ($scope) {
			$scope.bridgeSettings = bridgeDataService.getBridgeSettings();

			$scope.year = monthlyDataService.year;
			if (!angular.isNumber($scope.year)) {
				monthlyDataService.year = new Date().getFullYear();
				$scope.year = monthlyDataService.year;
			}
			$scope.month = monthlyDataService.month;
			if (!angular.isNumber($scope.month)) {
				monthlyDataService.month = new Date().getMonth();
				$scope.month = monthlyDataService.month;
			}
			$scope.currentMonth = "";
			$scope.calArray = [];
			$scope.loading = true;
			$scope.hasError = false;
			$scope.state = "";
			$scope.weekdays = calUtils.getWeekdays();
			$scope.dayClass = $scope.dayClassInput || 'app-cats-day';
			$scope.calUtils = calUtils;
			$scope.analytics = {};
			$scope.width = 80;

			function adjustBarSize() {
				$scope.$apply(function(){
					$scope.width = $window.document.getElementById('inner').offsetWidth;
					if ($scope.width > 80) {
						$scope.width = 80;
					}
					$scope.width = parseInt($scope.width || 80);
				});
			}

			/* eslint-disable no-undef */
			$(window).resize(adjustBarSize);
			$scope.$on("$destroy", function(){
				$(window).off('resize', adjustBarSize);
			});
			/* eslint-enable no-undef */

			var monthRelative = monthDiff(new Date(),new Date(monthlyDataService.year,monthlyDataService.month));
			var rangeSelectionStartDayString = null;
			var rangeSelectionEndDayString = null;
			var daysElements = [];

			$scope.getDescForState = function (state_s) {
				if (state_s !== undefined) {
					return catsUtils.getDescForState(state_s);
				}
			};

			function setISPErrorText(errorText) {
				$scope.hasError = true;
				if (errorText) {
					$scope.state = errorText;
				} else {
					$scope.state = "Oops! Sorry, the CAT2 backend system ISP seems to be unresponsive/ unavailable. Please try again later.";
				}
			}

			function reload() {
				$scope.loading = true;
				$scope.calArray = calUtils.buildCalendarArray(monthlyDataService.year, monthlyDataService.month, $scope.sundayweekstart);
				$scope.currentMonth = calUtils.getMonthName(monthlyDataService.month).long;
				if ($scope.maintainable) {
					monthlyDataService.calArray = $scope.calArray;
					monthlyDataService.getDataForDate(calUtils.stringifyDate(new Date(monthlyDataService.year, monthlyDataService.month, 15)))
					.then(function(){
						$scope.analyticsDays = monthlyDataService.days;
					},
					function(data) {
						if (monthlyDataService.reloadInProgress.error) {
							setISPErrorText(data);
						}
					});
				}
				$scope.loading = false;
			}

			function handleCatsData(data) {
				if (data !== null && data !== undefined) {
					var additionalData = processCatsData(data);
					if (additionalData !== null) {
						calUtils.addAdditionalData(additionalData);
						reload();
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

			function isMaintainable (dayString){
				var day = monthlyDataService.days[dayString];
				var targetTimeInPercentageOfDay = day.targetTimeInPercentageOfDay;
				day.tasks.forEach(function(task){
					if (catsUtils.isFixedTask(task)) {
						targetTimeInPercentageOfDay = targetTimeInPercentageOfDay - task.QUANTITY_DAY;
					}
				});
				if (targetTimeInPercentageOfDay > 0) {
					return true;
				} else {
					return false;
				}
			}

			function getDaysElements (element){
				if (!daysElements || daysElements.indexOf(element) === -1) {
					daysElements = [];
					var elements = $(element).parents(".app-cats-calendar").children();
					for (var i = 0; i < elements.length; i++) {
						var days = $(elements[i]).children();
						for (var j = 0; j < days.length; j++) {
							if (days[j].id === "calendarDay") {
								daysElements.push(days[j]);
							}
						}
					}
				}

				return daysElements;
			}

			$scope.navigate = function(dayString, event){
				var originDate = calUtils.parseDate(dayString);
				var targetDate = new Date();
				var currentElement = event.target;
				// in IE event.target is one element too deep
				if (currentElement.parentElement.id === "calendarDay") {
					currentElement = currentElement.parentElement;
				}
				var nextElement = null;

				switch (event.keyCode) {
					case 37: //left
						daysElements = getDaysElements(currentElement);
						targetDate.setDate(originDate.getDate() - 1);
						nextElement = daysElements[daysElements.indexOf(currentElement) - 1];
						break;
					case 38: //up
						daysElements = getDaysElements(currentElement);
						targetDate.setDate(originDate.getDate() - 7);
						nextElement = daysElements[daysElements.indexOf(currentElement) - 7];
						break;
					case 39: //right
						daysElements = getDaysElements(currentElement);
						targetDate.setDate(originDate.getDate() + 1);
						nextElement = daysElements[daysElements.indexOf(currentElement) + 1];
						break;
					case 40: //down
						daysElements = getDaysElements(currentElement);
						targetDate.setDate(originDate.getDate() + 7);
						nextElement = daysElements[daysElements.indexOf(currentElement) + 7];
						break;
					case 9:
						$log.log("tab");
						nextElement = angular.element($window.document.querySelector( '#filter-bar input' ));
						nextElement.focus();
						return;
					default:
						return;
				}

				if (nextElement){
					$window.setTimeout(function() { nextElement.focus(); }, 100);
				}

				if (originDate.getMonth() === targetDate.getMonth()) {
					$scope.jump(calUtils.stringifyDate(targetDate), event);
				}
			};

			function selectDay(dayString) {
				var deferred = $q.defer();

				monthlyDataService.getDataForDate(dayString)
				.then(function(){
					if (monthlyDataService.days[dayString] &&
						monthlyDataService.days[dayString].targetHours > 0) {
						$scope.onDateSelected({dayString: dayString});
					}
					deferred.resolve();
				}, setISPErrorText);
				return deferred.promise;
			}

			function unSelectDay(dayString) {
				var deferred = $q.defer();

				monthlyDataService.getDataForDate(dayString)
				.then(function(){
					if ($scope.isSelected(dayString)) {
						$scope.onDateDeselected({dayString: dayString});
					}
					deferred.resolve();
				}, setISPErrorText);
				return deferred.promise;
			}

			$scope.selectSingleDay = function (dayString, toggle) {
				if (dayString && isMaintainable(dayString)) {
					if (toggle && $scope.isSelected(dayString)){
						return unSelectDay(dayString);
					}
					else{
						return selectDay(dayString);
					}
				}
			};

			function unSelectRange(daysStringsArray){
				var promises = [];

				daysStringsArray.forEach(function(dayString){
					promises.push(unSelectDay(dayString));
				});
				return promises;
			}

			function clearSelectionFromDaysWithFixedTasks()  {
				$scope.selectedDates.forEach(function(selectedDayString){
					if (!isMaintainable(selectedDayString)) {
						unSelectDay(selectedDayString);
					}
				});
			}

			function selectRange(daysStringsArray){
				var promises = [];

				if (!daysStringsArray) {
					return null;
				}

				daysStringsArray.forEach(function(dayString){
					promises.push($scope.selectSingleDay(dayString));
				});

				// clear incorrect selections like vacation or weekend days...
				clearSelectionFromDaysWithFixedTasks();

				return promises;
			}

			function isSelectable(dayString){
				if (monthlyDataService.days[dayString] &&
					monthlyDataService.days[dayString].targetHours > 0 &&
					isMaintainable(dayString)) {
					return true;
				}
				return false;
			}

			function getCalArrayOfWeekByIndex(index) {
				var arrayForWeek = angular.copy($scope.calArray[index]);
				arrayForWeek.splice(6,1);
				if (index > 0) {
					arrayForWeek.unshift($scope.calArray[index - 1][6]);
				}
				return arrayForWeek;
			}

			$scope.isSelected = function(dayString){
				if (!$scope.selectedDates){
					return false;
				}
				return $scope.selectedDates.indexOf(dayString) !== -1;
			};

			$scope.rangeIsSelectable = function(calArray){
				var rangeIsSelectable = false;
				calArray.some(function(calDay){
					if (calDay.inMonth && isSelectable(calDay.dayString)) {
						rangeIsSelectable = true;
					}
				});
				return rangeIsSelectable;
			};

			$scope.rangeIsSelected = function(calArray){
				var allSelected = true;
				var rangeIsSelectable = false;
				calArray.some(function(calDay){
					if (calDay.inMonth && isSelectable(calDay.dayString)) {
						rangeIsSelectable = true;
						if (!$scope.isSelected(calDay.dayString)) {
							allSelected = false;
							return false;
						}
					}
				});

				if (rangeIsSelectable && allSelected) {
					return true;
				}
				else{
					return false;
				}
			};

			$scope.weekIsSelected = function(index){
				return $scope.rangeIsSelected(getCalArrayOfWeekByIndex(index));
			};

			$scope.weekIsSelectable = function(index){
				return $scope.rangeIsSelectable(getCalArrayOfWeekByIndex(index));
			};

			function getCalArrayForMonth() {
				var calArrayForMonth = [];
				$scope.calArray.forEach(function(week){
					week.forEach(function(calDay) {
						if (calDay.inMonth) {
							calArrayForMonth.push(calDay);
						}
					});
				});
				return calArrayForMonth;
			}

			$scope.monthIsSelected = function(){
				return $scope.rangeIsSelected(getCalArrayForMonth());
			};

			function setRangeDays (startDate, endDate){
				rangeSelectionStartDayString = startDate;
				rangeSelectionEndDayString = endDate;
			}

			function collectRange(dayString) {

				if (!rangeSelectionStartDayString) {
					var firstOfSelectedMonth = dayString.substr(0,8) + "01";
					setRangeDays(dayString, firstOfSelectedMonth);
				}
				else
				{
					rangeSelectionEndDayString = dayString;
				}
				var range = [];
				var startDate = calUtils.parseDate(rangeSelectionStartDayString);
				var endDate = calUtils.parseDate(rangeSelectionEndDayString);

				function collectDates(a, b){
					var dateStrings = [];

					var first = a < b ? a : b;
					var last = a < b ? b : a;

					while(first.getTime() !== last.getTime()){
						dateStrings.push(calUtils.stringifyDate(first));
						first.setDate(first.getDate() + 1);
					}
					dateStrings.push(calUtils.stringifyDate(first));

					return dateStrings;
				}

				collectDates(startDate, endDate).forEach(function(dateString){
					range.push(dateString);
				});

				return range;
			}

			$scope.toggleWeek = function (index) {
				var promises = [];
				var week = getCalArrayOfWeekByIndex(index);
				var range = [];
				$scope.analytics.value = false;
				week.forEach(function(day){
					if (day.inMonth) {
						range.push(day.dayString);
					}
				});

				if ($scope.weekIsSelected(index)){
					promises = unSelectRange(range);
				}
				else{
					promises = selectRange(range);
				}

				$q.all(promises)
				.then(function(){
					if ($scope.selectedDates && $scope.selectedDates.length > 0) {
						monthlyDataService.lastSingleClickDayString = $scope.selectedDates[0];
					}
					$scope.selectionCompleted();
				}, setISPErrorText);
			};

			$scope.toggleMonth = function () {
				var promise = null;
				var promises = [];
				$scope.analytics.value = false;
				if (angular.isNumber($scope.year) && angular.isNumber($scope.month)) {
					var firstOfMonthDayString = calUtils.stringifyDate(new Date($scope.year, $scope.month));
					var lastOfMonthDayString = calUtils.stringifyDate(new Date($scope.year, $scope.month + 1, 0));

					// load data, in case it is not yet done
					monthlyDataService.getDataForDate(firstOfMonthDayString)
					.then(function() {
						monthlyDataService.lastSingleClickDayString = '';
						setRangeDays(firstOfMonthDayString, lastOfMonthDayString);
						if ($scope.monthIsSelected()) {
							promises.push(unSelectRange(collectRange(lastOfMonthDayString)));
						} else {
							promises.push(selectRange(collectRange(lastOfMonthDayString)));
						}
						promise = $q.all(promises);
						promise
						.then(function(){
							if ($scope.selectedDates && $scope.selectedDates.length > 0) {
								monthlyDataService.lastSingleClickDayString = $scope.selectedDates[0];
							}
							$scope.selectionCompleted();
						}, setISPErrorText);
					}, setISPErrorText);
				}
			};

			$scope.jump = function (dayString, event) {

				if (monthlyDataService.reloadInProgress.value === true) {
					return;
				}

				var range_click = event.shiftKey;
				var multi_click = (event.ctrlKey || event.metaKey) && !range_click;
				var single_click = !range_click && !multi_click;
				var promise = null;
				var promises = [];
				$scope.analytics.value = false;

				if (single_click) {
					monthlyDataService.lastSingleClickDayString = dayString;
					//unselectOthers
					if ($scope.selectedDates) {
						$scope.selectedDates.forEach(function(selectedDayString){
							promises.push(unSelectDay(selectedDayString));
						});
					}
					promises.push(selectDay(dayString));
					setRangeDays(dayString, null);

					if (event.originalEvent) {
						$location.path("/detail/cats/");
					}

				} else if (multi_click) {
					promises.push($scope.selectSingleDay(dayString, true));

					if (isMaintainable(dayString)) {
						setRangeDays(dayString, null);
						clearSelectionFromDaysWithFixedTasks();
					}
				} else if (range_click) {
					if (rangeSelectionEndDayString) {
						promises.push(unSelectRange(collectRange(rangeSelectionEndDayString)));
					}
					promises.push(selectRange(collectRange(dayString)));
				}

				promise = $q.all(promises);
				promise
				.then(function(){
					if (!$scope.isSelected(monthlyDataService.lastSingleClickDayString) && $scope.selectedDates && $scope.selectedDates.length > 0) {
						monthlyDataService.lastSingleClickDayString = $scope.selectedDates[0];
					}
					$scope.selectionCompleted();
				}, setISPErrorText);
			};

			function unSelectAllDays() {
				var promise = null;
				var promises = [];
				if ($scope.selectedDates) {
					$scope.selectedDates.forEach(function(selectedDayString){
						promises.push(unSelectDay(selectedDayString));
					});
				}
				promise = $q.all(promises);
				promise.
				then(function(){
					monthlyDataService.lastSingleClickDayString = '';
					setRangeDays(null, null);
					$scope.selectionCompleted();
				}, setISPErrorText);
			}

			$scope.canGoBackward = function () {
				if (monthRelative - 1 < -6) { // Maximum number of month to go back
					return false;
				}
				return true;
			};

			function prevMonth(structureContainingYearAndMonth) {
				var data = {};
				data.year = angular.copy(structureContainingYearAndMonth.year);
				data.month = angular.copy(structureContainingYearAndMonth.month);
				if (data.month === 0) {
					data.month = 11;
					data.year--;
				}
				else {
					data.month--;
				}
				return data;
			}

			$scope.prevMonth = function () {
				if (!$scope.canGoBackward()) {
					return;
				}
				monthRelative--;
				monthlyDataService.year = prevMonth(monthlyDataService).year;
				monthlyDataService.month = prevMonth(monthlyDataService).month;
				$scope.year = monthlyDataService.year;
				$scope.month = monthlyDataService.month;
				unSelectAllDays();

				$scope.state = "";
				$scope.hasError = false;
				catsBackend.getCAT2ComplianceData4OneMonth(monthlyDataService.year, monthlyDataService.month, true)
				.then( handleCatsData, setISPErrorText);
			};

			$scope.canGoForward = function () {
				if (monthRelative + 1 > 1) { // Maximum number of month to go forward
					return false;
				}
				return true;
			};

			function nextMonth(structureContainingYearAndMonth) {
				var data = {};
				data.year = angular.copy(structureContainingYearAndMonth.year);
				data.month = angular.copy(structureContainingYearAndMonth.month);
				if (data.month === 11) {
					data.month = 0;
					data.year++;
				}
				else {
					data.month++;
				}
				return data;
			}

			$scope.nextMonth = function () {
				if (!$scope.canGoForward()) {
					return;
				}
				monthRelative++;
				monthlyDataService.year = nextMonth(monthlyDataService).year;
				monthlyDataService.month = nextMonth(monthlyDataService).month;
				$scope.year = monthlyDataService.year;
				$scope.month = monthlyDataService.month;
				unSelectAllDays();

				$scope.state = "";
				$scope.hasError = false;
				catsBackend.getCAT2ComplianceData4OneMonth(monthlyDataService.year, monthlyDataService.month, true)
				.then( handleCatsData, setISPErrorText);
			};

			$scope.reloadCalendar = function () {
				reload();
			};

			$scope.getStateClassSubstring = function(calDay){
				if (calDay.data !== null) {
					if(calDay.data.state === 'Y' && calDay.today){
						return 'Y_TODAY';
					}
					else if(calDay.data.state === 'OVERBOOKED' && calDay.today){
						return 'OVERBOOKED_TODAY';
					}
					else {
						return calDay.data.state;
					}
				} else {
					return ''; // not relevant (might be hidden)
				}
			};

			$scope.toggleAnalytics = function () {
				$scope.width = $window.document.getElementById('inner').offsetWidth;
				if ($scope.analytics.value === true) {
					$scope.analytics.value = false;
				} else {
					$scope.analytics.value = true;
				}
			};

			$scope.switchOnSingleDayAnalytics = function (dayString) {
				$scope.analytics.singleDay = dayString;
				if($scope.analytics.closingTimer) {
					$timeout.cancel($scope.analytics.closingTimer);
				}
				$scope.analytics.closingTimer = $timeout(function () { $scope.analytics.singleDay = ''; } , 2000);
			};

			$scope.switchOffSingleDayAnalytics = function () {
				$scope.analytics.singleDay = '';
			};

			$scope.confirmSingleDayAnalytics = function () {
				if($scope.analytics.closingTimer) {
					$timeout.cancel($scope.analytics.closingTimer);
				}
				$scope.analytics.closingTimer = $timeout(function () { $scope.analytics.singleDay = ''; } , 2000);
			};

			$scope.state = "";
			$scope.hasError = false;
			catsBackend.getCAT2ComplianceData4OneMonth(monthlyDataService.year, monthlyDataService.month)
			.then( handleCatsData, setISPErrorText);

			if ($scope.selectedDay) {
				while (new Date($scope.selectedDay).getMonth() !== monthlyDataService.month) {
					$scope.prevMonth();
				}
			}

			var refreshInterval = null;
			$scope.$on("$destroy", function () {
				if (refreshInterval !== null) {
					$interval.cancel(refreshInterval);
				}
			});

			(function reloader() {
				refreshInterval = $interval(function () {
					$scope.state = "";
					$scope.hasError = false;
					catsBackend.getCAT2ComplianceData4OneMonth(monthlyDataService.year, monthlyDataService.month, true)
					.then( handleCatsData, setISPErrorText);
				}, 15 * 60 * 1000);
			})();

			$scope.$on("refreshAppReceived", function () {
				monthlyDataService.reloadInProgress.value = true;
				catsBackend.getCAT2ComplianceData4OneMonth(monthlyDataService.year, monthlyDataService.month, true)
					.then( handleCatsData, setISPErrorText);
			});

			$scope.reloadInProgress = monthlyDataService.reloadInProgress;
			$scope.$watch("reloadInProgress", function() {
				if ($scope.reloadInProgress.value === true) {
					$scope.reloadAnimation = 'cats-fade-anim';
				} else {
					$scope.reloadAnimation = '' ;
					if (monthlyDataService.lastSingleClickDayString &&
						(!$scope.selectedDates || $scope.selectedDates.length <= 1)) {
						$scope.jump(monthlyDataService.lastSingleClickDayString, {});
					}
				}
			}, true);
		};

		return {
			restrict: "E",
			templateUrl: "app/cats/cats.calendar.html",
			replace: true,
			link: linkFn,
			scope: {
				selectedDates: '=selectedDates',
				onDateSelected: "&ondateselected",
				onDateDeselected: "&ondatedeselected",
				selectionCompleted: "&selectioncompleted",
				dayClassInput: '@dayClass',
				maintainable: '=',
				analytics: '=',
				loading: '='
			}
		};
	}]
);
