angular.module('app.getHome').service("app.getHome.configservice", ["app.getHome.routeFactory", function (routeFactory) {

	this.routes = [];

	this.addRoute = function(name, nokiaRoute) {
		this.routes.push(routeFactory.fromNokiaRoute(name, nokiaRoute));
	};

	this.addRouteFromConfig = function(configItem) {
		this.routes.push(routeFactory.fromWaypoints(configItem.name, configItem.waypoints));
	};

	this.removeRoute = function(route) {
		this.routes.splice(this.routes.indexOf(route), 1);
	};
}]);
