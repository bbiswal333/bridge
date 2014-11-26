angular.module('app.spottheodd').service("app.spottheodd.configService", function () {

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
});
