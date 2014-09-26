angular.module("bridge.search", []);
angular.module("bridge.search").service("bridge.search", ['$q', function($q) {
	var searchProviders = [];

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

	this.findMatches = function(query, resultArray) {
		resultArray.length = 0;
		var deferred = $q.defer();
		var promises = [];
		searchProviders.map(function(provider) {
			var result = {info: provider.getSourceInfo(), results: [], callbackFn: provider.getCallbackFn()};
			resultArray.push(result);
			var promise = provider.findMatches(query, result.results);
			if(promise) {
				promises.push(promise);
			}
		});
		$q.all(promises).then(function() {
			deferred.resolve();
		});
		return deferred.promise;
	};
}]);
