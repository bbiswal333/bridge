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
  "app.cats.configService",
  "bridgeDataService",
  function ($scope, $q, $modal, $routeParams, $location, calUtils, catsUtils, $http, bridgeInBrowserNotification, monthlyDataService, configService, bridgeDataService) {
    var CATS_WRITE_WEBSERVICE = "https://isp.wdf.sap.corp:443/sap/bc/zdevdb/WRITECATSDATA";

    $scope.blockdata = [];
    $scope.loaded = false;
    $scope.width = 800;
    $scope.selectedDates = [];
    $scope.totalWorkingTime = 0;
    $scope.hintText = "";

    var persistedConfig = bridgeDataService.getAppConfigByModuleName('app.cats');

    if (persistedConfig && persistedConfig.favoriteItems && !configService.loaded) {
        configService.favoriteItems = persistedConfig.favoriteItems;
    }

    function timeToMaintain() {
        try {
            var sum = 0;
            for (var i = 0; i < $scope.blockdata.length; i++) {
                sum = sum + $scope.blockdata[i].value;
            }
            return $scope.totalWorkingTime - sum;
        } catch(err) {
            console.log("timeToMaintain(): " + err);
            return $scope.totalWorkingTime;
        }
    }

    $scope.calcMinutes = function (perc) {
        console.log(perc);
        return calUtils.getTimeInWords((8 * 60) * (perc / 100), true) + " (" + Math.round(perc) + " %)";
    };

    // function isSameTask(block, task) {
    //     if ((block.ZCPR_OBJGEXTID === task.ZCPR_OBJGEXTID && block.ZCPR_OBJGEXTID !== "") || // OBJEXTID exists
    //         (block.ZCPR_OBJGEXTID === task.ZCPR_OBJGEXTID && block.ZCPR_OBJGEXTID === "" &&
    //          task.RAUFNR === block.RAUFNR &&
    //          task.TASKTYPE === block.TASKTYPE && block.TASKTYPE !== "")) { // unique TASKTYPE RAUFNR combination
    //         return true;
    //     }
    //     return false;
    // }

    function getBlock(block) {
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if (catsUtils.isSameTask(block, $scope.blockdata[i].task)) {
                return $scope.blockdata[i];
            }
        }
        return null;
    }

    function adjustBarValues() {
        // only adjust if all space is taken
        var totalOfAdjustableTasks = 0;
        var spaceWhichIsAdjustable = $scope.totalWorkingTime;
        var adjustableLength = 0;
        var i = 0;
        try {
            for (i = 0; i < $scope.blockdata.length; i++) {
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
            if (totalOfAdjustableTasks !== spaceWhichIsAdjustable) {
                return;
            }
            for (i = 0; i < $scope.blockdata.length; i++) {
                if ($scope.blockdata[i].value && !$scope.blockdata[i].fixed) {
                    $scope.blockdata[i].value = Math.round(spaceWhichIsAdjustable * (Math.floor(1000 / (adjustableLength + 1)) / 1000) * 1000) / 1000;
                }
            }
        } catch(err) {
            console.log("adjustBarValues(): " + err);
        }
    }
    
    function addBlock(desc_s, val_i, block, fixed) {
        try {
            // Scale data which is read from backend BUT only if it is not OVERBOOKED
            if (block.COUNTER && // already in backend
                monthlyDataService.days[block.WORKDATE] &&
                monthlyDataService.days[block.WORKDATE].targetTimeInPercentageOfDay >=
                monthlyDataService.days[block.WORKDATE].actualTimeInPercentageOfDay) {

                val_i = Math.round(val_i / monthlyDataService.days[block.WORKDATE].targetTimeInPercentageOfDay * 1000) / 1000;
            }

            var existingBlock = getBlock(block);
            if (existingBlock != null) {
                if (!existingBlock.value) { // that is a "deleted" block which is required to be sent to backend
                    adjustBarValues();
                    existingBlock.value = Math.round(timeToMaintain() * 1000) / 1000;
                    return true;
                } else { // no need to add
                    adjustBarValues();
                    return false;
                }
            }

            adjustBarValues();

            if (val_i == null) {
                val_i = 1;
                if (val_i > timeToMaintain()) {
                    val_i = Math.round(timeToMaintain() * 1000) / 1000;
                }
            }

            if (val_i) { // val_i could be 0 e.g. in case of vacation or weekends or not selected
                $scope.blockdata.push({
                    desc: desc_s,
                    value: val_i,
                    task: block,
                    fixed: fixed || false
                });
                return true;
            } else {
                return false;
            }
        } catch(err) {
            console.log("addBlock(): " + err);
            return false;
        }
    }

    function removeBlock(block) {
        try {
            var i = 0;
            while (i < $scope.blockdata.length) {
                if (catsUtils.isSameTask(block, $scope.blockdata[i].task)) {
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
            for (i = 0; i < $scope.blockdata.length; i++) {
                if (!$scope.blockdata[i].value) {
                    newBlockdata.push($scope.blockdata[i]);
                }
            }
            for (i = 0; i < $scope.blockdata.length; i++) {
                if ($scope.blockdata[i].value) {
                    newBlockdata.push($scope.blockdata[i]);
                }
            }
            $scope.blockdata = newBlockdata;
        } catch(err) {
            console.log("removeBlock(): " + err);
        }
    }

    function checkAndCorrectPartTimeInconsistancies(day) {
        if (monthlyDataService.days[day.dayString] &&
            monthlyDataService.days[day.dayString].targetTimeInPercentageOfDay &&
            monthlyDataService.days[day.dayString].targetTimeInPercentageOfDay ===
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

    function getDescFromFavorites(task) {
        configService.favoriteItems.some(function(favoriteItem){
            if (catsUtils.isSameTask(task, favoriteItem)) {
                task.DESCR = favoriteItem.DESCR;
                return true;
            }
        });
    }
        
    function displayCATSDataForDay(day) {
        try {
            $scope.lastCatsAllocationDataForDay = day;
            $scope.blockdata = [];
            $scope.hintText = "";
            if(day.targetTimeInPercentageOfDay) {
                //$scope.hintText = "Allocation bar represents the data form the backend for the " + day.dayString;
                $scope.totalWorkingTime = 1;
            } else {
                //$scope.hintText = "No maintenance possible for the " + day.dayString;
                $scope.totalWorkingTime = 0;
            }

            for (var i = 0; i < day.tasks.length; i++) {
                var task = day.tasks[i];
                getDescFromFavorites(task);

                var HoursOfWorkingDay = 8;

                var isFixedTask = catsUtils.isFixedTask(task);

                if (task.TASKTYPE === "VACA") {
                    addBlock("Vacation", task.QUANTITY / HoursOfWorkingDay, task, isFixedTask);
                } else if (task.TASKTYPE === "ABSE") {
                    addBlock("Absence", task.QUANTITY / HoursOfWorkingDay, task, isFixedTask);
                } else if (task.UNIT === "H") {
                    addBlock(task.DESCR || task.TASKTYPE, task.QUANTITY / HoursOfWorkingDay, task, isFixedTask);
                } else {
                    addBlock(task.DESCR || task.TASKTYPE, task.QUANTITY, task, isFixedTask);
                }
            }
            checkAndCorrectPartTimeInconsistancies(day);
            if(monthlyDataService.days[day.dayString].targetTimeInPercentageOfDay !== 0 &&
               monthlyDataService.days[day.dayString].targetTimeInPercentageOfDay !== 1 ) {
                $scope.hintText = "Part time info: All entries will be scaled so that 100% are reflecting your personal target hours for each day.";
            }

            if(monthlyDataService.days[day.dayString].actualTimeInPercentageOfDay > monthlyDataService.days[day.dayString].targetTimeInPercentageOfDay) {
                var actualHours = Math.round(monthlyDataService.days[day.dayString].actualTimeInPercentageOfDay * 100 * 8) / 100;
                var targetHours = Math.round(monthlyDataService.days[day.dayString].targetTimeInPercentageOfDay * 100 * 8) / 100;
                $scope.hintText = "Part time info: All overbooked entries will be ADJUSTED so that 100% are reflecting your personal target hours for each day.";
                bridgeInBrowserNotification.addAlert('danger', "The date '" + day.dayString + "' is overbooked! Actual hours are '" +
                    actualHours + "'' but target hours are only '" +
                    targetHours + "'!");
            }
        } catch(err) {
            console.log("displayCATSDataForDay(): " + err);
        }
    }

    function loadCATSDataForDay(dayString) {
        try {
            if(!dayString && monthlyDataService.lastSingleClickDayString){
                dayString = monthlyDataService.lastSingleClickDayString;
            }
            else if (!dayString)
            {
                $scope.loaded = true;
                return;
            }

            var promise = monthlyDataService.getDataForDate(dayString);
            promise.then(function() {
                displayCATSDataForDay(monthlyDataService.days[dayString]);
                $scope.loaded = true;
            });
        } catch(err) {
            console.log("loadCATSDataForDay(): " + err);
            $scope.loaded = true;
        }
    }

    loadCATSDataForDay();

    $scope.handleProjectChecked = function (desc_s, val_i, task) {
        var block = {
            RAUFNR: task.RAUFNR,
            COUNTER: 0,
            WORKDATE: "", //that shall be decided later ...
            STATUS: 30,
            TASKTYPE: task.TASKTYPE,
            ZCPR_EXTID: task.ZCPR_EXTID,
            ZCPR_OBJGEXTID: task.ZCPR_OBJGEXTID,
            UNIT: "T"
        };
        // configService.updateTaskIfFavorite(block);
        
        var blockCouldBeAdded = addBlock(desc_s, val_i, block, false); // false is the "fixed" parameter
        if (blockCouldBeAdded === false) {
            if (!$scope.selectedDates || $scope.selectedDates.length === 0) {
                bridgeInBrowserNotification.addAlert('','Please select a day or multiple days in the calendar first');
            } else {
                bridgeInBrowserNotification.addAlert('','No maintenance possible for the selected day');
            }
        }
        return blockCouldBeAdded;
    };

    $scope.handleProjectUnchecked = function (task) {
        removeBlock(task);
    };

    $scope.updateHintText = function(hintText){
        $scope.hintText = hintText;
    };

    $scope.selectionCompleted = function() {
        try {
            if($scope.selectedDates.length === 0) { // Nothing selected
                $scope.blockdata = [];
                $scope.totalWorkingTime = 0;
            } else if($scope.selectedDates.length === 1) { // Single day
                loadCATSDataForDay($scope.selectedDates[0]);
            } else { // Range selected
                $scope.totalWorkingTime = 1;
            }
        } catch(err) {
            console.log("selectionCompleted(): " + err);
        }
    };

    $scope.handleSelectedDate = function(dayString){
        if($scope.selectedDates.indexOf(dayString) === -1) {
            $scope.selectedDates.push(dayString);
        }
        return true;
    };

    $scope.handleDeselectedDate = function(dayString){
        var dateIndex = $scope.selectedDates.indexOf(dayString);
        $scope.selectedDates.splice(dateIndex, 1);
        return true;
    };

    function checkPostReply(data) {
        try {
            var parser;
            var xmlDoc;
            if (window.DOMParser) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(data, "text/xml");
            } else { // Internet Explorer
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(data);
            }
            var replyHasMessages = false;
            for (var i = 0; i < 5; i++) {
                var message = xmlDoc.getElementsByTagName("TEXT")[i];
                if (message) {
                    replyHasMessages = true;
                    if (message.childNodes[0].nodeValue === "You are not authorized to perform cross-company CO postings") {
                        bridgeInBrowserNotification.addAlert('danger', "Some of the tasks can not be posted in Bridge. The issue will be fixed soon - please stay tuned.");
                    } else {
                        bridgeInBrowserNotification.addAlert('danger', message.childNodes[0].nodeValue);
                    }
                }
            }
            if (!replyHasMessages) {
                bridgeInBrowserNotification.addAlert('info', 'Well done! Data was saved successfully');
            }
        } catch(err) {
            console.log("checkPostReply(): " + err);
        }
    }

    function prepareCATSData (workdate, container, clearOldTasks){
        var workdateBookings = [];
        var totalWorkingTimeForDay = monthlyDataService.days[workdate].targetTimeInPercentageOfDay;

        if(!totalWorkingTimeForDay) {
            bridgeInBrowserNotification.addAlert('info','Nothing to submit as target hours are 0');
            loadCATSDataForDay();
            $scope.$emit("refreshApp");
            return null;
        }

        if (clearOldTasks) {
            monthlyDataService.days[workdate].tasks.forEach(function(task){
                if (task.QUANTITY === 0 ||
                    task.TASKTYPE === "VACA" ||
                    task.TASKTYPE === "ABSE" ||
                    task.TASKTYPE === "COMP") { 
                    return null;
                }
                var taskDeletion = angular.copy(task);
                taskDeletion.WORKDATE = workdate || task.WORKDATE;
                taskDeletion.QUANTITY = 0;

                container.BOOKINGS.push(taskDeletion);
            });
        }

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
                    if (oldTasks[j].RAUFNR === booking.RAUFNR
                        && !clearOldTasks) {
                        workdateBookings.push(booking);
                        break;
                    }
                }
            }
        }

        // adjust slight deviations in QUANTITY when posting part time
        var totalBookingQuantity = 0;
        var biggestBooking;
        workdateBookings.forEach(function(booking){
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

        container.BOOKINGS = container.BOOKINGS.concat(workdateBookings);
        monthlyDataService.days[workdate].tasks = workdateBookings;
        return container;
    }

    $scope.saveTimesheet = function(){
        var clearOldTasks = false;
        var weeks = [];
        var container = {
            BOOKINGS: []
        };

        var selectedDates = $scope.selectedDates;
        $scope.selectedDates = [];
        selectedDates.forEach(function(dateString){
            if($scope.selectedDates.indexOf(dateString) === -1) {
                $scope.selectedDates.push(dateString);
            } else {
                console.log("The selectedDates array had double entries! Please check selection functionality.");
            }
        });

        if ($scope.selectedDates.length > 1) {
            clearOldTasks = true;
        }

        try {
            $scope.selectedDates.forEach(function(dateString){
                container = prepareCATSData(dateString, container, clearOldTasks);

                var day = monthlyDataService.days[dateString];
                if (weeks.indexOf(day.year + '.' + day.week) === -1) {
                    weeks.push(day.year + '.' + day.week);
                }
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
        } catch(err) {
            console.log("saveTimesheet(): " + err);
        }
    };
}
]).filter("weekday", ["lib.utils.calUtils", function (calUtils) {
    return function (day, format) { //format: 0=short, 1=medium, 2=long (default)
        return calUtils.getWeekday(day, format);
    };
}]);