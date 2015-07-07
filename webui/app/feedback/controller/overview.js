angular.module('app.feedback', ['ngTagsInput']);
angular.module('app.feedback').directive('app.feedback', ['app.feedback.configService', function (configService) {

    var directiveController = ['$scope', '$location', 'feedback', '$timeout', function ($scope, $location, feedback, $timeout) {
        $scope.like_count = 1;
        $scope.liked = false;
        $scope.btn = true;
        $scope.text = "Meine Antwort!";
        $scope.box.boxSize = 2;
        $scope.delay = '10';
        $scope.allAnswersArray = [];
        $scope.myDisplayedAnswers = [];
        $scope.questionsArray = [];
        var start = 0;
        var p = 1;

        $scope.box.settingsTitle = "Personalize Your Feedback-App!";
        $scope.box.settingScreenData = {
            templatePath: "feedback/settings.html",
            controller: angular.module('app.feedback').appFeedbackSettings,
            id: $scope.boxId

        };
        $scope.getQuestion = function () {
            $.ajax({
                type: 'GET',
                //url:         'https://culturewall-demo.mo.sap.corp/api/2.0/questions/topics',
                url: '/api/get?url=' + encodeURI('http://10.18.170.23:5000/api/2.0/questions/topics'),
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json',
                timeout: 3000,
                retry_max: 3,
                success: function (data) {
                    for (var i = 0; i < data.result.length; i++) {
                        $scope.questionsArray.push(data.result[i]);
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });

            $.ajax({
                type: 'GET',
                //url:         'https://culturewall-demo.mo.sap.corp/api/2.0/answers?page='+p,
                url: '/api/get?url=' + encodeURI('http://10.18.170.23:5000/api/2.0/answers'),
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json',
                timeout: 3000,
                retry_max: 3,
                success: function (data) {
                    console.log("Reply wurde gesetzt!");
                    $scope.reply = Math.round(data._meta.total / data._meta.max_results);
                    console.log($scope.reply);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        };

        $scope.getQuestion();
        $timeout(function () {
            $scope.qId = $scope.questionsArray[start].question_ids;
            $scope.question = $scope.questionsArray[start]._id;
        }, 150);

        $timeout($scope.getAnswer = function () {
            while (p <= $scope.reply) {
                $.ajax({
                    type: 'GET',
                    //url:         'https://culturewall-demo.mo.sap.corp/api/2.0/answers?page='+p,
                    url: '/api/get?url=' + encodeURI('http://10.18.170.23:5000/api/2.0/answers?page=' + p),
                    contentType: 'application/json; charset=UTF-8',
                    dataType: 'json',
                    timeout: 3000,
                    retry_max: 3,
                    success: function (data) {
                        console.log(data);
                        for (var i = 0; i < data._items.length; i++) {

                                $scope.allAnswersArray.push(data._items[i]);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
                p++;
            }

        }, 500);


        $scope.tags = [{
            text: "test"
        }];

        $scope.add = function () {
            $location.path("/add/feedback");
        };

        $scope.prevQuestion = function () {
            if (start == 0) {
                var prev = start + ($scope.questionsArray.length - 1);
                $scope.qId = $scope.questionsArray[prev].question_ids;
                $scope.question = $scope.questionsArray[prev]._id;

                $scope.getAnswer();
                $scope.displayAnswer();


                start = prev;
                console.log(start);
                console.log($scope.allAnswersArray);
                console.log($scope.qId);
            }
            else {
                start--;
                $scope.qId = $scope.questionsArray[start].question_ids;
                $scope.question = $scope.questionsArray[start]._id;

                $scope.getAnswer();
                $scope.displayAnswer();


                console.log(start);
                console.log($scope.allAnswersArray);
                console.log($scope.qId);
            }
        };

        $scope.nextQuestion = function () {
            if (start == $scope.questionsArray.length - 1) {
                var next = 0;
                $scope.qId = $scope.questionsArray[next].question_ids;
                $scope.question = $scope.questionsArray[next]._id;

                $scope.getAnswer();
                $scope.displayAnswer();

                start = next;
                console.log(start);
                console.log($scope.allAnswersArray);
                console.log($scope.qId);
            }
            else {
                start++;
                $scope.qId = $scope.questionsArray[start].question_ids;
                $scope.question = $scope.questionsArray[start]._id;

                $scope.getAnswer();
                $scope.displayAnswer();

                console.log(start);
                console.log($scope.allAnswersArray);
                console.log($scope.qId);
            }
        };

        $scope.count = function () {
            if (!$scope.liked) {
                $scope.like_count++;
                $scope.liked = true;
            }
            else {
                $scope.like_count--;
                $scope.liked = false;
            }
        };

        $timeout($scope.displayAnswer = function () {
            var rand = (Math.random()) * ($scope.allAnswersArray.length);
            $scope.answer = $scope.allAnswersArray[Math.floor(rand)].answer_text;
            if ($scope.allAnswersArray[Math.floor(rand)].name == undefined) {
                $scope.employee = "anonymous";
            }
            else {
                $scope.employee = $scope.allAnswersArray[Math.floor(rand)].name;
            }
        }, 1000);


    }];

    var linkFn = function ($scope) {

        // get own instance of config service, $scope.appConfig contains the configuration from the backend
        configService.initialize($scope.appConfig);

        // watch on any changes in the settings screen
        $scope.$watch("appConfig.values.delay", function () {
            $scope.delay = $scope.appConfig.values.delay;
        }, true);

    };

    return {
        restrict: 'E',
        templateUrl: 'app/feedback/overview.html',
        controller: directiveController,
        link: linkFn
    };


}]);
