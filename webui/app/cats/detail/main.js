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
  function ($scope, $modal, $routeParams, $location, calUtils, catsUtils, $http, bridgeInBrowserNotification, monthlyDataService) {
    var CATS_WRITE_WEBSERVICE = "https://isp.wdf.sap.corp:443/sap/bc/zdevdb/WRITECATSDATA";

    $scope.blockdata = [];
    $scope.loaded = false;
    $scope.width = 800;
    $scope.selectedDates = [];

    $http.get(window.client.origin + '/client').success(function (data, status) {
        $scope.client = true;
    }).error(function (data, status, header, config) { 
        $scope.client = false;     
    });
    setDay($routeParams.day);
                        
    $scope.headline = calUtils.getWeekday($scope.day.getDay()); //Parameter for CATS-Compliance-App

    function loadCATSDataForDay() {
        var currentDay = calUtils.stringifyDate($scope.day);
        var promise = monthlyDataService.getDataForDate(currentDay);
        promise.then(function() {
            displayCATSDataForDay(monthlyDataService.days[currentDay]);
        });
    };

    loadCATSDataForDay();

    function displayCATSDataForDay(day) {
        $scope.lastCatsAllocationDataForDay = day;
        $scope.blockdata = [];
        catsUtils.getWorkingHoursForDay(day.dayString, function (workingHours) {
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

    $scope.handleSelectedDate = function(dayString){
        $scope.selectedDates.push(dayString);
        return true;
    }

    $scope.handleDeselectedDate = function(dayString){
        var dateIndex = $scope.selectedDates.indexOf(dayString);
        $scope.selectedDates.splice(dateIndex, 1);
        return true;
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

        $scope.selectedDates = [calUtils.stringifyDate($scope.day)];

        var path = "/detail/cats/" + calUtils.stringifyDate($scope.day) + "/";
        console.log(path);
        $location.path(path);
    };


    $scope.ResetToLastSavedState = function () {
        displayCATSDataForDay(monthlyDataService.days[calUtils.stringifyDate($scope.day)]);
    };

    $scope.goBackToMainPage = function () {
        displayCATSDataForDay(monthlyDataService.days[calUtils.stringifyDate($scope.day)]);
        $location.path('/#');
    };

    $scope.saveTimesheet = function(){
        var clearOldTasks = false;
        var weeks = [];
        // Return to "CHECKMESSAGES" when the transport arrived in ISP -> change also in for-loop below
        var container = {
            //CHECKMESSAGES: []
            BOOKINGS: [],
        };
        if ($scope.selectedDates.length > 1) {
            clearOldTasks = true;
        };

        $scope.selectedDates.forEach(function(dateString){
            container = prepareCATSData(dateString, container, clearOldTasks);

            var day = monthlyDataService.days[dateString];
            if (weeks.indexOf(day.year + '.' + day.week) === -1) {
                weeks.push(day.year + '.' + day.week);
            };
        });

        // $scope.writeCATSdata(container);
        catsUtils.writeCATSData(container).then(function(data){
            checkPostReply(data);
            monthlyDataService.loadDataForSelectedWeeks(weeks).then(function(){
                loadCATSDataForDay();
                $scope.$emit("refreshApp");
            });        
        }, function(status){
            bridgeInBrowserNotification.addAlert('info', "GET-Request to " + CATS_WRITE_WEBSERVICE + " failed. HTTP-Status: " + status + ".");
            loadCATSDataForDay();
            $scope.$emit("refreshApp");
        });
        
    }
    

    function prepareCATSData (workdate, container, clearOldTasks){
        var workdateBookings = [];

        if(!$scope.workingHoursForDay) {
            bridgeInBrowserNotification.addAlert('info','Nothing to submit as target hours are 0');
            loadCATSDataForDay();
            $scope.$emit("refreshApp");
            return;
        }

        if (clearOldTasks) {
            monthlyDataService.days[workdate].tasks.forEach(function(task){
                if (task.QUANTITY == 0) { 
                    return ;
                }
                var taskDeletion = angular.copy(task);
                taskDeletion.WORKDATE = workdate || task.WORKDATE;
                taskDeletion.QUANTITY = 0;

                container.BOOKINGS.push(taskDeletion);
            })
        };

        for(var i = 0; i < $scope.blockdata.length; i++) {

            var booking = angular.copy($scope.blockdata[i].task);
            booking.WORKDATE = workdate || $scope.blockdata[i].task.WORKDATE;
            booking.QUANTITY = Math.round($scope.blockdata[i].value / $scope.workingHoursForDay * 100) / 100;

            if (booking.TASKTYPE === 'VACA'){
                continue;
            }

            if (booking.TASKTYPE === booking.ZCPR_OBJGEXTID) { //cleanup temporary data
                booking.ZCPR_OBJGEXTID = null;
            }

            if (clearOldTasks) {
                booking.COUNTER = 0;
            }
            if (booking.QUANTITY) { // book time > 0
                workdateBookings.push(booking);
            } else { // book time = 0 only when RAUFNR already exists ==> "Deletion of task"
                var oldTasks = monthlyDataService.getTasksForDate(workdate || $scope.blockdata[i].task.WORKDATE);
                for(var j = 0; j < oldTasks.length; j++) {
                    if (oldTasks[j].RAUFNR == booking.RAUFNR
                        && !clearOldTasks) {
                        workdateBookings.push(booking);
                        break;
                    }
                }
            }
        }
        container.BOOKINGS = container.BOOKINGS.concat(workdateBookings);
        monthlyDataService.days[workdate].tasks = workdateBookings;
        return container;
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
    }
}
]).filter("weekday", ["lib.utils.calUtils", function (calUtils) {
    return function (day, format) { //format: 0=short, 1=medium, 2=long (default)
        return calUtils.getWeekday(day, format);
    };
}]);