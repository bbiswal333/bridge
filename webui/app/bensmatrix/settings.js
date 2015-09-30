angular.module('app.bensmatrix').appbensmatrixSettings =
	['$scope', "app.bensmatrix.configService", function ($scope, configService) {

	$scope.values = configService.values;

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen'); // Persisting the settings
	};
}];
