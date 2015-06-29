/**
 * Created by D062653 on 29.06.2015.
 */
angular.module('app.feedback').controller('addCtrl', ['$scope', 'feedback', '$http', function ($scope, feedback, $http) {
    $scope.text2 = "Mein erster Satz!";
    feedback.getQuestion($scope);

    $scope.add = function () {
        $http({
            url: 'http://10.18.170.23:5000/api/2.0/user',
            method: "GET"
        }).success(function (data) {
            console.log(data);
        });
    }
}]);