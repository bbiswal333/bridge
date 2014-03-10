angular.module("app.cats.maintenanceView.projectSelector", ["ui.bootstrap", "app.cats.data"]).factory("app.cats.maintenanceView.projectSelector", ["$modal", "app.cats.catsUtils", function ($modal, catsUtils) {
  var openModal = function (projects_ar, callback_fn) {
    var modalInstance = $modal.open({
      templateUrl: "/app/cats/detail/projectSelector.tmpl.html", 
      controller: "app.cats.maintenanceView.projectSelectorCntrl",
      keyboard: true,
      resolve: {
        items: function () {
          return projects_ar;
        }
      }
    });
    
    modalInstance.result.then(function (data) {
      callback_fn(data);
    });
  };

  var loadProjects = function (projects_ar, callback_fn) {
    catsUtils.getTasks(function (data) {
      openModal(data, callback_fn);
    });
  }

  return {
    show: loadProjects
  };
}]).controller("app.cats.maintenanceView.projectSelectorCntrl", function ($scope, $modalInstance, items) {
  $scope.items = [];
  $scope.filterVal = "";

  for (var i = 0; i < items.length; i++) {
    var newItem = {};
    newItem.id = i;
    newItem.name = items[i].taskDesc;
    newItem.desc = items[i].projectDesc;
    newItem.data = {};
    newItem.data.objgextid = items[i].objgextid;
    newItem.data.objguid = items[i].objguid;
    newItem.selected = (items[i].selected || null);
    $scope.items.push(newItem);
  }

  $scope.toogleSelect = function (indx) {
    console.log(indx);
    $scope.items[indx].selected = !$scope.items[indx].selected;
  };

  $scope.resetFilter = function () {
    $scope.filterVal = "";
  };

  $scope.close = function () {
    var res = [];

    for (var i = 0; i < $scope.items.length; i++) {
      if ($scope.items[i].selected) {
        res.push($scope.items[i]);
      }
    }

    $modalInstance.close(res);   
  };

  $scope.cancel = function () {
    $modalInstance.close(null);
  }
});