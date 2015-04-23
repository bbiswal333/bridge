angular.module('app.TwoGo').appTwoGoSettings =
    ['$scope', "app.TwoGo.configService", function ($scope, configService) {

        $scope.setDistanceO = function (m) {
debugger;
            configService.values.distancefromorigin = m;
            configService.values.change=true;

        };
        $scope.setDistanceD = function (k) {

            configService.values.distancefromdestination = k;
            configService.values.change=true;
        };
        $scope.values = configService.values;
        $scope.save_click = function () {


            $scope.$emit('closeSettingsScreen'); // Persisting the settings


        };
    }];
