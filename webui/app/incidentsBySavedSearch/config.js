angular.module('app.incidentSavedSearch').service("app.incidentSavedSearch.configservice",
    ["bridge.ticketAppUtils.configUtils", "app.incidentSavedSearch.savedSearchData", function (configUtils, savedSearchDataService){

        var Config = function(appId) {
            var savedSearchData = savedSearchDataService.getInstanceForAppId(appId);

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

            this.getSelectedSavedSearch = function(){
                return _.find(savedSearchData.savedSearches, { GUID: this.data.selectedSearchGuid });
            };
        };

        var instances = {};
        this.getConfigForAppId = function(appId) {
            if(instances[appId] === undefined) {
                instances[appId] = new Config(appId);
            }
            return instances[appId];
        };
}]);