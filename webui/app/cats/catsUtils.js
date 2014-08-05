angular.module("app.cats.utilsModule", ["lib.utils"]).service("app.cats.catsUtils",
  function() {
    this.getDescForState = function(state_s) {
      if (typeof state_s === "undefined") {
        return "";
      }
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
    };

    this.isSameTask = function(task1, task2) {
      if (!task1 || !task2) {
        return false;
      }

      if ((task1.ZCPR_OBJGEXTID === task2.ZCPR_OBJGEXTID && task1.ZCPR_OBJGEXTID) || // OBJEXTID exists
          (!task1.ZCPR_OBJGEXTID && !task2.ZCPR_OBJGEXTID && task2.RAUFNR === task1.RAUFNR && task2.TASKTYPE === task1.TASKTYPE && task1.TASKTYPE)) { // unique TASKTYPE RAUFNR combination
          return true;
      }
      return false;
    };

    this.isFixedTask = function(task){
      if (task.TASKTYPE === "VACA" ||
          task.TASKTYPE === "ABSE" ||
          task.TASKTYPE === "COMP") {
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
  }
);