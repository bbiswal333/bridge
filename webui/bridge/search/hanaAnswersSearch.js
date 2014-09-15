angular.module('bridge.search').service('bridge.search.hanaAnswersSearch', ['$http', '$window', function ($http, $window) {
    this.getSourceName = function() {
        return "SAP HANA Answers";
    };
    this.findMatches = function(query, resultArray) {
		return $http.get('https://answers.saphana.com/sap/answers/backend/rest/public/search/?q=' + query + '&order=RELEVANCE&n=10&page=1&origin=' + $window.location.origin).then(
            function(response) {
            	response.data.results.map(function(result) {
            		resultArray.push({title: result.title, originalResult: result});
            	});
            }
        );
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
            $window.open("https://answers.saphana.com/sap/answers/frontend/web" + selectedItem.originalResult.url);
        };
    };
}]);
