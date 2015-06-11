angular.module('bridge.search').service('bridge.search.quicklinkSearch', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-bolt",
            name: "Quick Links",
            defaultSelected: true
        };
    };
    this.findMatches = function(query, resultArray) {
    	var q = "https://portal.wdf.sap.corp/irj/servlet/prt/portal/prtroot/com.sap.sen.prg.quicklinks.inputfield.QLIFServlet";

    	return $http({method: "GET", url: q, withCredentials: false}).then(
          function(response) {
          	var quicklinks = response.data.split(',');

            for (var i = 0; i < quicklinks.length; i++) {
              if(quicklinks[i].search(query) >= 0) {
          	    resultArray.push({title: quicklinks[i], link: 'https://portal.wdf.sap.corp/go/' + quicklinks[i]});
              }
          	}
          }
      );
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
        	$window.open(selectedItem.link);
        };
    };
}]);
