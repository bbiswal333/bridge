angular.module('app.transportNew').service("app.transportNew.configService", ['bridgeDataService', function (bridgeDataService) {
	var instances = {};

	var Config = (function() {
		return function(sAppId) {
			this.owners = [];
			this.components = [];
			this.systems = [];
			this.firstOccurence = undefined;
			this.isInitialized = false;

			this.initialize = function() {
				var appConfig = bridgeDataService.getAppConfigById(sAppId);
				if (appConfig !== undefined && appConfig !== {}) {
	                this.owners = angular.copy(appConfig.owners ? appConfig.owners : []);
	                this.components = angular.copy(appConfig.components ? appConfig.components.map(function(component) { if(component.value) { return component; } else { return {exclude: false, value: component}; } } ) : []);
	                this.systems = angular.copy(appConfig.systems ? appConfig.systems.map(function(system) { if(system.value) { return system; } else { return {exclude: false, value: system}; } } ) : []);
	                this.firstOccurence = appConfig.firstOccurence ? new Date(appConfig.firstOccurence) : undefined;
	                this.openTransportThreshold = angular.copy(appConfig.openTransportThreshold ? appConfig.openTransportThreshold : 7);
	            }
	            this.isInitialized = true;
			};
		};
	})();

	this.getInstanceForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config(appId);
		}

		return instances[appId];
	};
}]);
