// angular.module('app.notification', ['ui.bootstrap.alert']);
angular.module('app.notification').edit = ['$scope', '$modalInstance', 'notification', '$http', function($scope, $modalInstance, notification, $http) {

    $scope.notification = notification;
    $scope.alertVisible = false;
    $scope.editMode = true;

    $scope.publish = function() {
        if (notification.HEADER !== undefined && notification.HEADER !== ''
            && notification.PREVIEW !== undefined && notification.PREVIEW !== ''
            && notification.CONTENT !== undefined && notification.CONTENT !== '') {
            if (notification.ID === undefined) {
                $http({method: 'PUT', url: 'https://ifd.wdf.sap.corp/sap/bc/bridge/INSERT_NOTIFICATION?header='
                    + notification.HEADER + '&instance=' + notification.INSTANCE + '&preview=' + notification.PREVIEW, withCredentials: true, data: notification.CONTENT})
                    .success(function(data) {
                        // TODO if error?
                    });
            } else {
                $http({method: 'POST', url: 'https://ifd.wdf.sap.corp/sap/bc/bridge/UPDATE_NOTIFICATION?header='
                    + notification.HEADER + '&instance=' + notification.INSTANCE + '&preview=' + notification.PREVIEW + '&id=' + notification.ID, withCredentials: true, data: notification.CONTENT})
                    .success(function(data) {
                        // TODO if error?
                    });
            }
            $modalInstance.close();
        }
    };

    $scope.close = function() {
        if (!$scope.alertVisible) {
            $scope.alert = { type: 'danger', msg: 'Your changes will be lost.' };
            $scope.alertVisible = true;
        } else {
            $scope.alertVisible = false;
            $modalInstance.close();
        }
    };

}];
