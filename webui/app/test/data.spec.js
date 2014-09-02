describe("Testing test.app data service", function () {
	var dataService;

	beforeEach(module("app.test.data"));
	beforeEach(inject(["app.test.dataService", function (_dataService_) {
		 dataService = _dataService_;
	}]));	

	it ("Should return the welcome text", function () {
		expect(dataService.getText()).toBe("Welcome text from DataService, data was reloaded 0 time(s)");
		dataService.reload();
		expect(dataService.getText()).toBe("Welcome text from DataService, data was reloaded 1 time(s)");
	});

	it ("Should return the times of reload", function () {
		expect(dataService.getReloadCounter()).toBe(0);
		dataService.reload();
		expect(dataService.getReloadCounter()).toBe(1);
	});

});
