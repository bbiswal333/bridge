angular.module('bridge.diagnosis', []).service('bridge.diagnosis.logService', [function () {

    var sLogKey = "bridgeLog";

    this.addEntry = function (sType, sMessage, sStackTrace) {
        var logEntries = this.getLog();

        logEntries.push({
            sType: sType,
            sMessage: sMessage,
            sStackTrace: sStackTrace
        });
        sessionStorage.setItem(sLogKey, JSON.stringify(logEntries));
    };

    this.getLog = function () {
        var logEntries = JSON.parse(sessionStorage.getItem(sLogKey));

        if (logEntries == null) { // no logEntries available so far
            logEntries = [];
        }

        return logEntries;
    };

    this.clear = function () {
        sessionStorage.removeItem(sLogKey);
    };
}]);