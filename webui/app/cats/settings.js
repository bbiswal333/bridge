angular.module('app.cats').catsSettings = ['$scope', "app.cats.configService", function ($scope, catsConfigService) {  
	$scope.selectedTask = null;

	function updateObjectReferences () {
		// if (catsConfigService.catsItems && catsConfigService.favoriteItems) {
		// 	catsConfigService.favoriteItems.forEach(function(favItem){
		// 		catsConfigService.catsItems.some(function(catsItem){
		// 			if (favItem.ZCPR_OBJGEXTID === catsItem.ZCPR_OBJGEXTID) {
		// 				catsItem = favItem;
		// 				return true;
		// 			}
		// 		});
		// 	});
		// }
	}

	function init () {
		// updateObjectReferences();
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

	function getIndexOfFavoriteTask (objgextid) {
		var taskIndex = -1;
		$scope.favoriteTasks.some(function(task, index){
        	if (task.ZCPR_OBJGEXTID === objgextid) {
        		taskIndex = index;
        		return true;
        	}
        });
        return taskIndex;
	}

	$scope.handleProjectChecked = function (desc_s, val_i, task, index) {
		$scope.selectedTask = catsConfigService.catsItems[index];

		if (getIndexOfFavoriteTask(task.ZCPR_OBJGEXTID) < 0) {
			$scope.favoriteTasks.push(task);
			// $scope.favoriteTasks.push(catsConfigService.catsItems[index]);
		}
		return true;
	};

	$scope.handleProjectUnchecked = function (task) {
		var index = getIndexOfFavoriteTask(task.ZCPR_OBJGEXTID);
    	if (index >= 0) {
    		$scope.favoriteTasks.splice(index,1);
    		$scope.selectedTask = $scope.favoriteTasks[$scope.favoriteTasks.length - 1];
    	}
    };

    $scope.save_click = function () {  
        $scope.$emit('closeSettingsScreen');
    };

    // $scope.isSelected = function() {
    // 	if (selectedTask) {};
    // }

    init();
}];