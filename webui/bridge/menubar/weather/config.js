angular.module('bridge.app').service("bridge.menubar.weather.configservice", ['bridgeDataService', 'bridgeBuildingSearch', '$q', function (bridgeDataService, bridgeBuildingSearch, $q)
{
	var that = this;

	//default value
	this.configItem =
	{
		fahrenheit : false,
		location:
		{
			name: "Walldorf",
			latitude: 49.293351,
			longitude: 8.641992
		}
	};

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
				that.configItem.location = result;
			}
			deferred.resolve();
		});
		return deferred.promise;
	};

}]);
