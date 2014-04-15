angular.module('bridge.app').
	controller('mainSettingsController',['$rootScope', '$scope', '$timeout', 'bridgeConfig','bridgeDataService', "notifier",
	function ($rootScope, $scope, $timeout, bridgeConfig, bridgeDataService, notifier){

        
        for (var i = $scope.apps.length - 1; i >= 0; i--) 
        {        
            var scope = bridgeDataService.getBoxInstance( $scope.apps[i].id ).scope;                    
        };

        
    	$scope.notificationSupported = notifier.getPermission();

        areNotificationsSupported = function(){
            $timeout(function () {
            	$scope.notificationSupported = notifier.getPermission()}, 500);
        };

        $scope.requestPermission = function(){
        	notifier.requestPermission( areNotificationsSupported );
        };

        $scope.testNotification = function(){
        	notifier.showSuccess("Test","Notification is working","Settings");
        };

        $scope.saveConfig = function(){
    		bridgeConfig.config.bridgeSettings.apps = $scope.apps; 
            bridgeConfig.persistInBackend(bridgeDataService.boxInstances);            
        };

}]);
