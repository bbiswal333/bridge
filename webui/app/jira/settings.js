angular.module('app.jira').appJiraSettings = ['$scope', 'app.jira.configservice', function ($scope, JiraConfig) {
	$scope.data = {};
    $scope.data = JiraConfig;

    $scope.save_click = function () {
        JiraConfig.query = $scope.data.query;
        $scope.$emit('closeSettingsScreen');
    };

    $scope.applyAssignedToMeTemplate = function() {
    	$scope.data.query = "assignee = currentUser()";
    };

    $scope.applyIssuesOfProjectTemplate = function() {
    	$scope.data.query = "project = '...' AND status = Open ORDER BY priority DESC";
    };
}];
