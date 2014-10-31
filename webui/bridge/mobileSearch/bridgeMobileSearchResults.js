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
            $scope.noResultString = "No Results &#40;&#3237;&#65103;&#3237;&#41;";
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

            $scope.selectProvider = function(obj, child, childchild) {

                if(child) {
                    var $obj = $(obj.target).parent();
                } else if(childchild) {
                    $obj = $(obj.target).parent().parent();
                } else {
                    $obj = $(obj.target);
                }

                $scope.all = false;

                var providerID = $obj.attr('id');
                var id = providerID.replace('provider_', '');
                $('.bridge-mobileSearchOutputProvider').removeClass('selectedProvider');
                $('#' + providerID).addClass('selectedProvider');
                selectedProviderID = id;
                $scope.providerResults = results[selectedProviderID];
            };

            $scope.fireCallback = function(obj, selectedAll, providerID) {
                var resultID;
                if(selectedAll) {
                    resultID = 0;
                    if($scope.results[providerID].callbackFn) {
                        $scope.results[providerID].callbackFn($scope.results[providerID].results[resultID]);
                    }
                } else {
                    var $obj = $(obj.target);
                    resultID = $obj.attr('id');
                    resultID = resultID.replace('result_', '');
                    if($scope.results[selectedProviderID].callbackFn) {
                        $scope.results[selectedProviderID].callbackFn($scope.results[selectedProviderID].results[resultID]);
                    }
                }
            };

            $('#cancel').click(function() {
                $('#bridge-mobileSearchOutput').fadeOut(300);
            });

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