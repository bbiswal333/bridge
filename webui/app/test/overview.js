angular.module('app.test', []);

angular.module('app.test').directive('app.test', function () {

    var directiveController = ['$scope', 'bridgeCounter', function ($scope, bridgeCounter) {
        $scope.boxTitle = "Test App";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;';
        bridgeCounter.CollectWebStats('TEST', 'APPLOAD');
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/test/overview.html',
        controller: directiveController
    };
});