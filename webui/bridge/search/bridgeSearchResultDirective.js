angular.module("bridge.search").directive("bridge.search.searchResult", ['$compile', '$templateCache', '$http', '$q', function($compile, $templateCache, $http, $q) {
	var defaultTemplate = '<div class="search-result-item"><span style="max-width: 250px;" class="search-span-ellipsis" ng-bind-html="highlight(match.title)"></span>' +
						  '<span ng-if="match.description" style="vertical-align: top;">&#8212;</span>' +
						  '<span class="search-span-ellipsis">{{match.description}}</span></div>';

	var linker = function(scope, element) {
		function getTemplatePromise(templateUrl) {
	        return $http.get(templateUrl, {cache: $templateCache}).then(function (result) {
	            return result.data;
	        });
	    }

	    var deferred = $q.defer();
		if(scope.resultSource.resultTemplate) {
			getTemplatePromise(scope.resultSource.resultTemplate).then(function(data) {
				element.html(data);
				deferred.resolve();
			});
		} else {
			element.html(defaultTemplate);
			deferred.resolve();
		}

		deferred.promise.then(function() {
			$compile(element.contents())(scope);
		});
    };

	function escapeRegExp(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	return {
		restrict: 'E',
		scope: {
			"match": "=",
			"resultSource": "=",
			"query": "="
		},
		controller: function($scope) {
			$scope.highlight = function(text) {
				return text.replace(new RegExp(escapeRegExp($scope.query), 'gi'), '<b>$&</b>');
			};
		},
		link: linker
	};
}]);
