angular.module('app.correctionWorkbench').service('app.correctionWorkbench.workbenchData', ['$http', '$q', '$interval', 'app.correctionWorkbench.configservice', function ($http, $q, $interval, configservice) {
	var that = this;
	this.isInitialized = { value: false };
	this.workbenchData = {};
	this.workbenchData.correctionRequestsForTesting = [];
    this.workbenchData.correctiveMeasures = [];

	this.prios = [
        { name: "Very high",    number: 1, correctionRequestsForTesting: 0, correctiveMeasures: 0, selected: 0, total: 0 },
        { name: "High",         number: 2, correctionRequestsForTesting: 0, correctiveMeasures: 0, selected: 0, total: 0 }, 
        { name: "Medium",       number: 3, correctionRequestsForTesting: 0, correctiveMeasures: 0, selected: 0, total: 0 }, 
        { name: "Low",          number: 4, correctionRequestsForTesting: 0, correctiveMeasures: 0, selected: 0, total: 0 }];    

    function parseBackendData(backendData, category) {
        angular.forEach(that.prios, function (prio) {
            if (backendData.priority._key === prio.number.toString())
            {                
                prio[category]++;
                that.workbenchData[category].push(backendData);
                prio.total++;
            }
        });
    }

	this.loadWorkbenchData = function () {
        var deferred = $q.defer();

        //this.userid = bridgeDataService.getUserInfo().BNAME.toUpperCase();
        $http.post('https://css.wdf.sap.corp/sap(bD1lbiZjPTAwMQ==)/bc/bsp/spn/jcwb_srv/find_correction_requests?sap-language=EN',
        		   '<request withDetails="common"><query id="STD_MY_OPEN_CR" queryDefinitionId="STD_MY_OPEN_CR"><conditions/></query></request>',
        		   {withCredentials: false, headers: {'Content-Type': 'text/plain'}}
        ).success(function (data) {
            that.resetData();
            
            data = new X2JS().xml_str2json(data);
            var payloadData = data.payload.data;

            if (angular.isArray(payloadData.correctionRequests)) {
                angular.forEach(payloadData.correctionRequests, function (correctionRequest) {
                    parseBackendData(correctionRequest.correctionRequest, 'correctionRequestsForTesting');
                });
            } else if (angular.isObject(payloadData.correctionRequests)) {
                parseBackendData(payloadData.correctionRequests.correctionRequest, 'correctionRequestsForTesting');
            }
            
            that.updatePrioSelectionCounts();
            deferred.resolve();

        }).error(function () {
            deferred.reject();
        });

        return deferred.promise;
    };

    this.resetData = function () {
        angular.forEach(that.prios, function (prio) {
            prio.correctionRequestsForTesting = 0;
            prio.correctiveMeasures = 0;
            prio.selected = 0;
            prio.total = 0;
        });

        that.workbenchData.correctionRequestsForTesting.length = 0;
        that.workbenchData.correctiveMeasures.length = 0;
    }; 

    this.updatePrioSelectionCounts = function () {
        angular.forEach(this.prios, function (prio) {
            prio.selected = 0;
            if (configservice.data.selection.correctionRequestsForTesting) { prio.selected = prio.selected + prio.correctionRequestsForTesting; }
            if (configservice.data.selection.correctiveMeasures) { prio.selected = prio.selected + prio.correctiveMeasures; }
        });
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