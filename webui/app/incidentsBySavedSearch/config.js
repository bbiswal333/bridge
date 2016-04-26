angular.module('app.incidentSavedSearch').service("app.incidentSavedSearch.configservice",
    ["bridge.ticketAppUtils.configUtils", "app.incidentSavedSearch.savedSearchData", "bridgeDataService", function (configUtils, savedSearchDataService, bridgeDataService){

        var Config = function(appId) {
            var savedSearchData = savedSearchDataService.getInstanceForAppId(appId);

            this.data = {};
            this.data.lastDataUpdate = null;
            this.data.selectedSearchGuid = null;
            this.data.tableSettings = {};

            this.isInitialized = false;
            this.initialize = function (oConfigFromBackend) {
                this.isInitialized = true;
                configUtils.applyBackendConfig(this.data, oConfigFromBackend);
                this.data.lastDataUpdate = new Date(this.data.lastDataUpdate);
            };

            this.getSelectedSavedSearch = function(){
                return _.find(savedSearchData.savedSearches, { PARAMETER_: this.data.selectedSearchGuid });
            };
        };

        var instances = {};
        this.getConfigForAppId = function(appId) {
            if(instances[appId] === undefined) {
                instances[appId] = new Config(appId);
                bridgeDataService.getAppById(appId).returnConfig = function() {
                    return instances[appId].data;
                };
            }
            return instances[appId];
        };
}]);
