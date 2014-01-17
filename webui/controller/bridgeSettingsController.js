bridgeApp.controller('bridgeSettingsController', ['$scope', '$http', 'bridgeDataService', function Controller($scope, $http, bridgeDataService) {
    $scope.$parent.titleExtension = " - Settings";
    $scope.settingScreens = [];

    for (var boxProperty in bridgeDataService.boxInstances) {
        if (bridgeDataService.boxInstances[boxProperty].scope.hasOwnProperty("settings") &&
            bridgeDataService.boxInstances[boxProperty].scope.settings.templatePath !== undefined) {

            //bridgeDataService.boxInstances[boxProperty].scope.settings.templatePath = "app/" + bridgeDataService.boxInstances[boxProperty].scope.settings.templatePath;
            $scope.settingScreens.push(bridgeDataService.boxInstances[boxProperty].scope);
        }
    }
}]);