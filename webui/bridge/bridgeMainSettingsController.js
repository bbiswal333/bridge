angular.module('bridge.app').controller('mainSettingsController',['$scope', 'bridgeConfig','bridgeDataService', function ($scope, bridgeConfig, bridgeDataService){
    
	$scope.saveConfig = function(){
		bridgeConfig.config.bridgeSettings.apps = $scope.apps ; 
        bridgeConfig.persistInBackend(bridgeDataService.boxInstances);            
    };

}]);
