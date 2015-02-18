angular.module('app.customerMessages').service('app.customerMessages.ticketData',
    ['$http', '$q', '$window', "$rootScope", "$location", "$timeout", 'app.customerMessages.configservice', "notifier", "bridge.converter",
    function ($http, $q, $window, $rootScope, $location, $timeout, configService, notifier, converter) {
        var Data = function(appId) {
            var that = this;
            var config = configService.getInstanceForAppId(appId);
            this.sAppIdentifier = "app.customerMessages";
            this.appId = appId;

            //buckets for the backend tickets
            this.backendTickets = {};
            this.backendTickets.sel_components = [];
            this.backendTickets.sel_components_aa = [];
            this.backendTickets.colleagues = [];
            this.backendTickets.colleagues_aa = [];
            this.backendTickets.assigned_me = [];
            this.backendTickets.assigned_me_aa = [];

            this.lastTickets = null;
            this.ticketsFromNotifications = [];

            // make an object so that we can have it referenced in the scope
            this.isInitialized = {value: false};

            function parseBackendTicket(backendTicket, category) {

                angular.forEach(that.prios, function (prio) {
                    if (backendTicket.PRIORITY_KEY === prio.number.toString()) {
                        var category_aa = "";
                        if (category !== "created_me") {
                            category_aa = category + '_aa';
                        }
                        // Customer Action
                        if (backendTicket.STATUS_KEY === "E0004" && category_aa !== "") {
                            prio[category_aa]++;
                            that.backendTickets[category_aa].push(backendTicket);
                        }
                        // incidents with status Solution Provided are not considered at all
                        else if (backendTicket.STATUS_KEY === "E0005") {
                            return; //continue forEach loop
                        }
                        else {
                            prio[category]++;
                            that.backendTickets[category].push(backendTicket);
                        }
                    }
                });
            }

            this.prios = [
                {
                    name: "Very high",
                    number: 1,
                    sel_components: 0,
                    sel_components_aa: 0,
                    colleagues: 0,
                    colleagues_aa: 0,
                    assigned_me: 0,
                    assigned_me_aa: 0,
                    selected: 0
                },
                {
                    name: "High",
                    number: 3,
                    sel_components: 0,
                    sel_components_aa: 0,
                    colleagues: 0,
                    colleagues_aa: 0,
                    assigned_me: 0,
                    assigned_me_aa: 0,
                    selected: 0
                },
                {
                    name: "Medium",
                    number: 5,
                    sel_components: 0,
                    sel_components_aa: 0,
                    colleagues: 0,
                    colleagues_aa: 0,
                    assigned_me: 0,
                    assigned_me_aa: 0,
                    selected: 0
                },
                {
                    name: "Low",
                    number: 9,
                    sel_components: 0,
                    sel_components_aa: 0,
                    colleagues: 0,
                    colleagues_aa: 0,
                    assigned_me: 0,
                    assigned_me_aa: 0,
                    selected: 0
                }];

            this.resetData = function () {
                angular.forEach(that.prios, function (prio) {
                    prio.sel_components = 0;
                    prio.sel_components_aa = 0;
                    prio.colleagues = 0;
                    prio.colleagues_aa = 0;
                    prio.assigned_me = 0;
                    prio.assigned_me_aa = 0;
                    prio.selected = 0;
                });

                that.backendTickets.sel_components.length = 0;
                that.backendTickets.sel_components_aa.length = 0;
                that.backendTickets.colleagues.length = 0;
                that.backendTickets.colleagues_aa.length = 0;
                that.backendTickets.assigned_me.length = 0;
                that.backendTickets.assigned_me_aa.length = 0;
            };

            function addCData(tagName, xml) {
                var regOpen = new RegExp("<" + tagName + ">", "g");
                var regClose = new RegExp("<\/" + tagName + ">", "g");

                xml = xml.replace(regOpen, "<" + tagName + "><![CDATA[");
                xml = xml.replace(regClose, "]]></" + tagName + ">");

                return xml;
            }

            this.loadTicketData = function () {
                var deferred = $q.defer();
                //var requestUrl = 'https://backup-support.wdf.sap.corp/sap/bc/devdb/customer_incid?sap-client=001&max_hits=1000&sap-language=EN';
                var requestUrl = 'https://bcdmain.wdf.sap.corp/sap/bc/devdb/customer_incid?sap-client=001&sap-language=EN';
                if (config.data.settings.filterByOrgUnit) {
                    angular.forEach(config.data.settings.selectedOrgUnits, function (oOrgUnit) {
                        requestUrl += '&orgunit=' + oOrgUnit.ORGUNIT;
                    });
                }

                $http.get(requestUrl + '&origin=' + $window.location.origin, {withCredentials: true})
                    .success(function (data) {
                        that.resetData();

                        data = addCData("URL_MESSAGE", data);
                        data = addCData("DESCRIPTION", data);
                        data = addCData("CUST_NAME", data);
                        data = addCData("REPORTER_NAME", data);
                        data = new X2JS().xml_str2json(data);

                        var tickets = data.abap.values;

                        // Resultnode1: Alle incidents auf Komponenten, zu denen ich assigned bin
                        // Resultnode2: Alle incidents, die auf meinem Namen stehen (unabhängig davon, zu welcher Komponente sie gehören)

                        if (!angular.isArray(tickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"])) {
                            tickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"] = [tickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"]];
                        }

                        if (!angular.isArray(tickets.RESULTNODE2["_-SID_-CN_IF_DEVDB_INC_OUT_S"])) {
                            tickets.RESULTNODE2["_-SID_-CN_IF_DEVDB_INC_OUT_S"] = [tickets.RESULTNODE2["_-SID_-CN_IF_DEVDB_INC_OUT_S"]];
                        }

                        //selected component
                        angular.forEach(_.where(tickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"], {PROCESSOR_ID: ''}), function (backendTicket) {
                            parseBackendTicket(backendTicket, 'sel_components');
                        });

                        // colleagues
                        angular.forEach(_.where(tickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"], function (ticket) {
                            return ticket.PROCESSOR_ID !== '';
                        }), function (backendTicket) {
                            parseBackendTicket(backendTicket, 'colleagues');
                        });

                        //assigned to me
                        angular.forEach(tickets.RESULTNODE2["_-SID_-CN_IF_DEVDB_INC_OUT_S"], function (backendTicket) {
                            parseBackendTicket(backendTicket, 'assigned_me');
                        });

                        that.updatePrioSelectionCounts();
                        deferred.resolve({errors: tickets.ERRORS});

                    }).error(function () {
                        deferred.reject();
                    });

                deferred.promise.then(function () {
                    if (that.lastTickets !== null) {
                        that.notifyChanges(that.backendTickets, that.lastTickets);
                    } else if (config.lastDataUpdate !== null) {
                        if (angular.isString(config.lastDataUpdate)) {
                            config.lastDataUpdate = new Date(config.lastDataUpdate);
                        }
                        that.notifyOfflineChanges(that.backendTickets, config.lastDataUpdate);
                    }

                    config.lastDataUpdate = new Date();
                    that.lastTickets = angular.copy(that.backendTickets);
                });

                return deferred.promise;
            };

            this.addTicket = function (list, ticket) {
                var allreadyExists = list.some(function (item) {
                    return item.OBJECT_GUID === ticket.OBJECT_GUID;
                });

                if (!allreadyExists) {
                    list.push(ticket);
                }
            };

            this.updatePrioSelectionCounts = function () {
                angular.forEach(this.prios, function (prio) {
                    prio.selected = 0;
                    var prioString = prio.number.toString();
                    var selectedTickets = [];
                    if (config.data.selection.sel_components) {
                        that.backendTickets.sel_components.forEach(function (ticket) {
                            if (ticket.PRIORITY_KEY === prioString) {
                                that.addTicket(selectedTickets, ticket);
                            }
                        });
                    }
                    if (config.data.selection.assigned_me) {
                        that.backendTickets.assigned_me.forEach(function (ticket) {
                            if (ticket.PRIORITY_KEY === prioString) {
                                that.addTicket(selectedTickets, ticket);
                            }
                        });
                    }
                    if (config.data.selection.colleagues) {
                        that.backendTickets.colleagues.forEach(function (ticket) {
                            if (ticket.PRIORITY_KEY === prioString) {
                                that.addTicket(selectedTickets, ticket);
                            }
                        });
                    }

                    if (!config.data.settings.ignore_author_action) {
                        if (config.data.selection.sel_components) {
                            that.backendTickets.sel_components_aa.forEach(function (ticket) {
                                if (ticket.PRIORITY_KEY === prioString) {
                                    that.addTicket(selectedTickets, ticket);
                                }
                            });
                        }
                        if (config.data.selection.assigned_me) {
                            that.backendTickets.assigned_me_aa.forEach(function (ticket) {
                                if (ticket.PRIORITY_KEY === prioString) {
                                    that.addTicket(selectedTickets, ticket);
                                }
                            });
                        }
                        if (config.data.selection.colleagues) {
                            that.backendTickets.colleagues_aa.forEach(function (ticket) {
                                if (ticket.PRIORITY_KEY === prioString) {
                                    that.addTicket(selectedTickets, ticket);
                                }
                            });
                        }
                    }
                    prio.selected = selectedTickets.length;
                });

            };

            this.initialize = function () {
                var loadTicketPromise = this.loadTicketData();
                loadTicketPromise.then(function success() {
                    that.isInitialized.value = true;
                });

                return loadTicketPromise;
            };

            function notifierClickCallback(notificationApp, notificationData) {
                that.ticketsFromNotifications = notificationData.tickets;
                // see http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                $timeout(function() {
                    $location.path("/detail/customerMessages/" + that.appId + "/null/true");
                });
            }

            this.notifyChanges = function (newTicketData, oldTicketData) {
                function checkIfTicketIsNew(ticket){
                    var foundTicket;
                    for (var category in oldTicketData) {
                        foundTicket = _.find(oldTicketData[category], {OBJECT_GUID: ticket.OBJECT_GUID});

                        if (foundTicket) {
                            break;
                        }
                    }

                    if (!foundTicket) {
                        notifier.showInfo('New Customer Incident', 'There is a new Customer Incident "' + ticket.DESCRIPTION + '"', that.sAppIdentifier, notifierClickCallback,
                            config.data.settings.notificationDuration, {tickets: [ticket]});
                    } else if (ticket.CHANGE_DATE > foundTicket.CHANGE_DATE) {
                        notifier.showInfo('Customer Incident Changed', 'The Customer Incident "' + ticket.DESCRIPTION + '" changed', that.sAppIdentifier, notifierClickCallback,
                            config.data.settings.notificationDuration, {tickets: [ticket]});
                    }
                }

                for (var newTicketsCategory in newTicketData) {
                    newTicketData[newTicketsCategory].forEach(checkIfTicketIsNew);
                }
            };

            this.notifyOfflineChanges = function (tickets, lastDataUpdateFromConfig) {
                var foundTickets = [];
                function checkIfTicketIsYounger(ticket){
                    return converter.getDateFromAbapTimeString(ticket.CHANGE_DATE) > lastDataUpdateFromConfig;
                }

                for (var category in tickets) {
                    var ticketsForCategory = _.where(tickets[category], checkIfTicketIsYounger);
                    if (ticketsForCategory !== undefined) {
                        foundTickets = foundTickets.concat(ticketsForCategory);
                    }
                }

                if (foundTickets.length > 0){
                    notifier.showInfo('Customer Incidents Changed', 'Some of your Customer Incidents changed since your last visit of Bridge', that.sAppIdentifier, notifierClickCallback,
                        config.data.settings.notificationDuration, {tickets: foundTickets});
                }
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
