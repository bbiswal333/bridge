angular.module("bridge.teams", ["bridge.service"]);

angular.module("bridge.teams").controller("bridge.viewBar.newViewController", ["$scope", "$http", "bridge.service.guid", "bridgeInstance", "$window", "$log", "bridgeDataService", "bridgeConfig",
    function($scope, $http, guidService, bridgeInstance, $window, $log, bridgeDataService, bridgeConfig) {
    $scope.viewName = "";
    $scope.createView = function() {
        var guid = guidService.get(32);
        var viewData = {type: "TEAM", view: guid, owner: bridgeDataService.getUserInfo().BNAME, name: $scope.viewName, apps: []};
        bridgeConfig.saveView(guid, viewData).then(
            function() {
                bridgeDataService.getProjects().push(viewData);
            }, function() {

            });
    };
}]);
