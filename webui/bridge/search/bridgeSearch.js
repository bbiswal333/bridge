angular.module("bridge.search", ["ui.bootstrap.modal", "bridge.service"]);
angular.module("bridge.search").service("bridge.search", ['$q', 'bridgeDataService', function($q, bridgeDataService) {
	var searchProviders = [];

	this.addSearchProvider = function(searchProvider) {
		if(searchProvider === null || !searchProvider.hasOwnProperty('findMatches') || !searchProvider.hasOwnProperty('getSourceInfo') ||
			!searchProvider.hasOwnProperty('getCallbackFn')) {
			throw new Error("Invalid search provider");
		}

		if(searchProviders.indexOf(searchProvider) >= 0) {
			return;
		}

		var bridgeSettings = bridgeDataService.getBridgeSettings();
		if (bridgeSettings.searchProvider === undefined){
			bridgeSettings.searchProvider = {};
		}

		if (bridgeSettings.searchProvider[searchProvider.getSourceInfo().name] === undefined){
			bridgeSettings.searchProvider[searchProvider.getSourceInfo().name] = { name: searchProvider.getSourceInfo().name, selected: searchProvider.getSourceInfo().defaultSelected};
		}

		searchProviders.push(searchProvider);
	};

	this.getSearchProvider = function(){
		return searchProviders;
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
		var bridgeSettings = bridgeDataService.getBridgeSettings();
		promises = searchProviders.map(function(provider) {
			if (bridgeSettings.searchProvider[provider.getSourceInfo().name].selected) {
				var result = { info: provider.getSourceInfo(), results: [], callbackFn: provider.getCallbackFn(), metadata : { } };
				resultArray.push(result);
				var promise = provider.findMatches(query, result.results, result.metadata);
				if (promise) {
					return promise;
				}
			}
		});
		$q.all(promises).then(function() {
			deferred.resolve();
		});
		return deferred.promise;
	};
}]);
