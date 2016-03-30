// angular.module('app.notification', ['ui.bootstrap.alert']);
angular.module('app.notification').edit = ['$scope', '$modalInstance', 'notification', function($scope, $modalInstance, notification) {

    $scope.notification = notification;
    
    $scope.editMode = true;

    $scope.publish = function() {
        var emptyField = false;
        if (notification.HEADER === undefined || notification.HEADER === '') {
            // border color red
            emptyField = true;
        }
        if (notification.PREVIEW === undefined || notification.PREVIEW === '') {
            // border color red
            emptyField = true;
        }
        if (notification.CONTENT === undefined || notification.CONTENT === '') {
            // border color red
            emptyField = true;
        }

        if (!emptyField) {
            $modalInstance.close();
        }
    };

    $scope.close = function() {
        $scope.alert = { type: 'danger', msg: 'Your changes will be lost.' };

        // $modalInstance.close();
    };

    $scope.view = function() {
        $modalInstance.close();
    };
}];
