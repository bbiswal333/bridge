angular.module("app.cats.maintenanceView.projectList", ["ui.bootstrap", "app.cats.data", "app.cats.allocationBar.utils"]).
  directive("app.cats.maintenanceView.projectList", ["app.cats.data.catsUtils", "$timeout", "app.cats.allocationBar.utils.colorUtils", function (catsUtils, $timeout, colorUtils) {
  var linkFn = function ($scope) {
    $scope.items = [];
    $scope.filter = {};
    $scope.filter.val = "";
    $scope.loaded = false;

    loadProjects();

    var config = {};
    $scope.scrollbar = function(direction, autoResize) {
        config.direction = direction;
        config.autoResize = autoResize;
        return config;
    }

    $scope.onPressEnter = function(){
      if (event.which === 13) {
        document.getElementById("projectButton").focus();
      };
    }

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
          objgextid_s: $scope.items[indx].ZCPR_OBJGEXTID
        });
      }
      document.getElementById("filterTextfield").focus();
    };

    $scope.resetFilter = function () {
      $scope.filter.val = "";
    };

    function loadProjects () {
      catsUtils.getTasks(function (data) {
        $scope.items = [];
        
        for (var i = 0; i < data.length; i++) {
          var color = null;
          var found = false;

          for (var j = 0; j < $scope.blocks.length; j++) {
            if (data[i].ZCPR_OBJGEXTID == $scope.blocks[j].task.ZCPR_OBJGEXTID && $scope.blocks[j].value != 0){
              found = true;
              color = colorUtils.getColorForBlock($scope.blocks[j]);    
            }
          }

          var newItem = data[i];
          newItem.id        = i;
          newItem.name      = data[i].taskDesc;
          newItem.desc      = data[i].projectDesc;
          newItem.selected  = found;
          newItem.color     = color;
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