angular.module('bridge.service').service('bridgeInBrowserNotification', function ($timeout) {

    this.addAlert = function (scope, alertType, alertMsg) {
    	if (!scope.alerts) {
    		scope.alerts = [ ];
    	}
        scope.alerts.push({type : alertType, msg: alertMsg});
        if (alertType == "danger") {
            this.closeAlertDelayed(scope, 0, 20);
        } else {
            this.closeAlertDelayed(scope, 0, 8);
        };
    };

    this.closeAlert = function (scope, index) {
        scope.alerts.splice(index, 1);
    };

    this.closeAlertDelayed = function (scope, index, timeoutInSeconds) {
        $timeout(function () { scope.alerts.splice(index, 1); } , 1000 * timeoutInSeconds);
    };

    // Example calls
    //$scope.addAlert('success','This is the notification area.');
    //$scope.addAlert('danger','This is an error.');
});