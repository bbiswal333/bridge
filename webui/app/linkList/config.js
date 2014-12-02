angular.module('app.linklist').service("app.linklist.configservice", function () {
	var Config = function() {
		this.data = {
	        version: 1,
	        listCollection: []
	    };

	    this.isInitialized = false;
	};

	var instances = {};

	this.getInstanceForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config();
		}

		return instances[appId];
	};
});
