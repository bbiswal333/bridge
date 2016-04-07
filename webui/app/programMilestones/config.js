angular.module('app.programMilestones').service("app.programMilestones.configFactory", ["bridgeDataService", "app.programMilestones.programFactory", "$timeout", "$q", function(bridgeDataService, programFactory, $timeout, $q) {
	var Config = (function() {
		return function(sAppId) {
			var programs = [];
			var milestoneTypes = ["ALL"];
			var initialized = false;
			var initializedDeferrals = [];

			(function initialize() {
				var config = bridgeDataService.getAppConfigById(sAppId);
				if(config) {
					if(config.programs) {
						config.programs.map(function(program) {
							programs.push(programFactory.createInstance(program.GUID, program.Name, program.isSiriusProgram));
						});
					}
					if(config.milestoneTypes) {
						milestoneTypes.length = 0;
						config.milestoneTypes.map(function(type) {
							milestoneTypes.push(type);
						});
					}

					initialized = true;
					initializedDeferrals.map(function(deferred) {
						deferred.resolve();
					});
				}
			})();

			this.getPrograms = function() {
				return programs;
			};

			this.getMilestoneTypes = function() {
				return milestoneTypes;
			};

			this.enableAllMilestoneTypes = function() {
				milestoneTypes.length = 0;
				milestoneTypes.push("ALL");
			};

			this.allMilestoneTypesActive = function() {
				if(milestoneTypes.length === 1 && milestoneTypes[0] === "ALL") {
					return true;
				} else {
					return false;
				}
			};

			this.toggleMilestoneType = function(sType) {
				if(this.allMilestoneTypesActive()) {
					milestoneTypes.length = 0;
				}

				if(milestoneTypes.indexOf(sType) === -1) {
					milestoneTypes.push(sType);
				} else {
					milestoneTypes.splice(milestoneTypes.indexOf(sType), 1);
					if(milestoneTypes.length === 0) {
						this.enableAllMilestoneTypes();
					}
				}
			};

			this.isMilestoneTypeActive = function(sType) {
				if(this.allMilestoneTypesActive()) {
					return true;
				} else {
					if(milestoneTypes.indexOf(sType) >= 0) {
						return true;
					} else {
						return false;
					}
				}
			};

			this.isInitialized = function() {
				var deferred = $q.defer();
				if(initialized) {
					$timeout(function() {
						deferred.resolve();
					});
				} else {
					initializedDeferrals.push(deferred);
				}
				return deferred.promise;
			};
		};
	})();

	var configObjects = {};

	this.getConfigForAppId = function(sAppId) {
		if(!configObjects[sAppId]) {
			configObjects[sAppId] = new Config(sAppId);

			bridgeDataService.getAppById(sAppId).returnConfig = function() {
				return {
	            	programs: configObjects[sAppId].getPrograms(),
	                milestoneTypes: configObjects[sAppId].getMilestoneTypes()
	            };
			};
        }
		return configObjects[sAppId];
	};
}]);
