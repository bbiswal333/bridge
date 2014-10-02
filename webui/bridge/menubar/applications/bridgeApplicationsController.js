angular.module('bridge.app').
	controller('bridge.menubar.applicationsController',['$rootScope', '$scope', '$timeout', 'bridgeConfig','bridgeDataService',
	function ($rootScope, $scope, $timeout, bridgeConfig, bridgeDataService){
	    $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
	    $scope.apps = bridgeDataService.getProjects()[0].apps;
	    $scope.categories = [];//{name: "All Apps", apps: []}];

	    function findCategoryInList(name) {
	    	for(var i = 0, length = $scope.categories.length; i < length; i++) {
	    		if($scope.categories[i].name === name) {
	    			return $scope.categories[i];
	    		}
	    	}
	    	return false;
	    }

	    $scope.apps.map(function(app) {
	    	if(app.metadata.categories) {
	    		app.metadata.categories.map(function(category) {
	    			if(!findCategoryInList(category)) {
	    				$scope.categories.push({name: category, apps: [app]});
	    			} else {
						findCategoryInList(category).apps.push(app);
	    			}
	    		});
	    	}
	    	//$scope.categories[0].apps.push(app);
	    });

	    $scope.adjustModalSize = function() {
	    	$('.modal-dialog').addClass("menubar-applications-modal");
	    };
}]);
