angular.module('app.bwPcStatus').service("app.bwPcStatus.configService", ["bridgeDataService", function (bridgeDataService) {

	this.values = {
		boxSize : '2',
		contents: []
	};

	this.initialize = function(sAppId) {
		var configLoadedFromBackend = bridgeDataService.getAppConfigById(sAppId);
		if (configLoadedFromBackend !== undefined &&
			configLoadedFromBackend !== {} &&
			configLoadedFromBackend.values) {
			// Standard case: Get config from backend
			this.values = configLoadedFromBackend.values;
			//console.log(this.values);
		} else {
			// Use default config on first load
			configLoadedFromBackend.values = this.values;
		}

		bridgeDataService.getAppById(sAppId).returnConfig = function() {
			return angular.copy(this);
		};
	};
}]);
