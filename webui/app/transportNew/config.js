angular.module('app.transportNew').service("app.transportNew.configService", function () {
	var instances = {};

	this.getInstanceForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = {owners: [], components: [], isInitialized: false};
		}

		return instances[appId];
	};
});
