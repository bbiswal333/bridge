angular.module('app.internalIncidentsMitosis').service("app.internalIncidentsMitosis.configService", ['bridgeDataService', '$http', 'bridge.AKHResponsibleFactory', function (bridgeDataService, $http, AKHResponsibleFactory) {
	var instances = {};

	var Config = (function() {
		return function(sAppId) {
			this.programs = [];
			this.components = [];
			this.systems = [];
			this.isInitialized = false;
			this.processors = [];
			this.akhResponsibles = [];
			this.detailsColumnVisibility = [false, true, true, true, true, true, false, false, true, true, false, false];
			this.columnOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

			function checkProgramSystems(program) {
				var programSystemsLengthAtStart = program.SYSTEMS.length;
				$http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_SYSTEMS_FOR_PROGRAM?PRG_ID=" + program.TP_PROGRAM).then(function(result) {
					result.data.SYSTEMS.map(function(system) {
						for(var i = 0, length = program.SYSTEMS.length; i < length; i++) {
							if(program.SYSTEMS[i].value === system.SYS_ID) {
								return;
							}
						}
						if(programSystemsLengthAtStart === 0) {
							program.SYSTEMS.push({value: system.SYS_ID});
						} else {
							program.SYSTEMS.push({value: system.SYS_ID, exclude: true});
						}
					});
				});
			}

			this.initialize = function() {
				var appConfig = bridgeDataService.getAppConfigById(sAppId);
				if (appConfig !== undefined && appConfig !== {}) {
	                this.programs = angular.copy(appConfig.programs ? appConfig.programs : []);

	                this.programs.map(function(program) {
	                	if(program.SYSTEMS.length > 0) {
	                		program.SYSTEMS = program.SYSTEMS.map(function(system) {
	                			if(system.value) {
	                				return system;
	                			} else {
	                				return {value: system};
	                			}
	                		});
	                	}
	                });

	                this.components = angular.copy(appConfig.components ? appConfig.components.map(function(component) {
	                	if(component.value) {
	                		return component;
	                	} else {
	                		return {value: component};
	                	}
	                }) : []);
	                this.excludeSystems = appConfig.excludeSystems;
	                this.excludeProcessors = appConfig.excludeProcessors;
	                this.systems = angular.copy(appConfig.systems ? appConfig.systems : []);
	                this.processors = angular.copy(appConfig.processors ? appConfig.processors : []);
	                this.akhResponsibles = angular.copy(appConfig.akhResponsibles ? appConfig.akhResponsibles.map(function(responsible) { return AKHResponsibleFactory.createInstance(responsible.property, responsible.userId); }) : []);
	    			this.detailsColumnVisibility = appConfig.detailsColumnVisibility ? appConfig.detailsColumnVisibility : [false, true, true, true, true, true, false, false, true, true, false, false];
	    			this.columnOrder = appConfig.columnOrder ? appConfig.columnOrder : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

	    			this.programs.map(function(program) {
	    				checkProgramSystems(program);
	    			});
	            }
	            this.isInitialized = true;
			};

			this.addProgram = function(program) {
				this.programs.push(program);
				program.SYSTEMS = [];
				checkProgramSystems(program);
			};
		};
	})();

	this.getInstanceForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config(appId);
			bridgeDataService.getAppById(appId).returnConfig = function() {
				return angular.copy(instances[appId]);
			};
		}

		return instances[appId];
	};
}]);
