/*globals nokia, jQuery*/
angular.module('app.getHome').appGetHomeSettings =
	['app.getHome.configservice', 'bridge.service.maps.routing', 'bridge.service.maps.utils', '$scope', '$q', 'bridge.search.locationSearch', 'bridge.service.maps.mapService',
		function (appGetHomeConfig, bridgeRouting, routingUtils, $scope, $q, bridgeLocationSearch, bridgeMap) {
	var mapInstance;
	var routeLayer, routerHoverMarker, markerLayer, dragMarker;

	var platform = nokia.maps.dom.Page.platform,
		eventKey;
	if (platform.mac) {
		$scope.keyModifierString = "CMD ⌘";
		eventKey = "metaKey";
	} else {
		$scope.keyModifierString = "CTRL";
		eventKey = "ctrlKey";
	}

	var config = appGetHomeConfig.getConfigForAppId($scope.boxScope.metadata.guid);
	$scope.configuredRoutes  = config.routes;

	$scope.formatTime = routingUtils.formatTime;
	$scope.formatDistance = routingUtils.formatDistance;

	function resetNewRoute() {
		$scope.newRoute = {
			start: '',
			destination: '',
			routeName: 'New Route'
		};
	}
	resetNewRoute();

	$scope.proposedRoutes = [];

	var previouslyDerivedRouteName = "";
	function deriveRouteNameFromDestinationAndStartCities() {
		$scope.newRoute.routeName = $scope.newRoute.start.address.city + " - " + $scope.newRoute.destination.address.city;
		previouslyDerivedRouteName = $scope.newRoute.routeName;
	}

	function clearMap() {
		routeLayer.objects.asArray().map(function(object) {
			if(object === routerHoverMarker) {
				return;
			}
			object.removeAllListeners();
		});

		routeLayer.objects.clear();
		routeLayer.objects.add(routerHoverMarker);
		markerLayer.objects.clear();
	}

	function updateSelectedRoute() {
		if($scope.selectedRoute === undefined) {
			return;
		}

		if($scope.editMode) {
			$scope.editedRoute.updateFromNewWaypoints($scope.editedRoute.markers.map(function(marker) { return {position: marker.coordinate}; })).then(function() {
				$scope.editExistingRoute($scope.editedRoute, true);
				$scope.editedRoute.modified = true;
			});
		} else {
			bridgeRouting.rebuildRouteFromWaypoints($scope.selectedRoute.markers.map(function(marker) { return {position: marker.coordinate}; }), function(response) {
				$scope.proposedRoutes[$scope.proposedRoutes.indexOf($scope.selectedRoute)] = response.route;
				response.route.markers = $scope.selectedRoute.markers.map(function(marker) { marker.originalRoute = response.route; return marker; });
				response.route.initiallyCalculatedRoute = $scope.selectedRoute.initiallyCalculatedRoute;
				response.route.color = $scope.selectedRoute.color;
				$scope.setSelectedRoute(response.route, true);
			});
		}
	}

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

	function makeMarkerRemovableOnClick(marker) {
		marker.addListener("click", function (evt) {
			if(!marker.originalRoute.draggable) {
				return;
			}

			if (evt[eventKey] === true) {
				removeWaypointMarker(evt.currentTarget);
				updateSelectedRoute();
				evt.preventDefault();
				evt.stopPropagation();
			}
		});
	}

	function createWaypointMarker (route, geocoord, index) {
		var marker = new nokia.maps.map.StandardMarker(geocoord, {
			draggable: true,
			visibility: false
		});
		marker.originalRoute = route;

		makeMarkerRemovableOnClick(marker);

		// Add a listener for dragend events on waypoint markers
		marker.addListener("dragend", function () {
			if(!route.draggable) {
				return;
			}
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

		return marker;
	}

	function displayRouteMarkersInMap(route) {
		if(!route.markers) {
			route.markers = [];
			for(var i = 0; i < route.waypoints.length; i++) {
				createWaypointMarker(route, route.waypoints[i].position, i + 1).set("visibility", true);
			}
		} else {
			route.markers.map(function(marker) {
				markerLayer.objects.add(marker);
			});
		}
	}

	function createAndDisplayRoutePolylineInMap(route) {
		var routePolyline = bridgeMap.createRoutePolyline(route, {strokeColor: route.color});
		routeLayer.objects.add(routePolyline);
		return routePolyline;
	}

	function makeRouteDraggable(route) {
		route.routePolyline.addListener("mouseenter", function (evt) {
			var coord = mapInstance.pixelToGeo((evt.displayX - 8), (evt.displayY - 8));
			routerHoverMarker.set("coordinate", coord);
			routerHoverMarker.set("visibility", true);
		});

		// Add the listener for the mouse leave event on the route
		route.routePolyline.addListener("mouseleave", function () {
			routerHoverMarker.set("visibility", false);
		});
	}

	function displayRouteInMap(route) {
		displayRouteMarkersInMap(route);
		var routePolyline = createAndDisplayRoutePolylineInMap(route);

		if(route.draggable) {
			makeRouteDraggable(route);
		}

		return routePolyline;
	}

	function centerRoute(route) {
		mapInstance.zoomTo(route.getBoundingBox(), false, "default");
	}

	$scope.displayRouteInMap = function(route, skipCenterRoute) {
		clearMap();
		var routePolyline = displayRouteInMap(route);
		if(!skipCenterRoute) {
			centerRoute(routePolyline);
		}
	};

	$scope.displayRouteShallow = function(route) {
		if($scope.selectedRoute === route) {
			return;
		}

		displayRouteInMap(route);
	};

	$scope.hideRouteShallow = function(route) {
		if($scope.selectedRoute === route) {
			return;
		}

		route.markers.map(function(marker) {
			markerLayer.objects.remove(marker);
		});
		if(route.routePolyline !== undefined) {
			routeLayer.objects.remove(route.routePolyline);
		}
	};

	function updateRouteName() {
		if(($scope.newRoute.routeName === "New Route" || $scope.newRoute.routeName === previouslyDerivedRouteName) && $scope.newRoute.start.address && $scope.newRoute.destination.address) {
			deriveRouteNameFromDestinationAndStartCities();
		}

		if($scope.newRoute.start.displayPosition && $scope.newRoute.destination.displayPosition) {
			bridgeRouting.calculateAlternativeRoutesBetween($scope.newRoute.start.displayPosition, $scope.newRoute.destination.displayPosition, function(result) {
				if(!result.error) {
					$scope.proposedRoutes = result.routes.map(function(routeResponse) {
						routeResponse.route.initiallyCalculatedRoute = routeResponse.route;
						return routeResponse.route;
					});
					$scope.setSelectedRoute(result.routes[0].route);
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

	$scope.editExistingRoute = function(route, skipCenterRoute) {
		$scope.editMode = true;
		$scope.setSelectedRoute(route, skipCenterRoute);
		$scope.editedRoute = route;
		$scope.editedRoute.modified = false;
		$scope.editedRoute.initiallyCalculatedRoute = $scope.editedRoute.initiallyCalculatedRoute ? $scope.editedRoute.initiallyCalculatedRoute : jQuery.extend(true, {}, route);
	};

	$scope.quitEditMode = function() {
		$scope.editMode = false;
		$scope.selectedRoute = null;
		$scope.editedRoute = null;
		clearMap();
	};

	$scope.undoEditOfExistingRoute = function() {
		if(!$scope.editMode || !$scope.editedRoute) {
			return;
		}

		$scope.editedRoute.updateFromNewWaypoints($scope.editedRoute.initiallyCalculatedRoute.markers.map(function(marker) { return {position: marker.coordinate}; })).then(function() {
			$scope.editExistingRoute($scope.editedRoute, true);
			$scope.editedRoute.modified = false;
		});
	};

	$scope.addSelectedRouteToConfig = function() {
		config.addRoute($scope.newRoute.routeName, $scope.selectedRoute);
		$scope.proposedRoutes.splice($scope.proposedRoutes.indexOf($scope.selectedRoute), 1);
		$scope.selectedRoute = null;

		if($scope.proposedRoutes.length === 0) {
			resetNewRoute();
		}
	};

	$scope.removeRouteFromSettings = function(route) {
		config.removeRoute(route);
	};

	$scope.searchAddress = function(searchString) {
		return bridgeLocationSearch.findMatches(searchString, [], true);
	};

	$scope.closeForm = function () {
		$scope.$emit('closeSettingsScreen');
	};

	function createRouteHoverMarker() {
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

		routerHoverMarker.addListener("dragstart", function (evt) {
			if(!$scope.selectedRoute.routePolyline || !$scope.selectedRoute.draggable) {
				return;
			}

			var coord = mapInstance.pixelToGeo(evt.displayX, evt.displayY), nearestIndex = $scope.selectedRoute.routePolyline.getNearestIndex(coord), shape = $scope.selectedRoute.routePolyline.path.asArray(), currentWaypoint = $scope.selectedRoute.waypoints[0].position, currentWaypointIdx = 0, i;

			// Find the route's waypoint which comes before the point affected by the dragstart operation
			for (i = 0; i <= ((nearestIndex + 1) * 3); i += 3) {
				if (currentWaypoint.latitude === shape[i] &&
				currentWaypoint.longitude === shape[i + 1]) {
					currentWaypoint = $scope.selectedRoute.waypoints[++currentWaypointIdx].position;
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
	}

	function addMouseEvents() {
		// Add the listener for the mouse move event on the route
		routeLayer.addListener("mousemove", function (evt) {
			var coord = mapInstance.pixelToGeo((evt.displayX - 8), (evt.displayY - 8));
			routerHoverMarker.set("coordinate", coord);
		});

		mapInstance.addListener("click", function (evt) {
			if($scope.selectedRoute === undefined) {
				return;
			}

			// Remember the eventKey was determined at the start of the example by querying the running platform
			if (evt[eventKey] === true) {
				var coord = mapInstance.pixelToGeo(evt.displayX, evt.displayY),
					marker = createWaypointMarker($scope.selectedRoute, coord);

				marker.set("visibility", true);
				updateSelectedRoute();
				evt.preventDefault();
			}
		});
	}

	function makeMapRoutesDraggable(oMapInstance) {
		routeLayer = new nokia.maps.map.Container();
		oMapInstance.objects.add(routeLayer);

		createRouteHoverMarker();

		addMouseEvents();

		markerLayer = new nokia.maps.map.Container();
		oMapInstance.objects.add(markerLayer);
	}

	$scope.undoChanges = function(route) {
		$scope.proposedRoutes[$scope.proposedRoutes.indexOf(route)] = route.initiallyCalculatedRoute;
		route.initiallyCalculatedRoute.markers = undefined;
		//route.initiallyCalculatedRoute.markers = route.markers.map(function(marker) { marker.originalRoute = route; return marker; });
		$scope.setSelectedRoute(route.initiallyCalculatedRoute);
	};

	$scope.hideDescription = function() {
		$scope.descriptionHidden = true;
	};

	$scope.initializeMap = function() {
		mapInstance = bridgeMap.createMap($("#app-getHome-settings-map")[0]);
		makeMapRoutesDraggable(mapInstance);
	};
}];
