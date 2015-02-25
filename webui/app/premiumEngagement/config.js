angular.module("app.premiumEngagement").service("app.premiumEngagement.configService",
    ["bridge.ticketAppUtils.configUtils", function(configUtils){
    var Config = function() {
        this.DEFAULT_CUSTOMER_SELECTION = "Show All";
        this.isInitialized = false;

        this.data = {};
        this.data.aConfiguredCustomers = [];
        this.data.sSelectedCustomer = this.DEFAULT_CUSTOMER_SELECTION;

        this.initialize = function(oConfigFromBackend){
            this.isInitialized = true;
            configUtils.applyBackendConfig(this.data, oConfigFromBackend);
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
