angular.module('bridge.search').service('bridge.search.googleProposals', ['$http', '$window', function ($http, $window) {
	function isUrl(s) {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return regexp.test(s);
	}

    this.getSourceInfo = function() {
        return {
            icon: "fa fa-google",
            name: "Google"
        };
    };
    this.findMatches = function(query, resultArray) {
		return $http.get('/api/get?proxy=true&url=' + encodeURIComponent("http://suggestqueries.google.com/complete/search?output=chrome&hl=en&q=" + query)).then(
            function(response) {
            	response.data[1].map(function(result) {
            		resultArray.push({title: result});
            	});
            }
        );
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
        	if(isUrl(selectedItem.title)) {
        		$window.open(selectedItem.title);
        	} else {
            	$window.open("https://www.google.com/search?q=" + selectedItem.title);
            }
        };
    };
}]);
