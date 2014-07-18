angular.module('bridge.app').
	controller('notificationsController',['$rootScope', '$scope', '$filter', '$timeout', 'bridgeConfig','bridgeDataService', "notifier",
	function ($rootScope, $scope, $filter, $timeout, bridgeConfig, bridgeDataService, notifier){

	$scope.notifications = notifier.allNotifications();
	$scope.sortorders=[{displayName:'time', attributeName: 'timestamp'},{displayName: 'prio', attributeName: 'kindOf'},{displayName:'tool asc', attributeName: '+app'},{displayName:'tool desc', attributeName: '-app'}];
	$scope.$watch('sortorder', function() {
		console.log("sortorder set");
	});
	$scope.sortorder=$scope.sortorders[0].attributeName;
  
  var apps = bridgeDataService.getProjects()[0].apps;
	$scope.onShowNotifications = function(){
		notifier.allNotifications().forEach(function(notification){
			if (notification.state == "new") {
				notification.state = "seen";	
			};
		});
		notifier.store();
	};

  $scope.clearNotifications = function() {
  	notifier.clearNotifications();
  	return false;
  }

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
  }
  
  $scope.getIconOf = function(notification){
    var module_name = notification.app;
    if (!module_name) {
        switch(notification.kindOf){
            case 'success':
                return 'fa fa-check';
                break;
            case 'info':
                return 'fa fa-info';
                break;
            case 'error':
                return 'fa fa-times';
                break;
            default:
                throw new Error ('Unknown State '+notification.kindOf)
        }
    }
    for(var i = 0; i < apps.length; i++){
        var app = apps[i];
        if (app.metadata.module_name === module_name) {
            return app.metadata.icon_css;
        }
    }
    throw new Error("module name is invalid!");
  }
    
  $scope.getTimeAgo = function(timeInMS){
    return jQuery.timeago(timeInMS);
  }
   
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
		return item.state == "new";
	};

	$scope.updateStatus = function(notification, state) {
		notification.state = state;
		notifier.store();
		if (notification.app) {
			$( "." + notification.app.replace(".", "-") ).animate({
		          backgroundColor: "#f0a470",
		        }, 750 );
			$( "." + notification.app.replace(".", "-") ).animate({
		          backgroundColor: "#fff",
		        }, 750 );
		};
	};

		}]).
		filter('newNotification', function () {
				return function (notifications) {

					if (notifications) {
						var result = [];
						notifications.forEach(function(notification){
							if (notification.state == "new") result.push(notification);
						})
						return result;
					}
		}});
