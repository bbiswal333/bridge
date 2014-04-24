angular.module("app.cats.maintenanceView", ["app.cats.allocationBar", "ngRoute", "lib.utils", "app.cats.data", "app.cats.maintenanceView.projectSelector", "ui.bootstrap", "app.cats"]).controller("app.cats.maintenanceView.mainCntrl", [
  "$scope", 
  "$modal",
  "$routeParams",
  "$location",
  "lib.utils.calUtils",
  "app.cats.data.catsUtils",
  "app.cats.maintenanceView.projectSelector",
  "$http",
  function ($scope, $modal, $routeParams, $location, calUtils, catsUtils, projectSelector, $http) {
    var CATS_WRITE_WEBSERVICE = "https://isp.wdf.sap.corp:443/sap/bc/zdevdb/WRITECATSDATA";

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
                if (task.tasktype == "VACA")
                    $scope.addBlock("Vacation", task.quantity, task.record, true);
                else
                    $scope.addBlock(task.taskDesc || task.tasktype, task.quantity * $scope.workingHoursForDay, task.record);
            }

            $scope.loaded = true;
        });        
    });

    $scope.addBlock = function(desc_s, val_i, record, fixed) {
        if (val_i == null) {
            val_i = (4 / $scope.workingHoursForDay);
            if (val_i > $scope.percToMaintain()) {
                val_i = $scope.percToMaintain();
            }
        }

        //If there is less than 30Minutes left, project will not be added
        /*if (val_i * ($scope.workingHoursForDay * 60) / 100 < 30) {
            return false;
        }*/

        $scope.blockdata.push({
            desc: desc_s,
            value: val_i,
            data: record,
            fixed: fixed || false,
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
    };

    $scope.writeCATSdata = function() {
        var container = {
            CHECKMESSAGES: []
        };
        for(var i = 0; i < $scope.blockdata.length; i++) {
            var booking = {
                COUNTER: $scope.blockdata[i].data.booking.COUNTER,
                WORKDATE: $scope.blockdata[i].data.booking.WORKDATE,
                RAUFNR: $scope.blockdata[i].data.RAUFNR,
                TASKTYPE: $scope.blockdata[i].data.TASKTYPE,
                ZCPR_EXTID: $scope.blockdata[i].data.ZCPR_EXTID,
                ZCPR_OBJGEXTID: $scope.blockdata[i].data.ZCPR_OBJGEXTID,
                STATUS: $scope.blockdata[i].data.booking.STATUS,
                UNIT: $scope.blockdata[i].data.UNIT,
                QUANTITY: $scope.blockdata[i].value / $scope.workingHoursForDay,
            };
            container.CHECKMESSAGES.push(booking);
        }

        /*$http({
                url: CATS_WRITE_WEBSERVICE + '?origin=' + encodeURIComponent(location.origin),
                method: "POST",
                data: angular.toJson(container),
                headers: { },
            }).success(function (data, status, headers, config) {
                console.log("Config saved successfully");
            }).error(function (data, status, headers, config) {
                console.log("Error when saving config!");
            });
        */
        //$http.defaults.headers.post["Content-Type"] = "application/json";
        $http.post("/api/post?url=" + encodeURI(CATS_WRITE_WEBSERVICE), ).success(function(data, status) {
            console.log(data);
        }).error(function(data, status, header, config) {
            console.log("GET-Request to " + CATS_WRITE_WEBSERVICE + " failed. HTTP-Status: " + status + ".\nData provided by server: " + data);
        });
    }
  }
]).filter("weekday", ["lib.utils.calUtils", function (calUtils) {
    return function (day, format) { //format: 0=short, 1=medium, 2=long (default)
        return calUtils.getWeekday(day, format);
    };
}]);