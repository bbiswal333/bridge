angular.module("app.itdirect").service("app.itdirect.config", function(){
    this.oIncludeSavedSearch = false;
    this.sSavedSearchToInclude = "";

    this.bPartieOfRequestSelected = false;
    this.bSavedSearchSelected = false;

    this.initialize = function(oConfigFromBackend){
        var property;

        for (property in oConfigFromBackend){
            this[property] = oConfigFromBackend[property];
        }
    };

});
