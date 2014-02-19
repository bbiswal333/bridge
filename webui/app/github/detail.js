angular.module('app.github').controller('app.github.detailController', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams',
    function Controller($scope, $http, $filter, $route, $routeParams, ngTableParams) {
        $scope.$parent.titleExtension = " - Github Details";


    	$http({method: 'GET', url: 'https://github.wdf.sap.corp/api/v3/repos/Tools/bridge/issues?state=open&per_page=50'}).
            success(function(data, status, headers, config) {
                $scope.openIssues = data;
           
            }).error(function(data, status, headers, config) {});
       
}]);