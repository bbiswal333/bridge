angular.module('bridge.app').
	controller('mainSettingsController',['$rootScope', '$scope', '$timeout', 'bridgeConfig','bridgeDataService', "notifier",
	function ($rootScope, $scope, $timeout, bridgeConfig, bridgeDataService, notifier){
	    /*$scope.bridgeConfig = bridgeConfig.config;
        
        for (var i = 0; i < $scope.apps.length; i++) 
        {
            var app = bridgeDataService.getAppById();
            if (bridgeDataService.getBoxInstance( $scope.apps[i].id )) {
            $scope.apps[i].boxTitle = bridgeDataService.getBoxInstance( $scope.apps[i].id ).scope.boxTitle;
            $scope.apps[i].boxIcon = bridgeDataService.getBoxInstance( $scope.apps[i].id ).scope.boxIcon;  
            $scope.apps[i].boxIconClass = bridgeDataService.getBoxInstance( $scope.apps[i].id ).scope.boxIconClass;                                
            };
        };*/

	    $scope.apps = bridgeDataService.getProjects()[0].apps;

        
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
}]);
