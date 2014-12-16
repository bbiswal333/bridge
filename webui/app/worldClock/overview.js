angular.module('app.worldClock', ["lib.utils"]);
angular.module('app.worldClock').directive('app.worldClock',["app.worldClock.config", "bridgeBuildingSearch", function (configService, bridgeBuildingSearch) {

	var directiveController = ['$scope', function ($scope) {
		$scope.box.boxSize = "2";
		$scope.timeOffsetInMilliseconds = 0;

		configService.initialize($scope.metadata.guid);
		$scope.locations = configService.locations;

		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};

		$scope.searchLocation = bridgeBuildingSearch.searchLocation;
		$scope.addLocation = function(location) {
			$scope.selectedLocation = null;
			$scope.editMode = false;
			$scope.showAddButton = false;
			configService.addLocation(location);
		};

		$scope.removeLocation = configService.removeLocation;
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/worldClock/overview.html',
		controller: directiveController
	};
}]);
