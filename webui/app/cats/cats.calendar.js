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
				var promises = [];

				if (single_click) {
					promises = $scope.selectSingleDay(dayString);
					$scope.day = [monthlyDataService.days[dayString]];
					$location.path("/detail/cats/");
				} else if (multi_click) {
					promises = selectRange([monthlyDataService.days[dayString]],dayString);
				} else if (range_click) {
					promises = selectRange(collectRange(dayString),dayString);
				}
				
				promise = $q.all(promises);
				promise.then(function(){
					$scope.selectionCompleted();
				});
			};

			$scope.selectSingleDay = function (dayString) {
				var promises = [];
				for(var i = 0; i < $scope.calArray.length; i++) {
					for(var j = 0; j < $scope.calArray[i].length; j++) {
						promise = unSelectDay($scope.calArray[i][j]);
						promises.push(promise);
						if(dayString && $scope.calArray[i][j].dayString == dayString) {
							promise = selectDay($scope.calArray[i][j],true);
							promises.push(promise);
						}
					}
				}
				return promises;
			}

			$scope.selectWeek = function (index) {
				var promises = [];
				var week = $scope.calArray[index];
				var range = [];
				week.forEach(function(day){
					if (day.inMonth) {
						range.push(day);
					};
				})
				promises = selectRange(range);
				promise = $q.all(promises);
				promise.then(function(){
					$scope.selectionCompleted();
				});
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

			function getSelectionBaseDate(dayString) {
				var date = calUtils.parseDate($scope.selectedDates[0]);
				if((!date || date == false) && dayString) {
					date = calUtils.parseDate(dayString);
				}
				return date;
			}

			function collectRange(dayString) {
				var range = [];
				var lastDate = getSelectionBaseDate(dayString);
				var selectedDate = calUtils.parseDate(dayString);

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

			function selectRange(daysArray,clickedOnDayString){
				var promises = [];

				selectedDates = selectedDates;
				var toSelect = getUnselectedDays(daysArray);
				if (toSelect && toSelect.length > 0) {
					toSelect.forEach(function(calDay){
						promise = selectDay(calDay);
						promises.push(promise);
					})
				} else if (!clickedOnDayString || $scope.isSelected(clickedOnDayString)){
					daysArray.forEach(function(calDay){
						promise = unSelectDay(calDay);
						promises.push(promise);
					});
				}

				// clear incorrect selections like vacation or weekend days...
				daysArray.forEach(function(calDay){
					if (!isSelectable(calDay) && $scope.isSelected(calDay.dayString)) {
						promise = unSelectDay(calDay);
						promises.push(promise);

					};
				});

				if(containsVacationDay(daysArray) && isSelectOperation(daysArray)) {
					bridgeInBrowserNotification.addAlert('', 'Days with vacation can not be selected.');
				}

				return promises;
			}

			function selectDay(calDay, selectAnyways) {
				var deferred = $q.defer();

				monthlyDataService.getDataForDate(calDay.dayString).then(function(){
					if (selectAnyways || isSelectable(calDay)) {
						var ok = $scope.onDateSelected({dayString: calDay.dayString});
					};
					deferred.resolve();
				});
				return deferred.promise;
			}

			function unSelectDay(calDay) {
				var deferred = $q.defer();

				monthlyDataService.getDataForDate(calDay.dayString).then(function(){
					if ($scope.isSelected(calDay.dayString)) {
						var ok = $scope.onDateDeselected({dayString: calDay.dayString});
					};
					deferred.resolve();
				});
				return deferred.promise;
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

	        function hasVacationTask (day){
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
				var promises = [];
				if ($scope.calArray) {
					for(var i = 0; i < $scope.calArray.length; i++) {
						for(var j = 0; j < $scope.calArray[i].length; j++) {
							promises.push(unSelectDay($scope.calArray[i][j]));
						}
					}
				}
				promise = $q.all(promises);
				promise.then(function(){
					$scope.calArray = calUtils.buildCalendarArray($scope.year, $scope.month);
					$scope.currentMonth = calUtils.getMonthName($scope.month).long;
					$scope.loading = false;
					$scope.selectionCompleted();
				});
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
	            selectedDay: '=selectedDay',
	            selectedDates: '=selectedDates',
	            onDateSelected: "&ondateselected",
	            onDateDeselected: "&ondatedeselected",
	            selectionCompleted: "&selectioncompleted",
	            dayClassInput: '@dayClass',
                maintainable: '=',
	        }
	    };
	}]);