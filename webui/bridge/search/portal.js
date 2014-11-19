angular.module('bridge.search').service('bridge.search.portalSearch', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-building-o",
            name: "Corporate Portal",
            defaultSelected: true
        };
    };
    this.findMatches = function(query, resultArray) {
        resultArray.push({title: "..search " + query + " with Portal", link: "https://search.wdf.sap.corp/ui#query=" + query + "&startindex=1"});
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
        	$window.open(selectedItem.link);
        };
    };
}]);
