var IEmployeeSearch = {
    findEmployee: function (scope) { throw "Not Implemented"; },
};

var EmployeeSearch = function (http) {
    this.http = http;
};

EmployeeSearch.prototype = Object.create(IEmployeeSearch);

EmployeeSearch.prototype.findEmployee = function (username) {
    return this.http.get('http://localhost/api/employee?maxrow=10&query=' + username).then(function (response) {
        //var names = [];

        //for (var i = 0; i < response.data.DATA.length; i++) {
        //    names.push(response.data.DATA[i].VORNA + " " + response.data.DATA[i].NACHN);
        //};
        //return names;

        return response.data.DATA;
    });
};