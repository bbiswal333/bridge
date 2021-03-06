angular.module('app.itdirect')
    .controller('app.itdirect.settingsController', ["$scope", "$http", "app.itdirect.config", function($scope, $http, configService){

        $scope.config = configService.getConfigForAppId($scope.boxScope.metadata.guid);
        $scope.savedSearches = [];

        $http.get("https://pgpmain.wdf.sap.corp/sap/opu/odata/sap/ZMOB_INCIDENT;v=2/SavedSearchCollection?$format=json")
            .success(function(data){
                $scope.savedSearches.length = 0;

                angular.forEach(data.d.results, function(savedSearch){
                    $scope.savedSearches.push({
                        description: savedSearch.DESCRIPTION,
                        key: savedSearch.PARAMETER_KEY
                    });
                 });
            });

        $scope.save_click = function () {
            $scope.$emit('closeSettingsScreen', {app: 'itdirect'});
        };
}]);
