angular.module('app.programMilestones').service("app.programMilestones.milestoneFactory", ["app.programMilestones.timeParser", function(timeParser) {
	var Milestone = (function() {
		return function(sName, sDate, sTime, oProgram, sDeliveryName) {
			this.getName = function() {
				return sName;
			};
			this.getDate = function() {
				return timeParser.parse(sDate, sTime);
			};
			this.isUpcoming = function() {
				if(this.getDate() > new Date()) {
					return true;
				} else {
					return false;
				}
			};
			this.getProgram = function() {
				return oProgram;
			};

			this.getDeliveryName = function() {
				return sDeliveryName;
			};
		};
	})();

	this.createInstance = function(sName, sDate, sTime, oProgram, sDeliveryName) {
		return new Milestone(sName, sDate, sTime, oProgram, sDeliveryName);
	};
}]);
