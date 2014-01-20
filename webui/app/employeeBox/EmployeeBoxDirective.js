var testBoxApp = angular.module('employeeBoxApp', ['employeeSearch']);

testBoxApp.directive('employeebox', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Employee Search";
        $scope.initilized = true;

        $scope.settings = {
            templatePath: "employeeBox/employeeBoxSettingsTemplate.html",
            controller: {},
            id: $scope.boxId,
        };

        
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/employeeBox/EmployeeBoxDirective.html',
        controller: directiveController
    };
});