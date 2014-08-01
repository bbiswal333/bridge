describe("The log service", function () {
    var logService;

    beforeEach(function () {
        module("bridge.diagnosis");

        inject(["bridge.diagnosis.logService", function (_logService) {
            logService = _logService;
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
});