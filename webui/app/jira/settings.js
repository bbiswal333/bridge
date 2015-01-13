angular.module('app.jira').appJiraSettings = ['$scope', 'app.jira.configservice', function ($scope, JiraConfig) {
	var config = JiraConfig.getConfigInstanceForAppId($scope.boxScope.metadata.guid).getConfig();
    $scope.data = config;

    $scope.save_click = function () {
        config.query = $scope.data.query;
        $scope.$emit('closeSettingsScreen');
    };

    $scope.applyAssignedToMeTemplate = function() {
        $scope.toMeTemplate = true;
        $scope.projectTemplate = false;
    	$scope.data.query = "assignee = currentUser()";
    };

    $scope.applyIssuesOfProjectTemplate = function() {
        $scope.projectTemplate = true;
        $scope.toMeTemplate = false;
    	$scope.data.query = "project = '...' AND status = Open ORDER BY priority DESC";
    };
}];
