angular.module("app.cats.maintenanceView", ["app.cats.allocationBar", "ngRoute", "lib.utils", "app.cats.data", "ui.bootstrap", "app.cats"]).controller("app.cats.maintenanceView.mainCntrl", [
  "$scope",
  "$q",
  "$modal",
  "$routeParams",
  "$location",
  "lib.utils.calUtils",
  "app.cats.data.catsUtils",
  "$http",
  "bridgeInBrowserNotification",
  "app.cats.monthlyData",
  function ($scope, $q, $modal, $routeParams, $location, calUtils, catsUtils, $http, bridgeInBrowserNotification, monthlyDataService) {
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

    function loadCATSDataForDay(dayString) {
        if(!dayString && monthlyDataService.lastSingleClickDay){
            dayString = monthlyDataService.lastSingleClickDay.dayString;
        }
        else if (!dayString)
        {
            $scope.loaded = true;
            return;
        }

        var promise = monthlyDataService.getDataForDate(dayString);
        promise.then(function() {
            displayCATSDataForDay(monthlyDataService.days[dayString]);
        });
    };

    loadCATSDataForDay();

    function displayCATSDataForDay(day) {
        $scope.lastCatsAllocationDataForDay = day;
        $scope.blockdata = [];
        if(day.targetTimeInPercentageOfDay)
            $scope.totalWorkingTime = 1;
        else
            $scope.totalWorkingTime = 0;

        for (var i = 0; i < day.tasks.length; i++) {
            var task = day.tasks[i];
            var HoursOfWorkingDay = 8;
            if (task.TASKTYPE == "VACA")
                addBlock("Vacation", task.QUANTITY / HoursOfWorkingDay, task, true);
            else if (task.TASKTYPE == "ABSE")
                addBlock("Absence", task.QUANTITY / HoursOfWorkingDay, task, true);
            else if (task.UNIT == "H")
                addBlock(task.DESCR || task.TASKTYPE, task.QUANTITY / HoursOfWorkingDay, task);
            else
                addBlock(task.DESCR || task.TASKTYPE, task.QUANTITY, task);
        }
        checkAndCorrectPartTimeInconsistancies(day);
        if(monthlyDataService.days[day.dayString].actualTimeInPercentageOfDay > monthlyDataService.days[day.dayString].targetTimeInPercentageOfDay) {
            var actualHours = Math.round(monthlyDataService.days[day.dayString].actualTimeInPercentageOfDay * 100 * 8) / 100;
            var targetHours = Math.round(monthlyDataService.days[day.dayString].targetTimeInPercentageOfDay * 100 * 8) / 100;
            bridgeInBrowserNotification.addAlert('danger', "The date '" + day.dayString + "' is overbooked! Actual hours are '" +
                actualHours + "'' but target hours are only '" +
                targetHours + "'!");
        }
        $scope.loaded = true;
    };

    $scope.handleProjectChecked = function (desc_s, val_i, task, fixed) {
        var block = {
            RAUFNR: task.RAUFNR,
            COUNTER: 0,
            WORKDATE: "", //that shall be decided later ...
            STATUS: 30,
            TASKTYPE: task.TASKTYPE,
            ZCPR_EXTID: task.ZCPR_EXTID,
            ZCPR_OBJGEXTID: task.ZCPR_OBJGEXTID,
            UNIT: "T",
        };
        return addBlock(desc_s, val_i, block, false);
    }

    $scope.handleProjectUnchecked = function (objgextid_s) {
        removeBlock(objgextid_s);
    }

    $scope.selectionCompleted = function() {
        if($scope.selectedDates.length == 0) { // Nothing selected
            $scope.blockdata = [];
            $scope.totalWorkingTime = 0;
        } else if($scope.selectedDates.length == 1) { // Single day
            loadCATSDataForDay($scope.selectedDates[0]);
        } else { // Range selected
            $scope.blockdata = [];
            $scope.totalWorkingTime = 1;
        }
    }

    $scope.handleSelectedDate = function(dayString){
        if($scope.selectedDates.indexOf(dayString) === -1) {
            $scope.selectedDates.push(dayString);
        }
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

    function adjustBarValues() {
        // only adjust if all space is taken
        var totalOfAdjustableTasks = 0;
        var spaceWhichIsAdjustable = $scope.totalWorkingTime;
        var adjustableLength = 0;

        for (var i = 0; i < $scope.blockdata.length; i++) {
            if ($scope.blockdata[i].value) {
                $scope.blockdata[i].value = Math.round($scope.blockdata[i].value * 1000) / 1000;
                if ($scope.blockdata[i].fixed) {
                    spaceWhichIsAdjustable = spaceWhichIsAdjustable - $scope.blockdata[i].value;
                } else {
                    totalOfAdjustableTasks = totalOfAdjustableTasks + $scope.blockdata[i].value;
                    adjustableLength++;
                }
                totalOfAdjustableTasks = Math.round(totalOfAdjustableTasks * 1000) / 1000;
            }
        }
        if (totalOfAdjustableTasks != spaceWhichIsAdjustable) {
            return;
        }
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if ($scope.blockdata[i].value && !$scope.blockdata[i].fixed) {
                $scope.blockdata[i].value = Math.round(spaceWhichIsAdjustable * (Math.floor(1000 / (adjustableLength + 1)) / 1000) * 1000) / 1000;
            }
        }
    }

    function checkAndCorrectPartTimeInconsistancies(day) {
        if (monthlyDataService.days[day.dayString] &&
            monthlyDataService.days[day.dayString].targetTimeInPercentageOfDay &&
            monthlyDataService.days[day.dayString].targetTimeInPercentageOfDay ==
            monthlyDataService.days[day.dayString].actualTimeInPercentageOfDay) {

            // adjust slight deviations in QUANTITY when posting part time
            var totalBlockValue = 0;
            var biggestBlock;
            $scope.blockdata.forEach(function(block){
                if(!biggestBlock || biggestBlock.value <= block.value) {
                    biggestBlock = block;
                }
                totalBlockValue += block.value;
            });
            totalBlockValue = Math.round(totalBlockValue * 1000) / 1000;
            var blockDif = totalBlockValue - 1;
            if((blockDif > 0 && blockDif < 0.03) ||
               (blockDif < 0 && blockDif > -0.03)) {
                biggestBlock.value -= blockDif;
            }
        }
    }

    function addBlock(desc_s, val_i, block, fixed) {

        // Scale data which is read from backend BUT only if it is not OVERBOOKED
        if (block.COUNTER && // already in backend
            monthlyDataService.days[block.WORKDATE] &&
            monthlyDataService.days[block.WORKDATE].targetTimeInPercentageOfDay >=
            monthlyDataService.days[block.WORKDATE].actualTimeInPercentageOfDay) {

            val_i = Math.round(val_i / monthlyDataService.days[block.WORKDATE].targetTimeInPercentageOfDay * 1000) / 1000;
        }

        var existingBlock = getByExtId(block);
        if (existingBlock != null) {
            if (!existingBlock.value) { // that is a "deleted" block which is required to be sent to backend
                adjustBarValues();
                existingBlock.value = Math.round(timeToMaintain() * 1000) / 1000;
                return true;
            } else { // no need to add
                adjustBarValues();
                return;
            };
        }

        adjustBarValues();

        if (val_i == null) {
            val_i = 1;
            if (val_i > timeToMaintain()) {
                val_i = Math.round(timeToMaintain() * 1000) / 1000
            }
        }

        if (val_i) { // val_i could be 0 e.g. in case of vacation
            $scope.blockdata.push({
                desc: desc_s,
                value: val_i,
                task: block,
                fixed: fixed || false,
            });
        }

        return true;
    };

    function timeToMaintain() {
        var sum = 0;

        for (var i = 0; i < $scope.blockdata.length; i++) {
            sum = sum + $scope.blockdata[i].value;
        }

        return $scope.totalWorkingTime - sum;
    };

    function removeBlock(objgextid_s) {
        var i = 0;
        while (i < $scope.blockdata.length) {
            if (objgextid_s == $scope.blockdata[i].task.ZCPR_OBJGEXTID) {
                if ($scope.blockdata[i].task.COUNTER) {
                    $scope.blockdata[i].value = 0; // is kept for deletion in backend with value = 0
                } else {
                    $scope.blockdata.splice(i,1);
                }
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

    $scope.saveTimesheet = function(){
        var clearOldTasks = false;
        var weeks = [];
        // Return to "CHECKMESSAGES" when the transport arrived in ISP -> change also in for-loop below
        var container = {
            //CHECKMESSAGES: []
            BOOKINGS: [],
        };

        var selectedDates = $scope.selectedDates;
        $scope.selectedDates = [];
        selectedDates.forEach(function(dateString){
            if($scope.selectedDates.indexOf(dateString) === -1) {
                $scope.selectedDates.push(dateString);
            } else {
                console.log("The selectedDates array had double entries! Please check selection functionality.")
            }
        });

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

        if (container.BOOKINGS.length) {
            monthlyDataService.reloadInProgress.value = true;
            catsUtils.writeCATSData(container).then(function(data){
            monthlyDataService.reloadInProgress.value = false;
                checkPostReply(data);
                $scope.$emit("refreshApp"); // this must be done before loadDataForSelectedWeeks() for performance reasons
                monthlyDataService.loadDataForSelectedWeeks(weeks).then(function(){
                    loadCATSDataForDay();
                });
            }, function(status){
                bridgeInBrowserNotification.addAlert('info', "GET-Request to " + CATS_WRITE_WEBSERVICE + " failed. HTTP-Status: " + status + ".");
                loadCATSDataForDay();
                $scope.$emit("refreshApp");
            });
        } else {
            bridgeInBrowserNotification.addAlert('info', "No changes recognized. No update required.");
        }
    }

    function prepareCATSData (workdate, container, clearOldTasks){
        var workdateBookings = [];
        var totalWorkingTimeForDay = monthlyDataService.days[workdate].targetTimeInPercentageOfDay;

        if(!totalWorkingTimeForDay) {
            bridgeInBrowserNotification.addAlert('info','Nothing to submit as target hours are 0');
            loadCATSDataForDay();
            $scope.$emit("refreshApp");
            return;
        }

        if (clearOldTasks) {
            monthlyDataService.days[workdate].tasks.forEach(function(task){
                if (task.QUANTITY == 0 ||
                    task.TASKTYPE == "VACA" ||
                    task.TASKTYPE == "ABSE") { 
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

            booking.QUANTITY = Math.round($scope.blockdata[i].value * totalWorkingTimeForDay * 1000) / 1000;

            if (booking.TASKTYPE === 'VACA' || booking.TASKTYPE === 'ABSE'){
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
        
        // adjust slight deviations in QUANTITY when posting part time
        var totalBookingQuantity = 0;
        var biggestBooking;
        container.BOOKINGS.forEach(function(booking){
            if(!biggestBooking || biggestBooking.QUANTITY <= booking.QUANTITY) {
                biggestBooking = booking;
            }
            totalBookingQuantity += booking.QUANTITY;
        });
        totalBookingQuantity = Math.round(totalBookingQuantity * 1000) / 1000;
        var bookingDif = totalBookingQuantity - totalWorkingTimeForDay;
        if((bookingDif > 0 && bookingDif < 0.03) ||
           (bookingDif < 0 && bookingDif > -0.03)) {
            biggestBooking.QUANTITY -= bookingDif;
        }

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