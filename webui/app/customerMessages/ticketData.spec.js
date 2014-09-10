/* global location */
describe("Ticket Data Service for Customer Messages", function () {

    var $httpBackend;
    var $q;
    var cmTicketData;
    // var mockData = '<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1/><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568E3DB61ED295B0C4C96593DE3E</OBJECT_GUID><OBJECT_ID>0000000083</OBJECT_ID><DESCRIPTION>Maris Test #2 copy 12 updated</DESCRIPTION><STATUS_KEY>E0012</STATUS_KEY><STATUS_DESCR>In Process</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>Medium</PRIORITY_DESCR><CREATE_DATE>20130103091558</CREATE_DATE><CHANGE_DATE>20130708095923</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>0</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>0</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME>SGrp-D25 /</CUST_NAME><ESCALATED/><ESCALATION/><CATEGORY>BI-BETA-BIP</CATEGORY><CUST_NO>56</CUST_NO><REPORTER_NAME>Philip Aliband / 70447 Stuttgart</REPORTER_NAME><PROCESSOR_ID/><REPORTER_ID>D001659</REPORTER_ID><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/0000000083?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG>O 10279386</PROCESSING_ORG><PROCESSING_ORG_TXT>PS VGSC EMEA</PROCESSING_ORG_TXT><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S><RESULTNODE2><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>00505681409E1EE3BADC4A687B7B5E13</OBJECT_GUID><OBJECT_ID>1410541346</OBJECT_ID><DESCRIPTION>UI impact SAP UI SP 8</DESCRIPTION><STATUS_KEY>E0003</STATUS_KEY><STATUS_DESCR>On Hold</STATUS_DESCR><PRIORITY_KEY>3</PRIORITY_KEY><PRIORITY_DESCR>High</PRIORITY_DESCR><CREATE_DATE>20140721051820</CREATE_DATE><CHANGE_DATE>20140725074102</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>20140606054300</IRT_EXPIRY><MPT_EXPIRY>20140626102039</MPT_EXPIRY><IRT_START>20140603054300</IRT_START><MPT_START>20140603054300</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY>CA-MSS-HCM</CATEGORY><CUST_NO/><REPORTER_NAME/><PROCESSOR_ID/><REPORTER_ID/><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/1410541346?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000541346</MESSAGE_NO><MESSAGE_YEAR>2014</MESSAGE_YEAR><MESSAGE_INSNO>0120025231</MESSAGE_INSNO><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID>012002523100005413462014</CSS_OBJECT_ID></_-SID_-CN_IF_DEVDB_INC_OUT_S><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568E3DB61ED295A369943052BE3E</OBJECT_GUID><OBJECT_ID>0000000082</OBJECT_ID><DESCRIPTION>Maris Test #1</DESCRIPTION><STATUS_KEY>E0003</STATUS_KEY><STATUS_DESCR>New</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>Medium</PRIORITY_DESCR><CREATE_DATE>20130102203257</CREATE_DATE><CHANGE_DATE>20130102203257</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>0</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>0</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY/><CUST_NO/><REPORTER_NAME/><PROCESSOR_ID/><REPORTER_ID/><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/0000000082?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE2></asx:values></asx:abap>';
    var mockData = '<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568E3DB61ED295B0C4C96593DE3E</OBJECT_GUID><OBJECT_ID>0000000083</OBJECT_ID><DESCRIPTION>Maris Test #2 copy 12 updated</DESCRIPTION><STATUS_KEY>E0012</STATUS_KEY><STATUS_DESCR>In Process</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>Medium</PRIORITY_DESCR><CREATE_DATE>20130103091558</CREATE_DATE><CHANGE_DATE>20130708095923</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>0</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>0</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME>SGrp-D25 /</CUST_NAME><ESCALATED/><ESCALATION/><CATEGORY>BI-BETA-BIP</CATEGORY><CUST_NO>56</CUST_NO><REPORTER_NAME>Philip Aliband / 70447 Stuttgart</REPORTER_NAME><PROCESSOR_ID/><REPORTER_ID>D001659</REPORTER_ID><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/0000000083?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG>O 10279386</PROCESSING_ORG><PROCESSING_ORG_TXT>PS VGSC EMEA</PROCESSING_ORG_TXT><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE1><RESULTNODE2><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>00505681409E1EE3BADC4A687B7B5E13</OBJECT_GUID><OBJECT_ID>1410541346</OBJECT_ID><DESCRIPTION>UI impact SAP UI SP 8</DESCRIPTION><STATUS_KEY>E0003</STATUS_KEY><STATUS_DESCR>On Hold</STATUS_DESCR><PRIORITY_KEY>3</PRIORITY_KEY><PRIORITY_DESCR>High</PRIORITY_DESCR><CREATE_DATE>20140721051820</CREATE_DATE><CHANGE_DATE>20140725074102</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>20140606054300</IRT_EXPIRY><MPT_EXPIRY>20140626102039</MPT_EXPIRY><IRT_START>20140603054300</IRT_START><MPT_START>20140603054300</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY>CA-MSS-HCM</CATEGORY><CUST_NO/><REPORTER_NAME/><PROCESSOR_ID/><REPORTER_ID/><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/1410541346?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000541346</MESSAGE_NO><MESSAGE_YEAR>2014</MESSAGE_YEAR><MESSAGE_INSNO>0120025231</MESSAGE_INSNO><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID>012002523100005413462014</CSS_OBJECT_ID></_-SID_-CN_IF_DEVDB_INC_OUT_S><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568E3DB61ED295A369943052BE3E</OBJECT_GUID><OBJECT_ID>0000000082</OBJECT_ID><DESCRIPTION>Maris Test #1</DESCRIPTION><STATUS_KEY>E0003</STATUS_KEY><STATUS_DESCR>New</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>Medium</PRIORITY_DESCR><CREATE_DATE>20130102203257</CREATE_DATE><CHANGE_DATE>20130102203257</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>0</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>0</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY/><CUST_NO/><REPORTER_NAME/><PROCESSOR_ID/><REPORTER_ID/><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/0000000082?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE2></asx:values></asx:abap>';
    var mockDataChanged = '<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568E3DB61ED295B0C4C96593DE3E</OBJECT_GUID><OBJECT_ID>0000000083</OBJECT_ID><DESCRIPTION>Maris Test #2 copy 12 updated</DESCRIPTION><STATUS_KEY>E0012</STATUS_KEY><STATUS_DESCR>In Process</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>Medium</PRIORITY_DESCR><CREATE_DATE>20130103091558</CREATE_DATE><CHANGE_DATE>20130708095923</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>0</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>0</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME>SGrp-D25 /</CUST_NAME><ESCALATED/><ESCALATION/><CATEGORY>BI-BETA-BIP</CATEGORY><CUST_NO>56</CUST_NO><REPORTER_NAME>Philip Aliband / 70447 Stuttgart</REPORTER_NAME><PROCESSOR_ID/><REPORTER_ID>D001659</REPORTER_ID><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/0000000083?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG>O 10279386</PROCESSING_ORG><PROCESSING_ORG_TXT>PS VGSC EMEA</PROCESSING_ORG_TXT><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE1><RESULTNODE2><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>00505681409E1EE3BADC4A687B7B5E13</OBJECT_GUID><OBJECT_ID>1410541346</OBJECT_ID><DESCRIPTION>UI impact SAP UI SP 8</DESCRIPTION><STATUS_KEY>E0003</STATUS_KEY><STATUS_DESCR>On Hold</STATUS_DESCR><PRIORITY_KEY>3</PRIORITY_KEY><PRIORITY_DESCR>High</PRIORITY_DESCR><CREATE_DATE>20140721051820</CREATE_DATE><CHANGE_DATE>21990707010101</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>20140606054300</IRT_EXPIRY><MPT_EXPIRY>20140626102039</MPT_EXPIRY><IRT_START>20140603054300</IRT_START><MPT_START>20140603054300</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY>CA-MSS-HCM</CATEGORY><CUST_NO/><REPORTER_NAME/><PROCESSOR_ID/><REPORTER_ID/><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/1410541346?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000541346</MESSAGE_NO><MESSAGE_YEAR>2014</MESSAGE_YEAR><MESSAGE_INSNO>0120025231</MESSAGE_INSNO><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID>012002523100005413462014</CSS_OBJECT_ID></_-SID_-CN_IF_DEVDB_INC_OUT_S><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568E3DB61ED295A369943052BE3E</OBJECT_GUID><OBJECT_ID>0000000082</OBJECT_ID><DESCRIPTION>Maris Test #1</DESCRIPTION><STATUS_KEY>E0003</STATUS_KEY><STATUS_DESCR>New</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>Medium</PRIORITY_DESCR><CREATE_DATE>20130102203257</CREATE_DATE><CHANGE_DATE>20130102203257</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>0</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>0</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY/><CUST_NO/><REPORTER_NAME/><PROCESSOR_ID/><REPORTER_ID/><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/0000000082?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE2></asx:values></asx:abap>';
    var mockDataWithDuplicates = '<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568E3DB61ED295B0C4C96593DE3E</OBJECT_GUID><OBJECT_ID>0000000083</OBJECT_ID><DESCRIPTION>Maris Test #2 copy 12 updated</DESCRIPTION><STATUS_KEY>E0012</STATUS_KEY><STATUS_DESCR>In Process</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>Medium</PRIORITY_DESCR><CREATE_DATE>20130103091558</CREATE_DATE><CHANGE_DATE>20130708095923</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>0</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>0</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME>SGrp-D25 /</CUST_NAME><ESCALATED/><ESCALATION/><CATEGORY>BI-BETA-BIP</CATEGORY><CUST_NO>56</CUST_NO><REPORTER_NAME>Philip Aliband / 70447 Stuttgart</REPORTER_NAME><PROCESSOR_ID/><REPORTER_ID>D001659</REPORTER_ID><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/0000000083?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG>O 10279386</PROCESSING_ORG><PROCESSING_ORG_TXT>PS VGSC EMEA</PROCESSING_ORG_TXT><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568E3DB61ED295A369943052BE3E</OBJECT_GUID><OBJECT_ID>0000000082</OBJECT_ID><DESCRIPTION>Maris Test #1</DESCRIPTION><STATUS_KEY>E0003</STATUS_KEY><STATUS_DESCR>New</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>Medium</PRIORITY_DESCR><CREATE_DATE>20130102203257</CREATE_DATE><CHANGE_DATE>20130102203257</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>0</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>0</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY/><CUST_NO/><REPORTER_NAME/><PROCESSOR_ID/><REPORTER_ID/><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/0000000082?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE1><RESULTNODE2><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>00505681409E1EE3BADC4A687B7B5E13</OBJECT_GUID><OBJECT_ID>1410541346</OBJECT_ID><DESCRIPTION>UI impact SAP UI SP 8</DESCRIPTION><STATUS_KEY>E0003</STATUS_KEY><STATUS_DESCR>On Hold</STATUS_DESCR><PRIORITY_KEY>3</PRIORITY_KEY><PRIORITY_DESCR>High</PRIORITY_DESCR><CREATE_DATE>20140721051820</CREATE_DATE><CHANGE_DATE>20140725074102</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>20140606054300</IRT_EXPIRY><MPT_EXPIRY>20140626102039</MPT_EXPIRY><IRT_START>20140603054300</IRT_START><MPT_START>20140603054300</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY>CA-MSS-HCM</CATEGORY><CUST_NO/><REPORTER_NAME/><PROCESSOR_ID/><REPORTER_ID/><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/1410541346?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000541346</MESSAGE_NO><MESSAGE_YEAR>2014</MESSAGE_YEAR><MESSAGE_INSNO>0120025231</MESSAGE_INSNO><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID>012002523100005413462014</CSS_OBJECT_ID></_-SID_-CN_IF_DEVDB_INC_OUT_S><_-SID_-CN_IF_DEVDB_INC_OUT_S><OBJECT_GUID>0050568E3DB61ED295A369943052BE3E</OBJECT_GUID><OBJECT_ID>0000000082</OBJECT_ID><DESCRIPTION>Maris Test #1</DESCRIPTION><STATUS_KEY>E0003</STATUS_KEY><STATUS_DESCR>New</STATUS_DESCR><PRIORITY_KEY>5</PRIORITY_KEY><PRIORITY_DESCR>Medium</PRIORITY_DESCR><CREATE_DATE>20130102203257</CREATE_DATE><CHANGE_DATE>20130102203257</CHANGE_DATE><SCOPING_KEY>000000000000000000</SCOPING_KEY><SCOPING_DESCR/><READMARK/><QUEUE_NAME/><IRT_EXPIRY>0</IRT_EXPIRY><MPT_EXPIRY>0</MPT_EXPIRY><IRT_START>0</IRT_START><MPT_START>0</MPT_START><INIT_SEND>0</INIT_SEND><INIT_RECP>0</INIT_RECP><IRT_FUL>0</IRT_FUL><IRT_USED/><MPT_USED/><MPT_STATUS/><IRT_STATUS/><WORK_PRIO>0</WORK_PRIO><WORK_PRIO_SORT>0.0</WORK_PRIO_SORT><PROCESSOR_NAME/><CUST_NAME/><ESCALATED/><ESCALATION/><CATEGORY/><CUST_NO/><REPORTER_NAME/><PROCESSOR_ID/><REPORTER_ID/><URL_MESSAGE>https://BCDMAIN.WDF.SAP.CORP:443/sap/support/message/0000000082?sap-client=001&sap-language=EN&sap-domainRelax=min</URL_MESSAGE><MESSAGE_NO>0000000000</MESSAGE_NO><MESSAGE_YEAR>0000</MESSAGE_YEAR><MESSAGE_INSNO/><ORG_LVL>000</ORG_LVL><ORG_LVL_TEXT/><PROCESSOR>I034868</PROCESSOR><EMPL_RESP/><PROCESS_TYPE>ZTIN</PROCESS_TYPE><SERVICE_TEAM_TEXT/><PROCESSING_ORG/><PROCESSING_ORG_TXT/><CSS_OBJECT_ID/></_-SID_-CN_IF_DEVDB_INC_OUT_S></RESULTNODE2></asx:values></asx:abap>';
    var deferred;
    var configService;
    var sNotificationText;
    //var iNotificationDuration;
    var loadDataMock = function() {
        return deferred.promise;
    };

    beforeEach(function () {
        angular.module("mock.module").factory("notifier", function(){
            return {
                showInfo: function(sTitle, sText){//, fnCallback, iDuration){
                    sNotificationText = sText;
                    //iNotificationDuration = iDuration;
                }
            };
        });

        module("app.customerMessages");
        module("mock.module");
        
        inject(function($injector){
            configService = $injector.get('app.customerMessages.configservice');
        });
        inject(["$rootScope", "$httpBackend", "$q", "app.customerMessages.ticketData", function (rootScope, _$httpBackend, _$q, _cmTicketData) {
            $httpBackend = _$httpBackend;
            $q = _$q;
            cmTicketData = _cmTicketData;

        }]);
        sNotificationText = "";
    });

    it("should increase the ticket counter according to the backend data", function () {
        $httpBackend.whenGET('https://backup-support.wdf.sap.corp/sap/bc/devdb/customer_incid?sap-client=001&sap-language=EN&origin=' + location.origin).respond(mockData);
        cmTicketData.loadTicketData();
        $httpBackend.flush();
        expect(cmTicketData.prios[0].total).toBe(0);
        expect(cmTicketData.prios[1].total).toBe(1);
        expect(cmTicketData.prios[2].total).toBe(2);
        expect(cmTicketData.prios[3].total).toBe(0);
    });

    it("should reset the priorities in the data structure", function () {
        $httpBackend.whenGET('https://backup-support.wdf.sap.corp/sap/bc/devdb/customer_incid?sap-client=001&sap-language=EN&origin=' + location.origin).respond(mockData);
        cmTicketData.loadTicketData();
        $httpBackend.flush();
        expect(cmTicketData.prios[2].total).toBe(2);

        cmTicketData.resetData();

        expect(cmTicketData.prios[0].total).toBe(0);
        expect(cmTicketData.prios[1].total).toBe(0);
        expect(cmTicketData.prios[2].total).toBe(0);
        expect(cmTicketData.prios[3].total).toBe(0);

        expect(cmTicketData.prios[3].tickets.length).toBe(0);
    });

    it("should update correct count for selection", function(){
    	$httpBackend.whenGET('https://backup-support.wdf.sap.corp/sap/bc/devdb/customer_incid?sap-client=001&sap-language=EN&origin=' + location.origin).respond(mockData);
    	cmTicketData.loadTicketData().then(function(){
            expect(configService.data.selection).toBeDefined();

            configService.data.selection.sel_components = true;
            cmTicketData.updatePrioSelectionCounts();
            expect(cmTicketData.prios[1].selected).toBe(0);
            expect(cmTicketData.prios[2].selected).toBe(1);

            configService.data.selection.assigned_me = true;
            cmTicketData.updatePrioSelectionCounts();
            expect(cmTicketData.prios[1].selected).toBe(1);
            expect(cmTicketData.prios[2].selected).toBe(2);
        });
        $httpBackend.flush();
    });

    it("should set the initialized flag and get the data from the backend", function () {
        deferred = $q.defer();
        var loadDataCalled = false;

        cmTicketData.loadTicketData = loadDataMock;

        var initializePromise = cmTicketData.initialize();

        initializePromise.then(function success() {
            expect(cmTicketData.isInitialized.value).toBe(true);
            expect(loadDataCalled).toBe(true);
        });

        deferred.resolve();
    });

    it("should set the interval for the data refresh", function () {
        deferred = $q.defer();
        cmTicketData.loadTicketData = loadDataMock;
        cmTicketData.initialize();

        expect(cmTicketData.loadTicketDataInterval).not.toBe(null);
    });


    describe("in handling of notifications", function () {
        var testGet;

        beforeEach(function () {
            testGet = $httpBackend.whenGET('https://backup-support.wdf.sap.corp/sap/bc/devdb/customer_incid?sap-client=001&sap-language=EN&origin=' + location.origin);
            
        });
        afterEach(function(){
            $httpBackend.flush();
        });
    
        it("should remember the tickets that were loaded (for notifications)", function(){
            expect(cmTicketData.lastTickets).toBe(null);

            testGet.respond(mockData);
            cmTicketData.loadTicketData().then(function(){
                expect(cmTicketData.lastTickets).not.toBe(null);
            });
        });

        it("should notify me about a new ticket", function(){
            var emptyData = '<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1/><RESULTNODE2/></asx:values></asx:abap>';

            testGet.respond(emptyData);
            cmTicketData.loadTicketData();
            $httpBackend.flush();

            testGet.respond(mockData);
            cmTicketData.loadTicketData().then(function(){
                expect(sNotificationText.indexOf("There is a new Customer Incident")).not.toBe(-1);
            });

        });

        // it("should mark all new tickets as new", function(){
        //     var emptyData = '<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values><RESULTNODE1/><RESULTNODE2/></asx:values></asx:abap>';

        //     testGet.respond(emptyData);
        //     cmTicketData.loadTicketData();
        //     $httpBackend.flush();

        //     testGet.respond(mockData);
        //     cmTicketData.loadTicketData().then(function(){
        //         expect(sNotificationText.indexOf("There is a new Customer Incident")).not.toBe(-1);
        //     });

        // });

        it("should notify me about a changed ticket", function(){

            testGet.respond(mockData);
            cmTicketData.loadTicketData();
            $httpBackend.flush();

            testGet.respond(mockDataChanged);
            cmTicketData.loadTicketData().then(function(){
                expect(cmTicketData.ticketsFromNotifications.assigned_me.length).toBe(1);
                expect(sNotificationText.indexOf("The Customer Incident")).not.toBe(-1);
                expect(cmTicketData.ticketsFromNotifications.assigned_me[0].OBJECT_GUID).toBe("00505681409E1EE3BADC4A687B7B5E13");
            });

        });

        xit("should show notification as customized", function(){
            // configService.data.notificationDuration = 

            // testGet.respond(mockData);
            // cmTicketData.loadTicketData();
            // $httpBackend.flush();

            // testGet.respond(mockDataChanged);
            // cmTicketData.loadTicketData().then(function(){
            //     expect(cmTicketData.ticketsFromNotifications.assigned_me.length).toBe(1);
            //     expect(sNotificationText.indexOf("The Customer Incident")).not.toBe(-1);
            //     expect(cmTicketData.ticketsFromNotifications.assigned_me[0].OBJECT_GUID).toBe("00505681409E1EE3BADC4A687B7B5E13");
            // });

        });

        it("should notify me about a ticket that changed while I was offline", function(){
            configService.lastDataUpdate = new Date(2010, 0, 1, 1, 1, 1);

            testGet.respond(mockData);
            cmTicketData.loadTicketData().then(function(){
                expect(sNotificationText.indexOf("since your last visit")).not.toBe(-1);
                expect(cmTicketData.ticketsFromNotifications.assigned_me.length).toBe(2);
                expect(cmTicketData.ticketsFromNotifications.sel_components.length).toBe(1);
            });

        });

        it("should not throw a notification", function(){
            configService.lastDataUpdate = new Date(2015, 0, 1, 1, 1, 1);

            testGet.respond(mockData);
            cmTicketData.loadTicketData().then(function(){
                expect(sNotificationText).toBe("");
                expect(cmTicketData.ticketsFromNotifications.assigned_me.length).toBe(0);
                expect(cmTicketData.ticketsFromNotifications.sel_components.length).toBe(0);
            });
        });

        it("should keep the ticketsFromNotifications even if there are newer data loads without notifications", function(){
            configService.lastDataUpdate = new Date(2010, 0, 1, 1, 1, 1);

            testGet.respond(mockData);
            cmTicketData.loadTicketData().then(function(){
                expect(cmTicketData.ticketsFromNotifications.assigned_me.length).toBe(2);
                expect(cmTicketData.ticketsFromNotifications.sel_components.length).toBe(1);
            });
            $httpBackend.flush();

            cmTicketData.loadTicketData().then(function(){
                expect(cmTicketData.ticketsFromNotifications.assigned_me.length).toBe(2);
                expect(cmTicketData.ticketsFromNotifications.sel_components.length).toBe(1);
            });
        });
    });

    describe("in handling of duplicted messages", function () {

        beforeEach(function () {
            $httpBackend.whenGET('https://backup-support.wdf.sap.corp/sap/bc/devdb/customer_incid?sap-client=001&sap-language=EN&origin=' + location.origin).respond(mockDataWithDuplicates);
        });
        afterEach(function(){
            $httpBackend.flush();
        });

        it("should reflect correct number in prios total", function(){
            cmTicketData.loadTicketData().then(function(){
                expect(cmTicketData.prios[2].total).toBe(2);
            });
        });

        it("should update correct count for selection", function(){
            cmTicketData.loadTicketData().then(function(){
                expect(configService.data.selection).toBeDefined();

                configService.data.selection.sel_components = true;
                cmTicketData.updatePrioSelectionCounts();
                expect(cmTicketData.prios[1].selected).toBe(0);
                expect(cmTicketData.prios[2].selected).toBe(2);

                configService.data.selection.assigned_me = true;
                cmTicketData.updatePrioSelectionCounts();
                expect(cmTicketData.prios[1].selected).toBe(1);
                expect(cmTicketData.prios[2].selected).toBe(2);
            });
        });
    });
});
