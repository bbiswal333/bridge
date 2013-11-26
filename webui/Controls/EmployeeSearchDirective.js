dashboardBox.directive('employeeSearch', function () {

    var directiveController = ['$scope', 'EmployeeSearch', function ($scope, EmployeeSearch) {
        $scope.selectedUser = undefined;

        //$scope.dosearch = function () {
        //    if (!$scope.search)
        //        $scope.search = "";

        //    EmployeeSearch.findEmployee($scope.search, $scope);
        //};
        //$scope.dosearch = function (query, callback) {
        //    EmployeeSearch.findEmployeeBS(query, callback);
        //};
        $scope.doSearch = function (username) {
            return EmployeeSearch.findEmployee(username);
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'Controls/EmployeeSearchDirective.html',
        controller: directiveController
    };
});