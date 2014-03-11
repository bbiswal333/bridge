describe("This suite tests various date operations", function () {
	var dateHandling;

	beforeEach(module("app.lunchWalldorf"));
	beforeEach(inject(["app.lunchWalldorf.dateHandling", function (_dateHandling_) {
		 dateHandling = _dateHandling_;
	}]));	

	it ("A date is beeing returned", function () {
		expect(dateHandling.getDateToDisplay(new Date())).toBeDefined();
	});

	it ("Monday before 2pm returns Monday's date object", function () {
		expect(
			dateHandling.getDateToDisplay(new Date(2014,02,24,10)).getDay()).toBe(
			new Date(2014,02,24,10).getDay());
	});

	it ("Monday after 2pm returns Tuesday's date object", function () {
		expect(
			dateHandling.getDateToDisplay(new Date(2014,02,24,14)).getDay()).toBe(
			new Date(2014,02,25,14).getDay());
	});

	it ("Thursday after 2pm returns Friday's date object", function () {
		expect(
			dateHandling.getDateToDisplay(new Date(2014,02,27,14)).getDay()).toBe(
			new Date(2014,02,28,14).getDay());
	});

	it ("Friday before 2pm returns Friday's date object", function () {
		expect(
			dateHandling.getDateToDisplay(new Date(2014,02,28,10)).getDay()).toBe(
			new Date(2014,02,28,10).getDay());
	});

	it ("Friday after 2pm returns null date object", function () {
		//var scope.InvalidLunchMenu = false;
		expect(
			dateHandling.getDateToDisplay(new Date(2014,02,28,14)).getDay()).toBe(
			new Date(2014,02,28,14).getDay());
	});

	it ("Should set valid date flag to false Friday after 2pm", function(){
		expect(dateHandling.getValidDateFlag(new Date(2014,02,28,14))).toBe(false);
	});

	it ("Should set valid date flag to false Saturday before 2pm", function(){
		expect(dateHandling.getValidDateFlag(new Date(2014,02,29,10))).toBe(false);
	});

	it ("Should set valid date flag to false Sunday before 2pm", function(){
		expect(dateHandling.getValidDateFlag(new Date(2014,02,30,10))).toBe(false);
	});
});