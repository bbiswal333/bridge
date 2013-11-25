module("EmployeeSearch");
test("test Find Employee", function () {
    var httpMock = {
        get: function () {
            return {
                then: function (succFunc) {
                    var response = {};
                    response.data = employeeSearchData;
                    return succFunc(response);
                }
            };
        }
    };

    var scope = {};
    httpMock.defaults = {};

    var employeeSearch = new EmployeeSearch(httpMock);
    var foundNames = employeeSearch.findEmployee("Schueler");

    equal(foundNames.length, 6);
});