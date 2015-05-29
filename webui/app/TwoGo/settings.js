angular.module('app.TwoGo').appTwoGoSettings =
    ['$scope', "app.TwoGo.configService", function ($scope, configService) {
        $scope.values = configService.values;
        $scope.setDistanceO = function (m) {

            $scope.values.distancefromorigin = m;
           $scope.values.change = true;

        };
        $scope.setDistanceD = function (k) {

           $scope.values.distancefromdestination = k;
            $scope.values.change = true;
        };

        $scope.save_click = function () {


            $scope.$emit('closeSettingsScreen'); // Persisting the settings


        };
    }];
