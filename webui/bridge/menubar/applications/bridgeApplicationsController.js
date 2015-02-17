angular.module('bridge.app').
	controller('bridge.menubar.applicationsController',['$rootScope', '$scope', '$timeout', 'bridgeConfig','bridgeDataService', 'bridge.service.appCreator',
	function ($rootScope, $scope, $timeout, bridgeConfig, bridgeDataService, appCreator){
	    $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
	    $scope.apps = bridgeDataService.getAvailableApps().map(function(app) { return {metadata: app};});
	    $scope.categories = [{name: "All Apps", apps: []}];
	    $scope.appFilter = '';

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
	    	$scope.categories[0].apps.push(app);
	    });

	    $scope.adjustModalSize = function() {
	    	$('.modal-dialog').addClass("menubar-applications-modal");
	    };

	    $scope.toggleInstance = function(metadata) {
	    	if(!metadata.multiInstance) {
	    		var instances = appCreator.getInstancesByType(metadata.module_name);
	    		if(instances && instances.length > 0) {
	    			instances.map(function(instance) {
	    				appCreator.removeInstanceById(instance.metadata.guid);
	    				bridgeDataService.getProjects()[0].apps.splice(bridgeDataService.getProjects()[0].apps.indexOf(instance), 1);
	    			});
	    		} else {
	    			bridgeDataService.getProjects()[0].apps.push(appCreator.createInstance(metadata, {}));
	    		}
	    	}
	    };

	    $scope.hasInstance = function(metadata) {
	    	var instances = appCreator.getInstancesByType(metadata.module_name);
	    	if(!instances || instances.length === 0) {
	    		return false;
	    	} else {
	    		return true;
	    	}
	    };

	    $scope.addAppInstance = function(metadata) {
	    	bridgeDataService.getProjects()[0].apps.push(appCreator.createInstance(metadata, {}));
	    };

	    $scope.removeAppInstance = function(metadata) {
	    	var lastInstance = appCreator.getInstancesByType(metadata.module_name)[appCreator.getInstancesByType(metadata.module_name).length - 1];
	    	bridgeDataService.removeAppById(lastInstance.metadata.guid);
	    };
}]);
