angular.module('app.moodBarometer').service("app.moodBarometer.configService", ["bridgeDataService", function (bridgeDataService) {

	this.values = {
        boxSize : 2
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
	bridgeDataService.getAppsByType("app.moodBarometer")[0].returnConfig = function() {
		return that;
	};
}]);
