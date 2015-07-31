angular.module('bridge.search').service('bridge.search.quicklinkSearch', ['$http', '$window', '$log', function ($http, $window, $log) {

    var quickLinks = {};
    var quickLinksAvailable = true;

    function getQuickLinks() {
      var q = "https://portal.wdf.sap.corp/irj/servlet/prt/portal/prtroot/com.sap.sen.prg.quicklinks.inputfield.QLIFServlet";

      return $http({method: "GET", url: q, withCredentials: false}).then(
        function(response) {
          quickLinks = response.data.split(',');
        }, function() {
          $log.log('[search_quicklinks] Unable to read quicklink list');
          quickLinksAvailable = false;
        }
      );
    }

    function findInQuickLinks(query, resultArray) {
      for (var i = 0; i < quickLinks.length; i++) {
        if(quickLinks[i].search(query) >= 0) {
          resultArray.push({title: quickLinks[i], link: 'https://portal.wdf.sap.corp/go/' + quickLinks[i]});
        }
      }
    }

    this.getSourceInfo = function() {
        return {
            icon: "fa fa-bolt",
            name: "Quick Links",
            defaultSelected: true
        };
    };

    this.findMatches = function(query, resultArray) {
      // if it failed once it will most likely fail again
      // (CORS restriction for instance)
      // We don't want to keep calling the service every search then.
      if(quickLinksAvailable) {

        if(quickLinks.lenght > 0) {
          findInQuickLinks(query, resultArray);
        }
        else {
          return getQuickLinks().then(
            function() {
              findInQuickLinks(query, resultArray);
            }
          );
        }
      }
    };

    this.getCallbackFn = function() {
        return function(selectedItem) {
        	$window.open(selectedItem.link);
        };
    };
}]);
