angular.module('app.demo', []);

angular.module('app.demo').directive('app.demo', function () {
	
	console.log('Loading demo app...');
	
    var directiveController = ['$scope', 'bridgeCounter', function ($scope, bridgeCounter) {
        $scope.boxTitle = "Demo App";
        $scope.boxIcon = '&#xe05c;';
        bridgeCounter.CollectWebStats('DEMO', 'APPLOAD');
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/demo/overview.html',
        controller: directiveController
    };
});