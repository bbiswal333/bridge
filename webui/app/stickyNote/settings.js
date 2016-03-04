angular.module('app.stickyNote').appTestSettings =
	['$scope', "app.stickyNote.configService", function ($scope, configService) {


	var appConfig = configService.getInstanceForAppId($scope.boxScope.metadata.guid);
	$scope.values = appConfig;

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen'); // Persisting the settings
	};
}];
