angular.module("app.cats.maintenanceView.projectList", ["ui.bootstrap", "app.cats.data", "app.cats.allocationBar.utils"]).
  directive("app.cats.maintenanceView.projectList", ["app.cats.data.catsUtils", "$timeout", "app.cats.allocationBar.utils.colorUtils",  "lib.utils.calUtils", "app.cats.configService", "$q",
    function (catsUtils, $timeout, colorUtils, calenderUtils, configService, $q) {
  var linkFn = function ($scope) {
    $scope.items = [];
    $scope.filter = {};
    $scope.filter.val = "";
    $scope.loaded = false;
    $scope.toEdit = -1;
    var exitLoop = true;
    var continueLoop = false;

    var config = {};

    $scope.scrollbar = function(direction, autoResize) {
        config.direction = direction;
        config.autoResize = autoResize;
        return config;
    };

    // $scope.onPressEnter = function(event){
    //   // if (event.which === 13) {
    //   //   document.getElementById("projectButton").focus();
    //   // }
    //   event.stopPropagation();
    // };
    $scope.showEditButton = function(id) {
      $scope.toEdit = id;
    };

    function getDescFromFavorites() {
      configService.favoriteItems.forEach(function(favoriteItem){
        $scope.items.some(function(item) {
          if (catsUtils.isSameTask(item, favoriteItem)) {
            item.DESCR = favoriteItem.DESCR;
            return exitLoop;
          }
        });
      });
    }

    function getIndexForId(id) {
      var index = -1;
      var foundIndex = index;
      $scope.items.some(function(item) {
        index++;
        if (id === item.id) {
          foundIndex = index;
          return exitLoop;
        }
      });
      return foundIndex;
    }

    $scope.editTask = function(id) {
      var index = getIndexForId(id);
      if($scope.forSettingsView){
        configService.selectedTask = $scope.items[index];
        $scope.onProjectEdit({id: id});
      }
    };

    $scope.toogleSelect = function (id) {
      // if (event.x === 0 && event.clientX === 0) { // must be a button pressed and cannot be a actual CLICK
      //   return;
      // }
      var index = getIndexForId(id);
      $scope.items[index].selected = !$scope.items[index].selected;

      if ($scope.items[index].selected) {
        if($scope.forSettingsView){
          configService.selectedTask = $scope.items[index];
        }
        
        var ok = $scope.onProjectChecked({
          desc_s: $scope.items[index].DESCR,
          val_i: null,
          task: $scope.items[index],
          id: id
        });

        if (!ok) {
          $scope.items[index].selected = false;
        }
      }
      else {
        $scope.onProjectUnchecked({
          task: $scope.items[index]
        });
      }
      // document.getElementById("filterTextfield").focus();
    };

    $scope.resetFilter = function () {
      $scope.filter.val = "";
    };

    function markItemIfSelected(item){
      // The items we get here can be of really bad data quality

      //TEST
      //if (item.TASKTYPE === "ADMI") {
      //  return;
      //}

      // Service that reads the template on weekly basis
      // Minimal item would be only TASKTYPE: "MAIN" with RAUFNR and other IDs empty
      // There coult also be only TASKTYPE and RAUFNR filled
      // Maximum there could be also ZCPR_EXTID AND ZCPR_OBJEXTID filled

      // Service that reads the 4 month compliance
      //  RAUFNR: ""
      //  TASKTYPE: "ADMI"
      //  ZCPR_OBJGEXTID: "ADMI"
      //  ZCPR_OBJGUID: "ADMI"
      //  projectDesc: "Administrative"
      //  taskDesc: "ADMI"
      // or
      //  RAUFNR: "000505220105"
      //  TASKTYPE: ""
      //  UNIT: undefined
      //  ZCPR_EXTID: "I2M_2013_RESEARCH_INNOV"
      //  ZCPR_OBJGEXTID: "00000000000000617094"
      //  projectDesc: "I2M_2013_RESEARCH_INNOV"
      //  taskDesc: "I2M Research & Innovation"
      var found = false;
      var color = null;
      $scope.blocks.some(function(block){ // is allocation bar block or a favourite item

        if (block.task) {
          if (catsUtils.isSameTask(item, block.task) && block.value !== 0){
            found = true;
            color = colorUtils.getColorForBlock(block);    
          }
        } else {
          if (catsUtils.isSameTask(item, block)){
            found = true;
          }
        }

        return found;
      });
      item.selected  = found;
      item.color     = color;
    }

    function createNewProjectItem (item) {
      var newItem        = item;
      newItem.id         = (item.ZCPR_OBJGEXTID || "") + (item.RAUFNR || "") + item.TASKTYPE;
      newItem.DESCR      = item.taskDesc || item.DESCR || item.ZCPR_OBJGEXTID || item.RAUFNR || item.TASKTYPE;
      // newItem.ZCPR_EXTID = item.projectDesc || item.ZCPR_EXTID || item.TASKTYPE;
      return newItem;
    }

    function addNewProjectItem (item) {
      var newItem = createNewProjectItem(item);
      
      markItemIfSelected(item);

      var allreadyExists = false;
      // var fixedTasks = ['ABSE', 'VACA', 'COMP'];

      if (catsUtils.isFixedTask(item)) { // don't add "fixed" tasks to favorites
        return;
      }
      configService.catsItems.some(function(oldItem){
        if (catsUtils.isSameTask(item, oldItem)) {
          allreadyExists = true;
          return exitLoop;
        }
      });

      if (!allreadyExists) {
        configService.catsItems.push(newItem);
      }
    }

    function getDataFromCatsTemplate () {
      var deferred = $q.defer();

      var week = calenderUtils.getWeekNumber(new Date());
      catsUtils.requestTasksFromTemplate(week.year, week.weekNo).then( function(data){
        data.forEach(function(task){
          addNewProjectItem(task);
        });
        deferred.resolve();
      });

      return deferred.promise;
    }

    function getCatsData () {
      var deferred = $q.defer(); 
      catsUtils.getTasks(true).then(function (data) {
        if ($scope.blocks === undefined) {
          $scope.blocks = [];
        }
        data.forEach(function(entry){
          addNewProjectItem(entry);  
        });

        getDataFromCatsTemplate().then( function() {
          deferred.resolve();
        });
      });
      return deferred.promise;
    }

    function addItemsFromBlocks () {
      $scope.blocks.some(function(blockItem){
        if (!blockItem.task) {
          return exitLoop;
        }

        if (catsUtils.isFixedTask(blockItem.task)) {
          return continueLoop;
        }

        var allreadyExists = false;
        $scope.items.some(function(item){
          if (catsUtils.isSameTask(blockItem.task, item)) {
            allreadyExists = true;
            return exitLoop;
          }
        });
        if (!allreadyExists) {
          $scope.items.push( createNewProjectItem(blockItem.task) );
        }
      });
    }

    function addItemsFromFavoriteList() {
      var favoriteItems = angular.copy(configService.favoriteItems);
      if (favoriteItems.length === 0) {
        return;
      }

      favoriteItems.forEach(function(favoriteItem){
        
        var allreadyExists = false;
        $scope.items.some(function(item){
          if (catsUtils.isSameTask(favoriteItem, item)) {
            allreadyExists = true;
            return exitLoop;
          }
        });
        if (!allreadyExists) {
          $scope.items.push( createNewProjectItem(favoriteItem) );
        }
      });
    }

    function initProjectItems () {
      if (configService.favoriteItems.length > 0 && !$scope.forSettingsView) {
        $scope.items = angular.copy(configService.favoriteItems);
      } else{
        $scope.items = angular.copy(configService.catsItems);
        addItemsFromFavoriteList(); // if favorite list contains items, that are not in the worklist or template anymore
      }
      getDescFromFavorites();
      $scope.loaded = true;
    }

    function markProjectItems() {
      $scope.items.forEach(function(item){
        markItemIfSelected(item);
      });
    }

    function loadProjects () {
      if (!configService.loaded || $scope.forSettingsView) {
        getCatsData().then(function(){
          configService.loaded = true;
          initProjectItems();
          markProjectItems();
        });
      } else {
        initProjectItems();
      }

      $timeout(function () {
        $scope.$broadcast('rebuild:me');
      }, 100);        
    }

    loadProjects();

    $scope.$watch("blocks", function () {
      if (!$scope.forSettingsView) {
        initProjectItems();
        addItemsFromBlocks();
        markProjectItems();
      }
    }, true);

    $scope.$watch("items", function () {
      markProjectItems();
    }, true);  };

  return {
    restrict: "E",
    scope: {
        onProjectChecked: "&onprojectchecked",
        onProjectUnchecked: "&onprojectunchecked",
        onProjectEdit:"&onprojectedit",
        blocks: "=blocks",
        heightOfList: "@heightoflist",
        forSettingsView: "@forSettingsView"
    },
    replace: true,
    link: linkFn,
    templateUrl: "app/cats/detail/projectList.tmpl.html"
  };
}]);