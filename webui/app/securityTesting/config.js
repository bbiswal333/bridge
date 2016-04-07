angular.module('app.securityTesting').service("app.securityTesting.configservice", ["bridgeDataService", function (bridgeDataService) {

    var instances = {};

    this.getConfigInstanceForAppId = function (appId) {
        if (instances[appId] === undefined) {
            instances[appId] = {
                fortifyfilter : {objectid: '', objecttype: ''},
                filters : [],
                auth: true
            };
            bridgeDataService.getAppById(appId).returnConfig = function() {
                return instances[appId];
            };
        }

        return instances[appId];
    };
}]);
