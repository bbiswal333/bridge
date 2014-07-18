angular.module('app.getHome', []);
angular.module('app.getHome').directive('app.getHome', [ 'app.getHome.configservice', 'app.getHome.mapservice', 'bridgeDataService', 'bridgeConfig', '$location', function (appGetHomeConfig, appGetHomeMap, bridgeDataService, bridgeConfig, $location) {

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

		$scope.from = null;
		$scope.to = null;

		var startCoord = null,
			destCoord = null;

		$scope.$watch('from', function(newValue, oldValue) {
			if (newValue && newValue.name) {

				if ($scope.to && newValue.name === $scope.to.name) {
					$scope.to = oldValue;
					$scope.config.data.toLocation = oldValue.name;
				}

				$scope.config.data.fromLocation = newValue.name;

				if (newValue !== oldValue) {
					bridgeConfig.persistInBackend(bridgeDataService);
				}

				if (startCoord == null || newValue !== oldValue) {
					startCoord = new nokia.maps.geo.Coordinate(newValue.latitude, newValue.longitude);
				}

				recalculateRoute();
			}
		});

		$scope.$watch('to', function(newValue, oldValue) {
			if (newValue && newValue.name) {

				if ($scope.from && newValue.name === $scope.from.name) {
					$scope.from = oldValue;
					$scope.config.data.fromLocation = oldValue.name;
				}

				$scope.config.data.toLocation = newValue.name;

				if (newValue !== oldValue) {
					bridgeConfig.persistInBackend(bridgeDataService);
				}

				if (destCoord == null || newValue !== oldValue) {
					destCoord = new nokia.maps.geo.Coordinate(newValue.latitude, newValue.longitude);
				}

				recalculateRoute();
			}
		});

		$scope.toDetail = function() {
			$location.path("/detail/gethome/");
		};

		function recalculateRoute() {
			if (startCoord && destCoord) {
				appGetHomeMap.calculateRoute(startCoord, destCoord,
					function (trafficTimeSeconds) {
						$scope.$apply(function() {
							$scope.traffic_time_string = appGetHomeMap.formatTime(trafficTimeSeconds);
						});
					}, function (result) {
						$scope.$apply(function() {
							$scope.time_style = result.percent > 30 ? "app-getHome-bad" :
									result.percent > 10 ? "app-getHome-delayed" : "app-getHome-good";
							$scope.delay_string = " (+" + appGetHomeMap.formatTime(result.delay) + ")";
						});
				});
			}
		}

		setInterval(recalculateRoute, 30000);
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/getHome/overview.html',
		controller: directiveController,
		link: function($scope) {

			if ($scope.appConfig !== undefined && !angular.equals({}, $scope.appConfig)) {
				appGetHomeConfig.data = $scope.appConfig;

				var fromLocation = null,
					toLocation = null;

				angular.forEach(appGetHomeConfig.data.locations, function(location, index) {
					if (!fromLocation && location.name === appGetHomeConfig.data.fromLocation) {
						fromLocation = location;
					}
					if (!toLocation && location.name === appGetHomeConfig.data.toLocation) {
						toLocation = location;
					}
				});

				$scope.from = fromLocation;
				$scope.to = toLocation;
			} else {
				// default config
				appGetHomeConfig.data.locations.push({
					name: "Work",
					address: "Dietmar-Hopp-Allee, Walldorf",
					latitude: 49.30289,
					longitude: 8.64298
				});
				appGetHomeConfig.data.locations.push({
					name: "Home",
					address: "Kaiserstraße, Karlsruhe",
					latitude: 49.009079,
					longitude: 8.4165401
				});
				appGetHomeConfig.data.fromLocation = "Work";
				appGetHomeConfig.data.toLocation = "Home";
				$scope.appConfig = appGetHomeConfig.data;
				$scope.from = appGetHomeConfig.data.locations[0];
				$scope.to = appGetHomeConfig.data.locations[1];
			}
		}
	};
}]);
