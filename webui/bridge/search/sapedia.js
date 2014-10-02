angular.module('bridge.search').service('bridge.search.sapediaSearch', ['$http', '$window', '$q', function ($http, $window, $q) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-book",
            name: "SAPedia"
        };
    };
    this.findMatches = function(query, resultArray) {
        
        
        
        resultArray.push({title: "..search " + query + " with SAPedia", link: "https://sapedia.wdf.sap.corp/wiki/index.php?search=" + query});
                

		/*return $http({method: "GET", url: "https://api.stackexchange.com/2.2/search/advanced?key=bYnjTFEY7tPoSrpRPrbSmA((&site=stackoverflow&order=desc&sort=relevance&q=" + query + "&filter=default", withCredentials: false}).then(
            function(response) {
            	response.data.items.map(function(result) {
            		resultArray.push({title: result.title, link: result.link});
            	});
            }
        );*/
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
        	$window.open(selectedItem.link);
        };
    };
}]);
