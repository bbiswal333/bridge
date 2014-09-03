describe("The bridgeConfigService", function () {
    var bridgeConfigService,
        bridgeDataService,
        $window;


    beforeEach(function () {

        module("bridge.service");

        inject(["$window", "bridgeConfig", "bridgeDataService", function (_$window, _bridgeConfigService, _bridgeDataService) {
            bridgeConfigService = _bridgeConfigService;
            bridgeDataService = _bridgeDataService;
            $window = _$window;
        }]);
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
});