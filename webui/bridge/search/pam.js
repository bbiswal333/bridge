angular.module('bridge.search').service('bridge.search.pamSearch', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-database",
            name: "SAP Product Availability Matrix"
        };
    };
    this.findMatches = function(query, resultArray) {
		return $http.get('https://i7d.wdf.sap.corp/sap/support/pamrest/bridge?name=*' + query + '*&sort=most_viewed%7Cdesc&origin=' + $window.location.origin).then(
            function(response) {
            	response.data.results.map(function(result) {
            		resultArray.push({title: result.name, originalResult: result});
            	});
            }
        );
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
            $window.open("https://i7d.wdf.sap.corp/sap/support/pam?hash=pvnr%3D" + selectedItem.originalResult.pvnr);
        };
    };
}]);
