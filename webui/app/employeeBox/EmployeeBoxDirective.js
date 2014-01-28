var testBoxApp = angular.module('employeeBoxApp', ['employeeSearch']);

testBoxApp.directive('employeebox', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Employee Search";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe036';

        $scope.settings = {
            templatePath: "employeeBox/employeeBoxSettingsTemplate.html",
            controller: {},
            id: $scope.boxId,
        };

        
    }];

    //get details for employee like email, sapname, telefone number, inhouse mail, manager, mobile number
    /*$scope.$watch('selectedEmployee', function () { 
        if(selectedEmployee != undefined && selectedEmployee.BNAME != undefined)
        {

                this.http.get('http://localhost:8000/api/get?url=' + encodeURIComponent('https://ifp.wdf.sap.corp/sap/bc/devdb/find_employee?id=' + config.getQueryString() + ''))
        .success(function (data) {

            dataService.data = {
                prio1: data.PRIOS.PRIO1,
                prio2: data.PRIOS.PRIO2,
                prio3: data.PRIOS.PRIO3,
                prio4: data.PRIOS.PRIO4,
            };

            $scope.EmployeeDetails
        }
    });*/

    return {
        restrict: 'E',
        templateUrl: 'app/employeeBox/EmployeeBoxDirective.html',
        controller: directiveController
    };
});