angular.module('app.employeeSearch', ['bridge.employeeSearch']);

angular.module('app.employeeSearch').directive('app.employeeSearch', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Employee Search";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe036';
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/employeeSearch/overview.html',
        controller: directiveController
    };
});