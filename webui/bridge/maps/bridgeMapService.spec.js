describe("bridgeMapService", function() {
	var mapService;

	const TEST_ROUTE = {
		shape: [new nokia.maps.geo.Coordinate(49.2931652, 8.6422384), new nokia.maps.geo.Coordinate(49.2938519,8.6432683), new nokia.maps.geo.Coordinate(49.295032, 8.6449206), new nokia.maps.geo.Coordinate(49.2960083,8.6463583, 49.2961693)]
	};

	beforeEach(function() {
		module("bridge.service");
		inject(["bridge.service.maps.mapService", function(_mapService) {
			mapService = _mapService;
		}]);
	});

	it("should fail to create a polyline of input parameters are wrong", function() {
		expect(function() { mapService.createRoutePolyline(); }).toThrow(new Error("Missing input parameter: route"));
		expect(function() { mapService.createRoutePolyline({}); }).toThrow(new Error("Invalid input parameter: route lacks shape"));
		expect(function() { mapService.createRoutePolyline({shape: []}); }).toThrow(new Error("Invalid input parameter: route lacks shape"));
	});

	it("should create a polyline object from a given route", function() {
		var polyline = mapService.createRoutePolyline(TEST_ROUTE);
		expect(polyline.lineJoin).toBeDefined();
		expect(polyline.width).toBeDefined();
		expect(polyline.color).toBeDefined();
		expect(TEST_ROUTE.routePolyline).toBeDefined();
	});

	it("should create a polyline object from a given route using settings", function() {
		var polyline = mapService.createRoutePolyline(TEST_ROUTE, {strokeColor: "#000000", lineWidth: 10});
		expect(polyline.width).toEqual(10);
		expect(polyline.color).toEqual("#000000");
	});

	it("should create a map", function() {
		var container = $("<div></div>");
		expect(container[0].innerHTML).toEqual("");
		var map = mapService.createMap(container[0]);
		expect(map).toBeDefined();
		expect(container[0].innerHTML).not.toEqual("");
	});
});
