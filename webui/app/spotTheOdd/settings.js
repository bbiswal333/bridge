angular.module('app.spotTheOdd').appspotTheOddSettings =
	['$scope', "app.spotTheOdd.configService", function ($scope, configService) {

	$scope.values = configService.values;

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen'); // Persisting the settings
	};
}];
