angular.module("app.premiumEngagement").service("app.premiumEngagement.ticketData", [
    "$q", "$http", "$window", "bridge.ticketAppUtils.ticketUtils", "app.premiumEngagement.configService", function($q, $http, $window, ticketUtils, configService){

        var Data = function(appId){
            var that = this,
                config = configService.getInstanceForAppId(appId);

            this.isInitialized = { value: false };
            this.selectedSourceSystem = ticketUtils.ticketSourceSystems[0];
            this.prios = [  { key: "1", description: "Very High", active: false, total: 0 },
                            { key: "3", description: "High", active: false, total: 0 },
                            { key: "5", description: "Medium", active: false, total: 0 },
                            { key: "9", description: "Low", active: false, total: 0 }];

            this.loadTicketData = function(){
                var defer = $q.defer();
                var sServiceUrl = "https://" + that.selectedSourceSystem.urlPart + ".wdf.sap.corp/sap/bc/devdb/customer_i_tqm?sap-client=001&sap-language=en&max_hits=1000&origin=" + $window.location.origin;
                config.data.aConfiguredCustomers.forEach(function(oCustomer){
                    sServiceUrl += "&customer=" + oCustomer.sId;
                });

                $http.get(sServiceUrl)
                    .success(function (data) {
                        that.tickets = new X2JS().xml_str2json(data).abap.values.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"];
                        if (that.tickets !== undefined) {
                            ticketUtils.objectToArray(that, "tickets");

                            if (that.tickets.length > 0) {
                                that.calculateTotals();
                                that.fillCustomerName(that.tickets);
                            }
                        } else {
                            that.resetTotals();
                        }
                        defer.resolve();
                    })
                    .error(function () {
                        defer.reject();
                    });

                defer.promise.then(function () {

                    //if (that.lastTickets !== null) {
                    //    that.notifyChanges(that.getRelevantTickets(true, true, true, true, false), that.lastTickets);
                    //} else if (config.data.lastDataUpdate !== null) {
                    //    that.notifyOfflineChanges(that.getRelevantTickets(true, true, true, true, false), config.data.lastDataUpdate);
                    //}
                    //
                    //config.data.lastDataUpdate = new Date();
                    //that.lastTickets = angular.copy(that.tickets);
                });

                return defer.promise;
            };

            this.getTicketsForCustomerSelection = function(){
                if (config.data.sSelectedCustomer === config.DEFAULT_CUSTOMER_SELECTION){
                    return that.tickets;
                } else {
                    return _.where(that.tickets, function(oTicket){
                        return parseInt(oTicket.CUST_NO) === parseInt(config.data.sSelectedCustomer);
                    });
                }
            };

            this.calculateTotals = function () {
                var tickets = that.getTicketsForCustomerSelection();

                var totals = _.countBy(tickets, function (ticket) {
                    return ticket.PRIORITY_KEY;
                });
                that.prios[0].total = totals[that.prios[0].key] === undefined ? 0 : totals[that.prios[0].key];
                that.prios[1].total = totals[that.prios[1].key] === undefined ? 0 : totals[that.prios[1].key];
                that.prios[2].total = totals[that.prios[2].key] === undefined ? 0 : totals[that.prios[2].key];
                that.prios[3].total = totals[that.prios[3].key] === undefined ? 0 : totals[that.prios[3].key];
            };

            this.resetTotals = function(){
                that.prios[0].total = 0;
                that.prios[1].total = 0;
                that.prios[2].total = 0;
                that.prios[3].total = 0;
            };

            this.fillCustomerName = function(aTickets){
                var oCorrespondingTicket;
                config.data.aConfiguredCustomers.forEach(function(oCustomer){
                    oCorrespondingTicket = _.find(aTickets, function(oTicket){
                        return parseInt(oTicket.CUST_NO) === parseInt(oCustomer.sId);
                    });

                    if (oCorrespondingTicket !== undefined) {
                        oCustomer.sName = oCorrespondingTicket.CUST_NAME;
                    }
                });
            };

            this.initialize = function(sAppIdentifier){
                this.sAppIdentifier = sAppIdentifier;

                var loadTicketPromise = this.loadTicketData();
                loadTicketPromise.then(function success() {
                    that.isInitialized.value = true;
                });

                return loadTicketPromise;
            };
        };

        var instances = {};
        this.getInstanceForAppId = function(appId) {
            if(instances[appId] === undefined) {
                instances[appId] = new Data(appId);
            }
            return instances[appId];
        };
}]);
