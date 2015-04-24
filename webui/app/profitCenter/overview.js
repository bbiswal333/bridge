angular.module('app.profitCenter', []);
angular.module('app.profitCenter').directive('app.profitCenter',[function () {

	var directiveController = ['$scope', '$http', 'employeeService', function ($scope, $http, employeeService) {
		$scope.appText = "Pretty simple app.";
		$scope.box.boxSize = 2;
		$scope.active = false;
		$scope.toggleActive = function() {
			$scope.active = !$scope.active;
		};

		$scope.fetchInfo = function() {
			$http.get("https://ifd.wdf.sap.corp/sap/bc/bridge/GET_PROFIT_CENTER_INFO?ID=" + $scope.profitCenterNumber).then(function(response) {
				if(response.data.DATA.PROFIT_CENTER_DESC) {
					$scope.profitCenterNumber = response.data.DATA.PROFIT_CENTER_DESC;
					$scope.profitCenter = {
						name: response.data.DATA.PROFIT_CENTER_DESC,
						responsible: response.data.DATA.PROF_CENTER_RESPONSIBLE,
						controller: response.data.DATA.CONTROLLER
					};
					employeeService.getData($scope.profitCenter.responsible).then(function(data) {
						$scope.profitCenter.responsibleFullName = data.fullName;
					});
					employeeService.getData($scope.profitCenter.controller).then(function(data) {
						$scope.profitCenter.controllerFullName = data.fullName;
					});
				}
			});
		};
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/profitCenter/overview.html',
		controller: directiveController
	};
}]);
