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


	this.getAllAvailableMonths = function(){
		var date = calenderUtils.today();
		var promises = [];

		this.months = {};
		for( var i = 0; i < 4; i++){
			promises.push(this.getMonthData(date.getFullYear(), date.getMonth(), function(data){}));
			date.setMonth(date.getMonth() - 1);
		}
		this.promise = $q.all(promises);
		return this.promise;
	}

	this.getMonthData = function(year, month, callback){
		var monthData = {};
		var self = this;
		monthData.weeks = [];
		var promise = null;
		var promises = [];
	    var targetHoursCounter = 0;

	    if (!this.months[month] && this.promise) {
	    	this.promise.then(function(){
	    		callback(self.months[month]);
	    	});
	    	return promise;
	    } 
	    else if (this.months[month]) {
	    	callback(this.months[month]);
	    	return null;
	    };

		var weeks = this.getWeeksOfMonth(year, month);
        for (var i = 0; i < weeks.length; i++) {
        	promise = this.getWeeklyData(weeks[i].year, weeks[i].weekNo);
        	promises.push(promise);
        	promise.then(function(data){
	        	if(data) {
		        	monthData.weeks.push(data);
		        	targetHoursCounter = targetHoursCounter + data.hasTargetHoursForHowManyDays;
	        	}
        	});
        }

        promise = $q.all(promises);
        promise.then(function(){
    		if(targetHoursCounter > 27 && targetHoursCounter == 7 * monthData.weeks.length) {
    			monthData.hasTargetHours = true;
    		} else {
    			monthData.hasTargetHours = false;
    		}
	        callback(monthData);
	        self.months[month] = monthData;
        });

        return promise;
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

	this.convertWeekData = function (backendData, year, week) {
		if(!backendData || !year || !week) {
			console.log("convertWeekData() at least one import parameter is empty.");
			return null;
		}

		if (backendData.TIMESHEETS.WEEK != week + "." + year){
			console.log("convertWeekData() data does not correspond to given week and year.");
			return null;
		}

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
		            		day.targetHours = ISPtask.DAYS[DayIterator].TARGET;
		            		day.date        = ISPtask.DAYS[DayIterator].WORKDATE;
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

	this.getWeeklyData = function (year, week) {
	    var deferred = $q.defer();
	    var that = this;
	    $http.get('https://isp.wdf.sap.corp/sap/bc/zdevdb/GETCATSDATA?format=json&origin=' + location.origin + '&week=' + year + '.' + week)
	    .success(function (data) {
	        deferred.resolve(that.convertWeekData(data, year, week));
	    });
	    return deferred.promise;
	};

	this.getTasksForDate = function(workdate){
		var tasks = [];
		var dayFound = false;
		this.months[workdate.substring(5,7)-1].weeks.some(function(week){
			week.days.some(function(day){
				if (day.date === workdate) {
					dayFound = true;
					tasks = day.tasks;
				};
				return dayFound;
			})
			return dayFound;
		})
		return tasks;
	}

	this.getAllAvailableMonths();

}]);

