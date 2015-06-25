describe("Testing myFirstApp.app config service", function () {
	var configService;

	beforeEach(module("app.myFirstApp"));
	beforeEach(inject(["app.myFirstApp.configService", function (_configService_) {
		 configService = _configService_;
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
});
