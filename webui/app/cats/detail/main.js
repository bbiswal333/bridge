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

    $http.get(window.client.origin + '/client').success(function (data, status) {
        $scope.client = true;
    }).error(function (data, status, header, config) { 
        $scope.client = false;     
    });
    setDay($routeParams.day);
                        
    $scope.headline = calUtils.getWeekday($scope.day.getDay()); //Parameter for CATS-Compliance-App

    $scope.loadCATSDataForDay = function () {
        catsUtils.getCatsAllocationDataForDay($scope.day, function (tasks) {
            console.log("Data from CATS:");
            console.log(tasks);
            $scope.blockdata = [];

            catsUtils.getWorkingHoursForDay(calUtils.stringifyDate($scope.day), function (workingHours) {
                $scope.workingHoursForDay = workingHours;

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
    };

    $scope.loadCATSDataForDay();

    $scope.handleProjectChecked = function (desc_s, val_i, data, fixed) {
        var block = {
            RAUFNR: data.data.RAUFNR,
            booking: {
                COUNTER: 0,
                WORKDATE: calUtils.transformDateToABAPFormatWithHyphen($scope.day),
                STATUS: 30,
            },
            TASKTYPE: data.data.TASKTYPE,
            ZCPR_EXTID: data.data.ZCPR_EXTID,
            ZCPR_OBJGEXTID: data.data.ZCPR_OBJGEXTID,
            ZCPR_OBJGUID: data.data.ZCPR_OBJGUID,
            UNIT: "T",
        };
        
        return $scope.addBlock(desc_s, val_i, block, false);
    }

    $scope.handleProjectUnchecked = function (objgextid_s, objguid_s, objtype_s) {
        $scope.removeBlock(objgextid_s, objguid_s, objtype_s);
    }

    $scope.getByExtId = function (block) {
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if ((block.ZCPR_OBJGEXTID != "" && $scope.blockdata[i].data.ZCPR_OBJGEXTID == block.ZCPR_OBJGEXTID) || (block.ZCPR_OBJGEXTID == "" && $scope.blockdata[i].data.TASKTYPE == block.TASKTYPE))
                return $scope.blockdata[i];
        }

        return null;
    }

    $scope.addBlock = function (desc_s, val_i, data, fixed) {
        var existingBlock = $scope.getByExtId(data);
        if (existingBlock != null) {
            if(data.booking.COUNTER) {
                existingBlock.data.booking.COUNTER = data.booking.COUNTER;
            };
            if (!existingBlock.value) {
                //existingBlock.value = 2;
                //if (existingBlock.value > $scope.hoursToMaintain()) {
                    existingBlock.value = Math.round($scope.hoursToMaintain() * 1000) / 1000
                //};
                return true;
            } else {
                return;
            };
        }

        if (val_i == null) {
            val_i = 8;
            if (val_i > $scope.hoursToMaintain()) {
                val_i = Math.round($scope.hoursToMaintain() * 1000) / 1000
            }
        }

        $scope.blockdata.push({
            desc: desc_s,
            value: val_i,
            data: data,
            fixed: fixed || false,
        });

        return true;
    };

    $scope.hoursToMaintain = function () {
        var sum = 0;

        for (var i = 0; i < $scope.blockdata.length; i++) {
            sum = sum + $scope.blockdata[i].value;
        }

        return $scope.workingHoursForDay - sum;
    };

    $scope.removeBlock = function (objgextid_s, objguid_s, objtype_s) {
        var i = 0;
        while (i < $scope.blockdata.length) {
            if (objgextid_s == $scope.blockdata[i].data.ZCPR_OBJGEXTID && objguid_s == $scope.blockdata[i].data.ZCPR_OBJGUID) {
                $scope.blockdata[i].value = 0;
            } else if (!objgextid_s && !objguid_s && objtype_s === $scope.blockdata[i].data.TASKTYPE ){
                $scope.blockdata[i].value = 0;
            }
            i++;
        }
    };

    /*$scope.$watch("blockdata", function () {
        console.log("Blockdata changed");

    }, true);*/

    $scope.calcMinutes = function (perc) {
        console.log(perc);
        return calUtils.getTimeInWords((8 * 60) * (perc / 100), true) + " (" + Math.round(perc) + " %)";
        //return calUtils.getTimeInWords(($scope.workingHoursForDay * 60) * (perc / 100), true); 
    };

    $scope.onAdd = function (posVal) {
        console.log(projectSelector);
        
        var alreadySelectedTasks = [];
        for (var i = 0; i < $scope.blockdata.length; i++) {
            alreadySelectedTasks.push({
                OBJGEXTID: $scope.blockdata[i].data.objgextid,
                OBJGUID: $scope.blockdata[i].data.objguid
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
                $scope.addBlock(selectedProjects[i].name, val, selectedProjects[i].data.OBJGEXTID, selectedProjects[i].data.OBJGUID);                
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

    $scope.writeCATSdata = function () {
        // Return to "CHECKMESSAGES" when the transport arrived in ISP -> change also in for-loop below
        var container = {
            //CHECKMESSAGES: []
            BOOKINGS: [],
        };
        if(!$scope.workingHoursForDay) {
            console.log("Nothing to maintain as target hours are 0");
            $scope.loadCATSDataForDay();
            $scope.$emit("refreshApp");
            return;
        }
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
                QUANTITY: Math.round($scope.blockdata[i].value / $scope.workingHoursForDay * 1000) / 1000,
            };
            container.BOOKINGS.push(booking);
        }

        $http.post(window.client.origin + "/api/post?url=" + encodeURI(CATS_WRITE_WEBSERVICE), container ).success(function(data, status) {
            console.log(data);
            $scope.loadCATSDataForDay();
            $scope.$emit("refreshApp");
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