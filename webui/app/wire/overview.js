angular.module('app.wire', []);

angular.module('app.wire').directive('app.wire', function () {

    var directiveController = ['$scope', '$http', function ($scope, $http) {
        $scope.boxTitle = "Wire";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe0d3;';

        /*$http.get('http://localhost:8000/api/get?url=' + 'https%3A%2F%2Fsapwire.hana.ondemand.com%2Fapi%2F1%3Fjson%3D%7B%22function%22%3A%22getmessages%22%2C%22chatroom%22%3A%2287873%22%2C%22lastmessageid%22%3A%220%22%2C%22limit%22%3A%225%22%2C%22previous%22%3A%22false%22%2C%22source%22%3A%22web%22%7D'
        ).success(function(data) {
            $scope.messages = data;
        }).error(function(data) {
        });*/
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/wire/overview.html',
        controller: directiveController
    };
});