describe("Internal Incidents config", function(){
    var config = null;

    beforeEach(function() {
        module("app.internalIncidents");

        inject(["app.internalIncidents.configservice", function(_config){
            config = _config;
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

        expect(config.data.columnVisibility.length).toBe(9);
    });

    it("should not use the default column visibility if the column visibility was stored correctly", function(){
        config.initialize({
            selection: {
                sel_components: true,
                colleagues: false,
                created_me: false
            },
            columnVisibility: [false, false, false, false, false, false, false, false, false]
        });

        expect(config.data.columnVisibility[0]).toBe(false);
        expect(config.data.columnVisibility[1]).toBe(false);
        expect(config.data.columnVisibility[2]).toBe(false);
        expect(config.data.columnVisibility[3]).toBe(false);
    });
});
