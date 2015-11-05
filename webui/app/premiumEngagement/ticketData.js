angular.module("app.premiumEngagement").service("app.premiumEngagement.ticketData", [
    "$q", "$http", "$window", "$rootScope", "$location", "bridge.ticketAppUtils.ticketUtils", "app.premiumEngagement.configService", "notifier", "bridge.converter",
    function($q, $http, $window, $rootScope, $location, ticketUtils, configService, notifier, converter){

        var Data = function(appId){
            var that = this,
                config = configService.getInstanceForAppId(appId);

            this.isInitialized = { value: false };
            this.appId = appId;
            this.lastTickets = null;
            this.tickets = [];
            this.ticketsFromNotifications = [];
            this.selectedSourceSystem = ticketUtils.ticketSourceSystems[4];
            this.prios = [  { key: "1", description: "Very High", active: false, total: 0 },
                            { key: "3", description: "High", active: false, total: 0 },
                            { key: "5", description: "Medium", active: false, total: 0 },
                            { key: "9", description: "Low", active: false, total: 0 }];

            this.loadTicketData = function(bSuppressNotifications){
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
                                _.remove(that.tickets, {STATUS_KEY: "E0009"}); // Confirmed
                                _.remove(that.tickets, {STATUS_KEY: "E0010"}); // Confirmed Automatically
                                that.calculateTotals();
                                that.fillCustomerName(that.tickets);
                            }
                        } else {
                            that.tickets = [];
                            that.resetTotals();
                        }
                        defer.resolve();
                    })
                    .error(function () {
                        defer.reject();
                    });

                defer.promise.then(function () {

                    if (bSuppressNotifications !== true) {
                        if (that.lastTickets !== null) {
                            that.notifyChanges(that.getTicketsForCustomerSelection(config.DEFAULT_CUSTOMER_SELECTION), that.lastTickets);
                        } else if (config.data.lastDataUpdate !== null) {
                            that.notifyOfflineChanges(that.getTicketsForCustomerSelection(config.DEFAULT_CUSTOMER_SELECTION), config.data.lastDataUpdate);
                        }
                    }

                    config.data.lastDataUpdate = new Date();
                    that.lastTickets = angular.copy(that.tickets);
                });

                return defer.promise;
            };

            this.getTicketsForCustomerSelection = function(sSelectedCustomerNo){
                var filteredTickets = angular.copy(that.tickets);
                if (config.data.bIgnoreCustomerAction){
                    _.remove(filteredTickets, {STATUS_KEY: "E0004"}); // Customer Action
                    _.remove(filteredTickets, {STATUS_KEY: "E0005"}); // Solution Provided
                }

                if (sSelectedCustomerNo === config.DEFAULT_CUSTOMER_SELECTION){
                    return filteredTickets;
                } else {
                    return _.where(filteredTickets, function(oTicket){
                        return parseInt(oTicket.CUST_NO, 10) === parseInt(sSelectedCustomerNo, 10);
                    });
                }
            };

            this.calculateTotals = function () {
                var tickets = that.getTicketsForCustomerSelection(config.data.sSelectedCustomer);

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
                        return parseInt(oTicket.CUST_NO, 10) === parseInt(oCustomer.sId, 10);
                    });

                    if (oCorrespondingTicket !== undefined) {
                        oCustomer.sName = oCorrespondingTicket.CUST_NAME;
                    }
                });
            };

            function notifierClickCallback(sApp, oNotificationData) {
                that.ticketsFromNotifications = oNotificationData.tickets;
                // see http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                _.defer(function () {
                    $rootScope.$apply(function () {
                        $location.path("/detail/premiumEngagement/" + that.appId + "/null/true");
                    });
                });
            }

            this.notifyOfflineChanges = function (tickets, lastDataUpdateFromConfig) {
                var foundTickets;

                foundTickets = _.where(tickets, function (ticket) {
                    return converter.getDateFromAbapTimeString(ticket.CHANGE_DATE) > lastDataUpdateFromConfig;
                });

                if (angular.isArray(foundTickets) && foundTickets.length > 0) {
                    notifier.showInfo('Customer Incidents Changed', 'Some of your Customer Incidents changed since your last visit of Bridge', that.sAppIdentifier,
                        notifierClickCallback, null, {tickets: foundTickets});
                }
            };

            this.notifyChanges = function (newTicketData, oldTicketData) {
                angular.forEach(newTicketData, function (ticket) {
                    var foundTicket = _.find(oldTicketData, {OBJECT_GUID: ticket.OBJECT_GUID});

                    if (foundTicket === undefined) {
                        notifier.showInfo('New Customer Incident', 'There is a new Customer Incident"' + ticket.DESCRIPTION + '"', that.sAppIdentifier, notifierClickCallback, null, {tickets: [ticket]});
                    } else if (converter.getDateFromAbapTimeString(ticket.CHANGE_DATE) > converter.getDateFromAbapTimeString(foundTicket.CHANGE_DATE)) {
                        notifier.showInfo('Customer Incident Changed', 'The Customer Incident "' + ticket.DESCRIPTION + '" changed', that.sAppIdentifier, notifierClickCallback, null, {tickets: [ticket]});
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
