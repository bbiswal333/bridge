angular.module('bridge.search').directive('bridge.search', ['bridge.search', '$interval', function(bridgeSearch, $interval) {
	return {
        restrict: 'E',
        templateUrl: 'bridge/search/BridgeSearchDirective.html',
        controller: function($scope) {
            var MINIMUM_QUERY_LENGTH = 2;
            $scope.maxResults = 5;

            $scope.query = ""; // Suchstring

            $scope.selectedItem = null;
            $scope.results = [];

            var hierarchyIndex = 0;
            var resultIndex = -1;
            function removeSelection() {
                $scope.selectedItem = null;
                hierarchyIndex = 0;
                resultIndex = -1;
            }

            function displayResults() {
                $scope.displayResults = true;
                removeSelection();
            }
            function hideResults() {
                $scope.displayResults = false;
                removeSelection();
            }

        	function doSearch() {
        		if($scope.query) {
	        		bridgeSearch.findMatches($scope.query, $scope.results);
	        	}
                displayResults();
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
                    hideResults();
                }
                previousQuery = $scope.query;
            });

            $scope.checkDisplay = function(resultProvider) {
                if(resultProvider === undefined || resultProvider.results === undefined || resultProvider.results.length === 0) {
                    return false;
                }
                return true;
            };

            function moveSelectionUp() {
                try {
                    resultIndex--;

                    if(resultIndex < 0) {
                        while($scope.results[hierarchyIndex].length === 0 || resultIndex < 0) {
                            hierarchyIndex--;
                            resultIndex = $scope.results[hierarchyIndex].results.length - 1;
                            if((resultIndex + 1) > $scope.maxResults) {
                                resultIndex = $scope.maxResults - 1;
                            }
                        }
                    }

                    $scope.selectedItem = $scope.results[hierarchyIndex].results[resultIndex];
                } catch(e) {
                    hierarchyIndex = $scope.results.length - 1;
                    resultIndex = $scope.results[hierarchyIndex].results.length;
                    if(resultIndex > $scope.maxResults) {
                        resultIndex = $scope.maxResults;
                    }
                    moveSelectionUp();
                }
            }
            function moveSelectionDown() {
                try {
                    while($scope.results[hierarchyIndex].length === 0 ||
                            (resultIndex + 1) >= $scope.results[hierarchyIndex].results.length || (resultIndex + 1) >= $scope.maxResults) {
                        hierarchyIndex++;
                        resultIndex = -1;
                    }
                    resultIndex++;

                    $scope.selectedItem = $scope.results[hierarchyIndex].results[resultIndex];
                } catch(e) {
                    removeSelection();
                    moveSelectionDown();
                }
            }

            $scope.hideResults = hideResults;
            $scope.checkAndShowResults = function() {
                if($scope.results.length > 0 && $scope.query.length > MINIMUM_QUERY_LENGTH) {
                    displayResults();
                }
            };

            $scope.keyPressed = function(event) {
                switch(event.keyCode) {
                    case 38:
                        moveSelectionUp();
                        break;
                    case 40:
                        moveSelectionDown();
                        break;
                    case 13:
                        $scope.fireSelectedCallback();
                        break;
                }
            };

            $scope.mouseSelection = function(iHierarchyIndex, iResultIndex) {
                hierarchyIndex = iHierarchyIndex;
                resultIndex = iResultIndex;
                $scope.selectedItem = $scope.results[hierarchyIndex].results[resultIndex];
            };

            $scope.mouseDeselection = function() {
            	removeSelection();
            };

            $scope.fireSelectedCallback = function() {
                if($scope.selectedItem && $scope.results[hierarchyIndex].callbackFn) {
                    $scope.results[hierarchyIndex].callbackFn($scope.selectedItem, $scope);
                    hideResults();
                }
            };

            $scope.fireShowMoreCallback = function() {
                if ($scope.results[hierarchyIndex].metadata !== undefined && typeof $scope.results[hierarchyIndex].metadata.showMore === "function") {
                    $scope.results[hierarchyIndex].metadata.showMore();
                    hideResults();
                }
            };

        }
    };
}]);
