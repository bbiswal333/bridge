describe("IT Direct config", function(){
    var config = null;

    beforeEach(function() {
        module("app.itdirect");

        inject(["app.itdirect.config", function(_config){
            config = _config;
        }]);
    });

    it("should initialize its config from the backend data", function(){
        config.initialize({bIncludeSavedSearch: true, sSavedSearchToInclude: "IamAFakeSearchKey"});

        expect(config.isInitialized).toBe(true);
        expect(config.bIncludeSavedSearch).toBe(true);
        expect(config.sSavedSearchToInclude).toBe("IamAFakeSearchKey");
        //expect(config.lastDataUpdate).toBe(new Date(1408700044615));
    });
});
