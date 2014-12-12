angular.module("app.lunchWalldorf" ).service('app.lunchWalldorf.backendData', [ "$http", "$q", function($http, $q){

    var configBackend =
    {
        "WDF": {
            portalLink:  "https://portal.wdf.sap.corp/irj/servlet/prt/portal/prtroot/com.sap.sen.wcms.Cockpit.Main?url=/guid/3021bb0d-ed8d-2910-5aa6-cbed615328df",
            portalLinkText: "Lunch menu in the portal",
            portalBackend: '/api/get?proxy=true&url=' + encodeURI('http://app.sap.eurest.de:80/mobileajax/data/35785f54c4f0fddea47b6d553e41e987/all.json')
        },
        "KAR": {
            portalLink:  "http://www.casinocatering.de/speiseplan/max-rubner-institut",
            portalLinkText: "Lunch menu online",
            portalBackend: 'https://deqkalvm294.qkal.sap.corp/bfe.json'
        },
        "DRE": {
            portalLink:  "https://lunchmenudresden-p1940757062trial.dispatcher.hanatrial.ondemand.com",
            portalLinkText: "Lunch menu online",
            portalBackend: ''
        }
    };
    this.isValidBackend = function(backend) {
        return typeof configBackend[backend] !== "undefined";
    };

    this.getDefaultBackend = function() {
        return "WDF";
    };

    this.getBackendMetadata = function(sSelectedBackend) {
        return configBackend[sSelectedBackend];
    };

    this.getLunchData = function(chosenbackend) {
        var deferred = $q.defer();

        $http.get(configBackend[chosenbackend].portalBackend).then(function (data) {
            if (data.status !== 200 && data.status !== 304 ) {
                deferred.reject(data);
            } else {
                deferred.resolve(data.data);
            }
        });

        return deferred.promise;
    };


}]);
