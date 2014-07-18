angular.module('app.getHome').appGetHomeSettings = 
	['app.getHome.configservice', '$scope',  
		function (appGetHomeConfig, $scope) {

	$scope.config  = appGetHomeConfig;

	$scope.locations = [
		{
			"name": "Work"
		},
		{
			"name": "Home"
		}
	];

	$scope.closeForm = function () {
		$scope.$emit('closeSettingsScreen');
	};

}];
