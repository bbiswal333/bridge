angular.module("bridge.search").controller("bridge.search.searchSettingsController", ["$scope", "bridge.search", "bridgeDataService", "bridgeConfig", function($scope, bridgeSearch, bridgeDataService, bridgeConfig){
    $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
    $scope.searchProvider = bridgeSearch.getSearchProvider();

    $scope.$watch("bridgeSettings.searchProvider", function(){
        bridgeConfig.store(bridgeDataService);
    }, true);
}]);
