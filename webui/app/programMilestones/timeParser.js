angular.module('app.programMilestones').service("app.programMilestones.timeParser", [function() {
	this.parse = function(sDate, sTime) {
		var result = new Date();

		if(sDate && sDate.length === 10) {
			if(sDate === "0000-00-00") {
				result.setFullYear(0);
				result.setMonth(0);
				result.setDate(1);
			} else {
				result.setUTCFullYear(sDate.substring(0, 4));
				result.setUTCMonth(parseInt(sDate.substring(5, 7)) - 1);
				result.setUTCDate(sDate.substring(8, 10));
			}
		}
		if(sTime.length === 8) {
			result.setUTCHours(sTime.substring(0, 2));
			result.setUTCMinutes(sTime.substring(3, 5));
			result.setUTCSeconds(sTime.substring(6, 8));
			result.setUTCMilliseconds(0);
		}
		return result;
	};
}]);
