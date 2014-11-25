angular.module('app.worldClock', ["lib.utils"]);
angular.module('app.worldClock').directive('app.worldClock',["app.worldClock.config", function (configService) {

	var directiveController = ['$scope', function ($scope) {
		$scope.box.boxSize = "2";
		$scope.timeOffsetInMilliseconds = 0;

		$scope.box.settingsTitle = "Configure Timezones";
		$scope.box.settingScreenData = {
			templatePath: "worldClock/settings.html",
				controller: angular.module('app.worldClock').appSettings,
				id: $scope.boxId
		};

		//TODO: comment out when merged with multiInstance
		//configService.initialize($scope.metadata.guid);
		configService.initialize();
		$scope.locations = configService.locations;

		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/worldClock/overview.html',
		controller: directiveController
	};
}]);
