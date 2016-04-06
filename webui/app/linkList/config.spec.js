/* global describe, beforeEach, it, expect, module, inject */
describe("The linklist config service", function() {

    "use strict";

    var configService, bridgeDataService;

    beforeEach(angular.mock.module("app.linklist", function($provide) {
        var app = {};

        $provide.value("bridgeDataService", {
            getAppById: function() {
                return app;
            }
        });
    }));

    beforeEach(inject(["app.linklist.configservice", "bridgeDataService", function(_configService_, _bridgeDataService_) {
        bridgeDataService = _bridgeDataService_;
        configService = _configService_.getInstanceForAppId("app.none");
    }]));

    it("is not initialized on startup", function () {
        expect(configService.isInitialized).toBe(false);
    });

    it("has a version and a listcollection as members", function () {
        expect(configService.data.version).toBeDefined();
        expect(configService.data.listCollection).toBeDefined();
    });

    it("should append return config function to app instance", function() {
        expect(typeof bridgeDataService.getAppById("app.none").returnConfig).toBe("function");
    });

});
