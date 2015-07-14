angular.module('bridge.search').service('bridge.search.saptermSearch', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-book",
            name: "SAPterm",
            defaultSelected: true
        };
    };
    this.findMatches = function(query, resultArray) {

    	var q = "https://ldcistm.wdf.sap.corp:44378/sap/opu/odata/SAP/STERM_SIMPLE_SUGGEST_SRV/StermSimpleSuggest?$format=json&$filter=Text%20eq%20%27" + query + "%27&origin=" + $window.location.origin;
      return $http({method: "GET", url: q, withCredentials: false}).then(
                function(response) {
                  console.log(response.data.d.results);

                  var docs = response.data.d.results;
                  for (var i = 0; i < docs.length; i++) {
                      docs[i].url = 'https://ldcistm.wdf.sap.corp:44378/sap/bc/ui5_ui5/sap/sterm_web/index.html?sap-client=000&query=' + docs[i].Text;
                	    resultArray.push({title: docs[i].Text, link: docs[i].url});
                	};
                }
            );
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
        	$window.open(selectedItem.link);
        };
    };
}]);
