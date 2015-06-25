angular.module('app.myFirstApp').appTestSettings =
	['$scope', "app.myFirstApp.configService", function ($scope, configService) {

	$scope.values = configService.values;

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen'); // Persisting the settings
	};
}];
