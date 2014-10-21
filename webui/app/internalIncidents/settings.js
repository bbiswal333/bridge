angular.module('app.internalIncidents')
    .controller('app.internalIncidents.settingsController', ["$scope", "$http", "app.internalIncidents.ticketData", function($scope, $http, ticketData){

        $scope.sourceSystems = ticketData.ticketSourceSystems;
        $scope.selectedSourceSystem = ticketData.selectedSourceSystem;

        $scope.switchSourceSystem = function(newSourceSystem){
            $scope.selectedSourceSystem = newSourceSystem;
            ticketData.selectedSourceSystem = newSourceSystem;
            ticketData.loadTicketData();
        };

        $scope.save_click = function () {
            $scope.$emit('closeSettingsScreen', {app: 'itdirect'});
        };
}]);
