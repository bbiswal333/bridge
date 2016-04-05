describe("Manages the ATC app-configuration", function () {

    var bridgeDataService;
    var atcConfigService;
    var AKHResponsibleFactory;
    var $timeout;
    var $httpBackend;

     function createConfigItemForSystem(System, withAKHResponsible) {
        var myConfigItem = atcConfigService.newItem();

        myConfigItem.srcSystems = [{value: System}];
        myConfigItem.devClasses = [{value: "S_DEVREPORTING"}];
        myConfigItem.tadirResponsibles = ["D051804"];
        myConfigItem.components = [{value: "BA-BS"}];
        myConfigItem.showSuppressed = true;
        myConfigItem.displayPrio1 = true;
        myConfigItem.displayPrio3 = true;
        myConfigItem.onlyInProcess = true;
        myConfigItem.onlyProductionRelevant = true;
        if(withAKHResponsible) {
            myConfigItem.akhResponsibles.push(AKHResponsibleFactory.createInstance("MY_PROP", "D0123456"));
        }
        return myConfigItem;
    }

     beforeEach(function () {
        module("bridge.service");
        module("app.atc", function($provide){
            var mockDataService = {
                hasConfigForATC: true,
                getAppConfigById: function () {
                    if (this.hasConfigForATC) {
                        return JSON.parse('{"configItems":[{"srcSystem":"Z7Y","devClass":"","tadirResponsible":"","component":"","showSuppressed":false,"displayPrio1":true,"displayPrio2":true,"displayPrio3":true,"displayPrio4":true,"onlyInProcess":true, "onlyProductionRelevant": true}]}');
                    } else {
                        return {};
                    }
                },
                getAppById: function() {
                    return {};
                },
                getUserInfo: function () {
                    return {};
                }
            };

            $provide.value("bridgeDataService", mockDataService);
        });

        inject(["$httpBackend", "$timeout", "bridge.AKHResponsibleFactory", "app.atc.configservice", "bridgeDataService", function (_$httpBackend, _$timeout, _AKHResponsibleFactory, _atcConfigService, _bridgeDataService) {
            atcConfigService = _atcConfigService.getConfigForAppId("app.test");
            bridgeDataService = _bridgeDataService;
            $timeout = _$timeout;
            AKHResponsibleFactory = _AKHResponsibleFactory;
            $httpBackend = _$httpBackend;
        }]);

        $httpBackend.whenGET(/https:\/\/mithdb\.wdf\.sap\.corp/).respond({"d":{"results":[{"__metadata": {"type":"irep.reporting.internalIncidents.components.ComponentType","uri":"https://mithdb.wdf.sap.corp/irep/reporting/internalIncidents/components.xsodata/Component('AC')"},"PS_POSID":"CA-CS","DEV_UID_DM":"D022544","DEV_UID_DLVRY_M":"D022544","DEV_UID_PRDOWNER":"I844258","SL3_DEV_HANDOVER":" "}]}});
    });

    it("shoud create the correct query string", function (done) {
        var myConfig = atcConfigService;
        myConfig.addConfigItem(createConfigItemForSystem("V7Z"));
        myConfig.getQueryString().then(function(queryString) {
            expect(queryString).toBe("V7Z;S_DEVREPORTING;D051804;BA-BS;X;X;X;X;;X;;*FA*;");
        });
        $timeout.flush();

        myConfig.addConfigItem(createConfigItemForSystem("CI3"));
        expect(myConfig.getConfigItems().length).toBe(2);

        myConfig.getQueryString().then(function(queryString) {
            expect(queryString).toBe("V7Z;S_DEVREPORTING;D051804;BA-BS;X;X;X;X;;X;;*FA*;|CI3;S_DEVREPORTING;D051804;BA-BS;X;X;X;X;;X;;*FA*;");
            done();
        });
        $timeout.flush();
    });

    it("shoud create the correct query string with AKHResponsible", function (done) {
        var myConfig = atcConfigService;
        myConfig.addConfigItem(createConfigItemForSystem("V7Z", true));
        myConfig.getQueryString().then(function(queryString) {
            expect(queryString).toBe("V7Z;S_DEVREPORTING;D051804;BA-BS,CA-CS;X;X;X;X;;X;;*FA*;");
            done();
        });
        $httpBackend.flush();
    });

    it("should initialize itself from the bridge config service", function () {
        atcConfigService.initialize();
        expect(atcConfigService.isInitialized).toBe(true);

        expect(atcConfigService.configItems.length).toBe(1);
        expect(atcConfigService.configItems[0].srcSystems).toEqual([{value: "Z7Y"}]);
    });

    it("should initialize itself with the default config if no backend config is available", function () {
        bridgeDataService.hasConfigForATC = false;
        atcConfigService.initialize();

        expect(atcConfigService.configItems.length).toBe(1);
        expect(atcConfigService.configItems[0].tadirResponsible).toBeDefined();
    });

});
