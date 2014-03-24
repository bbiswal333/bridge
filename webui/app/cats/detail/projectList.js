angular.module("app.cats.maintenanceView.projectList", ["ui.bootstrap", "app.cats.data"]).directive("app.cats.maintenanceView.projectList", ["app.cats.data.catsUtils", "$timeout", function (catsUtils, $timeout) {
  var linkFn = function ($scope) {
    $scope.items = [];
    $scope.filterVal = "";

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
          objgextid_s: $scope.items[indx].data.objgextid,
          objguid_s: $scope.items[indx].data.objguid
        });

        if (!ok) {
          $scope.items[indx].selected = false;
        }
      }
      else {
        $scope.onProjectUnchecked({
          objgextid_s: $scope.items[indx].data.objgextid,
          objguid_s: $scope.items[indx].data.objguid
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

          for (var j = 0; j < $scope.blocks.length; j++) {
            if (data[i].objgextid == $scope.blocks[j].data.objgextid && data[i].objguid == $scope.blocks[j].data.objguid) {
              found  = true;
            }
          }

          var newItem = {};
          newItem.id = i;
          newItem.name = data[i].taskDesc;
          newItem.desc = data[i].projectDesc;
          newItem.data = {};
          newItem.data.objgextid = data[i].objgextid;
          newItem.data.objguid = data[i].objguid;
          newItem.selected = found;
          $scope.items.push(newItem);

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