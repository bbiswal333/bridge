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
        this.selectedSourceSystem = this.ticketSourceSystems[4];
        this.tickets = {};
        this.lastTickets = null;
        this.ticketsFromNotifications = [];

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

            $http.get("https://" + that.selectedSourceSystem.urlPart + ".wdf.sap.corp/sap/bc/devdb/internal_incid?sap-client=001&sap-language=en&origin=" + $window.location.origin)
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

                if (that.lastTickets !== null) {
                    that.notifyChanges(that.getRelevantTickets(true, true, true, true, false), that.lastTickets);
                } else if (config.data.lastDataUpdate !== null){
                    that.notifyOfflineChanges(that.getRelevantTickets(true, true, true, true, false), config.data.lastDataUpdate);
                }

                config.data.lastDataUpdate = new Date();
                that.lastTickets = angular.copy(that.tickets);
            });

            return defer.promise;
        };

        this.getRelevantTickets = function(bSelectedComponents, bColleagues, bAssignedToMe, bCreatedByMe, bIgnoreAuthorAction) {
            var tickets = [];
            if (bSelectedComponents){
                tickets  = _.union(tickets, _.where(that.tickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"], {"PROCESSOR_ID" : ""}));
            }
            if (bColleagues) {
                tickets  = _.union(tickets, _.filter(that.tickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"], function(ticket){
                    return ticket.PROCESSOR_ID !== "" && ticket.PROCESSOR_ID !== bridgeDataService.getUserInfo().BNAME;
                }));
            }
            if(bAssignedToMe){
                tickets  = _.union(tickets, that.tickets.RESULTNODE3["_-SID_-CN_IF_DEVDB_INC_OUT_S"]);
            }
            if (bCreatedByMe){
                tickets  = _.union(tickets, that.tickets.RESULTNODE2["_-SID_-CN_IF_DEVDB_INC_OUT_S"]);
            }

            if (bIgnoreAuthorAction){
                _.remove(tickets, { STATUS_KEY: "E0004"} );
            }

            return tickets;
        };

        this.calculateTotals = function() {
            var tickets = that.getRelevantTickets(config.data.selection.sel_components, config.data.selection.colleagues, config.data.selection.assigned_me, config.data.selection.created_me, config.data.ignoreAuthorAction);
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
                    $location.path("/detail/internalIncidents/null/null/true");
                });
            });
        }

        this.notifyChanges = function(newTicketData, oldTicketData){
            var bNewNotifications = false;
            var ticketsToNotify = [];

            angular.forEach(newTicketData, function(ticket){
                var foundTicket;
                for (var category in oldTicketData) {
                     foundTicket = _.find(oldTicketData[category]["_-SID_-CN_IF_DEVDB_INC_OUT_S"], { OBJECT_GUID: ticket.OBJECT_GUID });
                    if (foundTicket !== undefined){
                        break;
                    }
                }

                if (foundTicket === undefined) {
                    bNewNotifications = true;
                    ticketsToNotify.push(ticket);
                    notifier.showInfo('New Internal Incident', 'There is a new Internal Incident"' + ticket.DESCRIPTION + '"', that.sAppIdentifier, notifierClickCallback);
                } else if (converter.getDateFromAbapTimeString(ticket.CHANGE_DATE) > converter.getDateFromAbapTimeString(foundTicket.CHANGE_DATE)) {
                    bNewNotifications = true;
                    ticketsToNotify.push(ticket);
                    notifier.showInfo('Internal Incident Changed', 'The Internal Incident "' + ticket.DESCRIPTION + '" changed', that.sAppIdentifier, notifierClickCallback);
                }
            });

            if (bNewNotifications === true) {
                that.ticketsFromNotifications = ticketsToNotify;
            }
        };

        this.notifyOfflineChanges = function(tickets, lastDataUpdateFromConfig){
            var foundTickets;

            foundTickets = _.where(tickets, function(ticket){
                return converter.getDateFromAbapTimeString(ticket.CHANGE_DATE) > lastDataUpdateFromConfig;
            });

            if (angular.isArray(foundTickets) && foundTickets.length > 0){
                that.ticketsFromNotifications = foundTickets;
                notifier.showInfo('Internal Incidents Changed', 'Some of your Internal Incidents changed since your last visit of Bridge', that.sAppIdentifier, notifierClickCallback);
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
