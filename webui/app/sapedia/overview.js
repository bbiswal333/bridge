angular.module('app.sapedia', []);

angular.module('app.sapedia').directive('app.sapedia', function () {

    var directiveController = ['$scope', '$window', 'bridgeCounter', function ($scope, $window, bridgeCounter) {
        $scope.boxTitle = "SAPedia";
        $scope.boxIcon = '&#xe05c;';
        bridgeCounter.CollectWebStats('sapedia', 'APPLOAD');
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