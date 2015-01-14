angular.module('bridge.service').service("bridge.service.maps.mapService", ["bridge.service.maps.utils", function () {
	this.createRoutePolyline = function(route, settings) {
		if(!route) {
			throw new Error("Missing input parameter: route");
		}

		if(!route.shape || route.shape.length === 0) {
			throw new Error("Invalid input parameter: route lacks shape");
		}

		if(route.routePolyline) {
			route.routePolyline.removeAllListeners();
		}

		settings = settings || {};
		var penSettings = {
			lineJoin: settings.lineJoin ? settings.lineJoin : "round",
			lineWidth: settings.lineWidth ? settings.lineWidth : 5
		};
		if(settings.strokeColor) {
			penSettings.strokeColor = settings.strokeColor;
		}

		var polyline = new nokia.maps.map.Polyline(route.shape, {pen: penSettings});
		route.routePolyline = polyline;
		return polyline;
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
}]);
