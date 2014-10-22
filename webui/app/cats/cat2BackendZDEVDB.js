angular.module("app.cats.dataModule", ["lib.utils"]).service("app.cats.cat2BackendZDEVDB", ["$http", "$q", "$log", "$window", "lib.utils.calUtils",
  function($http, $q, $log, $window, calUtils) {
    var MYCATSDATA_WEBSERVICE = 'https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA?format=json&origin=' + $window.location.origin + "&options=SHORT";
    var GETWORKLIST_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETWORKLIST?format=json&origin=" + $window.location.origin + "&begda=20101001&endda=20151001catsprofile=";
    var GETCATSDATA_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETCATSDATA?format=json&origin=" + $window.location.origin + "&week=";
    var WRITECATSDATA_WEBSERVICE = "https://isp.wdf.sap.corp:443/sap/bc/zdevdb/WRITECATSDATA?format=json&origin=" + $window.location.origin + "&catsprofile=";

    this.CAT2ComplinaceDataCache = [];
    var that = this;
    var tasksFromWorklistCache = [];
    var CAT2AllocationDataForWeeks = {};

    // that must be read from backend with the the first web call
    //this.catsProfile = "DEV2002C";

    function between(val_i, min_i, max_i) {
      return (val_i >= min_i && val_i <= max_i);
    }

    function _httpRequest(url) {
      var deferred = $q.defer();

      $http.get(url, {timeout: 15000}).success(function(data, status) {
        if (between(status, 200, 299)) {
          deferred.resolve(data, status);
        }
      }).error(function(data, status) {
          $log.log("GET-Request to " + url + " failed. HTTP-Status: " + status + ".\nData provided by server: " + data);
        deferred.resolve(null, status);
      });

      return deferred.promise;
    }

    // this.getCAT2ComplianceData4FourMonth = function(forceUpdate_b) {
    //   var deferred = $q.defer();

    //   if (forceUpdate_b || that.CAT2ComplinaceDataCache === []) {
    //     _httpRequest(MYCATSDATA_WEBSERVICE).then(function(data) {
    //       if (data && data.CATSCHK) {
    //         // ////////////////////////////////////////////////////////
    //         // // test test test: uncomment to be a part-time colleague
    //         // that.CAT2ComplinaceDataCache.forEach(function(CATSCHKforDay){
    //         //   CATSCHKforDay.CONVERT_H_T = 7.9;
    //         //   if (CATSCHKforDay.STDAZ) {
    //         //     CATSCHKforDay.STDAZ = 7.55;
    //         //     var QUANTITYHRounded = Math.round(CATSCHKforDay.QUANTITYH * 100) / 100;
    //         //     var STADZRounded = Math.round(CATSCHKforDay.STDAZ * 8 / CATSCHKforDay.CONVERT_H_T * 100) / 100;
    //         //     if (STADZRounded && QUANTITYHRounded) {
    //         //       if (STADZRounded === QUANTITYHRounded) {
    //         //         CATSCHKforDay.STATUS = "G"; // maintained
    //         //       } else {
    //         //         CATSCHKforDay.STATUS = "Y"; // part time or overbooked
    //         //       }
    //         //     }
    //         //   }
    //         // });
    //         // ////////////////////////////////////////////////////////
    //         that.CAT2ComplinaceDataCache = data.CATSCHK;
    //         // that.catsProfile = data.PROFILE;
    //         deferred.resolve(data.CATSCHK);
    //       } else {
    //         deferred.resolve();
    //       }
    //     });
    //   } else {
    //     deferred.resolve(that.CAT2ComplinaceDataCache);
    //   }

    //   return deferred.promise;
    // };

    function monthAlreadyCached(year, month) {
      var monthInABAPStartWithOneInsteadOfZeroLikeInJavaScript = month + 1;
      var middate = "" + year + "-" + calUtils.toNumberOfCharactersString(monthInABAPStartWithOneInsteadOfZeroLikeInJavaScript, 2) + "-" + "15";

      if(_.find(that.CAT2ComplinaceDataCache, { "DATEFROM":  middate }) !== undefined) {
        return true;
      } else {
        return false;
      }
    }

    this.getCAT2ComplianceData4OneMonth = function(year, month, forceUpdate_b) {
      var deferred = $q.defer();

      if (forceUpdate_b || !monthAlreadyCached(year, month)) {
        var monthInABAPStartWithOneInsteadOfZeroLikeInJavaScript = month + 1;
        var begdate = "" + year + calUtils.toNumberOfCharactersString(monthInABAPStartWithOneInsteadOfZeroLikeInJavaScript, 2) + "01";
        var enddate = "" + year + calUtils.toNumberOfCharactersString(monthInABAPStartWithOneInsteadOfZeroLikeInJavaScript, 2) + calUtils.getLengthOfMonth(year, month);

        _httpRequest(MYCATSDATA_WEBSERVICE + "&begda=" + begdate + "&endda=" + enddate).then(function(data) {
          if (data && data.CATSCHK) {
            // that.CAT2ComplinaceDataCache = data.CATSCHK;
            data.CATSCHK.forEach(function(CATSCHKforDay) {
              var entry = _.find(that.CAT2ComplinaceDataCache, { "DATEFROM":  CATSCHKforDay.DATEFROM });
              if (entry !== undefined) {
                var index = that.CAT2ComplinaceDataCache.indexOf(entry);
                if (index > -1) {
                  that.CAT2ComplinaceDataCache.splice(index, 1);
                }
              }
              that.CAT2ComplinaceDataCache.push(CATSCHKforDay);
            });
            deferred.resolve(data.CATSCHK);
          } else {
            deferred.resolve();
          }
        });
      } else {
        deferred.resolve(that.CAT2ComplinaceDataCache);
      }
      return deferred.promise;
    };

    this.getCatsAllocationDataForWeek = function (year, week) {
      var deferred = $q.defer();

      _httpRequest(GETCATSDATA_WEBSERVICE + year + "." + week + "&options=CLEANMINIFY").then(function(data, status) { // /zdevdb/GETCATSDATA
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

    this.requestTasksFromWorklist = function(forceUpdate_b, profile_s) {
      var deferred = $q.defer();

      if (forceUpdate_b || !tasksFromWorklistCache) {
         _httpRequest(GETWORKLIST_WEBSERVICE + profile_s).then(function(data) { // /zdevdb/GETWORKLIST
          var tasks = [];

          if (profile_s === "DEV2002C") {
            // Add prefdefined tasks (ADMI & EDUC) only for the standard developer profile
            tasks.push({
                RAUFNR: "",
                TASKTYPE: "ADMI",
                ZCPR_EXTID: "",
                ZCPR_OBJGEXTID: "",
                ZZSUBTYPE: "",
                DESCR: "Admin"
            });

            tasks.push({
                RAUFNR: "",
                TASKTYPE: "EDUC",
                ZCPR_EXTID: "",
                ZCPR_OBJGEXTID: "",
                ZZSUBTYPE: "",
                DESCR: "Education"
            });
        }

          if (data && data.WORKLIST) {
            var nodes = data.WORKLIST;
            for (var i = 0; i < nodes.length; i++) {
              var task = {};
              task.RAUFNR         = (nodes[i].RAUFNR || "");
              task.TASKTYPE       = (nodes[i].TASKTYPE || "");
              task.ZCPR_EXTID     = (nodes[i].ZCPR_EXTID || "");
              task.ZCPR_OBJGEXTID = (nodes[i].ZCPR_OBJGEXTID || "");
              task.ZZSUBTYPE      = (nodes[i].ZZSUBTYPE || "");
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

    this.requestTasksFromTemplate = function(year, week, callback_fn) {
      var deferred = $q.defer();

      if (!CAT2AllocationDataForWeeks[year + "" + week]) {
        this.getCatsAllocationDataForWeek(year, week);
      }

      var promise = $q.all(CAT2AllocationDataForWeeks);
      promise.then(function(promisesData) {
        angular.forEach(promisesData, function(data){
            var tasks = null;
            if (data && data.TIMESHEETS && data.TIMESHEETS.RECORDS){
                tasks = [];
                var nodes = data.TIMESHEETS.RECORDS;
                for (var i = 0; i < nodes.length; i++) {
                    var task = {};
                    task.RAUFNR         = (nodes[i].RAUFNR || "");
                    task.TASKTYPE       = (nodes[i].TASKTYPE || "");
                    task.ZCPR_EXTID     = (nodes[i].ZCPR_EXTID || "");
                    task.ZCPR_OBJGEXTID = (nodes[i].ZCPR_OBJGEXTID || "");
                    task.ZZSUBTYPE      = (nodes[i].ZZSUBTYPE || "");
                    task.UNIT           = nodes[i].UNIT;
                    task.DESCR          = nodes[i].DESCR || nodes[i].DISPTEXTW2;
                    tasks.push(task);
                }
            }
            callback_fn(tasks);
        });
        /*CAT2AllocationDataForWeeks.forEach(function (promise) {
          promise.then(function (data) {
            var tasks = null;
            if (data && data.TIMESHEETS && data.TIMESHEETS.RECORDS){
              tasks = [];
              var nodes = data.TIMESHEETS.RECORDS;
              for (var i = 0; i < nodes.length; i++) {
                var task = {};
                task.RAUFNR         = (nodes[i].RAUFNR || "");
                task.TASKTYPE       = (nodes[i].TASKTYPE || "");
                task.ZCPR_EXTID     = (nodes[i].ZCPR_EXTID || "");
                task.ZCPR_OBJGEXTID = (nodes[i].ZCPR_OBJGEXTID || "");
                task.ZZSUBTYPE      = (nodes[i].ZZSUBTYPE || "");
                task.UNIT           = nodes[i].UNIT;
                task.DESCR          = nodes[i].DESCR || nodes[i].DISPTEXTW2;
                tasks.push(task);
              }
            }
            callback_fn(tasks);
          });
        });*/
        deferred.resolve();
      });
      return deferred.promise;
    };

    this.writeCATSData = function(container, profile_s){
      var deferred = $q.defer();
      // /zdevdb/WRITECATSDATA
      $http.post(WRITECATSDATA_WEBSERVICE + profile_s, container, {'headers':{'Content-Type':'text/plain'}}).success(function(data) {
          deferred.resolve(data);
      }).error(function (data, status) {
          deferred.reject(status);
      });
      return deferred.promise;
    };
  }
]);
