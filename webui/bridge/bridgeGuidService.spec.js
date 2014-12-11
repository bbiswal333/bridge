describe("bridge guid service", function() {
	var guidService;

	beforeEach(function() {
		module("bridge.service");
		inject(["bridge.service.guid", function(_guidService) {
			guidService = _guidService;
		}]);
	});

	it("should be defined", function() {
		expect(guidService).toBeDefined();
	});

	it("should generate a new guid", function() {
		expect(guidService.get()).toBeDefined();
	});

	it("should generate unique guids", function() {
		var guid1 = guidService.get();
		var guid2 = guidService.get();
		expect(guid1).not.toEqual(guid2);
	});

	it("should keep track of already taken guids", function() {
		var guid = guidService.get();
		expect(guidService.isTaken(guid)).toBeTruthy();
	});

	it("should generate specific lengths, default length to be 20", function() {
		var guid1 = guidService.get(10);
		var guid2 = guidService.get(15);
		var guid3 = guidService.get();
		expect(guid1.length).toBe(10);
		expect(guid2.length).toBe(15);
		expect(guid3.length).toBe(20);
	});
});
