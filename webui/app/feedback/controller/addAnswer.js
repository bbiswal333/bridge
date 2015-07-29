/**
 * Created by D062653 on 29.06.2015.
 */
angular.module('app.feedback').controller('addCtrl', ['$scope', 'feedback', '$http', '$window', "bridgeInBrowserNotification", "$location", "bridgeDataService", function ($scope, feedback, $http, $window, bridgeInBrowserNotification, $location, bridgeDataService) {

    $scope.text2 = "Mein erster Satz!";
    $scope.maxLetters = 500;
    var ip = "10.18.170.23:5000";
    $scope.anonym = false;
    feedback.getQuestion($scope);
    feedback.setQuestion($scope);
    $scope.values = feedback.values;
    $scope.registered = false;
    $scope.currentLetters = '';
    $scope.noLetters =true;
    $scope.waitUntilSuccess = false;
    $scope.sent = false;


    $scope.nutzer = {
        "nummer": bridgeDataService.getUserInfo().BNAME,
        "name": bridgeDataService.getUserInfo().NACHN,
        "vorname": bridgeDataService.getUserInfo().VORNA
    };
    $scope.userInfo = ( "" + $scope.nutzer.name + ", " + $scope.nutzer.vorname + " (" + $scope.nutzer.nummer + ")");
    console.log($scope.userInfo);

    //check registration on CultureWall
    $http({
        url: 'api/get?&url=' + encodeURIComponent('http://'+ip+'/api/2.0/user'),
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
        $scope.registered = res.user_registered;

    }).error(function (err) {
        bridgeInBrowserNotification.addAlert('danger', "Something went wrong: " + err, 10);
    });


    $scope.add = function () {
        $scope.waitUntilSuccess = true;
        var postObject = {
            question_id: $scope.question_id[0],
            answer_text: $scope.currentLetters
        };
        $http({
            // url: 'api/post?&url=' + encodeURIComponent('http://10.18.170.23:5000/api/2.0/answers?anon=true'),
            url: 'api/post?&url=' + encodeURIComponent('http://'+ip+'/api/2.0/answers'),
            //url: 'https://culturewall-demo.mo.sap.corp/api/2.0/answers',
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'anon': $scope.anonym
            },
            dataType: 'json',
            timeout: 1000,
            data: postObject
        }).success(function (res) {

            if (postObject.answer_text == "") {
                bridgeInBrowserNotification.addAlert('danger', "Please enter a message! ", 10);
            }
            else {
                $scope.waitUntilSuccess = false;
                $scope.currentLetters = "";
                $scope.noLetters = true;
                $scope.sent = true;

                //console.log("waitUntilSuccess:");
                //console.log($scope.waitUntilSuccess);
                //console.log("currentLetters:");
                //console.log($scope.currentLetters);
                //console.log("sent:");
                //console.log( $scope.sent);
            }

        }).error(function (err) {
            bridgeInBrowserNotification.addAlert('danger', "Something went wrong: " + err, 10);
        });
    };
    $scope.changeStatus = function () {
        //$scope.values.anonym = !$scope.values.anonym;
        $scope.currentLetters = "sd";
    };
//$scope.changeState = function(){
//    var h1 = document.getElementsByTagName("button")[0];
//    var att = document.createAttribute("disabled");
//    console.log(h1);
//h1.setAttributeNode(att);
//};


    $scope.$watch(function (scope) {
            return scope.currentLetters;
        },
        function () {
            if ($scope.currentLetters != "" && $scope.currentLetters.length > 3) {
                $scope.noLetters = false;
            }
            else if ($scope.currentLetters == "" || $scope.currentLetters.length <= 3 ) {
                $scope.noLetters = true;
            }
        });
}]);