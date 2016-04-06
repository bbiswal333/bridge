describe("Testing test.app config service", function () {
	var configService, bridgeDataService;

	beforeEach(module("app.hydrationMeter", function($provide){
		var app = {};
        var mockDataService = {
            getAppById: function() {
                return app;
            }
        };

        $provide.value("bridgeDataService", mockDataService);
    }));
	beforeEach(inject(["app.hydrationMeter.configService", "bridgeDataService", function (_configService_, _bridgeDataService_) {
		 configService = _configService_;
		 bridgeDataService = _bridgeDataService_;
	}]));

	it("Should return the default config", function () {
		expect(configService.values.currentCups).toBe(0);
	});

	it("Should initialize the backend config on first call", function () {
		var configLoadedFromBackend = {};
		configService.initialize(configLoadedFromBackend);
		expect(configLoadedFromBackend.values.currentCups).toBe(0);
	});

	it("Should return the backend config", function () {
		var configLoadedFromBackend = {};
		configLoadedFromBackend.values = {};
		configLoadedFromBackend.values.currentCups = 2;
		configService.initialize(configLoadedFromBackend, "appId");

		expect(configService.values.currentCups).toBe(2);
		expect(typeof bridgeDataService.getAppById("appId").returnConfig).toBe("function");
	});
});
