angular.module("bridge.ticketAppUtils", []);
angular.module("bridge.ticketAppUtils").service("bridge.ticketAppUtils.configUtils", function(){

    this.applyBackendConfig = function(oTarget, oBackendConfig){
        var property;

        for (property in oBackendConfig) {
            if (property === "columnVisibility" && oTarget.columnVisibility.length !== oBackendConfig.columnVisibility.length) {
                // if the length of the columnVisibility attribute changed, reset to default. This happens for example if a new column is introduced
                continue;
            } else {
                oTarget[property] = oBackendConfig[property];
            }
        }
    };

});
