describe("This suite tests various date operations", function () {
	var dataProcessor;

	beforeEach(module("app.lunchWalldorf"));
	beforeEach(inject(["app.lunchWalldorf.dataProcessor", function (_dataProcessor_) {
		 dataProcessor = _dataProcessor_;
	}]));

	it("A date is beeing returned", function () {
		expect(dataProcessor.getDateToDisplay(new Date())).toBeDefined();
	});

	it("Monday before 2pm returns Monday's date object", function () {
		expect(
			dataProcessor.getDateToDisplay(new Date(2014,2,24,10)).getDay()).toBe(
			new Date(2014,2,24,10).getDay());
	});

	it("Monday after 2pm returns Tuesday's date object", function () {
		expect(
			dataProcessor.getDateToDisplay(new Date(2014,2,24,14)).getDay()).toBe(
			new Date(2014,2,25,14).getDay());
	});

	it("Thursday after 2pm returns Friday's date object", function () {
		expect(
			dataProcessor.getDateToDisplay(new Date(2014,2,27,14)).getDay()).toBe(
			new Date(2014,2,28,14).getDay());
	});

	it("Friday before 2pm returns Friday's date object", function () {
		expect(
			dataProcessor.getDateToDisplay(new Date(2014,2,28,10)).getDay()).toBe(
			new Date(2014,2,28,10).getDay());
	});

	it("Friday after 2pm returns null date object", function () {
		expect(
			dataProcessor.getDateToDisplay(new Date(2014,2,28,14)).getDay()).toBe(
			new Date(2014,2,28,14).getDay());
	});

	it("Should set valid date flag to true for Friday", function(){
		expect(dataProcessor.isRegularWeekDay(new Date(2014,2,28))).toBe(true);
	});
	it("Should set valid date flag to false for Saturday", function(){
		expect(dataProcessor.isRegularWeekDay(new Date(2014,2,29))).toBe(false);
	});
	it("Should set valid date flag to false for Sunday", function(){
		expect(dataProcessor.isRegularWeekDay(new Date(2014,2,30))).toBe(false);
	});
	it("Should set valid date flag to true for Monday", function(){
		expect(dataProcessor.isRegularWeekDay(new Date(2014,2,31))).toBe(true);
	});
});
