angular.module("bridge.teams", ["bridge.service"]);

angular.module("bridge.teams").controller("bridge.viewBar.newViewController", ["$scope", "$http", "bridge.service.guid", "bridgeInstance", "$window", "$log", "bridgeDataService", function($scope, $http, guidService, bridgeInstance, $window, $log, bridgeDataService) {
    $scope.viewName = "";
    $scope.createView = function() {
        var guid = guidService.get(32);
        $http({
            url: 'https://ifd.wdf.sap.corp/sap/bc/bridge/SET_VIEW?view=' + guid + '&viewName=' + $scope.viewName + '&instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin),
            method: "POST",
            data: {apps: [], name: $scope.viewName},
            headers: { 'Content-Type': 'application/json' }
        }).success(function () {
            $log.log("View created successfully in backend");
            bridgeDataService.getProjects().push({type: "TEAM", view: guid, owner: bridgeDataService.getUserInfo().BNAME, name: $scope.viewName, apps: []});
        }).error(function () {
            $log.log("Error when creating view in backend");
        });
    };
}]);
