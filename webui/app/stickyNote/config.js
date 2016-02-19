angular.module('app.stickyNote').service("app.stickyNote.configService", 
	['bridgeDataService', 'bridge.AKHResponsibleFactory', 
	function (bridgeDataService, AKHResponsibleFactory) {

	var instances = {};

	var Config = (function() {
		return function(sAppId) {
			this.boxSize = [];
			this.color = [];
			this.comment = [];
			
			this.initialize = function() {
				var appConfig = bridgeDataService.getAppConfigById(sAppId);
				if (appConfig !== undefined && appConfig !== {}) {
	                this.boxSize = angular.copy(appConfig.boxSize ? appConfig.boxSize : '1');
	                this.color = angular.copy(
	                	(appConfig.color ?
	                		(appConfig.color.length > 0 ? appConfig.color : "#000000") : appConfig.color="#000000" ));
	                this.comment = angular.copy(appConfig.comment ? appConfig.comment : 'New Sticky Note');
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