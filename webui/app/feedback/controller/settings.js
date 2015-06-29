angular.module('app.feedback').appFeedbackSettings =
	['$scope', "app.feedback.configService", function ($scope, configService) {

	$scope.values = configService.values;

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen'); // Persisting the settings
	};
}];
