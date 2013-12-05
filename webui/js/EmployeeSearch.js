var IEmployeeSearch = {
    findEmployee: function (scope) { throw "Not Implemented"; },
};

var EmployeeSearch = function (http) {
    this.http = http;
};

EmployeeSearch.prototype = Object.create(IEmployeeSearch);

EmployeeSearch.prototype.findEmployee = function (username) {
    return this.http.get('http://localhost:8000/api/employee?maxrow=10&query=' + username).then(function (response) {
        return response.data.DATA;
    });
};