angular.module('bridge.service').service('bridgeInBrowserNotification', ["$rootScope", "$timeout", function ($rootScope, $timeout) {

	var scopeForDisplay = $rootScope;

	this.setScope = function (scope) {
		scopeForDisplay = scope;
	};

	function closeAlert(alertID, timeoutInSeconds) {
		$timeout(function () {
			for (var i = 0; i < scopeForDisplay.alerts.length; i++) {
				if (scopeForDisplay.alerts[i].id === alertID) {
					scopeForDisplay.alerts.splice(i, 1);
				}
			}
		} , 1000 * timeoutInSeconds);
	}

	function close(alertID) {
		closeAlert(alertID,0);
	}

	// alertType can be 'success', 'danger', undefined
	this.addAlert = function (alertType, alertMsg, alertDuration) {
		if (!scopeForDisplay.alerts) {
			scopeForDisplay.alerts = [ ];
		}
		var alertID = alertType + alertMsg;
		if (_.find(scopeForDisplay.alerts, { "id": alertID }) === undefined) {
			scopeForDisplay.alerts.push({ type: alertType, msg: alertMsg, id: alertID, close: close });
		}

		if (alertDuration) {
			closeAlert(alertID, alertDuration);
		} else {
			closeAlert(alertID, 8);
		}
	};
}]);
