angular.module('bridge.app').controller('bridge.menubar.weatherSettingsController', ['$scope', '$http','$filter','$q', 'bridge.menubar.weather.configservice', 'bridgeBuildingSearch', "bridge.menubar.weather.weatherData", function ($scope, $http, $filter, $q, weatherConfigService, bridgeBuildingSearch, weatherData)
{
	$scope.currentConfigValues = weatherConfigService.getConfig();

	$scope.$watch("currentConfigValues", function(newVal, oldVal) {
		if(newVal === oldVal) {
			return;
		}

		weatherConfigService.setConfig($scope.currentConfigValues);
		weatherData.loadData();
	}, true);

	$scope.searchLocation = function(searchString)
	{
		return bridgeBuildingSearch.searchLocation(searchString);
	};
}]);
