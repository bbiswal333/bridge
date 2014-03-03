angular.module('bridge.app').settingsController = function ($scope, $modalInstance, templateString, templateController, boxController, boxScope) {
    $scope.templateString = templateString;
    $scope.templateController = templateController;
    $scope.boxController = boxController;
    $scope.boxScope = boxScope;

    $scope.done_click = function () {
        $modalInstance.close();
    };
};