angular.module('bridge.app').
	controller('notificationsController',['$rootScope', '$scope', '$timeout', 'bridgeConfig','bridgeDataService', "notifier",
	function ($rootScope, $scope, $timeout, bridgeConfig, bridgeDataService, notifier){
	    $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
      $scope.dummyData = ["hello", "testA"];
	    //$scope.apps = bridgeDataService.getProjects()[0].apps;

			$scope.notifications = notifier.allNotifications();

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

			$scope.filterNewNotifications = function(item) {
				return item.state == "new";
			};

}]);
