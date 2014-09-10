﻿describe("The bridgeConfigService", function () {
    var bridgeConfigService,
        bridgeDataService,
        $window,
        $httpBackend,
        bridgeInstance;


    beforeEach(function () {

        module("bridge.service");

        inject(["$window", "$httpBackend", "bridgeConfig", "bridgeDataService", "bridgeInstance", function (_$window, _$httpBackend, _bridgeConfigService, _bridgeDataService, _bridgeInstance) {
            bridgeConfigService = _bridgeConfigService;
            bridgeDataService = _bridgeDataService;
            $window = _$window;
            $httpBackend = _$httpBackend;
            bridgeInstance = _bridgeInstance;
        }]);

        $window.localStorage.clear();
    });

    it("should store the config in the local storage", function(){
        bridgeDataService.toDefault();
        bridgeConfigService.store(bridgeDataService);

        var configFromStorage = $window.JSON.parse($window.localStorage.getItem("bridgeConfig"));
        expect(configFromStorage.projects[0].apps.length).toBe(2);
        expect(angular.isObject(configFromStorage.bridgeSettings)).toBe(true);
    });

    it("should construct the config payload", function(){
        bridgeDataService.toDefault();
        var payload = bridgeConfigService.constructPayload(bridgeDataService);

        expect(payload.projects[0].apps.length).toBe(2);
        expect(angular.isObject(payload.bridgeSettings)).toBe(true);
    });

    it("should read the config from the local storage and send it to the backend", function(){
        $httpBackend.expectPOST('https://ifp.wdf.sap.corp/sap/bc/bridge/SETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin),
        function validate(data){
            var oData = angular.fromJson(data);
            if (oData.projects[0].apps[0].metadata.module_name === "app.atc"){
                return true;
            } else {
                return false;
            }
        }).respond("200", {});

        bridgeDataService.toDefault();
        bridgeConfigService.store(bridgeDataService);
        bridgeConfigService.persistInBackend();

        $httpBackend.flush();
    });

    it("should use the config from the backend because it's newer", function(){
        bridgeDataService.toDefault();
        bridgeConfigService.store(bridgeDataService);

        var mockConfigFromBackend = bridgeConfigService.getDefaultConfig();
        mockConfigFromBackend.savedOn = new Date(2120, 1, 0);
        var returnedConfig = bridgeConfigService.decideWhichConfigToUse(mockConfigFromBackend);

        expect(returnedConfig).toBe(mockConfigFromBackend);
    });

    it("should use the config from the localStorage because it's newer", function(){
        bridgeDataService.toDefault();
        bridgeConfigService.store(bridgeDataService);

        var mockConfigFromBackend = bridgeConfigService.getDefaultConfig();
        mockConfigFromBackend.savedOn = new Date(1900, 1, 0);
        var returnedConfig = bridgeConfigService.decideWhichConfigToUse(mockConfigFromBackend);

        expect(returnedConfig.savedOn > mockConfigFromBackend.savedOn).toBe(true);
    });

    it("should use the config from the localStorage because the config from backend is empty", function(){
        bridgeDataService.toDefault();
        bridgeConfigService.store(bridgeDataService);

        var mockConfigFromBackend = {};
        var returnedConfig = bridgeConfigService.decideWhichConfigToUse(mockConfigFromBackend);

        expect(returnedConfig).not.toBe(mockConfigFromBackend);
    });

    it("should use the config from the backend because there is none in the local storage", function(){
        var mockConfigFromBackend = bridgeConfigService.getDefaultConfig();
        var returnedConfig = bridgeConfigService.decideWhichConfigToUse(mockConfigFromBackend);

        expect(returnedConfig).toBe(mockConfigFromBackend);
    });

    it("should use the default config because there is no config from the backend and no local config", function(){
        var returnedConfig = bridgeConfigService.decideWhichConfigToUse({});
        expect(returnedConfig.savedOn.getTime()).toBe(new Date(1972, 0, 1).getTime());
    });

    it("should call the persist method because the config has changed", function(){
        var persistCalled = false;
        bridgeConfigService.persistInBackend = function mockPersistInBackend() {
            persistCalled = true;
        };

        bridgeConfigService.configSnapshot = bridgeConfigService.getDefaultConfig();
        bridgeDataService.toDefault();

        bridgeConfigService.store(bridgeDataService);
        bridgeConfigService.persistIfThereAreChanges();

        expect(persistCalled).toBe(true);
    });

    it("should call the persist method because there is not savedOn timestamp in the config snapshot", function(){
        var persistCalled = false;
        bridgeConfigService.persistInBackend = function mockPersistInBackend() {
            persistCalled = true;
        };

        bridgeConfigService.configSnapshot = bridgeConfigService.getDefaultConfig();
        delete bridgeConfigService.configSnapshot.savedOn;
        bridgeDataService.toDefault();

        bridgeConfigService.persistIfThereAreChanges();

        expect(persistCalled).toBe(true);
    });

    it("should not call the persist method because the config has not changed", function(){
        var persistCalled = false;
        bridgeConfigService.persistInBackend = function mockPersistInBackend() {
            persistCalled = true;
        };

        bridgeConfigService.configSnapshot = bridgeConfigService.getDefaultConfig();
        bridgeDataService.toDefault();

        bridgeConfigService.persistIfThereAreChanges();

        expect(persistCalled).toBe(false);
    });
});
