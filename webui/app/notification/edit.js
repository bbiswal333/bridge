angular.module('app.notification').edit = ['$scope', '$modalInstance', 'notification', function($scope, $modalInstance, notification) {

    $scope.notification = notification;

    $scope.save = function() {
        // $scope.$emit('closeEditScreen');
        $modalInstance.close();
    };

    $scope.close = function() {
        // $scope.$emit('closeEditScreen');
        $modalInstance.close();
    };
}];
