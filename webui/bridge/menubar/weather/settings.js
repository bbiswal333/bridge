angular.module('bridge.app').controller('bridge.menubar.weatherSettingsController', ['$scope', '$http','$filter','$q', 'bridge.menubar.weather.configservice', 'bridgeBuildingSearch', function ($scope, $http, $filter, $q, weatherConfigService, bridgeBuildingSearch)
{
	$scope.currentConfigValues = weatherConfigService.getConfig();

	$scope.searchLocation = function(searchString)
	{
		return bridgeBuildingSearch.searchLocation(searchString);
	};

	$scope.save_click = function ()
	{
		weatherConfigService.setConfig($scope.currentConfigValues);
        $scope.$parent.$hide();
    };

}]);
