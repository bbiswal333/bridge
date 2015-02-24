angular.module("app.premiumEngagement").controller("app.premiumEngagement.settingsController",
    ["$scope", "app.premiumEngagement.configService", "app.premiumEngagement.ticketData", function($scope, configService, ticketDataService){

        var ticketData = ticketDataService.getInstanceForAppId($scope.boxScope.metadata.guid);
        $scope.config = configService.getInstanceForAppId($scope.boxScope.metadata.guid);

        $scope.addCustomer = function(sCustomerId){
            if (_.find($scope.config.data.aConfiguredCustomers, { sId: sCustomerId }) === undefined){
                $scope.config.data.aConfiguredCustomers.push({ sId: sCustomerId, sName: ""});
                ticketData.loadTicketData();
            }
        };
        $scope.removeCustomer = function(sCustomerId){
            _.remove($scope.config.data.aConfiguredCustomers, function(oCustomer){
                return oCustomer.sId === sCustomerId;
            });

            ticketData.loadTicketData();
        };

        $scope.save_click = function () {
            $scope.$emit('closeSettingsScreen');
        };
}]);
