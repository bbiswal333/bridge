﻿angular.module('app.myFirstApp', ['app.myFirstApp.data']);
angular.module('app.myFirstApp').directive('app.myFirstApp', ['app.myFirstApp.configService', 'app.myFirstApp.dataService', function (configService, dataService) {

	var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier) {

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Configure Test App";
		$scope.box.settingScreenData = {
			templatePath: "myFirstApp/settings.html",
				controller: angular.module('app.myFirstApp').appTestSettings,
				id: $scope.boxId
		};

		$scope.many = dataService.getReloadCounter();

		$scope.getData = function() {
			dataService.reload();
			$scope.many = dataService.getReloadCounter();
		};

		// Bridge framework function to enable saving the config
		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};

		// Bridge framework function to take care of refresh
		$scope.box.reloadApp($scope.getData,60);

		// Example function for notifications
		$scope.testNotification = function() {
			notifier.showInfo("This is just a test",
				"As the title says: nothing to do here :-)",
				$scope.$parent.module_name,
				function() {},
				7000, null); // duration: -1 -> no timout; undefined -> 5000 ms as default
		};
	}];

	var linkFn = function ($scope) {

		// get own instance of config service, $scope.appConfig contains the configuration from the backend
		configService.initialize($scope.appConfig);

		// watch on any changes in the settings screen
		$scope.$watch("appConfig.values.boxSize", function () {
			$scope.box.boxSize = $scope.appConfig.values.boxSize;
		}, true);
	};

	return {
		restrict: 'E',
		templateUrl: 'app/myFirstApp/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
