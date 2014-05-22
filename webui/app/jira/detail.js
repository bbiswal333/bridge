angular.module('app.jira').controller('app.jira.detailController', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'JiraBox', 'app.jira.configservice',
    function Controller($scope, $http, $filter, $route, $routeParams, ngTableParams, JiraBox, JiraConfig) {

        $scope.$watch('JiraConfig.query', function() {
        	$scope.config = JiraConfig;
            JiraBox.getIssuesforQuery($scope);
        },true);

        $scope.$parent.titleExtension = " - Jira Details";        
}]);