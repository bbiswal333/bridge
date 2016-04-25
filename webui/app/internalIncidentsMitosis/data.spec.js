ddescribe("Incidents data", function() {
	var dataService, configService, $httpBackend, $timeout, AKHResponsibleFactory;

    var postRequestBeginning = "--batch\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nGET ";
    var postRequestEnd = " HTTP/1.1\r\n\r\n\r\n--batch--";

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
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '1' and (TP_PROGRAM eq 'GUID1')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n1\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '2' and (TP_PROGRAM eq 'GUID1')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n2\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '3' and (TP_PROGRAM eq 'GUID1')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n3\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '4' and (TP_PROGRAM eq 'GUID1')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n4\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
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
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '1' and (TP_PROGRAM eq 'GUID1' or TP_PROGRAM eq 'GUID2' or TP_PROGRAM eq 'GUID3')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n1\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '2' and (TP_PROGRAM eq 'GUID1' or TP_PROGRAM eq 'GUID2' or TP_PROGRAM eq 'GUID3')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n2\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '3' and (TP_PROGRAM eq 'GUID1' or TP_PROGRAM eq 'GUID2' or TP_PROGRAM eq 'GUID3')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n3\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '4' and (TP_PROGRAM eq 'GUID1' or TP_PROGRAM eq 'GUID2' or TP_PROGRAM eq 'GUID3')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n4\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
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
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '1' and (TP_PROGRAM eq 'GUID1' or TP_PROGRAM eq 'GUID3')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n1\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '2' and (TP_PROGRAM eq 'GUID1' or TP_PROGRAM eq 'GUID3')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n2\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '3' and (TP_PROGRAM eq 'GUID1' or TP_PROGRAM eq 'GUID3')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n3\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
            $httpBackend.whenPOST("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", postRequestBeginning + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '4' and (TP_PROGRAM eq 'GUID1' or TP_PROGRAM eq 'GUID3')") + postRequestEnd).respond(200, "--7138BA946C8877F70E52AF41D5E066240\r\nContent-Type: application/http\r\nContent-Length: 80\r\ncontent-transfer-encoding: binary\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/plain;charset=utf-8\r\nContent-Length: 2\r\n\r\n4\r\n--7138BA946C8877F70E52AF41D5E066240--\r\n");
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

        //should filter on program  with system exclude


        //should filter on program and component

        //should filter on program and AKH Responsible
    });

    describe("plain", function() {
        //should filter on processor

        //should filter on multiple processors

        //should exclude processors //all


        //should filter on a system

        //should filter on multiple systems

        //should exclude all systems


        //should filter on a component

        //should filter on multiple components

        //should exclude some components

        //should filter on AKH Responsible


        //should filter on all together
    });

    describe("all", function() {
        //filter on everything and display only distinct
    });
});
