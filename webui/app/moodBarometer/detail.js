angular.module('app.moodBarometer').controller('app.moodBarometer.detailController', ['$scope', '$http', 'app.moodBarometer.configService', '$window', 'app.moodBarometer.dataService',
    function Controller($scope, $http, appConfig, $window, dataService) {
        $scope.text = dataService.getText();

        $scope.dataQ = [];

        $scope.allMoods = ['Happy', 'OK', 'Worried', 'Sad'];

        $scope.index = function (a) {
            switch (a.mood) {
                case 'Happy':
                    a.index = 0;
                    break;
                case 'OK':
                    a.index = 1;
                    break;
                case 'Worried':
                    a.index = 2;
                    break;
                case 'Sad':
                    a.index = 3;
                    break;
                default :
                    //console.log(a.mood);
                    break;
            }
        };


        $scope.fill = function (data) {
            for (var i = 0; i < data.USERINFO.length; i++) {
                var a = {
                    mood: data.USERINFO[i].MOOD,
                    count: data.USERINFO[i].COUNT,
                    perc: $scope.getPercentage(data, i),
                    index: null
                };

                $scope.index(a);
                $scope.dataQ.push(a);



                $scope.allMoods.splice($scope.dataQ[i].index, 1, null);
            }

            for (var i = 0; i < $scope.allMoods.length; i++) {
                if ($scope.allMoods[i] != null) {
                    var a = {
                        mood: $scope.allMoods[i],
                        count: 0,
                        perc: 0,
                        index: null
                    };
                    $scope.index(a);
                    $scope.dataQ.push(a);
                }

            }


        };



        $scope.getSum = function(data){
            var sum = 0;
            for(var i = 0; i < data.USERINFO.length; i++){
                sum = data.USERINFO[i].COUNT + sum;
            }
            return sum;
        };

        $scope.getPercentage = function(a, i){
            return Math.round((a.USERINFO[i].COUNT / $scope.getSum(a)) * 1000) / 10;
        };


        $scope.getToday = function(){
            $http({
                url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/GET_MOOD_TODAY' + '?origin=' + encodeURIComponent($window.location.origin),
                method: "GET"
            }).success(function (data) {
                $scope.fill(data);
            });

        };

        $scope.getToday();
    }]);
