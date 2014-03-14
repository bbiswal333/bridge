describe("Manages the ATC app-configuration", function () {

    var $rootScope;
    var atcConfigService;

    beforeEach(function () {

        module("app.atc");

        inject(["$rootScope", "app.atc.configservice", function (rootScope, _atcConfigService) {
            $rootScope = rootScope;
            atcConfigService = _atcConfigService;
        }]);
    });

    it("shoud create the correct query string", function () {
        var myConfig = atcConfigService;
        myConfig.addConfigItem(createConfigItemForSystem("V7Z"));
        expect(myConfig.getQueryString()).toBe("V7Z;S_DEVREPORTING;D051804;BA-BS;X;X;;X;;X");

        myConfig.addConfigItem(createConfigItemForSystem("CI3"));
        expect(myConfig.getConfigItems().length).toBe(2);

        expect(myConfig.getQueryString()).toBe("V7Z;S_DEVREPORTING;D051804;BA-BS;X;X;;X;;X|CI3;S_DEVREPORTING;D051804;BA-BS;X;X;;X;;X");
    });

    function createConfigItemForSystem(System) {
        var myConfigItem = new atcConfigService.newItem();

        myConfigItem.srcSystem = System;
        myConfigItem.devClass = "S_DEVREPORTING";
        myConfigItem.tadirResponsible = "D051804";
        myConfigItem.component = "BA-BS";
        myConfigItem.showSuppressed = true;
        myConfigItem.displayPrio1 = true;
        myConfigItem.displayPrio3 = true;
        myConfigItem.onlyInProcess = true;
        return myConfigItem;
    }

});