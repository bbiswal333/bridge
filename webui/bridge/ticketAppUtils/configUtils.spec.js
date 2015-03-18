describe("The Ticket App Config Utils", function(){
    var configUtils;

    beforeEach(function(){
        module("bridge.ticketAppUtils");

        inject(["bridge.ticketAppUtils.configUtils", function(_configUtils){
            configUtils = _configUtils;
        }]);
    });

    it("should copy the properties from the backend config to the target", function(){
        var oLocalConfig = {
            user: "abc",
            money: 500
        };
        var oBackendConfig = {
            user: "newBackendUser",
            money: 900
        };

        configUtils.applyBackendConfig(oLocalConfig, oBackendConfig);
        expect(oLocalConfig.user).toBe("newBackendUser");
        expect(oLocalConfig.money).toBe(900);
    });

    it("should use the default column visibility if the amount of columns changed", function(){
        var oLocalConfig = {
            columnVisibility: [true, true, true]
        };
        var oBackendConfig = {
            columnVisibility: [true, false]
        };
        configUtils.applyBackendConfig(oLocalConfig, oBackendConfig);
        expect(oLocalConfig.columnVisibility.length).toBe(3);
        expect(oLocalConfig.columnVisibility[1]).toBe(true);
    });
});
