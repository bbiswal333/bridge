angular.module('bridge.search').service('bridge.search.playbookSearch', ['$http', '$window', '$q', function ($http, $window, $q) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-play-circle",
            name: "Playbook"
        };
    };
    this.findMatches = function(query, resultArray) {                       
        resultArray.push({title: "..search " + query + " with Playbook", link: "https://myplaybook.wdf.sap.corp/#/?page=search&query=" + query + "&map=playbook-new"});               
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
        	$window.open(selectedItem.link);
        };
    };
}]);