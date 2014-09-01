angular.module('app.test').appTestSettings =
	['$scope', "app.test.configservice", function ($scope, configService) {    
	$scope.configItem = configService.configItem;

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen');
	};
}];
