describe("Incidents By Saved Search config", function(){
    var config = null;
    var bridgeDataService;

    beforeEach(function() {
        module("bridge.service");
        module("app.incidentSavedSearch", function($provide) {
            var mockSavedSearchData = {
                getInstanceForAppId: function () {
                    return {
                        savedSearches: [{PARAMETER_: "1234", DESCRIPTION: "TestDummy"}]
                    };
                }
            };

            $provide.value("app.incidentSavedSearch.savedSearchData", mockSavedSearchData);

            var app = {};
            $provide.value("bridgeDataService", {
                getAppById: function() {
                    return app;
                }
            });
        });

        inject(["app.incidentSavedSearch.configservice", "bridgeDataService", function(_config, _bridgeDataService){
            bridgeDataService = _bridgeDataService;
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
        expect(typeof bridgeDataService.getAppById("appId1").returnConfig).toBe("function");
    });

    it("should return the correct selected saved search object", function(){
        expect(config.getSelectedSavedSearch()).not.toBeDefined();

        config.data.selectedSearchGuid = "1234";
        expect(config.getSelectedSavedSearch().DESCRIPTION).toBe("TestDummy");
    });
});
