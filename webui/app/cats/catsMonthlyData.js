angular.module("app.cats.monthlyDataModule", ["lib.utils"])
.service("app.cats.monthlyData", ["$http", "$q", "lib.utils.calUtils",  function($http, $q, calenderUtils){
	this.getMonthData = function(year, month){
		var weeks = this.getWeeksOfMonth(year, month);
	};

	this.getWeeksOfMonth = function(year, month){
		var firstWeek = calenderUtils.getWeekNumber(new Date(year, month, 1));
		var weeks = [];
		weeks.push(angular.copy(firstWeek));
		firstWeek.weekNo++;
		weeks.push(angular.copy(firstWeek));
		firstWeek.weekNo++;
		weeks.push(angular.copy(firstWeek));
		firstWeek.weekNo++;
		weeks.push(angular.copy(firstWeek));
		firstWeek.weekNo++;
		weeks.push(angular.copy(firstWeek));
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
		            		weekData.hasTargetHoursForHowManyDays++;
		            		day.tasks = [];
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
		            		weekData.days[DayIterator].tasks.push( task );
		            	}
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
}]);

