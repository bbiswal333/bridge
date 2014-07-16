angular.module("app.cats.maintenanceView.projectList", ["ui.bootstrap", "app.cats.data", "app.cats.allocationBar.utils"]).
  directive("app.cats.maintenanceView.projectList", ["app.cats.data.catsUtils", "$timeout", "app.cats.allocationBar.utils.colorUtils",  "lib.utils.calUtils",
    function (catsUtils, $timeout, colorUtils, calenderUtils) {
  var linkFn = function ($scope) {
    $scope.items = [];
    $scope.filter = {};
    $scope.filter.val = "";
    $scope.loaded = false;
    var additionalData;

    var config = {};
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

    $scope.toogleSelect = function (indx) {
      $scope.items[indx].selected = !$scope.items[indx].selected;

      if ($scope.items[indx].selected) {
        var ok = $scope.onProjectChecked({
          desc_s: $scope.items[indx].name,
          val_i: null,
          task: $scope.items[indx]
        });

        if (!ok) {
          $scope.items[indx].selected = false;
        }
      }
      else {
        $scope.onProjectUnchecked({
          task: $scope.items[indx]
        });
      }
      document.getElementById("filterTextfield").focus();
    };

    $scope.resetFilter = function () {
      $scope.filter.val = "";
    };

    function createNewProjectItem (item) {
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
      $scope.blocks.some(function(block){
        if ((item.ZCPR_OBJGEXTID === block.task.ZCPR_OBJGEXTID &&
             item.RAUFNR         === block.task.RAUFNR) &&
            block.value !== 0){
          found = true;
          color = colorUtils.getColorForBlock(block);    
        }
      });
    
      var newItem       = item;
      newItem.id        = $scope.items.length;
      newItem.name      = item.taskDesc || item.DESCR || item.ZCPR_OBJGEXTID || item.RAUFNR || item.TASKTYPE;
      newItem.desc      = item.projectDesc || item.ZCPR_EXTID || item.TASKTYPE;
      newItem.selected  = found;
      newItem.color     = color;
      $scope.items.push(newItem);

      $timeout(function () {
        $scope.$broadcast('rebuild:me');
      }, 10);
    }

    function loadProjects () {
      catsUtils.getTasks(function (data) {
        $scope.items = [];
        if ($scope.blocks === undefined) {
          $scope.blocks = [];
        }
        data.forEach(function(entry){
          createNewProjectItem(entry);  
          $timeout(function () {
            $scope.$broadcast('rebuild:me');
          }, 10);
        });
      });

      if (additionalData === undefined) {
        var week = calenderUtils.getWeekNumber(new Date());
        additionalData = catsUtils.getCatsAllocationDataForWeek(week.year, week.weekNo);
      }
      additionalData.then(function(data){
        if(data) {
          data.TIMESHEETS.RECORDS.forEach(function(record) {
            var allreadyExists = false;
            var taskTypeList = ['ADMI', 'EDUC', 'ABSE', 'VACA'];
            $scope.items.some(function(item) {
              if (taskTypeList.indexOf(record.TASKTYPE) >= 0) {
                allreadyExists = true;
                return true;
              }
              if (record.RAUFNR         === item.RAUFNR &&
                  record.ZCPR_EXTID     === item.ZCPR_EXTID &&
                  record.ZCPR_OBJGEXTID === item.ZCPR_OBJGEXTID) {
                allreadyExists = true;
                return true;
              }
            });
            if (!allreadyExists) {
              createNewProjectItem(record);  
            }
          });
        }
        $scope.loaded = true;
      });
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
        heightOfList: "@heightoflist"
    },
    replace: true,
    link: linkFn,
    templateUrl: "app/cats/detail/projectList.tmpl.html"
  };
}]);