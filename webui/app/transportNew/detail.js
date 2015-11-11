angular.module('app.transportNew').controller('app.transportNew.detailController',['$scope', '$routeParams', 'app.transportNew.dataService', 'app.transportNew.configService',
	function Controller($scope, $routeParams, dataService, configService) {
		$scope.$parent.titleExtension = " - Requests Details";

        var transportData = dataService.getInstanceFor($routeParams.appId);
        var transportConfig = configService.getInstanceForAppId($routeParams.appId);
        if(!transportConfig.isInitialized) {
        	transportConfig.initialize();
        }

        if(!transportData.openTransports) {
        	transportData.loadData(transportConfig).then(function() {
        		$scope.transports = transportData.openTransports;
        	});
        } else {
        	$scope.transports = transportData.openTransports;
        }
}]);
