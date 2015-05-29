angular.module('app.TwoGo').appTwoGoSettings =
    ['$scope', "app.TwoGo.configService", function ($scope, configService) {
        $scope.values = configService.values;
        $scope.setDistanceO = function (m) {

            $scope.values.distancefromorigin = m;
            $scope.values.change = true;
            $scope.values.state = m;

        };
        $scope.setDistanceD = function (k) {

            $scope.values.distancefromdestination = k;
            $scope.values.change = true;
            $scope.values.stateD = k;

        };
        $scope.getDistanceO = function () {
            return $scope.values.distancefromorigin;
        };
        $scope.getDistanceD = function () {
            return $scope.values.distancefromdestination;
        };

        $scope.save_click = function () {


            $scope.$emit('closeSettingsScreen'); // Persisting the settings


        };
    }];
