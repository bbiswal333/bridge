angular.module('app.jira').appJiraSettings = ['$scope', 'app.jira.configservice', function ($scope, JiraConfig) {    
	$scope.data = {};
     $scope.data.query = JiraConfig.query;

     $scope.save_click = function () {  
        JiraConfig.query = $scope.data.query;
        $scope.$emit('closeSettingsScreen');
    };
    
}];
