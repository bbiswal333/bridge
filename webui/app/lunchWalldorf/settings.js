angular.module('app.lunchWalldorf').applunchWalldorfSettings = ['$scope', "app.lunchWalldorf.configservice", function ($scope, lunchConfigService) {    
	$scope.currentConfigValues = lunchConfigService.configItem;

    $scope.save_click = function () {  
        $scope.$emit('closeSettingsScreen');
    };
}];