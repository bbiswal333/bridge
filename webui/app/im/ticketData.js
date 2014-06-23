angular.module('app.im').service('app.im.ticketData', ['$http', '$q', function ($http, $q) {
    var that = this;

    this.backendTickets = null;
    // make an object so that we can have it referenced in the scope
    this.isInitialized = { value: false };
    this.loadTicketDataInterval = null;

    function parseBackendTicket(backendTicket) {
        _.each(that.prios, function (prio) {
            if (backendTicket.PRIO == prio.number.toString())
                prio.amount++;
        });
    }

    this.prios = [{
        name: "Very high", number: 1, amount: 0,
    }, {
        name: "High", number: 2, amount: 0,
    }, {
        name: "Medium", number: 3, amount: 0,
    }, {
        name: "Low", number: 4, amount: 0,
    }];

    this.loadTicketData = function () {
        var deferred = $q.defer();

        $http.get('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS?sap-language=en&origin=' + location.origin
        ).success(function (data) {
            data = new X2JS().xml_str2json(data);
            var imData = data["abap"];
            that.backendTickets = imData["values"];

            // if you have multiple tickets, DEVDB_MESSAGE_OUT is an array, otherwise a simple object
            if (angular.isArray(that.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT)) {
                _.each(that.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT, function (backendTicket) {
                    parseBackendTicket(backendTicket);
                });
            } else if (angular.isObject(that.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT)) {
                parseBackendTicket(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT);
            }

            deferred.resolve();

        }).error(function (data) {
            deferred.reject();
        });

        return deferred.promise;
    };

    this.initialize = function () {
        this.loadTicketDataInterval =  $interval(this.loadTicketData, 60000 * 5);

        var loadTicketPromise = this.loadTicketData();
        loadTicketPromise.then(function success(data) {
            that.isInitialized.value = true;
        });

        return loadTicketPromise;
    };
}]);