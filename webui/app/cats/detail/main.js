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
    $scope.blockdataRemembered = null;
    $scope.blockdataTemplate = [];
    $scope.loaded = false;
    $scope.width = $window.document.getElementById('app-cats-maintencance-allocation-div').offsetWidth;
    $scope.selectedDates = [];
    $scope.totalSelectedHours = 0;
    $scope.totalWorkingTime = 0;
    $scope.hintText = "";
    $scope.analytics = false;

    var catsConfigService = bridgeDataService.getAppConfigById("app.cats-1");
    configService.copyConfigIfLoaded(catsConfigService);

    function adjustBarSize() {
        $scope.$apply(function(){
            $scope.width = $window.document.getElementById('app-cats-maintencance-allocation-div').offsetWidth;
            if ($scope.width > 1111) {
                $scope.width = 1111;
            }
            $scope.width = parseInt($scope.width || 1111);
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
            if (block.COUNTER) {
                if (block.QUANTITY_DAY) { // if explicit day value is present...
                    val_i = block.QUANTITY_DAY;
                } else {
                    if (monthlyDataService.days[block.WORKDATE] &&
                        monthlyDataService.days[block.WORKDATE].targetTimeInPercentageOfDay >=
                        monthlyDataService.days[block.WORKDATE].actualTimeInPercentageOfDay) {
                    val_i = catsUtils.cat2CompliantRounding(val_i / monthlyDataService.days[block.WORKDATE].targetTimeInPercentageOfDay);
                    }
                }
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
                    if (catsUtils.isFixedTask($scope.blockdata[i].task)) {
                        bridgeInBrowserNotification.addAlert('danger','That task is not a regular CAT2 task and can not be removed.');
                        return;
                    } else if ($scope.blockdata[i].task.COUNTER) {
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

    function checkGracePeriods(dayString) {
        var dateToCheck = new Date(dayString.substr(0,4),dayString.substr(5,2) - 1,dayString.substr(8,2),12);
        if (catsBackend.gracePeriodInMonth > 0) {
            var gracePeriodLimitDate = new Date();
            gracePeriodLimitDate.setMonth(gracePeriodLimitDate.getMonth() - (catsBackend.gracePeriodInMonth));
            if (dateToCheck < gracePeriodLimitDate) {
                bridgeInBrowserNotification.addAlert('danger', "According to the grace period days shall NOT be maintained which are more the " + catsBackend.gracePeriodInMonth + " month in the past.");
            }
        }
        if (catsBackend.futureGracePeriodInDays > 0) {
            var futureGracePeriodLimitDate = new Date();
            futureGracePeriodLimitDate.setDate(futureGracePeriodLimitDate.getDate() + catsBackend.futureGracePeriodInDays);
            if (dateToCheck > futureGracePeriodLimitDate) {
                bridgeInBrowserNotification.addAlert('danger', "According to the futur grace period days shall NOT be maintained which are more the " + catsBackend.futureGracePeriodInDays + " days in the future.");
            }
        }
    }

    $scope.isValidProfile = function(){
        return catsUtils.isValidProfile(catsBackend.catsProfile);
    };

    function displayCATSDataForDay(day) {
        try {
            if(!$scope.isValidProfile()){
                bridgeInBrowserNotification.addAlert('danger', "The CAT2 Profile " + catsBackend.catsProfile + " is not supported by Bridge.");
            }
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
                // Some rounding here prevents problems for rounding issues of many hourly tasks
                if(Math.round(day.actualTimeInPercentageOfDay * 100 / 100) >
                   Math.round(day.targetTimeInPercentageOfDay * 100 / 100)) {
                    $scope.hintText = "All overbooked entries will be ADJUSTED so that 100% are reflecting your personal target hours. Please apply changes.";
                } else {
                    $scope.hintText = "All entries will be scaled so that 100% are reflecting your personal target hours.";
                }
            }

            $scope.blockdataRemembered = angular.copy($scope.blockdata);

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
                catsBackend.CAT2ComplinaceDataPromise
                .then(function() {
                    $scope.loaded = true;
                    monthlyDataService.reloadInProgress.value = false;
                });
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
        if (!task.UNIT) {
            if (catsUtils.isHourlyProfil(catsBackend.catsProfile) === true) {
                task.UNIT = "H";
            } else {
                task.UNIT = "T";
            }
        }
        var block = {
            RAUFNR: task.RAUFNR,
            COUNTER: 0,
            WORKDATE: "", //that shall be decided later ...
            STATUS: 30,
            TASKTYPE: task.TASKTYPE,
            ZCPR_EXTID: task.ZCPR_EXTID,
            ZCPR_OBJGEXTID: task.ZCPR_OBJGEXTID,
            ZZSUBTYPE: task.ZZSUBTYPE,
            UNIT: task.UNIT
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

    function blockdataHasChanged() {
        if ($scope.blockdataRemembered === null) { // first selection, no check possible
            return false;
        } else if ($scope.blockdataRemembered.length !== $scope.blockdata.length) { // apparently some block added
            return true;
        } else if ($scope.blockdata.length > 0 &&
                   $scope.blockdataRemembered.length === $scope.blockdata.length) {
            for (var i = 0; i < $scope.blockdata.length; i++) {
                if($scope.blockdata[i].value !== $scope.blockdataRemembered[i].value) {
                    return true;
                }
            }
        }
        return false;
    }

    function removeFixedTasksFromBlockdata() {
        var i = 0;
        while (i < $scope.blockdata.length) {
            if (catsUtils.isFixedTask($scope.blockdata[i].task)) {
                // do not removeBlock() here, since it is not meant to be removed in the backend!
                $scope.blockdata.splice(i,1);
            }
            i++;
        }
    }

    $scope.selectionCompleted = function() {
        try {
            if ($scope.selectedDates.length <= 1 &&
                blockdataHasChanged()) {
                bridgeInBrowserNotification.addAlert('', 'New to CAT2 activity recording with Bridge? Please see <a href="https://github.wdf.sap.corp/bridge/bridge/wiki/CAT2-get-started" target="_blank">GET STARTED PAGE</a> for further details.');
            }
            angular.forEach($scope.selectedDates, function(dayString) {
                checkGracePeriods(dayString);
            });
            if($scope.selectedDates.length === 0) { // Nothing selected
                $scope.blockdata = [];
                $scope.totalWorkingTime = 0;
                $scope.totalSelectedHours = 0;
            } else if($scope.selectedDates.length === 1) { // Single day
                loadCATSDataForDay($scope.selectedDates[0]);
            } else { // Range selected
                removeFixedTasksFromBlockdata();
                $scope.totalWorkingTime = 1;
            }
            $scope.blockdataRemembered = angular.copy($scope.blockdata);
        } catch(err) {
            $log.log("selectionCompleted(): " + err);
        }
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
            var replyMessages = [];
            var maxMessageCount = 5;
            for (var i = 0; i < data.CHECKMESSAGES.length; i++) {
                if (!_.contains(replyMessages, data.CHECKMESSAGES[i].TEXT)) {
                    replyMessages.push(data.CHECKMESSAGES[i].TEXT);
                    if (replyMessages.length <= maxMessageCount) {
                        bridgeInBrowserNotification.addAlert('danger', data.CHECKMESSAGES[i].TEXT);
                    }
                }
            }
            if (replyMessages.length > maxMessageCount) {
                var additionalMessagesCount = replyMessages.length - maxMessageCount;
                if (additionalMessagesCount === 1) {
                    bridgeInBrowserNotification.addAlert('danger', 'There is ' + additionalMessagesCount + ' more error message.');
                } else {
                    bridgeInBrowserNotification.addAlert('danger', 'There are ' + additionalMessagesCount + ' more error messages.');
                }
            }
            if (!replyMessages.length) {
                bridgeInBrowserNotification.addAlert('info', 'Data was saved successfully.');
            }
        } catch(err) {
            $log.log("checkPostReply(): " + err);
        }
    }

    function prepareCATSData (workdate, container, lengthOfSelectedDatesArray){
        var workdateBookings = [];
        var unchangedBookings = [];
        var totalWorkingTimeForDay = monthlyDataService.days[workdate].targetTimeInPercentageOfDay;
        if (totalWorkingTimeForDay > 1) { // special case for french part time contract with 8.2 hours per day
            totalWorkingTimeForDay = 1;
        }
        var targetHoursForDay      = monthlyDataService.days[workdate].targetHours;
        var tasksInBackend         = monthlyDataService.days[workdate].tasks;

        if(!totalWorkingTimeForDay) {
            bridgeInBrowserNotification.addAlert('info','Nothing to submit as target hours are 0.');
            loadCATSDataForDay();
            $scope.$emit("refreshApp");
            return null;
        }

        var originalTotalWorkingTimeForDay = totalWorkingTimeForDay;
        for(var j = 0; j < tasksInBackend.length; j++) {
            if (catsUtils.isFixedTask(tasksInBackend[j])) {
                unchangedBookings.push(tasksInBackend[j]);

                if (lengthOfSelectedDatesArray > 1) {
                    if (tasksInBackend[j].UNIT === "H" && targetHoursForDay) {
                        targetHoursForDay = targetHoursForDay - tasksInBackend[j].QUANTITY;
                    } else {
                        // use originalTotalWorkingTimeForDay for calculations from Day to Hours
                        targetHoursForDay = targetHoursForDay - catsUtils.cat2CompliantRounding(tasksInBackend[j].QUANTITY * originalTotalWorkingTimeForDay);
                    }
                    totalWorkingTimeForDay = totalWorkingTimeForDay - tasksInBackend[j].QUANTITY_DAY;
                }

                continue;
            }
        }

        for(var i = 0; i < $scope.blockdata.length; i++) {

            var booking = angular.copy($scope.blockdata[i].task);
            var taskInBackend = _.find(tasksInBackend, {
                "ZCPR_OBJGEXTID": booking.ZCPR_OBJGEXTID,
                "RAUFNR": booking.RAUFNR,
                "TASKTYPE": booking.TASKTYPE,
                "ZZSUBTYPE": booking.ZZSUBTYPE });

            if (taskInBackend && taskInBackend.COUNTER) {
                booking.COUNTER = taskInBackend.COUNTER;
            } else {
                booking.COUNTER = 0;
            }

            if (catsUtils.isFixedTask(booking) || (taskInBackend && catsUtils.isFixedTask(taskInBackend))) {
                continue;
            }

            booking.WORKDATE = workdate;
            delete booking.QUANTITY_DAY;
            delete booking.STATUS;

            // assume task has correct unit and calculate best possible values
            if (booking.UNIT === "H" && targetHoursForDay) {
                booking.CATSQUANTITY = catsUtils.cat2CompliantRoundingForHours($scope.blockdata[i].value * targetHoursForDay);
                if (catsUtils.isHourlyProfil(catsBackend.catsProfile) === true) {
                    booking.CATSHOURS = booking.CATSQUANTITY;
                }
            } else {
                booking.CATSQUANTITY = catsUtils.cat2CompliantRounding($scope.blockdata[i].value * totalWorkingTimeForDay);
            }
            delete booking.QUANTITY;

            // correct some special case where ADMI and EDUC are obviously incorrect
            // That can happen when switching CAT2 profiles or when using the CAT2 app favorites
            if (booking.TASKTYPE === "ADMI" || booking.TASKTYPE === "EDUC") {
                if (catsUtils.isHourlyProfil(catsBackend.catsProfile) === false && booking.UNIT === "H") {
                    booking.UNIT = "TA";
                    booking.CATSQUANTITY = catsUtils.cat2CompliantRounding($scope.blockdata[i].value * totalWorkingTimeForDay);
                    booking.CATSHOURS = "";
                }
                if (catsUtils.isHourlyProfil(catsBackend.catsProfile) === true && booking.UNIT !== "H") {
                    booking.UNIT = "H";
                    booking.CATSQUANTITY = catsUtils.cat2CompliantRoundingForHours($scope.blockdata[i].value * targetHoursForDay);
                    booking.CATSHOURS = booking.CATSQUANTITY;
                }
            }
            // remember value in Blockdata itself
            $scope.blockdata[i].CATSQUANTITY = booking.CATSQUANTITY;

            // Don't sent tasks which are already in the Backend with the exact same amount
            if (taskInBackend &&
                taskInBackend.QUANTITY === booking.CATSQUANTITY) {
                unchangedBookings.push(booking);
                continue;
            }

            //cleanup temporary data
            if (booking.TASKTYPE === booking.ZCPR_OBJGEXTID) {
                booking.ZCPR_OBJGEXTID = null;
            }

            if (booking.CATSQUANTITY > 0) {
                workdateBookings.push(booking);
            }
        }

        // Remove all tasks which are not modified or ignored
        tasksInBackend.forEach(function(task){
            var taskPreparedForBooking = _.find(workdateBookings, {"COUNTER": task.COUNTER });
            var taskNotRelevantForBooking = _.find(unchangedBookings, {"COUNTER": task.COUNTER });
            if (!taskPreparedForBooking && !taskNotRelevantForBooking) {
                var taskDeletion = angular.copy(task);
                taskDeletion.WORKDATE = workdate;
                taskDeletion.CATSQUANTITY = 0;
                delete taskDeletion.QUANTITY;
                container.BOOKINGS.push(taskDeletion);
            }
        });

        // determine the biggest booking (which is subject to change)
        var biggestBooking;
        workdateBookings.forEach(function(oBooking){
            if(!biggestBooking || biggestBooking.CATSQUANTITY <= oBooking.CATSQUANTITY) {
                biggestBooking = oBooking;
            }
        });

        // determine the total of all blocks
        var totalBookingQuantity = 0;
        $scope.blockdata.forEach(function(block){
            totalBookingQuantity += block.CATSQUANTITY;
        });
        totalBookingQuantity = catsUtils.cat2CompliantRounding(totalBookingQuantity);

        // adjust block size so that minimal rounding issues get corrected
        if (catsUtils.isHourlyProfil(catsBackend.catsProfile) === true) {
            var bookingDifference = catsUtils.cat2CompliantRoundingForHours(totalBookingQuantity - targetHoursForDay);
            if((bookingDifference > 0 && bookingDifference < 0.03) ||
               (bookingDifference < 0 && bookingDifference > -0.03)) {
                biggestBooking.CATSQUANTITY -= bookingDifference;
                biggestBooking.CATSQUANTITY = catsUtils.cat2CompliantRoundingForHours(biggestBooking.CATSQUANTITY);
                biggestBooking.CATSHOURS    = biggestBooking.CATSQUANTITY;
            }
        } else {
            bookingDifference = totalBookingQuantity - totalWorkingTimeForDay;
            if((bookingDifference > 0 && bookingDifference < 0.03) ||
               (bookingDifference < 0 && bookingDifference > -0.03)) {
                biggestBooking.CATSQUANTITY -= bookingDifference;
                biggestBooking.CATSQUANTITY = catsUtils.cat2CompliantRounding(biggestBooking.CATSQUANTITY);
            }
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

    $scope.isCopyTemplateEnabled = function(){
        if ($scope.checkThatContainsNoFixedTasksForTemplate() &&
            $scope.blockdata.length > 0) {
            return true;
        } else {
            return false;
        }
    };

    $scope.copyTemplate = function(){
        $scope.blockdataTemplate = angular.copy($scope.blockdata);
        angular.forEach($scope.blockdataTemplate, function(block) {
            if (block.task) {
                block.task.COUNTER = 0;
                block.task.TASKCOUNTER = "";
                block.task.WORKDATE = "";
                delete block.task.QUANTITY;
                delete block.task.QUANTITY_DAY;
            }
        });
    };

    $scope.isPasteTemplateEnabled = function(){
        if ($scope.checkThatContainsNoFixedTasksForTemplate() &&
            $scope.selectedDates.length > 0 &&
            $scope.blockdataTemplate.length > 0) {
            return true;
        } else {
            return false;
        }
    };

    $scope.pasteTemplate = function(){
        $scope.blockdata = angular.copy($scope.blockdataTemplate);
    };

    function dayContainsFixedTask(dayString) {
        var tasks = monthlyDataService.days[dayString].tasks;
        for (var i = 0; i < tasks.length; i++) {
            if(catsUtils.isFixedTask(tasks[i])) {
                return true;
            }
        }
        return false;
    }

    function makeDayWithNoFixedTasksTheLastSingleClickDay(selectedDates) {
        if (dayContainsFixedTask(monthlyDataService.lastSingleClickDayString)) {
            for (var i = 0; i < selectedDates.length; i++) {
                if(!dayContainsFixedTask(selectedDates[i])) {
                    monthlyDataService.lastSingleClickDayString = selectedDates[i];
                    i = selectedDates.length; // end loop
                }

            }
        }
    }

    $scope.saveTimesheet = function(){
        var weeks = [];
        var container = {
            BOOKINGS: []
        };

        var selectedDates = $scope.selectedDates;
        $scope.selectedDates = [];
        $scope.totalSelectedHours = 0;

        // Remove duplicate days (legacy??)
        selectedDates.forEach(function(dayString){
            if($scope.selectedDates.indexOf(dayString) === -1) {
                $scope.selectedDates.push(dayString);
                addToTotalSelectedHours(dayString);
            } else {
                $log.log("The selectedDates array had double entries! Please check selection functionality.");
            }
        });

        makeDayWithNoFixedTasksTheLastSingleClickDay($scope.selectedDates);

        try {
            $scope.selectedDates.forEach(function(dayString){
                container = prepareCATSData(dayString, container, $scope.selectedDates.length);

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
                    /* eslint-disable no-undef */
                    if (swa && swa.hasOwnProperty('trackCustomEvent')) {
                        swa.trackCustomEvent('CAT2applyChanges', 'Success');
                    }
                    /* eslint-enable no-undef */
                }, function(errorText){
                    bridgeInBrowserNotification.addAlert('danger', errorText);
                    $scope.$emit("refreshApp"); // this must be done before loadDataForSelectedWeeks() for performance reasons
                    monthlyDataService.loadDataForSelectedWeeks(weeks).then(function(){
                        loadCATSDataForDay();
                    });
                    /* eslint-disable no-undef */
                    if (swa && swa.hasOwnProperty('trackCustomEvent')) {
                        swa.trackCustomEvent('CAT2applyChanges', 'Failure');
                    }
                    /* eslint-enable no-undef */
                });
            } else {
                bridgeInBrowserNotification.addAlert('info', "No changes recognized. No update required.");
                $scope.$emit("refreshApp"); // this must be done before loadDataForSelectedWeeks() for performance reasons
                monthlyDataService.loadDataForSelectedWeeks(weeks).then(function(){
                    loadCATSDataForDay();
                });
                /* eslint-disable no-undef */
                if (swa && swa.hasOwnProperty('trackCustomEvent')) {
                    swa.trackCustomEvent('CAT2applyChanges', 'NoChange');
                }
                /* eslint-enable no-undef */
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
