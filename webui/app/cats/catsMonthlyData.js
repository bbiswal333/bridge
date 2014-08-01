angular.module("app.cats.monthlyDataModule", ["lib.utils"])
.service("app.cats.monthlyData", 
	["$http", 
	"$q", 
	"lib.utils.calUtils", 
	"app.cats.data.catsUtils", 
	
	function($http, $q, calenderUtils, catsUtils){

	this.months = {};
	this.days = {};
	this.promise = null;
	this.promiseForMonth = {};
	this.reloadInProgress = { value:false };
	this.year = new Date().getFullYear();
	this.month = new Date().getMonth();

	this.getDataForCurrentMonth = function(){
		var date = calenderUtils.today();
		var promises = [];
		promises.push(this.getMonthData(date.getFullYear(), date.getMonth()));
		this.promise = $q.all(promises);
		return this.promise;
	};

	this.getMonthData = function(year, month){
		try {
			var monthData = {};
			var self = this;
			monthData.weeks = [];
			var deferred = $q.defer();
			var promise = null;
			var promises = [];
			var targetHoursCounter = 0;

			if (!this.months[month] && this.promiseForMonth[month]) {
				return this.promiseForMonth[month];
			} 
			else if (this.months[month]) {
				deferred.resolve();
				return deferred.promise;
			}

			this.reloadInProgress.value = true;

			var weeks = this.getWeeksOfMonth(year, month);
			for (var i = 0; i < weeks.length; i++) {
				promise = catsUtils.getCatsAllocationDataForWeek(weeks[i].year, weeks[i].weekNo);
				promises.push(promise);
				promise.then(function(data){
					if(data) {
						var localPromise = self.convertWeekData(data);
						promises.push(localPromise);
						localPromise.then(function(weekData) {
						monthData.weeks.push(weekData);
						targetHoursCounter = targetHoursCounter + weekData.hasTargetHoursForHowManyDays;
						});
					}
				});
			}

			promise = $q.all(promises);
			promise.then(function(){
				if(targetHoursCounter > 27 && targetHoursCounter === 7 * monthData.weeks.length) {
					monthData.hasTargetHours = true;
				} else {
					monthData.hasTargetHours = false;
				}
				
			    self.months[month] = monthData;
			    delete self.promiseForMonth[month];
			    self.reloadInProgress.value = false;
			});

			this.promiseForMonth[month] = promise;
			return promise;
		} catch(err) {
			console.log("getMonthData(): " + err);
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
			console.log("getDataForDate(): " + err);
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
				weeks.push(angular.copy(week));
				week = calenderUtils.getWeekNumber(day);
				week.year = year;
			} else {
				weeks.push(angular.copy(week));
			}

			day.setDate(day.getDate() + 7);
			while((calenderUtils.getWeekNumber(day).weekNo <= calenderUtils.getWeekNumber(lastDayInMonth).weekNo) ||
			      (calenderUtils.getWeekNumber(day).year   <  calenderUtils.getWeekNumber(lastDayInMonth).year)) {
				week = calenderUtils.getWeekNumber(day);
				weeks.push(angular.copy(week));
				day.setDate(day.getDate() + 7);
			}
			return weeks;
		} catch(err) {
			console.log("getWeeksOfMonth(): " + err);
		}
	};

	this.initializeDay = function (calWeekIndex, dayIndex, weekData, dayString) {
		var promise = catsUtils.getTotalWorkingTimeForDay(dayString);
		var self = this;
		promise.then(function(targetHours) {
			var day = null;
			day = {};
			var hoursOfWorkingDay = 8;
			day.targetHours = targetHours;
			// test test test
			/*if(day.targetHours) {
				day.targetHours = 7.55;
			} else {
				day.targetHours = 0;
			}*/
			day.targetTimeInPercentageOfDay = Math.round(day.targetHours / hoursOfWorkingDay * 1000) / 1000;
			day.actualTimeInPercentageOfDay = 0; // to be calulated only when tasks are added
			day.date = dayString;
			day.dayString = dayString;
			weekData.hasTargetHoursForHowManyDays++;
			day.tasks = [];
			day.year = weekData.year;
			day.week = weekData.week;
			weekData.days.push( day );
			self.days[day.dayString] = day;
		});
		return promise;
	};

	this.convertWeekData = function (backendData) {
		try{
			var promises = [];
			var deferred = $q.defer();
			var week = backendData.TIMESHEETS.WEEK.substring(0,2);
			var year = backendData.TIMESHEETS.WEEK.substring(3,7);
			var weekData = {};
			weekData.year = year;
			weekData.week = week;
			weekData.hasTargetHoursForHowManyDays = 0;
			weekData.days = [];

			// as we can not rely on getting any actual data for the week from the backend,
			// we need to initialize each day with it's actual target hours from the data
			// which we already have in the calendar array
			for (var calWeekIndex = 0; calWeekIndex < this.calArray.length; calWeekIndex++) {
				if (week === this.calArray[calWeekIndex][0].weekNo + "") {
					for (var dayIndex = 0; dayIndex < this.calArray[calWeekIndex].length; dayIndex++) {
						promises.push(this.initializeDay(calWeekIndex, dayIndex, weekData, this.calArray[calWeekIndex][dayIndex].dayString));
					}
				}
			}

			// adding tasks which are already posted in the backend to each day
			var promise = $q.all(promises);
			promise.then(function(){
				if(backendData.TIMESHEETS.RECORDS) {
			        for (var ISPTaskIterator = 0; ISPTaskIterator < backendData.TIMESHEETS.RECORDS.length; ISPTaskIterator++) {
			            for (var DayIterator = 0; DayIterator < backendData.TIMESHEETS.RECORDS[ISPTaskIterator].DAYS.length; DayIterator++) {
			            	var ISPtask = backendData.TIMESHEETS.RECORDS[ISPTaskIterator];
							var hoursOfWorkingDay = 8;
							if(ISPtask.DAYS[DayIterator].QUANTITY > 0) {
								var task = {};
								task.COUNTER = ISPtask.DAYS[DayIterator].COUNTER;
								task.WORKDATE = ISPtask.DAYS[DayIterator].WORKDATE;
								task.RAUFNR = ISPtask.RAUFNR;
								task.TASKTYPE = ISPtask.TASKTYPE;
								task.ZCPR_EXTID = ISPtask.ZCPR_EXTID;
								task.ZCPR_OBJGEXTID = ISPtask.ZCPR_OBJGEXTID;
								task.STATUS = ISPtask.DAYS[DayIterator].STATUS;
								task.UNIT = ISPtask.UNIT;
								task.QUANTITY = parseFloat(ISPtask.DAYS[DayIterator].QUANTITY);
								task.DESCR = ISPtask.DESCR;
								weekData.days[DayIterator].tasks.push( task );
								if (task.UNIT === 'H') {
									weekData.days[DayIterator].actualTimeInPercentageOfDay += task.QUANTITY / hoursOfWorkingDay;
								} else {
									weekData.days[DayIterator].actualTimeInPercentageOfDay += task.QUANTITY;
								}
								weekData.days[DayIterator].actualTimeInPercentageOfDay = Math.round(weekData.days[DayIterator].actualTimeInPercentageOfDay * 1000) / 1000;
							}
						}
					}
				}
				deferred.resolve(weekData);
			});
		} catch(err) {
			console.log("convertWeekData(): " + err);
		}
		return deferred.promise;
	};

	this.loadDataForSelectedWeeks = function(weeks){
		var promises = [];
		try {
		    var self = this;
			self.reloadInProgress.value = true;
		    weeks.forEach(function(week){
		    	var promise = catsUtils.getCatsAllocationDataForWeek(week.substring(0,4),week.substring(5,7));
		        promises.push(promise);
		    	promise.then(function(data){
					self.reloadInProgress.value = false;
		        	if(data) {
		        		self.convertWeekData(data);
		        	}
		    	});
		    });
		} catch(err) {
			console.log("loadDataForSelectedWeeks(): " + err);
		}
		return $q.all(promises);
	};

	this.getTasksForDate = function(workdate){
		return this.days[workdate].tasks;
	};
}]);