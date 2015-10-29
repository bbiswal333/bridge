describe("Manages the ATC app-configuration", function () {

    var bridgeDataService;
    var atcConfigService;

     function createConfigItemForSystem(System) {
        var myConfigItem = atcConfigService.newItem();

        myConfigItem.srcSystems = [System];
        myConfigItem.devClasses = ["S_DEVREPORTING"];
        myConfigItem.tadirResponsibles = ["D051804"];
        myConfigItem.components = ["BA-BS"];
        myConfigItem.showSuppressed = true;
        myConfigItem.displayPrio1 = true;
        myConfigItem.displayPrio3 = true;
        myConfigItem.onlyInProcess = true;
        return myConfigItem;
    }

     beforeEach(function () {
        module("app.atc", function($provide){
            var mockDataService = {
                hasConfigForATC: true,
                getAppConfigById: function () {
                    if (this.hasConfigForATC) {
                        return JSON.parse('{"configItems":[{"srcSystem":"Z7Y","devClass":"","tadirResponsible":"","component":"","showSuppressed":false,"displayPrio1":true,"displayPrio2":true,"displayPrio3":true,"displayPrio4":true,"onlyInProcess":true}]}');
                    } else {
                        return {};
                    }
                },
                getUserInfo: function () {
                    return {};
                }
            };

            $provide.value("bridgeDataService", mockDataService);
        });

        inject(["app.atc.configservice", "bridgeDataService", function (_atcConfigService, _bridgeDataService) {
            atcConfigService = _atcConfigService.getConfigForAppId("app.test");
            bridgeDataService = _bridgeDataService;
        }]);
    });

    it("shoud create the correct query string", function () {
        var myConfig = atcConfigService;
        myConfig.addConfigItem(createConfigItemForSystem("V7Z"));
        expect(myConfig.getQueryString()).toBe("V7Z;S_DEVREPORTING;D051804;BA-BS;X;X;X;X;;X;");

        myConfig.addConfigItem(createConfigItemForSystem("CI3"));
        expect(myConfig.getConfigItems().length).toBe(2);

        expect(myConfig.getQueryString()).toBe("V7Z;S_DEVREPORTING;D051804;BA-BS;X;X;X;X;;X;|CI3;S_DEVREPORTING;D051804;BA-BS;X;X;X;X;;X;");
    });

    it("should initialize itself from the bridge config service", function () {
        atcConfigService.initialize();
        expect(atcConfigService.isInitialized).toBe(true);

        expect(atcConfigService.configItems.length).toBe(1);
        expect(atcConfigService.configItems[0].srcSystems).toEqual(["Z7Y"]);
    });

    it("should initialize itself with the default config if no backend config is available", function () {
        bridgeDataService.hasConfigForATC = false;
        atcConfigService.initialize();

        expect(atcConfigService.configItems.length).toBe(1);
        expect(atcConfigService.configItems[0].tadirResponsible).toBeDefined();
    });

});
