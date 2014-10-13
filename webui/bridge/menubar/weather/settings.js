angular.module('bridge.app').controller('bridge.menubar.weatherSettingsController', ['$scope', '$http','$filter','$q', 'bridge.menubar.weather.configservice', 'bridgeBuildingSearch', function ($scope, $http, $filter, $q, weatherConfigService, bridgeBuildingSearch)
{
	$scope.currentConfigValues = weatherConfigService.getConfig();

	$scope.$watch("currentConfigValues", function() {
		weatherConfigService.setConfig($scope.currentConfigValues);
	}, true);

	$scope.searchLocation = function(searchString)
	{
		return bridgeBuildingSearch.searchLocation(searchString);
	};
}]);
