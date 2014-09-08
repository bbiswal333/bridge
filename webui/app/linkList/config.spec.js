/* global describe, beforeEach, it, expect, module, inject */
describe("The linklist config service", function() {

    "use strict";

    var configService;

    beforeEach(angular.mock.module("app.linklist"));

    beforeEach(inject(["app.linklist.configservice", function(_configService_) {

        configService = _configService_;


    }]));

    it("is not initialized on startup", function () {

        expect(configService.isInitialized).toBe(false);

    });

    it("has a version and a listcollection as members", function () {

        expect(configService.data.version).toBeDefined();
        expect(configService.data.listCollection).toBeDefined();

    });

});
