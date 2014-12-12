angular.module("bridge.mobileSearchResults", []);
angular.module("bridge.mobileSearchResults").directive('bridge.mobileSearchResults', ['bridge.mobileSearch', function(bridgeMobileSearch) {
    return {
        restrict : 'E',
        templateUrl : 'bridge/mobileSearch/BridgeMobileSearchResults.html',
        controller : function($scope, $timeout, $window) {

            var count;
            var width;

            function setCount() {
                width = ($window.innerWidth > 0) ? $window.innerWidth : $window.screen.width;
                count = (width > 991 ? 4 : ((width < 768) ? 1 : 2));
            }

            $($window).resize(function(){
                setCount();
                $scope.$apply(function() {
                    $scope.width = width;
                    $scope.count = count;
                });
            });

            $($window).scroll(function(){
                $('#moreProvider').slideUp(300);
            });

            setCount();
            $scope.width = width;
            $scope.count = count;

            var results = [];
            var providerResultsCount = [];
            var queryObj;
            $scope.selectedProviderID = -1;
            $scope.all = true;
            $scope.noResultString = "No Results... &#3237;&#65103;&#3237;";
            $scope.maxResults = 9;

            results = bridgeMobileSearch.getResults();
            queryObj = bridgeMobileSearch.getQuery();

                $scope.query = queryObj.query;

            $scope.$watch('results', function() {

                results.forEach(function(providerResult, index) {
                    providerResultsCount[index] = providerResult.results.length;

                });
                $scope.providerResultsCount = providerResultsCount;
                $scope.providers = results;
                $scope.providerResults = results[$scope.selectedProviderID];
            }, true);

            $scope.selectProvider = function(index) {
                $scope.all = false;
                $scope.selectedProviderID = index;
                $scope.providerResults = results[$scope.selectedProviderID];
            };

            $scope.selectProviderMore = function(index) {
                var tmp = $scope.providers[count - 1];
                $scope.providers[count - 1] = $scope.providers[index];
                $scope.providers[index] = tmp;
                $scope.selectProvider(count - 1);
            };

            $scope.fireCallback = function(providerID, resultID) {

                if(providerID !== -1) {
                    if($scope.results[providerID].callbackFn) {
                        $scope.results[providerID].callbackFn($scope.results[providerID].results[resultID]);
                    }
                } else {
                    if($scope.results[$scope.selectedProviderID].callbackFn) {
                        $scope.results[$scope.selectedProviderID].callbackFn($scope.results[$scope.selectedProviderID].results[resultID]);
                    }
                }

            };

            $scope.showMore = function() {
                $('#moreProvider').slideToggle(300);
            };

            $scope.selectAll = function() {
                $scope.all = true;
                $scope.selectedProviderID = -1;
                $scope.providerResults = results[$scope.selectedProviderID];
            };

        }
    };
}]);
