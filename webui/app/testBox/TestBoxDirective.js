var testBoxApp = angular.module('testBoxApp', []);

testBoxApp.directive('testbox', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Test Box";
        $scope.initialized = true;

        $scope.settings = {
            templatePath: "testBox/TestBoxSettingsTemplate.html",
            controller: undefined,
            id: $scope.boxId,
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/testBox/TestBoxDirective.html',
        controller: directiveController
    };
});