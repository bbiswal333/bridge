angular.module('bridge.app').
	controller('notificationsController',['$rootScope', '$scope', '$timeout', 'bridgeConfig','bridgeDataService', "notifier",
	function ($rootScope, $scope, $timeout, bridgeConfig, bridgeDataService, notifier){
	    $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
      $scope.dummyData = ["hello", "testA"];
	    //$scope.apps = bridgeDataService.getProjects()[0].apps;

    	$scope.notificationSupported = notifier.getPermission();

    	function areNotificationsSupported() {
            $timeout(function () {
                $scope.notificationSupported = notifier.getPermission();
            }, 500);
        }

        $scope.requestPermission = function(){
        	notifier.requestPermission( areNotificationsSupported );
        };

        $scope.testNotification = function(){
        	notifier.showSuccess("Test","Notification is working","Settings");
        };

}]);
