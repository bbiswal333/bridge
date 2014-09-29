angular.module('app.getHome').appGetHomeSettings = 
	['app.getHome.configservice', 'app.getHome.mapservice', '$scope', '$q', 
		function (appGetHomeConfig, appGetHomeMap, $scope, $q) {

	$scope.config  = appGetHomeConfig;

	$scope.addMode = false;
	$scope.newLocation = {
		name: ''
	};

	$scope.addNewLocation = function() {
		var location = {
			name: $scope.newLocation.name,
			address: $scope.newLocation.address.address.label,
			latitude: $scope.newLocation.address.displayPosition.latitude, 
			longitude: $scope.newLocation.address.displayPosition.longitude
		};

		appGetHomeConfig.data.locations.push(location);
		$scope.newLocation.name = '';
		$scope.newLocation.address = '';
		$scope.addMode = false;
	};

	$scope.deleteLocation = function (location, index) {
		appGetHomeConfig.data.locations.splice(index, 1);
	};

	$scope.searchAddress = function(searchString) {
		console.log(searchString);
		var addresses = $q.defer();
		appGetHomeMap.search(searchString, function(locations) {
			console.log(locations);
			addresses.resolve(locations);
		})
		addresses.promise.then(function(data) {
			return data;
		});
		return addresses.promise;
	};

	$scope.closeForm = function () {
		$scope.$emit('closeSettingsScreen');
	};

}];

