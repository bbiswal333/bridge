angular.module('app.dumps').service("app.dumps.configservice", ['bridgeDataService', function (bridgeDataService) {
	var Config = function(oConfigItem) {
		if(oConfigItem.kpi != null) {
			this.configItem = oConfigItem;
		} else {
			this.configItem = {
				boxSize : '1',
				system : 'PROD',
				components : '',
				kpi: 'Dumps'
			};
		}

		this.getUrl = function() {
			return (this.configItem.system && this.configItem.system === "PROD") ? 'https://reporting.byd.sap.corp/sap' : 'https://vns.wdf.sap.corp/sap';
		};

		this.getSystemName = function() {
			return ((this.configItem.system === "PROD") ? "Prod" : "Verilab" ).split("");
		};

		this.getKpi = function() {
			return ((this.configItem.kpi === "Dumps") ? "Dumps" : "SysAvail").split("");
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
