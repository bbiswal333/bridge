﻿angular.module('app.profitCenter', ['frapontillo.bootstrap-switch']);
angular.module('app.profitCenter').directive('app.profitCenter',[function () {

	var directiveController = ['$scope', '$http', 'employeeService', 'bridgeInBrowserNotification', function ($scope, $http, employeeService, bridgeInBrowserNotification) {
		$scope.appText = "Pretty simple app.";
		$scope.box.boxSize = 2;

		function setProfitCenterData(response) {
			if(response.data.DATA.PROFIT_CENTER) {
				$scope.realProfitCenterNumber = response.data.DATA.PROFIT_CENTER;
				$scope.profitCenter = {
					active: response.data.DATA.IS_PROJECT_PC === "X" ? true : false,
					name: response.data.DATA.PROFIT_CENTER_DESC,
					locked: response.data.DATA.LOCK_INDICATOR === "X" ? true : false,
					responsible: response.data.DATA.PROF_CENTER_RESPONSIBLE,
					controller: response.data.DATA.CONTROLLER
				};
				if($scope.profitCenter.responsible) {
					employeeService.getData($scope.profitCenter.responsible).then(function(data) {
						$scope.profitCenter.responsibleFullName = data.fullName;
					});
				}
				if($scope.profitCenter.controller) {
					employeeService.getData($scope.profitCenter.controller).then(function(data) {
						$scope.profitCenter.controllerFullName = data.fullName;
					});
				}
			}
		}

		$scope.$watch("profitCenter.active", function() {
			if($scope.justDownloaded) {
				$scope.justDownloaded = false;
				return;
			}
			$http.get("https://ift.wdf.sap.corp/sap/bc/bridge/SET_IS_PROJ_PROFIT_CENTER?ID=" + $scope.realProfitCenterNumber + "&is_project_pc=" + ($scope.profitCenter.active ? 'X' : '')).then(function(response) {
				if(response.data.error) {
					bridgeInBrowserNotification.addAlert('danger',response.data.message);
				} else {
					setProfitCenterData(response);
					bridgeInBrowserNotification.addAlert('success',"Project Profit Center updated");
				}
			});
		});

		$scope.$watch('profitCenterNumber', function() {
			if(!$scope.profitCenterNumber) {
				$scope.profitCenter = null;
			}
		});

		$scope.fetchInfo = function() {
			while($scope.profitCenterNumber.length < 10) {
				$scope.profitCenterNumber = 0 + $scope.profitCenterNumber;
			}
			$http.get("https://ift.wdf.sap.corp/sap/bc/bridge/GET_PROFIT_CENTER_INFO?ID=" + $scope.profitCenterNumber).then(function(response) {
				$scope.justDownloaded = true;
				setProfitCenterData(response);
			});
		};
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/profitCenter/overview.html',
		controller: directiveController
	};
}]);
