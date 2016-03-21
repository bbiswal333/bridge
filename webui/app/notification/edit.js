angular.module('app.notification').edit = ['$scope', '$modalInstance', function($scope, $modalInstance) {

    $scope.save = function() {
        // $scope.$emit('closeEditScreen');
        $modalInstance.close();
    };

    $scope.close = function() {
        // $scope.$emit('closeEditScreen');
        $modalInstance.close();
    };
}];
