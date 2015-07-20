angular.module('app.feedback', ['ngTagsInput']);
angular.module('app.feedback').directive('app.feedback', ['app.feedback.configService', function (configService) {

    var directiveController = ['$scope', '$location', 'feedback', '$interval', '$timeout', function ($scope, $location, feedback, $interval, $timeout) {
        $scope.like_count = 1;
        $scope.liked = false;
        $scope.btn = true;
        $scope.text = "Meine Antwort!";
        $scope.box.boxSize = 2;
        $scope.delay = '10';
        $scope.flowDelay = 700;
        $scope.allAnswersArray = [];
        $scope.questionsArray = [];
        var start = 0;
        var p = 1;


        $scope.box.settingsTitle = "Personalize Your Feedback-App!";
        $scope.box.settingScreenData = {
            templatePath: "feedback/settings.html",
            controller: angular.module('app.feedback').appFeedbackSettings,
            id: $scope.boxId

        };
        $interval($scope.displayAnswer = function () {
            var rand = (Math.random()) * ($scope.allAnswersArray.length);
            if ($scope.allAnswersArray[Math.floor(rand)].answer_text.length > 200) {
                $scope.answer = $scope.allAnswersArray[Math.floor(rand)].answer_text.substring(0, 197) + '...';
            }
            else {
                $scope.answer = $scope.allAnswersArray[Math.floor(rand)].answer_text;
            }
            if ($scope.allAnswersArray[Math.floor(rand)].name == undefined) {
                $scope.employee = "anonymous";
            }
            else {
                $scope.employee = $scope.allAnswersArray[Math.floor(rand)].name;
            }
        }, 3000);

        $scope.getAnswer = function () {
            $scope.allAnswersArray = [];
            while (p <= $scope.reply) {
                $.ajax({

                    type: 'GET',
                    url:         'https://culturewall-demo.mo.sap.corp/api/2.0/answers?page='+p+ '&max_results=40&where={"question_id":' + '"' + $scope.qId + '"' + '}',
                    //url: '/api/get?url=' + encodeURIComponent('http://10.18.170.23:5000/api/2.0/answers?page=' + p + '&max_results=40&where={"question_id":' + '"' + $scope.qId + '"' + '}'),
                    contentType: 'application/json; charset=UTF-8',
                    dataType: 'json',
                    timeout: 3000,
                    retry_max: 3,
                    async: false,
                    success: function (data) {
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
            $scope.displayAnswer();
        };

        $scope.setIndex = function () {
            $scope.qId = $scope.questionsArray[start].question_ids;
            $scope.question = $scope.questionsArray[start]._id;
            feedback.setQuestion($scope);
            $scope.getAnswer();
        };

        $scope.getQuestion = function () {
            $.ajax({
                type: 'GET',
                url:         'https://culturewall-demo.mo.sap.corp/api/2.0/questions/topics',
                //url: '/api/get?url=' + encodeURI('http://10.18.170.23:5000/api/2.0/questions/topics'),
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json',
                timeout: 3000,
                async: false,
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
                url:         'https://culturewall-demo.mo.sap.corp/api/2.0/answers',
                //url: '/api/get?url=' + encodeURI('http://10.18.170.23:5000/api/2.0/answers'),
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json',
                timeout: 3000,
                async: false,
                retry_max: 3,
                success: function (data) {
                    $scope.reply = Math.round(data._meta.total / data._meta.max_results);
                },
                error: function (err) {
                    console.log(err);
                }
            });
            $scope.setIndex();
        };
        $scope.prevQuestion = function () {
            if (start == 0) {
                var prev = start + ($scope.questionsArray.length - 1);
                $scope.qId = $scope.questionsArray[prev].question_ids;
                p = 1;
                $scope.getAnswer();
                start = prev;
                $scope.flowOut = true;
                $timeout(function () {
                    $scope.question = $scope.questionsArray[prev]._id;
                    feedback.setQuestion($scope);
                    $scope.flowOut = false;
                }, $scope.flowDelay);
            }
            else {
                start--;
                $scope.qId = $scope.questionsArray[start].question_ids;

                p = 1;
                $scope.getAnswer();
                $scope.flowOut = true;
                $timeout(function () {
                    $scope.question = $scope.questionsArray[start]._id;
                    feedback.setQuestion($scope);
                    $scope.flowOut = false;
                }, $scope.flowDelay);

            }
        };

        $scope.nextQuestion = function () {
            if (start == $scope.questionsArray.length - 1) {
                var next = 0;
                $scope.qId = $scope.questionsArray[next].question_ids;

                p = 1;
                $scope.getAnswer();

                start = next;
                $scope.flowOut = true;
                $timeout(function () {
                    $scope.question = $scope.questionsArray[next]._id;
                    feedback.setQuestion($scope);
                    $scope.flowOut = false;
                }, $scope.flowDelay);

            }
            else {
                start++;
                $scope.qId = $scope.questionsArray[start].question_ids;

                p = 1;
                $scope.getAnswer();
                $scope.flowOut = true;
                $timeout(function () {
                    $scope.question = $scope.questionsArray[start]._id;
                    feedback.setQuestion($scope);
                    $scope.flowOut = false;
                }, $scope.flowDelay);

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

        $scope.getQuestion();

        $scope.tags = [{
            text: "test"
        }];

        $scope.add = function () {
            $location.path("/add/feedback");
        };

        $interval($scope.displayAnswer(), 5000);


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
