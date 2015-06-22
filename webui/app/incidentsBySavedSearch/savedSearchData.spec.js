describe("Incidents By Saved Search SavedSearch-Data", function(){
    var savedSearchData, $httpBackend,
        mockData = '<?xml version="1.0" encoding="utf-16"?><asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1><_-SID_-SAVED_SEARCH_LINE><GUID>0050568140981ED497BC89D47C4155D9</GUID><DESCRIPTION>Middleware Component</DESCRIPTION></_-SID_-SAVED_SEARCH_LINE><_-SID_-SAVED_SEARCH_LINE><GUID>005056810DCB1EE499981630E53A9851</GUID><DESCRIPTION>Employee Dashboard</DESCRIPTION></_-SID_-SAVED_SEARCH_LINE></RESULTNODE1></asx:values></asx:abap>';

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
        $httpBackend.whenGET(/https:\/\/(backup-support|bcdmain)\.wdf\.sap\.corp\/sap\/bc\/devdb\/my_saved_search\?sap\-client=001&sap\-language=EN&business_role=ZCSSNEXTPROC/).respond(mockData);
        $httpBackend.whenGET(/https:\/\/(backup-support|bcdmain)\.wdf\.sap\.corp\/sap\/bc\/devdb\/my_saved_search\?sap\-client=001&sap\-language=EN&business_role=ZCSSINTPROC/).respond(mockData);
        savedSearchData.loadData();
        $httpBackend.flush();

        expect(savedSearchData.savedSearches.length).toBe(2);
        expect(savedSearchData.savedSearches[0].GUID).toBe("0050568140981ED497BC89D47C4155D9");
        expect(savedSearchData.savedSearches[0].DESCRIPTION).toBe("Middleware Component");
        expect(savedSearchData.savedSearches[0].bIsFromDevProfile).toBe(false);
        expect(savedSearchData.savedSearches[1].GUID).toBe("005056810DCB1EE499981630E53A9851");
        expect(savedSearchData.savedSearches[1].DESCRIPTION).toBe("Employee Dashboard");
        expect(savedSearchData.savedSearches[1].bIsFromDevProfile).toBe(false);
    });
});
