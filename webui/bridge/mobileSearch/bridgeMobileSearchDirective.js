angular.module('bridge.mobileSearch').directive('bridge.mobileSearch', ['bridge.mobileSearch', '$interval', function(bridgeMobileSearch, $interval) {
	return {
        restrict: 'E',
        templateUrl: 'bridge/mobileSearch/BridgeMobileSearchDirective.html',
        controller: function($scope) {

            $scope.query = "";
            var MINIMUM_QUERY_LENGTH = 2;
            $scope.results = [];

            function doSearch() {
                if($scope.query) {
                   bridgeMobileSearch.findMatches($scope.query);
                   $scope.results = bridgeMobileSearch.getResults();
                }
            }

            var interval;
            var previousQuery;
            $scope.$watch("query", function() {
                if($scope.query.length > MINIMUM_QUERY_LENGTH) {
                    if(interval) {
                        $interval.cancel(interval);
                    }

                    if(!$scope.displayResults) {
                        interval = $interval(doSearch, 500, 1);
                    } else {
                        interval = $interval(function() {
                            if($scope.query === previousQuery) {
                                doSearch();
                            }
                        }, 500, 1);
                    }
                } else {
                    if(interval) {
                        $interval.cancel(interval);
                        interval = null;
                    }
                }
                previousQuery = $scope.query;
            });

        }
    };
}]);
