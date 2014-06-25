angular.module('app.im').service('app.im.ticketData', ['$http', '$q', '$interval', 'bridgeDataService', function ($http, $q, $interval, bridgeDataService) {
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

    this.resetPrios = function () {
        angular.forEach(that.prios, function (prio) {
            prio.amount = 0;
        });
    };    

    this.loadTicketData = function () {
        var deferred = $q.defer();

        //this.userid = bridgeDataService.getUserInfo().BNAME.toUpperCase();
        $http.get('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS?sap-language=en&origin=' + location.origin//&sap-user=' + that.userid + '&origin=' + location.origin
        ).success(function (data) {
            that.resetPrios();

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

            deferred.resolve();

        }).error(function () {
            deferred.reject();
        });

        return deferred.promise;
    };

    this.initialize = function () {
        this.loadTicketDataInterval =  $interval(this.loadTicketData, 60000 * 10);

        var loadTicketPromise = this.loadTicketData();
        loadTicketPromise.then(function success() {
            that.isInitialized.value = true;
        });

        return loadTicketPromise;
    };
}]);