angular.module('app.cats').catsSettings = ['$scope', "app.cats.configService", "app.cats.data.catsUtils", "bridgeInBrowserNotification", function ($scope, catsConfigService, catsUtils, bridgeInBrowserNotification) {
	
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
    function addSelectedItemToFavorites() {
        catsConfigService.favoriteItems.push(catsConfigService.selectedTask);
        favoriteItemsToRollBack.push(angular.copy(catsConfigService.selectedTask));
    }

    $scope.isUnchanged = function(item){
        var favoriteItemsToRollBackIndex = getIndexForId(favoriteItemsToRollBack, item.id);
        return angular.equals(item, favoriteItemsToRollBack[favoriteItemsToRollBackIndex]);
    };

    // function isValid(task) {
    //     if (task && (task.TASKTYPE || task.ZCPR_OBJGEXTID)) {
    //         return true;
    //     }
    //     return false;
    // }

    // $scope.keyPressed = function(){
    //     catsConfigService.selectedTask.valid = isValid(catsConfigService.selectedTask);
    // };

    $scope.createTask = function() {
        var newTask = {};
        newTask.custom = true;
        newTask.RAUFNR = "";
        newTask.ZCPR_EXTID = "";
        newTask.ZCPR_OBJGEXTID = "";
        newTask.TASKTYPE = "";
        newTask.DESCR = "";
        // catsConfigService.favoriteItems.push(catsConfigService.selectedTask);
        catsConfigService.selectedTask = newTask;
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
            catsConfigService.selectedTask = catsConfigService.createNewItem(catsConfigService.selectedTask);
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
            // var index = getIndexForId(catsConfigService.favoriteItems, selectedId);
            // catsConfigService.selectedTask = catsConfigService.favoriteItems[index];
            var index = getIndexForId(favoriteItemsToRollBack, selectedId);
            catsConfigService.selectedTask = angular.copy(favoriteItemsToRollBack[index]);
            $scope.handleEditTask(selectedId);
        }

    };

    $scope.handleEditTask = function(id) {
        var index = getIndexForId(catsConfigService.favoriteItems, id);
        if (index >= 0) {
            catsConfigService.favoriteItems.splice(index,1);
        }
        catsConfigService.favoriteItems.push(catsConfigService.selectedTask);
    };

	$scope.handleProjectChecked = function (desc_s, val_i, task, id) {
		if (getIndexForId(catsConfigService.favoriteItems, id) < 0) {
			addSelectedItemToFavorites();
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