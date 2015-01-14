angular.module('app.bwPcStatus').service("app.bwPcStatus.configService", function () {

	this.values = {
		boxSize : '2',
		contents: []
	};

	this.initialize = function(configLoadedFromBackend) {
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
	};
});
