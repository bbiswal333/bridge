var employeeSearch = angular.module('employeeSearch', []);

employeeSearch.directive('employeeSearch', function () {

    var directiveController = ['$scope', '$http', function ($scope, $http) {
        if ($scope.setRequired === undefined) {
            $scope.setRequired = false;
        }

        $scope.doSearch = function (username) {
            return $http.get('http://localhost:8000/api/get?url='
                + encodeURIComponent('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=20&query=' + username)).then(function (response) {
                return response.data.DATA;
            });
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'control/employeeSearch/EmployeeSearchDirective.html',
        controller: directiveController,
        scope: {
            selectedEmployee: '=selectedEmployee',
            placeholder: '=placeholder',
            setRequired: '=required',
        },
    };
});

