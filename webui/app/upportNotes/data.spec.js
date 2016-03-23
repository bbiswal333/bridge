ddescribe("Upport Notes data", function() {
	var upportNotesDataService, configService, $timeout, $httpBackend;

	beforeEach(function () {
        module("app.upportNotes", function($provide){
            var mockDataService = {
                hasConfigForUpportNotes: false,
                getAppConfigById: function () {
                    if (this.hasConfigForUpportNotes) {
                        return JSON.parse('{"configItems":[{"programs": [{"PRG_ID": "PROGRAM1"}, {"PRG_ID": "PROGRAM2"}], "softwareComponents": [{"Component": "Comp1"}, {"Component": "Comp2"}]}, {"programs": [], "softwareComponents": [{"Component": "Comp3", "exclude": true}]}]}');
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

        inject(["$httpBackend", "$timeout", "app.upportNotes.dataService", "app.upportNotes.configService", function (_$httpBackend, _$timeout, _upportNotesDataService, _configService) {
            upportNotesDataService = _upportNotesDataService.getDataForAppId("app.test");
            configService = _configService.getConfigForAppId("app.test");
            $timeout = _$timeout;
            $httpBackend = _$httpBackend;
        }]);
    });

    it("should be instantiated", function() {
        expect(upportNotesDataService).toBeDefined();
    });

    describe("retrieval", function() {
        it("should call the backend service with single config item", function(done) {
            $httpBackend.whenGET("https://sithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items/$count?$filter=CM_PRIORITY eq '1' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID3') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP2')").respond(200, "21");
            $httpBackend.whenGET("https://sithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items/$count?$filter=CM_PRIORITY eq '2' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID3') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP2')").respond(200, "42");
            var configItem = configService.getNewItem();
            configItem.addProgram("ID1", "Program");
            configItem.addProgram("ID2", "Program");
            configItem.addProgram("ID3", "Program");
            configItem.addSoftwareComponent("COMP1");
            configItem.addSoftwareComponent("COMP2");
            configService.addItem(configItem);

            upportNotesDataService.loadSummary().then(function() {
                upportNotesDataService.summary.prio1 = 21;
                upportNotesDataService.summary.prio1 = 42;
                done();
            }, function() {
                expect("this").toBe("not happening");
                done();
            });

            $httpBackend.flush();
        });

        it("should call the backend service with single config item and excludes", function(done) {
            $httpBackend.whenGET("https://sithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items/$count?$filter=CM_PRIORITY eq '1' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2')").respond(200, "21");
            $httpBackend.whenGET("https://sithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items/$count?$filter=CM_PRIORITY eq '2' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2')").respond(200, "42");
            var configItem = configService.getNewItem();
            configItem.addProgram("ID1", "Program");
            configItem.addProgram("ID2", "Program");
            configItem.addProgram("ID3", "Program").exclude = true;
            configItem.addProgram("ID4", "Program");
            configItem.addProgram("ID5", "Program").exclude = true;
            configItem.addSoftwareComponent("COMP1");
            configItem.addSoftwareComponent("COMP2").exclude = true;
            configItem.addSoftwareComponent("COMP3");
            configService.addItem(configItem);

            upportNotesDataService.loadSummary().then(function() {
                upportNotesDataService.summary.prio1 = 21;
                upportNotesDataService.summary.prio1 = 42;
                done();
            }, function() {
                expect("this").toBe("not happening");
                done();
            });

            $httpBackend.flush();
        });
    });
});
