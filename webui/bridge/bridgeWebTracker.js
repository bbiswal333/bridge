angular.module('bridge.service').service('bridge.service.webTracker',
    function () {
        this.trackCustomEvent = function(customEvent, customValue) {
            /* eslint-disable no-undef */
            if (swa && swa.hasOwnProperty('trackCustomEvent') && customEvent) {
                swa.trackCustomEvent(customEvent, customValue || '');
            }
            /* eslint-enable no-undef */
        };
});
