angular.module('bridge.employeeSearch', []);

angular.module('bridge.employeeSearch').directive('bridge.employeeSearch', function () {

    var directiveController = ['$scope', '$http', function ($scope, $http) {
        if ($scope.setRequired === undefined) {
            $scope.setRequired = false;
        }

        $scope.doSearch = function (username) {
            return $http.get('/api/get?url='
                + encodeURIComponent('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=20&query=' + username)).then(function (response) {
                return response.data.DATA;
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

