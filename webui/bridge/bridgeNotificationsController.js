angular.module('bridge.app').
	controller('notificationsController',['$rootScope', '$scope', '$filter', '$timeout', 'bridgeConfig','bridgeDataService', "notifier",
	function ($rootScope, $scope, $filter, $timeout, bridgeConfig, bridgeDataService, notifier){

    //$scope.apps = bridgeDataService.getProjects()[0].apps;

	$scope.notifications = notifier.allNotifications();

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
