angular.module('app.jenkins').appJenkinsSettings =
['$scope', "app.jenkins.configservice", function ($scope, jenkinsConfigService) {    
	$scope.currentConfigValues = jenkinsConfigService.configItem;

    $scope.save_click = function () {  
        $scope.$emit('closeSettingsScreen');
    };
}];