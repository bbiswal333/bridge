angular.module('app.im').service('app.im.ticketData', ['$http', '$q', '$interval', 'bridgeDataService', function ($http, $q, $interval, bridgeDataService) {
    var that = this;

    this.backendTickets = null;
    
    // make an object so that we can have it referenced in the scope
    this.isInitialized = { value: false };
    this.loadTicketDataInterval = null;

    function parseBackendTicket(backendTicket, category) {
        angular.forEach(that.prios, function (prio) {
            if (backendTicket.PRIO === prio.number.toString())
            {
                prio[category]++;
                prio.total++;
            }
        });
    }

    this.prios = [
        { name: "Very high",    number: 1, sel_components: 0, colleagues:0, assigned_me: 0, created_me: 0, selected: 0, total: 0 },
        { name: "High",         number: 2, sel_components: 0, colleagues:0, assigned_me: 0, created_me: 0, selected: 0, total: 0 }, 
        { name: "Medium",       number: 3, sel_components: 0, colleagues:0, assigned_me: 0, created_me: 0, selected: 0, total: 0 }, 
        { name: "Low",          number: 4, sel_components: 0, colleagues:0, assigned_me: 0, created_me: 0, selected: 0, total: 0 }];    

    this.resetPrios = function () {
        angular.forEach(that.prios, function (prio) {
            prio.amount = 0;
        });
    };

    this.userid = bridgeDataService.getUserInfo().BNAME.toUpperCase();

    this.loadTicketData = function () {
        var deferred = $q.defer();

        $http.get('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS?sap-language=en&sap-user=' + that.userid + '&origin=' + location.origin
        ).success(function (data) {
            that.resetPrios();

            data = new X2JS().xml_str2json(data);
            var imData = data.abap;
            that.backendTickets = imData.values;

            //selected component
            if (angular.isArray(that.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT)) {
                angular.forEach(that.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT, function (backendTicket) {
                    parseBackendTicket(backendTicket, 'sel_components');
                });
            } else if (angular.isObject(that.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT)) {
                parseBackendTicket(that.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT, 'sel_components');
            }

            //colleagues
            if (angular.isArray(that.backendTickets.INTCOMPCOLLEAGUES_LONG.DEVDB_INTMESSAGE_OUT)) {
                angular.forEach(that.backendTickets.INTCOMPCOLLEAGUES_LONG.DEVDB_INTMESSAGE_OUT, function (backendTicket) {
                    parseBackendTicket(backendTicket, 'colleagues');
                });
            } else if (angular.isObject(that.backendTickets.INTCOMPCOLLEAGUES_LONG.DEVDB_INTMESSAGE_OUT)) {
                parseBackendTicket(that.backendTickets.INTCOMPCOLLEAGUES_LONG.DEVDB_INTMESSAGE_OUT, 'colleagues');
            }

            //assigned to me
            if (angular.isArray(that.backendTickets.INTPERS_LONG.DEVDB_MESSAGE_OUT)) {
                angular.forEach(that.backendTickets.INTPERS_LONG.DEVDB_MESSAGE_OUT, function (backendTicket) {
                    parseBackendTicket(backendTicket, 'assigned_me');
                });
            } else if (angular.isObject(that.backendTickets.INTPERS_LONG.DEVDB_MESSAGE_OUT)) {
                parseBackendTicket(that.backendTickets.INTPERS_LONG.DEVDB_MESSAGE_OUT, 'assigned_me');
            }

            //created by me
            if (angular.isArray(that.backendTickets.INTCREATED_LONG.DEVDB_INTMESSAGE_OUT)) {
                angular.forEach(that.backendTickets.INTCREATED_LONG.DEVDB_INTMESSAGE_OUT, function (backendTicket) {
                    parseBackendTicket(backendTicket, 'created_me');
                });
            } else if (angular.isObject(that.backendTickets.INTCREATED_LONG.DEVDB_INTMESSAGE_OUT)) {
                parseBackendTicket(that.backendTickets.INTCREATED_LONG.DEVDB_INTMESSAGE_OUT, 'created_me');
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