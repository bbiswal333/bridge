angular.module('app.clearCapacity', []);

angular.module('app.clearCapacity').directive('app.clearCapacity', function () {
    var directiveController = ['$http', '$scope', function ($http, $scope) {
        $scope.box.boxSize = "2";

		$http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_CLEAR_CAPA_DATA?origin=" + location.origin)
		.success(function(data, status) {
			$scope.clearCapacityData = data;
		}).error(function(data, status) {
			//TODO: Fail hard
		});

		$scope.toPercent = function(assignment) {
			return parseFloat(assignment.replace(',', '.')) * 100;
		}
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/clearCapacity/overview.html',
        controller: directiveController
    };
  
});



