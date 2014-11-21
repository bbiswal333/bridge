angular.module('app.internalIncidents').factory("app.internalIncidents.configservice", function (){
    var config = {};
    config.data = {};
    config.data.lastDataUpdate = null;
    config.data.selection = {};
    config.data.selection.sel_components = true;
    config.data.selection.colleagues = false;
    config.data.selection.assigned_me = false;
    config.data.selection.created_me = false;
    config.data.columnVisibility = [true, true, true, true, true, true, true, false, false, false];
    config.data.ignoreAuthorAction = true;

    config.isInitialized = false;
    config.initialize = function(oConfigFromBackend){
        var property;

        config.isInitialized = true;

        for (property in oConfigFromBackend){
            if (property === "columnVisibility" && config.data.columnVisibility.length !== oConfigFromBackend.columnVisibility.length){
                // if the length of the columnVisibility attribute changed, reset to default. This happens for example if a new column is introduced
                continue;
            } else {
                config.data[property] = oConfigFromBackend[property];
            }
        }
    };

    return config;
});
