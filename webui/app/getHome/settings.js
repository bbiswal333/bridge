/*global nokia*/
angular.module('app.getHome').appGetHomeSettings =
	['app.getHome.configservice', 'app.getHome.mapservice', '$scope', '$q',
		function (appGetHomeConfig, appGetHomeMap, $scope, $q) {
	var mapInstance;
	var routeLayer, routerHoverMarker, markerLayer, dragMarker;

	var platform = nokia.maps.dom.Page.platform,
		keyModifierString,
		eventKey;
	if (platform.mac) {
		keyModifierString = "CMD ⌘";
		eventKey = "metaKey";
	} else {
		keyModifierString = "CTRL" ;
		eventKey = "ctrlKey";
	}


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

	function clearMap() {
		routeLayer.objects.clear();
		routeLayer.objects.add(routerHoverMarker);
		markerLayer.objects.clear();
	}

	function displayRouteInMap(route) {
		if(route.markers === undefined) {
			route.markers = [];
			createWaypointMarker(route, route.waypoints[0].mappedPosition, 1).set("visibility", true);
			createWaypointMarker(route, route.waypoints[route.waypoints.length - 1].mappedPosition, route.markers.length).set("visibility", true);
		} else {
			route.markers.map(function(marker) {
				markerLayer.objects.add(marker);
			});
		}

		var routePolyline = new nokia.maps.map.Polyline(route.shape, {
			pen: {
				lineWidth: 5,
				lineJoin: 'round',
				strokeColor: route.color
			}
		});
		route.routePolyline = routePolyline;
		
		// Add the listener for the mouse move event on the route
		if(route.draggable) {
			routePolyline.addListener("mouseenter", function (evt) {
				var coord = mapInstance.pixelToGeo((evt.displayX - 8), (evt.displayY - 8));
				routerHoverMarker.set("coordinate", coord);
				routerHoverMarker.set("visibility", true);
				waypoints = route.waypoints;
			});
			
			// Add the listener for the mouse leave event on the route
			routePolyline.addListener("mouseleave", function (evt) {
				routerHoverMarker.set("visibility", false);
			});
		}

		routeLayer.objects.add(routePolyline);

		return routePolyline;
	}

	function centerRoute(route) {
		mapInstance.zoomTo(route.getBoundingBox(), false, "default");
	}

	$scope.displayRouteInMap = function(route, skipCenterRoute) {
		clearMap();
		var route = displayRouteInMap(route);
		if(!skipCenterRoute) {
			centerRoute(route);
		}
	};

	function updateRouteName() {
		if($scope.newRoute.routeName === "New Route" && $scope.newRoute.start.address && $scope.newRoute.destination.address) {
			deriveRouteNameFromDestinationAndStartCities();
		}

		if($scope.newRoute.start.displayPosition && $scope.newRoute.destination.displayPosition) {
			appGetHomeMap.calculateRoutes($scope.newRoute.start.displayPosition, $scope.newRoute.destination.displayPosition).then(function(result) {
				if(!result.error) {
					$scope.proposedRoutes = result.routes;
					$scope.setSelectedRoute(result.routes[0]);
				}// else {
					//display error
				//}
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

	$scope.setSelectedRoute = function(route, skipCenterRoute) {
		$scope.selectedRoute = route;
		$scope.displayRouteInMap(route, skipCenterRoute);
	};

	$scope.addSelectedRouteToConfig = function() {
		appGetHomeConfig.addRoute($scope.newRoute.routeName, $scope.selectedRoute);
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

	function arrayIndexOf(array, element) {
		for (var i = 0, l = array.length; i < l; i++) {
			if (array[i] === element) {
				return i;
			}
		}
		return -1;
	}

	function removeWaypointMarker(marker) {
		var index = arrayIndexOf(marker.originalRoute.markers, marker);
		
		marker.originalRoute.markers.splice(index, 1);
		markerLayer.objects.remove(marker);
		
		// Correct the markers' text after maker insertion
		for (var i = index; i < $scope.selectedRoute.markers.length; i++) {
			marker.originalRoute.markers[i].set("text", "" + (i + 1));
		}
		
		// Remove the route if there aren't more than 1 marker left
		if (marker.originalRoute.markers.length < 2) {
			// remove the current route polyline from the map
			if (marker.originalRoute.routePolyline) {
				routeLayer.objects.remove(marker.originalRoute.routePolyline);
			}
		}
	}

	function updateSelectedRoute() {
		appGetHomeMap.rebuildRouteFromWaypoints($scope.selectedRoute.markers.map(function(marker) { return {position: marker.coordinate}; })).then(function(route) {
			$scope.proposedRoutes[$scope.proposedRoutes.indexOf($scope.selectedRoute)] = route;
			route.markers = $scope.selectedRoute.markers.map(function(marker) { marker.originalRoute = route; return marker; });
			$scope.setSelectedRoute(route, true);
		});
	}

	var routerDrag = new nokia.maps.routing.Manager();

	function createWaypointMarker (route, geocoord, index) {
		var marker = new nokia.maps.map.StandardMarker(geocoord, {
			draggable: true,
			visibility: false
		});
		
		// Add a listener for click events on waypoint markers
		marker.addListener("click", function (evt) {
			// Remember the eventKey was determined at the start of the example by querying the running platform
			if (evt[eventKey] === true) {	
				// Remove the waypoint marker from the map and recalculate the route
				removeWaypointMarker(evt.currentTarget);
				updateSelectedRoute();
				evt.preventDefault();
				evt.stopPropagation();
			}
		});
		
		// Add a listener for dragend events on waypoint markers
		marker.addListener("dragend", function (evt) {
			updateSelectedRoute();
		});
		
		// Add the marker to the markers array according to the passed index
		if (typeof index === "number") {
			route.markers.splice(index, 0, marker);
		} else {
			route.markers.push(marker);
			index = route.markers.length;
		}
		
		// Correct the markers' text after maker insertion
		for (var i = (index - 1); i < route.markers.length; i++) {
			route.markers[i].set("text", "" + (i + 1));
		}
		
		// Add marker to the markerLayer, to make it visible on the map
		markerLayer.objects.add(marker);

		marker.originalRoute = route;
		
		return marker;
	}

	function makeMapRoutesDraggable(mapInstance) {
		routeLayer = new nokia.maps.map.Container();
		mapInstance.objects.add(routeLayer);

		var routeHoverContext = new nokia.maps.gfx.Graphics();
		routeHoverContext.beginImage(18, 18);
		routeHoverContext.set("fillColor", "#FFF2");
		routeHoverContext.set("strokeColor", "#000");
		routeHoverContext.set("lineWidth", 2);
		routeHoverContext.drawEllipse(1, 1, 14, 14);
		routeHoverContext.fill();
		routeHoverContext.stroke();

		routerHoverMarker = new nokia.maps.map.Marker({
			latitude: 50,
			longitude: 50
		}, {
			icon: new nokia.maps.gfx.GraphicsImage(routeHoverContext.getIDL()),
			visibility: false,
			anchor: new nokia.maps.util.Point(0, 0),
			draggable: true
		});
		routeLayer.objects.add(routerHoverMarker);

		// Add the listener for the mouse move event on the route
		routeLayer.addListener("mousemove", function (evt) {
			var coord = mapInstance.pixelToGeo((evt.displayX - 8), (evt.displayY - 8));
			routerHoverMarker.set("coordinate", coord);
		});

		routerHoverMarker.addListener("dragstart", function (evt) {
			if(!$scope.selectedRoute.routePolyline) {
				return;
			}

			var coord = mapInstance.pixelToGeo(evt.displayX, evt.displayY), nearestIndex = $scope.selectedRoute.routePolyline.getNearestIndex(coord), shape = $scope.selectedRoute.routePolyline.path.asArray(), currentWaypoint = $scope.selectedRoute.waypoints[0].mappedPosition, currentWaypointIdx = 0, i;
			
			// Find the route's waypoint which comes before the point affected by the dragstart operation
			for (i = 0; i <= ((nearestIndex + 1) * 3); i += 3) {
				if (currentWaypoint.latitude === shape[i] &&
				currentWaypoint.longitude === shape[i + 1]) {
					currentWaypoint = $scope.selectedRoute.waypoints[++currentWaypointIdx].mappedPosition;
				}
			}
			
			// Create a new marker at the drag start position and add it to the markers array at the correct position
			dragMarker = createWaypointMarker($scope.selectedRoute, coord, currentWaypointIdx);
		});

		// Add the listener for the dragend event on the route
		routerHoverMarker.addListener("dragend", function (evt) {
			var coord = mapInstance.pixelToGeo(evt.displayX, evt.displayY);
			
			// Finalize the new created drag marker
			dragMarker.set("coordinate", coord);
			dragMarker.set("visibility", true);
			// Update the whole route
			updateSelectedRoute();
		});

		markerLayer = new nokia.maps.map.Container();
		mapInstance.objects.add(markerLayer);
	}

	$scope.initializeMap = function() {
		mapInstance = appGetHomeMap.createMap($("#app-getHome-settings-map")[0]);
		makeMapRoutesDraggable(mapInstance);
	};
}];
