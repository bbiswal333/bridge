angular.module('app.customerMessages').service("app.customerMessages.configservice", ["bridgeDataService", function (bridgeDataService){
    //set the default configuration object
    var Config = function(appId){
        this.data = {};
        this.data.settings = {};
        this.data.settings.ignore_author_action = true;
        this.data.settings.filterByOrgUnit = false;
        this.data.settings.selectedOrgUnits = [];
        this.data.settings.notificationDuration = 5000;
        this.data.selection = {};
        this.data.selection.sel_components = true;
        this.data.selection.assigned_me = false;
        this.data.selection.colleagues = false;
        this.data.lastDataUpdate = null;

        this.appId = appId;
        this.isInitialized = false;
        this.initialize = function () {
            var property;
            this.isInitialized = true;
            var oConfigFromBackend = bridgeDataService.getAppConfigById(this.appId);

            if (oConfigFromBackend.hasOwnProperty("data")){
                for (property in oConfigFromBackend.data) {
                    this.data[property] = oConfigFromBackend[property];
                }
            } else {
                for (property in oConfigFromBackend) {
                    this.data[property] = oConfigFromBackend[property];
                }
            }

            this.data.lastDataUpdate = new Date(this.data.lastDataUpdate);
        };
    };

    var instances = {};
    this.getInstanceForAppId = function(appId) {
        if(instances[appId] === undefined) {
            instances[appId] = new Config(appId);
        }
        return instances[appId];
    };
}]);
