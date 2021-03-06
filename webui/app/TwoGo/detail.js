/**
 * Created by D059391 on 23.04.2015.
 */

angular.module('app.TwoGo').controller('app.TwoGo.detailController', ['$scope', 'app.TwoGo.dataService', '$window',
    function Controller($scope, dataService, $window) {
        $scope.setUrl = function (a) {
            if (a != null) {
                $window.open(a);
            }
        };

        if (dataService.getWhichLinkClicked() === 1) {
            $scope.Heading = "To Home Today";

            $scope.array = dataService.getArrayToday();

        }
        else {
            if (dataService.getWhichLinkClicked() === 2) {
                $scope.Heading = "To Work Tomorrow";
                $scope.array = dataService.getArrayTomorrow();


            } else {

                $scope.Heading = "To Home Tomorrow";
                $scope.array = dataService.getArrayTomorrowH();

            }

        }


    }]);
