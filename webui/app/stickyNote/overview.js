angular.module('app.stickyNote', ['app.stickyNote.data']);
angular.module('app.stickyNote').directive('app.stickyNote',
	['app.stickyNote.configService', 'app.stickyNote.dataService',
	function (configService) {

	var directiveController = ['$scope', function ($scope ) {

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Configure your Sticky Note";
		$scope.box.settingScreenData = {
			templatePath: "stickyNote/settings.html",
				controller: angular.module('app.stickyNote').appTestSettings,
				id: $scope.boxId
		};

		var appConfig = configService.getInstanceForAppId($scope.metadata.guid);
		$scope.appConfig = appConfig;

		// Bridge framework function to enable saving the config
		$scope.box.returnConfig = function(){
			return angular.copy(appConfig);
		};
	}];

	var linkFn = function ($scope) {

		var appConfig = configService.getInstanceForAppId($scope.metadata.guid);
		appConfig.initialize($scope.appConfig);

		// watch on any changes in the settings screen
		$scope.$watch("appConfig.boxSize", function () {
			$scope.box.boxSize = $scope.appConfig.boxSize;
		}, true);

		$scope.$watch("appConfig.color", function () {
			$scope.box.color = $scope.appConfig.color;
		}, true);

		$scope.$watch("appConfig.comment", function () {
			$scope.box.comment = $scope.appConfig.comment;
		}, true);
	};

	return {
		restrict: 'E',
		templateUrl: 'app/stickyNote/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
