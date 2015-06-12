describe("Incidents By Saved Search config", function(){
    var config = null;

    beforeEach(function() {
        module("app.incidentSavedSearch");

        inject(["app.incidentSavedSearch.configservice", function(_config){
            config = _config.getConfigForAppId("test-1");
        }]);
    });

    it("should initialize its config from the backend data", function(){
        config.initialize({
            selectedSearchGuid: "abcdefg",
            columnVisibility: [true, false]
        });

        expect(config.isInitialized).toBe(true);
        expect(config.data.selectedSearchGuid).toBe("abcdefg");
    });

    it("should use the default column visibility if the amount of columns changed", function(){
        config.initialize({
            columnVisibility: [true, false]
        });

        expect(config.data.columnVisibility.length).toBe(10);
    });

    it("should not use the default column visibility if the column visibility was stored correctly", function(){
        config.initialize({
            columnVisibility: [false, false, false, false, false, false, false, false, false, false]
        });

        expect(config.data.columnVisibility[0]).toBe(false);
        expect(config.data.columnVisibility[1]).toBe(false);
        expect(config.data.columnVisibility[2]).toBe(false);
        expect(config.data.columnVisibility[3]).toBe(false);
    });
});
