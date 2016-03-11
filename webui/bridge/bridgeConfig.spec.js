describe("The bridgeConfigService", function () {
    var bridgeConfigService,
        bridgeDataService,
        $window,
        $httpBackend,
        bridgeInstance;


    beforeEach(function () {

        module("bridge.service");

        inject(["$window", "$httpBackend", "bridgeConfig", "bridgeDataService", "bridgeInstance", "bridgeUserData", function (_$window, _$httpBackend, _bridgeConfigService, _bridgeDataService, _bridgeInstance, bridgeUserData) {
            bridgeConfigService = _bridgeConfigService;
            bridgeDataService = _bridgeDataService;
            $window = _$window;
            $httpBackend = _$httpBackend;
            bridgeInstance = _bridgeInstance;
            bridgeUserData.getUserDataSynchronous = function() {
                return {BNAME: "D049677"};
            };
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
        bridgeDataService.getProjects()[0].apps[0].scope = {
            box: {
                returnConfig: function () {
                    return {
                        testValue: "testTest"
                    };
                }
            }
        };
        var payload = bridgeConfigService.constructPayload(bridgeDataService);

        expect(payload.projects[0].apps.length).toBe(2);
        expect(payload.projects[0].apps[0].appConfig.testValue).toBe("testTest");
        expect(angular.isObject(payload.bridgeSettings)).toBe(true);
    });

    it("should store only app metadata that differs from the original metadata + module_name, guid, instanceNumber", function() {
        bridgeDataService.toDefault();
        bridgeDataService.getProjects()[0].apps[0].metadata.title = "V7Z ATC Results";
        bridgeDataService.getProjects()[0].apps[0].scope = {
            box: {
                returnConfig: function () {
                    return {
                        testValue: "testTest"
                    };
                }
            }
        };
        var payload = bridgeConfigService.constructPayload(bridgeDataService);
        expect(JSON.stringify(payload.projects[0].apps)).toEqual('[{"metadata":{"module_name":"app.atc","title":"V7Z ATC Results","instanceNumber":1,"guid":"app.atc-1"},"appConfig":{"testValue":"testTest"}},{"metadata":{"module_name":"app.cats","instanceNumber":1,"guid":"app.cats-1"}}]');
    });

    it("should return the old app config if there is no return config method", function(){
        bridgeDataService.toDefault();
        bridgeDataService.getProjects()[0].apps[0].appConfig = {
            testValue: "testTest"
        };
        var payload = bridgeConfigService.constructPayload(bridgeDataService);

        expect(payload.projects[0].apps[0].appConfig.testValue).toBe("testTest");
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

    it("should use the config from the localStorage because the config from backend null", function(){
        bridgeDataService.toDefault();
        bridgeConfigService.store(bridgeDataService);

        var mockConfigFromBackend = null;
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

    it("should load a team view from backend", function() {
        $httpBackend.expectGET('http://ifp.wdf.sap.corp/sap/bc/bridge/GET_VIEW?view=viewId&owner=owner&instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin)).respond("200", {apps: []});
        bridgeConfigService.getTeamConfig("owner", "viewId").then(function(config) {
            expect(config).toBeDefined();
            expect(config.apps.length).toEqual(0);
        });
    });

    it("should save own views via separate calls", function() {
        bridgeDataService.toDefault();
        bridgeDataService.getProjects().push({type: "TEAM", view: "testGuid", owner: "D049677", name: "view name", apps: []});
        $httpBackend.expectPOST('https://ifp.wdf.sap.corp/sap/bc/bridge/SET_VIEW?view=testGuid&viewName=view name&instance=server&origin=' + encodeURIComponent($window.location.origin),
        function validate(data){
            var oData = angular.fromJson(data);
            if (oData.apps.length === 0 && oData.name !== undefined){
                return true;
            } else {
                return false;
            }
        }).respond("200", {});
        bridgeConfigService.store(bridgeDataService);
        $httpBackend.flush();
    });
});
