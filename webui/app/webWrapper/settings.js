angular.module("app.webWrapper").appWebWrapperSettings = [
	"$scope", 
	"app.webWrapper.configService", 
	
	function ($scope, configService) {
		$scope.values = configService.values;
	
		$scope.save_click = function () {
			$scope.$emit('closeSettingsScreen'); // Persist the settings
		};
	}
];
