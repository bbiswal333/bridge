angular.module('app.transport', []);
angular.module('app.transport').directive('app.transport', function () {

    var directiveController = ['$scope', '$http', '$interval', function ($scope, $http, $interval)
    {
		$scope.box.boxSize = "1";
		$scope.url = "https://ifp.wdf.sap.corp/sap/bc/devdb/MYTRANSPORTS?origin=' + location.origin ";
		//$scope.url = "https://ifp.wdf.sap.corp/sap/bc/devdb/MYTRANSPORTS?origin=https://localhost:8000"; to test locally
        
		$scope.handleTransports = function() {
			$http.get($scope.url)
				.success(function(data){
					data = new X2JS().xml_str2json(data);
					$scope.numOpenTransports = data.abap.values["OTRANSPORT_SHORT"]["NUMBOTRP"];
					$scope.numFailedImports = data.abap.values["FTRANSPORT_SHORT"]["NUMBIMPERR"];
				});
		}
		$scope.handleTransports();
		$interval($scope.handleTransports(), 60000 * 10);
		
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/transport/overview.html',
        controller: directiveController
    };
});
