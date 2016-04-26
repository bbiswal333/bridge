ddescribe("Incidents data", function() {
	var dataService, configService, $httpBackend, $timeout, AKHResponsibleFactory;

    var postRequestBeginning = "--batch\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nGET ";
    var postRequestEnd = " HTTP/1.1\r\n\r\n\r\n--batch--";

    function getIncidentsForPrio(iPrio) {
        var responseStart = "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n";
        var responseEnd = "\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n";
        var tickets = [];
        for(var i = 0, length = iPrio; i < length; i++) {
            tickets.push({"__metadata": {"type":"oprr.intm.reporting.bridge.InternalIncidents.IncidentByProgramType","uri":"https://sithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/IncidentByProgram('0010000273')"},"TP_PROGRAM":"01476F742E82B649BD4B26AB35C6DD9E","II_PRIORITY_ID":iPrio.toString(),"II_CATEGORY":"IM-FA","II_STATUS_ID":"E0001","OBJECT_ID":"0010000273" + iPrio.toString() + i.toString(),"II_OBJECT_ID":"0010000273" + iPrio.toString() + i.toString()});
        }
        return responseStart + JSON.stringify({d: {results: tickets}}) + responseEnd;
    }

	beforeEach(function () {
        module("bridge.service");
        module("app.internalIncidentsMitosis");

        inject(["$httpBackend", "app.internalIncidentsMitosis.dataService", "app.internalIncidentsMitosis.configService", "$timeout", "bridge.AKHResponsibleFactory", "$window", function (_$httpBackend, _dataService, _configService, _$timeout, _AKHResponsibleFactory, $window) {
            $window.location.origin = "localhost";
            dataService = _dataService.getInstanceFor("app.test");
            configService = _configService.getInstanceForAppId("app.test");
            $httpBackend = _$httpBackend;
            $timeout = _$timeout;
            AKHResponsibleFactory = _AKHResponsibleFactory;
        }]);

        $httpBackend.whenGET("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata").respond({});
        $httpBackend.whenGET(/https:\/\/ifp.wdf.sap.corp\/sap\/bc\/bridge\/GET_SYSTEMS_FOR_PROGRAM/).respond({"SYSTEMS":[{"PRG_ID":"6CAE8B26E4CB1EE4ABA6CA8BD7E85271","SYS_ID":"CCO","PRG_NAME":"S4HANA On Premise 1511","SYS_TYPE":"","SYS_USAGE":""},{"PRG_ID":"6CAE8B26E4CB1EE4ABA6CA8BD7E85271","SYS_ID":"EMW","PRG_NAME":"S4HANA On Premise 1511","SYS_TYPE":"","SYS_USAGE":""},{"PRG_ID":"6CAE8B26E4CB1EE4ABA6CA8BD7E85271","SYS_ID":"EOS","PRG_NAME":"S4HANA On Premise 1511","SYS_TYPE":"","SYS_USAGE":""}]});
        $httpBackend.whenGET(/https:\/\/mithdb.wdf.sap.corp\/oprr\/intm\/reporting\/bridge\/components.xsodata\/Component/).respond({"d":{"results":[{"__metadata": {"type":"oprr.intm.reporting.bridge.components.ComponentType","uri":"https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/components.xsodata/Component('AC')"},"PS_POSID":"AC","DEV_UID_DM":"D053230","DEV_UID_DLVRY_M":"D024637","DEV_UID_PRDOWNER":"I844258","SL3_DEV_HANDOVER":" "},{"__metadata": {"type":"oprr.intm.reporting.bridge.components.ComponentType","uri":"https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/components.xsodata/Component('AC-CO')"},"PS_POSID":"AC-CO","DEV_UID_DM":"D022188","DEV_UID_DLVRY_M":" ","DEV_UID_PRDOWNER":" ","SL3_DEV_HANDOVER":" "}]}});
    });

    it("should be instantiated", function() {
        expect(dataService).toBeDefined();
    });

    it("should not load data if config is empty", function(done) {
        dataService.loadSummary(configService).then(function() {
            expect(dataService.summary.prio1).toEqual(0);
            expect(dataService.summary.prio2).toEqual(0);
            expect(dataService.summary.prio3).toEqual(0);
            expect(dataService.summary.prio4).toEqual(0);
            done();
        });
        $timeout.flush();
    });

    //Order by PRIO: $orderby=

    describe("by Program", function() {
        it("should filter on program + system implicitly", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '1' and ((TP_PROGRAM eq 'GUID1'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '3' and ((TP_PROGRAM eq 'GUID1'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '5' and ((TP_PROGRAM eq 'GUID1'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '9' and ((TP_PROGRAM eq 'GUID1'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.addProgram({TP_PROGRAM: "GUID1"});
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on multiple programs", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '1' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID2') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '3' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID2') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '5' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID2') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '9' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID2') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.addProgram({TP_PROGRAM: "GUID1"});
            configService.addProgram({TP_PROGRAM: "GUID2"});
            configService.addProgram({TP_PROGRAM: "GUID3"});
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on multiple programs with exclude", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '1' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '3' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '5' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '9' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.addProgram({TP_PROGRAM: "GUID1"});
            configService.addProgram({TP_PROGRAM: "GUID2", exclude: true});
            configService.addProgram({TP_PROGRAM: "GUID3"});
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on program with system exclude", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '1' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID2' and II_SYSTEM_ID ne 'EMW' and II_SYSTEM_ID ne 'EOS') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '3' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID2' and II_SYSTEM_ID ne 'EMW' and II_SYSTEM_ID ne 'EOS') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '5' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID2' and II_SYSTEM_ID ne 'EMW' and II_SYSTEM_ID ne 'EOS') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '9' and ((TP_PROGRAM eq 'GUID1') or (TP_PROGRAM eq 'GUID2' and II_SYSTEM_ID ne 'EMW' and II_SYSTEM_ID ne 'EOS') or (TP_PROGRAM eq 'GUID3'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.addProgram({TP_PROGRAM: "GUID1"});
            configService.programs.push({TP_PROGRAM: "GUID2", SYSTEMS: [{value: "EMW", exclude: true}, {value: "EOS", exclude: true}]});
            configService.addProgram({TP_PROGRAM: "GUID3"});
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on program and component", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '1' and ((TP_PROGRAM eq 'GUID1')) and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2')) and II_CATEGORY ne 'COMP3' and not startswith(II_CATEGORY, 'COMP4'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '3' and ((TP_PROGRAM eq 'GUID1')) and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2')) and II_CATEGORY ne 'COMP3' and not startswith(II_CATEGORY, 'COMP4'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '5' and ((TP_PROGRAM eq 'GUID1')) and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2')) and II_CATEGORY ne 'COMP3' and not startswith(II_CATEGORY, 'COMP4'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '9' and ((TP_PROGRAM eq 'GUID1')) and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2')) and II_CATEGORY ne 'COMP3' and not startswith(II_CATEGORY, 'COMP4'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.addProgram({TP_PROGRAM: "GUID1"});
            configService.components.push({value: 'COMP3', exclude: true});
            configService.components.push({value: 'COMP1'});
            configService.components.push({value: 'COMP4*', exclude: true});
            configService.components.push({value: 'COMP2*'});
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on program and AKH Responsible", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '1' and ((TP_PROGRAM eq 'GUID1')) and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '3' and ((TP_PROGRAM eq 'GUID1')) and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '5' and ((TP_PROGRAM eq 'GUID1')) and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '9' and ((TP_PROGRAM eq 'GUID1')) and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.addProgram({TP_PROGRAM: "GUID1"});
            configService.components.push({value: 'COMP1'});
            configService.akhResponsibles.push(AKHResponsibleFactory.createInstance("PROP", "D012345"));
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });
    });

    describe("plain", function() {
        it("should filter on processor", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_PROCESSOR_ID eq 'D012345'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_PROCESSOR_ID eq 'D012345'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_PROCESSOR_ID eq 'D012345'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_PROCESSOR_ID eq 'D012345'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.processors.push({BNAME: "D012345"});
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on multiple processors", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_PROCESSOR_ID eq 'D012345' or II_PROCESSOR_ID eq 'D012346' or II_PROCESSOR_ID eq 'D012347'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_PROCESSOR_ID eq 'D012345' or II_PROCESSOR_ID eq 'D012346' or II_PROCESSOR_ID eq 'D012347'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_PROCESSOR_ID eq 'D012345' or II_PROCESSOR_ID eq 'D012346' or II_PROCESSOR_ID eq 'D012347'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_PROCESSOR_ID eq 'D012345' or II_PROCESSOR_ID eq 'D012346' or II_PROCESSOR_ID eq 'D012347'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.processors.push({BNAME: "D012345"});
            configService.processors.push({BNAME: "D012346"});
            configService.processors.push({BNAME: "D012347"});
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should exclude all processors", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_PROCESSOR_ID ne 'D012345' and II_PROCESSOR_ID ne 'D012346' and II_PROCESSOR_ID ne 'D012347'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_PROCESSOR_ID ne 'D012345' and II_PROCESSOR_ID ne 'D012346' and II_PROCESSOR_ID ne 'D012347'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_PROCESSOR_ID ne 'D012345' and II_PROCESSOR_ID ne 'D012346' and II_PROCESSOR_ID ne 'D012347'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_PROCESSOR_ID ne 'D012345' and II_PROCESSOR_ID ne 'D012346' and II_PROCESSOR_ID ne 'D012347'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.processors.push({BNAME: "D012345"});
            configService.processors.push({BNAME: "D012346"});
            configService.processors.push({BNAME: "D012347"});
            configService.excludeProcessors = true;
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on a system", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_SYSTEM_ID eq 'ABC'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_SYSTEM_ID eq 'ABC'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_SYSTEM_ID eq 'ABC'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_SYSTEM_ID eq 'ABC'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.systems.push("ABC");
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on multiple systems", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_SYSTEM_ID eq 'ABC' or II_SYSTEM_ID eq 'DEF' or II_SYSTEM_ID eq 'GHI'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_SYSTEM_ID eq 'ABC' or II_SYSTEM_ID eq 'DEF' or II_SYSTEM_ID eq 'GHI'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_SYSTEM_ID eq 'ABC' or II_SYSTEM_ID eq 'DEF' or II_SYSTEM_ID eq 'GHI'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_SYSTEM_ID eq 'ABC' or II_SYSTEM_ID eq 'DEF' or II_SYSTEM_ID eq 'GHI'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.systems.push("ABC");
            configService.systems.push("DEF");
            configService.systems.push("GHI");
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should exclude all systems", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_SYSTEM_ID ne 'ABC' and II_SYSTEM_ID ne 'DEF' and II_SYSTEM_ID ne 'GHI'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_SYSTEM_ID ne 'ABC' and II_SYSTEM_ID ne 'DEF' and II_SYSTEM_ID ne 'GHI'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_SYSTEM_ID ne 'ABC' and II_SYSTEM_ID ne 'DEF' and II_SYSTEM_ID ne 'GHI'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_SYSTEM_ID ne 'ABC' and II_SYSTEM_ID ne 'DEF' and II_SYSTEM_ID ne 'GHI'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.systems.push("ABC");
            configService.systems.push("DEF");
            configService.systems.push("GHI");
            configService.excludeSystems = true;
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on a component", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_CATEGORY eq 'COMP1'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_CATEGORY eq 'COMP1'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_CATEGORY eq 'COMP1'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_CATEGORY eq 'COMP1'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.components.push({value: "COMP1"});
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on multiple components", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2') or II_CATEGORY eq 'COMP3'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2') or II_CATEGORY eq 'COMP3'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2') or II_CATEGORY eq 'COMP3'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2') or II_CATEGORY eq 'COMP3'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.components.push({value: "COMP1"});
            configService.components.push({value: "COMP2*"});
            configService.components.push({value: "COMP3"});
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should exclude some components", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2')) and II_CATEGORY ne 'COMP3' and not startswith(II_CATEGORY, 'COMP4'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2')) and II_CATEGORY ne 'COMP3' and not startswith(II_CATEGORY, 'COMP4'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2')) and II_CATEGORY ne 'COMP3' and not startswith(II_CATEGORY, 'COMP4'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_CATEGORY eq 'COMP1' or startswith(II_CATEGORY, 'COMP2')) and II_CATEGORY ne 'COMP3' and not startswith(II_CATEGORY, 'COMP4'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.components.push({value: 'COMP3', exclude: true});
            configService.components.push({value: 'COMP1'});
            configService.components.push({value: 'COMP4*', exclude: true});
            configService.components.push({value: 'COMP2*'});
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on AKH Responsible", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.components.push({value: 'COMP1'});
            configService.akhResponsibles.push(AKHResponsibleFactory.createInstance("PROP", "D012345"));
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });

        it("should filter on all together", function(done) {
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '1' and ((II_PROCESSOR_ID eq 'D012345' or II_PROCESSOR_ID eq 'D012346') or (II_SYSTEM_ID eq 'ABC' or II_SYSTEM_ID eq 'DEF')) and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(1));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '3' and ((II_PROCESSOR_ID eq 'D012345' or II_PROCESSOR_ID eq 'D012346') or (II_SYSTEM_ID eq 'ABC' or II_SYSTEM_ID eq 'DEF')) and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(2));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '5' and ((II_PROCESSOR_ID eq 'D012345' or II_PROCESSOR_ID eq 'D012346') or (II_SYSTEM_ID eq 'ABC' or II_SYSTEM_ID eq 'DEF')) and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(3));
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("Incident?$format=json&$filter=II_PRIORITY_ID eq '9' and ((II_PROCESSOR_ID eq 'D012345' or II_PROCESSOR_ID eq 'D012346') or (II_SYSTEM_ID eq 'ABC' or II_SYSTEM_ID eq 'DEF')) and ((II_CATEGORY eq 'COMP1' or II_CATEGORY eq 'AC' or II_CATEGORY eq 'AC-CO'))") + postRequestEnd).respond(200, getIncidentsForPrio(4));
            configService.processors.push({BNAME: "D012345"});
            configService.processors.push({BNAME: "D012346"});
            configService.systems.push("ABC");
            configService.systems.push("DEF");
            configService.components.push({value: 'COMP1'});
            configService.akhResponsibles.push(AKHResponsibleFactory.createInstance("PROP", "D012345"));
            dataService.loadSummary(configService).then(function() {
                expect(dataService.summary.prio1).toEqual(1);
                expect(dataService.summary.prio2).toEqual(2);
                expect(dataService.summary.prio3).toEqual(3);
                expect(dataService.summary.prio4).toEqual(4);
                done();
            });
            $httpBackend.flush();
        });
    });

    describe("all", function() {
        //filter on everything and display only distinct

    });
});
