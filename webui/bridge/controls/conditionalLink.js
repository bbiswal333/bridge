angular.module('bridge.controls').directive('bridge.conditionalLink', ["$location", function($location) {
    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/conditionalLink.html',
        transclude: true,
        scope: {
            navigateTo: "@",
            navigateIf: "&"
        },
        controller: ["$scope", function($scope){
            $scope.navigate = function(){
                if ($scope.navigateIf() === true) {
                    $location.path($scope.navigateTo);
                }
            };
        }]
    };
}]);
