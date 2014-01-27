bridgeApp.controller('bridgeSettingsController', ['$scope', '$http', 'bridgeDataService', 'bridgeConfig', function Controller($scope, $http, bridgeDataService, bridgeConfig) {
    $scope.$parent.titleExtension = " - Settings";

    $scope.$on("$destroy", function () {
        bridgeConfig.persistInBackend(bridgeDataService.boxInstances);
    });

    $scope.settingScreens = [];

    for (var boxProperty in bridgeDataService.boxInstances) {
        if (bridgeDataService.boxInstances[boxProperty].scope.hasOwnProperty("settingScreenData") &&
            bridgeDataService.boxInstances[boxProperty].scope.settingScreenData.templatePath !== undefined &&
            angular.isFunction(bridgeDataService.boxInstances[boxProperty].scope.settingScreenData.controller)) {

            $scope.settingScreens.push(bridgeDataService.boxInstances[boxProperty].scope);
        }
    }
}]);