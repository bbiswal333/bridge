angular.module('app.employeeSearch', ['bridge.employeeSearch']);

angular.module('app.employeeSearch').directive('app.employeeSearch', function () {

    var directiveController = ['$scope', 'bridgeCounter', function ($scope, bridgeCounter) {
        $scope.boxTitle = "Employee Search";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe806;';
        bridgeCounter.CollectWebStats('EMPLOYEE_SEARCH', 'APPLOAD');
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/employeeSearch/overview.html',
        controller: directiveController
    };
});