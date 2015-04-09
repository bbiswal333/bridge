angular.module('app.translator').appTestSettings =
	['$scope', "app.translator.configService", function ($scope, configService) {

	$scope.values = configService.values;

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen'); // Persisting the settings
	};
}];
