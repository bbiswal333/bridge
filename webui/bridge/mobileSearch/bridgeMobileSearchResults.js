angular.module("bridge.mobileSearchResults", []);
angular.module("bridge.mobileSearchResults").directive('bridge.mobileSearchResults', ['bridge.mobileSearch', function(bridgeMobileSearch) {
    return {
        restrict : 'E',
        templateUrl : 'bridge/mobileSearch/BridgeMobileSearchResults.html',
        controller : function($scope) {
            var results = [];
            var providerResultsCount = [];
            var queryObj;
            var selectedProviderID = -1;
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
                $scope.providers= results;
                $scope.providerResults = results[selectedProviderID];
                $('#provider_' + selectedProviderID).addClass('selectedProvider');
            }, true);

            $scope.selectProvider = function(index) {

                $scope.all = false;

                $('.bridge-mobileSearchOutputProvider').removeClass('selectedProvider');
                $('#provider_' + index).addClass('selectedProvider');
                selectedProviderID = index;
                $scope.providerResults = results[selectedProviderID];
            };

            $scope.fireCallback = function(selectedAll, providerID, resultID) {
                if(selectedAll) {
                    resultID = 0;
                    if($scope.results[providerID].callbackFn) {
                        $scope.results[providerID].callbackFn($scope.results[providerID].results[resultID]);
                    }
                } else {
                    if($scope.results[selectedProviderID].callbackFn) {
                        $scope.results[selectedProviderID].callbackFn($scope.results[selectedProviderID].results[resultID]);
                    }
                }
            };

             $('#search').click(function() {
                $('#bridge-mobileSearchOutput').fadeIn(300);
            });

            $scope.selectAll = function() {
                $scope.all = true;
                selectedProviderID = -1;
                $scope.providerResults = results[selectedProviderID];
                $('.bridge-mobileSearchOutputProvider').removeClass('selectedProvider');
                $('#allSelectProvider').addClass('selectedProvider');
            };

        }
    };
}]);