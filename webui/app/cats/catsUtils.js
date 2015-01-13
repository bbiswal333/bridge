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
      if(task.ZCPR_OBJGEXTID) {
        return task.ZCPR_OBJGEXTID;
      } else {
        return (task.RAUFNR || "") + task.TASKTYPE + (task.ZZSUBTYPE || "");
      }
    };

    this.isSameTask = function(task1, task2) {
      if (!task1 || !task2) {
        return false;
      }

      if ((task1.ZCPR_OBJGEXTID === task2.ZCPR_OBJGEXTID && task1.ZCPR_OBJGEXTID) || // OBJEXTID exists
          (!task1.ZCPR_OBJGEXTID && !task2.ZCPR_OBJGEXTID &&
           !task1.RNPLNR && !task2.RNPLNR &&
            task1.RAUFNR === task2.RAUFNR &&
            task1.TASKTYPE === task2.TASKTYPE && task1.TASKTYPE &&
            task1.ZZSUBTYPE === task2.ZZSUBTYPE) || // CAT2 task check
           (task1.RNPLNR === task2.RNPLNR && task1.RNPLNR &&
            task1.VORNR === task2.VORN &&
            task1.AUTYP === task2.AUTYP &&
            task1.TASKTYPE === task2.TASKTYPE && task1.TASKTYPE &&
            task1.TASKLEVEL === task2.TASKLEVEL &&
            task1.SKOSTL === task2.SKOSTL &&
            task1.ZZOBJNR === task2.ZZOBJNR)) {  // CATSXT task check
          return true;
      }
      return false;
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

    this.cat2CompliantRounding = function(value) {
      return Math.round(value * 1000) / 1000;
    };

    this.cat2CompliantRoundingForHours = function(value) {
      return Math.round(value * 100) / 100;
    };
  }
);
