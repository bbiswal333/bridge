angular.module("app.cats.utilsModule", ["lib.utils"]).service("app.cats.catsUtils",
  function() {
    this.getDescForState = function(state_s) {
      state_s = state_s.toLowerCase();
      if (state_s === "r") {
        return "Not maintained";
      }
      if (state_s === "y") {
        return "Partially maintained";
      }
      if (state_s === "g") {
        return "Maintained";
      }
      if (state_s === "n") {
        return "No need for maintenance";
      }
      if (state_s === "overbooked") {
        return "Overbooked";
      }
      return "";
    };

    this.getTaskID = function (task) {
      if(task.ZCPR_OBJGEXTID) { // cPro
        return task.ZCPR_OBJGEXTID + (task.TASKTYPE || "") + (task.ZZSUBTYPE || "");
      } else if (task.RAUFNR) { // order based
        return (task.RAUFNR || "") + (task.TASKTYPE || "") + (task.ZZSUBTYPE || "");
      } else if (task.RNPLNR) { // catsXT
        return (task.RNPLNR || "") + (task.TASKTYPE || "") + (task.ZZSUBTYPE || "") + (task.VORNR || "") + (task.AUTYP || "") + (task.TASKLEVEL || "") + (task.SKOSTL || "") + (task.ZZOBJNR || "");
      } else { // basic stuff like ADMI
        return (task.RAUFNR || "") + (task.TASKTYPE || "") + (task.ZZSUBTYPE || "");
      }
    };

    this.isCproTask = function(task) {
      if (task.ZCPR_OBJGEXTID || task.ZCPR_EXTID) {
        return true;
      } else {
        return false;
      }
    };

    this.isSameTask = function(task1, task2) {
      if (!task1 || !task2) {
        return false;
      }

      if (// cPro task
          ( task1.ZCPR_OBJGEXTID === task2.ZCPR_OBJGEXTID && task1.ZCPR_OBJGEXTID &&
           ((task1.TASKTYPE      === task2.TASKTYPE && task1.TASKTYPE) ||
            !task1.TASKTYPE ||
            !task2.TASKTYPE) &&
           !task1.ZZSUBTYPE      && !task2.ZZSUBTYPE) ||

          // cPro task of support profile SUP2007C
          ( task1.ZCPR_OBJGEXTID === task2.ZCPR_OBJGEXTID && task1.ZCPR_OBJGEXTID &&
            task1.TASKTYPE       === task2.TASKTYPE && task1.TASKTYPE &&
            task1.ZZSUBTYPE      === task2.ZZSUBTYPE && task1.ZZSUBTYPE) ||

          // classical support task non cPro related
          (!task1.ZCPR_OBJGEXTID && !task2.ZCPR_OBJGEXTID &&
           !task1.RNPLNR         && !task2.RNPLNR &&
            task1.RAUFNR         === task2.RAUFNR &&
            task1.TASKTYPE       === task2.TASKTYPE && task1.TASKTYPE &&
            task1.ZZSUBTYPE      === task2.ZZSUBTYPE) ||

          // CATSXT task
          ( task1.RNPLNR         === task2.RNPLNR && task1.RNPLNR &&
            task1.VORNR          === task2.VORN &&
            task1.AUTYP          === task2.AUTYP &&
            task1.TASKTYPE       === task2.TASKTYPE && task1.TASKTYPE &&
            task1.TASKLEVEL      === task2.TASKLEVEL &&
            task1.SKOSTL         === task2.SKOSTL &&
            task1.ZZOBJNR        === task2.ZZOBJNR)) {

          return true;
      }
      return false;
    };

    this.isValid = function(task){
      if (!task) {
        return false;
      }
      if ((task.ZCPR_OBJGEXTID) || // OBJEXTID exists
          (!task.ZCPR_OBJGEXTID && task.TASKTYPE)) { // unique TASKTYPE RAUFNR combination
          return true;
      }
      return false;
    };

    this.isValidProfile = function(catsProfile){
      if (catsProfile === "SUP2007U") {
          return false;
      } else {
          return true;
      }
    };

    this.isHourlyProfil = function(catsProfile){
            if (catsProfile === "SUP2007H" ||
                catsProfile === "SUP2007B" ||
                catsProfile === "SUP2007U" ||
                catsProfile === "DEV2012C" ||
                catsProfile === "DEV2012") {
                return true;
            } else {
                return false;
            }
    };

    this.isFixedTask = function(task){
      if ((task.TASKTYPE === "VACA" && task.UNIT === "H") || // There is a valid VACA/TA task in Israel
          (task.TASKTYPE === "ABSE" && task.UNIT === "H") || // There is a valid ABSE/TA task in Israel
           task.TASKTYPE === "COMP" ||
           task.TASKCOUNTER) { // System entered time or CATSXT
        return true;
      }
      return false;
    };

    this.cat2CompliantRounding = function(value) {
      return Math.round(value * 1000) / 1000;
    };

    this.cat2CompliantRoundingForHours = function(value) {
      return Math.round(value * 100) / 100;
    };

    this.calculateDAY = function(task, day) {
      var value;
      if (task.UNIT === 'H') {
        value = task.QUANTITY / day.hoursOfWorkingDay;
      } else {
        value = task.QUANTITY;
      }
      if(day.actualTimeInPercentageOfDay <= day.targetTimeInPercentageOfDay) {
        if (task.UNIT !== 'H') {
          // Adjusting to acutal part-time and country specific target hours value
          var roundedTargetHours = Math.round(Math.round(day.targetHours / day.hoursOfWorkingDay * 1000) / 1000 * day.hoursOfWorkingDay * 1000) / 1000;
        } else {
          roundedTargetHours = day.targetHours;
        }
        if(day.targetTimeInPercentageOfDay <= 1 || task.UNIT === 'H') {
          value = Math.round(value * day.hoursOfWorkingDay / roundedTargetHours * 1000) / 1000;
        }
      }
      return Math.round(value * 1000) / 1000;
    };
  }
);
