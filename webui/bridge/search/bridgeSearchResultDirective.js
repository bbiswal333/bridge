angular.module("bridge.search").directive("bridge.search.searchResult", ['$compile', '$templateCache', function($compile, $templateCache) {
	var defaultTemplate = '<div class="search-result-item"><span style="max-width: 250;" class="search-span-ellipsis" ng-bind-html="highlight(match.title)"></span>' +
						  '<span ng-if="match.description" style="vertical-align: top;">&#8212;</span>' +
						  '<span class="search-span-ellipsis">{{match.description}}</span></div>';

	var linker = function(scope, element) {
		if(scope.resultSource.resultTemplate && $templateCache.get(scope.resultSource.resultTemplate)) {
			element.html($templateCache.get(scope.resultSource.resultTemplate));
		} else {
			element.html(defaultTemplate);
		}

        $compile(element.contents())(scope);
    };

	return {
		restrict: 'E',
		scope: {
			"match": "=",
			"resultSource": "=",
			"query": "="
		},
		controller: function($scope) {
			$scope.highlight = function(text) {
				return text.replace(new RegExp($scope.query, 'gi'), '<b>$&</b>');
			};
		},
		link: linker
	};
}]);
