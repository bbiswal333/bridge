angular.module('app.hydrationMeter').appTestSettings =
	['$scope', "app.hydrationMeter.configService", function ($scope, configService) {

	$scope.values = configService.values;

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen'); // Persisting the settings
	};
}];
