describe("The log service", function () {
    var logService;
    var bridgeDataService;
    var $httpBackend;

    beforeEach(function () {
        module("bridge.diagnosis");
        module("bridge.service");

        inject(["$httpBackend", "bridge.diagnosis.logService", "bridgeDataService", function (_$httpBackend, _logService, _bridgeDataService) {
            logService = _logService;
            bridgeDataService = _bridgeDataService;
            $httpBackend = _$httpBackend;

            logService.clear();
        }]);
    });

    it("should be able to save a string", function () {
        logService.addEntry("Test", "just a testmessage", "I am the stacktrace");
        var log = JSON.parse(sessionStorage.getItem("bridgeLog"));
        expect(log[0].sType).toBe("Test");
        expect(log[0].sMessage).toBe("just a testmessage");
        expect(log[0].sStackTrace).toBe("I am the stacktrace");
    });

    it("shoulb be able to provide all log entries", function () {
        logService.addEntry("Test", "just a testmessage", "I am the stacktrace");
        logService.addEntry("Test2", "just a testmessage2", "I am the stacktrace2");

        var log = logService.getLog();
        expect(log.length).toBe(2);
        expect(log[1].sType).toBe("Test2");
    });

    it("should be able to clear the log", function () {
        logService.addEntry("Test", "just a testmessage", "I am the stacktrace");
        logService.addEntry("Test2", "just a testmessage2", "I am the stacktrace2");

        logService.clear();
        var log = logService.getLog();
        expect(log.length).toBe(0);
    });

    it("should be able to log any object", function () {
        bridgeDataService.setLogMode(true);

        logService.log("string");
        expect(logService.getLog()[0].sMessage).toBe("string");

        var oObject = { test: "message" };
        logService.log(oObject);
        expect(logService.getLog()[1].sMessage).toBe('{"test":"message"}');
        expect(logService.getLog()[1].sType).toBe('');
    });

    it("should be able to log exception objects", function () {
        bridgeDataService.setLogMode(true);

        try {
            IDoNotExist();
        } catch (e) {
            logService.log(e);
            expect(logService.getLog()[0].sMessage).not.toBe('');
            expect(logService.getLog()[0].sStackTrace.indexOf("ReferenceError:")).not.toBe(-1);
        }
    });

    it("should send the log in HTML format to IF*", function () {
        logService.addEntry("TestType", "TestMessage", "TestStacktrace");
        logService.sendLog();

        $httpBackend.expectPOST(/https:\/\/if.\.wdf\.sap\.corp\/sap\/bc\/bridge\/SEND_MAIL*./, function (data) {
            if (data.indexOf("<html>") === 0 && data.indexOf("TestType") != -1 && data.indexOf("TestMessage") != -1 && data.indexOf("TestStacktrace") != -1) {
                return true;
            } else {
                return false;
            }
        }).respond(201, '');

        $httpBackend.flush();
    });
});