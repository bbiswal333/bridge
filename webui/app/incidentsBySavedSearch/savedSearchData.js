angular.module('app.incidentSavedSearch').service('app.incidentSavedSearch.savedSearchData',
    ['$http', '$window', '$q', function ($http, $window, $q) {
        var SavedSearchData = function() {
            var that = this;
            this.savedSearches = [];

            this.loadData = function () {

                var promiseDevelopment = $http.get('https://support.wdf.sap.corp/sap/bc/devdb/my_saved_search?sap-client=001&sap-language=EN&business_role=ZCSSNEXTPROC&origin=' + $window.location.origin,
                    { withCredentials: true });

                var promiseSupport = $http.get('https://support.wdf.sap.corp/sap/bc/devdb/my_saved_search?sap-client=001&sap-language=EN&business_role=ZCSSINTPROCE&origin=' + $window.location.origin,
                    { withCredentials: true });

                var promiseAll = $q.all([promiseDevelopment, promiseSupport]);
                promiseAll.then(function (aPromiseResponse) {

                    function extractSavedSearches(oPromiseResponse, bIsFromDevProfile) {
                        var data = new X2JS().xml_str2json(oPromiseResponse.data);

                        var savedSearches;
                        if (data.abap.values.RESULTNODE1["_-SID_-SAVED_SEARCH_LINE"] !== undefined && !angular.isArray(data.abap.values.RESULTNODE1["_-SID_-SAVED_SEARCH_LINE"])) {
                            savedSearches = [data.abap.values.RESULTNODE1["_-SID_-SAVED_SEARCH_LINE"]];
                        } else {
                            savedSearches = data.abap.values.RESULTNODE1["_-SID_-SAVED_SEARCH_LINE"];
                        }

                        angular.forEach(savedSearches, function (savedSearch) {
                            if (_.find(that.savedSearches, { PARAMETER_: savedSearch.PARAMETER_ }) === undefined) {
                                savedSearch.bIsFromDevProfile = bIsFromDevProfile;
                                that.savedSearches.push(savedSearch);
                            }
                        });
                    }

                    extractSavedSearches(aPromiseResponse[0], false);
                    extractSavedSearches(aPromiseResponse[1], true);
                });

                return promiseAll;
            };
        };

        var instances = {};
        this.getInstanceForAppId = function(appId) {
            if(instances[appId] === undefined) {
                instances[appId] = new SavedSearchData(appId);
            }
            return instances[appId];
        };
    }]
);
