angular.module('bridge.app').
	controller('mainSettingsController',['$scope', '$timeout', 'bridgeConfig','bridgeDataService', "notifier",
	function ($scope, $timeout, bridgeConfig, bridgeDataService, notifier){
    
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
		bridgeConfig.config.bridgeSettings.apps = $scope.apps ; 
        bridgeConfig.persistInBackend(bridgeDataService.boxInstances);            
    };

}]);
