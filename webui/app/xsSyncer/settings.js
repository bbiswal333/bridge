angular.module('app.xsSyncer').appXsSyncerSettings = ['$scope', 'app.xsSyncer.dataService', function ($scope, dataService)
{
	$scope.currentConfigValues = dataService.getConfig();

	$scope.save_click = function ()
	{
		dataService.setConfig($scope.currentConfigValues);
        $scope.$emit('closeSettingsScreen');
    };

}];
