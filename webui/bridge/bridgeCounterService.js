angular.module('bridge.service').service('bridgeCounter', function ($http) {

    var URL = location.href;
    URL = URL.replace("https://",""),
    URL = URL.replace("http://","");

    this.CollectWebStats = function (section, action) {
        $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/COLLECT_WEB_STATS?URL='+ encodeURIComponent( URL ) +
            '&SECTION=' + section +
            '&ACTION=' + action +
            '&origin=' + location.origin);
    };

    this.GetWebStats = function (deferred, forHowManyDays, section, action) {
        $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/GET_WEB_STATS?URL='+ encodeURIComponent( URL ) +
            '&FOR_HOW_MANY_DAYS=' + '7' +
            '&SECTION=' + section +
            '&ACTION=' + action +
            '&origin=' + location.origin
        ).success(function (data, status, headers, config) {
            deferred.resolve(data);
        }).error(function (data, status, headers, config) {
            console.log("Error when loading web statistics!");
            deferred.reject(data);
        });

        return deferred.promise;
    };
});
