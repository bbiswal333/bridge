angular.module('app.internalIncidentsTest')
    .controller('app.internalIncidentsTest.settingsController', ["$scope", "$http", "app.internalIncidentsTest.configservice", function($scope, $http, config){

        $scope.config = config;

        $scope.save_click = function () {
            $scope.$emit('closeSettingsScreen', {app: 'itdirect'});
        };
}]);
