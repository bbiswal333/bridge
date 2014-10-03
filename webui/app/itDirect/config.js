angular.module("app.itdirect").service("app.itdirect.config", function(){
    this.isInitialized = false;
    this.lastDataUpdate = null;

    this.bIncludeSavedSearch = false;
    this.sSavedSearchToInclude = "";

    this.bPartieOfRequestSelected = true;
    this.bSavedSearchSelected = true;

    this.initialize = function(oConfigFromBackend){
        var property;

        this.isInitialized = true;

        for (property in oConfigFromBackend){
            this[property] = oConfigFromBackend[property];
        }

        this.lastDataUpdate = new Date(this.lastDataUpdate);
    };

});
