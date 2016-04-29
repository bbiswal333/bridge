angular.module('app.programMilestones').service("app.programMilestones.configFactory", ["bridgeDataService", "app.programMilestones.programFactory", "$timeout", "$q", function(bridgeDataService, programFactory, $timeout, $q) {
	var Config = (function() {
		return function(sAppId) {
			var programs = [];
			var milestoneTypes = ["ALL"];
			var initialized = false;
			var initializedDeferrals = [];
			var tableSettings = {};

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

					tableSettings = config.tableSettings ? config.tableSettings : {};

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
				if(milestoneTypes.length >= 1 && milestoneTypes.indexOf("ALL") > -1 ) {
					return true;
				} else {
					return false;
				}
			};

			this.toggleMilestoneType = function(sType) {
				var that = this;
				if(this.allMilestoneTypesActive()) {
					milestoneTypes.length = 0;
				}
				if( typeof sType === 'string' ) {
					sType = [ sType ];
				}
				sType.forEach(function(entry){
					if(milestoneTypes.indexOf(entry) === -1) {
						milestoneTypes.push(entry);
					} else {
						milestoneTypes.splice(milestoneTypes.indexOf(entry), 1);
						if(milestoneTypes.length === 0) {
							that.enableAllMilestoneTypes();
						}
					}
				});
			};

			this.isMilestoneTypeActive = function(sType) {
				var milestoneTypeIsActive = false;
				if(this.allMilestoneTypesActive()) {
					milestoneTypeIsActive = true;
				} else {
					if( typeof sType === 'string' ) {
						sType = [ sType ];
					}
					for(var sValue in sType){
						if(milestoneTypes.indexOf(sType[sValue]) >= 0){
							milestoneTypeIsActive = true;
						}
					}
				}
				return milestoneTypeIsActive;
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

			this.getTableSettings = function() {
				return tableSettings;
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
	                milestoneTypes: configObjects[sAppId].getMilestoneTypes(),
	                tableSettings: configObjects[sAppId].getTableSettings()
	            };
			};
        }
		return configObjects[sAppId];
	};
}]);
