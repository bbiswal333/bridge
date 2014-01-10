﻿bridgeApp.directive('testbox', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Test Box";
		$scope.initilized = true;
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/testBox/TestBoxDirective.html',
        controller: directiveController
    };
});