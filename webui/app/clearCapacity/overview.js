angular.module('app.clearCapacity', []);

angular.module('app.clearCapacity').directive('app.clearCapacity', function () {
    var directiveController = ['$http', '$scope', '$window', function ($http, $scope, $window) {
        $scope.box.boxSize = "2";

		$http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_CLEAR_CAPA_DATA?origin=" + $window.location.origin)
		.success(function(data) {
			$scope.clearCapacityData = data;
		});

		$scope.toPercent = function(assignment) {
			return parseFloat(assignment.replace(',', '.')) * 100;
		};
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/clearCapacity/overview.html',
        controller: directiveController
    };
  
});
