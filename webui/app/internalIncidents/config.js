angular.module('app.internalIncidents').service("app.internalIncidents.configservice", ["bridge.ticketAppUtils.configUtils", "bridgeDataService", function (configUtils, bridgeDataService){
    var Config = function() {
        this.data = {};
        this.data.lastDataUpdate = null;
        this.data.selection = {};
        this.data.selection.sel_components = true;
        this.data.selection.colleagues = false;
        this.data.selection.assigned_me = false;
        this.data.selection.created_me = false;
        this.data.ignoreAuthorAction = true;
        this.data.tableSettings = {};

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
            bridgeDataService.getAppById(appId).returnConfig = function() {
                return instances[appId].data;
            };
        }
        return instances[appId];
    };
}]);
