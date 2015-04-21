var chai = require('chai'),
	expect = chai.expect,
	should = chai.should(),
	TimeService = require("./timeService.js"),
	sinon = require('sinon');

describe.only("Time Service", function() {
	var ts = new TimeService();
	var clock;

	it("should be instantiated", function() {
		ts.should.exist();
		ts.should.be.an('object');
	});

	it("should list all available time zones", function() {
		ts.getTimeZones(function(timeZones) {
			expect(timeZones.length > 0).to.equal(true);
			expect(timeZones[0].country).to.be.a("string");
			expect(timeZones[0].city).to.be.a("string");
		});
	});

	it("should return the timeOffset for Berlin during summer time", function() {
		clock = sinon.useFakeTimers(new Date(2015, 4, 1, 10, 10, 10).getTime());
		ts.getTimeOffsetFor("132", function(offset) {
			expect(offset).to.equal(7200);
			clock.restore();
		});
	});

	it("should return the timeOffset for Berlin during winter time", function() {
		clock = sinon.useFakeTimers(new Date(2015, 1, 1, 10, 10, 10).getTime());
		ts.getTimeOffsetFor("132", function(offset) {
			expect(offset).to.equal(3600);
			clock.restore();
		});
	});

	it("should return the timeOffset for Vancouver during summer time", function() {
		clock = sinon.useFakeTimers(new Date(2015, 4, 1, 10, 10, 10).getTime());
		ts.getTimeOffsetFor("108", function(offset) {
			expect(offset).to.equal(-25200);
			clock.restore();
		});
	});

	it("should return the timeOffset for Vancouver during winter time", function() {
		clock = sinon.useFakeTimers(new Date(2015, 1, 1, 10, 10, 10).getTime());
		ts.getTimeOffsetFor("108", function(offset) {
			expect(offset).to.equal(-28800);
			clock.restore();
		});
	});
});
