angular.module('app.feedback').service("app.feedback.configService", function () {

	this.values = {
		boxSize : '2',
		delay : '10',
		question: 'What drives success at SAP?',
		count: '0'
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
