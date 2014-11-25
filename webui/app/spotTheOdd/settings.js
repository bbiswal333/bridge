angular.module('app.spottheodd').appSpotTheOddSettings =
	['$scope', "app.spottheodd.configService", function ($scope, configService) {

	$scope.values = configService.values;

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen'); // Persisting the settings
	};
}];
