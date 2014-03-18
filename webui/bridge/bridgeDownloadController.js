angular.module('bridge.app').downloadController = function ($scope, $modalInstance) {
    

    $scope.done_click = function () {
        $modalInstance.close();
    };
};