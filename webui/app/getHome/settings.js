angular.module('app.getHome').appGetHomeSettings = 
	['app.getHome.configservice', '$scope',  
		function (appGetHomeConfig, $scope) {

	$scope.config  = appGetHomeConfig;

	$scope.addMode = false;
	$scope.newLocation = {
		name: ''
	};

	$scope.addNewLocation = function() {
		var location = {
			name: $scope.newLocation.name
		};

		appGetHomeConfig.data.locations.push(location);
		$scope.newLocation.name = '';
		$scope.addMode = false;
	};

	$scope.closeForm = function () {
		$scope.$emit('closeSettingsScreen');
	};

}];
