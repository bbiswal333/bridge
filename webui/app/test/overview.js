angular.module('app.test', []);
angular.module('app.test').directive('app.test', ["app.test.configservice", function (configService) {

	var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier)
	{

		$scope.box.settingsTitle = "Configure Test App";
		$scope.box.settingScreenData = {
			templatePath: "test/settings.html",
				controller: angular.module('app.test').appTestSettings,
				id: $scope.boxId
		};

		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};


		$scope.testNotification = function() {
			/*eslint-disable no-alert */
			notifier.showInfo("This is just a test",
				"As the title says: nothing to do here :-)",
				$scope.$parent.module_name,
				function() {$window.alert('Congratulations!');});
			/*eslint-enable no-alert */
		};
	}];

	var linkFn = function ($scope) {
		if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
			configService.configItem = $scope.appConfig.configItem;
		} else {
			$scope.appConfig.configItem = configService.configItem;
		}
		$scope.box.boxSize = configService.configItem.boxSize;
		$scope.$watch("appConfig.configItem.boxSize", function () {
			if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
				$scope.box.boxSize = $scope.appConfig.configItem.boxSize;
			}
		}, true);
	};

	return {
		restrict: 'E',
		templateUrl: 'app/test/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
