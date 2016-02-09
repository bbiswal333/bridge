angular.module('app.unifiedticketing')
    .controller('app.unifiedticketing.settingsController', ["$scope", "$http", "app.unifiedticketing.config", function($scope, $http, configService){
        $scope.config = configService.getConfigForAppId($scope.boxScope.metadata.guid);
        $scope.savedSearches = [];
        $scope.getSyncHistory = function(syncDays) {
            $scope.config.setSyncHistory(syncDays);
        };

        $scope.getStatus = function(Status) {
            $scope.config.data.Status = Status;
        };

        $scope.save_click = function () {
            $scope.$emit('closeSettingsScreen', {app: 'unifiedticketing', instance: $scope.boxScope.metadata.guid});
        };
    }]
);
