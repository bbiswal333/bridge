dashboardBox.directive('testbox', function () {

    var directiveController = ['$scope', function ($scope) {

    }];

    return {
        restrict: 'E',
        templateUrl: 'Boxes/TestBox/TestBoxDirective.html',
        controller: directiveController
    };
});