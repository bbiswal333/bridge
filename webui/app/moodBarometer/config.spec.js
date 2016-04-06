describe("Testing moodBarometer.app config service", function () {
	var configService, bridgeDataService;

	module("bridge.service");
	beforeEach(module("app.moodBarometer", function($provide) {
		var apps = [{}];
		$provide.value("bridgeDataService", {
			getAppsByType: function() {
				return apps;
			}
		});
	}));
	beforeEach(inject(["app.moodBarometer.configService", "bridgeDataService", function (_configService_, _bridgeDataService_) {
		bridgeDataService = _bridgeDataService_;
		configService = _configService_;
	}]));

	it("Should return the default config", function () {
		expect(configService.values.boxSize).toBe(2);
	});

	it("Should initialize the backend config on first call", function () {
		var configLoadedFromBackend = {};
		configService.initialize(configLoadedFromBackend);
		expect(configLoadedFromBackend.values.boxSize).toBe(2);
	});

	it("Should return the backend config", function () {
		var configLoadedFromBackend = {};
		configLoadedFromBackend.values = {};
		configLoadedFromBackend.values.boxSize = 2;
		configService.initialize(configLoadedFromBackend);

		expect(configService.values.boxSize).toBe(2);
	});

	it("should append returnConfig to app", function() {
		expect(typeof bridgeDataService.getAppsByType("app.moodBarometer")[0].returnConfig).toBe("function");
	});
});
