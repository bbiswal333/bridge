angular.module("app.cats.monthlyDataModule", ["lib.utils"])
.service("app.cats.monthlyData", 
	["$http", 
	"$q", 
	"lib.utils.calUtils", 
	"app.cats.cat2BackendZDEVDB",
    "$log",
	
	function ($http, $q, calenderUtils, catsBackend, $log) {

	var alreadyInitializedForMonth = {};
	var staticCatsData4FourMonth = null;
	this.days = {};
	this.promiseForMonth = {};
	this.reloadInProgress = { value:false };

	this.getMonthData = function(year, month){
		try {
			var self = this;
			var deferred = $q.defer();
			var promise = null;
			var promises = [];

			// already done or buffered?
			if (!alreadyInitializedForMonth[month] && this.promiseForMonth[month]) {
				return this.promiseForMonth[month]; // return promise which is yet to be resolved
			} 
			else if (alreadyInitializedForMonth[month]) {
				deferred.resolve();
				return deferred.promise; // data already present so simply return a resolved promise
			}

			// not buffered! so getting the data
			this.reloadInProgress.value = true;

			if (!staticCatsData4FourMonth) {
				promise = catsBackend.getCAT2ComplianceData4FourMonth();
				promises.push(promise);
				promise.then(function(data) {
					staticCatsData4FourMonth = data;
				});
			}

			var weeks = this.getWeeksOfMonth(year, month);
			for (var i = 0; i < weeks.length; i++) {
				promise = catsBackend.getCatsAllocationDataForWeek(weeks[i].year, weeks[i].weekNo);
				promises.push(promise);
				promise.then(function(data){
					self.convertWeekData(data);
				});
			}

			promise = $q.all(promises);
			promise.then(function(){
			    alreadyInitializedForMonth[month] = true;
			    delete self.promiseForMonth[month];
			    self.reloadInProgress.value = false;
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
		    $log.log("getWeeksOfMonth(): " + err);
		}
	};

	this.getTargeHoursForDay = function (dayString) {
		var targetHours = 0;
		staticCatsData4FourMonth.some(function (data4day) {
			if (data4day.DATEFROM === dayString) {
				targetHours = data4day.STDAZ;
				return true;
			}
		});
		return targetHours;
	};

	this.getHoursOfWorkingDay = function (dayString) {
		var hoursOfWorkingDay = 0;
		staticCatsData4FourMonth.some(function (data4day) {
			if (data4day.DATEFROM === dayString) {
				hoursOfWorkingDay = data4day.CONVERT_H_T;
				return true;
			}
		});
		return hoursOfWorkingDay;
	};

	this.getTasksForDate = function(dayString){
		return this.days[dayString].tasks;
	};

	this.initializeDaysForWeek = function (weekString) {
		var year = weekString.substring(3,7);
		var week = weekString.substring(0,2);
		// as we can not rely on getting any actual data for the week from the backend,
		// we need to initialize each day with it's actual target hours from the data
		// which we already have in the calendar array
		for (var calWeekIndex = 0; calWeekIndex < this.calArray.length; calWeekIndex++) {
			if (week === this.calArray[calWeekIndex][0].weekNo + "") {
				for (var dayIndex = 0; dayIndex < this.calArray[calWeekIndex].length; dayIndex++) {
					var day = {};
					day.hoursOfWorkingDay = this.getHoursOfWorkingDay(this.calArray[calWeekIndex][dayIndex].dayString);
					day.targetHours = this.getTargeHoursForDay(this.calArray[calWeekIndex][dayIndex].dayString);
					day.targetTimeInPercentageOfDay = Math.round(day.targetHours / day.hoursOfWorkingDay * 1000) / 1000;
					day.actualTimeInPercentageOfDay = 0; // to be calulated only when tasks are added
					day.date = this.calArray[calWeekIndex][dayIndex].dayString;
					day.dayString = this.calArray[calWeekIndex][dayIndex].dayString;
					day.tasks = [];
					day.year = year;
					day.week = week;
					this.days[day.dayString] = day;
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
							this.days[task.WORKDATE].actualTimeInPercentageOfDay = Math.round(this.days[task.WORKDATE].actualTimeInPercentageOfDay * 1000) / 1000;
						}
					}
				}
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
		    	promise.then(function(data){
		        	if(data) {
		        		self.convertWeekData(data);
		        	}
		    	});
		    });
		} catch(err) {
		    $log.log("loadDataForSelectedWeeks(): " + err);
		}
		return $q.all(promises);
	};
}]);