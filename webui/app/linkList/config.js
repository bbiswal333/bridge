angular.module('app.linklist').service("app.linklist.configservice", ["bridgeDataService", function (bridgeDataService) {
	var Config = function() {
		this.data = {
	        version: 1,
	        noNewWindow: false,
	        listCollection: []
	    };

	    this.isInitialized = false;
	};

	var instances = {};

	this.getInstanceForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config();
			bridgeDataService.getAppById(appId).returnConfig = function() {
				var configCopy = angular.copy(instances[appId].data);
	            delete configCopy.boxSize;

	            if(configCopy.listCollection && configCopy.listCollection.length >= 1) {
	                for (var i = configCopy.listCollection.length - 1; i >= 0; i--) {
	                    var linkList = configCopy.listCollection[i];

	                    for (var j = linkList.length - 1; j >= 0; j--){
	                        delete linkList[j].$$hashKey;
	                        delete linkList[j].editable;
	                        delete linkList[j].old;
	                        delete linkList[j].sapGuiFile;
	                        if (!linkList[j].name){
	                            linkList.splice(j, 1);
	                        }
	                    }
	                }
	            }

	            return configCopy;
			};
		}

		return instances[appId];
	};
}]);
