angular.module("app.cats.maintenanceView.projectList", ["ui.bootstrap", "app.cats.data", "app.cats.allocationBar.utils"]).
  directive("app.cats.maintenanceView.projectList", ["app.cats.data.catsUtils", "$timeout", "app.cats.allocationBar.utils.colorUtils",  "lib.utils.calUtils", "app.cats.configService",
    function (catsUtils, $timeout, colorUtils, calenderUtils, configService) {
  var linkFn = function ($scope) {
    $scope.items = [];
    $scope.filter = {};
    $scope.filter.val = "";
    $scope.loaded = false;
    var additionalData;

    var config = {};


    function initProjectItems () {
      if (configService.favoriteItems.length > 0 && !$scope.forSettingsView) {
        $scope.items = angular.copy(configService.favoriteItems);
      } else{
        $scope.items = angular.copy(configService.catsItems);
      }
    }

    initProjectItems();

    $scope.scrollbar = function(direction, autoResize) {
        config.direction = direction;
        config.autoResize = autoResize;
        return config;
    };

    $scope.onPressEnter = function(){
      if (event.which === 13) {
        document.getElementById("projectButton").focus();
      }
    };

    function getIndexForId(id) {
      var index = -1;
      var foundIndex = index;
      $scope.items.some(function(item) {
        index++;
        if (id === item.id) {
          foundIndex = index;
          return true;
        }
      });
      return foundIndex;
    }

    $scope.toogleSelect = function (id) {
      var index = getIndexForId(id);
      $scope.items[index].selected = !$scope.items[index].selected;

      if ($scope.items[index].selected) {
        configService.selectedTask = $scope.items[index];
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
      document.getElementById("filterTextfield").focus();
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
      newItem.id         = "ID" + item.ZCPR_OBJGEXTID + "RAUF" + item.RAUFNR + "TYPE" + item.TASKTYPE;
      newItem.DESCR      = item.taskDesc || item.DESCR || item.ZCPR_OBJGEXTID || item.RAUFNR || item.TASKTYPE;
      // newItem.ZCPR_EXTID = item.projectDesc || item.ZCPR_EXTID || item.TASKTYPE;
      
      markItemIfSelected(item);

      var allreadyExists = false;
      var fixedTasks = ['ABSE', 'VACA', 'COMP'];

      configService.catsItems.some(function(oldItem){
        if (fixedTasks.indexOf(item.TASKTYPE) >= 0) { // don't add "fixed" tasks to favorites
          allreadyExists = true;
          return true;
        }
        if (catsUtils.isSameTask(item, oldItem)) {
          allreadyExists = true;
          return true;
        }
      });

      if (!allreadyExists) {
        configService.catsItems.push(newItem);
      }
    }

    function getDataFromCatsTemplate () {
      if (additionalData === undefined) {
        var week = calenderUtils.getWeekNumber(new Date());
        catsUtils.requestTasksFromTemplate(week.year, week.weekNo, function(data){
          additionalData = data;
          additionalData.forEach(function(task){
            createNewProjectItem(task);
          });

          $timeout(function () {
            $scope.$broadcast('rebuild:me');
          }, 100);
        });
      }
    }

    function getCatsData () {
      
      catsUtils.getTasks(function (data) {
        if ($scope.blocks === undefined) {
          $scope.blocks = [];
        }
        data.forEach(function(entry){
          createNewProjectItem(entry);  
        });

        getDataFromCatsTemplate();

        // if (!configService.loaded) {
          // configService.favoriteItems.forEach(function(favItem){
          //   var found = false;
          //   configService.catsItems.some(function(catsItem){
          //     if (catsUtils.isSameTask(favItem, catsItem)) {
          //       // catsItem.DESCR = favItem.DESCR;
          //       catsItem = favItem;
          //       found = true;
          //       return true;
          //     }
          //   });
          //   if (!found) {
          //     configService.catsItems.push(favItem);
          //   }
          // });
        // }

        // var uniqBy = function(ary, key) {
        //     var seen = {};
        //     return ary.filter(function(elem) {
        //         var k = key([elem.ZCPR_OBJGEXTID, elem.RAUFNR, elem.ZCPR_EXTID]);
        //         return (seen[k] === 1) ? 0 : seen[k] = 1;
        //     });
        // };

        // configService.catsItems = uniqBy(configService.catsItems, JSON.stringify);

        $timeout(function () {
          $scope.$broadcast('rebuild:me');
        }, 100);
      });
      $scope.loaded = true;
    }

    function loadProjects () {
      if (!configService.loaded || $scope.forSettingsView) {

        getCatsData();
        initProjectItems();

        configService.loaded = true;
      } 
      // else {
        $scope.items.forEach(function(item){
          markItemIfSelected(item);
        });
        $timeout(function () {
          $scope.$broadcast('rebuild:me');
        }, 100);        
      // } 
      $scope.loaded = true;
    }

    $scope.$watch("blocks", function () {
      loadProjects();
    }, true);

    $scope.$watch("items", function () {
      loadProjects();
    }, true);  };

  return {
    restrict: "E",
    scope: {
        onProjectChecked: "&onprojectchecked",
        onProjectUnchecked: "&onprojectunchecked",
        blocks: "=blocks",
        heightOfList: "@heightoflist",
        forSettingsView: "@forSettingsView"
    },
    replace: true,
    link: linkFn,
    templateUrl: "app/cats/detail/projectList.tmpl.html"
  };
}]);