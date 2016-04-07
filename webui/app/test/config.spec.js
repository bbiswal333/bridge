describe("Testing test.app config service", function () {
	var configService, bridgeDataService;

	beforeEach(module("app.test", function($provide) {
		var app = {};
		$provide.value("bridgeDataService", {
			getAppsByType: function() {
				return [app];
			}
		});
	}));
	beforeEach(inject(["app.test.configService", "bridgeDataService", function (_configService_, _bridgeDataService_) {
		 configService = _configService_;
		 bridgeDataService = _bridgeDataService_;
	}]));

	it("Should return the default config", function () {
		expect(configService.values.boxSize).toBe('1');
	});

	it("Should initialize the backend config on first call", function () {
		var configLoadedFromBackend = {};
		configService.initialize(configLoadedFromBackend);
		expect(configLoadedFromBackend.values.boxSize).toBe('1');
	});

	it("Should return the backend config", function () {
		var configLoadedFromBackend = {};
		configLoadedFromBackend.values = {};
		configLoadedFromBackend.values.boxSize = '2';
		configService.initialize(configLoadedFromBackend);

		expect(configService.values.boxSize).toBe('2');
	});

	it("should append the returnConfig method to the app instance", function() {
		expect(typeof bridgeDataService.getAppsByType("app.test")[0].returnConfig).toBe("function");
	});
});
