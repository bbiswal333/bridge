angular.module('bridge.search').service('bridge.search.employeeSearch', ['$http', '$window', 'employeeService', function ($http, $window, employeeService) {
    function getSearchName(username) {
        //support format "Jeschke, Christian" <christian.jeschke@sap.com>' from mail clients like outlook
        var searchname = username;
        var outlook_support = username.split('"');
        if(outlook_support.length === 3 && outlook_support[0] === "")
        {
            searchname = outlook_support[1];
        }
        return searchname;
    }

    this.doSearch = function (query, callback) {
        return $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=18&query=' + getSearchName(query) + '&origin=' + $window.location.origin).then(
            function(response) {
                return callback(response.data.DATA);
            }
        );
    };

    this.getDetails = function(employee, callback) {
        employeeService.getData(employee.BNAME).then(function(employeeDetails){
            callback(employeeDetails);
        });
    };

    var that = this;
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-user",
            name: "SAP Employees",
            resultTemplate: "bridge/controls/employeeInput/EmployeeItemTemplate.html",
            defaultSelected: true
        };
    };
    this.findMatches = function(query, resultArray) {
        return that.doSearch(query, function(employees) {
            employees.map(function(employee) {
                resultArray.push({model: employee, label: employee.NACHN + ", " + employee.VORNA + " (" + employee.BNAME + ", " + employee.SAPNA + ")"});
            });
        });
    };
    this.getCallbackFn = function() {
        return function(selectedEmployee) {
            that.getDetails(selectedEmployee.model, function(employeeDetails) {
                employeeService.showEmployeeModal(employeeDetails);
            });
        };
    };
}]);
