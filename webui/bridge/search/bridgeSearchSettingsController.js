angular.module("bridge.search").controller("bridge.search.searchSettingsController", ["$scope", "bridge.search", "bridgeDataService", function($scope, bridgeSearch, bridgeDataService){
    $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
    $scope.searchProvider = bridgeSearch.getSearchProvider();
}]);
