describe("Incidents By Saved Search config", function(){
    var config = null;

    beforeEach(function() {
        module("app.incidentSavedSearch", function($provide) {
            var mockSavedSearchData = {
                getInstanceForAppId: function () {
                    return {
                        savedSearches: [{PARAMETER_: "1234", DESCRIPTION: "TestDummy"}]
                    };
                }
            };

            $provide.value("app.incidentSavedSearch.savedSearchData", mockSavedSearchData);
        });

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

        expect(config.data.columnVisibility.length).toBe(11);
    });

    it("should not use the default column visibility if the column visibility was stored correctly", function(){
        config.initialize({
            columnVisibility: [false, false, false, false, false, false, false, false, false, false, false]
        });

        expect(config.data.columnVisibility[0]).toBe(false);
        expect(config.data.columnVisibility[1]).toBe(false);
        expect(config.data.columnVisibility[2]).toBe(false);
        expect(config.data.columnVisibility[3]).toBe(false);
    });

    it("should return the correct selected saved search object", function(){
        expect(config.getSelectedSavedSearch()).not.toBeDefined();

        config.data.selectedSearchGuid = "1234";
        expect(config.getSelectedSavedSearch().DESCRIPTION).toBe("TestDummy");
    });
});
