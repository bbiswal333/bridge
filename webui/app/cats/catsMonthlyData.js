angular.module("app.cats.monthlyDataModule", ["lib.utils"])
.service("app.cats.monthlyData",
	["$http",
	"$q",
	"lib.utils.calUtils",
	"app.cats.cat2BackendZDEVDB",
	"app.cats.catsUtils",
	"$log",

	function ($http, $q, calenderUtils, catsBackend, catsUtils, $log) {

	this.days = {};
	this.promiseForMonth = {};
	this.reloadInProgress = {
		value: false,
		error: false };

	this.executeWhenDone = function(promise)
	{
		var that = this;
		promise.then(function(data) {
			that.convertWeekData(data);
		});
	};

	this.getMonthData = function(year, month){
		try {
			var self = this;
			var promise = null;
			var promises = [];

			if (this.promiseForMonth[month]) {
				return this.promiseForMonth[month];
			}

			self.reloadInProgress.value = true;

			var weeks = this.getWeeksOfMonth(year, month);
			for (var i = 0; i < weeks.length; i++) {
				promise = catsBackend.getCatsAllocationDataForWeek(weeks[i].year, weeks[i].weekNo);
				promises.push(promise);
				this.executeWhenDone(promise);
			}

			promise = $q.all(promises);
			promise.then(function(){
				delete self.promiseForMonth[month];
				self.reloadInProgress.value = false;
			}, function() {
				self.reloadInProgress.value = false;
				self.reloadInProgress.error = true;
			});

			this.promiseForMonth[month] = promise;
			return promise;
		} catch(err) {
			$log.log("getMonthData(): " + err);
		}
	};

	this.getDataForDate = function(date){
		try {
			var deferred = $q.defer();
			var unstringifiedDate = calenderUtils.parseDate(date);
			var month = unstringifiedDate.getMonth();
			var year = unstringifiedDate.getFullYear();

			if (!this.days[date] && this.promiseForMonth[month]) {
				return this.promiseForMonth[month];
			}
			else if (!this.days[date]){
				return this.getMonthData(year, month);
			}
			else if (this.days[date]) {
				deferred.resolve();
				return deferred.promise;
			}
		} catch(err) {
			$log.log("getDataForDate(): " + err);
		}
	};

	this.getWeeksOfMonth = function(year, month){
		try {
			var day = new Date(year, month, 1);
			var lastDayInMonth = 0;
			if (month < 11) {
				lastDayInMonth = new Date(year, month + 1, 1);
			} else {
				lastDayInMonth = new Date(year + 1,0, 1);
			}
			lastDayInMonth.setDate( lastDayInMonth.getDate() - 1 );

			var weeks = [];
			var week  = calenderUtils.getWeekNumber(day);

			if(month === 0 && week.weekNo === 0) { // special case where first week of year is the 52 or 53 of the old year
				week = calenderUtils.getWeekNumber(new Date(year - 1, 11, 31));
				week.weekNo = calenderUtils.toNumberOfCharactersString(week.weekNo, 2);
				weeks.push(angular.copy(week));
				week = calenderUtils.getWeekNumber(day);
				week.year = year;
			} else {
				week.weekNo = calenderUtils.toNumberOfCharactersString(week.weekNo, 2);
				weeks.push(angular.copy(week));
			}

			day.setDate(day.getDate() + 7);
			while((calenderUtils.getWeekNumber(day).weekNo <= calenderUtils.getWeekNumber(lastDayInMonth).weekNo) ||
				  (calenderUtils.getWeekNumber(day).year   <  calenderUtils.getWeekNumber(lastDayInMonth).year)) {
				week = calenderUtils.getWeekNumber(day);
				week.weekNo = calenderUtils.toNumberOfCharactersString(week.weekNo, 2);
				weeks.push(angular.copy(week));
				day.setDate(day.getDate() + 7);
			}
			return weeks;
		} catch(err) {
			$log.log("getWeeksOfMonth(): " + err);
		}
	};

	this.getTargeHoursForDay = function (dayString) {
		var targetHours = 0;
		catsBackend.CAT2ComplinaceDataCache.some(function (data4day) {
			if (data4day.DATEFROM === dayString) {
				targetHours = data4day.STDAZ;
				return true;
			}
		});
		return targetHours;
	};

	this.getHoursOfWorkingDay = function (dayString) {
		var hoursOfWorkingDay = 0;
		catsBackend.CAT2ComplinaceDataCache.some(function (data4day) {
			if (data4day.DATEFROM === dayString) {
				hoursOfWorkingDay = data4day.CONVERT_H_T;
				return true;
			}
		});
		return hoursOfWorkingDay;
	};

	this.getTasksForDate = function(dayString){
		if (this.days[dayString]) {
			return this.days[dayString].tasks;
		} else {
			return null;
		}
	};

	this.initializeDaysForWeek = function (weekString) {
		var year = weekString.substring(3,7);
		var week = weekString.substring(0,2);
		// as we can not rely on getting any actual data for the week from the backend,
		// we need to initialize each day with it's actual target hours from the data
		// which we already have in the calendar array
		for (var calWeekIndex = 0; calWeekIndex < this.calArray.length; calWeekIndex++) {
			if (week === calenderUtils.toNumberOfCharactersString(this.calArray[calWeekIndex][0].weekNo, 2) + "") {
				for (var dayIndex = 0; dayIndex < this.calArray[calWeekIndex].length; dayIndex++) {
					var dayString = this.calArray[calWeekIndex][dayIndex].dayString;
					this.days[dayString] = {};
					this.days[dayString].dayString = dayString;
					this.days[dayString].hoursOfWorkingDay = this.getHoursOfWorkingDay(this.calArray[calWeekIndex][dayIndex].dayString);
					this.days[dayString].targetHours = this.getTargeHoursForDay(this.calArray[calWeekIndex][dayIndex].dayString);
					this.calArray[calWeekIndex][dayIndex].targetHours = this.days[dayString].targetHours;
					this.days[dayString].targetTimeInPercentageOfDay = Math.round(this.days[dayString].targetHours / this.days[dayString].hoursOfWorkingDay * 1000) / 1000;
					this.days[dayString].actualTimeInPercentageOfDay = 0; // to be calulated only when tasks are added
					this.days[dayString].date = dayString;
					this.days[dayString].tasks = [];
					this.days[dayString].year = year;
					this.days[dayString].week = week;
					this.days[dayString].calWeekIndex = calWeekIndex;
					this.days[dayString].dayIndex = dayIndex;
				}
			}
		}
	};

	this.convertWeekData = function (backendData) {
		try{
			this.initializeDaysForWeek(backendData.TIMESHEETS.WEEK);

			// adding tasks which are already posted in the backend to each day
			if(backendData.TIMESHEETS.RECORDS) {
				for (var ISPTaskIterator = 0; ISPTaskIterator < backendData.TIMESHEETS.RECORDS.length; ISPTaskIterator++) {
					for (var DayIterator = 0; DayIterator < backendData.TIMESHEETS.RECORDS[ISPTaskIterator].DAYS.length; DayIterator++) {
						var ISPtask = backendData.TIMESHEETS.RECORDS[ISPTaskIterator];
						if(ISPtask.DAYS[DayIterator].QUANTITY > 0) {
							var task = {};
							task.COUNTER = ISPtask.DAYS[DayIterator].COUNTER;
							task.TASKCOUNTER = ISPtask.DAYS[DayIterator].TASKCOUNTER;
							task.WORKDATE = ISPtask.DAYS[DayIterator].WORKDATE;
							task.RAUFNR = ISPtask.RAUFNR;
							task.TASKTYPE = ISPtask.TASKTYPE;
							task.ZCPR_EXTID = ISPtask.ZCPR_EXTID;
							task.ZCPR_OBJGEXTID = ISPtask.ZCPR_OBJGEXTID;
							task.ZZSUBTYPE = (ISPtask.ZZSUBTYPE || "");
							task.STATUS = ISPtask.DAYS[DayIterator].STATUS;
							task.UNIT = ISPtask.UNIT;
							task.QUANTITY = parseFloat(ISPtask.DAYS[DayIterator].QUANTITY);
							task.DESCR = ISPtask.DESCR;
							this.days[task.WORKDATE].tasks.push( task );

							if (task.UNIT === 'H') {
								this.days[task.WORKDATE].actualTimeInPercentageOfDay += task.QUANTITY / this.days[task.WORKDATE].hoursOfWorkingDay;
							} else {
								this.days[task.WORKDATE].actualTimeInPercentageOfDay += task.QUANTITY;
							}
							// This value must not be rounded!
							this.days[task.WORKDATE].actualTimeInPercentageOfDay = this.days[task.WORKDATE].actualTimeInPercentageOfDay;

							// That coding does not belong here...
							var block = {};
							block.desc = task.DESCR;
							block.fixed = true;
							block.value = task.QUANTITY;
							block.task = task;
							if (!this.calArray[this.days[ISPtask.DAYS[DayIterator].WORKDATE].calWeekIndex][this.days[ISPtask.DAYS[DayIterator].WORKDATE].dayIndex].blocks) {
								this.calArray[this.days[ISPtask.DAYS[DayIterator].WORKDATE].calWeekIndex][this.days[ISPtask.DAYS[DayIterator].WORKDATE].dayIndex].blocks = [];
							}
							this.calArray[this.days[ISPtask.DAYS[DayIterator].WORKDATE].calWeekIndex][this.days[ISPtask.DAYS[DayIterator].WORKDATE].dayIndex].blocks.push( block );
						}
					}
				}
			angular.forEach(this.days,function(day) {
				// QUANTITY_DAY must alsways be <= 1 for a day irrespective of part time and country specific working hours
				var totalOfQuantityDay = 0;
				var biggestTask = {};
				biggestTask.QUANTITY_DAY = 0;
				angular.forEach(day.tasks,function(oTask) {

					// knowingly doing some data doublication here
					oTask.QUANTITY_DAY = catsUtils.calculateDAY(oTask,day);

					totalOfQuantityDay = Math.round((totalOfQuantityDay + oTask.QUANTITY_DAY) * 1000) / 1000;

					// remember biggest task for rounding adjustments
					if(oTask.QUANTITY_DAY >= biggestTask.QUANTITY_DAY) {
						biggestTask = oTask;
					}
				});

				if (totalOfQuantityDay >= 0.995 && totalOfQuantityDay <= 1.005) {
					biggestTask.QUANTITY_DAY = Math.round((biggestTask.QUANTITY_DAY - totalOfQuantityDay + 1) * 1000) / 1000;
				}
			});
			}
		} catch(err) {
			$log.log("convertWeekData(): " + err);
		}
	};

	this.loadDataForSelectedWeeks = function(weeks){
		var promises = [];
		try {
			var self = this;
			self.reloadInProgress.value = true;
			weeks.forEach(function(week){
				var promise = catsBackend.getCatsAllocationDataForWeek(week.substring(0,4),week.substring(5,7));
				promises.push(promise);
				promise.
				then(function(data){
					if(data) {
						self.convertWeekData(data);
					}
					catsBackend.CAT2ComplinaceDataPromise
					.then(function(){
						self.reloadInProgress.value = false;
					});
				}, function() {
					self.reloadInProgress.value = false;
					self.reloadInProgress.error = true;
				});
			});
		} catch(err) {
			$log.log("loadDataForSelectedWeeks(): " + err);
		}
		return $q.all(promises);
	};
}]);
