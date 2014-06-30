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

			var rangeSelectionStartDayString = null;
			var rangeSelectionEndDayString = null;

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
				var promise = null;
				var promises = [];

				if (single_click) {
					//unselectOthers
					if ($scope.selectedDates) {
						$scope.selectedDates.forEach(function(selectedDayString){
							promises.push(unSelectDay(selectedDayString));
						});
					};
					promises.push(selectDay(dayString));

					monthlyDataService.lastSingleClickDay = monthlyDataService.days[dayString];
					setRangeDays(dayString, null);

					if (event.originalEvent) {
						$location.path("/detail/cats/");
					};
				} else if (multi_click) {
					promises.push($scope.selectSingleDay(dayString, true));

					if (!hasFixedTask(dayString)) {
						setRangeDays(dayString, null);
						clearSelectionFromDaysWithFixedTasks();
					} 
					else
						bridgeInBrowserNotification.addAlert('', 'Days with unchangable tasks (e.g. vacation or absence) could not be selected.');


				} else if (range_click) {
					if (rangeSelectionEndDayString) {
						oldRange = collectRange(rangeSelectionEndDayString);
						unSelectRange(oldRange);
					};
					promises = selectRange(collectRange(dayString));
				}
				
				promise = $q.all(promises);
				promise.then(function(){
					$scope.selectionCompleted();
				});
			};

			$scope.selectSingleDay = function (dayString, toggle) {
				if (dayString && !hasFixedTask(dayString)) {
					if (toggle && $scope.isSelected(dayString))
						return unSelectDay(dayString);
					else
						return selectDay(dayString);
				}
			}

			$scope.selectWeek = function (index) {
				var promises = [];
				var week = $scope.calArray[index];
				var range = [];
				week.forEach(function(day){
					if (day.inMonth) {
						range.push(day.dayString);
					};
				})

				if ($scope.weekIsSelected(index))
					promises = unSelectRange(range);
				else
					promises = selectRange(range);

				$q.all(promises).then(function(){
					$scope.selectionCompleted();
				});
			};

			$scope.weekIsSelected = function(index){
				var week = $scope.calArray[index];
				var allSelected = true;
				var weekIsSelectable = false;
				week.some(function(calDay){
					if (calDay.inMonth && isSelectable(calDay.dayString)) {
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

			function clearSelectionFromDaysWithFixedTasks()  {
				$scope.selectedDates.forEach(function(selectedDayString){
					if (hasFixedTask(selectedDayString)) {
						unSelectDay(selectedDayString);
						bridgeInBrowserNotification.addAlert('', 'Days with unchangable tasks (e.g. vacation or absence) could not be selected.');
					};
				})
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

				collectDates(startDate, endDate).forEach(function(dateString){
					range.push(dateString);
				})

				return range;
			}

			function unSelectRange(daysStringsArray){
				var promises = [];

				daysStringsArray.forEach(function(dayString){
					promises.push(unSelectDay(dayString));
				})
				return promises;
			}

			function selectRange(daysStringsArray){
				if (!daysStringsArray) {
					return;
				}
				var promises = [];

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

			function selectDay(dayString) {
				var deferred = $q.defer();

				monthlyDataService.getDataForDate(dayString).then(function(){
					if (monthlyDataService.days[dayString] &&
	        			monthlyDataService.days[dayString].targetHours > 0) {
						var ok = $scope.onDateSelected({dayString: dayString});
					};
					deferred.resolve();
				});
				return deferred.promise;
			}

			function unSelectDay(dayString) {
				var deferred = $q.defer();

				monthlyDataService.getDataForDate(dayString).then(function(){
					if ($scope.isSelected(dayString)) {
						var ok = $scope.onDateDeselected({dayString: dayString});
					};
					deferred.resolve();
				});
				return deferred.promise;
			}

	        function isSelectable(dayString){
	        	if (monthlyDataService.days[dayString] &&
	        		monthlyDataService.days[dayString].targetHours > 0 &&
	        		!hasFixedTask(dayString)) {
	        		return true;
        		}
        		return false;
	        }

	        $scope.isSelected = function(dayString){
	        	if (!$scope.selectedDates)
	        		return false;
	        	return $scope.selectedDates.indexOf(dayString)!=-1;
	        }

	        function hasFixedTask (dayString){
	        	var day = monthlyDataService.days[dayString];
		        var hasFixedTask = false;
		        day.tasks.forEach(function(task){
		            if (task.TASKTYPE === "VACA" || task.TASKTYPE === "ABSE") {
		                hasFixedTask = true;
		            };
		        })
		        return hasFixedTask;
		    }

			function containsDayWithAFixedTask(daysStringsArray){
   				var containsDayWithAFixedTask = false;
				daysStringsArray.forEach(function(dayString){
					if(hasFixedTask(dayString)) {
						containsDayWithAFixedTask = true;
					}
				});
				return containsDayWithAFixedTask;
			}

	        function getUnselectedDays(daysStringsArray){
	        	var unselected = [];
	        	daysStringsArray.forEach(function(day){
	        		if (isSelectable(day.dayString) && !$scope.isSelected(day.dayString)) {
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
				// $scope.selectionCompleted();
			}

			function setRangeDays (startDate, endDate){
				rangeSelectionStartDayString = startDate;
				rangeSelectionEndDayString = endDate;
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
			    catsUtils.getCatsComplianceData(handleCatsData, true); // force update
			});

			$scope.getStateClassSubstring = function(calDay){
				if(calDay.data.state == 'Y' && calDay.today)
					return 'Y_TODAY';
				else if(calDay.data.state == 'OVERBOOKED' && calDay.today)
					return 'OVERBOOKED_TODAY';
				else
					return calDay.data.state;
			}

			if (monthlyDataService.lastSingleClickDay) {
				reload();
					// var promises = [];
					// promises.push($scope.selectSingleDay(monthlyDataService.lastSingleClickDay.dayString, true));
					// var promise = $q.all(promises);
					// promise.then(function(){
					// 	$scope.selectionCompleted();
					// });
				$scope.jump(monthlyDataService.lastSingleClickDay.dayString, {});
			
			}
	    };

	    function processCatsData(cats_o) {
	        try {
	            var processed = {};
	            var days = cats_o;

	            for (var i = 0; i < days.length; i++) {
	                var dateStr = days[i].DATEFROM;
	                var statusStr = days[i].STATUS;
	                // special handling for overbooked days
	                if (days[i].STATUS == "Y" && days[i].QUANTITYH > days[i].STDAZ) {
	                	statusStr = "OVERBOOKED";
	                	days[i].STATUS = "OVERBOOKED"
	                }

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
	            selectedDates: '=selectedDates',
	            onDateSelected: "&ondateselected",
	            onDateDeselected: "&ondatedeselected",
	            selectionCompleted: "&selectioncompleted",
	            dayClassInput: '@dayClass',
                maintainable: '='
                // loading: '='
	        }
	    };
	}]);