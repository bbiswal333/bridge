angular.module('app.transportNew').controller('app.transportNew.detailController',['$scope', '$routeParams', 'app.transportNew.dataService', 'app.transportNew.configService', '$window',
	function Controller($scope, $routeParams, dataService, configService, $window) {
		$scope.$parent.titleExtension = " - Requests Details";

        var transportData = dataService.getInstanceFor($routeParams.appId);
        var transportConfig = configService.getInstanceForAppId($routeParams.appId);

        function setTransports() {
                if($routeParams.category === "open") {
                        $scope.transports = transportData.openTransports;
                } else {
                        $scope.transports = transportData.transportsOpenForLongerThanThreshold;
                }
        }

        if(!transportConfig.isInitialized) {
        	transportConfig.initialize();
        }

        if(!transportData.openTransports) {
        	transportData.loadData(transportConfig).then(function() {
        		setTransports();
        	});
        } else {
        	setTransports();
        }

        $scope.goToTransport = function(transport) {
                $window.open("https://ifp.wdf.sap.corp/sap/bc/bsp/sap/ZBRIDGE_BSP/saplink.sap?sid=" + transport.SOURCE_SYSTEM +
                    "&client=" + transport.SOURCE_CLIENT + "&transaction=*SE01&parameters=TRDYSE01SN-TR_TRKORR=" + transport.ID);
        };
}]);
