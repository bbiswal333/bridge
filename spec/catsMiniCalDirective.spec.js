describe("The mini calendar shall display information about the current CATS compliance", function () {
	var calUtils;

	beforeEach(module("utils"));
	beforeEach(inject(function (_calUtils_) {
		calUtils = _calUtils_;
	}));

	it("should be possible to get the name of a weekday according to his date", function () {
		var month = 3; //April
		var year = 2014;

		function getFirstWeekdayOfMonth(month_i, year_i) {
			var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

			var date;
			var i = 1;
			do {
				date = new Date(year_i, month_i, i, 0, 0, 0);
				i++;
			} while (date.getDay() == 0 || date.getDay() == 6);

			return weekdays[date.getDay() - 1];
		}

		var day = getFirstWeekdayOfMonth(month, year);

		expect(day).toEqual("Tuesday");
	});

	it("should determine correctly how many days a specific month in a specific year got", function () {
		expect(calUtils.getLengthOfMonth(2014, 1)).toEqual(28);
		expect(calUtils.getLengthOfMonth(2018, 2)).toEqual(31);
		expect(calUtils.getLengthOfMonth(2015, 1)).toEqual(28);
		expect(calUtils.getLengthOfMonth(2013, 1)).toEqual(28);
		expect(calUtils.getLengthOfMonth(2012, 1)).toEqual(29);
	});

	it("should be possible to create array-field by accessing them", function () {
		var ar = new Array();

		ar[5] = new Array();
		ar[5][2] = "Hello";

		expect(ar[5][2]).toEqual("Hello");
	});

	it ("should generate a cal-array of correct size", function () {
		var ar = calUtils.buildCalendarArray(2014, Math.floor(Math.random() * 12)); //0: January, 11 December
		expect(ar.length).toBeGreaterThan(4);
		expect(ar[2].length).toBe(7);
		expect(ar[ar.length-1].length).toBe(7);
	});

	it("should be possible to bind additional data to dates", function () {
		var data = {};
		data[new Date(2014, 1, 4).getTime()] = {state: "free"};
		data[new Date(2014, 1, 5).getTime()] = {state: "busy"};
		data[new Date(2014, 1, 28).getTime()] = {location: "Walldorf"};

		calUtils.addAdditionalData(data);

		var ar = calUtils.buildCalendarArray(2014, 1);

		expect(ar[1][1].data.state).toEqual("free");
		expect(ar[1][2].data.state).toEqual("busy");
		expect(ar[4][4].data.location).toEqual("Walldorf");
	});

	it("the calendar array should start with the correct day", function () {
		var mo = calUtils.buildCalendarArray(2014, 8);
		var tu = calUtils.buildCalendarArray(2013, 9);
		var we = calUtils.buildCalendarArray(2014, 0);
		var th = calUtils.buildCalendarArray(2014, 4);
		var fr = calUtils.buildCalendarArray(2013, 10);
		var sa = calUtils.buildCalendarArray(2013, 5);
		var su = calUtils.buildCalendarArray(2013, 8);

		expect(mo[0][0].dayNr).toBe(1); 
		expect(tu[0][0].dayNr).toBe(30);
		expect(we[0][0].dayNr).toBe(30);
		expect(th[0][0].dayNr).toBe(28);
		expect(fr[0][0].dayNr).toBe(28);
		expect(sa[0][0].dayNr).toBe(27);
		expect(su[0][0].dayNr).toBe(26);
	});
});