angular.module("app.cats.maintenanceView", ["app.cats.allocationBar", "dialogs"]).controller("app.cats.maintenanceView.mainCntrl",[
  "$scope", 
  "$dialogs",
  function ($scope, $dialogs) {
    $scope.blockdata = [{
        desc: "Project A",
        value: 50
    }, {
        desc: "Project B",
        value: 25
    }, {
        desc: "Project X",
        value: 25
    }];

    $scope.addBlock = function() {
        $scope.blockdata.push({
            desc: "Project Blah!",
            value: 10
        });
    };

    $scope.myCallback = function(val) {

    };

    $scope.onAdd = function (posVal) {
        $dialogs.create("/app/cats/detail/projectSelector.tmpl.html", "app.cats.maintenanceView.projectSelectorCntrl", {posVal: posVal});
    };

    $scope.onRemove = function (removedBlock) {

    };
  }
]).controller("app.cats.maintenanceView.projectSelectorCntrl", ["$scope", "$modalInstance", "data", function ($scope, $modalInstance, data) {
    console.log(data);
}]);