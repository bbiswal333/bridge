angular.module('app.internalIncidents')
    .controller('app.internalIncidents.settingsController', ["$scope", "$http", "app.internalIncidents.configservice", function($scope, $http, configService){

        $scope.config = configService.getConfigForAppId($scope.boxScope.metadata.guid);

        $scope.save_click = function () {
            $scope.$emit('closeSettingsScreen', {app: 'itdirect'});
        };
}]);
