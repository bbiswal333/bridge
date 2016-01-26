describe("Program", function() {
	var programFactory;
	beforeEach(function() {
		module("app.programMilestones");

		inject(["app.programMilestones.programFactory", function(_programFactory) {
			programFactory = _programFactory;
		}]);
	});

	it("should be created", function() {
		expect(programFactory.createInstance()).toBeDefined();
	});

	it("should contain guid, name and know whether it's as sirius program or not", function() {
		var program = programFactory.createInstance("GUID1", "Program 1", true);
		expect(program.getName()).toEqual("Program 1");
		expect(program.getGUID()).toEqual("GUID1");
		expect(program.isSiriusProgram()).toEqual(true);

		program = programFactory.createInstance("GUID1", "Program 1", false);
		expect(program.isSiriusProgram()).toEqual(false);
	});

	it("should be serializable", function() {
		var program = programFactory.createInstance("GUID1", "Program 1", true);
		expect(JSON.parse(JSON.stringify(program))).toEqual({GUID: "GUID1", Name: "Program 1", isSiriusProgram: true});
	});
});
