﻿angular.module('bridge.employeeSearch', ['bridge.employeePicture']);

angular.module('bridge.employeeSearch').directive('bridge.employeeSearch', function () {

    var directiveController = ['$scope', '$http', function ($scope, $http) {
        if ($scope.setRequired === undefined) {
            $scope.setRequired = false;
        }

        $scope.doSearch = function (username) {
            return $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=18&query=' + username + '&origin=' + location.origin).then(function (response) {
                return response.data.DATA;
            });
        };

        $scope.onSelect = function ($item, $model, $label) {
            // FIND_EMPLOYEE_JSON service call with id as a parameter returns more details about the user. We need TELNR.
            var info = $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + $item.BNAME + '&origin=' + location.origin).then(function (response) {
                    $scope.selectedEmployee = response.data.DATA;
                    $scope.selectedEmployee.TELNR = $scope.selectedEmployee.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');                    
                });
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'bridge/employeeSearch/EmployeeSearchDirective.html',
        controller: directiveController,
        scope: {
            selectedEmployee: '=selectedEmployee',
            placeholder: '=placeholder',
            setRequired: '=required',
        },
    };
});

