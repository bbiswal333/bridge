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


	this.getDataForCurrentMonth = function(){
		var date = calenderUtils.today();
		// a cool way to wait for multiple promises (coding example)
		var promises = [];
		promises.push(this.getMonthData(date.getFullYear(), date.getMonth()));
		this.promise = $q.all(promises);
		return this.promise;
	}

	this.getMonthData = function(year, month){
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
	    };

		var weeks = this.getWeeksOfMonth(year, month);
        for (var i = 0; i < weeks.length; i++) {
        	promise = catsUtils.getCatsAllocationDataForWeek(weeks[i].year, weeks[i].weekNo)
        	promises.push(promise);
        	promise.then(function(data){
	        	if(data) {
	        		var weekData = self.convertWeekData(data);
		        	monthData.weeks.push(weekData);
		        	targetHoursCounter = targetHoursCounter + weekData.hasTargetHoursForHowManyDays;
	        	}
        	});
        }

        promise = $q.all(promises);
        promise.then(function(){
    		if(targetHoursCounter > 27 && targetHoursCounter == 7 * monthData.weeks.length)
    			monthData.hasTargetHours = true;
    		else
    			monthData.hasTargetHours = false;
    		
	        self.months[month] = monthData;
	        delete self.promiseForMonth[month];
        });

        this.promiseForMonth[month] = promise;
        return promise;
	};

	this.getDataForDate = function(date){
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
	    };
	};

	this.getWeeksOfMonth = function(year, month){
		var day = new Date(year, month, 1);
		if (month < 11) {
			var lastDayInMonth = new Date(year, month+1, 1);
		} else {
			var lastDayInMonth = new Date(year+1,0, 1);
		}
		lastDayInMonth.setDate( lastDayInMonth.getDate() - 1 )

		var weeks = [];
		var week  = calenderUtils.getWeekNumber(day);

		if(month == 0 && week.weekNo == 0) { // special case where first week of year is the 52 or 53 of the old year
			var week = calenderUtils.getWeekNumber(new Date(year-1, 11, 31));
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
	};

	this.convertWeekData = function (backendData) {
		var week = backendData.TIMESHEETS.WEEK.substring(0,2);
		var year = backendData.TIMESHEETS.WEEK.substring(3,7);
		var weekData = {};
		weekData.year = year;
		weekData.week = week;
		weekData.hasTargetHoursForHowManyDays = 0;
		weekData.days = [];
		try{
			if(backendData.TIMESHEETS.RECORDS) {
		        for (var ISPTaskIterator = 0; ISPTaskIterator < backendData.TIMESHEETS.RECORDS.length; ISPTaskIterator++) {
		            for (var DayIterator = 0; DayIterator < backendData.TIMESHEETS.RECORDS[ISPTaskIterator].DAYS.length; DayIterator++) {
		            	var ISPtask = backendData.TIMESHEETS.RECORDS[ISPTaskIterator];
		            	if(ISPTaskIterator == 0) { // build the target array in the first place
		            		var day = {};
		            		var HoursOfWorkingDay = 8;
		            		// test test test
		            		//if(ISPtask.DAYS[DayIterator].TARGET) {
			            		day.targetHours = ISPtask.DAYS[DayIterator].TARGET;
							//} else {
							//	day.targetHours = 0;
							//}
		            		day.targetTimeInPercentageOfDay = day.targetHours / HoursOfWorkingDay;
		            		day.date = ISPtask.DAYS[DayIterator].WORKDATE;
		            		day.dayString = ISPtask.DAYS[DayIterator].WORKDATE;
		            		weekData.hasTargetHoursForHowManyDays++;
		            		day.tasks = [];
		            		day.year = year;
		            		day.week = week;
		            		weekData.days.push( day );
		            	}
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
		            		catsUtils.enrichTaskData(task);
		            	}

		            	if (day) {
		            		this.days[day.date] = day;
		            	};
		           	}
		        }
		    }
	    } catch(exception) {
	    	console.log("Exception in convertWeekData(): " + exception);
	    	return null;
	    }
		return weekData;
	};

	this.loadDataForSelectedWeeks = function(weeks){
        var promises = [];
        var self = this;

        weeks.forEach(function(week){
        	var promise = catsUtils.getCatsAllocationDataForWeek(week.substring(0,4),week.substring(5,7));
            promises.push(promise);
        	promise.then(function(data){
	        	if(data) {
	        		self.convertWeekData(data);
	        	}
        	});
        })
        return $q.all(promises);
    }

	this.getTasksForDate = function(workdate){
		return this.days[workdate].tasks;
	}

	this.getDataForCurrentMonth();

}]);