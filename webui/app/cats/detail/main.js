angular.module("app.cats.maintenanceView", ["app.cats.allocationBar", "ngRoute", "lib.utils", "app.cats.data", "app.cats.maintenanceView.projectSelector", "ui.bootstrap", "app.cats"]).controller("app.cats.maintenanceView.mainCntrl", [
  "$scope", 
  "$modal",
  "$routeParams",
  "$location",
  "lib.utils.calUtils",
  "app.cats.data.catsUtils",
  "app.cats.maintenanceView.projectSelector",
  function ($scope, $modal, $routeParams, $location, calUtils, catsUtils, projectSelector) {
    $scope.blockdata = [];
    $scope.loaded = false;
    $scope.width = 800; 

    setDay($routeParams.day);
                        
    $scope.headline = calUtils.getWeekday($scope.day.getDay()); //Parameter for CATS-Compliance-App

    catsUtils.getCatsAllocationDataForDay($scope.day, function (tasks) {
        console.log("Data from CATS:");
        console.log(tasks);

        catsUtils.getWorkingHoursForDay(calUtils.stringifyDate($scope.day), function (workingHours) {
            $scope.workingHoursForDay = workingHours;

            $scope.snaprange = (($scope.width * 15.0) / ($scope.workingHoursForDay * 60.0));
            console.log("Snaprange: " + $scope.snaprange);


            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                $scope.addBlock(task.taskDesc, task.quantity * 100, task.objgextid, task.objguid); 
            }
    /*        $scope.blockdata = [{
                desc: "Project 1",
                value: (0.5/$scope.workingHoursForDay * 100),
                data: {objgextid: "test1", objguid: "0012"}
            }, {
                desc: "Project 2",
                value: (0.5/$scope.workingHoursForDay * 100),
                data: {objgextid: "test1", objguid: "0013"}
            }, {
                desc: "Project 3",
                value: (0.5/$scope.workingHoursForDay * 100),
                data: {objgextid: "test1", objguid: "0013"}
            }];*/

            $scope.loaded = true;
        });        
    });

    $scope.addBlock = function(desc_s, val_i, objgextid_s, objguid_s) {
        if (val_i == null) {
            val_i = (1 / $scope.workingHoursForDay) * 100;
            if (val_i > $scope.percToMaintain()) {
                val_i = $scope.percToMaintain();
            }
        }

        //If there is less than 30Minutes left, project will not be added
        if (val_i * ($scope.workingHoursForDay * 60) / 100 < 30) {
            return false;
        }

        $scope.blockdata.push({
            desc: desc_s,
            value: val_i,
            data: {
                objgextid: objgextid_s,
                objguid: objguid_s
            }
        });

        return true;
    };

    $scope.percToMaintain = function () {
        var sum = 0;

        for (var i = 0; i < $scope.blockdata.length; i++) {
            sum = sum + $scope.blockdata[i].value;
        }

        return 100 - sum;
    };

    $scope.removeBlock = function (objgextid_s, objguid_s) {
        var i = 0;
        while (i < $scope.blockdata.length) {
            if (objgextid_s == $scope.blockdata[i].data.objgextid && objguid_s == $scope.blockdata[i].data.objguid) {
                $scope.blockdata.splice(i, 1);
            }
            else {
                i++;
            }
        }
    };

    $scope.$watch("blockdata", function () {
        console.log("Blockdata changed");

    }, true);

    $scope.calcMinutes = function (perc) {
        console.log(perc);
        //return calUtils.getTimeInWords((8 * 60) * (perc / 100), true) + " (" + Math.floor(perc * 100) / 100 + " %)";    
        return calUtils.getTimeInWords(($scope.workingHoursForDay * 60) * (perc / 100), true); 
    };

    $scope.onAdd = function (posVal) {
        console.log(projectSelector);
        
        var alreadySelectedTasks = [];
        for (var i = 0; i < $scope.blockdata.length; i++) {
            alreadySelectedTasks.push({
                objgextid: $scope.blockdata[i].data.objgextid,
                objguid: $scope.blockdata[i].data.objguid
            });
        }

        projectSelector.show(alreadySelectedTasks, function (selectedProjects) {
            if (selectedProjects == null) {
                //Toast or alert telling no tasks have been seleceted
                return;
            }

            var val = posVal / selectedProjects.length;
            console.log(posVal);
            if ((1 / $scope.workingHoursForDay) * 100 * selectedProjects.length <= posVal) val = (1 / $scope.workingHoursForDay) * 100;
            for (var i = 0; i < selectedProjects.length; i++) {
                $scope.addBlock(selectedProjects[i].name, val, selectedProjects[i].data.objgextid, selectedProjects[i].data.objguid);                
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
]).filter("weekday", ["lib.utils.calUtils", function (calUtils) {
    return function (day, format) { //format: 0=short, 1=medium, 2=long (default)
        return calUtils.getWeekday(day, format);
    };
}]);