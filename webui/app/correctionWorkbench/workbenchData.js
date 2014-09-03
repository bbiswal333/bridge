angular.module('app.correctionWorkbench').service('app.correctionWorkbench.workbenchData',
    ['$rootScope', '$http', '$q', '$location', 'notifier', '$window',
    function ($rootScope, $http, $q, $location, notifier, $window) {
	var that = this;
    this.lastDataUpdate = null;
    this.lastDataUpdateFromConfig = null;
    this.sAppIdentifier = "";
	this.isInitialized = { value: false };
    this.correctionRequestsFromNotifications = [];
    this.lastWorkbenchData = null;
	this.workbenchData = {};
	this.workbenchData.correctionRequestsPlannedForTesting = [];
    this.workbenchData.correctionRequestsInProcess = [];
    this.workbenchData.correctionRequestsTesting = [];
    this.workbenchData.correctionRequestsTestedOk = [];

	this.categories = [
        { name: "In Process", source: "onMyName", statusKey: "2", targetArray: "correctionRequestsInProcess", total: 0 },
        { name: "Testing", source: "onMyName", statusKey: "3", targetArray: "correctionRequestsTesting", total: 0 }, 
        { name: "Tested Ok", source: "onMyName", statusKey: "4", targetArray: "correctionRequestsTestedOk", total: 0 }, 
        { name: "Planned for Testing", source: "plannedForTesting", targetArray: "correctionRequestsPlannedForTesting", total: 0 }
    ];

    function notifierClickCallback() {
        _.defer(function() {
            $rootScope.$apply(function () {
                $location.path("/detail/correctionWorkbench/null/true");
            });
        });
    }

    function parseBackendData(backendData, source) {
        if(source === "plannedForTesting") {
            that.workbenchData.correctionRequestsPlannedForTesting.push(backendData);
            that.categories[3].total++;
        } else {
            angular.forEach(that.categories, function (category) {
                if (backendData.status._key === category.statusKey)
                {
                    that.workbenchData[category.targetArray].push(backendData);
                    category.total++;
                }
            });
        }
    }

	this.loadWorkbenchData = function () {
        var deferredRequestOnMy = $q.defer();
        var deferredRequestForTesting = $q.defer();

        $http.post('https://css.wdf.sap.corp/sap(bD1lbiZjPTAwMQ==)/bc/bsp/spn/jcwb_srv/find_correction_requests?sap-language=EN&origin=' + $window.location.origin,
                   '<request withDetails="common"><query id="STD_MY_OPEN_CR" queryDefinitionId="STD_MY_OPEN_CR"><conditions/></query><query id="STD_PLANNED_FOR_TESTING_CR" queryDefinitionId="STD_PLANNED_FOR_TESTING_CR"><conditions/></query></request>',
                   {withCredentials: true, headers: {'Content-Type': 'text/plain'}}
        ).success(function (data) {
            that.resetData("onMyName");
            
            data = new X2JS().xml_str2json(data);
            //data = new X2JS().xml_str2json('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE payload SYSTEM "https://cid.wdf.sap.corp/sap/bc/bsp/spn/JCWB_SRV/data_CWB_documents_with_references.dtd"><payload><messages/><request withDetails="common"><query id="STD_MY_OPEN_CR" queryDefinitionId="STD_MY_OPEN_CR" type="" user="D051804"><text/></query></request><data><users><user id="0100248441" alternateId="D049938" href="https://cid.wdf.sap.corp/sap/bc/bsp/spn/JCWB_SRV/user?name=D049938"><displayName>Marcus Loeffler (D049938)</displayName><company>SAP SE</company><firstname>Marcus</firstname><surname>Loeffler</surname><addressbookUrl>https://people.wdf.sap.corp/profiles/D049938</addressbookUrl></user><user id="0100283205" alternateId="D051804" href="https://cid.wdf.sap.corp/sap/bc/bsp/spn/JCWB_SRV/user?name=D051804"><displayName>Daniel Schueler (D051804)</displayName><company>SAP SE</company><firstname>Daniel</firstname><surname>Schueler</surname><addressbookUrl>https://people.wdf.sap.corp/profiles/D051804</addressbookUrl></user></users><notes></notes><correctiveMeasures><correctiveMeasure id="002006825000000039142011" href="https://cid.wdf.sap.corp/sap/bc/bsp/spn/JCWB_SRV/corrective_measure?id=002006825000000039142011"><url>https://cid.wdf.sap.corp/sap/bc/bsp/sap/itsm_gui/cssguimessage.htm?pointer=002006825000000039142011</url><creationDateTime>2011-08-30T15:52:37+02:00</creationDateTime><changeDateTime>2014-09-11T11:22:08+02:00</changeDateTime><shortText editable="false">Build&amp;Deploy</shortText><status key="2" editable="false">In process</status><priority key="2" editable="false">Middle</priority><component key="0000054647" editable="false">XX-INT-JCWB</component><project id="3759">test_schmitty</project><securityRelevant>false</securityRelevant></correctiveMeasure></correctiveMeasures><correctionRequests><correctionRequest id="002006825000000039152011" href="https://cid.wdf.sap.corp/sap/bc/bsp/spn/JCWB_SRV/correction_request?id=002006825000000039152011" hashcode="28AA8F2EB8D353E6D7C78479D2532E47"><url>https://cid.wdf.sap.corp/sap/bc/bsp/sap/itsm_gui/cssguimessage.htm?pointer=002006825000000039152011</url><readDateTime hashcode="683F20C9A8EDE1935C2CF63F3CE13A8D">2014-08-11T11:31:50+02:00</readDateTime><reporter idref="0100248441" uriref="https://cid.wdf.sap.corp/sap/bc/bsp/spn/JCWB_SRV/user?name=D049938" alternateId="D049938"/><processor idref="0100283205" uriref="https://cid.wdf.sap.corp/sap/bc/bsp/spn/JCWB_SRV/user?name=D051804" alternateId="D051804" editable="true"/><creationDateTime>2011-08-30T15:53:00+02:00</creationDateTime><changeDateTime>2014-09-11T11:22:08+02:00</changeDateTime><shortText editable="true">Build&amp;Deploy</shortText><status key="2" editable="true">Build &amp; Deploy</status><priority key="3" editable="true">Medium</priority><component key="0000054647" editable="true">XX-INT-JCWB</component><release>6.40</release><repositoryType>P</repositoryType><project id="3759" type="PPMS">test_schmitty</project><codelineName>60NW_SP_COR</codelineName><codelinePolicy>SP Development</codelinePolicy><sp>005</sp><releaseBy>QM</releaseBy><participants hashcode="BAC4669EF6599BAC00C0EC3635CFA876" testerEditable="false"><participant><role key="01">Last Active Developer</role><person idref="0100248441" uriref="https://cid.wdf.sap.corp/sap/bc/bsp/spn/JCWB_SRV/user?name=D049938" alternateId="D049938"/></participant><participant><role key="04">Involved Developer</role><person idref="0100248441" uriref="https://cid.wdf.sap.corp/sap/bc/bsp/spn/JCWB_SRV/user?name=D049938" alternateId="D049938"/></participant></participants><notes hashcode="#EMPTY_LIST#" editable="true"></notes><repositoryServer>perforce1666.wdf.sap.corp:1666</repositoryServer><codeLocation>//intern/test_schmitty/60NW_SP_COR/...</codeLocation><inValidation>false</inValidation><inAssembly>false</inAssembly><beforeRTC>false</beforeRTC><scheduleDeadline>9999-12-31T01:00:00+01:00</scheduleDeadline><patchRequestDateTime></patchRequestDateTime><correctiveMeasure idref="002006825000000039142011" uriref="https://cid.wdf.sap.corp/sap/bc/bsp/spn/JCWB_SRV/corrective_measure?id=002006825000000039142011"><url>https://cid.wdf.sap.corp/sap/bc/bsp/sap/itsm_gui/cssguimessage.htm?pointer=002006825000000039142011</url></correctiveMeasure></correctionRequest></correctionRequests></data></payload>');
            var payloadData = data.payload.data;

            if (angular.isArray(payloadData.correctionRequests.correctionRequest)) {
                angular.forEach(payloadData.correctionRequests.correctionRequest, function (correctionRequest) {
                    parseBackendData(correctionRequest, 'onMyName');
                });
            } else if (angular.isObject(payloadData.correctionRequests)) {
                parseBackendData(payloadData.correctionRequests.correctionRequest, 'onMyName');
            }

            deferredRequestOnMy.resolve();

        }).error(function () {
            deferredRequestOnMy.reject();
        });

        $http.post('https://css.wdf.sap.corp/sap(bD1lbiZjPTAwMQ==)/bc/bsp/spn/jcwb_srv/find_correction_requests?sap-language=EN&origin=' + $window.location.origin,
                   '<request withDetails="common"><query id="STD_PLANNED_FOR_TESTING_CR" queryDefinitionId="STD_PLANNED_FOR_TESTING_CR"><conditions/></query></request>',
                   {withCredentials: true, headers: {'Content-Type': 'text/plain'}}
        ).success(function (data) {
            that.resetData("plannedForTesting");
            
            data = new X2JS().xml_str2json(data);
            var payloadData = data.payload.data;

            if (angular.isArray(payloadData.correctionRequests.correctionRequest)) {
                angular.forEach(payloadData.correctionRequests.correctionRequest, function (correctionRequest) {
                    parseBackendData(correctionRequest, 'plannedForTesting');
                });
            } else if (angular.isObject(payloadData.correctionRequests)) {
                parseBackendData(payloadData.correctionRequests.correctionRequest, 'plannedForTesting');
            }

            deferredRequestForTesting.resolve();

        }).error(function () {
            deferredRequestForTesting.reject();
        });

        var pAllRequestsFinished = $q.all([deferredRequestOnMy.promise, deferredRequestForTesting.promise]);
        pAllRequestsFinished.then(function success() {
            if (that.lastWorkbenchData !== null) {
                that.compareData(that.workbenchData, that.lastWorkbenchData);
            } else {
                that.notifyOfflineChanges(that.workbenchData, that.lastDataUpdateFromConfig);
            }
            that.lastDataUpdate = new Date();
            that.lastWorkbenchData = angular.copy(that.workbenchData);
        });

        return pAllRequestsFinished;
    };

    this.resetData = function (source) {
        angular.forEach(that.categories, function (category) {
            if (category.source === source) {
                category.total = 0;
            }
        });

        if(source === "onMyName") {
            that.workbenchData.correctionRequestsInProcess.length = 0;
            that.workbenchData.correctionRequestsTesting.length = 0;
            that.workbenchData.correctionRequestsTestedOk.length = 0;
        } else if(source === "plannedForTesting") {
            that.workbenchData.correctionRequestsPlannedForTesting.length = 0;
        }
    };

    this.compareData = function(newWorkbenchData, oldWorkbenchData){
        that.correctionRequestsFromNotifications.length = 0;

        angular.forEach(that.categories, function (category) {
            angular.forEach(newWorkbenchData[category.targetArray], function (correctionRequest) {
                var foundCorrectionRequest = that.findCorrectionRequest(correctionRequest._id, oldWorkbenchData);

                if (foundCorrectionRequest === null) {
                    that.correctionRequestsFromNotifications.push(correctionRequest);
                    notifier.showInfo('New Correction Request', 'There is a new Correction Request "' + correctionRequest.shortText + '"', that.sAppIdentifier, notifierClickCallback);
                } else if (new Date(correctionRequest.changeDateTime) > new Date(foundCorrectionRequest.changeDateTime)) {
                    that.correctionRequestsFromNotifications.push(correctionRequest);
                    notifier.showInfo('Correction Request Changed', 'The Correction Request "' + correctionRequest.shortText + '" changed', that.sAppIdentifier, notifierClickCallback);
                }

            });
        });
    };

    this.notifyOfflineChanges = function(workbenchData, lastDataUpdateFromConfig){
        that.correctionRequestsFromNotifications.length = 0;

        angular.forEach(that.categories, function (category) {
            angular.forEach(workbenchData[category.targetArray], function (correctionRequest) {
                if (new Date(correctionRequest.changeDateTime) > lastDataUpdateFromConfig){
                    that.correctionRequestsFromNotifications.push(correctionRequest);
                }
            });
        });

        if (that.correctionRequestsFromNotifications.length > 0){
            notifier.showInfo('Correction Request Changed', 'Some of your Correction Requests changed since your last visit of Bridge', that.sAppIdentifier, notifierClickCallback);
        }
    };

    this.findCorrectionRequest = function(id, workbenchData){
        for (var i = 0; i < that.categories.length; i++){
            for (var j = 0; j < workbenchData[that.categories[i].targetArray].length; j++){
                if (workbenchData[that.categories[i].targetArray][j]._id === id){
                    return workbenchData[that.categories[i].targetArray][j];
                }
            }
        }

        return null;
    };

	this.initialize = function (sAppIdentifier, lastDataUpdateFromConfig) {
        this.sAppIdentifier = sAppIdentifier;
        this.lastDataUpdateFromConfig = lastDataUpdateFromConfig;

        var loadWorkbenchPromise = this.loadWorkbenchData();
        loadWorkbenchPromise.then(function success() {
            that.isInitialized.value = true;
        });

        return loadWorkbenchPromise;
    };
}]);
