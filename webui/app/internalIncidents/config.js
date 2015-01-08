angular.module('app.internalIncidents').service("app.internalIncidents.configservice", function (){
    var Config = function() {
        this.data = {};
        this.data.lastDataUpdate = null;
        this.data.selection = {};
        this.data.selection.sel_components = true;
        this.data.selection.colleagues = false;
        this.data.selection.assigned_me = false;
        this.data.selection.created_me = false;
        this.data.columnVisibility = [true, true, true, true, true, true, true, false, false, false];
        this.data.ignoreAuthorAction = true;

        this.isInitialized = false;
        this.initialize = function (oConfigFromBackend) {
            var property;

            this.isInitialized = true;

            for (property in oConfigFromBackend) {
                if (property === "columnVisibility" && this.data.columnVisibility.length !== oConfigFromBackend.columnVisibility.length) {
                    // if the length of the columnVisibility attribute changed, reset to default. This happens for example if a new column is introduced
                    continue;
                } else {
                    this.data[property] = oConfigFromBackend[property];
                }
            }

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
});
