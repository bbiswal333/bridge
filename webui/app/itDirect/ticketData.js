angular.module("app.itdirect").service("app.itdirect.ticketData", ["$http", "$q", "$interval", "bridgeDataService", "app.itdirect.config",
    function($http, $q, $interval, bridgeDataService, itdirectConfig){

    var that = this;
    this.isInitialized = {value: false};
    this.prios = [{
        key: "1", description: "Very High", active: false
    },{
        key: "2", description: "High", active: false
    },{
        key: "3", description: "Medium", active: false
    },{
        key: "4", description: "Low", active: false
    }];

    this.tickets = {};
    this.tickets.assigned_me = [];
    this.tickets.savedSearch = [];

    this.loadTicketData = function(){
        var promiseArray = [];
        var deferAssignedToMe = $q.defer();

        that.tickets.assigned_me.length = 0;
        that.tickets.savedSearch.length = 0;

        var userid = bridgeDataService.getUserInfo().BNAME.toUpperCase();
        $http.get("https://pgpmain.wdf.sap.corp/sap/opu/odata/sap/ZMOB_INCIDENT;v=2/TicketCollection?$filter=PROCESS_TYPE eq 'ZINC,ZSER' and PARTIES_OF_REQ eq '" + userid + "'&$format=json")
            .success(function(data){

                angular.forEach(data.d.results, function(backendTicket){
                    that.tickets.assigned_me.push(backendTicket);
                });
                deferAssignedToMe.resolve();
            })
            .error(function(){
                deferAssignedToMe.reject();
            });
        promiseArray.push(deferAssignedToMe.promise);

        if (itdirectConfig.bIncludeSavedSearch === true) {
            var deferSavedSearch = $q.defer();

            $http.get("https://pgpmain.wdf.sap.corp/sap/opu/odata/sap/ZMOB_INCIDENT;v=2/TicketCollection?$filter=PROCESS_TYPE eq 'ZINC,ZSER' and PARAMETER_KEY eq '" + itdirectConfig.sSavedSearchToInclude + "'&$format=json")
                .success(function(data){

                    angular.forEach(data.d.results, function(backendTicket){
                        that.tickets.savedSearch.push(backendTicket);
                    });
                    deferSavedSearch.resolve();
                })
                .error(function(){
                    deferSavedSearch.reject();
                });

            promiseArray.push(deferSavedSearch.promise);
        }

        var pAllRequestsFinished = $q.all(promiseArray);
        pAllRequestsFinished.then(function(){
            itdirectConfig.lastDataUpdate = new Date();
        });

        return pAllRequestsFinished;
    };

    this.activatePrio = function(sPrioKey){
        angular.forEach(that.prios, function(prio){
            // reset all prios first
            prio.active = false;
            if (prio.key === sPrioKey){
               prio.active = true;
            }
        });
    };

    this.initialize = function () {
        $interval(this.loadTicketData, 60000 * 10);

        var loadTicketPromise = this.loadTicketData();
        loadTicketPromise.then(function success() {
            that.isInitialized.value = true;
        });

        return loadTicketPromise;
    };
}]);
