angular.module('app.correctionWorkbench').service('app.correctionWorkbench.workbenchData', ['$http', '$q', '$interval', function ($http, $q, $interval) {
	var that = this;
	this.isInitialized = { value: false };
	this.workbenchData = {};
	this.workbenchData.correctionRequestsPlannedForTesting = [];
    this.workbenchData.correctionRequestsInProcess = [];
    this.workbenchData.correctionRequestsTesting = [];
    this.workbenchData.correctionRequestsTestedOk = [];

	this.categories = [
        { name: "In Process", source: "onMyName", statusKey: "2", targetArray: "correctionRequestsInProcess", total: 0 },
        { name: "Testing", source: "onMyName", statusKey: "3", targetArray: "correctionRequestsTesting", total: 0 }, 
        { name: "Tested Ok", source: "onMyName", statusKey: "4", targetArray: "correctionRequestsTestedOk", total: 0 }, 
        { name: "Planned for Testing", source: "plannedForTesting", targetArray: "correctionRequestsPlannedForTesting", total: 0 }];

    function parseBackendData(backendData, source) {
        if(source == "plannedForTesting") {
            that.workbenchData["correctionRequestsPlannedForTesting"].push(backendData);
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

        $http.post('https://css.wdf.sap.corp/sap(bD1lbiZjPTAwMQ==)/bc/bsp/spn/jcwb_srv/find_correction_requests?sap-language=EN',
                   '<request withDetails="common"><query id="STD_MY_OPEN_CR" queryDefinitionId="STD_MY_OPEN_CR"><conditions/></query><query id="STD_PLANNED_FOR_TESTING_CR" queryDefinitionId="STD_PLANNED_FOR_TESTING_CR"><conditions/></query></request>',
                   {withCredentials: false, headers: {'Content-Type': 'text/plain'}}
        ).success(function (data) {
            that.resetData("onMyName");
            
            data = new X2JS().xml_str2json(data);
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

        $http.post('https://css.wdf.sap.corp/sap(bD1lbiZjPTAwMQ==)/bc/bsp/spn/jcwb_srv/find_correction_requests?sap-language=EN',
                   '<request withDetails="common"><query id="STD_PLANNED_FOR_TESTING_CR" queryDefinitionId="STD_PLANNED_FOR_TESTING_CR"><conditions/></query></request>',
                   {withCredentials: false, headers: {'Content-Type': 'text/plain'}}
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

        return $q.all([deferredRequestOnMy.promise, deferredRequestForTesting.promise]);
    };

    this.resetData = function (source) {
        angular.forEach(that.categories, function (category) {
            if(category.source == source) {
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


	this.initialize = function () {
        this.loadWorkbenchDataInterval = $interval(this.loadWorkbenchData, 60000 * 10);

        var loadWorkbenchPromise = this.loadWorkbenchData();
        loadWorkbenchPromise.then(function success() {
            that.isInitialized.value = true;
        });

        return loadWorkbenchPromise;
    };
}]);