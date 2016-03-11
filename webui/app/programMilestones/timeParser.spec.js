describe("Milestone-App-Timeparser", function() {
	var timeParser;
	beforeEach(function() {
		module("app.programMilestones");

		inject(["app.programMilestones.timeParser", function(_timeParser) {
			timeParser = _timeParser;
		}]);
	});

	it("should be created", function() {
		expect(timeParser).toBeDefined();
	});

	it("should parse date, time and timezone", function() {
		expect(timeParser.parse("2015-07-20", "10:15:50").toISOString()).toEqual("2015-07-20T10:15:50.000Z");
	});
});
