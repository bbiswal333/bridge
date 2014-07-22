angular.module('app.cats').catsSettings = ['$scope', "app.cats.configService", "app.cats.data.catsUtils", function ($scope, catsConfigService, catsUtils) {  
	$scope.selectedTask = null;

	function init () {
		if (!catsConfigService.loaded) {
			catsConfigService.catsItems.push.apply(catsConfigService.catsItems, catsConfigService.favoriteItems);
		}

		catsConfigService.catsItems.forEach(function(catsItem){
			catsItem.selected = false;
			catsItem.color = null;
		});		

		catsConfigService.favoriteItems.forEach(function(favItem){
			favItem.selected = true;
		});
		
		$scope.favoriteTasks = catsConfigService.favoriteItems;
		
		if ($scope.favoriteTasks.length > 0){
			$scope.selectedTask = $scope.favoriteTasks[$scope.favoriteTasks.length - 1];
		}
	}

    function getIndexForId(list, id) {
      var index = -1;
      var foundIndex = index;
      list.some(function(item) {
        index++;
        if (id === item.id) {
        	foundIndex = index;
          	return true;
        }
      });
      return foundIndex;
    }

	$scope.handleProjectChecked = function (desc_s, val_i, task, id) {
		var index = getIndexForId(catsConfigService.catsItems, id);
		$scope.selectedTask = catsConfigService.catsItems[index];

		if (getIndexForId($scope.favoriteTasks, id) < 0) {
			$scope.favoriteTasks.push($scope.selectedTask);
		}
		return true;
	};

	$scope.handleProjectUnchecked = function (task) {
		var index = getIndexForId($scope.favoriteTasks, task.id);
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