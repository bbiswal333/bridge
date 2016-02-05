angular.module("bridge.teams", ["bridge.service", "mgcrea.ngStrap.dropdown"]).config(function($dropdownProvider) {
    angular.extend($dropdownProvider.defaults, {
        html: true
    });
});

angular.module("bridge.teams").controller("bridge.viewBar.newViewController", ["$scope", "$http", "bridge.service.guid", "bridgeInstance", "$window", "$log", "bridgeDataService", "bridgeConfig", "$modalInstance",
    function($scope, $http, guidService, bridgeInstance, $window, $log, bridgeDataService, bridgeConfig, $modalInstance) {
    $scope.createView = function(viewName) {
        var guid = guidService.get(32);
        var viewData = {type: "TEAM", view: guid, owner: bridgeDataService.getUserInfo().BNAME, name: viewName, apps: []};
        bridgeConfig.saveView(guid, viewData).then(
            function() {
                bridgeDataService.getProjects().push(viewData);
                $modalInstance.close();
            }, function() {

            });
    };

    $scope.searchViews = function(query) {
        return $http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/FIND_VIEW?query=" + query + "&instance=" + bridgeInstance.getCurrentInstance()).then(function(response) {
            return response.data.VIEWS.map(function(view) {
                return view;
            });
        });
    };

    $scope.assignView = function(existingView) {
        if(!existingView.VIEW_ID || !existingView.OWNER) {
            return;
        }
        bridgeDataService.addProject(existingView.VIEW_ID);
        $modalInstance.close();
    };
}]);
