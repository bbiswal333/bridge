angular.module('bridge.app').settingsController = function ($scope, $modalInstance, templateString, templateController, boxController, boxScope, bridgeDataService) {
    $scope.templateString = templateString;
    $scope.templateController = templateController;
    $scope.boxController = boxController;
    $scope.boxScope = boxScope;
    $scope.userData = bridgeDataService.getUserInfo();
};
