angular.module('bridge.diagnosis', ['bridge.service', 'ui.bootstrap'])
.service(   'bridge.diagnosis.logService', ["$rootScope", "$http", "bridgeDataService", "bridgeInBrowserNotification", "$modal", "$window",
            function ($rootScope, $http, bridgeDataService, bridgeInBrowserNotification, $modal, $window) {

    var sLogKey = "bridgeLog";

    function stackTraceToString(aStackTrace) {
        var sStacktrace = "";
        for (var i = 0; i < aStackTrace.length; i++) {
            sStacktrace += i.toString() + ": " + aStackTrace[i] + ";\n";
        }

        return sStacktrace;
    }

    function transformLogToHTML(log) {
        var sLog = "<html><body>";

        for (var i = 0; i < log.length; i++) {
            sLog += '<table style="border-collapse: collapse;">';
            sLog += '<tr> <td style="border: 1px solid black;">Type</td> <td style="border: 1px solid black;">' + log[i].sType + '</td> </tr>';
            sLog += '<tr> <td style="border: 1px solid black;">Message</td> <td style="border: 1px solid black;">' + log[i].sMessage + '</td> </tr>';
            sLog += '<tr> <td style="border: 1px solid black;">Stacktrace</td> <td style="border: 1px solid black;">';

            var aStacktrace = log[i].sStackTrace.split("\n");
            for (var j = 0; j < aStacktrace.length; j++) {
                sLog += aStacktrace[j] + "<br/>";
            }

            sLog += '</td> </tr>';
            sLog += '</table><br/><br/>';
        }

        return sLog;
    }

    this.log = function (uObject, sType) {
        Error.stackTraceLimit = 25;

        if (sType === undefined) {
            sType = "";
        }

        if (bridgeDataService.getLogMode() === true) {
            if (angular.isObject(uObject)) {
                if (uObject.hasOwnProperty("message") && uObject.hasOwnProperty("stack")) {
                    this.addEntry(sType, uObject.message, uObject.stack);
                } else {
                    this.addEntry(sType, JSON.stringify(uObject), stackTraceToString(printStackTrace()));
                }
            } else {
                this.addEntry(sType, uObject.toString(), stackTraceToString(printStackTrace()));
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
        $window.sessionStorage.setItem(sLogKey, JSON.stringify(logEntries));
    };

    this.getLog = function () {
        var logEntries = JSON.parse($window.sessionStorage.getItem(sLogKey));

        if (logEntries == null) { // no logEntries available so far
            logEntries = [];
        }

        return logEntries;
    };

    this.sendLog = function () {
        var log = this.getLog();
        var sLog = transformLogToHTML(log);

        $http.post("https://ifp.wdf.sap.corp/sap/bc/bridge/SEND_MAIL?origin=" + $window.location.origin, sLog, {'headers':{'Content-Type':'text/plain'}}
        ).success(function () {
            bridgeInBrowserNotification.addAlert("success", "Log sent successfully.", 5);
        }).error(function () {
            bridgeInBrowserNotification.addAlert("danger", "Error sending log.", 5);
        });
    };

    this.showPreview = function () {
        var log = this.getLog();

        var modalInstance = $modal.open({
            templateUrl: 'bridge/diagnosis/mailPreview.html',
            windowClass: 'settings-dialog',
            controller: angular.module('bridge.diagnosis').mailPreviewController,
            resolve: {
                frameContent: function () {
                    return transformLogToHTML(log);
                }
            }
        });

        return modalInstance.result;
    };

    this.clear = function () {
        $window.sessionStorage.removeItem(sLogKey);
    };

}]);
