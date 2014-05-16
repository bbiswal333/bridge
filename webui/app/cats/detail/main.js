angular.module("app.cats.maintenanceView", ["app.cats.allocationBar", "ngRoute", "lib.utils", "app.cats.data", "ui.bootstrap", "app.cats"]).controller("app.cats.maintenanceView.mainCntrl", [
  "$scope", 
  "$modal",
  "$routeParams",
  "$location",
  "lib.utils.calUtils",
  "app.cats.data.catsUtils",
  "$http",
  "bridgeInBrowserNotification",
  function ($scope, $modal, $routeParams, $location, calUtils, catsUtils, $http, bridgeInBrowserNotification) {
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

    function loadCATSDataForDay() {
        catsUtils.getCatsAllocationDataForDay($scope.day, function (tasks) {
            displayCATSDataForDay(tasks);
        });
    };

    loadCATSDataForDay();

    function displayCATSDataForDay(tasks) {
        $scope.lastCatsAllocationDataForDay = tasks;
        $scope.blockdata = [];

        catsUtils.getWorkingHoursForDay(calUtils.stringifyDate($scope.day), function (workingHours) {
            $scope.workingHoursForDay = workingHours;

            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                if (task.tasktype == "VACA")
                    addBlock("Vacation", task.quantity, task.record, true);
                else
                    addBlock(task.taskDesc || task.tasktype, task.quantity * $scope.workingHoursForDay, task.record);
            }
            $scope.loaded = true;
        });
    };

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
            ZCPR_OBJGEXTID: data.ZCPR_OBJGEXTID,
            ZCPR_OBJGUID: data.ZCPR_OBJGUID,
            UNIT: "T",
        };
        
        return addBlock(desc_s, val_i, block, false);
    }

    $scope.handleProjectUnchecked = function (objgextid_s, objguid_s) {
        removeBlock(objgextid_s, objguid_s);
    }

    function getByExtId(block) {
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if ((block.ZCPR_OBJGEXTID != "" && $scope.blockdata[i].data.ZCPR_OBJGEXTID == block.ZCPR_OBJGEXTID) || (block.ZCPR_OBJGEXTID == "" && $scope.blockdata[i].data.TASKTYPE == block.TASKTYPE))
                return $scope.blockdata[i];
        }
        return null;
    }

    function getVisibleLength() {
        var visibleLength = 0;
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if ($scope.blockdata[i].value) {
                visibleLength++;
            } else {
                continue;
            };
        };
        return visibleLength;
    };

    function adjustBarValues() {
        // only ajust if all space is taken
        var total = 0;
        for (var i = 0; i < $scope.blockdata.length; i++) {
            total = $scope.blockdata[i].value + total;
        }
        if (total != $scope.workingHoursForDay) {
            return;
        }
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if ($scope.blockdata[i].value) {
                $scope.blockdata[i].value = $scope.workingHoursForDay * (Math.floor(100 / (getVisibleLength() + 1)) / 100);
            }
        }
    }

    function addBlock(desc_s, val_i, data, fixed) {

        var existingBlock = getByExtId(data);
        if (existingBlock != null) {
            if (!existingBlock.value) { // that is a "deleted" block which is required to be sent to backend
                adjustBarValues();
                existingBlock.value = Math.round(hoursToMaintain() * 1000) / 1000;
                return true;
            } else { // no need to add
                adjustBarValues();
                return;
            };
        }

        adjustBarValues();

        if (val_i == null) {
            val_i = 8;
            if (val_i > hoursToMaintain()) {
                val_i = Math.round(hoursToMaintain() * 1000) / 1000
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

    function hoursToMaintain() {
        var sum = 0;

        for (var i = 0; i < $scope.blockdata.length; i++) {
            sum = sum + $scope.blockdata[i].value;
        }

        return $scope.workingHoursForDay - sum;
    };

    function removeBlock(objgextid_s, objguid_s) {
        var i = 0;
        while (i < $scope.blockdata.length) {
            if (objgextid_s == $scope.blockdata[i].data.ZCPR_OBJGEXTID && objguid_s == $scope.blockdata[i].data.ZCPR_OBJGUID) {
                $scope.blockdata[i].value = 0;
            }
            i++;
        }
        // it is required to move the removed block to the beginning of the array
        // otherwise it can be dragged again in the UI
        var newBlockdata = [];
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if (!$scope.blockdata[i].value) {
                newBlockdata.push($scope.blockdata[i]);
            }
        }
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if ($scope.blockdata[i].value) {
                newBlockdata.push($scope.blockdata[i]);
            }
        }
        $scope.blockdata = newBlockdata; 
    };

    $scope.calcMinutes = function (perc) {
        console.log(perc);
        return calUtils.getTimeInWords((8 * 60) * (perc / 100), true) + " (" + Math.round(perc) + " %)";
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

    $scope.ResetToLastSavedState = function () {
        displayCATSDataForDay($scope.lastCatsAllocationDataForDay);
    };

    $scope.goBackToMainPage = function () {
        displayCATSDataForDay($scope.lastCatsAllocationDataForDay);
        $location.path('/#');
    };

    $scope.writeCATSdata = function () {
        // Return to "CHECKMESSAGES" when the transport arrived in ISP -> change also in for-loop below
        var container = {
            //CHECKMESSAGES: []
            BOOKINGS: [],
        };

        if(!$scope.workingHoursForDay) {
            bridgeInBrowserNotification.addAlert('info','Nothing to submit as target hours are 0');
            loadCATSDataForDay();
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

            if (booking.TASKTYPE === booking.ZCPR_OBJGEXTID) { //cleanup temporary data
                booking.ZCPR_OBJGEXTID = null;
            };

            if (booking.QUANTITY) { // book time > 0
                container.BOOKINGS.push(booking);
            } else { // book time = 0 only when RAUFNR exists ==> "Deletion of task"
                for(var j = 0; j < $scope.lastCatsAllocationDataForDay.length; j++) {
                    if ($scope.lastCatsAllocationDataForDay[j].record.RAUFNR == booking.RAUFNR) {
                        container.BOOKINGS.push(booking);
                        break;
                    }
                }
            }
        }

        $http.post(window.client.origin + "/api/post?url=" + encodeURI(CATS_WRITE_WEBSERVICE), container ).success(function(data, status) {
            console.log(data);
            if (window.DOMParser) {
                parser=new DOMParser();
                xmlDoc=parser.parseFromString(data,"text/xml");
            } else { // Internet Explorer
                xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async=false;
                xmlDoc.loadXML(data);
            };
            var replyHasMessages = false;
            for (var i = 0; i < 5; i++) {
                var message = xmlDoc.getElementsByTagName("TEXT")[i];
                if (message) {
                    replyHasMessages = true;
                    bridgeInBrowserNotification.addAlert('danger',message.childNodes[0].nodeValue);
                }
            }            
            if (!replyHasMessages) {
                bridgeInBrowserNotification.addAlert('info','Well done! Data was saved successfully');
            }
            loadCATSDataForDay();
            $scope.$emit("refreshApp");
        }).error(function(data, status, header, config) {
            bridgeInBrowserNotification.addAlert('info',"GET-Request to " + CATS_WRITE_WEBSERVICE + " failed. HTTP-Status: " + status + ".");
        });
    }
  }
]).filter("weekday", ["lib.utils.calUtils", function (calUtils) {
    return function (day, format) { //format: 0=short, 1=medium, 2=long (default)
        return calUtils.getWeekday(day, format);
    };
}]);