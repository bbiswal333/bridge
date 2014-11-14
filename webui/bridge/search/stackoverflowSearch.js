angular.module('bridge.search').service('bridge.search.stackoverflowSearch', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-stack-overflow",
            name: "Stack Overflow",
            defaultSelected: false
        };
    };
    this.findMatches = function(query, resultArray) {
		return $http({method: "GET", url: "https://api.stackexchange.com/2.2/search/advanced?key=bYnjTFEY7tPoSrpRPrbSmA((&site=stackoverflow&order=desc&sort=relevance&q=" + query + "&filter=default", withCredentials: false}).then(
            function(response) {
            	response.data.items.map(function(result) {
            		resultArray.push({title: result.title, link: result.link});
            	});
            }
        );
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
        	$window.open(selectedItem.link);
        };
    };
}]);
