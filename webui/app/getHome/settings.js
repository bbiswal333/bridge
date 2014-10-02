/*global nokia*/
angular.module('app.getHome').appGetHomeSettings = 
	['app.getHome.configservice', 'app.getHome.mapservice', '$scope', '$q', 
		function (appGetHomeConfig, appGetHomeMap, $scope, $q) {
	var mapInstance;
	$scope.config  = appGetHomeConfig;

	function resetNewRoute() {
		$scope.newRoute = {
			start: '',
			destination: '',
			routeName: 'New Route',
			proposedRoutes: []
		};
	}
	resetNewRoute();

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
					$scope.newRoute.proposedRoutes = result.routes;
					displayRoutesInMap();
				} else {
					//display error
				}
			});
		}
	}

	$scope.$watch('newRoute', updateRouteName, true);

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
		$scope.newRoute.selectedRoute = route;
	};

	function clearMap() {
		mapInstance.objects.clear();
	}

	function displayRouteInMap(route) {
		var mapRoute = new nokia.maps.routing.component.RouteResultSet(route.originalRoute, {color: route.color}).container;
		mapInstance.objects.add(mapRoute);
		return mapRoute;
	}

	function displayRoutesInMap() {
		var mapRoute;
		clearMap();
		$scope.newRoute.proposedRoutes.map(function(route) {
			mapRoute = displayRouteInMap(route);
		});
		if(mapRoute) {
			mapInstance.zoomTo(mapRoute.getBoundingBox(), false, "default");
		}
	}

	$scope.addSelectedRouteToConfig = function() {
		appGetHomeConfig.routes.push({routeName: $scope.newRoute.routeName, route: $scope.newRoute.selectedRoute});
		resetNewRoute();
		clearMap();
	};

/*
	$scope.addNewLocation = function() {
		var location = {
			name: $scope.newLocation.name,
			address: $scope.newLocation.address.address.label,
			latitude: $scope.newLocation.address.displayPosition.latitude, 
			longitude: $scope.newLocation.address.displayPosition.longitude
		};

		appGetHomeConfig.data.locations.push(location);
		$scope.newLocation.name = '';
		$scope.newLocation.address = '';
		$scope.addMode = false;
	};

	$scope.deleteLocation = function (location, index) {
		appGetHomeConfig.data.locations.splice(index, 1);
	};*/

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
