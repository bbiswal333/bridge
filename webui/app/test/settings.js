angular.module('app.test').appTestSettings =
	['$scope', "app.test.configservice", function ($scope, configService) {

	$scope.values = configService.values;

	// Settings are always saved on save_click()
	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen');
	};
}];
