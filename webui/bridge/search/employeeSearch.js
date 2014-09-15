angular.module('bridge.search').service('bridge.search.employeeSearch', ['$http', '$window', function ($http, $window) {
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
        $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + employee.BNAME + '&origin=' + $window.location.origin).then(
            function(response) {
                var employeeDetails = response.data.DATA;
                employeeDetails.TELNR = employeeDetails.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
                employeeDetails.TELNR_MOB = employeeDetails.TELNR_MOBILE.replace(/ /g, '').replace(/-/g, '');

                $http.get('/bridge/search/buildings.xml').then(function (buildingResponse) {
                    var data = new X2JS().xml_str2json(buildingResponse.data);
                    for(var i = 0; i < data.items.item.length; i++)
                    {
                        if(data.items.item[i].objidshort === employee.BUILDING && data.items.item[i].geolinkB !== undefined)
                        {
                            employeeDetails.building_url = data.items.item[i].geolinkB;
                            employeeDetails.city = data.items.item[i].city;
                            employeeDetails.street = data.items.item[i].street;
                        }
                    }
                });
                return callback(employeeDetails);
            }
        );
    };

    var that = this;
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-user",
            name: "SAP Employees",
            resultTemplate: "bridge/controls/employeeInput/EmployeeItemTemplate.html"
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
            $window.open("https://people.wdf.sap.corp/profiles/" + selectedEmployee.model.BNAME);
        };
    };
}]);
