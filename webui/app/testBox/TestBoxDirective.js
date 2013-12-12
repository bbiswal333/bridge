bridgeApp.directive('testbox', function () {

    var directiveController = ['$scope', function ($scope) {

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/testBox/TestBoxDirective.html',
        controller: directiveController
    };
});