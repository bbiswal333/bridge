angular.module("app.itdirect").service("app.itdirect.ticketData",
    ["$rootScope","$http", "$q", "$location", "bridgeDataService", "app.itdirect.config", "notifier", "bridge.converter",
    function($rootScope, $http, $q, $location, bridgeDataService, itdirectConfig, notifier, converter){

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
        this.lastTickets = null;

        this.ticketsFromNotifications = {};
        this.ticketsFromNotifications.assigned_me = [];
        this.ticketsFromNotifications.savedSearch = [];

        this.sAppIdentifier = "";

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

            if (itdirectConfig.bIncludeSavedSearch === true && itdirectConfig.sSavedSearchToInclude !== "") {
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

                if (that.lastTickets !== null) {
                    that.notifyChanges(that.tickets, that.lastTickets);
                } else if (itdirectConfig.lastDataUpdate !== null){
                    that.notifyOfflineChanges(that.tickets, itdirectConfig.lastDataUpdate);
                }

                itdirectConfig.lastDataUpdate = new Date();
                that.lastTickets = angular.copy(that.tickets);
            });

            return pAllRequestsFinished;
        };

        function notifierClickCallback() {
            // see http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
            _.defer(function() {
                $rootScope.$apply(function() {
                    $location.path("/detail/itdirect/null/null/true");
                });
            });
        }

        this.notifyChanges = function(newTicketData, oldTicketData){
            var bNewNotifications = false;
            var ticketsToNotify = {};
            ticketsToNotify.assigned_me = [];
            ticketsToNotify.savedSearch = [];

            for (var newTicketsCategory in newTicketData){
                angular.forEach(newTicketData[newTicketsCategory], function(ticket){
                    var foundTicket;
                    for (var category in oldTicketData) {
                         foundTicket = _.find(oldTicketData[category], { GUID: ticket.GUID });
                        if (foundTicket !== undefined){
                            break;
                        }
                    }

                    if (foundTicket === undefined) {
                        bNewNotifications = true;
                        ticketsToNotify[newTicketsCategory].push(ticket);
                        notifier.showInfo('New IT Direct Ticket', 'There is a new IT Direct Ticket "' + ticket.DESCRIPTION + '"', that.sAppIdentifier, notifierClickCallback);
                    } else if (converter.getDateFromAbapTimeString(ticket.CHANGED_AT) > converter.getDateFromAbapTimeString(foundTicket.CHANGED_AT)) {
                        bNewNotifications = true;
                        ticketsToNotify[newTicketsCategory].push(ticket);
                        notifier.showInfo('IT Direct Ticket Changed', 'The IT Direct Ticket "' + ticket.DESCRIPTION + '" changed', that.sAppIdentifier, notifierClickCallback);
                    }
                });
            }

            if (bNewNotifications === true) {
                that.ticketsFromNotifications = ticketsToNotify;
            }
        };

        this.notifyOfflineChanges = function(tickets, lastDataUpdateFromConfig){
            var foundTickets;
            var bShowNotification = false;
            var ticketsToNotify = {};
            ticketsToNotify.assigned_me = [];
            ticketsToNotify.savedSearch = [];

            for (var category in tickets) {
                foundTickets = _.where(tickets[category], function(ticket){
                    return converter.getDateFromAbapTimeString(ticket.CHANGED_AT) > lastDataUpdateFromConfig;
                });
                if (foundTickets.length > 0){
                    ticketsToNotify[category] = foundTickets;
                    bShowNotification = true;
                }
            }

            if (bShowNotification){
                that.ticketsFromNotifications = ticketsToNotify;
                notifier.showInfo('IT Direct Tickets Changed', 'Some of your IT Direct Tickets changed since your last visit of Bridge', that.sAppIdentifier, notifierClickCallback);
            }
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

        this.activateAllPrios = function(){
            angular.forEach(that.prios, function(prio){
                prio.active = true;
            });
        };

        this.initialize = function (sAppIdentifier) {
            this.sAppIdentifier = sAppIdentifier;

            var loadTicketPromise = this.loadTicketData();
            loadTicketPromise.then(function success() {
                that.isInitialized.value = true;
            });

            return loadTicketPromise;
        };
}]);
