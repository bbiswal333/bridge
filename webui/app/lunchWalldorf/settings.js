angular.module('app.lunchWalldorf').applunchWalldorfSettings =
['$scope', "app.lunchWalldorf.configservice", "app.lunchWalldorf.backendData", function ($scope, lunchConfigService, backendService) {
	$scope.currentConfigValues = lunchConfigService.configItem;

    $scope.backendData = backendService.getBackendData();

    $scope.save_click = function () {
        $scope.$emit('closeSettingsScreen');
    };
    $scope.getLocationName = function(object, index){
    	return Object.getOwnPropertyNames(object)[index];
    };
}];
