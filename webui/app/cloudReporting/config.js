angular.module('app.cloudReporting').service("app.cloudReporting.configservice", ['bridgeDataService', function (bridgeDataService) {
	var Config = function(oConfigItem) {
		if(oConfigItem.boxSize != null) {
			this.configItem = oConfigItem;
		} else {
			this.configItem = {
				boxSize : '1',
				system : 'PROD',
                kpis: ''
			};
		}

        this.getKpis = function() {
            return (this.configItem.kpis);
        };

        this.getUrl = function() {
            return (this.configItem.system && this.configItem.system === "PROD") ? 'https://reporting.ondemand.com/sap' : 'https://vns.wdf.sap.corp/sap';
        };

		this.getSystemName = function() {
			return ((this.configItem.system === "PROD") ? "Prod" : "Verilab" ).split("");
		};

	};

	var instances = {};
	this.getConfigForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config(bridgeDataService.getAppConfigById(appId));
		}
		return instances[appId];
	};
}]);

