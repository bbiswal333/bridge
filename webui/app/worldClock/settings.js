angular.module("app.worldClock").appSettings = ["$scope", "bridgeBuildingSearch", "app.worldClock.config", function($scope, bridgeBuildingSearch, config) {
	$scope.selectedLocation = null;
	$scope.searchLocation = bridgeBuildingSearch.searchLocation;
	$scope.locations = config.locations;
	$scope.addLocation = function() {
		config.addLocation($scope.selectedLocation);
	};

	$scope.setSelectedLocation = function(location) {
		$scope.selectedLocation = location;
	};

	$scope.removeLocation = config.removeLocation;
}];
