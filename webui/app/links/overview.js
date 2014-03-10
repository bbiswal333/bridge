angular.module('app.links', []);

angular.module('app.links').directive('app.link', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Linklist";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;';    
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/links/overview.html',
        controller: directiveController
    };
});