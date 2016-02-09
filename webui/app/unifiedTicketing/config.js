angular.module("app.unifiedticketing").service("app.unifiedticketing.config", ['bridgeDataService', function (bridgeDataService) {
    var Config = function() {
        this.data = {};
        this.isInitialized = false;
        this.lastDataUpdate = null;
        this.bIncludeSavedSearch = false;
        this.sSavedSearchToInclude = '';
        this.bPartieOfRequestSelected = true;
        this.bSavedSearchSelected = true;
        this.syncHistory = '';

        this.data = {}; // make it an object to establish data binding
        this.data.syncDays = '140';
        this.data.Status = '';

        this.initialize = function (sAppId) {
            this.isInitialized = true;
            var persistedConfig = bridgeDataService.getAppConfigById(sAppId);
            this.data = persistedConfig.data;
            this.lastDataUpdate = new Date(this.lastDataUpdate);
            this.setSyncHistory(this.data.syncDays);
        };

        this.setSyncHistory = function(syncDays) {
            var days = parseInt(syncDays);
            this.data.syncDays = syncDays;
            if(syncDays === 'null' || syncDays === ''){
                this.syncHistory = '';
            } else{
                var date = new Date();
                date.setDate(date.getDate() - days);
                var month = (date.getMonth() + 1).toString();
                if (month.length === 1) {
                    month = "0" + month;
                }
                var day = (date.getDate()).toString();
                if (day.length === 1) {
                    day = "0" + day;
                }
                var dateString = date.getFullYear().toString() + month + day + "0001";
                this.syncHistory = dateString;
            }
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
