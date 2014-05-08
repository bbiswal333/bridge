angular.module('bridge.app').
	controller('mainSettingsController',['$rootScope', '$scope', '$timeout', 'bridgeConfig','bridgeDataService', "notifier",
	function ($rootScope, $scope, $timeout, bridgeConfig, bridgeDataService, notifier){
	    $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
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

        $scope.activateArrange = function(){
            $scope.arrage = true;
            console.log('Activate arranging tile...');
        }
}]);
