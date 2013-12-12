bridgeApp.directive('jirabox', function () {

    var directiveController = ['$scope', 'JiraBox', 'JiraQuery', function ($scope, JiraBox, JiraQuery) {
	
        JiraBox.getIssuesforQuery(JiraQuery, $scope);

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/jiraBox/JiraBoxDirective.html',
        controller: directiveController
    };
});