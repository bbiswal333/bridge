angular.module("app.premiumEngagement").service("app.premiumEngagement.configService",
    ["bridge.ticketAppUtils.configUtils", function(configUtils){
    var Config = function() {
        this.data = {};
        this.data.aConfiguredCustomers = [];

        this.isInitialized = false;
        this.initialize = function(oConfigFromBackend){
            this.isInitialized = true;
            configUtils.applyBackendConfig(this, oConfigFromBackend);
        };
    };

    var instances = {};
    this.getInstanceForAppId = function(appId) {
        if(instances[appId] === undefined) {
            instances[appId] = new Config();
        }
        return instances[appId];
    };
}]);
