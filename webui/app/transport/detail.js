angular.module('app.transport').controller('app.transport.detailController',['$scope', 'app.transport.dataService',
	function Controller($scope, dataService) {
		$scope.$parent.titleExtension = " - Requests Details";

		$scope.transports = {};
		$scope.handleTransports = function() {
			dataService.loadData().then(function() {
				for (var i = 0; i < dataService.data.transportData.OTRANSPORT_LONG.ZDEVDB_OTRP_OUT.length; i++) {
					var transp = dataService.data.transportData.OTRANSPORT_LONG.ZDEVDB_OTRP_OUT;
					$scope.transports[i] = { "trkorr": transp[i].TRKORR, "checksystem": transp[i].CHECKSYSTEM, "chkdate": transp[i].CHKDATE, "text": transp[i].TEXT};
				}
			});
		};
		$scope.handleTransports();
}]);
