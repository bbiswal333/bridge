angular.module('app.getHome').service("app.getHome.routeFactory", ['bridge.service.maps', '$interval', '$q', function (mapService, $interval, $q) {

	var RouteClass = (function() {
		return function(sName, aWaypoints, bIsActive) {
			this.name = sName;
			this.isActive = bIsActive === undefined ? true : bIsActive;
			this.summary = {};
			this.trafficTime = 0;
			var waypoints = aWaypoints;
			var that = this;

			function getRouteInformation() {
				var deferred = $q.defer();
				mapService.rebuildRouteFromWaypoints(waypoints).then(function(routeData) {
					that.summary = routeData.summary;
					that.originalRoute = routeData;
					that.originalRoute.draggable = true;
					deferred.resolve();
				});
				return deferred.promise;
			}

			getRouteInformation();

			var interval;
			function updateInterval() {
				if(this.isActive) {
					interval = $interval(getRouteInformation, 1000 * 60 * 2.5); //update all 2.5 minutes
				} else {
					if(interval !== undefined) {
						$interval.cancel(interval);
					}
				}
			}

			updateInterval();

			this.toJSON = function() {
				return JSON.stringify({
					name: this.name,
					waypoints: waypoints,
					isActive: this.isActive
				});
			};

			this.updateFromNewWaypoints = function(aUpdatedWaypoints) {
				waypoints = aUpdatedWaypoints;
				return getRouteInformation();
			};

			this.toggleIsActive = function() {
				this.isActive = !this.isActive;
				getRouteInformation();
				updateInterval();
			};
		};
	})();

	this.fromNokiaRoute = function(name, nokiaRoute, isActive) {
		var waypoints = [];
		var previousWaypoint;
		nokiaRoute.getManeuvers().map(function(maneuver) {
			if(!previousWaypoint || JSON.stringify(previousWaypoint) !== JSON.stringify(maneuver.position)) {
				waypoints.push({position: maneuver.position});
			}

			previousWaypoint = maneuver.position;
		});
		return new RouteClass(name, waypoints, isActive);
	};

	this.fromWaypoints = function(name, waypoints, isActive) {
		return new RouteClass(name, waypoints, isActive);
	};
}]);
