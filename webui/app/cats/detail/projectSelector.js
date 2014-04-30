angular.module("app.cats.maintenanceView.projectSelector", ["ui.bootstrap", "ngScrollbar", "app.cats.data"]).factory("app.cats.maintenanceView.projectSelector", ["$modal", "app.cats.data.catsUtils", function ($modal, catsUtils) {
  var openModal = function (projects_ar, callback_fn) {
    var modalInstance = $modal.open({
      templateUrl: "/app/cats/detail/projectSelector.tmpl.html", 
      controller: "app.cats.maintenanceView.projectSelectorCntrl",
      windowClass: 'settings-dialog',
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

  var loadProjects = function (exclude_ar, callback_fn) {
    catsUtils.getTasks(function (data) {
      console.log("Tasks");
      console.log(data);
      
      var dataCleaned = [];
      for (var i = 0; i < data.length; i++) {
        var found = false;

        for (var j = 0; j < exclude_ar.length; j++) {
            if (data[i].ZCPR_OBJGEXTID == exclude_ar[j].ZCPR_OBJGEXTID && data[i].ZCPR_OBJGUID == exclude_ar[j].ZCPR_OBJGUID) {
                found = true;
            }
        }

        if (!found) {
          dataCleaned.push(data[i]);
        }
      }

      openModal(dataCleaned, callback_fn);
    });
  }

  return {
    show: loadProjects
  };
}]);