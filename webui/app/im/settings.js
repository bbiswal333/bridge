angular.module('app.im').appImSettings = ['$scope', 'app.im.configservice', function ($scope, configservice) {
	$scope.config = configservice;

     $scope.save_click = function () {
        //JiraConfig.query = $scope.data.query;
        $scope.$emit('closeSettingsScreen');
    };

}];
