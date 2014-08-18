angular.module("app.itdirect").service("app.itdirect.ticketData", ["$http", "$q", "$interval", "bridgeDataService", function($http, $q, $interval, bridgeDataService){
    var that = this;
    this.isInitialized = {value: false};

    this.tickets = {};
    this.tickets.assigned_me = [];

    this.loadTicketData = function(){
        var deferred = $q.defer();

        this.userid = bridgeDataService.getUserInfo().BNAME.toUpperCase();
        $http.get("https://pgpmain.wdf.sap.corp/sap/opu/odata/sap/ZMOB_INCIDENT;v=2/TicketCollection?$filter=PROCESS_TYPE eq 'ZINC,ZSER' and PARTIES_OF_REQ eq '" + this.userid + "'")
            .success(function(){
                deferred.resolve();
            })
            .error(function(){
                deferred.reject();
            });

        return deferred;
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
