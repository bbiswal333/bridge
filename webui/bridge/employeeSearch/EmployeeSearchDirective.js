angular.module('bridge.employeeSearch', []);

angular.module('bridge.employeeSearch').directive('bridge.employeeSearch', function () {

    var directiveController = ['$scope', '$http', function ($scope, $http) {
        if ($scope.setRequired === undefined) {
            $scope.setRequired = false;
        }

        $scope.doSearch = function (username) {
            // removing stuff the service cannot handle
            if (username.indexOf(",") != -1) {
                username = username.replace(',', ' ');
                username = username.replace('  ', ' ');
                username = username.replace(';', ' ');
                username = username.replace('  ', ' ');
                username = username.replace('.', ' ');
                username = username.replace('  ', ' ');
            };
            return $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=20&query=' + username + '&origin=' + location.origin).then(function (response) {
                return response.data.DATA;
            });
        };

        $scope.onSelect = function ($item, $model, $label) {
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

