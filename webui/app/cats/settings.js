angular.module('app.cats').catsSettings = ['$scope', "app.cats.configService", "app.cats.data.catsUtils", function ($scope, catsConfigService, catsUtils) {  
	$scope.selectedTask = null;

	function init () {
		if (!catsConfigService.loaded) {
			catsConfigService.catsItems.push.apply(catsConfigService.catsItems, catsConfigService.favoriteItems);
		}

		catsConfigService.favoriteItems.forEach(function(favItem){
			favItem.selected = true;
			favItem.color = null;
		});
		
		$scope.favoriteTasks = catsConfigService.favoriteItems;
		$scope.currentConfigValues = catsConfigService.configItem;
		
		if ($scope.favoriteTasks.length > 0){
			$scope.selectedTask = $scope.favoriteTasks[$scope.favoriteTasks.length - 1];
		}
	}

	function getIndexOfFavoriteTask (task) {
		var taskIndex = -1;
		$scope.favoriteTasks.some(function(favTask, index){
        	if (catsUtils.isSameTask(task, favTask)){
        		taskIndex = index;
        		return true;
        	} 
        });
        return taskIndex;
	}

	$scope.handleProjectChecked = function (desc_s, val_i, task, index) {
		$scope.selectedTask = catsConfigService.catsItems[index];

		if (getIndexOfFavoriteTask(task) < 0) {
			$scope.favoriteTasks.push($scope.selectedTask);
		}
		return true;
	};

	$scope.handleProjectUnchecked = function (task) {
		var index = getIndexOfFavoriteTask(task);
    	if (index >= 0) {
    		$scope.favoriteTasks.splice(index,1);
    		$scope.selectedTask = $scope.favoriteTasks[$scope.favoriteTasks.length - 1];
    	}
    };

    $scope.save_click = function () {  
        $scope.$emit('closeSettingsScreen');
    };

    init();
}];