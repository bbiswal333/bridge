angular.module('app.sapedia', []);

angular.module('app.sapedia').directive('app.sapedia', function () {

    var directiveController = ['$scope', '$window', function ($scope, $window) {
        $scope.boxTitle = "SAPedia";
        $scope.boxIcon = '&#xe05c;';
        $scope.boxIconClass = 'icon-lightbulb';        
        $scope.searchButton_click = function () {
            $window.open('https://sapedia.wdf.sap.corp/wiki/index.php?search=' + $scope.searchString + '&title=Special%3ASearch');
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/sapedia/overview.html',
        controller: directiveController
    };
});
