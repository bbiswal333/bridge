/*global nokia*/
angular.module('app.getHome').service("app.getHome.mapservice", ['$q', '$http', function ($q, $http) {
	var routeColors = ["#418AC9", "#8561C5", "#707070"];
	var mode = {
			fastest: {
				type: "fastest",
				trafficMode: "enabled",
				transportModes: ["car"]
			},
			fastestWithoutTraffic: {
				type: "fastest",
				trafficMode: "disabled",
				transportModes: ["car"]
			},
			shortest: {
				type: "shortest",
				trafficMode: "enabled",
				transportModes: ["car"]
			}
		};

	nokia.Settings.set("app_id", "TSCNwGZFblBU5DnJLAH8");
	nokia.Settings.set("app_code", "OvJJVLXUQZGWHmYf1HZCFg");
	nokia.Settings.set("secure.baseUrl", "https://route{serviceMode}.nlp.nokia.com/routing/7.2/");
	nokia.Settings.set("secureConnection", "force");

	function enhanceRouteInformation(nokiaRoutes) {
		var i = 0;
		nokiaRoutes.map(function(route) {
			route.draggable = true;
			route.color = routeColors[i];

			i++;
			if(i > routeColors.length - 1) {
				i = 0;
			}
		});
		return nokiaRoutes;
	}

	this.calculateRoutes = function (startCoords, destCoords) {
		var deferred = $q.defer();
		var routingManager = new nokia.maps.advrouting.Manager();

		routingManager.addObserver("state", function(observedRouter, key, value) {
			if (value === "finished") {
				deferred.resolve({error: false, routes: enhanceRouteInformation(observedRouter.getRoutes())});
			} else if (value === "failed") {
				deferred.resolve({error:true, message: observedRouter.getErrorCause().message});
			}
		});
		routingManager.calculateRoute({waypoints: [{position: startCoords}, {position: destCoords}], alternatives: 2, modes: [mode.fastestWithoutTraffic], apiVersion: "7.2"});

		return deferred.promise;
	};

	function getIncidents(route) {
		var incidents = [];
		route.getLinks().map(function(link) {
			if(link.incident) {
				link.incident.map(function(incident) {
					if(incidents.indexOf(incident.text) === -1) {
						incidents.push(incident.text);
					}
				});
			}
		});
		return incidents;
	}

	this.rebuildRouteFromWaypoints = function(waypoints) {
		var deferred = $q.defer();
		var routingManager = new nokia.maps.advrouting.Manager();
		var routingManagerIncidents = new nokia.maps.advrouting.Manager();

		routingManager.addObserver("state", function(observedRouter, key, value) {
			if (value === "finished") {
				routingManagerIncidents.addObserver("state", function(observedRouter, incidentsKey, incidentsValue) {
					var route = enhanceRouteInformation(routingManager.getRoutes())[0];
					if (incidentsValue === "finished") {
						route.incidents = getIncidents(routingManagerIncidents.getRoutes()[0]);
						deferred.resolve(route);
					}
					if(incidentsValue === "failed") {
						deferred.resolve(route);
					}
				});
				routingManagerIncidents.calculateRoute({waypoints: waypoints, alternatives: 0, modes: [mode.fastestWithoutTraffic],
					representationOptions: {
						routeAttributes: ["wp","sc","sm","sh","bb","lg","no"],
						legAttributes: ["wp","mn","li","le","tt"],
						maneuverAttributes: ["po","sh","tt","le",
		        			 "ti","li","pt","pl","eq","la","rn",
		        			 "nr"
		        		 ],
						linkAttributes: ["ic"]}
					});
			} else if (value === "failed") {
				deferred.reject();
			}
		});
		routingManager.calculateRoute({waypoints: waypoints, alternatives: 0, modes: [mode.fastestWithoutTraffic], apiVersion: "7.2"});

		return deferred.promise;
	};

	this.coordinatesToWaypoints = function(coordinates) {
		var  waypoints = new nokia.maps.routing.WaypointParameterList();
		coordinates.map(function(coordinate) {
			waypoints.addCoordinate(coordinate);
		});
		return waypoints;
	};

	this.search = function (sSearchText, callback) {
		var searchManager, searchRequest;

		searchManager = new nokia.maps.advsearch.Manager();
		searchManager.addObserver("state", function (observedManager) {

			if (observedManager.state === "finished") {
				if (observedManager.getLocations().length > 0) {
					callback(observedManager.getLocations());
				}
			}
		});
		searchRequest = {
				searchText: sSearchText
			};
		searchManager.clear();
		searchManager.geocode(searchRequest);
	};

	this.createMap = function(mapContainer) {
		var map = new nokia.maps.map.Display(mapContainer, {
        	center: [53, 13],
        	zoomLevel: 3,
        	components: [new nokia.maps.map.component.Behavior(),
        				 new nokia.maps.map.component.Traffic()]
        });
        map.set("baseMapType", nokia.maps.map.Display.TRAFFIC);
        return map;
	};

	this.formatTime = function(iSeconds) {
		var sec_num = parseInt(iSeconds, 10);
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.round((sec_num - (hours * 3600)) / 60);
		// var seconds = sec_num - (hours * 3600) - (minutes * 60);

		var time = (hours > 0 ? hours + "h " : "") +
					(minutes > 0 ? minutes + "min" : "0min");
					// (seconds > 0 ? seconds + "sec " : "");
		return time;
	};

	this.formatDistance = function(distance) {
		var distanceInt = parseInt(distance, 10);
		return (distanceInt / 1000).toFixed(1) + "km";
	};

	this.getTrafficIncidents = function(boundingBox) {
		return $http.jsonp("https://route.nlp.nokia.com/traffic/6.0/incidents.json?app_id=TSCNwGZFblBU5DnJLAH8&app_code=OvJJVLXUQZGWHmYf1HZCFg&" +
			"bbox=" + boundingBox.topLeft.latitude + "," + boundingBox.topLeft.longitude + ";" + boundingBox.bottomRight.latitude + "," + boundingBox.bottomRight.longitude +
			"&jsoncallback=JSON_CALLBACK");
	};

	this.createRoutePolyline = function(route, settings) {
		var penSettings = {
			lineJoin: settings.lineJoin ? settings.lineJoin : "round",
			lineWidth: settings.lineWidth ? settings.lineWidth : 5
		};
		if(settings.strokeColor) {
			penSettings.strokeColor = settings.strokeColor;
		}

		var routePolyline = new nokia.maps.map.Polyline(route.shape, {pen: penSettings});
		route.routePolyline = routePolyline;
		return routePolyline;
	};
}]);
