/*global nokia*/
angular.module('app.getHome').service("app.getHome.mapservice", ['$q', function ($q) {
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

	function addColorToRoutes(nokiaRoutes) {
		var i = 0;
		nokiaRoutes.map(function(route) {
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
				deferred.resolve({error: false, routes: addColorToRoutes(observedRouter.getRoutes())});
			} else if (value === "failed") {
				deferred.resolve({error:true, message: observedRouter.getErrorCause().message});
			}
		});
		//routingManager.calculateRoute(this.coordinatesToWaypoints([startCoords, destCoords]), [mode.enabled, mode.shortest]);
		routingManager.calculateRoute({waypoints: [{position: startCoords}, {position: destCoords}], alternatives: 2, modes: [mode.fastest]});

		return deferred.promise;
	};

	this.rebuildRouteFromWaypoints = function(waypoints) {
		var deferred = $q.defer();
		var routingManager = new nokia.maps.advrouting.Manager();

		routingManager.addObserver("state", function(observedRouter, key, value) {
			if (value === "finished") {
				deferred.resolve(addColorToRoutes(observedRouter.getRoutes())[0]);
			} else if (value === "failed") {
				deferred.reject();
			}
		});
		//routingManager.calculateRoute(this.coordinatesToWaypoints([startCoords, destCoords]), [mode.enabled, mode.shortest]);
		routingManager.calculateRoute({waypoints: waypoints, alternatives: 0, modes: [mode.fastestWithoutTraffic]});

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
        				 new nokia.maps.map.component.Traffic(),
        				 new nokia.maps.map.component.TrafficIncidents()]
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
}]);
