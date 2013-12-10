bridgeApp.directive('testbox', function () {

    var directiveController = ['$scope', function ($scope) {

    }];

    return {
        restrict: 'E',
        templateUrl: 'directive/TestBox/TestBoxDirective.html',
        controller: directiveController
    };
});