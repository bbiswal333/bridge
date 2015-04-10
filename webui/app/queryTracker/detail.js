angular.module('app.querytracker').controller('app.querytracker.detailController',['$scope','$routeParams','$http','bridgeDataService',
	function Controller($scope, $routeParams, $http, bridgeDataService) {

		var userInfo = bridgeDataService.getUserInfo();
		$http.get('https://vantgvmwin049.dhcp.pgdev.sap.corp/api/queries/' + userInfo.BNAME).success(function(data){
			//$scope.data = data;
			var current_date = new Date();
			data.forEach(function (query){
				var time_diff = Date.parse(query.Deadline) - current_date;
				var days_to_deadline = Math.ceil(time_diff / (1000 * 3600 * 24));
				if( days_to_deadline < 2)
				{
					query.deadline_marker = true;

				}
				else
				{
					query.deadline_marker = false;
				}

			});

			data.sort(function(a, b){
  				return new Date(a.Deadline) - new Date(b.Deadline);
			});

			$scope.data = data;
		});

}]);
