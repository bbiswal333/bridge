angular.module('bridge.service').service('bridgeInBrowserNotification', ["$rootScope", "$timeout", function ($rootScope, $timeout) {

	var scopeForDisplay = $rootScope;

	this.setScope = function (scope) {
	    scopeForDisplay = scope;
	};

    // alertType can be 'success', 'danger', undefined
    this.addAlert = function (alertType, alertMsg, alertDuration) {
    	if (!scopeForDisplay.alerts) {
    		scopeForDisplay.alerts = [ ];
    	}
    	var alertID = alertType + alertMsg;
    	scopeForDisplay.alerts.push({ type: alertType, msg: alertMsg, id: alertID });

        if (alertDuration) {
            this.closeAlert(alertID, alertDuration);
        } else {
            this.closeAlert(alertID, 8);
        }
    };

    this.closeAlert = function (alertID, timeoutInSeconds) {
        $timeout(function () {
	        for (var i = 0; i < scopeForDisplay.alerts.length; i++) {
	            if (scopeForDisplay.alerts[i].id === alertID) {
	                scopeForDisplay.alerts.splice(i, 1);
	            }
	        }
        } , 1000 * timeoutInSeconds);
    };
}]);