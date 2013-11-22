var IEmployeeSearch = {
    findEmployee: function (scope) { throw "Not Implemented"; },
};

var EmployeeSearch = function (http) {
    this.http = http;
};

EmployeeSearch.prototype = Object.create(IEmployeeSearch);

//EmployeeSearch.prototype.findEmployee = function (username, scope) {
//    this.http.get('https://ifd.wdf.sap.corp/sap/bc/abapcq/user_data_json?search=' + username).success(function (data) {
//        scope.foundUser = data.DATA;
//    });
//};

EmployeeSearch.prototype.findEmployee = function (username) {
    return this.http.get('https://ifd.wdf.sap.corp/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=10&query=' + username).then(function (response) {
        var names = [];

        for (var i = 0; i < response.data.DATA.length; i++) {
            names.push(response.data.DATA[i].VORNA + " " + response.data.DATA[i].NACHN);
        };
        return names;
    });
};