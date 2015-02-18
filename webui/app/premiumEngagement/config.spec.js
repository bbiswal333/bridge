describe("The Premium Engagement Config", function(){
    var config;

    beforeEach(function(){
        module("app.premiumEngagement");

        inject(["app.premiumEngagement.configService", function(configService){
            config = configService.getInstanceForAppId("dummy");
        }]);
    });

    it("should set the initialized flag", function(){
        expect(config.isInitialized).toBe(false);
        config.initialize({property: "abc"});
        expect(config.isInitialized).toBe(true);
    });
});
