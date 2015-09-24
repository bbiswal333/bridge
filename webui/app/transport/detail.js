angular.module('app.transport').controller('app.transport.detailController',['$scope', '$routeParams', 'app.transport.dataService',
	function Controller($scope, $routeParams, dataService) {
		$scope.$parent.titleExtension = " - Requests Details";

		$scope.transports = [];
		$scope.handleTransports = function() {
			dataService.loadData().then(function() {
                var aTransports = null;
                if ($routeParams.transportStatus === "open"){
                    aTransports = dataService.data.transportData.OTRANSPORT_LONG.ZDEVDB_OTRP_OUT;
                } else {
                    aTransports = _.find(dataService.data.transportData.FTRANSPORT_LONG.ZDEVDB_FTRP_OUT, function(transport){
                        return parseInt(transport.NUMBIMPERR) > 0;
                    });
                }
                if (aTransports !== undefined) {
                    $scope.transports.length = 0;
                    for (var i = 0; i < aTransports.length; i++) {
                        $scope.transports.push({ "trkorr": aTransports[i].TRKORR, "checksystem": aTransports[i].CHECKSYSTEM, "checkclient": aTransports[i].CHECKCLIENT, "chkdate": aTransports[i].CHKDATE, "text": aTransports[i].TEXT});
                    }
                }
			});
		};
		$scope.handleTransports();
}]);