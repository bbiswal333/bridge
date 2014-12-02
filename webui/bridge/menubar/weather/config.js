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
				configItem.location = {
					name: "Walldorf",
					latitude: 49.293351,
					longitude: 8.641992
				};
				deferred.resolve();
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
