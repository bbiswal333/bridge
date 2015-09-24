angular.module('app.transportNew').controller('app.transportNew.detailController',['$scope', '$routeParams', 'app.transportNew.dataService',
	function Controller($scope, $routeParams, dataService) {
		$scope.$parent.titleExtension = " - Requests Details";

        var transportData = dataService.getInstanceFor($routeParams.appId);
		$scope.transports = transportData.openTransports;
}]);
