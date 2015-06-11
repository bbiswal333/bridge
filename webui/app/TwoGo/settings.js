angular.module('app.TwoGo').appTwoGoSettings =
    ['$scope', "app.TwoGo.configService", function ($scope, configService) {
        $scope.values = configService.values;
        $scope.setDistanceO = function (m) {

            $scope.values.distancefromorigin = m;
            $scope.values.state = m;
        };
        $scope.setDistanceD = function (k) {
            $scope.values.distancefromdestination = k;
            $scope.values.stateD = k;

        };

        $scope.save_click = function () {


            $scope.$emit('closeSettingsScreen'); // Persisting the settings


        };
    }];
