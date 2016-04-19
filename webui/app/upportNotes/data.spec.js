describe("Upport Notes data", function() {
	var upportNotesDataService, configService, $httpBackend, detailsResponse, $timeout;

    var postRequestBeginning = "--batch\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nGET ";
    var postRequestEnd = " HTTP/1.1\r\n\r\n\r\n--batch--";

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

        inject(["$httpBackend", "app.upportNotes.dataService", "app.upportNotes.configService", "$timeout", function (_$httpBackend, _upportNotesDataService, _configService, _$timeout) {
            upportNotesDataService = _upportNotesDataService.getDataForAppId("app.test");
            configService = _configService.getConfigForAppId("app.test");
            $httpBackend = _$httpBackend;
            $timeout = _$timeout;
        }]);

        detailsResponse = '--5C88237DA881B655011985438CB700C20\r\nContent-Type: application/http\r\nContent-Length: 26123\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: 26049\r\n\r\n{"d":{"results":[{"__metadata": {"type":"irep.reporting.upportNotes.Notes.ItemsType","uri":"https://sithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items(\'002006825000000049942008\')"},"PRG_ID":null,"INT_PRG_NAME":null,"CV_COMPONENT_VERSION_PPMS_CV":"73555000100200002258","CV_COMPONENT_VERSION_PPMS_CV_DESCRIPTION":"MDG Applications 620","PPMS_CV_NAME":"MDG APPLICATIONS 620","CM":"002006825000000049942008","CM_KTEXT":"Test Request 343 long long long long long long long long long long long long long long long long long long long","CM_PROCESSOR":"D031266","CM_PROCESSOR_NAME":"Christoph Vehns","CR_PROCESSOR":null,"CR_PROCESSOR_NAME":null,"CM_ACRF_COMP":"EHS","CM_PRIORITY":"2","CM_STATUS_TEXT":"In Process","PPMS_CV_SW_COMP_T":"MDG_APPL","UPC_PRIORITY":"2","UPC_RESULT":"Required UpPort","UPC_PROC_STATUS":"Skipped!","UPC_RELEASE":"620","SP_NUMBER":"620","SR_REASON":"Does Not Occur","CM_DEV_DLM_ID":"D054624","CM_DEV_DLM_NAME":"MICHAEL MAYER","CM_CREATION_DATE":"\/Date(1226361600000)\/","CM_CREATION_YEAR":"2008","CM_DEV_VP":"ERIK BACHMANN","CM_MESSAGE_NUM":"0000004994","CM_PROCESSOR_ORG_UNIT":null,"CM_COUNTER":1},{"__metadata": {"type":"irep.reporting.upportNotes.Notes.ItemsType","uri":"https://sithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items(\'002006825000000049942008\')"},"PRG_ID":null,"INT_PRG_NAME":null,"CV_COMPONENT_VERSION_PPMS_CV":"67837800100200025215","CV_COMPONENT_VERSION_PPMS_CV_DESCRIPTION":"MDG Applications 619","PPMS_CV_NAME":"MDG APPLICATIONS 619","CM":"002006825000000049942008","CM_KTEXT":"Test Request 343 long long long long long long long long long long long long long long long long long long long","CM_PROCESSOR":"D031266","CM_PROCESSOR_NAME":"Christoph Vehns","CR_PROCESSOR":null,"CR_PROCESSOR_NAME":null,"CM_ACRF_COMP":"EHS","CM_PRIORITY":"2","CM_STATUS_TEXT":"In Process","PPMS_CV_SW_COMP_T":"MDG_APPL","UPC_PRIORITY":"1","UPC_RESULT":"Equivalence Violatio","UPC_PROC_STATUS":"Skipped!","UPC_RELEASE":"619","SP_NUMBER":"SAPK-61903INMDGAPPL","SR_REASON":"Does Not Occur","CM_DEV_DLM_ID":"D054624","CM_DEV_DLM_NAME":"MICHAEL MAYER","CM_CREATION_DATE":"\/Date(1226361600000)\/","CM_CREATION_YEAR":"2008","CM_DEV_VP":"ERIK BACHMANN","CM_MESSAGE_NUM":"0000004994","CM_PROCESSOR_ORG_UNIT":null,"CM_COUNTER":1},{"__metadata": {"type":"irep.reporting.upportNotes.Notes.ItemsType","uri":"https://sithdb.wdf.sap.corp/irep/reporting/upportNotes/Notes.xsodata/Items(\'002006825000000049942008\')"},"PRG_ID":null,"INT_PRG_NAME":null,"CV_COMPONENT_VERSION_PPMS_CV":"01200615320200020211","CV_COMPONENT_VERSION_PPMS_CV_DESCRIPTION":"MDG Applications 607","PPMS_CV_NAME":"MDG APPLICATIONS 607","CM":"002006825000000049942008","CM_KTEXT":"Test Request 343 long long long long long long long long long long long long long long long long long long long","CM_PROCESSOR":"D031266","CM_PROCESSOR_NAME":"Christoph Vehns","CR_PROCESSOR":null,"CR_PROCESSOR_NAME":null,"CM_ACRF_COMP":"EHS","CM_PRIORITY":"2","CM_STATUS_TEXT":"In Process","PPMS_CV_SW_COMP_T":"MDG_APPL","UPC_PRIORITY":"1","UPC_RESULT":"Equivalence Violatio","UPC_PROC_STATUS":"Skipped!","UPC_RELEASE":"607","SP_NUMBER":"SAPK-60716INMDGAPPL","SR_REASON":"Does Not Occur","CM_DEV_DLM_ID":"D054624","CM_DEV_DLM_NAME":"MICHAEL MAYER","CM_CREATION_DATE":"\/Date(1226361600000)\/","CM_CREATION_YEAR":"2008","CM_DEV_VP":"ERIK BACHMANN","CM_MESSAGE_NUM":"0000004994","CM_PROCESSOR_ORG_UNIT":null,"CM_COUNTER":1}]}}\r\n--5C88237DA881B655011985438CB700C20--\r\n';
    });

    it("should be instantiated", function() {
        expect(upportNotesDataService).toBeDefined();
    });

    describe("retrieval", function() {
        describe("summary", function() {
            it("should only call the backend if a query string is generated", function(done) {
                var configItem = configService.getNewItem();
                configService.addItem(configItem);

                upportNotesDataService.loadSummary().then(function() {
                    expect(upportNotesDataService.summary.prio1).toEqual(0);
                    expect(upportNotesDataService.summary.prio2).toEqual(0);
                    done();
                }, function() {
                    expect("this").toBe("not happening");
                    done();
                });

                $timeout.flush();
            });

            it("should call the backend service with single config item", function(done) {
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items/$count?$filter=CM_PRIORITY eq '1' and ((CM_CREATION_DATE gt datetime'2016-04-15T07:08:18.804Z') and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID3') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP2') and (CM_ACRF_COMP eq 'COMP3' or startswith(CM_ACRF_COMP, 'COMP4')))") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n21\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items/$count?$filter=CM_PRIORITY eq '2' and ((CM_CREATION_DATE gt datetime'2016-04-15T07:08:18.804Z') and (PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID3') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP2') and (CM_ACRF_COMP eq 'COMP3' or startswith(CM_ACRF_COMP, 'COMP4')))") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n42\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
                var configItem = configService.getNewItem();
                configItem.addProgram("ID1", "Program");
                configItem.addProgram("ID2", "Program");
                configItem.addProgram("ID3", "Program");
                configItem.addSoftwareComponent("COMP1");
                configItem.addSoftwareComponent("COMP2");
                configItem.addApplicationComponent("COMP3");
                configItem.addApplicationComponent("COMP4*");
                configItem.setCreationDate(new Date("2016-04-15T07:08:18.804Z"));
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

            it("should call the backend service with single config item and excludes I", function(done) {
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items/$count?$filter=CM_PRIORITY eq '1' and ((PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2') and (CM_ACRF_COMP eq 'COMP3' or startswith(CM_ACRF_COMP, 'COMP4') and not startswith(CM_ACRF_COMP, 'COMP5')))") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n21\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items/$count?$filter=CM_PRIORITY eq '2' and ((PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2') and (CM_ACRF_COMP eq 'COMP3' or startswith(CM_ACRF_COMP, 'COMP4') and not startswith(CM_ACRF_COMP, 'COMP5')))") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n42\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
                var configItem = configService.getNewItem();
                configItem.addProgram("ID1", "Program");
                configItem.addProgram("ID2", "Program");
                configItem.addProgram("ID3", "Program").exclude = true;
                configItem.addProgram("ID4", "Program");
                configItem.addProgram("ID5", "Program").exclude = true;
                configItem.addSoftwareComponent("COMP1");
                configItem.addSoftwareComponent("COMP2").exclude = true;
                configItem.addSoftwareComponent("COMP3");
                configItem.addApplicationComponent("COMP3");
                configItem.addApplicationComponent("COMP5*").exclude = true;
                configItem.addApplicationComponent("COMP4*");
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

            it("should call the backend service with single config item and excludes II", function(done) {
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items/$count?$filter=CM_PRIORITY eq '1' and ((PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2') and (not startswith(CM_ACRF_COMP, 'COMP1')))") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n21\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items/$count?$filter=CM_PRIORITY eq '2' and ((PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2') and (not startswith(CM_ACRF_COMP, 'COMP1')))") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n42\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
                var configItem = configService.getNewItem();
                configItem.addProgram("ID1", "Program");
                configItem.addProgram("ID2", "Program");
                configItem.addProgram("ID3", "Program").exclude = true;
                configItem.addProgram("ID4", "Program");
                configItem.addProgram("ID5", "Program").exclude = true;
                configItem.addSoftwareComponent("COMP1");
                configItem.addSoftwareComponent("COMP2").exclude = true;
                configItem.addSoftwareComponent("COMP3");
                configItem.addApplicationComponent("COMP1*").exclude = true;
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

            it("should call the backend service with multiple config items", function(done) {
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items/$count?$filter=CM_PRIORITY eq '1' and ((PRG_ID eq 'ID1' and PRG_ID ne 'ID2') and (PPMS_CV_SW_COMP_T eq 'COMP1') and (not startswith(CM_ACRF_COMP, 'COMP1')) or (PRG_ID eq 'ID3') and (startswith(CM_ACRF_COMP, 'COMP1')))") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n21\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items/$count?$filter=CM_PRIORITY eq '2' and ((PRG_ID eq 'ID1' and PRG_ID ne 'ID2') and (PPMS_CV_SW_COMP_T eq 'COMP1') and (not startswith(CM_ACRF_COMP, 'COMP1')) or (PRG_ID eq 'ID3') and (startswith(CM_ACRF_COMP, 'COMP1')))") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n42\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
                var configItem = configService.getNewItem();
                configItem.addProgram("ID1", "Program");
                configItem.addProgram("ID2", "Program").exclude = true;
                configItem.addSoftwareComponent("COMP1");
                configItem.addApplicationComponent("COMP1*").exclude = true;
                configService.addItem(configItem);

                configItem = configService.getNewItem();
                configItem.addProgram("ID3", "Program");
                configItem.addApplicationComponent("COMP1*");
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
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items?$format=json&$filter=CM_PRIORITY eq '1' and ((PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID3') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP2') and (CM_PROCESSOR eq 'D0123456' or CM_PROCESSOR eq 'D0123457'))") + postRequestEnd).respond(200, detailsResponse);
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items?$format=json&$filter=CM_PRIORITY eq '2' and ((PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID3') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP2') and (CM_PROCESSOR eq 'D0123456' or CM_PROCESSOR eq 'D0123457'))") + postRequestEnd).respond(200, detailsResponse);
                var configItem = configService.getNewItem();
                configItem.addProgram("ID1", "Program");
                configItem.addProgram("ID2", "Program");
                configItem.addProgram("ID3", "Program");
                configItem.addSoftwareComponent("COMP1");
                configItem.addSoftwareComponent("COMP2");
                configItem.addProcessor("D0123456");
                configItem.addProcessor("D0123457");
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
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items?$format=json&$filter=CM_PRIORITY eq '1' and ((PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2') and (CM_PROCESSOR eq 'D0123457' and CM_PROCESSOR ne 'D0123455' and CM_PROCESSOR ne 'D0123456'))") + postRequestEnd).respond(200, detailsResponse);
                $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", postRequestBeginning + encodeURI("Items?$format=json&$filter=CM_PRIORITY eq '2' and ((PRG_ID eq 'ID1' or PRG_ID eq 'ID2' or PRG_ID eq 'ID4' and PRG_ID ne 'ID3' and PRG_ID ne 'ID5') and (PPMS_CV_SW_COMP_T eq 'COMP1' or PPMS_CV_SW_COMP_T eq 'COMP3' and PPMS_CV_SW_COMP_T ne 'COMP2') and (CM_PROCESSOR eq 'D0123457' and CM_PROCESSOR ne 'D0123455' and CM_PROCESSOR ne 'D0123456'))") + postRequestEnd).respond(200, detailsResponse);
                var configItem = configService.getNewItem();
                configItem.addProgram("ID1", "Program");
                configItem.addProgram("ID2", "Program");
                configItem.addProgram("ID3", "Program").exclude = true;
                configItem.addProgram("ID4", "Program");
                configItem.addProgram("ID5", "Program").exclude = true;
                configItem.addSoftwareComponent("COMP1");
                configItem.addSoftwareComponent("COMP2").exclude = true;
                configItem.addSoftwareComponent("COMP3");
                configItem.addProcessor("D0123455").exclude = true;
                configItem.addProcessor("D0123456").exclude = true;
                configItem.addProcessor("D0123457");
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
