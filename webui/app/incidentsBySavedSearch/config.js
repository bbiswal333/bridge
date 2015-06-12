angular.module('app.incidentSavedSearch').service("app.incidentSavedSearch.configservice", ["bridge.ticketAppUtils.configUtils", function (configUtils){
    var Config = function() {
        this.data = {};
        this.data.lastDataUpdate = null;
        this.data.selectedSearchGuid = null;
        this.data.columnVisibility = [true, true, true, true, true, true, true, false, false, false];

        this.isInitialized = false;
        this.initialize = function (oConfigFromBackend) {
            this.isInitialized = true;
            configUtils.applyBackendConfig(this.data, oConfigFromBackend);
            this.data.lastDataUpdate = new Date(this.data.lastDataUpdate);
        };
    };

    var instances = {};
    this.getConfigForAppId = function(appId) {
        if(instances[appId] === undefined) {
            instances[appId] = new Config();
        }
        return instances[appId];
    };
}]);
