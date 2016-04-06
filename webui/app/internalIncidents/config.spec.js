describe("Internal Incidents config", function(){
    var config = null;
    var bridgeDataService;

    beforeEach(function() {
        module("bridge.service");
        module("app.internalIncidents", function($provide) {
            var app = {};

            $provide.value("bridgeDataService", {
                getAppById: function() {
                    return app;
                }
            });
        });

        inject(["app.internalIncidents.configservice", "bridgeDataService", function(_config, _bridgeDataService){
            bridgeDataService = _bridgeDataService;
            config = _config.getConfigForAppId("test-1");
        }]);
    });

    it("should initialize its config from the backend data", function(){
        config.initialize({
            selection: {
                sel_components: true,
                colleagues: false,
                created_me: false
            },
            columnVisibility: [true, false]
        });

        expect(config.isInitialized).toBe(true);
        expect(config.data.selection.sel_components).toBe(true);
        expect(config.data.selection.colleagues).toBe(false);
        expect(config.data.selection.created_me).toBe(false);
        expect(typeof bridgeDataService.getAppById("test-1").returnConfig).toBe("function");

    });

    it("should use the default column visibility if the amount of columns changed", function(){
        config.initialize({
            selection: {
                sel_components: true,
                colleagues: false,
                created_me: false
            },
            columnVisibility: [true, false]
        });

        expect(config.data.columnVisibility.length).toBe(10);
    });

    it("should not use the default column visibility if the column visibility was stored correctly", function(){
        config.initialize({
            selection: {
                sel_components: true,
                colleagues: false,
                created_me: false
            },
            columnVisibility: [false, false, false, false, false, false, false, false, false, false]
        });

        expect(config.data.columnVisibility[0]).toBe(false);
        expect(config.data.columnVisibility[1]).toBe(false);
        expect(config.data.columnVisibility[2]).toBe(false);
        expect(config.data.columnVisibility[3]).toBe(false);
    });
});
