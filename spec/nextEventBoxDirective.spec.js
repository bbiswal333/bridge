"use strict";

describe("nextEventBoxDirective ewsUrlBuilder test", function () {
	var ewsUrlBuilder;

	beforeEach(module("nextEventBoxApp"));
	beforeEach(inject(function (_ewsUrlBuilder_) {
		ewsUrlBuilder = _ewsUrlBuilder_;
	}));

	it("should contain a method 'buildEWSUrl'", function () {
		expect(ewsUrlBuilder.buildEWSUrl).toBeDefined();
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
		var url = "localhost:8000/api/getCalDataSSO?from=" + encodeForUrl("2014-01-30T10:15:05Z") + "&to=" + encodeForUrl("2014-02-02T10:15:05Z") + "&format=json";
		var expectation = new RegExp(".*\?from=" + encodeForUrl("2014-01-30T10:15:05Z") + "&to=" + encodeForUrl("2014-02-02T10:15:05Z") + "&format=json$");

		expect(url).toMatch(expectation);
	});

	it("should build a correct url", function () {
		//3 days from 30.01.2014 10:15:30
		var url = ewsUrlBuilder.buildEWSUrl(new Date(2014, 0, 30, 10, 15, 5), 3); //0 for January, JavaScript is tricky here!
		var expectation = new RegExp(".*\?from=" + encodeForUrl("2014-01-30T10:15:05Z") + "&to=" + encodeForUrl("2014-02-02T10:15:05Z") + "&format=json$");

		expect(url).toMatch(expectation);
	});

	it("should oncemore build a correct url", function () {
		//1 day from 28.02.2014 00:00:00
		var url = ewsUrlBuilder.buildEWSUrl(new Date(2014, 1, 28, 0, 0, 0), 1); //1 for February, JavaScript is tricky here!
		var expectation = new RegExp(".*\?from=" + encodeForUrl("2014-02-28T00:00:00Z") + "&to=" + encodeForUrl("2014-03-01T00:00:00Z") + "&format=json$");

		expect(url).toMatch(expectation);
	});	
});

function encodeForUrl(val_s) {
	return encodeURIComponent(val_s).replace(/'/g,"%27").replace(/"/g,"%22");
}