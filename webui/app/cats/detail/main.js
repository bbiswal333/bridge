angular.module("app.cats.maintenanceView", ["app.cats.allocationBar", "ngRoute", "lib.utils", "app.cats.data", "ui.bootstrap", "app.cats"]).controller("app.cats.maintenanceView.mainCntrl", [
  "$scope", 
  "$modal",
  "$routeParams",
  "$location",
  "lib.utils.calUtils",
  "app.cats.data.catsUtils",
  "$http",
  "bridgeInBrowserNotification",
  "app.cats.monthlyData",
  function ($scope, $modal, $routeParams, $location, calUtils, catsUtils, $http, bridgeInBrowserNotification, monthlyData) {
    var CATS_WRITE_WEBSERVICE = "https://isp.wdf.sap.corp:443/sap/bc/zdevdb/WRITECATSDATA";

    $scope.blockdata = [];
    $scope.loaded = false;
    $scope.width = 800;
    $scope.monthlyData = {};

    $http.get(window.client.origin + '/client').success(function (data, status) {
        $scope.client = true;
    }).error(function (data, status, header, config) { 
        $scope.client = false;     
    });
    setDay($routeParams.day);
                        
    $scope.headline = calUtils.getWeekday($scope.day.getDay()); //Parameter for CATS-Compliance-App

    function loadCATSDataForDay() {
        monthlyData.getMonthData($scope.day.getFullYear(),$scope.day.getMonth(),function(monthData) {

            monthData.weeks.sort(function(a,b){return a.week - b.week});
            $scope.monthlyData  = monthData;
            var currentDay      = calUtils.stringifyDate($scope.day);

            // get tasks of particular day
            for (var i = 0; i < monthData.weeks.length; i++) {
                for (var j = 0; j < monthData.weeks[i].days.length; j++) {
                    if (monthData.weeks[i].days[j].date == currentDay) {
                        displayCATSDataForDay(monthData.weeks[i].days[j]);
                        return;
                    }
                }
            }
        });
    };

    loadCATSDataForDay();

    function displayCATSDataForDay(day) {
        $scope.lastCatsAllocationDataForDay = day;
        $scope.blockdata = [];
        catsUtils.getWorkingHoursForDay(calUtils.stringifyDate($scope.day), function (workingHours) {
            $scope.workingHoursForDay = workingHours;

            for (var i = 0; i < day.tasks.length; i++) {
                var task = day.tasks[i];
                if (task.TASKTYPE == "VACA")
                    addBlock("Vacation", task.QUANTITY, task, true);
                else
                    addBlock(task.DESCR || task.TASKTYPE, task.QUANTITY * $scope.workingHoursForDay, task);
            }
            $scope.loaded = true;
        });
    };

    $scope.handleProjectChecked = function (desc_s, val_i, task, fixed) {
        var block = {
            RAUFNR: task.RAUFNR,
            // booking: {
                COUNTER: 0,
                WORKDATE: calUtils.transformDateToABAPFormatWithHyphen($scope.day),
                STATUS: 30,
            // },
            TASKTYPE: task.TASKTYPE,
            ZCPR_EXTID: task.ZCPR_EXTID,
            ZCPR_OBJGEXTID: task.ZCPR_OBJGEXTID,
            // ZCPR_OBJGUID: data.ZCPR_OBJGUID,
            UNIT: "T",
        };
        
        return addBlock(desc_s, val_i, block, false);
    }

    $scope.handleProjectUnchecked = function (objgextid_s) {
        removeBlock(objgextid_s);
    }

    function getByExtId(block) {
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if ((block.ZCPR_OBJGEXTID != "" && $scope.blockdata[i].task.ZCPR_OBJGEXTID == block.ZCPR_OBJGEXTID) ||
                (block.ZCPR_OBJGEXTID == "" && $scope.blockdata[i].task.TASKTYPE == block.TASKTYPE))
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

    function addBlock(desc_s, val_i, block, fixed) {

        var existingBlock = getByExtId(block);
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
            task: block,
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

    function removeBlock(objgextid_s) {
        var i = 0;
        while (i < $scope.blockdata.length) {
            if (objgextid_s == $scope.blockdata[i].task.ZCPR_OBJGEXTID) {
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
                COUNTER: $scope.blockdata[i].task.COUNTER,
                WORKDATE: $scope.blockdata[i].task.WORKDATE,
                RAUFNR: $scope.blockdata[i].task.RAUFNR,
                TASKTYPE: $scope.blockdata[i].task.TASKTYPE,
                ZCPR_EXTID: $scope.blockdata[i].task.ZCPR_EXTID,
                ZCPR_OBJGEXTID: $scope.blockdata[i].task.ZCPR_OBJGEXTID,
                STATUS: $scope.blockdata[i].task.STATUS,
                UNIT: $scope.blockdata[i].task.UNIT,
                QUANTITY: Math.round($scope.blockdata[i].value / $scope.workingHoursForDay * 100) / 100,
            };

            if (booking.TASKTYPE === booking.ZCPR_OBJGEXTID) { //cleanup temporary data
                booking.ZCPR_OBJGEXTID = null;
            };

            if (booking.QUANTITY) { // book time > 0
                container.BOOKINGS.push(booking);
            } else { // book time = 0 only when RAUFNR already exists ==> "Deletion of task"
                for(var j = 0; j < $scope.lastCatsAllocationDataForDay.tasks.length; j++) {
                    if ($scope.lastCatsAllocationDataForDay.tasks[j].RAUFNR == booking.RAUFNR) {
                        container.BOOKINGS.push(booking);
                        break;
                    }
                }
            }
        }

        $scope.lastPostedCatsAllocationDataForDay = container;
        $http.post(window.client.origin + "/api/post?url=" + encodeURI(CATS_WRITE_WEBSERVICE), container ).success(function(data, status) {
            checkPostReply(data);
        }).error(function (data, status, header, config) {
            if (status != "404") // ignore 404 issues, they are currently (16.05.14) caused by nodeJS v0.11.9 issues
                bridgeInBrowserNotification.addAlert('info', "GET-Request to " + CATS_WRITE_WEBSERVICE + " failed. HTTP-Status: " + status + ".");
            else
                checkPostReply(data);
        });
    }

    function checkPostReply(data) {
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(data, "text/xml");
        } else { // Internet Explorer
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(data);
        };
        var replyHasMessages = false;
        for (var i = 0; i < 5; i++) {
            var message = xmlDoc.getElementsByTagName("TEXT")[i];
            if (message) {
                replyHasMessages = true;
                bridgeInBrowserNotification.addAlert('danger', message.childNodes[0].nodeValue);
            }
        }
        if (!replyHasMessages) {
            bridgeInBrowserNotification.addAlert('info', 'Well done! Data was saved successfully');
        }
        loadCATSDataForDay();
        $scope.$emit("refreshApp");
    }
}
]).filter("weekday", ["lib.utils.calUtils", function (calUtils) {
    return function (day, format) { //format: 0=short, 1=medium, 2=long (default)
        return calUtils.getWeekday(day, format);
    };
}]);