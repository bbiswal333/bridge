angular.module('app.programMilestones').service("app.programMilestones.milestoneFactory", ["app.programMilestones.timeParser", function(timeParser) {
	var Milestone = (function() {
		return function(sName, sDate, sTime, oProgram, sDeliveryName, sMilestoneType, sMilestoneTypeText){

			this.getName = function() {
				return sName;
			};
			this.getDate = function() {
				return timeParser.parse(sDate, sTime);
			};
			this.getDateFormatted = function() {
				var date = this.getDate().toISOString();
				return "" + date.substring(8,10) + "/" + date.substring(5,7) + "/" + date.substring(0,4);
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

			this.getMilestoneType = function() {
				return sMilestoneType;
			};

			this.getMilestoneTypeAsStr = function() {
				var typeAsStr = '';
				switch (sMilestoneType){
					case '0714':
					case '0928':
						typeAsStr = 'RTC';
						break;
					case '0702':
					case '0922':
						typeAsStr = "ECC";
						break;
					case '0210':
					case '0932':
						typeAsStr = "CC";
						break;
					case '0108': typeAsStr = "DC";
						break;
					default: typeAsStr = sMilestoneTypeText.substr(0, 15) + (sMilestoneTypeText.length > 15 ? "..." : "");
				}
				return typeAsStr;
			};
		};
	})();

	this.createInstance = function(sName, sDate, sTime, oProgram, sDeliveryName, sMilestoneType, sMilestoneTypeText) {
		return new Milestone(sName, sDate, sTime, oProgram, sDeliveryName, sMilestoneType, sMilestoneTypeText);
	};
}]);
