angular.module('app.atc').service('app.atc.dataservice', ["$http", "$window", "app.atc.configservice", function ($http, $window, atcConfig) {
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
                $http.get('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RES_CN?query=' + config.getQueryString() + '&count_prios=X&format=json&origin=' + $window.location.origin)
                .success(function (data) {

                    that.data = {
                        prio1: data.PRIOS.PRIO1,
                        prio2: data.PRIOS.PRIO2,
                        prio3: data.PRIOS.PRIO3,
                        prio4: data.PRIOS.PRIO4
                    };
                });
            };

            this.getDetailsForConfig = function (config) {
                return $http.get('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RESULT?query=' + config.getQueryString() + '&format=json&origin=' + $window.location.origin)
                .success(function (data) {
                    that.detailsData.length = 0;
                    data.DATA.map(function(item) {
                        that.detailsData.push(item);
                    });
                });
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
