angular.module('bridge.search').service('bridge.search.ppmsSearch', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-cubes",
            name: "PPMS",
            resultTemplate: "bridge/search/ppmsTemplate.html",
            defaultSelected : true
        };
    };
    this.findMatches = function(query, resultArray, metadata) {
		return $http.get('https://i7d.wdf.sap.corp/odataint/borm/bridge/BridgeSearchResults?$format=json&search=' + query + '&$inlinecount=allpages&origin=' + $window.location.origin).then(
            function(response) {
            	response.data.d.results.map(function(result) {
            		resultArray.push({ type: result.Type, typetooltip: result.TypeTooltip, 
            						   title: result.Title, description: result.Description, originalResult: result});
            	});
            	if (metadata !== undefined) {
            		metadata.count = response.data.d.__count;
            		metadata.showMore = function()  {
	            		$window.open("https://i7d.wdf.sap.corp/sap/internal/ppms/start?ui=SEARCH&uidetail=" + query);
	            	};
            	}                
            }
        );
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
            $window.open(selectedItem.originalResult.Url);
        };
    };
}]);
