﻿angular.module('app.getHome', []);
angular.module('app.getHome').directive('app.getHome', [ 'app.getHome.configservice', 'app.getHome.mapservice', function (appGetHomeConfig, appGetHomeMap) {

	var directiveController = ['$scope', function ($scope)
	{
		$scope.box.boxSize = "1";
		$scope.box.settingScreenData = {
			templatePath: "getHome/settings.html",
			controller: angular.module('app.getHome').appGetHomeSettings
		};        
		$scope.config = appGetHomeConfig;

		$scope.box.returnConfig = function () {
			var configCopy = angular.copy(appGetHomeConfig.data);
			 return configCopy;
		};

		//put some stuff in here
		$scope.locations = $scope.config.data.locations;

		$scope.from = $scope.locations[0];
		$scope.to = $scope.locations[1];

		var startCoord = new nokia.maps.geo.Coordinate($scope.from.latitude, $scope.from.longitude),
			destCoord = new nokia.maps.geo.Coordinate($scope.to.latitude, $scope.to.longitude);

		appGetHomeMap.calculateRoute(startCoord, destCoord,
			function (trafficTimeSeconds) {
				$scope.traffic_time_string = appGetHomeMap.formatTime(trafficTimeSeconds);
			}, function (result) {
				$scope.time_style = result.percent > 30 ? "app-getHome-bad" :
									result.percent > 10 ? "app-getHome-delayed" : "app-getHome-good";

				$scope.delay_string = " (+" + appGetHomeMap.formatTime(result.delay) + ")";
		});

	}];

	return {
		restrict: 'E',
		templateUrl: 'app/getHome/overview.html',
		controller: directiveController,
		link: function($scope) {
			console.log($scope.appConfig);
		}
	};
}]);
