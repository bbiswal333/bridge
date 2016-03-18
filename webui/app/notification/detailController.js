angular.module('app.notification').controller('app.notification.notificationController', ['$scope', '$http',
    function($scope, $http) {

        var that = this;
        $http({ method: 'GET', url: 'https://ifd.wdf.sap.corp/sap/bc/bridge/GET_NOTIFICATIONS' })
            .success(function(data) {
                (data.NOTIFICATIONS).forEach(function(element) {
                    var time = "" + element.TIMESTAMP;
                    element.TIMESTAMP = time.substring(4, 6) + '/' + time.substring(6, 8) + '/' + time.substring(0, 4);
                }, this);
                $scope.data = data;
            });

    }
]);
