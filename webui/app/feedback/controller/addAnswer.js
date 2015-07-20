/**
 * Created by D062653 on 29.06.2015.
 */
angular.module('app.feedback').controller('addCtrl', ['$scope', 'feedback', '$http', '$window', "bridgeInBrowserNotification", "$location", "bridgeDataService", function ($scope, feedback, $http, $window, bridgeInBrowserNotification, $location, bridgeDataService) {
    $scope.text2 = "Mein erster Satz!";
    $scope.maxLetters = 500;

    feedback.getQuestion($scope);
    feedback.setQuestion($scope);
    $scope.values = feedback.values;
    $scope.currentLetters = "";
    $scope.registered = false;

    $scope.nutzer = {
        "nummer": bridgeDataService.getUserInfo().BNAME,
        "name": bridgeDataService.getUserInfo().NACHN,
        "vorname": bridgeDataService.getUserInfo().VORNA
    };
    $scope.userInfo = ( "" + $scope.nutzer.name + ", " + $scope.nutzer.vorname + " (" + $scope.nutzer.nummer + ")");
    console.log($scope.userInfo);


    //check registration on CultureWall
    $http({
        url: 'api/get?&url=' + encodeURIComponent('http://10.18.170.23:5000/api/2.0/user'),
        //url: 'https://culturewall-demo.mo.sap.corp/api/2.0/answers',
        method: "GET",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        dataType: 'json',
        timeout: 3000,
        retry_max: 3
    }).success(function (res) {
        //console.log($scope.nutzer.nummer);
        //$scope.registered = res.user_registered;

    }).error(function (err) {
        bridgeInBrowserNotification.addAlert('danger', "Something went wrong: " + err, 10);
    });


    $scope.add = function () {
        var postObject = {
            question_id: $scope.question_id[0],
            answer_text: $scope.currentLetters
        };
        $http({
            url: 'api/post?&url=' + encodeURIComponent('http://10.18.170.23:5000/api/2.0/answers'),
            //url: 'https://culturewall-demo.mo.sap.corp/api/2.0/answers',
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: 'json',
            timeout: 3000,
            retry_max: 3,
            data: postObject
        }).success(function (res) {

            if (postObject.answer_text == "") {
                bridgeInBrowserNotification.addAlert('danger', "Please enter a message: ", 10);
            }
            else {
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