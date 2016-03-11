describe("Milestone", function() {
	var milestoneFactory;
	beforeEach(function() {
		module("app.programMilestones");

		inject(["app.programMilestones.milestoneFactory", function(_milestoneFactory) {
			milestoneFactory = _milestoneFactory;
		}]);
	});

	it("should be created", function() {
		expect(milestoneFactory.createInstance()).toBeDefined();
	});

	it("should contain title, start and enddate and parse accordingly and the corresponding program", function() {
		var milestone = milestoneFactory.createInstance("Milestone 1", "2015-12-20", "10:15:50", {});
		expect(milestone.getName()).toEqual("Milestone 1");
		expect(milestone.getDate().toISOString()).toEqual("2015-12-20T10:15:50.000Z");
		expect(milestone.getProgram()).toEqual({});
	});

	it("should know if a milestone is current", function() {
		var milestone = milestoneFactory.createInstance("Milestone 1", "2015-12-20", "10:15:50", {});
		expect(milestone.isUpcoming()).toEqual(false);
		milestone = milestoneFactory.createInstance("Milestone 1", "2515-12-20", "10:15:50"); // too lazy to mock time - I don't plan to live in 2515 anyway - harr harrrr
		expect(milestone.isUpcoming()).toEqual(true);
	});
});
