angular.module('bridge.employeeInput', ['bridge.employeePicture', 'bridge.search']);

angular.module('bridge.employeeInput').directive('bridge.employeeInput', ['$http', '$window', 'bridge.search.employeeSearch', function ($http, $window, employeeSearch) {
    var directiveController = ['$scope', function ($scope) {
        if ($scope.setRequired === undefined) {
            $scope.setRequired = false;
        }

        $scope.doSearch = function(username) {
            return employeeSearch.doSearch(username, function (results) {
                return results;
            });
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/employeeInput/EmployeeInputDirective.html',
        controller: directiveController,
        scope: {
            selectedEmployee: '=?selectedEmployee',
            placeholder: '=?placeholder',
            setRequired: '=?required',
            autofocus: '=?',
            onSelect: '=?onSelect'
        }
    };
}]);
