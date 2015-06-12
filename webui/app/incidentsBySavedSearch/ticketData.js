angular.module("app.incidentSavedSearch").service("app.incidentSavedSearch.ticketData",
    ["$rootScope", "$http", "$q", "$window", "$location", "bridgeDataService", "app.incidentSavedSearch.configservice", "notifier", "bridge.converter", "bridge.ticketAppUtils.ticketUtils",
    function($rootScope, $http, $q, $window, $location, bridgeDataService, configService, notifier, converter, ticketUtils){
        var Data = function(appId) {
            var config = configService.getConfigForAppId(appId);
            var that = this;

            this.appId = appId;
            this.isInitialized = {value: false};
            this.prios = [{
                key: "1", description: "Very High", active: false, total: 0
            }, {
                key: "3", description: "High", active: false, total: 0
            }, {
                key: "5", description: "Medium", active: false, total: 0
            }, {
                key: "9", description: "Low", active: false, total: 0
            }];

            this.selectedSourceSystem = ticketUtils.ticketSourceSystems[4];
            this.tickets = [];
            this.lastTickets = null;
            this.ticketsFromNotifications = [];

            this.sAppIdentifier = "";

            this.loadTicketData = function (bNoNotifications) {
                var defer = $q.defer();

                $http.get("https://" + that.selectedSourceSystem.urlPart + ".wdf.sap.corp/sap/bc/devdb/saved_search?sap-client=001&sap-language=en&search_id=" + config.data.selectedSearchGuid +
                            "&max_hits=1000&origin=" + $window.location.origin)
                    .success(function (data) {
                        var backendTickets = new X2JS().xml_str2json(data).abap.values;
                        if (backendTickets.RESULTNODE1 !== "") {
                            ticketUtils.objectToArray(backendTickets.RESULTNODE1, "_-SID_-CN_IF_DEVDB_INC_OUT_S");
                            that.tickets = backendTickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"];
                        } else {
                            that.tickets = [];
                        }

                        that.calculateTotals();
                        defer.resolve();
                    })
                    .error(function () {
                        defer.reject();
                    });

                defer.promise.then(function () {

                    if (bNoNotifications !== true) {
                        if (that.lastTickets !== null) {
                            that.notifyChanges(that.tickets, that.lastTickets);
                        } else if (config.data.lastDataUpdate !== null) {
                            that.notifyOfflineChanges(that.tickets, config.data.lastDataUpdate);
                        }
                    }

                    config.data.lastDataUpdate = new Date();
                    that.lastTickets = angular.copy(that.tickets);
                });

                return defer.promise;
            };

            this.calculateTotals = function () {
                var tickets = that.tickets;

                var totals = _.countBy(tickets, function (ticket) {
                    return ticket.PRIORITY_KEY;
                });
                that.prios[0].total = totals["1"] === undefined ? 0 : totals["1"];
                that.prios[1].total = totals["3"] === undefined ? 0 : totals["3"];
                that.prios[2].total = totals["5"] === undefined ? 0 : totals["5"];
                that.prios[3].total = totals["9"] === undefined ? 0 : totals["9"];
            };

            function notifierClickCallback(sApp, oNotificationData) {
                that.ticketsFromNotifications = oNotificationData.tickets;
                // see http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                _.defer(function () {
                    $rootScope.$apply(function () {
                        $location.path("/detail/incidentSavedSearch/" + that.appId + "/null/true");
                    });
                });
            }

            this.notifyChanges = function (newTicketData, oldTicketData) {
                angular.forEach(newTicketData, function (ticket) {
                    var foundTicket;

                    foundTicket = _.find(oldTicketData, {OBJECT_GUID: ticket.OBJECT_GUID});

                    if (foundTicket === undefined) {
                        notifier.showInfo('New Incident in Saved Search', 'There is a new Incident "' + ticket.DESCRIPTION + '"', that.sAppIdentifier, notifierClickCallback, null, {tickets: [ticket]});
                    } else if (converter.getDateFromAbapTimeString(ticket.CHANGE_DATE) > converter.getDateFromAbapTimeString(foundTicket.CHANGE_DATE)) {
                        notifier.showInfo('Incident in Saved Search Changed', 'The Incident "' + ticket.DESCRIPTION + '" changed', that.sAppIdentifier, notifierClickCallback, null, {tickets: [ticket]});
                    }
                });
            };

            this.notifyOfflineChanges = function (tickets, lastDataUpdateFromConfig) {
                var foundTickets;

                foundTickets = _.where(tickets, function (ticket) {
                    return converter.getDateFromAbapTimeString(ticket.CHANGE_DATE) > lastDataUpdateFromConfig;
                });

                if (angular.isArray(foundTickets) && foundTickets.length > 0) {
                    notifier.showInfo('Incidents in Saved Search Changed', 'Some of your Incidents in Saved Searches changed since your last visit of Bridge', that.sAppIdentifier,
                        notifierClickCallback, null, {tickets: foundTickets});
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
        };

        var instances = {};
        this.getInstanceForAppId = function(appId) {
            if(instances[appId] === undefined) {
                instances[appId] = new Data(appId);
            }
            return instances[appId];
        };
}]);
