describe("Testing test.app config service", function () {
	var configService;

	beforeEach(module("app.hydrationMeter"));
	beforeEach(inject(["app.hydrationMeter.configService", function (_configService_) {
		 configService = _configService_;
	}]));

	it("Should return the default config", function () {
		expect(configService.values.currentCups).toBe('0');
	});

	it("Should initialize the backend config on first call", function () {
		var configLoadedFromBackend = {};
		configService.initialize(configLoadedFromBackend);
		expect(configLoadedFromBackend.values.currentCups).toBe('0');
	});

	it("Should return the backend config", function () {
		var configLoadedFromBackend = {};
		configLoadedFromBackend.values = {};
		configLoadedFromBackend.values.currentCups = '2';
		configService.initialize(configLoadedFromBackend);

		expect(configService.values.currentCups).toBe('2');
	});
});
