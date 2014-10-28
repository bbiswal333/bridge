angular.module('bridge.app').service("bridge.menubar.weather.configservice", ['bridgeDataService', 'bridgeBuildingSearch', '$q', function (bridgeDataService, bridgeBuildingSearch, $q)
{
	var that = this;

	var configItem =
	{
		fahrenheit : false,
		location: {}
	};

	this.initialize = function() {
		var dataServiceDeferred = $q.defer();
		var deferred = $q.defer();
		bridgeDataService.initialize(dataServiceDeferred).then(function() {
			if(bridgeDataService.getBridgeSettings().weatherConfig) {
				that.setConfig(bridgeDataService.getBridgeSettings().weatherConfig);
				deferred.resolve();
			} else {
				var building = "WDF01";
				bridgeBuildingSearch.searchLocationbyBuilding(building).then(function(result) {
					if(result !== undefined)
					{
						configItem.location = result;
					}
					deferred.resolve();
				});
			}
		});
		return deferred.promise;
	};

	this.getConfig = function() {
		return configItem;
	};
	this.setConfig = function(config) {
		configItem.location = config.location;
		configItem.fahrenheit = config.fahrenheit;
		bridgeDataService.getBridgeSettings().weatherConfig = configItem;
	};

}]);
