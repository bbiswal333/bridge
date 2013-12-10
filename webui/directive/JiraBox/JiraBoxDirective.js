bridgeApp.directive('jirabox', function () {

    var directiveController = ['$scope', 'JiraBox', 'JiraQuery', function ($scope, JiraBox, JiraQuery) {
	
        JiraBox.getIssuesforQuery(JiraQuery, $scope);

    }];

    return {
        restrict: 'E',
        templateUrl: 'directive/JiraBox/JiraBoxDirective.html',
        controller: directiveController
    };
});