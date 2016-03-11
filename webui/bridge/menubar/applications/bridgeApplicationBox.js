angular.module("bridge.app").directive("bridge.application.box", ["bridgeDataService", function(bridgeDataService) {
	return {
		restrict: 'E',
		templateUrl: "bridge/menubar/applications/bridgeApplicationBox.html",
		controller: function($scope) {
			$scope.numberOfInstances = function() {
				return bridgeDataService.getInstancesByType($scope.app.metadata.module_name).length;
			};
		}
	};
}]);
