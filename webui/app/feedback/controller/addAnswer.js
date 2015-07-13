/**
 * Created by D062653 on 29.06.2015.
 */
angular.module('app.feedback').controller('addCtrl', ['$scope', 'feedback', '$http', '$window', function ($scope, feedback, $http, $window) {
    $scope.text2 = "Mein erster Satz!";
    feedback.getQuestion($scope);
    $scope.values = feedback.values;
    $scope.newAnswer = "";
    $scope.add = function () {
        var test = {
                question_id: $scope.question_id[0],
                answer_text: $scope.newAnswer
        };
        $http({
            url: 'api/post?&url='+encodeURIComponent('http://10.18.170.23:5000/api/2.0/answers'),
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: 'json',
            timeout: 3000,
            retry_max: 3,
            data: test
        }).success(function (res) {
            console.log(res);
        }).error(function (err) {
            console.log(err);
        });
    };
    $scope.changeStatus = function(){
        $scope.values.anonym = !$scope.values.anonym;
    }
}]);