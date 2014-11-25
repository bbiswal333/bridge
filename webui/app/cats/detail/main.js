angular.module("app.cats.maintenanceView", ["app.cats.allocationBar", "ngRoute", "lib.utils", "app.cats.dataModule", "app.cats.utilsModule", "ui.bootstrap.modal", "app.cats"]).controller("app.cats.maintenanceView.mainCntrl", [
  "$scope",
  "$q",
  "$log",
  "$routeParams",
  "$location",
  "lib.utils.calUtils",
  "app.cats.cat2BackendZDEVDB",
  "app.cats.catsUtils",
  "$http",
  "$interval",
  "$window",
  "bridgeInBrowserNotification",
  "app.cats.monthlyData",
  "app.cats.configService",
  "bridgeDataService",
  function ($scope, $q, $log, $routeParams, $location, calUtils, catsBackend, catsUtils, $http, $interval, $window, bridgeInBrowserNotification, monthlyDataService, configService, bridgeDataService) {

    $scope.blockdata = [];
    $scope.blockdataTemplate = [];
    $scope.loaded = false;
    $scope.width = $window.document.getElementById('app-cats-maintencance-allocation-div').offsetWidth;
    $scope.selectedDates = [];
    $scope.totalSelectedHours = 0;
    $scope.totalWorkingTime = 0;
    $scope.hintText = "";
    $scope.analytics = false;
    // var lastSelectedDaysLength = 0;

    var catsConfigService = bridgeDataService.getAppConfigByModuleName('app.cats');
    configService.copyConfigIfLoaded(catsConfigService);

    function adjustBarSize() {
        $scope.$apply(function(){
            $scope.width = $window.document.getElementById('app-cats-maintencance-allocation-div').offsetWidth;
            if ($scope.width > 600) {
                $scope.width = 600;
            }
            $scope.width = parseInt(Math.round($scope.width / 10) * 10 || 600);
        });
    }
    /* eslint-disable no-undef */
    $(window).resize(adjustBarSize);
    $scope.$on("$destroy", function(){
        $(window).off('resize', adjustBarSize);
    });
    /* eslint-enable no-undef */

    function timeToMaintain() {
        try {
            var sum = 0;
            for (var i = 0; i < $scope.blockdata.length; i++) {
                sum = catsUtils.cat2CompliantRounding(sum + $scope.blockdata[i].value);
            }
            return $scope.totalWorkingTime - sum;
        } catch(err) {
            $log.log("timeToMaintain(): " + err);
            return $scope.totalWorkingTime;
        }
    }

    function dayCanBeMaintained() {
        try {
            var sum = 0;
            for (var i = 0; i < $scope.blockdata.length; i++) {
                if ($scope.blockdata[i].fixed) {
                    sum = sum + $scope.blockdata[i].value;
                }
            }
            if (($scope.totalWorkingTime - sum) > 0) {
                return true;
            } else {
                return false;
            }
        } catch(err) {
            $log.log("dayCanBeMaintained(): " + err);
            return $scope.totalWorkingTime;
        }
    }

    function addToTotalSelectedHours(dayString) {
        $scope.totalSelectedHours = $scope.totalSelectedHours + monthlyDataService.days[dayString].targetHours;
    }

    function substractFromTotalSelectedHours(dayString) {
        $scope.totalSelectedHours = $scope.totalSelectedHours - monthlyDataService.days[dayString].targetHours;
    }

    $scope.calcMinutes = function (perc) {
        $log.log(perc);
        return calUtils.getTimeInWords((8 * 60) * (perc / 100), true) + " (" + Math.round(perc) + " %)";
    };

    function getBlock(block) {
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if (catsUtils.isSameTask(block, $scope.blockdata[i].task)) {
                return $scope.blockdata[i];
            }
        }
        return null;
    }

    function adjustBarToAllowForOneMoreBlock() {
        // only adjust if all space is taken
        var totalOfAdjustableTasks = 0;
        var spaceWhichIsAdjustable = $scope.totalWorkingTime;
        var adjustableLength = 0;
        var i = 0;
        try {
            for (i = 0; i < $scope.blockdata.length; i++) {
                if ($scope.blockdata[i].value) {
                    $scope.blockdata[i].value = catsUtils.cat2CompliantRounding($scope.blockdata[i].value);
                    if ($scope.blockdata[i].fixed) {
                        spaceWhichIsAdjustable = spaceWhichIsAdjustable - $scope.blockdata[i].value;
                    } else {
                        totalOfAdjustableTasks = totalOfAdjustableTasks + $scope.blockdata[i].value;
                        adjustableLength++;
                    }
                    totalOfAdjustableTasks = catsUtils.cat2CompliantRounding(totalOfAdjustableTasks);
                }
            }
            var remainingSpaceInPercent = 0;
            if (spaceWhichIsAdjustable) {
                remainingSpaceInPercent = Math.round((1 - ($scope.totalWorkingTime / spaceWhichIsAdjustable * totalOfAdjustableTasks / spaceWhichIsAdjustable)) * 1000000) / 1000000;
            }
            if (totalOfAdjustableTasks !== spaceWhichIsAdjustable &&
                (remainingSpaceInPercent === 0 ||
                 remainingSpaceInPercent >=  0.01)) {
                return;
            }
            for (i = 0; i < $scope.blockdata.length; i++) {
                if ($scope.blockdata[i].value && !$scope.blockdata[i].fixed) {
                    $scope.blockdata[i].value = catsUtils.cat2CompliantRounding(spaceWhichIsAdjustable * (Math.floor(1000 / (adjustableLength + 1)) / 1000));
                }
            }
        } catch(err) {
            $log.log("adjustBarToAllowForOneMoreBlock(): " + err);
        }
    }

    function addBlock(desc_s, val_i, block, fixed) {
        try {
            // Scale data which is read from backend BUT only if it is not OVERBOOKED
            if (block.COUNTER && // already in backend
                monthlyDataService.days[block.WORKDATE] &&
                monthlyDataService.days[block.WORKDATE].targetTimeInPercentageOfDay >=
                monthlyDataService.days[block.WORKDATE].actualTimeInPercentageOfDay) {

                val_i = catsUtils.cat2CompliantRounding(val_i / monthlyDataService.days[block.WORKDATE].targetTimeInPercentageOfDay);
            }

            var existingBlock = getBlock(block);
            if (existingBlock != null) {
                if (!existingBlock.value) { // that is a "deleted" block which is required to be sent to backend
                    adjustBarToAllowForOneMoreBlock();
                    existingBlock.value = catsUtils.cat2CompliantRounding(timeToMaintain());
                    return true;
                } else { // no need to add
                    return false;
                }
            }

            if (val_i == null) {
                adjustBarToAllowForOneMoreBlock();
                val_i = 1;
                if (val_i > timeToMaintain()) {
                    val_i = catsUtils.cat2CompliantRounding(timeToMaintain());
                }
            }

            if (val_i) { // val_i could be 0 e.g. in case of vacation or weekends or not selected
                if (fixed === true) {
                    $scope.blockdata.unshift({ // fixed tasks first!
                        desc: desc_s,
                        value: val_i,
                        task: block,
                        fixed: fixed || false
                    });
                } else {
                    $scope.blockdata.push({
                        desc: desc_s,
                        value: val_i,
                        task: block,
                        fixed: fixed || false
                    });
                }

                if (timeToMaintain() < 0) {
                    bridgeInBrowserNotification.addAlert('','The day is overbooked. Please remove or adjust tasks and apply changes.');
                }

                return true;
            } else {
                return false;
            }
        } catch(err) {
            $log.log("addBlock(): " + err);
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
            $log.log("removeBlock(): " + err);
        }
    }

    function checkAndCorrectPartTimeInconsistancies(day) {
        if (day &&
            day.targetTimeInPercentageOfDay &&
            day.targetTimeInPercentageOfDay ===
            day.actualTimeInPercentageOfDay) {

            // adjust slight deviations in QUANTITY when posting part time
            var totalBlockValue = 0;
            var biggestBlock;
            $scope.blockdata.forEach(function(block){
                if(!biggestBlock || biggestBlock.value <= block.value) {
                    biggestBlock = block;
                }
                totalBlockValue += block.value;
            });
            totalBlockValue = catsUtils.cat2CompliantRounding(totalBlockValue);
            var blockDif = totalBlockValue - 1;
            if((blockDif > 0 && blockDif < 0.03) ||
               (blockDif < 0 && blockDif > -0.03)) {
                biggestBlock.value -= blockDif;
                biggestBlock.value = catsUtils.cat2CompliantRounding(biggestBlock.value);
            }
        }
    }

    function displayCATSDataForDay(day) {
        try {
            $scope.lastCatsAllocationDataForDay = day;
            $scope.blockdata = [];
            $scope.hintText = "";

            if(day.targetTimeInPercentageOfDay) {
                $scope.totalWorkingTime = 1;
            } else {
                $scope.totalWorkingTime = 0;
            }

            for (var i = 0; i < day.tasks.length; i++) {
                var task = day.tasks[i];
                var isFixedTask = catsUtils.isFixedTask(task);
                configService.updateDescription(task);

                if (task.TASKTYPE === "VACA") {
                    if (task.UNIT === "H") {
                        task.DESCR = "Vacation";
                    } else {
                        task.DESCR = "Vacation (changeable)";
                    }
                }
                if (task.TASKTYPE === "ABSE") {
                    if (task.UNIT === "H") {
                        task.DESCR = "Absence";
                    } else {
                        task.DESCR = "Absence (changeable)";
                    }
                }

                if (task.UNIT === "H") {
                    addBlock(task.DESCR || task.ZCPR_OBJGEXTID || task.TASKTYPE, catsUtils.cat2CompliantRounding(task.QUANTITY / day.hoursOfWorkingDay), task, isFixedTask);
                } else {
                    addBlock(task.DESCR || task.ZCPR_OBJGEXTID || task.TASKTYPE, task.QUANTITY, task, isFixedTask);
                }
            }

            checkAndCorrectPartTimeInconsistancies(day);
            if(day.targetTimeInPercentageOfDay !== 0 &&
               day.targetTimeInPercentageOfDay !== 1 ) {
                if(day.actualTimeInPercentageOfDay > day.targetTimeInPercentageOfDay) {
                    $scope.hintText = "All overbooked entries will be ADJUSTED so that 100% are reflecting your personal target hours. Please apply changes.";
                } else {
                    $scope.hintText = "All entries will be scaled so that 100% are reflecting your personal target hours.";
                }
            }

            if(day.actualTimeInPercentageOfDay > day.targetTimeInPercentageOfDay) {
                var actualHours = Math.round(day.actualTimeInPercentageOfDay * 100 * day.hoursOfWorkingDay) / 100;
                var targetHours = Math.round(day.targetTimeInPercentageOfDay * 100 * day.hoursOfWorkingDay) / 100;
                bridgeInBrowserNotification.addAlert('danger', "The date '" + day.dayString + "' is overbooked! Actual hours are '" +
                    actualHours + "'' but target hours are only '" +
                    targetHours + "'!");
            }
        } catch(err) {
            $log.log("displayCATSDataForDay(): " + err);
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
            promise
            .then(function() {
                displayCATSDataForDay(monthlyDataService.days[dayString]);
                $scope.loaded = true;
                monthlyDataService.reloadInProgress.value = false;
            }, function() {
                $scope.loaded = true;
                monthlyDataService.reloadInProgress.value = false;
            });
        } catch(err) {
            $log.log("loadCATSDataForDay(): " + err);
            $scope.loaded = true;
            monthlyDataService.reloadInProgress.value = false;
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
            ZZSUBTYPE: task.ZZSUBTYPE,
            UNIT: task.UNIT || "T"
        };

        var blockCouldBeAdded = false;
        if (dayCanBeMaintained()) {
            blockCouldBeAdded = addBlock(desc_s, val_i, block, false); // false is the "fixed" parameter
        }
        if (blockCouldBeAdded === false) {
            if (!$scope.selectedDates || $scope.selectedDates.length === 0) {
                bridgeInBrowserNotification.addAlert('','Please select one or multiple days in the calendar first.');
            } else {
                bridgeInBrowserNotification.addAlert('','No maintenance possible for the selected day.');
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
                $scope.totalSelectedHours = 0;
            } else if($scope.selectedDates.length === 1) { // Single day
                loadCATSDataForDay($scope.selectedDates[0]);
            } else { // Range selected
                // if (lastSelectedDaysLength === 1) {
                    // $scope.blockdata = []; // One potential step for new templating functionality
                // }
                $scope.totalWorkingTime = 1;
            }
        } catch(err) {
            $log.log("selectionCompleted(): " + err);
        }
        // lastSelectedDaysLength = $scope.selectedDates.length;
    };

    $scope.handleSelectedDate = function(dayString){
        if($scope.selectedDates.indexOf(dayString) === -1) {
            $scope.selectedDates.push(dayString);
            addToTotalSelectedHours(dayString);
        }
        return true;
    };

    $scope.handleDeselectedDate = function(dayString){
        var dateIndex = $scope.selectedDates.indexOf(dayString);
        $scope.selectedDates.splice(dateIndex, 1);
        substractFromTotalSelectedHours(dayString);
        return true;
    };

    function checkPostReply(data) {
        try {
            var parser;
            var xmlDoc;
            if ($window.DOMParser) {
                parser = new $window.DOMParser();
                xmlDoc = parser.parseFromString(data, "text/xml");
            } else { // Internet Explorer
                /*eslint-disable no-undef*/
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                /*eslint-enable no-undef*/
                xmlDoc.async = false;
                xmlDoc.loadXML(data);
            }
            var replyMessages = [];
            var weAreDone = false;
            var alertDuration = 5;
            var maxMessageCount = 5;
            for (var i = 0; weAreDone === false; i++) {
                var message = xmlDoc.getElementsByTagName("TEXT")[i];
                if (message) {
                    if (!_.contains(replyMessages, message.childNodes[0].nodeValue)) {
                        replyMessages.push(message.childNodes[0].nodeValue);
                        if (replyMessages.length <= maxMessageCount) {
                            if(message.childNodes[0].nodeValue.indexOf('Unit TA not permitted with an attendance or absence') !== -1) {
                                bridgeInBrowserNotification.addAlert('danger', 'CAT2 maintenance is not required for your user.',alertDuration);
                            } else {
                                bridgeInBrowserNotification.addAlert('danger', message.childNodes[0].nodeValue,alertDuration);
                            }
                        }
                    }
                } else {
                    weAreDone = true;
                }
            }
            if (replyMessages.length > maxMessageCount) {
                var additionalMessagesCount = replyMessages.length - maxMessageCount;
                if (additionalMessagesCount === 1) {
                    bridgeInBrowserNotification.addAlert('danger', 'There is ' + additionalMessagesCount + ' more error message.',alertDuration);
                } else {
                    bridgeInBrowserNotification.addAlert('danger', 'There are ' + additionalMessagesCount + ' more error messages.',alertDuration);
                }
            }
            if (!replyMessages.length) {
                bridgeInBrowserNotification.addAlert('info', 'Data was saved successfully.');
            }
        } catch(err) {
            $log.log("checkPostReply(): " + err);
        }
    }

    function prepareCATSData (workdate, container, clearOldTasks){
        var workdateBookings = [];
        var totalWorkingTimeForDay = monthlyDataService.days[workdate].targetTimeInPercentageOfDay;

        if(!totalWorkingTimeForDay) {
            bridgeInBrowserNotification.addAlert('info','Nothing to submit as target hours are 0.');
            loadCATSDataForDay();
            $scope.$emit("refreshApp");
            return null;
        }

        if (clearOldTasks) {
            monthlyDataService.days[workdate].tasks.forEach(function(task){
                if (task.QUANTITY === 0 || catsUtils.isFixedTask(task)) {
                    return null;
                }
                var taskDeletion = angular.copy(task);
                taskDeletion.WORKDATE = workdate || task.WORKDATE;
                taskDeletion.CATSQUANTITY = 0;
                delete taskDeletion.QUANTITY;

                container.BOOKINGS.push(taskDeletion);
            });
        }

        for(var i = 0; i < $scope.blockdata.length; i++) {

            var booking = angular.copy($scope.blockdata[i].task);
            booking.WORKDATE = workdate || $scope.blockdata[i].task.WORKDATE;

            booking.CATSQUANTITY = catsUtils.cat2CompliantRounding($scope.blockdata[i].value * totalWorkingTimeForDay);
            delete booking.QUANTITY;

            if (catsUtils.isFixedTask(booking)){
                continue;
            }

            if (booking.TASKTYPE === booking.ZCPR_OBJGEXTID) { //cleanup temporary data
                booking.ZCPR_OBJGEXTID = null;
            }

            if (clearOldTasks) {
                booking.COUNTER = 0;
            }
            if (booking.CATSQUANTITY) { // book time > 0
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
            if(!biggestBooking || biggestBooking.CATSQUANTITY <= booking.CATSQUANTITY) {
                biggestBooking = booking;
            }
            totalBookingQuantity += booking.CATSQUANTITY;
        });
        totalBookingQuantity = catsUtils.cat2CompliantRounding(totalBookingQuantity);
        var bookingDif = totalBookingQuantity - totalWorkingTimeForDay;
        if((bookingDif > 0 && bookingDif < 0.03) ||
           (bookingDif < 0 && bookingDif > -0.03)) {
            biggestBooking.CATSQUANTITY -= bookingDif;
            biggestBooking.CATSQUANTITY = catsUtils.cat2CompliantRounding(biggestBooking.CATSQUANTITY);
        }

        container.BOOKINGS = container.BOOKINGS.concat(workdateBookings);
        monthlyDataService.days[workdate].tasks = workdateBookings;
        return container;
    }

    $scope.checkThatContainsNoFixedTasksForTemplate = function() {
        for (var i = 0; i < $scope.blockdata.length; i++) {
            if ($scope.blockdata[i].fixed) {
                return false;
            }
        }
        for (i = 0; i < $scope.blockdataTemplate.length; i++) {
            if ($scope.blockdataTemplate[i].fixed) {
                return false;
            }
        }
        return true;
    };

    $scope.copyTemplate = function(){
        $scope.blockdataTemplate = angular.copy($scope.blockdata);
    };

    $scope.pasteTemplate = function(){
        $scope.blockdata = angular.copy($scope.blockdataTemplate);
    };

    $scope.saveTimesheet = function(){
        var clearOldTasks = false;
        var weeks = [];
        var container = {
            BOOKINGS: []
        };

        var selectedDates = $scope.selectedDates;
        $scope.selectedDates = [];
        $scope.totalSelectedHours = 0;

        selectedDates.forEach(function(dayString){
            if($scope.selectedDates.indexOf(dayString) === -1) {
                $scope.selectedDates.push(dayString);
                addToTotalSelectedHours(dayString);
            } else {
                $log.log("The selectedDates array had double entries! Please check selection functionality.");
            }
        });

        if ($scope.selectedDates.length > 1) {
            clearOldTasks = true;
        }

        try {
            $scope.selectedDates.forEach(function(dayString){
                container = prepareCATSData(dayString, container, clearOldTasks);

                var day = monthlyDataService.days[dayString];
                if (weeks.indexOf(day.year + '.' + day.week) === -1) {
                    weeks.push(day.year + '.' + day.week);
                }
            });

            if (container.BOOKINGS.length) {
                monthlyDataService.reloadInProgress.value = true;
                $scope.reloadInProgress = monthlyDataService.reloadInProgress;

                catsBackend.writeCATSData(container).then(function(data){
                    checkPostReply(data);
                    $scope.$emit("refreshApp"); // this must be done before loadDataForSelectedWeeks() for performance reasons
                    monthlyDataService.loadDataForSelectedWeeks(weeks).then(function(){
                        loadCATSDataForDay();
                    });
                }, function(status){
                    bridgeInBrowserNotification.addAlert('', "POST-Request to write CATS data failed. HTTP-Status: " + status + ".");
                    $scope.$emit("refreshApp"); // this must be done before loadDataForSelectedWeeks() for performance reasons
                    monthlyDataService.loadDataForSelectedWeeks(weeks).then(function(){
                        loadCATSDataForDay();
                    });
                });
            } else {
                bridgeInBrowserNotification.addAlert('info', "No changes recognized. No update required.");
            }
        } catch(err) {
            $log.log("saveTimesheet(): " + err);
        }
    };
}
]).filter("weekday", ["lib.utils.calUtils", function (calUtils) {
    return function (day, format) { //format: 0=short, 1=medium, 2=long (default)
        return calUtils.getWeekday(day, format);
    };
}]);
