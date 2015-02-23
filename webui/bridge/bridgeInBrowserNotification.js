angular.module('bridge.service').service('bridgeInBrowserNotification', ["$rootScope", "$timeout", function ($rootScope, $timeout) {

	var scopeForDisplay = $rootScope;

	this.setScope = function (scope) {
		scopeForDisplay = scope;
	};

	function getAlert(alertID) {
		var alert = _.find(scopeForDisplay.alerts, { "id": alertID });
		if (alert !== undefined) {
			return alert;
		} else {
			return {};
		}
	}

	function removeAlert(alertID) {
		var alert = getAlert(alertID);
		$timeout.cancel(alert.closingTimer);
		scopeForDisplay.alerts.splice(scopeForDisplay.alerts.indexOf(alert),1);
	}

	function closeAlert(alertID, timeoutInSeconds) {
		if (!angular.isNumber(timeoutInSeconds)) {
			timeoutInSeconds = 0;
		}
		var closingTimer =
			$timeout(function () { removeAlert(alertID); } , 1000 * timeoutInSeconds);
		return closingTimer;
	}

	// alertType can be 'success', 'danger', undefined
	this.addAlert = function (alertType, alertMsg, alertDuration) {
		if (!scopeForDisplay.alerts) {
			scopeForDisplay.alerts = [ ];
		}
		var alertID = alertType + alertMsg;
		if (_.find(scopeForDisplay.alerts, { "id": alertID }) !== undefined) {
			removeAlert(alertID);
		}
		scopeForDisplay.alerts.push({ type: alertType, msg: alertMsg, id: alertID, close: closeAlert });

		if (alertDuration) {
			getAlert(alertID).closingTimer = closeAlert(alertID, alertDuration);
		} else if (alertType === "danger") { // actual errors shall be displayed much longer
			getAlert(alertID).closingTimer = closeAlert(alertID, 15);
		} else {
			getAlert(alertID).closingTimer = closeAlert(alertID, 8);
		}
	};
}]);
