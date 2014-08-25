angular.module('bridge.service').service('bridgeInstance', function ($location) {
    this.getCurrentInstance = function() {
        return $location.host();
    };
});
