'use strict';

//array.slice(0) creates a copy of the array, otherwise you are always sorting the same array

describe("sortFilter test", function () {
	var testData = ["a", "b", "x", "Pflaumenkuchen", "Sandstrand", "1"];

	var sortFilter;

	beforeEach(module("myapp"));
	beforeEach(inject(function (_sortFilter_) {
		sortFilter = _sortFilter_;
	}));

	it ("should return a sorted array", function () {
		var sorted = sortFilter(testData, false);
		var sortedTestData = testData.slice(0).sort();

		//console.log("Sorted:" + sorted + " should be " + sortedTestData);
		expect(sorted).toEqual(sortedTestData);
	});

	it ("should return a inverse sorted array", function () {
		var sortedReversed = sortFilter(testData, true);
		//console.log("SortedReversed:" + sortedReversed + " should be " + testData.sort().reverse());

		expect(sortedReversed).toEqual(testData.slice(0).sort().reverse());
	});
});

