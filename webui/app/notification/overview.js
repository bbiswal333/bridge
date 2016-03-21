angular.module('app.notification', []);
angular.module('app.notification').directive('app.notification', [function() {

    var directiveController = ['$scope', function($scope) {
        $scope.appText = "Pretty simple app.";


        $scope.pressButton = function() {
            console.log("hallo");
        }
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/notification/overview.html',
        controller: directiveController
    };
}]);
