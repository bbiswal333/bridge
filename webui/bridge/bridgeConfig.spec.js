describe("The bridgeConfig handles loading/saving/displaying of the configuration", function () {
    var mockTemplatePath = "myMockTemplatePath";
    var mockController = "myMockController";

    var bridgeConfig;
    var bridgeDataService;
    var $rootScope;
    var $httpBackend;

    beforeEach(function () {

        module("bridge.service");

        inject(["$rootScope", "$httpBackend", "$templateCache", "bridgeConfig", "bridgeDataService", function (rootScope, httpBackend, $templateCache, _bridgeConfig, _bridgeDataService) {
            bridgeConfig = _bridgeConfig;
            bridgeDataService = _bridgeDataService;
            $rootScope = rootScope;

            $httpBackend = httpBackend;
            $httpBackend.whenGET("view/settings.html").respond("");
        }]);

        bridgeDataService.boxInstances.mockBox = {};
        bridgeDataService.boxInstances["mockBox"].scope = {};
        bridgeDataService.boxInstances["mockBox"].scope.boxId = "mockBox";
        bridgeDataService.boxInstances["mockBox"].scope.settingScreenData = {};
        bridgeDataService.boxInstances["mockBox"].scope.settingScreenData.templatePath = mockTemplatePath;
        bridgeDataService.boxInstances["mockBox"].scope.settingScreenData.controller = mockController;
    });

    it("Modal instance exists after show modal", function () {
        bridgeConfig.showSettingsModal("mockBox");
        expect(bridgeConfig.modalInstance).toBeDefined();
    });

    it("Should save the config when modal gets closed", function () {
        var persistInBackendCalled = false;
        // mock away the persist in backend function
        bridgeConfig.persistInBackend = function () {
            persistInBackendCalled = true;
        };

        // show Settings Modall triggers a http request which we intercept in $httpBackend
        bridgeConfig.showSettingsModal("mockBox");
        $httpBackend.flush();
        // without $apply, the callbacks registered to close() will not be called
        $rootScope.$apply(function () { bridgeConfig.modalInstance.close(); });

        expect(persistInBackendCalled).toBe(true);
    });
});