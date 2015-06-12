angular.module('app.incidentSavedSearch').service('app.incidentSavedSearch.savedSearchData',
    ['$http', '$window', '$q', function ($http, $window, $q) {
        var SavedSearchData = function() {
            var that = this;
            this.savedSearches = [];

            this.loadData = function () {
                var deferred = $q.defer();

                $http.get('https://backup-support.wdf.sap.corp/sap/bc/devdb/my_saved_search?sap-client=001&sap-language=EN&origin=' + $window.location.origin, {withCredentials: true})
                    .success(function (data) {

                        data = new X2JS().xml_str2json(data);

                        var savedSearches;
                        if (data.abap.values.RESULTNODE1["_-SID_-SAVED_SEARCH_LINE"] !== undefined && !angular.isArray(data.abap.values.RESULTNODE1["_-SID_-SAVED_SEARCH_LINE"])) {
                            savedSearches = [data.abap.values.RESULTNODE1["_-SID_-SAVED_SEARCH_LINE"]];
                        } else {
                            savedSearches = data.abap.values.RESULTNODE1["_-SID_-SAVED_SEARCH_LINE"];
                        }

                        angular.forEach(savedSearches, function (savedSearch) {
                            that.savedSearches.push(savedSearch);
                        });

                        deferred.resolve();

                    }).error(function () {
                        deferred.reject();
                    });

                return deferred.promise;
            };
        };

        var instances = {};
        this.getInstanceForAppId = function(appId) {
            if(instances[appId] === undefined) {
                instances[appId] = new SavedSearchData();
            }
            return instances[appId];
        };
    }]
);
