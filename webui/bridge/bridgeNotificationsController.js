angular.module('bridge.app').
	controller('notificationsController',['$rootScope', '$scope', '$filter', '$timeout', 'bridgeConfig','bridgeDataService', "notifier",
	function ($rootScope, $scope, $filter, $timeout, bridgeConfig, bridgeDataService, notifier){

	$scope.notifications = notifier.allNotifications();

  var apps = bridgeDataService.getProjects()[0].apps;
	$scope.onShowNotifications = function(){
		notifier.allNotifications().forEach(function(notification){
			if (notification.state == "new") {
				notification.state = "seen";
			}
		});
		notifier.store();
	};

  $scope.clearNotifications = function() {
  	notifier.clearNotifications();
  	return false;
  };

	$scope.testNotification = function(){
		notifier.showSuccess("Test","Notification is working","Settings");
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
	        throw new Error ('Unknown State and module name: ' + notification.kindOf + '/ ' + notification.app)
	}
  };

  $scope.getTimeAgo = function(timeInMS){
    return jQuery.timeago(timeInMS);
  };

	$scope.retrieve_xkdc_entry = function(){
		$.ajax({
				url: "https://dynamic.xkcd.com/api-0/jsonp/comic?callback=?",
				dataType: "json",
				jsonpCallback: "xkcddata",
				success: function(data) {
						$("#xkcdcontent").append(
								$("<p>Just read the latest XKCD</p>"),
								$("<img/>").attr({
										src: data.img,
										title: data.alt,
										alt: data.title,
										style: 'width:80%'
								}),
								$("<p><a href='http://xkcd.com'>xkcd</a></p>")
						);
				}
		});
	};

	$scope.amountOfNewNotifications = function(){
		return $filter('filter')(notifier.allNotifications(), {state:'new'}).length;
	};

	$scope.filterNewNotifications = function newNotifications(item) {
		return item.state === "new";
	};

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
			notification.callback.call();
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
