describe("Unified ticketing config", function(){
    var config = null;
    var bridgeDataService;

    beforeEach(function() {
        module("app.unifiedticketing", function($provide) {
            var app = {};
            $provide.value("bridgeDataService", {
                getAppById: function() {
                    return app;
                }
            });
        });

        inject(["app.unifiedticketing.config", "bridgeDataService", function(_config, _bridgeDataService){
            config = _config.getConfigForAppId("test-1");
            bridgeDataService = _bridgeDataService;
        }]);
    });

    it("should initialize its config from the backend data", function(){
        expect(config.isInitialized).toBe(false);
        expect(config.lastDataUpdate).toBeDefined();
    });

    it("should append the return config function to app", function() {
        expect(typeof bridgeDataService.getAppById("test-1").returnConfig).toBe("function");
    });
});
