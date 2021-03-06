angular.module('app.TwoGo').service("app.TwoGo.configService", ["bridgeDataService", function (bridgeDataService) {

    this.values = {

        distancefromdestination: 5000,
        distancefromorigin: 5000,
        state: 5000,
        stateD: 5000
    };


    this.initialize = function (configLoadedFromBackend) {
        if (configLoadedFromBackend !== undefined &&
            configLoadedFromBackend !== {} &&
            configLoadedFromBackend.values) {
            // Standard case: Get config from backend
            this.values = configLoadedFromBackend.values;


        } else {
            // Use default config on first load
            configLoadedFromBackend.values = this.values;


        }
    };

    var that = this;
    bridgeDataService.getAppsByType("app.TwoGo")[0].returnConfig = function() {
        return that;
    };
}]);
