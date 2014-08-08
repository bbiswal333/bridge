angular.module("app.cats.dataModule", ["lib.utils"]).service("app.cats.cat2BackendZDEVDB", ["$http", "$q", "$log",
  function($http, $q, $log) {
    var CATS_COMPLIANCE_WEBSERVICE = 'https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA?format=json&origin=' + location.origin;
    var TASKS_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETWORKLIST?format=json&origin=" + location.origin;    
    var CATS_ALLOC_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETCATSDATA?format=json&origin=" + location.origin + "&week=";
    var CATS_WRITE_WEBSERVICE = "https://isp.wdf.sap.corp:443/sap/bc/zdevdb/WRITECATSDATA?format=json&origin=" + location.origin + "&catsprofile=";

    var CAT2ComplinaceData4FourMonthCache = null;
    var tasksFromWorklistCache = null;
    var CAT2AllocationDataForWeeks = [];

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
          $log.log("GET-Request to " + url + " failed. HTTP-Status: " + status + ".\nData provided by server: " + data);
        deferred.resolve(null, status);
      });

      return deferred.promise;
    }

    this.getCAT2ComplianceData4FourMonth = function(forceUpdate_b) {
      var deferred = $q.defer();

      if (forceUpdate_b || CAT2ComplinaceData4FourMonthCache == null) {
        _httpRequest(CATS_COMPLIANCE_WEBSERVICE).then(function(data) {
          CAT2ComplinaceData4FourMonthCache = data.CATSCHK;
          // CAT2ComplinaceData4FourMonthCache.forEach(function(CATSCHKforDay){
          //   // uncomment to be a part-time colleague test test test
          //   if (CATSCHKforDay.STDAZ) {
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
          deferred.resolve(CAT2ComplinaceData4FourMonthCache);
        });
      } else {
        deferred.resolve(CAT2ComplinaceData4FourMonthCache);
      }

      return deferred.promise;
    };

    this.getCatsAllocationDataForWeek = function (year, week) {
      var deferred = $q.defer();
      
      _httpRequest(CATS_ALLOC_WEBSERVICE + year + "." + week).then(function(data, status) { // /zdevdb/GETCATSDATA
        if (!data) {
          deferred.reject(status);
        } else if (data.TIMESHEETS.WEEK !== week + "." + year ) {
            $log.log("getCatsAllocationDataForWeek() data does not correspond to given week and year.");
          deferred.resolve();
        } else {
          deferred.resolve(data);
        }
      });
      CAT2AllocationDataForWeeks[year + "" + week] = deferred.promise;
      return deferred.promise;
    };

    //expects to be day in format returned by calUtils.stringifyDate() (yyyy-mm-dd)
    this.getTotalWorkingTimeForDay = function(day_s) {
      var deferred = $q.defer();

      this.getCAT2ComplianceData4FourMonth(false).then(function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].DATEFROM ===  day_s) {
            deferred.resolve(data[i].STDAZ);
          }
        }
      });
      return deferred.promise;
    };

    this.requestTasksFromWorklist = function(forceUpdate_b) {
      var deferred = $q.defer();

      if (forceUpdate_b || !tasksFromWorklistCache) {
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

          tasksFromWorklistCache = tasks;
          deferred.resolve(tasksFromWorklistCache);
        });
      } else {
        deferred.resolve(tasksFromWorklistCache);
      }
      return deferred.promise;
    };

    this.requestTasksFromTemplate = function(year, week) {
      var deferred = $q.defer();
      var promise = {};

      if (CAT2AllocationDataForWeeks[year + "" + week]) { // Data does not need to be super current
        promise = CAT2AllocationDataForWeeks[year + "" + week];
      } else {
        promise = this.getCatsAllocationDataForWeek(year, week);
      }

      promise.then(function(data) {
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
    };

    this.writeCATSData = function(container, profile){
      var deferred = $q.defer();
      // /zdevdb/WRITECATSDATA
      $http.post(CATS_WRITE_WEBSERVICE + profile, container, {'headers':{'Content-Type':'text/plain'}}).success(function(data) {
          deferred.resolve(data);
      }).error(function (data, status) {
          deferred.reject(status);
      });
      return deferred.promise;
    };
  }
]);