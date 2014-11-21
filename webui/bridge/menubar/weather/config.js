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

		function applyWeatherSettings(){
			if (bridgeDataService.getBridgeSettings().weatherConfig) {
				that.setConfig(bridgeDataService.getBridgeSettings().weatherConfig);
				deferred.resolve();
			} else {
				var building = "WDF01";
				bridgeBuildingSearch.searchLocationbyBuilding(building).then(function (result) {
					if (result !== undefined) {
						configItem.location = result;
					}
					deferred.resolve();
				});
			}
		}

		if (!bridgeDataService.isInitialized()) {
			bridgeDataService.initialize(dataServiceDeferred).then(function () {
				applyWeatherSettings();
			});
		} else {
			applyWeatherSettings();
		}
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
