describe("The calUtils-Lib provides various functions for working with dates", function () {
  var calUtils;

  beforeEach(module("lib.utils"));
  beforeEach(inject(function ($injector) {
    calUtils = $injector.get("lib.utils.calUtils");
  }));

  it("should return the week number of a given day 2013-12-29", function () {
    var test2 = calUtils.getWeekNumber(new Date(2013, 11, 29));

    expect(test2.weekNo).toBe(52);
    expect(test2.year).toBe(2013);
  });

  it("should return the week number of a given day 2013-12-30", function () {
    var test3 = calUtils.getWeekNumber(new Date(2013, 11, 30));

    expect(test3.weekNo).toBe(1);
    expect(test3.year).toBe(2014);
  });

  it("should return the week number of a given day 2013-12-31", function () {
    var test3 = calUtils.getWeekNumber(new Date(2013, 11, 31));

    expect(test3.weekNo).toBe(1);
    expect(test3.year).toBe(2014);
  });

  it("should return the week number of a given day 2014-01-01", function () {
    var test1 = calUtils.getWeekNumber(new Date(2014, 0, 1));

    expect(test1.weekNo).toBe(1);
    expect(test1.year).toBe(2014);
  });

  it("should return the week number of a given day 2014-05-18", function () {
    var test4 = calUtils.getWeekNumber(new Date(2014, 4, 18));

    expect(test4.weekNo).toBe(20);
    expect(test4.year).toBe(2014);
  });

  it("should return the week number of a given day 2014-05-19", function () {
    var test4 = calUtils.getWeekNumber(new Date(2014, 4, 19));

    expect(test4.weekNo).toBe(21);
    expect(test4.year).toBe(2014);
  });

  it("should return the week number of a given day 2014-12-30", function () {
    var test4 = calUtils.getWeekNumber(new Date(2014, 11, 30));

    expect(test4.weekNo).toBe(1);
    expect(test4.year).toBe(2015);
  });

  it("should get UTC", function () {
      var today = new Date();
      expect(calUtils.getUTC().toISOString()).toBe(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).toISOString());
      expect(calUtils.getUTC(2014, 2, 15).toISOString()).toBe("2014-03-15T00:00:00.000Z");
  });

  it("should calculate last day of month", function () {
      expect(calUtils.getLengthOfMonth(2014, 1)).toBe(28);
      expect(calUtils.getLengthOfMonth(2014, 2)).toBe(31);
      expect(calUtils.getLengthOfMonth(2012, 1)).toBe(29);
  });

  it("should substract specified number of months", function () {
      expect(calUtils.substractMonths(calUtils.getUTC(2014, 3, 15), 2).toISOString()).toBe("2014-02-15T00:00:00.000Z");
      expect(calUtils.substractMonths(calUtils.getUTC(2014, 3, 15), 5).toISOString()).toBe("2013-11-15T00:00:00.000Z");
      expect(calUtils.substractMonths(calUtils.getUTC(2014, 3, 30), 2).toISOString()).toBe("2014-02-28T00:00:00.000Z");
  });

  it("should transform date to ABAP format", function () {
      expect(calUtils.transformDateToABAPFormat(new Date("2014-04-15"))).toBe("20140415");
  });

  it("should move date to first day in month", function () {
      expect(calUtils.moveDateToFirstDayInMonth(calUtils.getUTC(2014, 3, 15)).toISOString()).toBe("2014-04-01T00:00:00.000Z");
  });

  it("should get the current time", function() {
    var date = new Date();
    var dateFromLib = calUtils.now();
    expect(dateFromLib.toDateString()).toEqual(date.toDateString());
  });

  it("should get the current time with offset", function() {
    var date = new Date();
    var dateFromLib = calUtils.utcNowWithOffset(3600000);
    expect(dateFromLib.getHours() === date.getHours() + 1).toBeTruthy();
    dateFromLib = calUtils.utcNowWithOffset(7200000);
    expect(dateFromLib.getHours()).toEqual(date.getHours() + 2);
  });
});
