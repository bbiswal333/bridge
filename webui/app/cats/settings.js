angular.module('app.cats').catsSettings = ['$scope', "app.cats.configService", function ($scope, catsConfigService) {
	
	$scope.configService = catsConfigService;	

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

    function sortFavoritesAccordingToCatsListSortOrder() {
    	if(catsConfigService.favoriteItems.length > 0 && catsConfigService.catsItems.length > 0) {
    		var sortedFavoriteItems = [];
    		catsConfigService.catsItems.forEach(function (catsItem) {
    			catsConfigService.favoriteItems.some(function (favoriteItem) {
    				if (catsItem.id === favoriteItem.id) {
    					sortedFavoriteItems.push(favoriteItem);
    					return true;
    				}
    			});
    		});
    		if (catsConfigService.favoriteItems.length === sortedFavoriteItems.length) {
    			catsConfigService.favoriteItems = sortedFavoriteItems;
    		}
    	}
    }

	$scope.handleProjectChecked = function (desc_s, val_i, task, id) {
		if (getIndexForId(catsConfigService.favoriteItems, id) < 0) {
			catsConfigService.favoriteItems.push(catsConfigService.selectedTask);
		}
		// sortFavoritesAccordingToCatsListSortOrder();
		return true;
	};

	$scope.handleProjectUnchecked = function (task) {
		var index = getIndexForId(catsConfigService.favoriteItems, task.id);
    	if (index >= 0) {
    		catsConfigService.favoriteItems.splice(index,1);
			catsConfigService.selectedTask = catsConfigService.favoriteItems[catsConfigService.favoriteItems.length - 1];
    	}
    };

    $scope.save_click = function () {
        $scope.$emit('closeSettingsScreen');
    };

}];