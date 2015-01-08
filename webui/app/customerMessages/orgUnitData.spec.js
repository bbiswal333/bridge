describe("CustomerIncidents OrgUnit Data", function(){
    var orgUnitData, $httpBackend,
        mockData = '<?xml version="1.0" encoding="utf-16"?><asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1><CRMT_PPM_OM_USER_ASSIGNMENTS><IS_MANAGER/><OPOSITION>10279493</OPOSITION><OPOSITION_TEXT>DS Dev DACH Employees</OPOSITION_TEXT><ORGUNIT>10279484</ORGUNIT><ORGUNIT_TEXT>DS Dev DACH</ORGUNIT_TEXT><OLEVEL>5</OLEVEL><ROOT_ORGUNIT>10084509</ROOT_ORGUNIT><ROOT_ORGUNIT_TEXT>Support Areas</ROOT_ORGUNIT_TEXT></CRMT_PPM_OM_USER_ASSIGNMENTS><CRMT_PPM_OM_USER_ASSIGNMENTS><IS_MANAGER/><OPOSITION>10279630</OPOSITION><OPOSITION_TEXT>PS GSC EMEA Global 3 Employees</OPOSITION_TEXT><ORGUNIT>10279629</ORGUNIT><ORGUNIT_TEXT>PS GSC EMEA Global</ORGUNIT_TEXT><OLEVEL>5</OLEVEL><ROOT_ORGUNIT>10084509</ROOT_ORGUNIT><ROOT_ORGUNIT_TEXT>Support Areas</ROOT_ORGUNIT_TEXT></CRMT_PPM_OM_USER_ASSIGNMENTS></RESULTNODE1></asx:values></asx:abap>';

    beforeEach(function(){
        module("app.customerMessages");

        inject(function(_$httpBackend_){
            $httpBackend = _$httpBackend_;
        });

        inject(["app.customerMessages.orgUnitData", function(_orgUnitData){
            orgUnitData = _orgUnitData.getInstanceForAppId("test-1");
        }]);
    });

    it("should load the orgUnits from the backend", function(){
        $httpBackend.whenGET(/https:\/\/(backup-support|bcdmain)\.wdf\.sap\.corp\/sap\/bc\/devdb\/my_org_units/).respond(mockData);
        orgUnitData.loadData();
        $httpBackend.flush();

        expect(orgUnitData.orgUnits.length).toBe(2);
        expect(orgUnitData.orgUnits[0].ORGUNIT).toBe("10279484");
        expect(orgUnitData.orgUnits[0].ORGUNIT_TEXT).toBe("DS Dev DACH");
        expect(orgUnitData.orgUnits[1].ORGUNIT).toBe("10279629");
        expect(orgUnitData.orgUnits[1].ORGUNIT_TEXT).toBe("PS GSC EMEA Global");
    });
});
