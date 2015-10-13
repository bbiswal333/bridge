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

    $scope.searchViews = function(query) {
        return $http.get("https://ifd.wdf.sap.corp/sap/bc/bridge/FIND_VIEW?query=" + query + "&instance=" + bridgeInstance.getCurrentInstance()).then(function(response) {
            return response.data.VIEWS.map(function(view) {
                return view;
            });
        });
    };

    $scope.assignView = function() {
        if(!$scope.existingView.VIEW_ID || !$scope.existingView.OWNER) {
            return;
        }
        bridgeDataService.addProjectFromOwner($scope.existingView.VIEW_ID, $scope.existingView.OWNER);
    };
}]);
