/*global nokia*/
angular.module('bridge.service').service("bridge.service.maps.routing", ['$q', '$http', '$interval', 'bridgeInBrowserNotification', 'bridge.service.maps.utils', function ($q, $http, $interval, bridgeInBrowserNotification, mapUtils) {
	var GEOCODE_API = "https://geocoder.api.here.com/6.2/geocode.json";
	var ROUTING_API = "https://route.nlp.nokia.com/routing/7.2/calculateroute.json";
	var GET_ROUTE_API = "https://route.nlp.nokia.com/routing/7.2/getroute.json";
	var TWO_AND_A_HALF_MINUTES = 120000;
	var ROUTE_COLORS = ["#418AC9", "#8561C5", "#707070"];

	var appCodeParameter = "&app_code=OvJJVLXUQZGWHmYf1HZCFg";
	var appIdParameter = "&app_id=TSCNwGZFblBU5DnJLAH8";
	var jsonAttributesParameter = "&jsonAttributes=1";

	var that = this;

	function loadRouteDataByRouteId(routeId, successCallback, errorCallback) {
		var deferred = $q.defer();
		$http({
			url: GET_ROUTE_API + "?routeId=" + routeId + "&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text" + appCodeParameter + appIdParameter + jsonAttributesParameter,
			method: "GET",
			withCredentials: false
		}).success(successCallback).error(errorCallback);
		return deferred;
	}

	function waypointArrayToGETParameter(waypoints) {
		var convertedWaypoints = waypoints.map(function(waypoint) {
			if(waypoint.linkId) {
				return "link!!" + waypoint.linkId;
			} else if(waypoint.position) {
				return "geo!" + waypoint.position.latitude + "," + waypoint.position.longitude;
			} else if(waypoint.latitude && waypoint.longitude) {
				return "geo!" + waypoint.latitude + "," + waypoint.longitude;
			} else {
				throw new Error("Invalid waypoint");
			}
		});
		var parameter = "";
		for(var i = 0, length = convertedWaypoints.length; i < length; i++) {
			parameter += "waypoint" + i + "=" + convertedWaypoints[i] + "&";
		}
		return parameter;
	}

	function calculateRouteFromWaypoints(waypoints, alternatives, successCallback, errorCallback) {
		$http({
			url: ROUTING_API + "?" + waypointArrayToGETParameter(waypoints) + "alternatives=" + alternatives + "&routeattributes=none,routeId&language=en-US&mode=fastest;car;traffic:disabled" + appCodeParameter + appIdParameter + jsonAttributesParameter,
			method: "GET",
			withCredentials: false
		}).success(function(data) {
			successCallback(data);
		}).error(function() {
			if(errorCallback) {
				errorCallback.apply(null, arguments);
			}
		});
	}

	var Route = (function() {
		return function(routeData) {
			this.incidents = [];
			this.waypoints = [];
			this.calculatedWaypoints = [];
			this.isActive = true;
			this.draggable = true;
			var routeThis = this;

			function extractIncidents(jsonData) {
				if(!jsonData.leg || !jsonData.leg[0] || !jsonData.leg[0].maneuver) {
					return;
				}

				routeThis.incidents.length = 0;

				jsonData.leg[0].maneuver.map(function(maneuver) {
					if(maneuver.note.length > 0) {
						maneuver.note.map(function(note) {
							if(note.type === "traffic") {
								note.roadName = maneuver.roadName;
								note.roadNumber = maneuver.roadNumber;
								routeThis.incidents.push(note);
							}
						});
					}
				});
			}

			function rebuildRouteFromWaypoints(waypoints) {
				var deferred = $q.defer();
				calculateRouteFromWaypoints(waypoints, 0, function(data) {
					if(data.response && data.response.route && data.response.route.length > 0) {
						routeThis.routeId = data.response.route[0].routeId;
						routeThis.loadFromRouteId(deferred);
					}
				}, function() {
					bridgeInBrowserNotification.addAlert('danger','Unabled to fetch route information.');
					deferred.reject();
				});
				return deferred.promise;
			}

			function extractWaypoints(jsonData) {
				routeThis.waypoints.length = 0;
				jsonData.waypoint.map(function(waypoint) {
					routeThis.waypoints.push({position: mapUtils.jsonCoordToGeoCoord(waypoint.mappedPosition), linkId: waypoint.linkId});
				});
			}

			function extractCalculatedWaypoints(jsonData) {
				if(!jsonData.leg || !jsonData.leg[0] || !jsonData.leg[0].maneuver) {
					return;
				}

				routeThis.calculatedWaypoints.length = 0;

				for(var i = 0, length = jsonData.leg[0].maneuver.length; i < length; i++) {
					var maneuver = jsonData.leg[0].maneuver[i];
					if(i === 0) {
						routeThis.calculatedWaypoints.push({position: mapUtils.jsonCoordToGeoCoord(maneuver.position)});
					}
					if(i < length - 1) {
						routeThis.calculatedWaypoints.push(maneuver.toLink ? {linkId: maneuver.toLink, position: mapUtils.jsonCoordToGeoCoord(maneuver.position)} : {position: mapUtils.jsonCoordToGeoCoord(maneuver.position)});
					}
				}
			}

			this.initializeFromJSON = function(jsonData) {
				routeThis.routeId = jsonData.routeId;
				routeThis.summary = jsonData.summary;
				var tmpShapeArray = [];
				jsonData.shape.map(function(coordinateString) {
					var coordinate = mapUtils.parseCoordinate(coordinateString);
					tmpShapeArray.push(coordinate.latitude, coordinate.longitude);
				});
				routeThis.shape = nokia.maps.geo.Shape.fromLatLngArray(tmpShapeArray, false);

				extractIncidents(jsonData);
				extractWaypoints(jsonData);
				extractCalculatedWaypoints(jsonData);
			};

			this.loadFromRouteId = function(deferred) {
				loadRouteDataByRouteId(routeThis.routeId, function(data) {
					if(data.response && data.response.route) {
						routeThis.initializeFromJSON(data.response.route);
						if(deferred && deferred.resolve) {
							deferred.resolve();
						}
					} else {
						rebuildRouteFromWaypoints(routeThis.calculatedWaypoints);
					}
				});
			};

			this.initializeFromJSON(routeData);

			this.color = ROUTE_COLORS[0];

			var reloadInterval;
			function setReloadInterval() {
				reloadInterval = $interval(routeThis.loadFromRouteId, TWO_AND_A_HALF_MINUTES);
			}
			setReloadInterval();

			this.toggleIsActive = function() {
				routeThis.isActive = !routeThis.isActive;

				if(routeThis.isActive) {
					setReloadInterval();
				} else {
					$interval.cancel(reloadInterval);
				}
			};

			this.updateFromNewWaypoints = function(waypoints) {
				return rebuildRouteFromWaypoints(waypoints);
			};
		};
	})();

	this.search = function(searchText, callback) {
		$http({
			url: GEOCODE_API + "?searchtext=" + searchText + appCodeParameter + appIdParameter + jsonAttributesParameter,
			method: "GET",
			withCredentials: false
		}).success(function(data) {
			callback({error: false, data: data.response.view.length > 0 ? data.response.view[0].result : []});
		}).error(function() {
			callback({error: true, data: []});
		});
	};

	function convertJSONRoutesToRouteObjects(aRoutes) {
		var deferred = $q.defer();
		var i = 0;
		$q.all(aRoutes.map(function(route) {
			var routePromise = that.getRouteByRouteId(route.routeId);
			var color = ROUTE_COLORS[i];
			i++;
			routePromise.then(function(result) {
				result.route.color = color;
			});
			return routePromise;
		})).then(function(routes){
			deferred.resolve(routes);
		});
		return deferred.promise;
	}

	function createRouteObjectsFromWaypoints(waypoints, alternatives, callback) {
		calculateRouteFromWaypoints(waypoints, alternatives, function(data) {
			if(data.response && data.response.route) {
				convertJSONRoutesToRouteObjects(data.response.route).then(function(routes) {
					callback({error: false, routes: routes});
				});
			} else {
				callback({error: true, message: "No routes found", routes: []});
			}
		}, function() {
			callback({error: true, message: "The request failed", routes: []});
		});
	}

	this.calculateAlternativeRoutesBetween = function(start, destination, callback) {
		createRouteObjectsFromWaypoints([start, destination], 2, callback);
	};

	this.rebuildRouteFromWaypoints = function(waypoints, callback) {
		createRouteObjectsFromWaypoints(waypoints, 0, function(result) {
			if(result.error) {
				callback(result);
			} else {
				callback(result.routes[0]);
			}
		});
	};

	this.getRouteByRouteId = function(routeId) {
		var deferred = loadRouteDataByRouteId(routeId, function(data) {
			if(data.response && data.response.route) {
				deferred.resolve({error: false, route: new Route(data.response.route)});
			} else {
				deferred.reject({error: true, message: "Failed to load route data"});
			}
		}, function() {
			deferred.reject({error: true, message: "Failed to load route data"});
		});
		return deferred.promise;
	};
}]);
