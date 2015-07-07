/**
 * Created by D062653 on 29.06.2015.
 */
angular.module('app.feedback').controller('addCtrl', ['$scope', 'feedback', '$http', '$window', function ($scope, feedback, $http, $window) {
    $scope.text2 = "Mein erster Satz!";
    feedback.getQuestion($scope);

    $scope.addAnswer = {
        answer_text: "Test",
        question_id: ""
    };
    $scope.add = function () {
        $.ajax({
            type: 'POST',
            url: '/api/get?url=' + encodeURI('http://10.18.170.23:5000/api/2.0/answers'),
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            data: $scope.addAnswer,
            timeout: 3000,
            retry_max: 3,
            success: function (res) {
                console.log(res)
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}]);