angular.module("app.cats.data", ["lib.utils"]).factory("app.cats.data.catsUtils", ["$http", "lib.utils.encodeForUrl", "lib.utils.calUtils",
  function($http, encodeForUrl, calUtils) {
    var CATS_COMPLIANCE_WEBSERVICE = 'https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA?format=json&origin=' + location.origin;
    var TASKS_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETWORKLIST?format=json&origin=" + location.origin;    
    var CATS_ALLOC_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETCATSDATA?format=json&origin=" + location.origin + "&week=";

    var catsDataCache = null;
    var taskCache = null;

    function _requestCatsData(callback_fn) {
      _httpRequest(CATS_COMPLIANCE_WEBSERVICE, function(data) {
        if (data != null) {
          callback_fn(data.CATSCHK);
        } else {
          callback_fn();
        };
      });
    }

    var _getCatsComplianceData = function(callback_fn, forceUpdate_b) {
      if (forceUpdate_b || catsDataCache == null) {
        _requestCatsData(function(data) {
          catsDataCache = data;
          callback_fn(data);
        });
      } else {
        callback_fn(catsDataCache);
      }
    };

    var _getCatsAllocationDataForDay = function (day_o, callback_fn) {
      var res = [];

      var weekNo = calUtils.getWeekNumber(day_o);
      weekNo.weekNo = calUtils.useNDigits(weekNo.weekNo, 2); //ABAP server doesn't like the week number it is not two digits long

      _httpRequest(CATS_ALLOC_WEBSERVICE + weekNo.year + "." + weekNo.weekNo, function(data, status) {
        if (!data){
          return;
        }
        var records = data.TIMESHEETS.RECORDS;
 
        for (var i = 0; i < records.length; i++) {
          var record = records[i];
          var task = {};
          task.tasktype = record.TASKTYPE;
          task.taskDesc = (record.taskDesc == "") ? task.tasktype : record.DESCR;
          task.projDesc = (record.projDesc == "") ? task.tasktype : record.ZCPR_EXTID;
          task.record = record;

          var dayOfWeek = (day_o.getDay() != 0) ? day_o.getDay() - 1 : 6;
          record.booking = record.DAYS[dayOfWeek];
          delete record.DAYS;
          task.quantity = parseFloat(record.booking.QUANTITY);

          _enrichTaskData(task);
          //Only add to list when time has been spent on this task
          if (!isNaN(task.quantity)) {
            res.push(task);
          }
        } 

        callback_fn(res);
      });
    };

    //expects to be day in format returned by calUtils.stringifyDate() (yyyy-mm-dd)
    function _getWorkingHoursForDay(day_s, callback_fn) {
      _getCatsComplianceData(function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].DATEFROM ==  day_s) {
          	callback_fn(data[i].STDAZ);
          	return;
          } 
        }

        callback_fn(null);
      }, false);
    }

    function _requestTasks(callback_fn) {
      _httpRequest(TASKS_WEBSERVICE, function(data) {
        var tasks = [];

        //Add prefdefined tasks (ADMI & EDUC)
        tasks.push(_enrichTaskData({
            RAUFNR: "",
            TASKTYPE: "ADMI",
            taskDesc: "ADMI",
            projectDesc: "Administrative"
        }));

        tasks.push(_enrichTaskData({
            RAUFNR: "",
            TASKTYPE: "EDUC",
            taskDesc: "EDUC",
            projectDesc: "Personal education"
        }));

        if (!data){
          return;
        }
        var nodes = data.WORKLIST;
        for (var i = 0; i < nodes.length; i++) {
          var task = {};
          task.RAUFNR         = nodes[i].RAUFNR;
          task.TASKTYPE       = nodes[i].TASKTYPE;
          task.ZCPR_EXTID     = nodes[i].ZCPR_EXTID;
          task.ZCPR_OBJGEXTID = nodes[i].ZCPR_OBJGEXTID;
          task.UNIT           = nodes[i].UNIT;
          task.projectDesc    = nodes[i].DISPTEXTW1;
          task.taskDesc       = nodes[i].DISPTEXTW2;

          // task.data = nodes[i];

          tasks.push(task);
        }

        callback_fn(tasks);
      });
    }

    function _enrichTaskData(task){
      if (task &&
          !task.ZCPR_OBJGEXTID &&
          !task.ZCPR_OBJGUID) {
        task.ZCPR_OBJGEXTID = task.TASKTYPE;
        task.ZCPR_OBJGUID = task.TASKTYPE;
      } else if (task.record &&
          !task.record.ZCPR_OBJGEXTID &&
          !task.record.ZCPR_OBJGUID) {
        task.record.ZCPR_OBJGEXTID = task.record.TASKTYPE;
        task.record.ZCPR_OBJGUID = task.record.TASKTYPE;
      };
      return task;
    }

    function _httpRequest(url, callback_fn) {
      $http.get(url).success(function(data, status) {
        if (between(status, 200, 299)) {
          callback_fn(data);
        }
      }).error(function(data, status, header, config) {
        console.log("GET-Request to " + url + " failed. HTTP-Status: " + status + ".\nData provided by server: " + data);
        callback_fn(null);
      });
    }

    function between(val_i, min_i, max_i) {
      return (val_i >= min_i && val_i <= max_i);
    }

    function _getDescForState(state_s) {
      if (typeof state_s == "undefined") {
        return "";
      }

      state_s = state_s.toLowerCase();
      if (state_s == "r") {
        return "Not maintained";
      }
      if (state_s == "y") {
        return "Partially maintained";
      }
      if (state_s == "g") {
        return "Maintained";
      }
      if (state_s == "n") {
        return "No need for maintenance";
      }
    }

    return {
      getCatsComplianceData: function(callback_fn, forceUpdate_b) { //Returns either an object generated from json string or null in case Request wasn't successful. In the last case the method will internaly invoke a console.log()
        _getCatsComplianceData(callback_fn, forceUpdate_b);
      },
      getDescForState: function(state_s) {
        return _getDescForState(state_s);
      },
      getTasks: function(callback_fn, forceUpdate_b) {
        if (forceUpdate_b || taskCache == null) {
          _requestTasks(function(data) {
            taskCache = data;
            callback_fn(data);
          });
        } else {
          callback_fn(taskCache);
        }
      },
      getWorkingHoursForDay: function (day_s, callback_fn) {
      	_getWorkingHoursForDay(day_s, callback_fn);
      },
      getCatsAllocationDataForDay: function (day_o, callback_fn) {
        _getCatsAllocationDataForDay(day_o, callback_fn);
      },
      enrichTaskData: function(task){
        return _enrichTaskData(task);
      }
    };
  }
]);
