angular.module('bridge.diagnosis', ['bridge.service']).service('bridge.diagnosis.logService', ["bridgeDataService", function (bridgeDataService) {

    var sLogKey = "bridgeLog";

    this.log = function (uObject) {
        if (bridgeDataService.getLogMode() === true) {
            if (angular.isObject(uObject)) {
                if (uObject.hasOwnProperty("message") && uObject.hasOwnProperty("stack")) {
                    this.addEntry("", uObject.message, uObject.stack);
                } else {
                    this.addEntry("", JSON.stringify(uObject), "");
                }
            } else {
                this.addEntry("", uObject.toString(), "");
            }
        } 
    };

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