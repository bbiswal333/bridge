angular.module('app.transportNew').service("app.transportNew.configService", ['bridgeDataService', 'bridge.AKHResponsibleFactory', function (bridgeDataService, AKHResponsibleFactory) {
	var instances = {};

	function getDefaultOwner() {
		var userInfo = bridgeDataService.getUserInfo();
		return {label: userInfo.VORNA + " " + userInfo.NACHN, selector: userInfo.BNAME + ";" + userInfo.SAPNA};
	}

	var Config = (function() {
		return function(sAppId) {
			this.owners = [getDefaultOwner()];
			this.components = [];
			this.systems = [];
			this.firstOccurence = undefined;
			this.isInitialized = false;
			this.akhResponsibles = [];
			this.columnOrder = [0, 1, 2, 3, 4, 5];

			this.initialize = function() {
				var appConfig = bridgeDataService.getAppConfigById(sAppId);
				if (appConfig !== undefined && appConfig !== {}) {
	                this.owners = angular.copy(appConfig.owners ? appConfig.owners : [getDefaultOwner()]);
	                this.akhResponsibles = angular.copy(appConfig.akhResponsibles ? appConfig.akhResponsibles.map(function(responsible) { return AKHResponsibleFactory.createInstance(responsible.property, responsible.userId); }) : []);
	                this.components = angular.copy(appConfig.components ? appConfig.components.map(function(component) { if(component.value) { return component; } else { return {exclude: false, value: component}; } } ) : []);
	                this.systems = angular.copy(appConfig.systems ? appConfig.systems.map(function(system) { if(system.value) { return system; } else { return {exclude: false, value: system}; } } ) : []);
	                this.firstOccurence = appConfig.firstOccurence ? new Date(appConfig.firstOccurence) : undefined;
	                this.openTransportThreshold = angular.copy(appConfig.openTransportThreshold ? appConfig.openTransportThreshold : 7);
	                this.columnOrder = angular.copy(appConfig.columnOrder ? appConfig.columnOrder : [0, 1, 2, 3, 4, 5]);
	            }
	            this.isInitialized = true;
			};
		};
	})();

	this.getInstanceForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config(appId);
			bridgeDataService.getAppById(appId).returnConfig = function() {
				return instances[appId];
			};
		}

		return instances[appId];
	};
}]);
