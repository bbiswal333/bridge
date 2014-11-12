angular.module('app.internalIncidents')
    .controller('app.internalIncidents.settingsController', ["$scope", "$http", "app.internalIncidents.configservice", function($scope, $http, config){

        $scope.config = config;

        $scope.save_click = function () {
            $scope.$emit('closeSettingsScreen', {app: 'itdirect'});
        };
}]);
