angular.module("app.cats.data", ["lib.utils"]).factory("app.cats.data.catsUtils", ["$http", "$q",
  function($http, $q) {
    var CATS_COMPLIANCE_WEBSERVICE = 'https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA?format=json&origin=' + location.origin;
    var TASKS_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETWORKLIST?format=json&origin=" + location.origin;    
    var CATS_ALLOC_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETCATSDATA?format=json&origin=" + location.origin + "&week=";
    var CATS_WRITE_WEBSERVICE = "https://isp.wdf.sap.corp:443/sap/bc/zdevdb/WRITECATSDATA?format=json&origin=" + location.origin;

    var catsDataCache = null;
    var taskCache = null;

    function between(val_i, min_i, max_i) {
      return (val_i >= min_i && val_i <= max_i);
    }

    function _httpRequest(url) {
      var deferred = $q.defer();

      $http.get(url).success(function(data, status) {
        if (between(status, 200, 299)) {
          deferred.resolve(data, status);
        }
      }).error(function(data, status) {
        console.log("GET-Request to " + url + " failed. HTTP-Status: " + status + ".\nData provided by server: " + data);
        deferred.resolve(null, status);
      });

      return deferred.promise;
    }

    var _getCatsComplianceData = function(forceUpdate_b) {
      var deferred = $q.defer();

      if (forceUpdate_b || catsDataCache == null) {
        _httpRequest(CATS_COMPLIANCE_WEBSERVICE).then(function(data) {
          catsDataCache = data.CATSCHK;
          // data.CATSCHK.forEach(function(CATSCHKforDay){
          //   // uncomment to be a part-time colleague test test test
          //   if (CATSCHKforDay.STDAZ && false) {
          //     CATSCHKforDay.STDAZ = 7.55;
          //     CATSCHKforDay.QUANTITYH = Math.round(CATSCHKforDay.QUANTITYH * 100) / 100;
          //     if (CATSCHKforDay.STDAZ && CATSCHKforDay.QUANTITYH) {
          //       if (CATSCHKforDay.STDAZ !== CATSCHKforDay.QUANTITYH) {
          //         CATSCHKforDay.STATUS = "Y";
          //       } else {
          //         CATSCHKforDay.STATUS = "G";
          //       }
          //     }
          //   }
          // });
          deferred.resolve(data.CATSCHK);
        });
      } else {
        deferred.resolve(catsDataCache);
      }

      return deferred.promise;
    };

    var _getCatsAllocationDataForWeek = function (year, week) {
      var deferred = $q.defer();
      
      _httpRequest(CATS_ALLOC_WEBSERVICE + year + "." + week).then(function(data, status) { // /zdevdb/GETCATSDATA
        if (!data) {
          deferred.reject(status);
        } else if (data.TIMESHEETS.WEEK !== week + "." + year ) {
          console.log("_getCatsAllocationDataForWeek() data does not correspond to given week and year.");
          deferred.resolve();
        } else {
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    };

    //expects to be day in format returned by calUtils.stringifyDate() (yyyy-mm-dd)
    function _getTotalWorkingTimeForDay(day_s) {
      var deferred = $q.defer();

      _getCatsComplianceData(false).then(function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].DATEFROM ===  day_s) {
            deferred.resolve(data[i].STDAZ);
          }
        }
      });

      return deferred.promise;
    }

    function _requestTasks(forceUpdate_b) {
      var deferred = $q.defer();

      if (forceUpdate_b || !taskCache) {
        _httpRequest(TASKS_WEBSERVICE).then(function(data) { // /zdevdb/GETWORKLIST
          var tasks = [];

          //Add prefdefined tasks (ADMI & EDUC)
          tasks.push({
              RAUFNR: "",
              TASKTYPE: "ADMI",
              DESCR: "Admin"
          });

          tasks.push({
              RAUFNR: "",
              TASKTYPE: "EDUC",
              DESCR: "Education"
          });

          if (data && data.WORKLIST) {
            var nodes = data.WORKLIST;
            for (var i = 0; i < nodes.length; i++) {
              var task = {};
              task.RAUFNR         = nodes[i].RAUFNR;
              task.TASKTYPE       = nodes[i].TASKTYPE;
              task.ZCPR_EXTID     = nodes[i].ZCPR_EXTID;
              task.ZCPR_OBJGEXTID = nodes[i].ZCPR_OBJGEXTID;
              task.UNIT           = nodes[i].UNIT;
              task.projectDesc    = nodes[i].DISPTEXTW1;
              task.DESCR          = nodes[i].DESCR || nodes[i].DISPTEXTW2;
              tasks.push(task);
            }
          }

          taskCache = tasks;
          deferred.resolve(taskCache);
        });
      } else {
        deferred.resolve(taskCache);
      }

      return deferred.promise;
    }

    function _requestTasksFromTemplate (year, week) {
      var deferred = $q.defer();

      _getCatsAllocationDataForWeek(year, week).then(function(data) {
        var tasks = null;
        if (data && data.TIMESHEETS && data.TIMESHEETS.RECORDS){
          tasks = [];
          var nodes = data.TIMESHEETS.RECORDS;
          for (var i = 0; i < nodes.length; i++) {
            var task = {};
            task.RAUFNR         = nodes[i].RAUFNR;
            task.TASKTYPE       = nodes[i].TASKTYPE;
            task.ZCPR_EXTID     = nodes[i].ZCPR_EXTID;
            task.ZCPR_OBJGEXTID = nodes[i].ZCPR_OBJGEXTID;
            task.UNIT           = nodes[i].UNIT;
            task.DESCR          = nodes[i].DESCR || nodes[i].DISPTEXTW2;
            tasks.push(task);
          }
        }
        deferred.resolve(tasks);
      });

      return deferred.promise;
    }

    function _writeCATSData(container){
      var deferred = $q.defer();
      // /zdevdb/WRITECATSDATA
      $http.post(CATS_WRITE_WEBSERVICE, container, {'headers':{'Content-Type':'text/plain'}}).success(function(data) {
          deferred.resolve(data);
      }).error(function (data, status) {
          deferred.reject(status);
      });
      return deferred.promise;
    }

    function _getDescForState(state_s) {
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
    }
    
    function _isSameTask(task1, task2) {
      if (!task1 || !task2) {
        return false;
      }

      if ((task1.ZCPR_OBJGEXTID === task2.ZCPR_OBJGEXTID && task1.ZCPR_OBJGEXTID) || // OBJEXTID exists
          (!task1.ZCPR_OBJGEXTID && !task2.ZCPR_OBJGEXTID && task2.RAUFNR === task1.RAUFNR && task2.TASKTYPE === task1.TASKTYPE && task1.TASKTYPE)) { // unique TASKTYPE RAUFNR combination
          return true;
      }
      return false;
    }

    function _isFixedTask(task){
      if (task.TASKTYPE === "VACA" ||
          task.TASKTYPE === "ABSE" ||
          task.TASKTYPE === "COMP") {
        return true;
      }
      return false;
    }

    function _isValid(task){
      if (!task) {
        return false;
      }
      if ((task.ZCPR_OBJGEXTID) || // OBJEXTID exists
          (!task.ZCPR_OBJGEXTID && task.TASKTYPE)) { // unique TASKTYPE RAUFNR combination
          return true;
      }
      return false;
    }

    return {
      getCatsComplianceData: function(forceUpdate_b) {
        return _getCatsComplianceData(forceUpdate_b);
      },
      getDescForState: function(state_s) {
        return _getDescForState(state_s);
      },
      getTasks: function(forceUpdate_b) {
        return _requestTasks(forceUpdate_b);
      },
      getTotalWorkingTimeForDay: function (day_s) {
      	return _getTotalWorkingTimeForDay(day_s);
      },
      getCatsAllocationDataForWeek: function (year, week) {
        return _getCatsAllocationDataForWeek(year, week);
      },
      writeCATSData: function (container) {
        return _writeCATSData(container);
      },
      requestTasksFromTemplate: function(year, week) {
        return _requestTasksFromTemplate(year, week);
      },
      isSameTask: function(task1, task2) {
        return _isSameTask(task1, task2);
      },
      isFixedTask: _isFixedTask,
      isValid: _isValid
    };
  }
]);
