describe("The mini calendar shall display information about the current CATS compliance", function () {
	var calUtils;

	beforeEach(module("catsMiniCalBoxApp"));
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
		data[new Date(2014, 1, 4).getTime()] = {id: 1, state: "free"};
		data[new Date(2014, 1, 5).getTime()] = {id: 2, state: "busy"};

		calUtils.addAdditionalData(data);

		var ar = calUtils._buildCalendarArray(2014, 1);
	});
});

function NaturalDate(year, month, day) {
	this.prototype new Date(year, month);
}