bridgeApp.directive('testbox2', function () {

    var directiveController = ['$scope', function ($scope) {

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/testBox2/TestBox2Directive.html',
        controller: directiveController
    };
});