angular.module('bridge.app').
	controller('bridge.menubar.notificationsController',['$rootScope', '$location', '$scope', '$filter', '$timeout', 'bridgeConfig','bridgeDataService', "notifier",
	function ($rootScope, $location, $scope, $filter, $timeout, bridgeConfig, bridgeDataService, notifier){

		$scope.notifications = notifier.allNotifications();
		$scope.notificationPopupPermission = notifier.getPermission();

		function openPreferences(){
			$scope.showPreferences = true;
			$scope.preferencesText = "Hide Preferences";
		}
		function closePreferences(){
			$scope.showPreferences = false;
			$scope.preferencesText = "Show Preferences";
		}

	    $scope.preferences_click = function(){
	        if ($scope.showPreferences){
	            closePreferences();
	        } else {
				openPreferences();
			}

	    };

        if($scope.notificationPopupPermission === true) {
            $scope.notificationPopupPermissisonButton = 'Active';
			closePreferences();
        } else if ($scope.notificationPopupPermission === false){
            $scope.notificationPopupPermissisonButton = 'Denied';
			closePreferences();
        } else if ($scope.notificationPopupPermission === 'pleaseAsk'){
            $scope.notificationPopupPermissisonButton = 'Click to Activate';
			openPreferences();
        }

        $scope.requestNotificationPermission = function(){
            if ($scope.notificationPopupPermission === 'pleaseAsk') {
                notifier.requestPermission();
            }
        };

	var apps = bridgeDataService.getProjects()[0].apps;
	$scope.onShowNotifications = function(){
		notifier.allNotifications().forEach(function(notification){
			if (notification.state === "new") {
				notification.state = "seen";
			}
		});
		notifier.store();
	};

	$scope.clearNotifications = function() {
		notifier.clearNotifications();
		return false;
	};

	$scope.getNameOf = function(notification){
		var module_name = notification.app;
		if (!module_name) {
		    return '';
		}
		for(var i = 0; i < apps.length; i++){
		    var app = apps[i];
		    if (app.metadata.module_name === module_name) {
		        return app.metadata.title;
		    }
		}
		throw new Error("module name is invalid!");
	};

	$scope.getIconOf = function(notification){
		var module_name = notification.app;
		for(var i = 0; i < apps.length; i++){
		    var app = apps[i];
		    if (app.metadata.module_name === module_name) {
		        return app.metadata.icon_css;
		    }
		}
		switch(notification.kindOf){
		    case 'success':
		        return 'fa fa-check';
		    case 'info':
		        return 'fa fa-info';
		    case 'error':
		        return 'fa fa-times';
		    default:
		        throw new Error('Unknown State and module name: ' + notification.kindOf + '/ ' + notification.app);
		}
	};

	$scope.getTimeAgo = function(timeInMS){
		return $.timeago(timeInMS);
	};

	$scope.amountOfNewNotifications = function(){
		return $filter('filter')(notifier.allNotifications(), {state:'new'}).length;
	};

	$scope.filterNewNotifications = function newNotifications(item) {
		return item.state === "new";
	};

	$scope.containsExternalURL = function(notification){
		if (notification.routeURL) {
			return notification.routeURL.match(/http.*:\/\/.*/g);
		}
		return false;
	};

	function route(url) {
        // see http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
        _.defer(function() {
            $rootScope.$apply(function() {
                $location.path(url);
            });
        });
    }

	$scope.updateStatus = function(notification, state) {
		notification.state = state;
		notifier.store();
		var divClass = "." + notification.app.replace(".", "-");
		if (notification.app) {
			$(divClass).animate({
		          opacity: 0
		        }, 500 );
			$(divClass).animate({
		          opacity: 1.0
		        }, 500 );
		}
		if(notification.callback && typeof notification.callback === "function") {
			notification.callback(notification);
		} else if (notification.routeURL && !$scope.containsExternalURL(notification)) {
			route(notification.routeURL);
		}
	};
}]).
filter('newNotification', function (){
	return function (notifications)
	{
		if (notifications) {
			var result = [];
			notifications.forEach(function(notification){
				if (notification.state === "new") {
					result.push(notification);
				}
			});
			return result;
		}
	};
});
