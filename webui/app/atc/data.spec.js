﻿describe("Manages the ATC data retrieval", function () {

    var $httpBackend;
    var atcDataService;
    var atcConfigService;

    var atcCountData = { "PRIOS": { "PRIO1": 985, "PRIO2": 438, "PRIO3": 11377, "PRIO4": 3766 }, "SELECTOR": [{ "SRCSYS": "Y8D", "DEVCLASS": "", "TADIR_RESP": "", "COMPONENT": "", "SHOW_SUPPRESSED": "", "DISPLAY_PRIO1": "", "DISPLAY_PRIO2": "", "DISPLAY_PRIO3": "", "DISPLAY_PRIO4": "", "ONLY_IN_PROCESS": "", "MESSAGE": "" }] };
    var atcDetailsData = { "DATA": [{ "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "TABL", "OBJ_NAME": "TTE_PROPERTIES", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003123649, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-BF-TAX", "RESP4OBJ": "01023714", "RESP4OBJ_ACCOUNT": "MALPANI", "CVNR": "", "DEVCLASS": "CRM_TAX", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 481058658 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "TTYP", "OBJ_NAME": "CRMT_KPI_KYF_DATA", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102033, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-PS", "RESP4OBJ": "01806453", "RESP4OBJ_ACCOUNT": "CHALAH", "CVNR": "01200615320200002537", "DEVCLASS": "CRM_KPI_PLANNING", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": -717480595 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "TTYP", "OBJ_NAME": "CRMT_KPI_POS_CHAVL", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102033, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-PS", "RESP4OBJ": "01806453", "RESP4OBJ_ACCOUNT": "CHALAH", "CVNR": "01200615320200002537", "DEVCLASS": "CRM_KPI_PLANNING", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 1767249724 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "TTYP", "OBJ_NAME": "CRMT_KPI_PROFILE_CHAVL", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102033, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-PS", "RESP4OBJ": "01806453", "RESP4OBJ_ACCOUNT": "CHALAH", "CVNR": "01200615320200002537", "DEVCLASS": "CRM_KPI_PLANNING", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 1711326112 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "COMV_PRMAT_UPL", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003095757, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-MD-PRO-IF-PRO", "RESP4OBJ": "00036152", "RESP4OBJ_ACCOUNT": "POPPEL", "CVNR": "", "DEVCLASS": "COM_PRODUCT_DATAEXCHANGE", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": -209185313 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMVV_ATTR_VALUE", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102423, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-IT-BTX", "RESP4OBJ": "00031098", "RESP4OBJ_ACCOUNT": "KIENE", "CVNR": "", "DEVCLASS": "ISTCRM05", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 2020178406 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_ANA_ROLE_WC", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102624, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-BOJ-UI", "RESP4OBJ": "01813872", "RESP4OBJ_ACCOUNT": "ELZANKALY", "CVNR": "01200314690200009435", "DEVCLASS": "CRM_ANA_BOJ_UI", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": -1209221153 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_ANA_ROLE_WC", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102624, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-BOJ-UI", "RESP4OBJ": "01813872", "RESP4OBJ_ACCOUNT": "ELZANKALY", "CVNR": "01200314690200009435", "DEVCLASS": "CRM_ANA_BOJ_UI", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": -681695216 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_ANA_ROLE_WC", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102624, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-BOJ-UI", "RESP4OBJ": "01813872", "RESP4OBJ_ACCOUNT": "ELZANKALY", "CVNR": "01200314690200009435", "DEVCLASS": "CRM_ANA_BOJ_UI", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": -492913684 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_ANA_ROLE_WC", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102624, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-BOJ-UI", "RESP4OBJ": "01813872", "RESP4OBJ_ACCOUNT": "ELZANKALY", "CVNR": "01200314690200009435", "DEVCLASS": "CRM_ANA_BOJ_UI", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 993745139 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_ANA_ROLE_WC", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102624, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-BOJ-UI", "RESP4OBJ": "01813872", "RESP4OBJ_ACCOUNT": "ELZANKALY", "CVNR": "01200314690200009435", "DEVCLASS": "CRM_ANA_BOJ_UI", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 1696773934 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_ATTR_VALUE", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102414, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-IT-BTX", "RESP4OBJ": "00031098", "RESP4OBJ_ACCOUNT": "KIENE", "CVNR": "", "DEVCLASS": "ISTCRM05", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 1587842808 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_BUPSYS3_BW", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102635, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-MD-BP", "RESP4OBJ": "00032104", "RESP4OBJ_ACCOUNT": "DAUBE", "CVNR": "", "DEVCLASS": "CRM_BUPA_EXT", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": -159943308 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_BUPSYS4_BW", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102635, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-MD-BP", "RESP4OBJ": "00032104", "RESP4OBJ_ACCOUNT": "DAUBE", "CVNR": "", "DEVCLASS": "CRM_BUPA_EXT", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": -574469259 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_BUPSYS5_BW", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102635, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-MD-BP", "RESP4OBJ": "00032104", "RESP4OBJ_ACCOUNT": "DAUBE", "CVNR": "", "DEVCLASS": "CRM_BUPA_EXT", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 197666572 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_FS_TC_NAV", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102425, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-IFS", "RESP4OBJ": "00037602", "RESP4OBJ_ACCOUNT": "SCHMIDTAL", "CVNR": "01200314690200005444", "DEVCLASS": "CRM_UIU_FS_TC", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": -2146140370 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_FS_TC_NAV", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102425, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-IFS", "RESP4OBJ": "00037602", "RESP4OBJ_ACCOUNT": "SCHMIDTAL", "CVNR": "01200314690200005444", "DEVCLASS": "CRM_UIU_FS_TC", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 1513397245 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_PROD_PRMAT", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102613, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-MD-PRO", "RESP4OBJ": "00046648", "RESP4OBJ_ACCOUNT": "WUSCHEK", "CVNR": "", "DEVCLASS": "CRM_PRODUCT_BW", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 1255283240 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "CRMV_PROD_PRSRV", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003102613, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-MD-PRO", "RESP4OBJ": "00046648", "RESP4OBJ_ACCOUNT": "WUSCHEK", "CVNR": "", "DEVCLASS": "CRM_PRODUCT_BW", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": -513485377 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "VIEW", "OBJ_NAME": "PRCVCTCONDSCHEME", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000161", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20131003121946, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-BF-TAX", "RESP4OBJ": "00031472", "RESP4OBJ_ACCOUNT": "HEITLINGERM", "CVNR": "", "DEVCLASS": "CRM_TAX_CALC", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Package Check for Elements in the ABAP Dictionary", "CHECK_MESSAGE": "Package Violation (Error) - The Used Object is Not Visible", "CHECKSUM": 1653953815 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "WAPA", "OBJ_NAME": "CRM_ANA_OD_SHLR", "CHECK_MSG_PRIO": 2, "NEWMSG": "", "MSG_AGE": "0000000006", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20140306121908, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-ANA-OR", "RESP4OBJ": "00038603", "RESP4OBJ_ACCOUNT": "FREYLER", "CVNR": "67838200100200021490", "DEVCLASS": "CRM_ANA_ODATA_UI", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Classification on Accessibility", "CHECK_MESSAGE": "Relevant for accessibility but not marked to be accessible.", "CHECKSUM": -1598200074 }, { "MANDT": "001", "RUNINFO_GUID": "40F2E9637AAE1EE3AAD91A991B925056", "OBJECT": "WAPA", "OBJ_NAME": "CRM_IU_UI5_PFCM", "CHECK_MSG_PRIO": 2, "NEWMSG": "X", "MSG_AGE": "0000000000", "MSG_SUPRESSED": "", "FIRST_OCCURRENCE": 20140313124024, "COMPLETION_STATE": "N", "CHECK_SYSTEM": "CI3", "CHECK_CLIENT": "000", "CHECK_TSTMP": 20140313145356, "COMP_SHORT": "CRM-IU", "RESP4OBJ": "00061424", "RESP4OBJ_ACCOUNT": "WOLFJAN", "CVNR": "67837800100200022398", "DEVCLASS": "CRM_IU_ODATA", "CHECK_TITLE": "CI3: Thursday, CW11 2014", "CHECK_DESCRIPTION": "Classification on Accessibility", "CHECK_MESSAGE": "Relevant for accessibility but not marked to be accessible.", "CHECKSUM": 251692701 }] };

    beforeEach(function () {

        module('bridge.service');
        module("app.atc");

        inject(["$httpBackend", "app.atc.configservice", "app.atc.dataservice", function (_$httpBackend, _atcConfigService, _atcDataService) {
            $httpBackend = _$httpBackend;
            atcConfigService = _atcConfigService;
            atcDataService = _atcDataService;
        }]);

        $httpBackend.whenGET(/https:\/\/ifp\.wdf\.sap\.corp:443\/sap\/bc\/devdb\/STAT_CHK_RESULT\?query=/).respond(atcDetailsData);
        $httpBackend.whenGET(/https:\/\/ifp\.wdf\.sap\.corp:443\/sap\/bc\/devdb\/STAT_CHK_RES_CN\?query=/).respond(atcCountData);
    });

    it("shoud get the correct atc details data", function () {
        // no need to create a specific config item as we get test data anyway
        var config = atcConfigService;

        atcDataService.getDetailsForConfig(config);
        $httpBackend.flush();

        expect(atcDataService.detailsData.length).toBe(22);
        expect(atcDataService.detailsData[0].OBJ_NAME).toBeDefined();
    });

    it("should get the correct atc count data", function () {
        var config = atcConfigService;

        atcDataService.getResultForConfig(config);
        $httpBackend.flush();

        expect(atcDataService.data.prio1).toBe(985);
        expect(atcDataService.data.prio2).toBe(438);
        expect(atcDataService.data.prio3).toBe(11377);
        expect(atcDataService.data.prio4).toBe(3766);
    });

});