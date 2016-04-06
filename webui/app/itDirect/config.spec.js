describe("IT Direct config", function(){
    var bridgeDataService;
    var config = null;

    beforeEach(function() {
        module("app.itdirect", function($provide) {
            var app = {};

            $provide.value("bridgeDataService", {
                getAppById: function() {
                    return app;
                }
            });
        });

        inject(["app.itdirect.config", "bridgeDataService", function(_config, _bridgeDataService){
            config = _config.getConfigForAppId("Dummy");
            bridgeDataService = _bridgeDataService;
        }]);
    });

    it("should initialize its config from the backend data", function(){
        config.initialize({bIncludeSavedSearch: true, sSavedSearchToInclude: "IamAFakeSearchKey"});

        expect(config.isInitialized).toBe(true);
        expect(config.bIncludeSavedSearch).toBe(true);
        expect(config.sSavedSearchToInclude).toBe("IamAFakeSearchKey");
        expect(typeof bridgeDataService.getAppById("Dummy").returnConfig).toBe("function");
        //expect(config.lastDataUpdate).toBe(new Date(1408700044615));
    });
});
