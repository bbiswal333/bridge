describe("Worldclock config", function() {
	var testLocation = {name: "Berlin", zoneID: "132", timeOffset: 1};
	var testLocationWithoutTimeOffset =  {name: "Berlin", zoneID: "132"};

	var config;
	var httpBackend;
	beforeEach(function() {
		module("lib.utils");
		module("bridge.service");
		module("app.worldClock");
		inject(["app.worldClock.config", "bridgeDataService", "$httpBackend", "lib.utils.calUtils", function(_config, bridgeDataService, $httpBackend, calUtils) {
			config = _config;
			bridgeDataService.getAppConfigById = function() {
				return {locations: [testLocation]};
			};
			httpBackend = $httpBackend;
			$httpBackend.when('GET').respond('{"offset": 36000}');

			calUtils.now = function() {
				var date = new Date();
				date.getTimezoneOffset = function() {
					return -60;
				};
				return date;
			};
		}]);
	});

	it("should add a new location item from given data", function() {
		config.addLocation(testLocation);
		expect(config.locations.length).toEqual(1);
		expect(config.locations[0].name).toEqual(testLocation.name);
		expect(config.locations[0].longitude).toEqual(testLocation.longitude);
		expect(config.locations[0].latitude).toEqual(testLocation.latitude);
		expect(config.locations[0].timeOffset).toEqual(testLocation.timeOffset);
	});

	it("should remove a location from the locations", function() {
		config.addLocation(testLocation);
		config.removeLocation(config.locations[0]);
		expect(config.locations.length).toEqual(0);
	});

	it("removing an unknown location should be ignored", function() {
		expect(function() { config.removeLocation(testLocation); }).not.toThrow();
	});

	it("should be initialized from config", function() {
		expect(config.locations.length).toEqual(0);
		config.initialize();
		expect(config.locations.length).toEqual(1);
	});

	it("should load the timeOffset from the service", function() {
		config.addLocation(testLocationWithoutTimeOffset);
		expect(config.locations[0].timeOffset).toEqual(0);
		httpBackend.flush();
		expect(config.locations[0].timeOffset).toEqual(32400000);
	});
});
