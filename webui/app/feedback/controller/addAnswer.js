/**
 * Created by D062653 on 29.06.2015.
 */
angular.module('app.feedback').controller('addCtrl', ['$scope', 'feedback', '$http', '$window', "bridgeInBrowserNotification", "$location", function ($scope, feedback, $http, $window, bridgeInBrowserNotification, $location) {
    $scope.text2 = "Mein erster Satz!";
    $scope.maxLetters = 500;
    feedback.getQuestion($scope);
    $scope.values = feedback.values;
    $scope.currentLetters = "";
    $scope.add = function () {
        var postObject = {
            question_id: $scope.question_id[0],
            answer_text: $scope.currentLetters
        };
        $http({
            //url: 'api/post?&url=' + encodeURIComponent('http://10.18.170.23:5000/api/2.0/answers'),
            url: 'https://culturewall-demo.mo.sap.corp/api/2.0/answers',
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: 'json',
            timeout: 3000,
            retry_max: 3,
            data: postObject
        }).success(function (res) {

            if(postObject.answer_text == ""){
                bridgeInBrowserNotification.addAlert('danger', "Please enter a message: " , 10);
            }
            else{
                $location.path("/");
                bridgeInBrowserNotification.addAlert('success', "Answer posted successfully -->" + "'" + postObject.answer_text + "'", 10);
            }

        }).error(function (err) {
            bridgeInBrowserNotification.addAlert('danger', "Something went wrong: " + err, 10);
        });
    };
    $scope.changeStatus = function () {
        $scope.values.anonym = !$scope.values.anonym;
    }
}]);