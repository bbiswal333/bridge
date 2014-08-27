angular.module('app.transport', ["app.transport.data"]);
angular.module('app.transport').directive('app.transport', ['app.transport.dataService', function (dataService) {

    var directiveController = ['$scope', '$http', '$interval', function ($scope, $http, $interval)
    {
		$scope.box.boxSize = "1";
		$scope.handleTransports = function() {
			dataService.loadData().then(function() {
				$scope.numOpenTransports = dataService.data.openTransports;
				$scope.numFailedImports = dataService.data.failedTransports;
			});
		};
		$scope.handleTransports();
		$interval($scope.handleTransports(), 5 * 60 * 1000);
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/transport/overview.html',
        controller: directiveController
    };
}]);
