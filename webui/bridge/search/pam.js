angular.module('bridge.search').service('bridge.search.pamSearch', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-calendar",
            name: "SAP Product Availability Matrix",
            resultTemplate: "bridge/search/pamTemplate.html",
            defaultSelected : true
        };
    };
    this.findMatches = function(query, resultArray) {
		return $http.get('https://i7d.wdf.sap.corp/odataint/pam/bridge/BridgeSearchResults?$format=json&search=*' + query + '*&$inlinecount=allpages&origin=' + $window.location.origin).then(
            function(response) {
            	response.data.d.results.map(function(result) {
            		resultArray.push({title: result.Title, description: result.Description, originalResult: result});
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
