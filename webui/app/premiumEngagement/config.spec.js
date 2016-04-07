describe("The Premium Engagement Config", function(){
    var config, bridgeDataService;

    beforeEach(function(){
        module("app.premiumEngagement", function($provide) {
            var app = {};
            $provide.value("bridgeDataService", {
                getAppById: function() {
                    return app;
                }
            });
        });

        inject(["app.premiumEngagement.configService", "bridgeDataService", function(configService, _bridgeDataService_){
            config = configService.getInstanceForAppId("dummy");
            bridgeDataService = _bridgeDataService_;
        }]);
    });

    it("should set the initialized flag", function(){
        expect(config.isInitialized).toBe(false);
        config.initialize({property: "abc"});
        expect(config.isInitialized).toBe(true);
    });

    it("should append the config to the app", function() {
        expect(typeof bridgeDataService.getAppById("dummy").returnConfig).toBe("function");
    });
});
