describe("Incident By Saved Search ticket data", function(){
    var $httpBackend,
        $q,
        $rootScope,
        ticketData,
        config,
        deferred,
        loadDataCalled = false,
        mockTicketData,
        newMockTicketData,
        changedMockTicketData,
        sNotificationText,
        oNotificationData;

    var loadDataMock = function() {
        loadDataCalled = true;
        return deferred.promise;
    };

    beforeEach(function(){
        angular.module("mock.module", []).service("bridgeDataService", function(){
            this.getUserInfo = function() {
                return {
                    BNAME: "D051804"
                };
            };
        });
        angular.module("mock.module").factory("notifier", function(){
            return {
                showInfo: function(sTitle, sText, sAppIdentifier, fn_onClick, iDuration, oData){
                    sNotificationText = sText;
                    oNotificationData = oData;
                }
            };
        });

        module("app.incidentSavedSearch");
        module("mock.module");

        sNotificationText = "";
        oNotificationData = {tickets: []};

        mockTicketData    = '<?xml version="1.0" encoding="utf-16"?><asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568101341EE4A0C29AA84E993307</OBJECT_GUID><OBJECT_ID>1472014531</OBJECT_ID><DESCRIPTION>Will BCP CSS-NG be supported</DESCRIPTION><STATUS_KEY>E0009</STATUS_KEY><STATUS_DESCR>Confirmed</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>3 Medium</PRIORITY_DESCR><CREATE_DATE>20141212154039</CREATE_DATE><CHANGE_DATE>20141215083639</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>20150109165830</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>20141212154039</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>             0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME>Mr. Daniel Schueler</PROCESSOR_NAME><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY>XX-INT-DASH</CATEGORY><CUST_NO/><REPORTER_NAME>Mr. Steen Tirkov</REPORTER_NAME><PROCESSOR_ID>D051804</PROCESSOR_ID><REPORTER_ID>I030471</REPORTER_ID><URL_MESSAGE>https://support.wdf.sap.corp/sap/support/message/1472014531</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR/><EMPL_RESP/><PROCESS_TYPE>ZINI</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE1></asx:values></asx:abap>';
        newMockTicketData = '<?xml version="1.0" encoding="utf-16"?><asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568101341EE4A0C29AA84E993307</OBJECT_GUID><OBJECT_ID>1472014531</OBJECT_ID><DESCRIPTION>Will BCP CSS-NG be supported</DESCRIPTION><STATUS_KEY>E0009</STATUS_KEY><STATUS_DESCR>Confirmed</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>3 Medium</PRIORITY_DESCR><CREATE_DATE>20141212154039</CREATE_DATE><CHANGE_DATE>20141215083639</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>20150109165830</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>20141212154039</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>             0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME>Mr. Daniel Schueler</PROCESSOR_NAME><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY>XX-INT-DASH</CATEGORY><CUST_NO/><REPORTER_NAME>Mr. Steen Tirkov</REPORTER_NAME><PROCESSOR_ID>D051804</PROCESSOR_ID><REPORTER_ID>I030471</REPORTER_ID><URL_MESSAGE>https://support.wdf.sap.corp/sap/support/message/1472014531</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR/><EMPL_RESP/><PROCESS_TYPE>ZINI</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>005056811BFD1ED4A59736F39189B050</OBJECT_GUID><OBJECT_ID>1570000667</OBJECT_ID><DESCRIPTION>widget ABAP code check: No data for syst</DESCRIPTION><STATUS_KEY>E0009</STATUS_KEY><STATUS_DESCR>Confirmed</STATUS_DESCR><PRIORITY_KEY>9</PRIORITY_KEY><PRIORITY_DESCR>4 Low</PRIORITY_DESCR><CREATE_DATE>20150105091626</CREATE_DATE><CHANGE_DATE>20150407074129</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>20151210230029</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>20150105091626</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>             0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME>Mr. Daniel Schüler</PROCESSOR_NAME><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY>XX-INT-DASH</CATEGORY><CUST_NO/><REPORTER_NAME>Ms. Diana He</REPORTER_NAME><PROCESSOR_ID>D051804</PROCESSOR_ID><REPORTER_ID>I076590</REPORTER_ID><URL_MESSAGE>https://support.wdf.sap.corp/sap/support/message/1570000667</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR/><EMPL_RESP/><PROCESS_TYPE>ZINI</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE1></asx:values></asx:abap>';
        changedMockTicketData = '<?xml version="1.0" encoding="utf-16"?><asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568101341EE4A0C29AA84E993307</OBJECT_GUID><OBJECT_ID>1472014531</OBJECT_ID><DESCRIPTION>Will BCP CSS-NG be supported</DESCRIPTION><STATUS_KEY>E0009</STATUS_KEY><STATUS_DESCR>Confirmed</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>3 Medium</PRIORITY_DESCR><CREATE_DATE>20141212154039</CREATE_DATE><CHANGE_DATE>20991215083639</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>20150109165830</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>20141212154039</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>             0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME>Mr. Daniel Schueler</PROCESSOR_NAME><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY>XX-INT-DASH</CATEGORY><CUST_NO/><REPORTER_NAME>Mr. Steen Tirkov</REPORTER_NAME><PROCESSOR_ID>D051804</PROCESSOR_ID><REPORTER_ID>I030471</REPORTER_ID><URL_MESSAGE>https://support.wdf.sap.corp/sap/support/message/1472014531</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR/><EMPL_RESP/><PROCESS_TYPE>ZINI</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE1></asx:values></asx:abap>';
        emptyMockTicketData = '<?xml version="1.0" encoding="utf-16"?><asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1/></asx:values></asx:abap>';

        inject(["$rootScope", "$httpBackend", "$q", "app.incidentSavedSearch.ticketData", "app.incidentSavedSearch.configservice", function(_$rootScope, _$httpBackend, _$q, _ticketData, _config){
            $rootScope = _$rootScope;
            $httpBackend = _$httpBackend;
            $q = _$q;
            ticketData = _ticketData.getInstanceForAppId("test-1");
            config = _config.getConfigForAppId("test-1");
        }]);
    });

    it("should set the initialized flag and get the data from the backend", function () {
        deferred = $q.defer();

        expect(angular.isFunction(ticketData.loadTicketData)).toBe(true);
        ticketData.loadTicketData = loadDataMock;

        var initializePromise = ticketData.initialize();

        initializePromise.then(function success() {
            expect(ticketData.isInitialized.value).toBe(true);
            expect(loadDataCalled).toBe(true);
        });

        deferred.resolve();
        $rootScope.$apply();
    });

    it("should load the data from the backend", function(){
        $httpBackend.whenGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(mockTicketData);

        ticketData.loadTicketData();
        $httpBackend.flush();

        expect(ticketData.tickets.length).toBe(1);
    });

    it("should update the ticket amounts according to my current category selection", function(){
        $httpBackend.whenGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(mockTicketData);

        ticketData.loadTicketData();
        $httpBackend.flush();

        ticketData.calculateTotals();
        expect(ticketData.prios[0].total).toBe(0);
        expect(ticketData.prios[1].total).toBe(0);
        expect(ticketData.prios[2].total).toBe(1);
        expect(ticketData.prios[3].total).toBe(0);
    });

    it("should remember the last loading time", function(){
        $httpBackend.whenGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(mockTicketData);

        expect(config.data.lastDataUpdate).toBe(null);

        ticketData.loadTicketData();
        $httpBackend.flush();

        expect(config.data.lastDataUpdate).not.toBe(null);
    });

    it("should remember the tickets that were loaded (for notifications)", function(){
        expect(ticketData.lastTickets).toBe(null);

        $httpBackend.whenGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(mockTicketData);

        ticketData.loadTicketData();
        $httpBackend.flush();

        expect(ticketData.lastTickets).not.toBe(null);
    });

    it("should notify me about a new ticket", function(){

        $httpBackend.whenGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(function(){
                return [200, mockTicketData, {}];
            });

        ticketData.loadTicketData();
        $httpBackend.flush();

        mockTicketData = newMockTicketData;

        ticketData.loadTicketData();
        $httpBackend.flush();

        expect(sNotificationText.indexOf("There is a new Incident")).not.toBe(-1);
        expect(oNotificationData.tickets.length).toBe(1);
    });

    it("should notify me about a changed ticket", function(){

        $httpBackend.whenGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(function(){
                return [200, mockTicketData, {}];
            });

        ticketData.loadTicketData();
        $httpBackend.flush();

        mockTicketData = changedMockTicketData;

        ticketData.loadTicketData();
        $httpBackend.flush();

        expect(sNotificationText.indexOf("The Incident")).not.toBe(-1);
        expect(oNotificationData.tickets.length).toBe(1);
        expect(oNotificationData.tickets[0].OBJECT_GUID).toBe("0050568101341EE4A0C29AA84E993307");
    });

    it("should notify me about a ticket that changed while I was offline", function(){
        config.data.lastDataUpdate = new Date(2010, 0, 1, 1, 1, 1);

        $httpBackend.whenGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(mockTicketData);

        ticketData.loadTicketData();
        $httpBackend.flush();

        expect(sNotificationText.indexOf("since your last visit")).not.toBe(-1);
        expect(oNotificationData.tickets.length).toBe(1);
    });

    it("should not throw a notification", function(){
        config.data.lastDataUpdate = new Date(2015, 0, 1, 1, 1, 1);

        $httpBackend.whenGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(mockTicketData);

        ticketData.loadTicketData();
        $httpBackend.flush();

        expect(sNotificationText).toBe("");
        expect(oNotificationData.tickets.length).toBe(0);
    });

    it("should keep the ticketsFromNotifications even if there are newer data loads without notifications", function(){
        config.data.lastDataUpdate = new Date(2010, 0, 1, 1, 1, 1);

        $httpBackend.whenGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(mockTicketData);

        ticketData.loadTicketData();
        $httpBackend.flush();

        expect(oNotificationData.tickets.length).toBe(1);

        ticketData.loadTicketData();
        $httpBackend.flush();

        expect(oNotificationData.tickets.length).toBe(1);
    });

    it("should create an empty ticketArray if  no tickets come from the backend", function(){
        $httpBackend.whenGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(emptyMockTicketData);

        ticketData.loadTicketData();
        $httpBackend.flush();

        expect(ticketData.tickets.length).toBe(0);
    });

});
