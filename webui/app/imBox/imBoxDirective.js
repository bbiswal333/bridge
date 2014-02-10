var imBoxApp = angular.module('imBoxApp', []);

imBoxApp.directive('imbox', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Internal Messages";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;';

        $scope.settings = {
            templatePath: "app/imBox/imBoxSettingsTemplate.html",
            controller: undefined,
            id: $scope.boxId,
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/imBox/imBoxDirective.html',
        controller: directiveController
    };
});

    imBoxApp.run(function ($rootScope) {
    var i = 1;
});