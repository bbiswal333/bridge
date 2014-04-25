angular.module('app.jira').appJiraSettings = ['$scope', '$http', 'bridgeConfig', 'app.jira.configservice', function ($scope, $http, bridgeConfig, JiraConfig) {    
	$scope.data = {};
     $scope.data.query = JiraConfig.query;

     $scope.save_click = function () {  
        JiraConfig.query = $scope.data.query;
        bridgeConfig.modalInstance.close();
    };
    
}];
