angular.module('app.getHome').service("app.getHome.routeFactory", ['app.getHome.mapservice', '$interval', function (mapService, $interval) {

	var RouteClass = (function() {
		return function(sName, aWaypoints) {
			this.name = sName;
			this.summary = {};
			this.trafficTime = 0;
			var waypoints = aWaypoints;
			var that = this;

			function getRouteInformation() {
				mapService.rebuildRouteFromWaypoints(waypoints).then(function(routeData) {
					that.summary = routeData.summary;
					that.originalRoute = routeData;
				});
			}

			getRouteInformation();

			$interval(getRouteInformation, 1000 * 60 * 2.5); //update all 2.5 minutes

			this.toJSON = function() {
				return JSON.stringify({
					name: this.name,
					waypoints: waypoints
				});
			};
		};
	})();

	this.fromNokiaRoute = function(name, nokiaRoute) {
		var waypoints = [];
		nokiaRoute.getManeuvers().map(function(maneuver) {
			waypoints.push({position: maneuver.position});
		});
		return new RouteClass(name, waypoints);
	};

	this.fromWaypoints = function(name, waypoints) {
		return new RouteClass(name, waypoints);
	};
}]);
