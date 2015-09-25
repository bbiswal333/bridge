angular.module('app.transport', ["app.transport.data"]);
angular.module('app.transport').directive('app.transport', ['app.transport.dataService', function (dataService) {

	var directiveController = ['$scope', function ($scope)
	{
		$scope.box.boxSize = "1";
		$scope.handleTransports = function() {
			dataService.loadData().then(function() {
				$scope.numOpenTransports = dataService.data.openTransports;
				$scope.numFailedImports = dataService.data.failedTransports;
			});
		};
		$scope.handleTransports();
		$scope.box.reloadApp($scope.handleTransports, 60 * 5);
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/transport/overview.html',
		controller: directiveController
	};
}]);
