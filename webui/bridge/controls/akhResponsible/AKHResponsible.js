angular.module('bridge.service').service('bridge.AKHResponsibleFactory', ["$q", "$http", "$timeout", function($q, $http, $timeout) {
    var roles = {
        "DEV_UID_DLVRY_M": "Delivery Manager",
        "DEV_UID_DM": "Development Component Owner",
        "DEV_UID_PRDOWNER": "Development Product Owner"
    };

    var AKHResponsible = (function() {
        return function(sProperty, sUserId) {
            var aComponents;

            this.getProperty = function() {
                return sProperty;
            };

            this.getRole = function() {
                return roles[this.getProperty()];
            };

            this.getUserId = function() {
                return sUserId;
            };

            this.toJSON = function() {
                return {
                    property: sProperty,
                    userId: sUserId
                };
            };

            this.getComponents = function() {
                var deferred = $q.defer();
                if(!aComponents) {
                    $http.get("https://mithdb.wdf.sap.corp/irep/reporting/internalIncidents/components.xsodata/Component?$format=json&$filter=" + this.getProperty() + " eq '" + this.getUserId() + "'").then(function(response) {
                        aComponents = response.data.d.results.map(function(component) {
                            return {value: component.PS_POSID};
                        });
                        deferred.resolve(aComponents);
                    });
                } else {
                    $timeout(function() {
                        deferred.resolve(aComponents);
                    });
                }
                return deferred.promise;
            };
        };
    })();

    this.createInstance = function(sProperty, sUserId) {
        return new AKHResponsible(sProperty, sUserId);
    };
}]);
