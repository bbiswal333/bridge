angular.module("app.cats.data", ["lib.utils"]).factory("app.cats.data.catsUtils", ["$http", "$q", "lib.utils.encodeForUrl", "lib.utils.calUtils",
  function($http, $q, encodeForUrl, calUtils) {
    var CATS_COMPLIANCE_WEBSERVICE = 'https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA?format=json&origin=' + location.origin;
    var TASKS_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETWORKLIST?format=json&origin=" + location.origin;    
    var CATS_ALLOC_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETCATSDATA?format=json&origin=" + location.origin + "&week=";
    var CATS_WRITE_WEBSERVICE = "https://isp.wdf.sap.corp:443/sap/bc/zdevdb/WRITECATSDATA?format=json&origin=" + location.origin;

    var catsDataCache = null;
    var taskCache = null;

    function _requestCatsData(callback_fn) {
      _httpRequest(CATS_COMPLIANCE_WEBSERVICE, function(data) { // /zdevdb/MYCATSDATA
        if (data != null) {
          data.CATSCHK.forEach(function(CATSCHKforDay){
            // test test test
            if (CATSCHKforDay.STDAZ && false) {
              CATSCHKforDay.STDAZ = 7.55;
              CATSCHKforDay.QUANTITYH = Math.round(CATSCHKforDay.QUANTITYH * 100) / 100;
              if (CATSCHKforDay.STDAZ && CATSCHKforDay.QUANTITYH) {
                if (CATSCHKforDay.STDAZ != CATSCHKforDay.QUANTITYH) {
                  CATSCHKforDay.STATUS = "Y";
                } else {
                  CATSCHKforDay.STATUS = "G";
                }
              }
            }
          });
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

    var _getCatsAllocationDataForWeek = function (year, week) {
      var deferred = $q.defer();
      
      _httpRequest(CATS_ALLOC_WEBSERVICE + year + "." + week, function(data, status) { // /zdevdb/GETCATSDATA
        if (!data)
          deferred.reject(status);
        else if (data.TIMESHEETS.WEEK != week + "." + year ){
          console.log("_getCatsAllocationDataForWeek() data does not correspond to given week and year.");
          deferred.resolve();
        } else
          deferred.resolve(data);
      });

      return deferred.promise;
    }

    //expects to be day in format returned by calUtils.stringifyDate() (yyyy-mm-dd)
    function _getTotalWorkingTimeForDay(day_s, callback_fn) {
      _getCatsComplianceData(function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].DATEFROM ==  day_s) {
            var HoursOfWorkingDay = 8;
            var totalTimeInPercentOf8HourDay = Math.round(data[i].STDAZ / HoursOfWorkingDay * 1000) / 1000;
          	callback_fn(totalTimeInPercentOf8HourDay);
          	return;
          } 
        }

        callback_fn(null);
      }, false);
    }

    function _requestTasks(callback_fn) {
      _httpRequest(TASKS_WEBSERVICE, function(data) { // /zdevdb/GETWORKLIST
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
      if (state_s == "overbooked") {
        return "Overbooked";
      }
    }

    function _writeCATSData(container){
      var deferred = $q.defer();

      // $http.post(window.client.origin + "/api/post?url=" + encodeURI(CATS_WRITE_WEBSERVICE), container ).success(function(data, status) {
      // /zdevdb/WRITECATSDATA
      $http.post(CATS_WRITE_WEBSERVICE, container, {'headers':{'Content-Type':'text/plain'}}).success(function(data, status) {
          deferred.resolve(data);
      }).error(function (data, status, header, config) {
          if (status != "404") // ignore 404 issues, they are currently (16.05.14) caused by nodeJS v0.11.9 issues
              deferred.reject(status);
          else
              deferred.resolve(data);
      });
      return deferred.promise;
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
      getTotalWorkingTimeForDay: function (day_s, callback_fn) {
      	_getTotalWorkingTimeForDay(day_s, callback_fn);
      },
      /*getCatsAllocationDataForDay: function (day_o, callback_fn) {
        _getCatsAllocationDataForDay(day_o, callback_fn);
      },*/
      getCatsAllocationDataForWeek: function (year, week) {
        return _getCatsAllocationDataForWeek(year, week);
      },
      enrichTaskData: function(task){
        return _enrichTaskData(task);
      },
      writeCATSData: function (container) {
        return _writeCATSData(container);
      }
    };
  }
]);
