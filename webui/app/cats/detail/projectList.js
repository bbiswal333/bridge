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
      console.log(indx);
      $scope.items[indx].selected = !$scope.items[indx].selected;
    };

    $scope.resetFilter = function () {
      $scope.filterVal = "";
    };

    $scope.cancel = function () {
      $modalInstance.close(null);
    };
  
    function loadProjects () {
      catsUtils.getTasks(function (data) {
        $scope.items = [];
        console.log("Tasks");
        console.log(data);
        
        for (var i = 0; i < data.length; i++) {
          var found = false;

          for (var j = 0; j < $scope.excludeProjects.length; j++) {
            if (data[i].objgextid == $scope.excludeProjects[j].objgextid && data[i].objguid == $scope.excludeProjects[j].objguid) {
              found  = true;
            }
          }

          if (!found) {
            var newItem = {};
            newItem.id = i;
            newItem.name = data[i].taskDesc;
            newItem.desc = data[i].projectDesc;
            newItem.data = {};
            newItem.data.objgextid = data[i].objgextid;
            newItem.data.objguid = data[i].objguid;
            newItem.selected = (data[i].selected || null);
            $scope.items.push(newItem);
          }

          $timeout(function () {
            $scope.$broadcast('rebuild:me');
          }, 100);
        }
      });
    };
  };

  return {
    restrict: "E",
    scope: {
        onProjectChecked: "&onprojectchecked",
        onProjectUnchecked: "&onprojectunchecked",
        excludeProjects: "=excludeprojects"
    },
    replace: true,
    link: linkFn,
    templateUrl: "app/cats/detail/projectList.tmpl.html"
  };
}]);