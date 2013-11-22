var IEmployeeSearch = {
    findEmployee: function (scope) { throw "Not Implemented"; },
};

var EmployeeSearch = function (http) {
    this.http = http;
};

EmployeeSearch.prototype = Object.create(IEmployeeSearch);

EmployeeSearch.prototype.findEmployee = function (username, scope) {
    this.http.get('https://ifd.wdf.sap.corp/sap/bc/abapcq/user_data_json?search=' + username).success(function (data) {
        scope.foundUser = data.DATA;
    });
};