/*global nokia*/
angular.module('app.getHome').appGetHomeSettings = 
	['app.getHome.configservice', 'app.getHome.mapservice', '$scope', '$q', 
		function (appGetHomeConfig, appGetHomeMap, $scope, $q) {
	var mapInstance;
	$scope.configuredRoutes  = appGetHomeConfig.routes;

	$scope.formatTime = appGetHomeMap.formatTime;
	$scope.formatDistance = appGetHomeMap.formatDistance;

	function resetNewRoute() {
		$scope.newRoute = {
			start: '',
			destination: '',
			routeName: 'New Route'
		};
	}
	resetNewRoute();

	$scope.proposedRoutes = [];

	function deriveRouteNameFromDestinationAndStartCities() {
		$scope.newRoute.routeName = $scope.newRoute.start.address.city + " - " + $scope.newRoute.destination.address.city;
	}

	function updateRouteName() {
		if($scope.newRoute.routeName === "New Route" && $scope.newRoute.start.address && $scope.newRoute.destination.address) {
			deriveRouteNameFromDestinationAndStartCities();
		}

		if($scope.newRoute.start.displayPosition && $scope.newRoute.destination.displayPosition) {
			appGetHomeMap.calculateRoutes($scope.newRoute.start.displayPosition, $scope.newRoute.destination.displayPosition).then(function(result) {
				if(!result.error) {
					$scope.proposedRoutes = result.routes;
					displayRoutesInMap();
				} else {
					//display error
				}
			});
		}
	}

	$scope.$watch('newRoute.start', updateRouteName);
	$scope.$watch('newRoute.destination', updateRouteName);

	$scope.switchStartAndDestination = function() {
		var startTmp = $scope.newRoute.start;
		$scope.newRoute.start = $scope.newRoute.destination;
		$scope.newRoute.destination = startTmp;
		deriveRouteNameFromDestinationAndStartCities();
	};

	$scope.initializeMap = function() {
		mapInstance = appGetHomeMap.createMap($("#app-getHome-settings-map")[0]);
	};

	$scope.setSelectedRoute = function(route) {
		$scope.selectedRoute = route;
	};

	function clearMap() {
		mapInstance.objects.clear();
	}

	function displayRouteInMap(route) {
		var mapRoute = new nokia.maps.routing.component.RouteResultSet(route, {color: route.color}).container;
		mapInstance.objects.add(mapRoute);
		return mapRoute;
	}

	function centerRoute(route) {
		mapInstance.zoomTo(route.getBoundingBox(), false, "default");
	}

	$scope.displayRouteInMap = function(route) {
		clearMap();
		centerRoute(displayRouteInMap(route));
	};

	function displayRoutesInMap() {
		var mapRoute;
		clearMap();
		$scope.proposedRoutes.map(function(route) {
			mapRoute = displayRouteInMap(route);
		});
		if(mapRoute) {
			mapInstance.zoomTo(mapRoute.getBoundingBox(), false, "default");
		}
	}

	$scope.addSelectedRouteToConfig = function() {
		appGetHomeConfig.addRoute($scope.newRoute.routeName, $scope.selectedRoute);
		/*resetNewRoute();
		clearMap();
		$scope.selectedRoute = null;
		$scope.proposedRoutes.length = 0;*/
		$scope.proposedRoutes.splice($scope.proposedRoutes.indexOf($scope.selectedRoute), 1);
		$scope.selectedRoute = null;
	};

	$scope.removeRouteFromSettings = function(route) {
		appGetHomeConfig.removeRoute(route);
	};

	$scope.searchAddress = function(searchString) {
		var addresses = $q.defer();
		appGetHomeMap.search(searchString, function(locations) {
			addresses.resolve(locations);
		});
		addresses.promise.then(function(data) {
			return data;
		});
		return addresses.promise;
	};

	$scope.closeForm = function () {
		$scope.$emit('closeSettingsScreen');
	};

}];
