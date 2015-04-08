angular.module('app.moodBarometer').appMoodBarometerSettings =
	['$scope', "app.moodBarometer.configService", function ($scope, configService) {

	$scope.values = configService.values;

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen'); // Persisting the settings
	};
}];
