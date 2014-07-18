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

	$scope.deleteLocation = function (location, index) {
		appGetHomeConfig.data.locations.splice(index, 1);
	};

	$scope.closeForm = function () {
		$scope.$emit('closeSettingsScreen');
	};

}];
