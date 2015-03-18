angular.module('app.querytracker').controller('app.querytracker.detailController',['$scope','$routeParams','$http','bridgeDataService',
	function Controller($scope, $routeParams, $http, bridgeDataService) {

		var userInfo = bridgeDataService.getUserInfo();
		$http.get('https://vantgvmwin049.dhcp.pgdev.sap.corp/api/queries/' + userInfo.BNAME).success(function(data){
			$scope.data = data;
		});

}]);
