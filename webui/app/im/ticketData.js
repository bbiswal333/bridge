angular.module('app.im').service('app.im.ticketData', ['$http', '$q', '$interval', 'app.im.configservice', function ($http, $q, $interval, configservice) {
    var that = this;

    //buckets for the backend tickets
    this.backendTickets = {};
    this.backendTickets.sel_components = [];
    this.backendTickets.sel_components_aa = [];
    this.backendTickets.colleagues = [];
    this.backendTickets.colleagues_aa = [];
    this.backendTickets.assigned_me = [];
    this.backendTickets.assigned_me_aa = [];
    this.backendTickets.created_me = [];
    
    // make an object so that we can have it referenced in the scope
    this.isInitialized = { value: false };
    this.loadTicketDataInterval = null;

    function parseBackendTicket(backendTicket, category) {
        angular.forEach(that.prios, function (prio) {
            if (backendTicket.PRIO === prio.number.toString())
            {                
                var category_aa = "";
                if(category !== "created_me")
                {
                    category_aa = category + '_aa';
                }
                if(backendTicket.STATUSSTXT === "Author Action" && category_aa !== "")
                {
                    prio[category_aa]++;
                    that.backendTickets[category_aa].push(backendTicket);
                }
                else
                {
                    prio[category]++;
                    that.backendTickets[category].push(backendTicket);
                }            
                prio.total++;
            }
        });
    }

    this.prios = [
        { name: "Very high",    number: 1, sel_components: 0, sel_components_aa: 0, colleagues:0, colleagues_aa: 0, assigned_me: 0, assigned_me_aa: 0, created_me: 0, selected: 0, total: 0 },
        { name: "High",         number: 2, sel_components: 0, sel_components_aa: 0, colleagues:0, colleagues_aa: 0, assigned_me: 0, assigned_me_aa: 0, created_me: 0, selected: 0, total: 0 }, 
        { name: "Medium",       number: 3, sel_components: 0, sel_components_aa: 0, colleagues:0, colleagues_aa: 0, assigned_me: 0, assigned_me_aa: 0, created_me: 0, selected: 0, total: 0 }, 
        { name: "Low",          number: 4, sel_components: 0, sel_components_aa: 0, colleagues:0, colleagues_aa: 0, assigned_me: 0, assigned_me_aa: 0, created_me: 0, selected: 0, total: 0 }];    

    this.resetData = function () {
        angular.forEach(that.prios, function (prio) {
            prio.sel_components = 0;
            prio.sel_components_aa = 0;
            prio.colleagues = 0;
            prio.colleagues_aa = 0;
            prio.assigned_me = 0;
            prio.assigned_me_aa = 0;
            prio.created_me = 0;
            prio.selected = 0;
            prio.total = 0;
        });

        that.backendTickets.sel_components.length = 0;
        that.backendTickets.sel_components_aa.length = 0;
        that.backendTickets.colleagues.length = 0;
        that.backendTickets.colleagues_aa.length = 0;
        that.backendTickets.assigned_me.length = 0;
        that.backendTickets.assigned_me_aa.length = 0;
        that.backendTickets.created_me.length = 0;
    };    

    this.loadTicketData = function () {
        var deferred = $q.defer();
        console.log("loadTicketData");

        //this.userid = bridgeDataService.getUserInfo().BNAME.toUpperCase();
        $http.get('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS?sap-language=en&origin=' + location.origin//&sap-user=' + that.userid + '&origin=' + location.origin
        ).success(function (data) {
            that.resetData();

            data = new X2JS().xml_str2json(data);
            var imData = data.abap;
            var backendTickets = imData.values;

            //selected component
            if (angular.isArray(backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT)) {
                angular.forEach(backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT, function (backendTicket) {
                    parseBackendTicket(backendTicket, 'sel_components');
                });
            } else if (angular.isObject(backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT)) {
                parseBackendTicket(backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT, 'sel_components');
            }

            //colleagues
            if (angular.isArray(backendTickets.INTCOMPCOLLEAGUES_LONG.DEVDB_INTMESSAGE_OUT)) {
                angular.forEach(backendTickets.INTCOMPCOLLEAGUES_LONG.DEVDB_INTMESSAGE_OUT, function (backendTicket) {
                    parseBackendTicket(backendTicket, 'colleagues');
                });
            } else if (angular.isObject(backendTickets.INTCOMPCOLLEAGUES_LONG.DEVDB_INTMESSAGE_OUT)) {
                parseBackendTicket(backendTickets.INTCOMPCOLLEAGUES_LONG.DEVDB_INTMESSAGE_OUT, 'colleagues');
            }

            //assigned to me
            if (angular.isArray(backendTickets.INTPERS_LONG.DEVDB_MESSAGE_OUT)) {
                angular.forEach(backendTickets.INTPERS_LONG.DEVDB_MESSAGE_OUT, function (backendTicket) {
                    parseBackendTicket(backendTicket, 'assigned_me');
                });
            } else if (angular.isObject(backendTickets.INTPERS_LONG.DEVDB_MESSAGE_OUT)) {
                parseBackendTicket(backendTickets.INTPERS_LONG.DEVDB_MESSAGE_OUT, 'assigned_me');
            }

            //created by me
            if (angular.isArray(backendTickets.INTCREATED_LONG.DEVDB_INTMESSAGE_OUT)) {
                angular.forEach(backendTickets.INTCREATED_LONG.DEVDB_INTMESSAGE_OUT, function (backendTicket) {
                    parseBackendTicket(backendTicket, 'created_me');
                });
            } else if (angular.isObject(backendTickets.INTCREATED_LONG.DEVDB_INTMESSAGE_OUT)) {
                parseBackendTicket(backendTickets.INTCREATED_LONG.DEVDB_INTMESSAGE_OUT, 'created_me');
            }

            that.updatePrioSelectionCounts();
            deferred.resolve();

        }).error(function () {
            deferred.reject();
        });

        return deferred.promise;
    };

    this.updatePrioSelectionCounts = function () {
        angular.forEach(this.prios, function (prio) {
            prio.selected = 0;
            if (configservice.data.selection.sel_components) { prio.selected = prio.selected + prio.sel_components; }
            if (configservice.data.selection.colleagues) { prio.selected = prio.selected + prio.colleagues; }
            if (configservice.data.selection.assigned_me) { prio.selected = prio.selected + prio.assigned_me; }
            if (configservice.data.selection.created_me) { prio.selected = prio.selected + prio.created_me; }
            if (!configservice.data.settings.ignore_author_action) {
                if (configservice.data.selection.sel_components) { prio.selected = prio.selected + prio.sel_components_aa; }
                if (configservice.data.selection.colleagues) { prio.selected = prio.selected + prio.colleagues_aa; }
                if (configservice.data.selection.assigned_me) { prio.selected = prio.selected + prio.assigned_me_aa; }
            }
        });
    };

    this.initialize = function () {
        this.loadTicketDataInterval = $interval(this.loadTicketData, 5000 );

        var loadTicketPromise = this.loadTicketData();
        loadTicketPromise.then(function success() {
            that.isInitialized.value = true;
        });

        return loadTicketPromise;
    };
}]);