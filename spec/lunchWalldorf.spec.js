describe("This suite tests various date operations", function () {
	var lunchWalldorf;

	beforeEach(module("app.lunchWalldorf"));
	beforeEach(inject(["app.lunchWalldorf.getDateToDisplay", function (_lunchWalldorf_) {
		 lunchWalldorf = _lunchWalldorf_;
	}]));	

	it ("A date is beeing returned", function () {
		expect(lunchWalldorf(new Date())).toBeDefined();
	});

	it ("Monday before 2pm returns Monday's date object", function () {
		expect(
			lunchWalldorf(new Date(2014,02,24,10)).getDay()).toBe(
			new Date(2014,02,24,10).getDay());
	});

	it ("Monday after 2pm returns Tuesday's date object", function () {
		expect(
			lunchWalldorf(new Date(2014,02,24,14)).getDay()).toBe(
			new Date(2014,02,25,14).getDay());
	});

	it ("Thursday after 2pm returns Friday's date object", function () {
		expect(
			lunchWalldorf(new Date(2014,02,27,14)).getDay()).toBe(
			new Date(2014,02,28,14).getDay());
	});

	it ("Friday before 2pm returns Friday's date object", function () {
		expect(
			lunchWalldorf(new Date(2014,02,28,10)).getDay()).toBe(
			new Date(2014,02,28,10).getDay());
	});

	it ("Friday after 2pm returns next Monday's date object", function () {
		expect(
			lunchWalldorf(new Date(2014,02,28,14)).getDay()).toBe(
			new Date(2014,02,31,15).getDay());
	});

});