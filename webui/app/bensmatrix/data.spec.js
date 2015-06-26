describe("Testing bensmatrix.app data service", function () {
	var dataService;

	beforeEach(module("app.bensmatrix.data"));
	beforeEach(inject(["app.bensmatrix.dataService", function (_dataService_) {
		 dataService = _dataService_;
	}]));

	it("Should return the welcome text", function () {
		expect(dataService.getText()).toBe("Text from DataService, app was refreshed 0 time(s).");
		dataService.reload();
		expect(dataService.getText()).toBe("Text from DataService, app was refreshed 1 time(s).");
	});

	it("Should return the times of reload", function () {
		expect(dataService.getReloadCounter()).toBe(0);
		dataService.reload();
		expect(dataService.getReloadCounter()).toBe(1);
	});

});
