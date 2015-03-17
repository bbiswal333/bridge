angular.module('app.querytracker', []);
angular.module('app.querytracker').directive('app.querytracker',['$http','bridgeDataService', function ($http, bridgeDataService) {

	var directiveController = ['$scope', function ($scope) {

		var userInfo = bridgeDataService.getUserInfo();
		$http.get('https://vantgvmwin049.dhcp.pgdev.sap.corp/api/queries/' + userInfo.BNAME).success(function(data){
			$scope.data = data;
		});
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/queryTracker/overview.html',
		controller: directiveController
	};
}]);
