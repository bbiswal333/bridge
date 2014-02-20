//bridgeApp.controller('bridgeSettingsController', ['$scope', '$http', 'bridgeDataService', 'bridgeConfig', function Controller($scope, $http, bridgeDataService, bridgeConfig, templateString, templateController) {

angular.module('bridge.app').settingsController = function ($scope, $modalInstance, templateString, templateController, boxController, boxScope) {
    $scope.templateString = templateString;
    $scope.templateController = templateController;
    $scope.boxController = boxController;
    $scope.boxScope = boxScope;
};