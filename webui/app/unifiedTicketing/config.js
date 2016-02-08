angular.module("app.unifiedticketing").service("app.unifiedticketing.config", function(){
    var Config = function() {
        this.data = {};
        this.isInitialized = false;
        this.lastDataUpdate = null;
        this.bIncludeSavedSearch = false;
        this.sSavedSearchToInclude = "";
        this.bPartieOfRequestSelected = true;
        this.bSavedSearchSelected = true;

        this.data.syncDays = "";
        this.syncHistory = "";
        this.data.Status = "";

        this.initialize = function (oConfigFromBackend) {
            var property;

            this.isInitialized = true;

            for (property in oConfigFromBackend) {
                this[property] = oConfigFromBackend[property];
            }

            this.lastDataUpdate = new Date(this.lastDataUpdate);
        };
    };

    var instances = {};
    this.getConfigForAppId = function(appId) {
        if(instances[appId] === undefined) {
            instances[appId] = new Config();
        }
        return instances[appId];
    };

});
