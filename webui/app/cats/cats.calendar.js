angular.module("app.cats")
	.directive("app.cats.calendar", 
		["lib.utils.calUtils", 
		 "app.cats.data.catsUtils", 
		 "$interval", 
		 "$location", 
		 "bridgeDataService",
		 "app.cats.monthlyData",
		 "bridgeInBrowserNotification",
		 "$q",
	function (calUtils, catsUtils, $interval, $location, bridgeDataService, monthlyDataService, bridgeInBrowserNotification, $q) {
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
	                
	                // special handling for overbooked days
	                if (days[i].STATUS === "Y" && days[i].QUANTITYH > days[i].STDAZ) {
	                	statusStr = "OVERBOOKED";
	                	days[i].STATUS = "OVERBOOKED";
	                }
	                if (days[i].STATUS === "R" && (time > new Date().getTime())) {
	                	statusStr = "R_INTHEFUTURE";
	                	days[i].STATUS = "R_INTHEFUTURE"
	                }
					if (days[i].STATUS === "Y" && (time > new Date().getTime())) {
	                	statusStr = "Y_INTHEFUTURE_part_maint";
	                	days[i].STATUS = "Y_INTHEFUTURE_part_maint"
	                }
	                if (time !== null) {
	                    processed[time] = { state: statusStr };
	                }
	            }

	            return processed;
			} catch(err) {
				console.log("parseDateToTime(): " + err);
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
			if (!$scope.year) {
				monthlyDataService.year = new Date().getFullYear();
				$scope.year = monthlyDataService.year;
			}
			$scope.month = monthlyDataService.month;
			if (!$scope.month) {
				monthlyDataService.month = new Date().getMonth();
				$scope.month = monthlyDataService.month;
			}
			$scope.currentMonth = "";
			$scope.calArray = [];
			$scope.state = "";
			$scope.loading = true;
			$scope.hasError = false;
			$scope.weekdays = calUtils.getWeekdays();
			$scope.dayClass = $scope.dayClassInput || 'app-cats-day';
			$scope.calUtils = calUtils;

			var monthRelative = monthDiff(new Date(),new Date(monthlyDataService.year,monthlyDataService.month));
			var rangeSelectionStartDayString = null;
			var rangeSelectionEndDayString = null;
		    var daysElements = [];

			$scope.getDescForState = function (state_s) {
				return catsUtils.getDescForState(state_s);
			};

			function reload() {
			    $scope.loading = true;
				$scope.calArray = calUtils.buildCalendarArray(monthlyDataService.year, monthlyDataService.month);
				$scope.currentMonth = calUtils.getMonthName(monthlyDataService.month).long;
				if ($scope.maintainable) {
					monthlyDataService.getDataForDate(calUtils.stringifyDate(new Date($scope.year,$scope.month)));
				}
				$scope.loading = false;
			}

			
			function handleCatsData(data) {
				if (data !== null && data !== undefined) {
					var additionalData = processCatsData(data);
					if (additionalData !== null) {
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

			function hasFixedTask (dayString){
	        	var day = monthlyDataService.days[dayString];
		        var containsFixedTask = false;
		        day.tasks.forEach(function(task){
		            if (task.TASKTYPE === "VACA" || task.TASKTYPE === "ABSE") {
		                containsFixedTask = true;
		            }
		        });
		        return containsFixedTask;
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
						console.log("tab");
						nextElement = angular.element(document.querySelector( '#filter-bar input' ));
						nextElement.focus();
						return;
					default:
						return;
				}
				
				if (nextElement){
					setTimeout(function() { nextElement.focus(); }, 100);					
				}

				if (originDate.getMonth() === targetDate.getMonth()) {
					$scope.jump(calUtils.stringifyDate(targetDate), event);
				}
			};

			function selectDay(dayString) {
				var deferred = $q.defer();

				monthlyDataService.getDataForDate(dayString).then(function(){
					if (monthlyDataService.days[dayString] &&
	        			monthlyDataService.days[dayString].targetHours > 0) {
						$scope.onDateSelected({dayString: dayString});
					}
					deferred.resolve();
				});
				return deferred.promise;
			}

			function unSelectDay(dayString) {
				var deferred = $q.defer();

				monthlyDataService.getDataForDate(dayString).then(function(){
					if ($scope.isSelected(dayString)) {
						$scope.onDateDeselected({dayString: dayString});
					}
					deferred.resolve();
				});
				return deferred.promise;
			}
			
			$scope.selectSingleDay = function (dayString, toggle) {
				if (dayString && !hasFixedTask(dayString)) {
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


	        function containsDayWithAFixedTask(daysStringsArray){
   				var thereIsSuchDay = false;
				daysStringsArray.forEach(function(dayString){
					if(hasFixedTask(dayString)) {
						thereIsSuchDay = true;
					}
				});
				return thereIsSuchDay;
			}

			function clearSelectionFromDaysWithFixedTasks()  {
				$scope.selectedDates.forEach(function(selectedDayString){
					if (hasFixedTask(selectedDayString)) {
						unSelectDay(selectedDayString);
						bridgeInBrowserNotification.addAlert('', 'Days with unchangable tasks (e.g. vacation or absence) could not be selected.');
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

				if(containsDayWithAFixedTask(daysStringsArray)) {
					bridgeInBrowserNotification.addAlert('', 'Days with unchangable tasks (e.g. vacation or absence) could not be selected.');
				}

				return promises;
			}

			$scope.selectWeek = function (index) {
				var promises = [];
				var week = $scope.calArray[index];
				var range = [];
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

				$q.all(promises).then(function(){
					$scope.selectionCompleted();
				});
			};

	        function isSelectable(dayString){
	        	if (monthlyDataService.days[dayString] &&
	        		monthlyDataService.days[dayString].targetHours > 0 &&
	        		!hasFixedTask(dayString)) {
	        		return true;
        		}
        		return false;
	        }

	        $scope.isSelected = function(dayString){
	        	if (!$scope.selectedDates){
	        		return false;
	        	}
	        	return $scope.selectedDates.indexOf(dayString) !== -1;
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
				return $scope.rangeIsSelected($scope.calArray[index]);
			};

			$scope.monthIsSelected = function(){
				var calArrayForMonth = [];
					$scope.calArray.forEach(function(week){
						week.forEach(function(calDay) {
							if (calDay.inMonth) {
								calArrayForMonth.push(calDay);
							}
						});	
					});
				return $scope.rangeIsSelected(calArrayForMonth);
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

			$scope.jump = function (dayString, event) {

				if (monthlyDataService.reloadInProgress.value === true) {
					return;
				}

				var range_click = event.shiftKey;
				var multi_click = (event.ctrlKey || event.metaKey) && !range_click;
				var single_click = !range_click && !multi_click;
				var promise = null;
				var promises = [];

				if (!dayString && $scope.year && $scope.month) {
					// togle complete month
					var firstOfMonthDayString = calUtils.stringifyDate(new Date($scope.year, $scope.month));
					var lastOfMonthDayString = calUtils.stringifyDate(new Date($scope.year, $scope.month + 1, 0));
					
					// load data, in case it is not yet done
					promise = monthlyDataService.getDataForDate(firstOfMonthDayString);
					promise.then(function() {
						monthlyDataService.lastSingleClickDayString = firstOfMonthDayString;
						setRangeDays(firstOfMonthDayString, lastOfMonthDayString);
						if ($scope.monthIsSelected()) {
							promises.push(unSelectRange(collectRange(lastOfMonthDayString)));
						} else {
							promises.push(selectRange(collectRange(lastOfMonthDayString)));
						}
						promise = $q.all(promises);
						promise.then(function(){
							$scope.selectionCompleted();
						});
					});
				} else if (single_click) {
					//unselectOthers
					if ($scope.selectedDates) {
						$scope.selectedDates.forEach(function(selectedDayString){
							promises.push(unSelectDay(selectedDayString));
						});
					}
					promises.push(selectDay(dayString));
					monthlyDataService.lastSingleClickDayString = dayString;
					setRangeDays(dayString, null);

					if (event.originalEvent) {
						$location.path("/detail/cats/");
					}
				} else if (multi_click) {
					promises.push($scope.selectSingleDay(dayString, true));

					if (!hasFixedTask(dayString)) {
						setRangeDays(dayString, null);
						clearSelectionFromDaysWithFixedTasks();
					} 
					else{
						bridgeInBrowserNotification.addAlert('', 'Days with unchangable tasks (e.g. vacation or absence) could not be selected.');
					}
				} else if (range_click) {
					if (rangeSelectionEndDayString) {
						var oldRange = collectRange(rangeSelectionEndDayString);
						unSelectRange(oldRange);
					}
					promises = selectRange(collectRange(dayString));
				}
				
				promise = $q.all(promises);
				promise.then(function(){
					if (!$scope.isSelected(monthlyDataService.lastSingleClickDayString) && $scope.selectedDates && $scope.selectedDates.length > 0) {
						monthlyDataService.lastSingleClickDayString = $scope.selectedDates[0];
					}
					$scope.selectionCompleted();
				});
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

	            if (monthlyDataService.month === 0) {
	                monthlyDataService.month = 11;
	                monthlyDataService.year--;
	            }
	            else {
	                monthlyDataService.month--;
	            }
				$scope.year = monthlyDataService.year;
				$scope.month = monthlyDataService.month;

				if ($scope.maintainable) {
					// access single day in the middle of the month to cause data load
					var date = new Date(monthlyDataService.year, monthlyDataService.month, 15);
					var promise = monthlyDataService.getDataForDate(calUtils.stringifyDate(date));
					promise.then(function() {
						reload();
					});
				} else {
					reload();
				}
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

	            if (monthlyDataService.month === 11) {
	                monthlyDataService.month = 0;
	                monthlyDataService.year++;
	            }
	            else {
	                monthlyDataService.month++;
	            }
				$scope.year = monthlyDataService.year;
				$scope.month = monthlyDataService.month;

				if ($scope.maintainable) {
					// access single day in the middle of the month to cause data load
					var date = new Date(monthlyDataService.year, monthlyDataService.month, 15);
					var promise = monthlyDataService.getDataForDate(calUtils.stringifyDate(date));
					promise.then(function() {
						reload();
					});
				} else {
					reload();
				}
	        };

	        $scope.reloadCalendar = function () {
	            reload();
	        };

			$scope.getStateClassSubstring = function(calDay){
				if(calDay.data.state === 'Y' && calDay.today){
					return 'Y_TODAY';
				}
				else if(calDay.data.state === 'OVERBOOKED' && calDay.today){
					return 'OVERBOOKED_TODAY';
				}
				else {
					return calDay.data.state;
				}
			};
			
			var refreshInterval = null;

			catsUtils.getCatsComplianceData(handleCatsData);

			if ($scope.selectedDay) {
			    while (new Date($scope.selectedDay).getMonth() !== monthlyDataService.month) {
			        $scope.prevMonth();
			    }
			}

			$scope.$on("$destroy", function () {
			    if (refreshInterval !== null) {
			        $interval.cancel(refreshInterval);
			    }
			});

			(function springGun() {
			    var dateLastRun = new Date().getDate();

			    refreshInterval = $interval(function () {
			        if (dateLastRun !== new Date().getDate()) {
			            catsUtils.getData(handleCatsData);
			        }
			    }, 3 * 3600000);
			})();

			$scope.$on("refreshAppReceived", function () {
			    catsUtils.getCatsComplianceData(handleCatsData, true); // force update
			});

			$scope.reloadInProgress = monthlyDataService.reloadInProgress;
			$scope.$watch("reloadInProgress", function() {
				if ($scope.reloadInProgress.value === true) {
					$scope.reloadAnimation = 'cats-fade-anim';
				} else {
					$scope.reloadAnimation = '';
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
                loading: '='
	        }
	    };
	}]);