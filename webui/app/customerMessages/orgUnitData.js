angular.module('app.customerMessages').service('app.customerMessages.orgUnitData',
    ['$http', '$window', '$q', function ($http, $window, $q) {
        var that = this;
        this.orgUnits = [];

        this.loadData = function() {
            var deferred = $q.defer();

            //$http.get('https://backup-support.wdf.sap.corp/sap/bc/devdb/customer_incid?sap-client=001&sap-language=EN&origin=' + $window.location.origin, {withCredentials:true}
            $http.get('https://bcdmain.wdf.sap.corp/sap/bc/devdb/my_org_units?sap-client=001&sap-language=EN&origin=' + $window.location.origin, {withCredentials: true})
                .success(function (data) {

                    data = new X2JS().xml_str2json(data);
                    angular.forEach(data.abap.values.RESULTNODE1.CRMT_PPM_OM_USER_ASSIGNMENTS, function(orgUnit){
                        that.orgUnits.push(orgUnit);
                    });

                    deferred.resolve();

                }).error(function () {
                    deferred.reject();
                });

            return deferred.promise;
        };
    }]
);
