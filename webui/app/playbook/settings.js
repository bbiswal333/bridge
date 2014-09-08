angular.module('app.playbook').appplaybookSettings =
['$scope', "app.playbook.configservice", function ($scope, lunchConfigService) {
	$scope.currentConfigValues = lunchConfigService.configItem;

    $scope.save_click = function () {
        $scope.$emit('closeSettingsScreen');
    };
}];
