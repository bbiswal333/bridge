angular.module('app.TwoGo').service("app.TwoGo.configService", function () {

    this.values = {
        distancefromdestination: 5000,
        distancefromorigin: 5000,
        change: false,
        state: 5000,
        stateD: 5000
    };


    this.initialize = function (configLoadedFromBackend) {

        if (configLoadedFromBackend !== undefined &&
            configLoadedFromBackend !== {} &&
            configLoadedFromBackend.values) {
            // Standard case: Get config from backend
            this.values = configLoadedFromBackend.values;
            this.values.change = false;
        } else {
            // Use default config on first load
            configLoadedFromBackend.values = this.values;
            this.values.change = false;
        }
    };


});
