﻿angular.module('app.atc').service('app.atc.dataservice', ["$http", "$window", "app.atc.configservice", "$q", function ($http, $window, atcConfig, $q) {
    var Data = (function() {
        return function(_appId) {
            var appId = _appId;
            this.data = {
                prio1: 0,
                prio2: 0,
                prio3: 0,
                prio4: 0
            };
            this.detailsData = [];
            var that = this;

            this.getResultForConfig = function (config) {
                config.getQueryString().then(function(queryString) {
                    $http({method: 'POST', url: 'https://ifp.wdf.sap.corp:443/sap/bc/bridge/STAT_CHK_RES_CN?&count_prios=X&format=json&origin=' + $window.location.origin, withCredentials: true, data: queryString, headers: {'Content-Type': 'text/plain'}})
                    .success(function (data) {

                        that.data = {
                            prio1: data.PRIOS.PRIO1,
                            prio2: data.PRIOS.PRIO2,
                            prio3: data.PRIOS.PRIO3,
                            prio4: data.PRIOS.PRIO4
                        };
                    });
                });
            };

            this.getDetailsForConfig = function (config) {
                var deferred = $q.defer();
                config.getQueryString().then(function(queryString) {
                    return $http({method: 'POST', url: 'https://ifp.wdf.sap.corp:443/sap/bc/bridge/STAT_CHK_RESULT?&format=json&origin=' + $window.location.origin, withCredentials: true, data: queryString, headers: {'Content-Type': 'text/plain'}})
                    .success(function (data) {
                        that.detailsData = data.DATA;
                        deferred.resolve(that.detailsData);
                    });
                });
                return deferred.promise;
            };

            this.loadOverviewData = function() {
                if (atcConfig.getConfigForAppId(appId).configItems.length > 0) {
                    that.getResultForConfig(atcConfig.getConfigForAppId(appId));
                }
            };
        };
    })();

    var dataInstances = {};

    this.getInstanceForAppId = function(appId) {
        if(dataInstances[appId] === undefined) {
            dataInstances[appId] = new Data(appId);
        }
        return dataInstances[appId];
    };
}]);
