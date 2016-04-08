angular.module('app.notification').controller('app.notification.notificationController', ['$scope', '$http', '$modal', 'bridgeInstance',
    function($scope, $http, $modal, bridgeInstance) {

        $http({ method: 'GET', url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/GET_NOTIFICATIONS?instance=' + bridgeInstance.getCurrentInstance()})
            .success(function(data) {
                (data.NOTIFICATIONS).forEach(function(element) {
                    var time = element.TIMESTAMP.toString();
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
