angular.module('bridge.app').service("bridge.menubar.weather.configservice", ['bridgeDataService', 'bridgeBuildingSearch', '$q', function (bridgeDataService, bridgeBuildingSearch, $q)
{
	var that = this;

	//default value
	var configItem =
	{
		fahrenheit : false,
		location:
		{
			name: "Walldorf",
			latitude: 49.293351,
			longitude: 8.641992
		}
	};

	var deferred = $q.defer();
	bridgeDataService.initialize(deferred).then(function() {
		if(bridgeDataService.getBridgeSettings().weatherConfig) {
			that.setConfig(bridgeDataService.getBridgeSettings().weatherConfig);
		}
	});

	//initialization method
	this.init = function()
	{
		var deferred = $q.defer();
		var building = "WDF01";
		if (typeof bridgeDataService.getUserInfo() !== "undefined")
		{
			building = bridgeDataService.getUserInfo().BUILDING;
		}
		bridgeBuildingSearch.searchLocationbyBuilding(building).then(function (result)
		{
			if(result !== undefined)
			{
				configItem.location = result;
			}
			deferred.resolve();
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
