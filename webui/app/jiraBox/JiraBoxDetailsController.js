jiraApp.controller('jiraDetailController', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'Config', 'JiraQuery', 'JiraBox',
    function Controller($scope, $http, $filter, $route, $routeParams, ngTableParams, Config, JiraQuery, JiraBox) {
        $scope.$parent.titleExtension = " - Jira Details";
        //JiraBox.getIssuesforQuery(JiraQuery, $scope);
}]);