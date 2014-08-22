angular.module('app.transport').controller('app.transport.detailController', ['$scope', '$http', '$routeParams' , 
    function Controller($scope, $http, $routeParams) {

        $scope.$parent.titleExtension = " - Requests Details";
       
        // if (configservice.isInitialized === false) {
        	// configservice.initialize($routeParams.appId);
        // }
		
		$scope.url = "https://ifp.wdf.sap.corp/sap/bc/devdb/MYTRANSPORTS?origin=' + location.origin ";
		//$scope.url = "https://ifp.wdf.sap.corp/sap/bc/devdb/MYTRANSPORTS?origin=https://localhost:8000"; to test locally
		
		$scope.transports = {};
		$scope.handleTransports = function() {
			$http.get($scope.url)
				.success(function(data){
					data = new X2JS().xml_str2json(data);
					transportsLength = data.abap.values["OTRANSPORT_LONG"]["ZDEVDB_OTRP_OUT"].length;
					for (i=0; i < transportsLength; i++) {
						transp = data.abap.values["OTRANSPORT_LONG"]["ZDEVDB_OTRP_OUT"];
						$scope.transports[i] = { "trkorr": transp[i]["TRKORR"], "checksystem": transp[i]["CHECKSYSTEM"], "chkdate": transp[i]["CHKDATE"], "text": transp[i]["TEXT"]};
					}
				});
		}
		$scope.handleTransports();
        
} ] ) ;


