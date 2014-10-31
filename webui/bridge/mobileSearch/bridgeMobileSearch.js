angular.module("bridge.mobileSearch", []);
angular.module("bridge.mobileSearch").service("bridge.mobileSearch", ['$q', function($q) {
	var searchProviders = [];
	var results = [];
	var global_query;

	this.addSearchProvider = function(searchProvider) {
		//todo: check for search function
		if(searchProvider === null || !searchProvider.hasOwnProperty('findMatches') || !searchProvider.hasOwnProperty('getSourceInfo') ||
			!searchProvider.hasOwnProperty('getCallbackFn')) {
			throw new Error("Invalid search provider");
		}

		if(searchProviders.indexOf(searchProvider) >= 0) {
			return;
		}

		searchProviders.push(searchProvider);
	};

	this.removeSearchProvider = function(searchProvider) {
		searchProviders.splice(searchProviders.indexOf(searchProvider), 1);
	};

	this.getNumberOfSearchProviders = function() {
		return searchProviders.length;
	};

	this.findMatches = function(query) {
		global_query = query;
		results.length = 0;
		var deferred = $q.defer();
		var promises = [];
		promises = searchProviders.map(function(provider) {
			var result = {info: provider.getSourceInfo(), results: [], callbackFn: provider.getCallbackFn()};
			results.push(result);
			var promise = provider.findMatches(query, result.results);
			if(promise) {
				return promise;
			}
		});
		$q.all(promises).then(function() {
			deferred.resolve();
		});
	};

	this.getResults = function() {
		return results;
	};

	this.getQuery = function() {
		return {
			'query' : global_query
		};
	};

}]);
