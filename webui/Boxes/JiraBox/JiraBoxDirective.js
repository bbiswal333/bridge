dashboardBox.directive('jirabox', function () {

    var directiveController = ['$scope', 'JiraDataProvider', 'JiraQuery', function ($scope, JiraDataProvider, JiraQuery) {
	
        JiraDataProvider.getIssuesforQuery(JiraQuery, $scope);

    }];

    return {
        restrict: 'E',
        templateUrl: 'boxes/JiraBox/JiraBox.html',
        controller: directiveController
    };
});