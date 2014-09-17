angular.module('bridge.app').appWeatherSettings = ['$scope', '$http','$filter','$q', 'app.weather.configservice', 'bridgeBuildingSearch', function ($scope, $http, $filter, $q, weatherConfigService, bridgeBuildingSearch)
{
	$scope.currentConfigValues = weatherConfigService.configItem;

	$scope.searchLocation = function(searchString)
	{
		return bridgeBuildingSearch.searchLocation(searchString);
	};

	$scope.save_click = function ()
	{
		weatherConfigService.configItem = $scope.currentConfigValues;
        $scope.$emit('closeSettingsScreen');
    };

}];
