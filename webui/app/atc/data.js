angular.module('app.atc').service('app.atc.dataservice', ["$http", "$interval", "app.atc.configservice", function ($http, $interval, atcConfig) {
    var that = this;

    this.data = {
        prio1: 0,
        prio2: 0,
        prio3: 0,
        prio4: 0,
    };

    this.detailsData = [];

    this.getResultForConfig = function (config) {            
        var that = this;
        $http.get('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RES_CN?query=' + config.getQueryString() + '&count_prios=X&format=json&origin=' + location.origin)
        .success(function (data) {

            that.data = {
                prio1: data.PRIOS.PRIO1,
                prio2: data.PRIOS.PRIO2,
                prio3: data.PRIOS.PRIO3,
                prio4: data.PRIOS.PRIO4,
            };                
        });
    };

    this.getDetailsForConfig = function (config) {
        var that = this;
        $http.get('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RESULT?query=' + config.getQueryString() + '&format=json&origin=' + location.origin)
        .success(function (data) {
            that.detailsData = data.DATA;
        });
    };

    this.loadOverviewData = function() {
        if (atcConfig.configItems.length > 0) {
            that.getResultForConfig(atcConfig);
        }
    };

    var refreshInterval = $interval(this.loadOverviewData, 60000 * 5);
}]);
