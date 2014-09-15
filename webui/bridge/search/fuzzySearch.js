/*global Fuse*/
angular.module("bridge.search").factory("bridge.search.fuzzySearch", [function() {
	return function(sSourceInfo, oData, oOptions) {
		oOptions.includeScore = true;
		oOptions.threshold = oOptions.threshold || 0.4;
		oOptions.shouldSort = true;
		oOptions.distance = 500;
		var fuse = new Fuse(oData, oOptions);

		var FuzzySearch = function() {
			this.findMatches = function(query, resultArray) {
				fuse.search(query).map(function(result) {
					if(oOptions.mappingFn && typeof oOptions.mappingFn === "function") {
						resultArray.push(oOptions.mappingFn(result));
					} else {
						resultArray.push(result);
					}
				});
			};

			this.getSourceInfo = function() {
				return sSourceInfo;
			};

			this.getCallbackFn = function() {
				return oOptions.callbackFn;
			};
		};

		return new FuzzySearch();
	};
}]);
