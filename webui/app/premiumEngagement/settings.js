angular.module("app.premiumEngagement").controller("app.premiumEngagement.settingsController",
    ["$scope", "app.premiumEngagement.configService", "app.premiumEngagement.ticketData", function($scope, configService, ticketDataService){

        var ticketData = ticketDataService.getInstanceForAppId($scope.boxScope.metadata.guid);
        $scope.config = configService.getInstanceForAppId($scope.boxScope.metadata.guid);

        $scope.addCustomer = function(sCustomerId){
            if (!_.contains($scope.config.data.aConfiguredCustomers, sCustomerId)){
                $scope.config.data.aConfiguredCustomers.push(sCustomerId);
                ticketData.loadTicketData();
            }
        };
        $scope.removeCustomer = function(sCustomerId){
            _.remove($scope.config.data.aConfiguredCustomers, function(sId){
                return sId === sCustomerId;
            });

            ticketData.loadTicketData();
        };

        $scope.save_click = function () {
            $scope.$emit('closeSettingsScreen');
        };
}]);
