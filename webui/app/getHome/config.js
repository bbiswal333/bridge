angular.module('app.getHome').service("app.getHome.configservice", ["bridge.service.maps.routing", "bridgeInBrowserNotification", function (bridgeRouting, bridgeInBrowserNotification) {

	this.routes = [];

	this.addRoute = function(name, nokiaRoute) {
		//this.routes.push(routeFactory.fromNokiaRoute(name, nokiaRoute));
		nokiaRoute.name = name;
		this.routes.push(nokiaRoute);
	};

	this.addRouteFromConfig = function(configItem) {
		var that = this;

		function addRoute(route) {
				route.name = configItem.name;
				if(route.isActive !== configItem.isActive) {
					route.toggleIsActive();
				}
				route.originalRoute = route;
				that.routes.push(route);
		}

		function handleRouteResult(result) {
			if(result.error) {
				bridgeRouting.rebuildRouteFromWaypoints(configItem.waypoints, function(rebuildResult) {
					if(rebuildResult.error) {
						bridgeInBrowserNotification.addAlert('danger','Unabled to recover your route "' + configItem.name + '"');
					} else {
						addRoute(rebuildResult.route);
					}
				});
			} else {
				addRoute(result.route);
			}
		}

		if(configItem.routeId) {
			bridgeRouting.getRouteByRouteId(configItem.routeId).then(
				function(result) {
					handleRouteResult(result);
				},
				function(result) {
					handleRouteResult(result);
				}
			);
		}
		//this.routes.push(routeFactory.fromWaypoints(configItem.name, configItem.waypoints, configItem.isActive));
	};

	this.removeRoute = function(route) {
		this.routes.splice(this.routes.indexOf(route), 1);
	};
}]);
