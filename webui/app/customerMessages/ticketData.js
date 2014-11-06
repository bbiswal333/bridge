angular.module('app.customerMessages').service('app.customerMessages.ticketData',
    ['$http', '$q', '$window', "$rootScope", "$location", 'app.customerMessages.configservice', "notifier",
    function ($http, $q, $window, $rootScope, $location, configservice, notifier) {
    var that = this;
    this.sAppIdentifier = "app.customerMessages";

    //buckets for the backend tickets
    this.backendTickets = {};
    this.backendTickets.sel_components = [];
    this.backendTickets.sel_components_aa = [];
    this.backendTickets.assigned_me = [];
    this.backendTickets.assigned_me_aa = [];
    this.backendTickets.created_me = [];

    this.lastTickets = null;

    this.ticketsFromNotifications = {};
    this.ticketsFromNotifications.assigned_me = [];
    this.ticketsFromNotifications.sel_components = [];

    // make an object so that we can have it referenced in the scope
    this.isInitialized = { value: false };

    function addTicket(list, ticket){
        var allreadyExists = false;
        list.some(function(item){
            if (angular.equals(ticket, item)){
                allreadyExists = true;
            }
            return allreadyExists;
        });

        if (!allreadyExists){
            list.push(ticket);
        }
    }

    function parseBackendTicket(backendTicket, category) {


        angular.forEach(that.prios, function (prio) {
            if (backendTicket.PRIORITY_KEY === prio.number.toString())
            {
                var category_aa = "";
                if(category !== "created_me")
                {
                    category_aa = category + '_aa';
                }
                // Customer Action
                if(backendTicket.STATUS_KEY === "E0004" && category_aa !== "")
                {
                    prio[category_aa]++;
                    that.backendTickets[category_aa].push(backendTicket);
                }
                // incidents with status Solution Provided are not considered at all
                else if ( backendTicket.STATUS_KEY === "E0005") {
                    return; //continue forEach loop
                }
                else
                {
                    prio[category]++;
                    that.backendTickets[category].push(backendTicket);
                }

                addTicket(prio.tickets, backendTicket);
                prio.total = prio.tickets.length;
            }
        });
    }

    this.prios = [
        { name: "Very high",    number: 1, sel_components: 0, sel_components_aa: 0, assigned_me: 0, assigned_me_aa: 0, created_me: 0, selected: 0, total: 0, tickets: [] },
        { name: "High",         number: 3, sel_components: 0, sel_components_aa: 0, assigned_me: 0, assigned_me_aa: 0, created_me: 0, selected: 0, total: 0, tickets: [] },
        { name: "Medium",       number: 5, sel_components: 0, sel_components_aa: 0, assigned_me: 0, assigned_me_aa: 0, created_me: 0, selected: 0, total: 0, tickets: [] },
        { name: "Low",          number: 9, sel_components: 0, sel_components_aa: 0, assigned_me: 0, assigned_me_aa: 0, created_me: 0, selected: 0, total: 0, tickets: [] }];

    this.resetData = function () {
        angular.forEach(that.prios, function (prio) {
            prio.sel_components = 0;
            prio.sel_components_aa = 0;
            prio.assigned_me = 0;
            prio.assigned_me_aa = 0;
            prio.created_me = 0;
            prio.selected = 0;
            prio.total = 0;
            prio.tickets = [];
        });

        that.backendTickets.sel_components.length = 0;
        that.backendTickets.sel_components_aa.length = 0;
        that.backendTickets.assigned_me.length = 0;
        that.backendTickets.assigned_me_aa.length = 0;
        that.backendTickets.created_me.length = 0;
    };

    function addCData(tagName, xml){
        var regOpen = new RegExp("<" + tagName + ">","g");
        var regClose = new RegExp("<\/" + tagName + ">","g");

        xml = xml.replace(regOpen,"<" + tagName + "><![CDATA[");
        xml = xml.replace(regClose,"]]></" + tagName + ">");
        // console.log(xml);
        return xml;
    }

    this.loadTicketData = function () {
        var deferred = $q.defer();

        $http.get('https://backup-support.wdf.sap.corp/sap/bc/devdb/customer_incid?sap-client=001&sap-language=EN&origin=' + $window.location.origin, {withCredentials:true}
        ).success(function (data) {
            // data = testData;
            that.resetData();

            var regEx = new RegExp("https:\/\/BCP\.WDF\.SAP\.CORP", "g");
            data = data.replace(regEx, "https://SUPPORT.WDF.SAP.CORP");

            data = addCData("URL_MESSAGE", data);
            data = addCData("DESCRIPTION", data);
            data = addCData("CUST_NAME", data);
            data = addCData("REPORTER_NAME", data);
            data = new X2JS().xml_str2json(data);

            var cmData = data.abap;
            var backendTickets = cmData.values;

            // Resultnode1: Alle incidents auf Komponenten, zu denen ich assigned bin
            // Resultnode2: Alle incidents, die auf meinem Namen stehen (unabhängig davon, zu welcher Komponente sie gehören)

            //selected component
            if (angular.isArray(backendTickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"])) {
                angular.forEach(backendTickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"], function (backendTicket) {
                    parseBackendTicket(backendTicket, 'sel_components');
                });
            } else if (angular.isObject(backendTickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"])) {
                parseBackendTicket(backendTickets.RESULTNODE1["_-SID_-CN_IF_DEVDB_INC_OUT_S"], 'sel_components');
            }

            //assigned to me
            if (angular.isArray(backendTickets.RESULTNODE2["_-SID_-CN_IF_DEVDB_INC_OUT_S"])) {
                angular.forEach(backendTickets.RESULTNODE2["_-SID_-CN_IF_DEVDB_INC_OUT_S"], function (backendTicket) {
                    parseBackendTicket(backendTicket, 'assigned_me');
                });
            } else if (angular.isObject(backendTickets.RESULTNODE2["_-SID_-CN_IF_DEVDB_INC_OUT_S"])) {
                parseBackendTicket(backendTickets.RESULTNODE2["_-SID_-CN_IF_DEVDB_INC_OUT_S"], 'assigned_me');
            }

            that.updatePrioSelectionCounts();
            deferred.resolve();

        }).error(function () {
            deferred.reject();
        });

        deferred.promise.then(function(){
            if (that.lastTickets !== null) {
                that.notifyChanges(that.backendTickets, that.lastTickets);
            } else if (configservice.lastDataUpdate !== null){
                that.notifyOfflineChanges(that.backendTickets, configservice.lastDataUpdate);
            }

            configservice.lastDataUpdate = new Date();
            that.lastTickets = angular.copy(that.backendTickets);
        });

        return deferred.promise;
    };

    this.updatePrioSelectionCounts = function () {
        angular.forEach(this.prios, function (prio) {
            prio.selected = 0;
            var prioString = prio.number.toString();
            var selectedTickets = [];
            if (configservice.data.selection.sel_components) { that.backendTickets.sel_components.forEach(function(ticket){
                if (ticket.PRIORITY_KEY === prioString){
                    addTicket(selectedTickets,ticket);
                }
            });}
            if (configservice.data.selection.assigned_me) { that.backendTickets.assigned_me.forEach(function(ticket){
                if (ticket.PRIORITY_KEY === prioString){
                    addTicket(selectedTickets,ticket);
                }
            });}
            if (configservice.data.selection.created_me) { that.backendTickets.created_me.forEach(function(ticket){
                if (ticket.PRIORITY_KEY === prioString){
                    addTicket(selectedTickets,ticket);
                }
            });}
            if (!configservice.data.settings.ignore_author_action) {
                if (configservice.data.selection.sel_components) { that.backendTickets.sel_components_aa.forEach(function(ticket){
                    if (ticket.PRIORITY_KEY === prioString){
                        addTicket(selectedTickets,ticket);
                    }
                });}
                if (configservice.data.selection.assigned_me) { that.backendTickets.assigned_me_aa.forEach(function(ticket){
                    if (ticket.PRIORITY_KEY === prioString){
                        addTicket(selectedTickets,ticket);
                    }
                });}
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

    this.getDateFromAbapTimeString = function(sAbapDate){
    return new Date(parseInt(sAbapDate.substring(0,4)), parseInt(sAbapDate.substring(4,6)) - 1, parseInt(sAbapDate.substring(6,8)), parseInt(sAbapDate.substring(8,10)),
        parseInt(sAbapDate.substring(10,12)), parseInt(sAbapDate.substring(12,14)));
    };

    function notifierClickCallback(notificationApp, routeURL) {
        // see http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
        _.defer(function() {
            $rootScope.$apply(function() {
                $location.path(routeURL);
            });
        });
    }

    this.notifyChanges = function(newTicketData, oldTicketData){
        var bNewNotifications = false;
        var ticketsToNotify = {};
        ticketsToNotify.assigned_me = [];
        ticketsToNotify.sel_components = [];

        for (var newTicketsCategory in newTicketData){
            newTicketData[newTicketsCategory].forEach(function (ticket){
                var foundTicket;
                for (var category in oldTicketData) {
                    foundTicket = _.find(oldTicketData[category], { OBJECT_GUID: ticket.OBJECT_GUID });

                    if (foundTicket){
                        break;
                    }
                }

                // var routeURL = "/detail/customerMessages/new/";
                if (!foundTicket) {
                    bNewNotifications = true;
                    ticketsToNotify[newTicketsCategory].push(ticket);
                    // routeURL += ticket.OBJECT_GUID;
                    notifier.showInfo('New Customer Incident', 'There is a new Customer Incident "' + ticket.DESCRIPTION + '"', that.sAppIdentifier, notifierClickCallback, configservice.data.settings.notificationDuration,ticket.URL_MESSAGE.toString());
                } else if (ticket.CHANGE_DATE > foundTicket.CHANGE_DATE) {
                    bNewNotifications = true;
                    ticketsToNotify[newTicketsCategory].push(ticket);
                    // routeURL += ticket.OBJECT_GUID;
                    notifier.showInfo('Customer Incident Changed', 'The Customer Incident "' + ticket.DESCRIPTION + '" changed', that.sAppIdentifier, notifierClickCallback, configservice.data.settings.notificationDuration, ticket.URL_MESSAGE.toString());
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
        ticketsToNotify.sel_components = [];

        var routeURL = "/detail/customerMessages/new/";
        var guidList;

        for (var category in tickets) {
            foundTickets = _.where(tickets[category], function(ticket){
                return that.getDateFromAbapTimeString(ticket.CHANGE_DATE) > lastDataUpdateFromConfig;
            });
            if (foundTickets.length > 0){
                ticketsToNotify[category] = foundTickets;
                bShowNotification = true;
            }
            foundTickets.forEach(function(foundTicket){
                if (!guidList) {
                    guidList = foundTicket.OBJECT_GUID;
                }
                guidList += "|" + foundTicket.OBJECT_GUID;
            });
        }

        if (bShowNotification){
            routeURL += guidList;
            that.ticketsFromNotifications = ticketsToNotify;
            notifier.showInfo('Customer Incidents Changed', 'Some of your Customer Incidents changed since your last visit of Bridge', that.sAppIdentifier, notifierClickCallback, configservice.data.settings.notificationDuration, routeURL);
        }
    };
}]);
