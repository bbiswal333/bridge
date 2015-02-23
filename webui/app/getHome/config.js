angular.module('app.getHome').service("app.getHome.configservice", ["bridge.service.maps.routing", "bridgeInBrowserNotification", function (bridgeRouting, bridgeInBrowserNotification) {

	this.routes = [];

	this.addRoute = function(name, nokiaRoute) {
		//this.routes.push(routeFactory.fromNokiaRoute(name, nokiaRoute));
		nokiaRoute.name = name;
		this.routes.push(nokiaRoute);
	};

	this.addRouteFromConfig = function(configItem) {
		configItem = typeof configItem === "string" ? JSON.parse(configItem) : configItem;
		var that = this;

		//Old configs don't have the isActive property and will be set to false and thus hidden...
		if(!configItem.hasOwnProperty("isActive")) {
			configItem.isActive = true;
		}

		function addRoute(route) {
				route.name = configItem.name;
				if(route.isActive !== configItem.isActive) {
					route.toggleIsActive();
				}
				route.originalRoute = route;
				that.routes.push(route);
		}

		function rebuildFromWaypoints() {
			bridgeRouting.rebuildRouteFromWaypoints(configItem.waypoints, function(rebuildResult) {
				if(rebuildResult.error) {
					bridgeInBrowserNotification.addAlert('danger','Unabled to recover your route "' + configItem.name + '"');
					configItem.calculatedWaypoints = configItem.waypoints;
					that.routes.push(configItem);
				} else {
					addRoute(rebuildResult.route);
				}
			});
		}

		function handleRouteResult(result) {
			if(result.error) {
				rebuildFromWaypoints();
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
		} else if(configItem.waypoints) {
			rebuildFromWaypoints();
		}
	};

	this.removeRoute = function(route) {
		this.routes.splice(this.routes.indexOf(route), 1);
	};
}]);
