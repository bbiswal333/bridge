angular.module('app.bwPcStatus').controller('app.bwPcStatus.detailController',['$scope', 'app.bwPcStatus.dataService', '$window',
	function Controller($scope, dataService, $window) {

	$scope.chains =  dataService.data.chains;
	$scope.search =  dataService.data.search;

	$scope.displayChainRun = function(chain) {
		$window.open("https://ifp.wdf.sap.corp/sap/bc/bsp/sap/ZBRIDGE_BSP/saplink.sap?sid=" + chain.CONT_SYS +
            "&client=&transaction=*RSPC1&parameters=CHAIN=" + chain.CHAIN_ID +
            ";L_MODE=PLAN;LOGID=" + chain.LOG_ID + ";DISPLAY=X;");
	};
}]);
