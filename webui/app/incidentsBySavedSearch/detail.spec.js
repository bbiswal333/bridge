describe("Incidents By Saved Search details controller", function(){
    var $controller,
        ticketData,
        $rootScope,
        $httpBackend,
        $window,
        $http,
        config,
        mockTicketData    = '<?xml version="1.0" encoding="utf-16"?><asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568101341EE4A0C29AA84E993307</OBJECT_GUID><OBJECT_ID>1472014531</OBJECT_ID><DESCRIPTION>Will BCP CSS-NG be supported</DESCRIPTION><STATUS_KEY>E0009</STATUS_KEY><STATUS_DESCR>Confirmed</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>3 Medium</PRIORITY_DESCR><CREATE_DATE>20141212154039</CREATE_DATE><CHANGE_DATE>20141215083639</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>20150109165830</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>20141212154039</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>             0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME>Mr. Daniel Schueler</PROCESSOR_NAME><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY>XX-INT-DASH</CATEGORY><CUST_NO/><REPORTER_NAME>Mr. Steen Tirkov</REPORTER_NAME><PROCESSOR_ID>D051804</PROCESSOR_ID><REPORTER_ID>I030471</REPORTER_ID><URL_MESSAGE>https://support.wdf.sap.corp/sap/support/message/1472014531</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR/><EMPL_RESP/><PROCESS_TYPE>ZINI</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>005056811BFD1ED4A59736F39189B050</OBJECT_GUID><OBJECT_ID>1570000667</OBJECT_ID><DESCRIPTION>widget ABAP code check: No data for syst</DESCRIPTION><STATUS_KEY>E0009</STATUS_KEY><STATUS_DESCR>Confirmed</STATUS_DESCR><PRIORITY_KEY>9</PRIORITY_KEY><PRIORITY_DESCR>4 Low</PRIORITY_DESCR><CREATE_DATE>20150105091626</CREATE_DATE><CHANGE_DATE>20150407074129</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>20151210230029</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>20150105091626</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>             0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME>Mr. Daniel Schüler</PROCESSOR_NAME><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY>XX-INT-DASH</CATEGORY><CUST_NO/><REPORTER_NAME>Ms. Diana He</REPORTER_NAME><PROCESSOR_ID>D051804</PROCESSOR_ID><REPORTER_ID>I076590</REPORTER_ID><URL_MESSAGE>https://support.wdf.sap.corp/sap/support/message/1570000667</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR/><EMPL_RESP/><PROCESS_TYPE>ZINI</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE1></asx:values></asx:abap>';

    beforeEach(function(){
        module("app.incidentSavedSearch", function($provide){
            var mockDataService = {
                getUserInfo: function(){
                    return { BNAME: "D051804" };
                }
            };

            var mockNotifier = {
                storeAllNotificationsInLocale: function(){
                },
                showInfo: function(){
                }
            };

            $provide.value("notifier", mockNotifier);
            $provide.value("bridgeDataService", mockDataService);
        });

        inject(["$rootScope", "$httpBackend", "$controller", "$window", "$http", "app.incidentSavedSearch.ticketData", "app.incidentSavedSearch.configservice",
            function(_$rootScope, _$httpBackend, _$controller, _$window, _$http, _ticketData, _config){
                $controller = _$controller;
                ticketData = _ticketData;
                $rootScope = _$rootScope;
                $httpBackend = _$httpBackend;
                $window = _$window;
                $http = _$http;
                config = _config;
        }]);

        $httpBackend.whenGET("/bridge/search/buildings.xml")
            .respond("<items><item></item></items>");
    });

    it("should load the tickets if the ticketData is not initialized yet", function(){
        $httpBackend.whenGET(/https:\/\/ifp\.wdf\.sap\.corp:443\/sap\/bc\/zxa\/FIND_EMPLOYEE_JSON/)
            .respond({
                DATA: {
                    TELNR_DEF: "555-123-456",
                    TELNR_MOBILE: "555-123-456",
                    BNAME: ""
                }
            });

        $httpBackend.expectGET(/https:\/\/(bcdmain|backup-support)\.wdf\.sap\.corp\/sap\/bc\/devdb\/saved_search\?sap-client\=001/)
            .respond(mockTicketData);

        $controller("app.incidentSavedSearch.detailController", {
            "$scope": $rootScope,
            "$http": $http,
            "$window": $window,
            "app.internalIncidents.ticketData": ticketData,
            "$routeParams": { appId: "test-1", prio: "1" },
            "app.internalIncidents.config": {},
            "bridge.converter": {},
            "bridgeDataService": { getAppConfigById: function() {
                return {
                };
            }}
        });

        $httpBackend.flush();

        expect($rootScope.messages.length).toBe(2);
    });

    it("should display the notification tickets if the details screen is called from notifications", function(){
        $httpBackend.whenGET(/https:\/\/ifp\.wdf\.sap\.corp:443\/sap\/bc\/zxa\/FIND_EMPLOYEE_JSON/)
            .respond({
                DATA: {
                    TELNR_DEF: "555-123-456",
                    TELNR_MOBILE: "555-123-456",
                    BNAME: ""
                }
            });

        ticketData.getInstanceForAppId("test-1").ticketsFromNotifications.push({
            DESCRIPTION: "I am a dummy Ticket",
            REPORTER_ID: "D051804"
        });

        $controller("app.incidentSavedSearch.detailController", {
            "$scope": $rootScope,
            "$http": $http,
            "$window": $window,
            "app.internalIncidents.ticketData": ticketData,
            "$routeParams": {
                appId: "test-1",
                prio: "1",
                calledFromNotifications: "true"
            },
            "app.internalIncidents.config": {},
            "bridge.converter": {},
            "$q": {},
            "bridgeDataService": { getAppConfigById: function() {
                return {
                    data: {
                    }
                };
            }}
        });

        $httpBackend.flush();

        expect($rootScope.messages.length).toBe(1);
        expect($rootScope.messages[0].reporterData.TELNR).toBe("555123456");
    });

    it("should initialize the config object if that has not happened yet", function(){
        expect(config.getConfigForAppId("test-1").isInitialized).toBe(false);

        $controller("app.incidentSavedSearch.detailController", {
            "$scope": $rootScope,
            "$http": $http,
            "$window": $window,
            "app.internalIncidents.ticketData": ticketData,
            "$routeParams": { prio: "1", appId: "test-1" },
            "app.internalIncidents.config": config,
            "bridge.converter": {},
            "bridgeDataService": { getAppConfigById: function() {
                return {
                    data: {
                    }
                };
            }}
        });

        expect(config.getConfigForAppId("test-1").isInitialized).toBe(true);
    });
});
