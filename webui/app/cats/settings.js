angular.module('app.cats').catsSettings = ['$scope', "app.cats.configService", "app.cats.catsUtils", "bridgeInBrowserNotification",
    function ($scope, catsConfigService, catsUtils, bridgeInBrowserNotification) {
	
	$scope.configService = catsConfigService;
    var favoriteItemsToRollBack = angular.copy(catsConfigService.favoriteItems);

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
    
    function sortFavoriteItemsAccordingToCatsItems() {
        var favoriteItemsThatAreNoCatsItems = [];
        var checkFound;
        catsConfigService.favoriteItems.forEach(function(favoriteItem) {
            checkFound = false;
            catsConfigService.catsItems.some(function(catsItem) {
                if (catsUtils.isSameTask(favoriteItem, catsItem)) {
                    checkFound = true;
                    return true;
                }
            });
            if (checkFound === false) {
                favoriteItemsThatAreNoCatsItems.push(favoriteItem);
                return true;
            }
        });
        // copy
        var newFavoriteItems = [];
        catsConfigService.catsItems.forEach(function(catsItem) {
            catsConfigService.favoriteItems.some(function(favoriteItem) {
                if (catsUtils.isSameTask(catsItem, favoriteItem)) {
                    newFavoriteItems.push(favoriteItem);
                }
            });
        });
        favoriteItemsThatAreNoCatsItems.forEach(function(favoriteItemThatIsNoCatsItem) {
            newFavoriteItems.push(favoriteItemThatIsNoCatsItem);
        });
        // verify
        if (catsConfigService.favoriteItems.length === newFavoriteItems.length) {
            catsConfigService.favoriteItems = newFavoriteItems;
        }

    }

    function addSelectedItemToFavorites() {
        catsConfigService.updateLastUsedDescriptions(catsConfigService.selectedTask);
        catsConfigService.favoriteItems.push(catsConfigService.selectedTask);
        favoriteItemsToRollBack.push(angular.copy(catsConfigService.selectedTask));
        $scope.selectedTask = catsConfigService.selectedTask;
        sortFavoriteItemsAccordingToCatsItems();
    }

    $scope.isUnchanged = function(item){
        var favoriteItemsToRollBackIndex = getIndexForId(favoriteItemsToRollBack, item.id);
        return angular.equals(item, favoriteItemsToRollBack[favoriteItemsToRollBackIndex]);
    };

    $scope.createTask = function() {
        var newTask = {};
        newTask.custom = true;
        newTask.RAUFNR = "";
        newTask.ZCPR_EXTID = "";
        newTask.ZCPR_OBJGEXTID = "";
        newTask.ZZSUBTYPE = "";
        newTask.TASKTYPE = "";
        newTask.DESCR = "";
        catsConfigService.selectedTask = newTask;
        $scope.selectedTask = catsConfigService.selectedTask;
    };

    function isInList(task, list){
        var allreadyExists = false;

        list.some(function(item){
            if (catsUtils.isSameTask(item, task)) {
                allreadyExists = true;
            }
            return allreadyExists;
        });
        return allreadyExists;
    }

    $scope.saveNewTask = function(){
        var allreadyExists = isInList(catsConfigService.selectedTask, catsConfigService.favoriteItems) || isInList(catsConfigService.selectedTask, catsConfigService.catsItems);
        if (!allreadyExists) {
            catsConfigService.selectedTask = catsConfigService.enhanceTask(catsConfigService.selectedTask);
            addSelectedItemToFavorites();
        } else {
            bridgeInBrowserNotification.addAlert('','No task could be created because there is allready another task in your worklist with the same key values!');
        }
    };

    $scope.cancel = function(){
        var selectedId = catsConfigService.selectedTask.id;
        if (!selectedId) {
            catsConfigService.selectedTask = null;
        } else {
            var index = getIndexForId(favoriteItemsToRollBack, selectedId);
            catsConfigService.selectedTask = angular.copy(favoriteItemsToRollBack[index]);
            $scope.handleEditTask(selectedId);
        }
    };

    $scope.handleEditTask = function(id) {
        catsConfigService.updateLastUsedDescriptions(catsConfigService.selectedTask);

        var index = getIndexForId(catsConfigService.favoriteItems, id);
        if (index >= 0) {
            catsConfigService.favoriteItems.splice(index,1);
        }
        if (catsConfigService.selectedTask.id) {
            catsConfigService.favoriteItems.push(catsConfigService.selectedTask);
        }
        $scope.selectedTask = catsConfigService.selectedTask;
    };

	$scope.handleProjectChecked = function (desc_s, val_i, task, id) {
		if (getIndexForId(catsConfigService.favoriteItems, id) < 0) {
			addSelectedItemToFavorites();
		}
        $scope.selectedTask = catsConfigService.selectedTask;
		return true;
	};

	$scope.handleProjectUnchecked = function (task) {
		var index = getIndexForId(catsConfigService.favoriteItems, task.id);
    	if (index >= 0) {
    		catsConfigService.favoriteItems.splice(index,1);
			catsConfigService.selectedTask = catsConfigService.favoriteItems[catsConfigService.favoriteItems.length - 1];
    	}
        $scope.selectedTask = catsConfigService.selectedTask;
    };

    $scope.save_click = function () {
        $scope.$emit('closeSettingsScreen');
    };

    $scope.clearFavoriteItems = function(){
        var index = catsConfigService.favoriteItems.length;
        while (index--) {
            if (!catsUtils.isValid(catsConfigService.favoriteItems[index])) {
                catsConfigService.favoriteItems.splice(index, 1);
            }
        }
    };

    $scope.clearFavoriteItems();
    $scope.selectedTask = catsConfigService.selectedTask;
    $scope.$watch("selectedTask.DESCR", function() {
        if ($scope.selectedTask && $scope.selectedTask.DESCR === "") {
            catsConfigService.catsItems.some(function(catsItem){
                if (catsUtils.isSameTask($scope.selectedTask, catsItem)) {
                    $scope.selectedTask.DESCR = catsItem.DESCR;
                    return true;
                }
            });
        }
    });
}];
