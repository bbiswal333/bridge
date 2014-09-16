angular.module("bridge.app").directive("bridge.menubar", [function() {
	return {
		restrict: "E",
        templateUrl: "bridge/menubar/MenuBar.html",
        controller: function($scope) {
        	$scope.displayView = function(view) {
        		if($scope.display === view) {
        			$scope.display = "";
        			return;
        		}
        		$scope.display = view;
        	};
        }
	};
}]);
