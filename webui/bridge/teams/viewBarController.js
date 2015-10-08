angular.module("bridge.teams").controller("bridge.viewBar.Controller", ["$scope", "$modal", "bridgeDataService", "$http", "$q", "bridgeInstance", "$window", "$log", "bridgeInBrowserNotification", "$timeout",
	function($scope, $modal, bridgeDataService, $http, $q, bridgeInstance, $window, $log, bridgeInBrowserNotification, $timeout) {
    $scope.views = bridgeDataService.getProjects();

    $scope.openNewViewModal = function() {
        $modal.open({
            templateUrl: 'bridge/teams/newView.html',
            size: 'sm',
            windowClass: 'teamview-dialog'
        });
    };

    $scope.deleteView = function(viewId) {
    	var deferred = $q.defer();
    	var found = false;
    	bridgeDataService.getProjects().map(function(view) {
    		if(view.owner === bridgeDataService.getUserInfo().BNAME && view.view === viewId) {
    			found = true;
    			$http.get('https://ifd.wdf.sap.corp/sap/bc/bridge/DELETE_VIEW?view=' + viewId + '&instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin)).success(function (data) {
                    $log.log("view deleted successfully");
                    bridgeDataService.getProjects().splice(bridgeDataService.getProjects().indexOf(view), 1);
                    deferred.resolve(data);
                }).error(function (data) {
                    $log.log("Error deleting the view!");
                    deferred.reject(data);
                });
    		} else if(view.view === viewId) {
    			found = true;
    			bridgeDataService.getProjects().splice(bridgeDataService.getProjects().indexOf(view), 1);
    			deferred.resolve();
    		}
    	});
    	if(found === false) {
    		$timeout(function() {
    			deferred.reject();
    			bridgeInBrowserNotification.addAlert("danger", "View not found", 600);
    		}, 100);
    	}
    	return deferred.promise;
    };
}]);
