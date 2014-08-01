angular.module('bridge.diagnosis').controller('bridge.diagnosis.corsTestPageController', ["$scope", "$http", function ($scope, $http) {

    $scope.withCredentials = true;

    $scope.callService = function (url) {
        $scope.testResult = "loading...";

        $http({
            method: 'GET',
            url: url,
            withCredentials: $scope.withCredentials
        }).success(function (data) {
            $scope.testResult = "Success!";
        }).error(function (data) {
            $scope.testResult = "Failure! Check debug console for details.";
        });
    };
}]);