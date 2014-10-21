angular.module("app.internalIncidents").service("app.internalIncidents.ticketData",
    ["$rootScope","$http", "$q", "$window", "$location", "bridgeDataService", "app.internalIncidents.configservice", "notifier", "bridge.converter",
    function($rootScope, $http, $q, $window, $location, bridgeDataService, config, notifier, converter){

        var that = this;
        this.isInitialized = {value: false};
        this.prios = [{
            key: "1", description: "Very High", active: false, total: 0
        },{
            key: "3", description: "High", active: false, total: 0
        },{
            key: "5", description: "Medium", active: false, total: 0
        },{
            key: "9", description: "Low", active: false, total: 0
        }];

        this.ticketSourceSystems = [{
            urlPart: "bcdmain", name: "BCD"
        },{
            urlPart: "bctmain", name: "BCT"
        },{
            urlPart: "bcqmain", name: "BCQ"
        },{
            urlPart: "bcvmain", name: "BCV"
        },{
            urlPart: "backup-support", name: "BCP"
        }];
        this.selectedSourceSystem = this.ticketSourceSystems[0];
        this.tickets = {};
        this.lastTickets = null;

        this.sAppIdentifier = "";

        function objectToArray(object, property){
            if (angular.isObject(object) && !angular.isArray(object[property])){
                var dataCopy = angular.copy(object[property]);
                object[property] = [];
                object[property].push(dataCopy);
            }
        }

        this.loadTicketData = function(){
            var defer = $q.defer();

            $http.get("https://" + that.selectedSourceSystem.urlPart + ".wdf.sap.corp/sap/bc/devdb/internal_incid?sap-client=001&origin=" + $window.location.origin)
                .success(function(data){
                    that.tickets = new X2JS().xml_str2json(data).abap.values;
                    objectToArray(that.tickets.RESULTNODE1, "_-SID_-CN_IF_DEVDB_INC_OUT_S");
                    objectToArray(that.tickets.RESULTNODE2, "_-SID_-CN_IF_DEVDB_INC_OUT_S");
                    objectToArray(that.tickets.RESULTNODE3, "_-SID_-CN_IF_DEVDB_INC_OUT_S");

                    that.calculateTotals();

                    defer.resolve();
                })
                .error(function(){
                    defer.reject();
                });

            defer.promise.then(function(){

                /*if (that.lastTickets !== null) {
                    that.notifyChanges(that.tickets, that.lastTickets);
                } else if (config.lastDataUpdate !== null){
                    that.notifyOfflineChanges(that.tickets, config.lastDataUpdate);
                }

                config.lastDataUpdate = new Date();
                that.lastTickets = angular.copy(that.tickets);*/
            });

            return defer.promise;
        };

        this.getRelevantTickets = function() {
            var tickets = [];
            if (config.data.selection.sel_components){
                tickets  = _.union(tickets, _.where(that.tickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"], {"PROCESSOR_ID" : ""}));
            }
            if (config.data.selection.colleagues) {
                tickets  = _.union(tickets, _.filter(that.tickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"], function(ticket){
                    return ticket.PROCESSOR_ID !== "" && ticket.PROCESSOR_ID !== bridgeDataService.getUserInfo().BNAME;
                }));
            }
            if(config.data.selection.assigned_me){
                tickets  = _.union(tickets, that.tickets.RESULTNODE3["_-SID_-CN_IF_DEVDB_INC_OUT_S"]);
            }
            if (config.data.selection.created_me){
                tickets  = _.union(tickets, that.tickets.RESULTNODE2["_-SID_-CN_IF_DEVDB_INC_OUT_S"]);
            }

            /*tickets = _.uniq(tickets, function(ticket){
                return ticket.OBJECT_GUID;
            });*/
            return tickets;
        };

        this.calculateTotals = function() {
            var tickets = that.getRelevantTickets();
            var totals = _.countBy(tickets, function(ticket){
                return ticket.PRIORITY_KEY;
            });
            that.prios[0].total = totals["1"] === undefined ? 0 : totals["1"];
            that.prios[1].total = totals["3"] === undefined ? 0 : totals["3"];
            that.prios[2].total = totals["5"] === undefined ? 0 : totals["5"];
            that.prios[3].total = totals["9"] === undefined ? 0 : totals["9"];
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

        this.initialize = function (sAppIdentifier) {
            this.sAppIdentifier = sAppIdentifier;

            var loadTicketPromise = this.loadTicketData();
            loadTicketPromise.then(function success() {
                that.isInitialized.value = true;
            });

            return loadTicketPromise;
        };
}]);
