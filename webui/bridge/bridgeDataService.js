angular.module('bridge.service', ['ui.bootstrap']).service('bridgeDataService', function () {
    return {
        boxInstances: {},
        getBoxInstance: function (boxId) {
            for (var boxProperty in this.boxInstances) {
                if (this.boxInstances[boxProperty].scope.boxId == boxId) {
                    return this.boxInstances[boxProperty];
                }
            }
        },
    };
});