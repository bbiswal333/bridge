angular.module("app.cats.maintenanceView", ["app.cats.allocationBar", "ngRoute", "lib.utils", "app.cats.data", "app.cats.maintenanceView.projectSelector", "ui.bootstrap"]).controller("app.cats.maintenanceView.mainCntrl", [
  "$scope", 
  "$modal",
  "$routeParams",
  "$location",
  "lib.utils.calUtils",
  "app.cats.catsUtils",
  "app.cats.maintenanceView.projectSelector",
  function ($scope, $modal, $routeParams, $location, calUtils, catsUtils, projectSelector) {
    setDay($routeParams.day);

/*    catsUtils.getTasks(function (data) {
        console.log(data);
    });*/

    console.log("Test");


    $scope.blockdata = [{
        desc: "Project 1",
        value: (2/32 * 100)
    }, {
        desc: "Project 2",
        value: (2/32 * 100)
    }, {
        desc: "Project 3",
        value: (2/32 * 100)
    }];

    $scope.addBlock = function(desc_s, val_i) {
        $scope.blockdata.push({
            desc: desc_s,
            value: val_i
        });
    };

    $scope.myCallback = function(val) {
        $scope.blockdata = val; //Because apply cannot be called anymore in directive, so two way binding doesn't work anymore
        console.log(val);
    };

    $scope.calcMinutes = function (perc) {
        //return calUtils.getTimeInWords((8 * 60) * (perc / 100), true) + " (" + Math.floor(perc * 100) / 100 + " %)";    
        return calUtils.getTimeInWords((8 * 60) * (perc / 100), true); 
    };

    $scope.onAdd = function (posVal) {
        console.log(projectSelector);

        projectSelector.show([{name: "test", desc: "Projekt A"}, {name: "testABC", desc: "Projekt B"}], function (selectedProjects) {
            var val = posVal / selectedProjects.length;

            for (var i = 0; i < selectedProjects.length; i++) {
                $scope.addBlock(selectedProjects[i].name, val);                
            }
        });
    };

    $scope.onRemove = function (removedBlock) {

    };

    function setDay (date) {
        if (typeof date == "undefined") {
            $scope.day = calUtils.today();
        }
        else if (date instanceof Date) {
            $scope.day = date;
        }
        else {
            $scope.day = calUtils.parseDate(date);
        }

        var path = "/detail/cats/" + calUtils.stringifyDate($scope.day) + "/";
        console.log(path);
        $location.path(path);
    }
  }
]);