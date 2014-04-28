angular.module("app.cats.maintenanceView.projectList", ["ui.bootstrap", "app.cats.data"]).directive("app.cats.maintenanceView.projectList", ["app.cats.data.catsUtils", "$timeout", function (catsUtils, $timeout) {
  var linkFn = function ($scope) {
    $scope.items = [];
    $scope.filterVal = "";
    $scope.loaded = false;

    loadProjects();

    var config = {};
    $scope.scrollbar = function(direction, autoResize) {
        config.direction = direction;
        config.autoResize = autoResize;
        return config;
    }

    $scope.toogleSelect = function (indx) {
      $scope.items[indx].selected = !$scope.items[indx].selected;

      if ($scope.items[indx].selected) {
        var ok = $scope.onProjectChecked({
          desc_s: $scope.items[indx].name,
          val_i: null,
          data: $scope.items[indx].data,
        });

        if (!ok) {
          $scope.items[indx].selected = false;
        }
      }
      else {
        $scope.onProjectUnchecked({
          objgextid_s: $scope.items[indx].data.OBJGEXTID,
          objguid_s: $scope.items[indx].data.OBJGUID,
          objtype_s: $scope.items[indx].data.data.TASKTYPE
        });
      }
    };

    $scope.resetFilter = function () {
      $scope.filterVal = "";
    };

    function loadProjects () {
      catsUtils.getTasks(function (data) {
        $scope.items = [];
        
        for (var i = 0; i < data.length; i++) {
          var found = false;

          // for (var j = 0; j < $scope.blocks.length; j++) {
          //     if (data[i].OBJGEXTID == $scope.blocks[j].data.OBJGEXTID && data[i].OBJGUID == $scope.blocks[j].data.OBJGUID) {
          //         found = true;
          //     }
          // }
          for (var j = 0; j < $scope.blocks.length; j++) {
              if (data[i].data.ZCPR_OBJGEXTID == $scope.blocks[j].data.ZCPR_OBJGEXTID && // EDUC and ADMI
                  data[i].data.ZCPR_OBJGUID == $scope.blocks[j].data.ZCPR_OBJGUID &&
                  data[i].data.TASKTYPE == $scope.blocks[j].data.TASKTYPE ) {
                  
                  found = true;
              }else if (data[i].data.ZCPR_OBJGEXTID == $scope.blocks[j].data.ZCPR_OBJGEXTID && // Others, which have no tasktype
                        data[i].data.ZCPR_OBJGUID == $scope.blocks[j].data.ZCPR_OBJGUID &&
                        data[i].data.TASKTYPE == "" ) {
                  
                  found = true;
              }
          }

          var newItem = {};
          newItem.id = i;
          newItem.name = data[i].taskDesc;
          newItem.desc = data[i].projectDesc;
          newItem.data = data[i];
          newItem.selected = found;
          $scope.items.push(newItem);

          $scope.loaded = true;

          $timeout(function () {
            $scope.$broadcast('rebuild:me');
          }, 100);
        }
      });
    };

    $scope.$watch("blocks", function () {
      loadProjects();
    }, true);
  };

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