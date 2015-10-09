angular.module('app.dumps').appDumpsSettings =
['$scope', "app.dumps.configservice",
	function ($scope, dumpsConfigService) {
	$scope.currentConfigValues = dumpsConfigService.getConfigForAppId($scope.boxScope.metadata.guid);

	$scope.values = [{
	  id: 1,
	  label: 'aLabel'
	  }, {
	  id: 2,
	  label: 'bLabel'
	}];

	$scope.selected = { name: 'aSubItem' };

    $scope.save_click = function () {
        $scope.$emit('closeSettingsScreen');
    };
    $scope.getLocationName = function(object, index){
    	return Object.getOwnPropertyNames(object)[index];
    };
}];
