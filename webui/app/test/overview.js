angular.module('app.test', ['app.test.data']);
angular.module('app.test').directive('app.test', ["app.test.configservice", function (configService) {

	var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier) {

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Configure Test App";
		$scope.box.settingScreenData = {
			templatePath: "test/settings.html",
				controller: angular.module('app.test').appTestSettings,
				id: $scope.boxId
		};

		// Bridge framework function to enable saving the config
		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};

		// Example function for notifications
		$scope.testNotification = function() {
			notifier.showInfo("This is just a test",
				"As the title says: nothing to do here :-)",
				$scope.$parent.module_name,
				function() {});
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
		templateUrl: 'app/test/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
