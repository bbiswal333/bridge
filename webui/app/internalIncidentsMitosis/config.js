angular.module('app.internalIncidentsMitosis').service("app.internalIncidentsMitosis.configService", ['bridgeDataService', function (bridgeDataService) {
	var instances = {};

	var Config = (function() {
		return function(sAppId) {
			this.programs = [];
			this.components = [];
			this.systems = [];
			this.isInitialized = false;
			this.processors = [];
			this.detailsColumnVisibility = [false, true, true, true, true, true, false, false, true, true, false, false];

			this.initialize = function() {
				var appConfig = bridgeDataService.getAppConfigById(sAppId);
				if (appConfig !== undefined && appConfig !== {}) {
	                this.programs = angular.copy(appConfig.programs ? appConfig.programs : []);
	                this.components = angular.copy(appConfig.components ? appConfig.components : []);
	                this.systems = angular.copy(appConfig.systems ? appConfig.systems : []);
	                this.processors = angular.copy(appConfig.processors ? appConfig.processors : []);
	    			this.detailsColumnVisibility = appConfig.detailsColumnVisibility ? appConfig.detailsColumnVisibility : [false, true, true, true, true, true, false, false, true, true, false, false];
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
