"use strict";

describe("nextEventBoxDirective ewsHelperUtils test", function () {
	window.client = {};
	window.client.origin = 'localhost:8000';
	var ewsHelperUtils;

	beforeEach(module("app.rooms.ews"));
	beforeEach(inject(["app.rooms.ews.ewsUtils", function (_ewsUtils_) {
		ewsHelperUtils = _ewsUtils_;
	}]));

	it("should contain a method 'buildEWSUrl'", function () {
		expect(ewsHelperUtils.buildEWSUrl).toBeDefined();
	});

	it("should correctly strech numbers to use n digits", function () {
		function useNDigits (val_i, n_i) {
			var str = new String(val_i);

			for (var i = str.length; i < n_i; i++) {
				str = "0" + str;
			}

			return str;
		}

		expect(useNDigits(1, 5)).toEqual("00001");
	});

	it("should be tested by a working test :-)", function () {
		//3 days from 30.01.2014 10:15:30
		var url = window.client.origin + "localhost:8000/api/getCalDataSSO?from=" + encodeForUrl("2014-01-30T10:15:05Z") + "&to=" + encodeForUrl("2014-02-02T10:15:05Z") + "&format=json";
		var expectation = new RegExp(".*\?from=" + encodeForUrl("2014-01-30T10:15:05Z") + "&to=" + encodeForUrl("2014-02-02T10:15:05Z") + "&format=json$");

		expect(url).toMatch(expectation);
	});

	it("should build a correct url", function () {
		//3 days from 30.01.2014 10:15:30
		var url = ewsHelperUtils.buildEWSUrl(new Date(2014, 0, 30, 10, 15, 5), 3); //0 for January, JavaScript is tricky here!
		var expectation = new RegExp(".*\?from=" + encodeForUrl("2014-01-30T10:15:05Z") + "&to=" + encodeForUrl("2014-02-02T10:15:05Z") + "&format=json$");

		expect(url).toMatch(expectation);
	});

	it("should oncemore build a correct url", function () {
		//1 day from 28.02.2014 00:00:00
		var url = ewsHelperUtils.buildEWSUrl(new Date(2014, 1, 28, 0, 0, 0), 1); //1 for February, JavaScript is tricky here!
		var expectation = new RegExp(".*\?from=" + encodeForUrl("2014-02-28T00:00:00Z") + "&to=" + encodeForUrl("2014-03-01T00:00:00Z") + "&format=json$");

		expect(url).toMatch(expectation);
	});



	it("should be tested by a working test, so test RegEx first", function () {
		expect("2014-02-28T00:00:00Z").toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/);
	});

	it("it should return null if the given date string is invalid", function () {
		expect(ewsHelperUtils.parseEWSDateString("2014-02-28BLA00:00:00Z")).toBeNull();
	});

	it("should parse a date string from Outlook correctly", function () {
		var expected = new Date(2014, 1, 28, 11, 9, 44).getTime(); //1 is February
		var expected2 = new Date(2014, 1, 28, 23, 9, 44).getTime(); //1 is February


		expect(ewsHelperUtils.parseEWSDateString("2014-02-28T10:09:44Z", 1).getTime()).toEqual(expected); //1 for UTC+1, therefore 10 not 11
		expect(ewsHelperUtils.parseEWSDateString("2014-02-28T12:09:44Z", -1).getTime()).toEqual(expected); //-1 for UTC-1, therefore 12 not 11
		expect(ewsHelperUtils.parseEWSDateString("2014-03-01T01:09:44Z", -2).getTime()).toEqual(expected2); //-2 for UTC-2, therefore 23 not 1
	});	

	it("should parse a date string and calculate my current time-zone (UTC+1) into it", function () {
	    var expected = new Date(2014, 0, 10, 12 + (new Date().getTimezoneOffset() / -60), 9, 44).getTime();

		expect(ewsHelperUtils.parseEWSDateStringAutoTimeZone("2014-01-10T12:09:44Z").getTime()).toEqual(expected);
	});
});

function encodeForUrl(val_s) {
	return encodeURIComponent(val_s).replace(/'/g,"%27").replace(/"/g,"%22");
}