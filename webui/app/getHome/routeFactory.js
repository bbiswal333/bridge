angular.module('app.getHome').service("app.getHome.routeFactory", ['app.getHome.mapservice', '$interval', '$q', function (mapService, $interval, $q) {

	var RouteClass = (function() {
		return function(sName, aWaypoints) {
			this.name = sName;
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

			$interval(getRouteInformation, 1000 * 60 * 2.5); //update all 2.5 minutes

			this.toJSON = function() {
				return JSON.stringify({
					name: this.name,
					waypoints: waypoints
				});
			};

			this.updateFromNewWaypoints = function(aUpdatedWaypoints) {
				waypoints = aUpdatedWaypoints;
				return getRouteInformation();
			};
		};
	})();

	this.fromNokiaRoute = function(name, nokiaRoute) {
		var waypoints = [];
		var previousWaypoint;
		nokiaRoute.getManeuvers().map(function(maneuver) {
			if(!previousWaypoint || JSON.stringify(previousWaypoint) !== JSON.stringify(maneuver.position)) {
				waypoints.push({position: maneuver.position});
			}

			previousWaypoint = maneuver.position;
		});
		return new RouteClass(name, waypoints);
	};

	this.fromWaypoints = function(name, waypoints) {
		return new RouteClass(name, waypoints);
	};
}]);
