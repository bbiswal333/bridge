describe("The weather app config service", function () {

	var configService, bridgeDataService;

	beforeEach(module("bridge.app"));
	beforeEach(inject(["bridge.menubar.weather.configservice", "bridgeDataService", function (_configService_, _bridgeDataService_) {
		 configService = _configService_;
		 bridgeDataService = _bridgeDataService_;
	}]));

	it("should return the default config", function () {
		expect(configService.getConfig().fahrenheit).toBe(false);
		expect(configService.getConfig().location.name).toBe("Walldorf");
	});

	it("should try to call the bridgeDataService to get the user's building", function () {

		spyOn(bridgeDataService, 'getUserInfo');
		configService.init();
		expect(bridgeDataService.getUserInfo).toHaveBeenCalled();

	});

});
