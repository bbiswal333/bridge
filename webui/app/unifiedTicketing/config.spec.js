describe("Unified ticketing config", function(){
    var config = null;

    beforeEach(function() {
        module("app.unifiedticketing");

        inject(["app.unifiedticketing.config", function(_config){
            config = _config.getConfigForAppId("test-1");
        }]);
    });

    it("should initialize its config from the backend data", function(){
        expect(config.isInitialized).toBe(false);
        expect(config.lastDataUpdate).toBeDefined();
    });
});
