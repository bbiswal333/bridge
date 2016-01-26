angular.module('app.programMilestones').service("app.programMilestones.programFactory", [function() {
	var Program = (function() {
		return function(sGUID, sName, bIsSiriusProgram) {
			this.getName = function() {
				return sName;
			};
			this.getGUID = function() {
				return sGUID;
			};
			this.isSiriusProgram = function() {
				return bIsSiriusProgram;
			};
			this.toJSON = function() {
				return {
					GUID: this.getGUID(),
					Name: this.getName(),
					isSiriusProgram: this.isSiriusProgram()
				};
			};
		};
	})();

	this.createInstance = function(sGUID, sName, bIsSiriusProgram) {
		return new Program(sGUID, sName, bIsSiriusProgram);
	};
}]);
