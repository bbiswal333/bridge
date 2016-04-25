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

	it("should map milestone number 0714 to text RTC", function() {
		var milestone = milestoneFactory.createInstance("Milestone 1", "2015-12-20", "10:15:50", {}, "Delivery 1", "0714");
		expect(milestone.getMilestoneTypeAsStr()).toEqual("RTC");
	});

	it("should map milestone number 0928 to text RTC", function() {
		var milestone = milestoneFactory.createInstance("Milestone 1", "2015-12-20", "10:15:50", {}, "Delivery 1", "0928");
		expect(milestone.getMilestoneTypeAsStr()).toEqual("RTC");
	});

	it("should map milestone number 0702 to text ECC", function() {
		var milestone = milestoneFactory.createInstance("Milestone 1", "2015-12-20", "10:15:50", {}, "Delivery 1", "0702");
		expect(milestone.getMilestoneTypeAsStr()).toEqual("ECC");
	});

	it("should map milestone number 0922 to text ECC", function() {
		var milestone = milestoneFactory.createInstance("Milestone 1", "2015-12-20", "10:15:50", {}, "Delivery 1", "0922");
		expect(milestone.getMilestoneTypeAsStr()).toEqual("ECC");
	});

	it("should map milestone number 0210 to text CC", function() {
		var milestone = milestoneFactory.createInstance("Milestone 1", "2015-12-20", "10:15:50", {}, "Delivery 1", "0210");
		expect(milestone.getMilestoneTypeAsStr()).toEqual("CC");
	});

	it("should map milestone number 0932 to text CC", function() {
		var milestone = milestoneFactory.createInstance("Milestone 1", "2015-12-20", "10:15:50", {}, "Delivery 1", "0932");
		expect(milestone.getMilestoneTypeAsStr()).toEqual("CC");
	});

	it("should map milestone number 0108 to text DC", function() {
		var milestone = milestoneFactory.createInstance("Milestone 1", "2015-12-20", "10:15:50", {}, "Delivery 1", "0108");
		expect(milestone.getMilestoneTypeAsStr()).toEqual("DC");
	});
});
