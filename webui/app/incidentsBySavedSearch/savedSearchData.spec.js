describe("Incidents By Saved Search SavedSearch-Data", function(){
    var savedSearchData, $httpBackend,
        mockData = '<?xml version="1.0" encoding="utf-16"?><asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1><_-SID_-SAVED_SEARCH_LINE><PARAMETER_>0050568140981ED497BC89D47C4175D9</PARAMETER_><DESCRIPTION>Middleware Component (2973950)</DESCRIPTION></_-SID_-SAVED_SEARCH_LINE><_-SID_-SAVED_SEARCH_LINE><PARAMETER_>0050568139FF1ED5A4CFEE56E22A24DC</PARAMETER_><DESCRIPTION>test_Christine (33)</DESCRIPTION></_-SID_-SAVED_SEARCH_LINE><_-SID_-SAVED_SEARCH_LINE><PARAMETER_>005056810DCB1EE499981630E53A7851</PARAMETER_><DESCRIPTION>Employee Dashboard (5)</DESCRIPTION></_-SID_-SAVED_SEARCH_LINE><_-SID_-SAVED_SEARCH_LINE><PARAMETER_>288023A526471ED5ACDCDB6B47F039D3</PARAMETER_><DESCRIPTION>Employee Dashboard_LINKTEST (5)</DESCRIPTION></_-SID_-SAVED_SEARCH_LINE><_-SID_-SAVED_SEARCH_LINE><PARAMETER_>0050568170D81ED58DD612036A3673EB</PARAMETER_><DESCRIPTION>DLM Incident (7)</DESCRIPTION></_-SID_-SAVED_SEARCH_LINE></RESULTNODE1></asx:values></asx:abap>';

    beforeEach(function(){
        module("app.incidentSavedSearch");

        inject(function(_$httpBackend_){
            $httpBackend = _$httpBackend_;
        });

        inject(["app.incidentSavedSearch.savedSearchData", function(_savedSearchData){
            savedSearchData = _savedSearchData.getInstanceForAppId("test-1");
        }]);
    });

    it("should load the savedSearches from the backend and should not add the same search twice", function(){
        $httpBackend.whenGET(/https:\/\/(support|bcdmain)\.wdf\.sap\.corp\/sap\/bc\/devdb\/my_saved_search\?sap\-client=001&sap\-language=EN&business_role=ZCSSNEXTPROC/).respond(mockData);
        $httpBackend.whenGET(/https:\/\/(support|bcdmain)\.wdf\.sap\.corp\/sap\/bc\/devdb\/my_saved_search\?sap\-client=001&sap\-language=EN&business_role=ZCSSINTPROC/).respond(mockData);
        savedSearchData.loadData();
        $httpBackend.flush();

        expect(savedSearchData.savedSearches.length).toBe(5);
        expect(savedSearchData.savedSearches[0].PARAMETER_).toBe("0050568140981ED497BC89D47C4175D9");
        expect(savedSearchData.savedSearches[0].DESCRIPTION).toBe("Middleware Component (2973950)");
        expect(savedSearchData.savedSearches[0].bIsFromDevProfile).toBe(false);
        expect(savedSearchData.savedSearches[1].PARAMETER_).toBe("0050568139FF1ED5A4CFEE56E22A24DC");
        expect(savedSearchData.savedSearches[1].DESCRIPTION).toBe("test_Christine (33)");
        expect(savedSearchData.savedSearches[1].bIsFromDevProfile).toBe(false);
    });
});
