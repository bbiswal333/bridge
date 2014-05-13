angular.module('app.employeeSearch', ['bridge.employeeSearch']);

angular.module('app.employeeSearch').directive('app.employeeSearch', function () {

    var directiveController = ['$scope', 'bridgeCounter', function ($scope, bridgeCounter) {        
        $scope.boxSize = "2";        
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/employeeSearch/overview.html',
        controller: directiveController
    };
});