angular.module('app.cats').catsSettings = ['$scope', "app.cats.configService", "app.cats.catsUtils", "bridgeInBrowserNotification", "app.cats.cat2BackendZDEVDB",
    function ($scope, catsConfigService, catsUtils, bridgeInBrowserNotification, catsBackend) {

    $scope.configService = catsConfigService;
    catsConfigService.removeInvalidTasks(catsConfigService.favoriteItems);
    var favoriteItemsToRollBack = angular.copy(catsConfigService.favoriteItems);

    $scope.tasktypesF4Help = [];
    catsBackend.requestTasktypes().then(
        function(data){
            $scope.tasktypesF4Help = data.ET_TASKTYPE;
        }
    );

    $scope.subtypesF4Help = [];
    catsBackend.requestTasktypes().then(
        function(data){
            $scope.subtypesF4Help = data.ET_SUBTYPES;
        }
    );

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
        catsConfigService.removeInvalidTasks($scope.configService.favoriteItems);
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

    $scope.saveIsAvailable = function(){
        return !isInList(catsConfigService.selectedTask,catsConfigService.favoriteItems);
    };

    $scope.saveNewTask = function(){
        if (!catsUtils.isValid(catsConfigService.selectedTask)) {
            bridgeInBrowserNotification.addAlert('danger','The task appears to not be a valid CAT2 task. Please fill out mandatory field(s).');
            return;
        }
        if (isInList(catsConfigService.selectedTask, catsConfigService.favoriteItems) || isInList(catsConfigService.selectedTask, catsConfigService.catsItems)) {
            bridgeInBrowserNotification.addAlert('danger','No task could be created because there is allready another task in your worklist with the same key values!');
            return;
        }
        catsConfigService.selectedTask = catsConfigService.enhanceTask(catsConfigService.selectedTask);
        addSelectedItemToFavorites();
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
        // make sure the headers are never edited
        if(catsConfigService.selectedTask.TASKTYPE === 'BRIDGE_HEADER') {
            $scope.selectedTask = null;
            catsConfigService.selectedTask = null;
            return;
        }

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

    $scope.tasktypeSearch = function(searchExpression) {
        var searchResult = [];
        if (searchExpression === "*") {
            searchExpression = "";
        } else {
            searchExpression = searchExpression.toLowerCase();
        }
        for (var i = 0; i < $scope.tasktypesF4Help.length && searchResult.length < 99; i++) {
            var searchEntry = $scope.tasktypesF4Help[i].TASKTYPE.toLowerCase();
            if(searchEntry &&
                searchEntry.indexOf(searchExpression) > -1) {
                var searchResultItem = {};
                searchResultItem.name = $scope.tasktypesF4Help[i].TASKTYPE;
                searchResultItem.text = $scope.tasktypesF4Help[i].TEXT;
                searchResult.push(searchResultItem);
            }
        }
        return searchResult;
    };

    $scope.subtypeSearch = function(tasktype, searchExpression) {
        var searchResult = [];
        if (searchExpression === "*") {
            searchExpression = "";
        } else {
            searchExpression = searchExpression.toLowerCase();
        }
        tasktype = tasktype.toLowerCase();
        for (var i = 0; i < $scope.subtypesF4Help.length && searchResult.length < 99; i++) {
            var searchTasktype = $scope.subtypesF4Help[i].TASKTYPE.toLowerCase();
            var searchEntry = $scope.subtypesF4Help[i].STYPE.toLowerCase();
            if(searchEntry && tasktype && searchTasktype &&
                searchTasktype === tasktype &&
                searchEntry.indexOf(searchExpression) > -1) {
                var searchResultItem = {};
                searchResultItem.name = $scope.subtypesF4Help[i].STYPE;
                searchResultItem.text = $scope.subtypesF4Help[i].TEXT;
                searchResult.push(searchResultItem);
            }
        }
        return searchResult;
    };

    $scope.orderSearch = function(searchExpression) {
        return catsBackend.requestOrders(searchExpression).then(
            function(data){
                var searchResult = [];
                searchExpression = searchExpression.toLowerCase();
                for (var i = 0; i < data.REC_ORDER.length && searchResult.length < 20; i++) {
                    var searchEntry = data.REC_ORDER[i].AUFNR.toLowerCase();
                    if(searchEntry &&
                        searchEntry.indexOf(searchExpression) > -1) {
                        var searchResultItem = {};
                        searchResultItem.name = data.REC_ORDER[i].AUFNR;
                        searchResultItem.text = data.REC_ORDER[i].KTEXT;
                        searchResult.push(searchResultItem);
                    }
                }
                return searchResult;
            }
        );

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
