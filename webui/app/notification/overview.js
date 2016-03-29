angular.module('app.notification', []);
angular.module('app.notification').directive('app.notification', ['$modal', function($modal) {

    var directiveController = ['$scope', function($scope) {
        $scope.header = "Header";
        $scope.preview = "Preview";
        $scope.content = "Content";

        $scope.showEditPopUp = function name() {
            var notification = {};
            if ($scope.header !== "Header") {
                notification.HEADER = $scope.header;
            }
            if ($scope.preview !== "Preview") {
                notification.PREVIEW = $scope.preview;
            }
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
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/notification/overview.html',
        controller: directiveController
    };
}]);
