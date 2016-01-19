angular.module('bridge.search').service('bridge.search.sapediaSearch', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-book",
            name: "SAPedia",
            defaultSelected: true
        };
    };
    this.findMatches = function(query, resultArray) {
    	var q = "https://sapedia.wdf.sap.corp:8984/solr/select?input=" + query + "&q=smwh_title_exact_case_unsensitive%3A(";
    	q += query + ")%5E4%20smwh_title%3A(%2B" + query + "*)%5E2%20OR%20smwh_title_s%3A(%2B" + query + "*)%5E2%20OR%20smwh_full_text%3A(%2B";
    	q += query + "*)&fl=smwh_url%2Cid%2Csmwh_title_caption&wt=json";
                    	return $http({method: "GET", url: q, withCredentials: false}).then(
                function(response) {
                	var docs = response.data.response.docs;
                	for (var i = 0; i < docs.length; i++) {
                        docs[i].smwh_url = docs[i].smwh_url.replace('http://mo-6b4fdf7cb','https\://sapedia.wdf.sap.corp');
                	    resultArray.push({title: docs[i].smwh_title_caption, link: docs[i].smwh_url});
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
