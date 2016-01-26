angular.module('app.programMilestones').service("app.programMilestones.configFactory", ["bridgeDataService", "app.programMilestones.programFactory", function(bridgeDataService, programFactory) {
	var Config = (function() {
		return function(sAppId) {
			var programs = [];

			(function initialize() {
				var config = bridgeDataService.getAppConfigById(sAppId);
				if(config && config.programs) {
					config.programs.map(function(program) {
						programs.push(programFactory.createInstance(program.GUID, program.Name, program.isSiriusProgram));
					});
				}
			})();

			this.getPrograms = function() {
				return programs;
			};
		};
	})();

	var configObjects = {};

	this.getConfigForAppId = function(sAppId) {
		if(!configObjects[sAppId]) {
			configObjects[sAppId] = new Config(sAppId);
		}
		return configObjects[sAppId];
	};
}]);
