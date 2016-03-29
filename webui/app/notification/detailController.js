angular.module('app.notification').controller('app.notification.notificationController', ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {

        $http({ method: 'GET', url: 'https://ifd.wdf.sap.corp/sap/bc/bridge/GET_NOTIFICATIONS' })
            .success(function(data) {
                (data.NOTIFICATIONS).forEach(function(element) {
                    var time = "" + element.TIMESTAMP;
                    element.TIMESTAMP = time.substring(4, 6) + '/' + time.substring(6, 8) + '/' + time.substring(0, 4);
                }, this);
                $scope.data = data;
            });


        $scope.showEditPopUp = function name(notification) {
            $scope.notification = notification;
            $modal.open({
                templateUrl: 'app/notification/edit.html',
                windowClass: 'edit-dialog',
                controller: angular.module('app.notification').edit,
                resolve: {
                    notification: function() {
                        return notification;
                    }
                }
            });
        };
    }
]);
