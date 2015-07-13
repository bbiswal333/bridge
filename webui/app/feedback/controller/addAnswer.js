/**
 * Created by D062653 on 29.06.2015.
 */
angular.module('app.feedback').controller('addCtrl', ['$scope', 'feedback', '$http', '$window', function ($scope, feedback, $http, $window) {
    $scope.text2 = "Mein erster Satz!";
    feedback.getQuestion($scope);


    $scope.addAnswer = {
        question_id: "54e9da9618a309b454968b80",
        answer_text: "Ich bin Fabian!"

    };
    $scope.add = function () {
        var test = {
            question_id: "54e9da9618a309b454968b80",
            answer_text: "Ich bin Fabian!"

        };
        $http({
            url: 'api/post?proxy=true&url='+encodeURIComponent('http://10.18.170.23:5000/api/2.0/answers'),
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
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
    }
}]);