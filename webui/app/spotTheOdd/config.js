angular.module('app.spotTheOdd').service("app.spotTheOdd.configService", ["bridgeDataService", function (bridgeDataService) {

	this.values = {
		comp : '7'
	};

	this.initialize = function(configLoadedFromBackend) {
		if (configLoadedFromBackend !== undefined &&
			configLoadedFromBackend !== {} &&
			configLoadedFromBackend.values) {
			// Standard case: Get config from backend
			this.values = configLoadedFromBackend.values;
		} else {
			// Use default config on first load
			configLoadedFromBackend.values = this.values;
		}
	};

	var that = this;
	bridgeDataService.getAppsByType("app.spotTheOdd")[0].returnConfig = function() {
		return that;
	};
}]);
