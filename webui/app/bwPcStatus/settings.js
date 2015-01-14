angular.module('app.bwPcStatus').appPcStatusSettings =
	['$scope', "app.bwPcStatus.configService",'app.bwPcStatus.dataService',  function ($scope, configService, dataService) {

	$scope.values = configService.values;
	if($scope.values.contents.length === 0 ){
		$scope.values.contents = dataService.data.configContents;
	}
	if($scope.values.contents.length !== dataService.data.configContents.length ) {
		var tmp = angular.copy($scope.values.contents);
		$scope.values.contents = dataService.data.configContents;

		for (var i = 0; i < $scope.values.contents.length; i++) {
			for (var n = 0; n < tmp.length; n++) {
				if($scope.values.contents[i].CONTID === tmp[n].CONTID && tmp[n].active){
					$scope.values.contents[i].active = true;
				}
			}
		}
	}

	$scope.save_click = function () {
		dataService.setAssignedContents(configService.values.contents).then(function() {
			$scope.$emit('closeSettingsScreen', {app: 'bwPcStatus'}); // Persisting the settings
		});
	};

	$scope.setActive = function (content) {
		content.active = !content.active;
	};
}];
