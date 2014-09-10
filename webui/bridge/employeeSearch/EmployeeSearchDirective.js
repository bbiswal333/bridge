angular.module('bridge.employeeSearch', ['bridge.employeePicture', 'bridge.search']);

angular.module('bridge.employeeSearch').directive('bridge.employeeSearch', ['$http', '$window', function ($http, $window) {
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

    var directiveController = ['$scope', function ($scope) {
        if ($scope.setRequired === undefined) {
            $scope.setRequired = false;
        }

        $scope.doSearch = function (username) {
            return $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=18&query=' + getSearchName(username) + '&origin=' + $window.location.origin).then(function (response) {
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
            onSelect: '=onSelect'
        }
    };
}]);
