describe("map utils", function() {
	var utilsService;

	beforeEach(function() {
		module("bridge.service");
		inject(["bridge.service.maps.utils", function(_utilsService) {
			utilsService = _utilsService;
		}]);
	});

	it("should parse coordinate string to geo.Coordinate object", function() {
		var coord1 = utilsService.parseCoordinate("49.2931652,8.6422384");
		var coord2 = utilsService.parseCoordinate("1.1,2");
		var coord3 = utilsService.parseCoordinate("1,2.1");
		var coord4 = utilsService.parseCoordinate("1,2");
		var coord5 = utilsService.parseCoordinate("40.7145513,-74.0071191");

		expect(coord1).toBeDefined();
		expect(coord1.latitude).toEqual(49.2931652);
		expect(coord1.longitude).toEqual(8.6422384);

		expect(coord2).toBeDefined();
		expect(coord2.latitude).toEqual(1.1);
		expect(coord2.longitude).toEqual(2);

		expect(coord3).toBeDefined();
		expect(coord3.latitude).toEqual(1);
		expect(coord3.longitude).toEqual(2.1);

		expect(coord4).toBeDefined();
		expect(coord4.latitude).toEqual(1);
		expect(coord4.longitude).toEqual(2);

		expect(coord5).toBeDefined();
		expect(coord5.latitude).toEqual(40.7145513);
		expect(coord5.longitude).toEqual(-74.0071191);
	});


	it("should fail to parse invalid coordinate strings", function() {
		expect(function() { utilsService.parseCoordinate(""); }).toThrow(new Error("Invalid input parameter: \"\""));
		expect(function() { utilsService.parseCoordinate(); }).toThrow(new Error("Invalid input parameter: \"undefined\""));
		expect(function() { utilsService.parseCoordinate("a.b,2.d"); }).toThrow(new Error("Invalid input parameter: \"a.b,2.d\""));
	});

	it("should parse coordinate from json coordinate object ({latitude: x, longitude: y})", function() {
		var coord = utilsService.jsonCoordToGeoCoord({latitude: 2.1, longitude: 1.2});
		expect(coord.latitude).toEqual(2.1);
		expect(coord.longitude).toEqual(1.2);
	});

	it("should fail to parse coordinate from json coordinate object if attribute is missing", function() {
		expect(function() { utilsService.jsonCoordToGeoCoord(); }).toThrow(new Error("Missing input parameter: JSONCoord"));
		expect(function() { utilsService.jsonCoordToGeoCoord({longitude: 1.2}); }).toThrow(new Error('Invalid input parameter: {"longitude":1.2}'));
		expect(function() { utilsService.jsonCoordToGeoCoord({latitude: 1.2}); }).toThrow(new Error('Invalid input parameter: {"latitude":1.2}'));
	});

	it("should format time in seconds into time string", function() {
		expect(utilsService.formatTime(0)).toEqual("0min");
		expect(utilsService.formatTime(120)).toEqual("2min");
		expect(utilsService.formatTime(1281)).toEqual("21min");
		expect(utilsService.formatTime(3907)).toEqual("1h 5min");
	});

	it("should format distance in meter to kilometer", function() {
		expect(utilsService.formatDistance(0)).toEqual("0km");
		expect(utilsService.formatDistance(120)).toEqual("0.1km");
		expect(utilsService.formatDistance(1281)).toEqual("1.3km");
		expect(utilsService.formatDistance(3907)).toEqual("3.9km");
	});
});
