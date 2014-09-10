describe("BridgeSearch provides functionalities to collect and call content providers", function() {
	var bridgeSearch;
	var timeout;
	var q;

	var synchronousSearchMock = {
		findMatches: function(query, resultArray) {
			resultArray.push({title: "title with " + query, description: "description with " + query});
		},
		getSourceName: function() {
			return "sample source";
		},
		getCallbackFn: function() {
		}
	};

	var asynchronousSearchMock = {
		findMatches: function(query, resultArray) {
			var deferred = q.defer();
			timeout(function(){
				resultArray.push({title: "async title 1 with " + query, description: "async description with " + query});
				resultArray.push({title: "async title 2 with " + query, description: "async description with " + query});
		        deferred.resolve();
		    },10);
			return deferred.promise;
		},
		getSourceName: function() {
			return "sample source";
		},
		getCallbackFn: function() {
		}
	};

	beforeEach(function () {
		module('bridge.search');
	    inject(function($injector, $timeout, $q) {
		    bridgeSearch = $injector.get('bridge.search');
		    timeout = $timeout;
		    q = $q;
		});
	});

	it("should be defined", function() {
		expect(bridgeSearch).toBeDefined();
	});

	it("should hide its internas", function() {
		expect(bridgeSearch.searchProviders).not.toBeDefined();
	});

	it("should be possible to add and remove a new search provider", function() {
		bridgeSearch.addSearchProvider(synchronousSearchMock);
		expect(bridgeSearch.getNumberOfSearchProviders()).toBe(1);
		bridgeSearch.removeSearchProvider(synchronousSearchMock);
		expect(bridgeSearch.getNumberOfSearchProviders()).toBe(0);
	});

	it("should reject an invalid search provider", function() {
		expect(function() { bridgeSearch.addSearchProvider(null); }).toThrow(new Error("Invalid search provider"));
		expect(bridgeSearch.getNumberOfSearchProviders()).toBe(0);
	});

	it("should ask all search providers for matches", function() {
		bridgeSearch.addSearchProvider(synchronousSearchMock);
		bridgeSearch.addSearchProvider(synchronousSearchMock);
		bridgeSearch.addSearchProvider(asynchronousSearchMock);
		var results = [];
		bridgeSearch.findMatches("dummy query", results).then(function() {
			expect(results.length).toBe(2);
		});
		timeout.flush();
	});
});
