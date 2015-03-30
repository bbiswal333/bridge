angular.module('app.moodBarometer').controller('app.moodBarometer.detailController',['$scope','$http','app.moodBarometer.configService','$window', 'app.moodBarometer.dataService',
	function Controller($scope, $http, appConfig,$window, dataService) {
        $scope.text = dataService.getText();

        $scope.dataQ = [];

        $scope.fill = function(data){
            for(var i = 0; i < data.USERINFO.length; i++){
               var a = { mood :     data.USERINFO[i].MOOD,
                    count :     data.USERINFO[i].COUNT,
                    perc :   $scope.getPercentage(data, i)};
                $scope.dataQ.push(a);
            }
            //console.log($scope.dataQ);
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
