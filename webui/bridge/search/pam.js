angular.module('bridge.search').service('bridge.search.pamSearch', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-database",
            name: "SAP Product Availability Matrix"
        };
    };
    this.findMatches = function(query, resultArray) {
		return $http.get('https://i7d.wdf.sap.corp/sap/opu/odata/SAP/ZMS_PAM_BRIDGE_SEARCH_SRV/ProductVersions?$format=json&search=*' + query + '*&origin=' + $window.location.origin).then(
            function(response) {
            	response.data.d.results.map(function(result) {
            		resultArray.push({title: result.DisplayName, /*description: result.OfficialName, */ originalResult: result});
            	});
            }
        );
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
            $window.open(selectedItem.originalResult.Url);
        };
    };
}]);
