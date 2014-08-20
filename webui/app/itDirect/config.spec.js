describe("IT Direct config", function(){
    var config = null;

    beforeEach(function() {
        module("app.itdirect");

        inject(["app.itdirect.config", function(_config){
            config = _config;
        }]);
    });

    it("should initialize its config from the backend data", function(){
        config.initialize({oIncludeSavedSearch: {value: true}, sSavedSearchToInclude: "IamAFakeSearchKey"});

        expect(config.oIncludeSavedSearch.value).toBe(true);
        expect(config.sSavedSearchToInclude).toBe("IamAFakeSearchKey");
    });
});