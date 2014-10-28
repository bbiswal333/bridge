angular.module('app.internalIncidents').factory("app.internalIncidents.configservice", function (){
    var config = {};
    config.data = {};
    config.data.lastDataUpdate = null;
    config.data.selection = {};
    config.data.selection.sel_components = true;
    config.data.selection.colleagues = false;
    config.data.selection.assigned_me = false;
    config.data.selection.created_me = false;
    return config;
});
