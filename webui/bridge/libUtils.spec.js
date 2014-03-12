describe("The calUtils-Lib provides various functions for working with dates", function () {
  var calUtils;

  beforeEach(module("lib.utils"));
  beforeEach(inject(function ($injector) {
    calUtils = $injector.get("lib.utils.calUtils");
  })); 

  it ("should return the week number of a given day 2014-00-01", function () {
    var test1 = calUtils.getWeekNumber(new Date(2014, 0, 1)); 

    expect(test1.weekNo).toBe(1);
    expect(test1.year).toBe(2014);
  });

  it ("should return the week number of a given day 2013-11-29", function () {
    var test2 = calUtils.getWeekNumber(new Date(2013, 11, 29)); 

    expect(test2.weekNo).toBe(52);
    expect(test2.year).toBe(2013);
  });

  it ("should return the week number of a given day 2013-11-30", function () {
    var test3 = calUtils.getWeekNumber(new Date(2013, 11, 30)); 

    expect(test3.weekNo).toBe(1);
    expect(test3.year).toBe(2014);
  });

  it ("should return the week number of a given day 2014-04-15", function () {
    var test4 = calUtils.getWeekNumber(new Date(2014, 4, 15)); 

    expect(test4.weekNo).toBe(20);
    expect(test4.year).toBe(2014);   
  });    
});
