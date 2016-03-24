describe("Upport Notes data", function() {
	var upportNotesDataService, configService, $timeout, $httpBackend, detailsResponse;

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

        detailsResponse = {"d":{"results":[{"__metadata": {"type":"irep.reporting.upportNotes.Notes.ItemsType","uri":"https://sithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items('002006825000000049942008')"},"PRG_ID":null,"INT_PRG_NAME":null,"CV_COMPONENT_VERSION_PPMS_CV":"73555000100200002258","CV_COMPONENT_VERSION_PPMS_CV_DESCRIPTION":"MDG Applications 620","PPMS_CV_NAME":"MDG APPLICATIONS 620","CM":"002006825000000049942008","CM_KTEXT":"Test Request 343 long long long long long long long long long long long long long long long long long long long","CM_PROCESSOR":"D031266","CM_PROCESSOR_NAME":"Christoph Vehns","CR_PROCESSOR":null,"CR_PROCESSOR_NAME":null,"CM_ACRF_COMP":"EHS","CM_PRIORITY":"2","CM_STATUS_TEXT":"In Process","PPMS_CV_SW_COMP_T":"MDG_APPL","UPC_PRIORITY":"2","UPC_RESULT":"Required UpPort","UPC_PROC_STATUS":"Skipped!","UPC_RELEASE":"620","SP_NUMBER":"620","SR_REASON":"Does Not Occur","CM_DEV_DLM_ID":"D054624","CM_DEV_DLM_NAME":"MICHAEL MAYER","CM_CREATION_DATE":"\/Date(1226361600000)\/","CM_CREATION_YEAR":"2008","CM_DEV_VP":"ERIK BACHMANN","CM_MESSAGE_NUM":"0000004994","CM_PROCESSOR_ORG_UNIT":null,"CM_COUNTER":1},{"__metadata": {"type":"irep.reporting.upportNotes.Notes.ItemsType","uri":"https://sithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items('002006825000000049942008')"},"PRG_ID":null,"INT_PRG_NAME":null,"CV_COMPONENT_VERSION_PPMS_CV":"67837800100200025215","CV_COMPONENT_VERSION_PPMS_CV_DESCRIPTION":"MDG Applications 619","PPMS_CV_NAME":"MDG APPLICATIONS 619","CM":"002006825000000049942008","CM_KTEXT":"Test Request 343 long long long long long long long long long long long long long long long long long long long","CM_PROCESSOR":"D031266","CM_PROCESSOR_NAME":"Christoph Vehns","CR_PROCESSOR":null,"CR_PROCESSOR_NAME":null,"CM_ACRF_COMP":"EHS","CM_PRIORITY":"2","CM_STATUS_TEXT":"In Process","PPMS_CV_SW_COMP_T":"MDG_APPL","UPC_PRIORITY":"1","UPC_RESULT":"Equivalence Violatio","UPC_PROC_STATUS":"Skipped!","UPC_RELEASE":"619","SP_NUMBER":"SAPK-61903INMDGAPPL","SR_REASON":"Does Not Occur","CM_DEV_DLM_ID":"D054624","CM_DEV_DLM_NAME":"MICHAEL MAYER","CM_CREATION_DATE":"\/Date(1226361600000)\/","CM_CREATION_YEAR":"2008","CM_DEV_VP":"ERIK BACHMANN","CM_MESSAGE_NUM":"0000004994","CM_PROCESSOR_ORG_UNIT":null,"CM_COUNTER":1},{"__metadata": {"type":"irep.reporting.upportNotes.Notes.ItemsType","uri":"https://sithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items('002006825000000049942008')"},"PRG_ID":null,"INT_PRG_NAME":null,"CV_COMPONENT_VERSION_PPMS_CV":"01200615320200020211","CV_COMPONENT_VERSION_PPMS_CV_DESCRIPTION":"MDG Applications 607","PPMS_CV_NAME":"MDG APPLICATIONS 607","CM":"002006825000000049942008","CM_KTEXT":"Test Request 343 long long long long long long long long long long long long long long long long long long long","CM_PROCESSOR":"D031266","CM_PROCESSOR_NAME":"Christoph Vehns","CR_PROCESSOR":null,"CR_PROCESSOR_NAME":null,"CM_ACRF_COMP":"EHS","CM_PRIORITY":"2","CM_STATUS_TEXT":"In Process","PPMS_CV_SW_COMP_T":"MDG_APPL","UPC_PRIORITY":"1","UPC_RESULT":"Equivalence Violatio","UPC_PROC_STATUS":"Skipped!","UPC_RELEASE":"607","SP_NUMBER":"SAPK-60716INMDGAPPL","SR_REASON":"Does Not Occur","CM_DEV_DLM_ID":"D054624","CM_DEV_DLM_NAME":"MICHAEL MAYER","CM_CREATION_DATE":"\/Date(1226361600000)\/","CM_CREATION_YEAR":"2008","CM_DEV_VP":"ERIK BACHMANN","CM_MESSAGE_NUM":"0000004994","CM_PROCESSOR_ORG_UNIT":null,"CM_COUNTER":1}]}};
    });

    it("should be instantiated", function() {
        expect(upportNotesDataService).toBeDefined();
    });

    describe("retrieval", function() {
        describe("summary", function() {
            it("should call the backend service with single config item", function(done) {
                $httpBackend.whenGET("https://xithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items/$count?$filter=CM_PRIORITY eq '1' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID3') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP2')").respond(200, "21");
                $httpBackend.whenGET("https://xithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items/$count?$filter=CM_PRIORITY eq '2' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID3') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP2')").respond(200, "42");
                var configItem = configService.getNewItem();
                configItem.addProgram("ID1", "Program");
                configItem.addProgram("ID2", "Program");
                configItem.addProgram("ID3", "Program");
                configItem.addSoftwareComponent("COMP1");
                configItem.addSoftwareComponent("COMP2");
                configService.addItem(configItem);

                upportNotesDataService.loadSummary().then(function() {
                    expect(upportNotesDataService.summary.prio1).toEqual(21);
                    expect(upportNotesDataService.summary.prio2).toEqual(42);
                    done();
                }, function() {
                    expect("this").toBe("not happening");
                    done();
                });

                $httpBackend.flush();
            });

            it("should call the backend service with single config item and excludes", function(done) {
                $httpBackend.whenGET("https://xithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items/$count?$filter=CM_PRIORITY eq '1' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2')").respond(200, "21");
                $httpBackend.whenGET("https://xithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items/$count?$filter=CM_PRIORITY eq '2' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2')").respond(200, "42");
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
                    expect(upportNotesDataService.summary.prio1).toEqual(21);
                    expect(upportNotesDataService.summary.prio2).toEqual(42);
                    done();
                }, function() {
                    expect("this").toBe("not happening");
                    done();
                });

                $httpBackend.flush();
            });
        });

        describe("details", function() {
            it("should call the backend service with single config item", function(done) {
                $httpBackend.whenGET("https://xithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items?$filter=CM_PRIORITY eq '1' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID3') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP2')").respond(200, detailsResponse);
                $httpBackend.whenGET("https://xithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items?$filter=CM_PRIORITY eq '2' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID3') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP2')").respond(200, detailsResponse);
                var configItem = configService.getNewItem();
                configItem.addProgram("ID1", "Program");
                configItem.addProgram("ID2", "Program");
                configItem.addProgram("ID3", "Program");
                configItem.addSoftwareComponent("COMP1");
                configItem.addSoftwareComponent("COMP2");
                configService.addItem(configItem);

                upportNotesDataService.loadDetails().then(function() {
                    expect(upportNotesDataService.details.length).toEqual(6);
                    done();
                }, function() {
                    expect("this").toBe("not happening");
                    done();
                });

                $httpBackend.flush();
            });

            it("should call the backend service with single config item and excludes", function(done) {
                $httpBackend.whenGET("https://xithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items?$filter=CM_PRIORITY eq '1' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2')").respond(200, detailsResponse);
                $httpBackend.whenGET("https://xithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items?$filter=CM_PRIORITY eq '2' and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2')").respond(200, detailsResponse);
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

                upportNotesDataService.loadDetails().then(function() {
                    expect(upportNotesDataService.details.length).toEqual(6);
                    done();
                }, function() {
                    expect("this").toBe("not happening");
                    done();
                });

                $httpBackend.flush();
            });
        });
    });
});
