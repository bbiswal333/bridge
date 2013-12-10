bridgeApp.directive('employeeSearch', function () {

    var directiveController = ['$scope', 'EmployeeSearch', function ($scope, EmployeeSearch) {
        $scope.selectedUser = undefined;

        $scope.doSearch = function (username) {
            return EmployeeSearch.findEmployee(username);
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'directive/EmployeeSearch/EmployeeSearchDirective.html',
        controller: directiveController
    };
});

