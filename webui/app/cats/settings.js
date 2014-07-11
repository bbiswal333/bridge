angular.module('app.cats').catsSettings = ['$scope', "app.cats.configService", function ($scope, catsConfigService) {  
	$scope.favoriteTasks = [];  
	$scope.currentConfigValues = catsConfigService.configItem;

	$scope.handleProjectChecked = function (desc_s, val_i, task) {
		$scope.favoriteTasks.push(task);
	};

    $scope.save_click = function () {  
        $scope.$emit('closeSettingsScreen');
    };
}];