angular.module("bridge.app").directive("bridge.application.box", ["bridge.service.appCreator", function(appCreator) {
	return {
		restrict: 'E',
		templateUrl: "bridge/menubar/applications/bridgeApplicationBox.html",
		controller: function($scope) {
			$scope.numberOfInstances = function() {
				return parseInt(appCreator.getInstancesByType($scope.app.metadata.module_name).length);
			};
		}
	};
}]);
