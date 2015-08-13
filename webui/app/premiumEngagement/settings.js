angular.module("app.premiumEngagement").controller("app.premiumEngagement.settingsController",
    ["$scope", "app.premiumEngagement.configService", "app.premiumEngagement.ticketData", "bridgeInBrowserNotification",
        function($scope, configService, ticketDataService, bridgeInBrowserNotification){

        var ticketData = ticketDataService.getInstanceForAppId($scope.boxScope.metadata.guid);
        $scope.config = configService.getInstanceForAppId($scope.boxScope.metadata.guid);

        $scope.addCustomer = function(sCustomerId){
            if (_.find($scope.config.data.aConfiguredCustomers, { sId: sCustomerId }) === undefined && /^[0-9]+$/.test(sCustomerId)){
                $scope.config.data.aConfiguredCustomers.push({ sId: sCustomerId, sName: ""});
                ticketData.loadTicketData(true);
            } else {
                bridgeInBrowserNotification.addAlert('', 'Invalid Input: Check if the input is a number and you have not added it yet.');
            }
        };
        $scope.removeCustomer = function(sCustomerId){
            _.remove($scope.config.data.aConfiguredCustomers, function(oCustomer){
                return oCustomer.sId === sCustomerId;
            });

            ticketData.loadTicketData(true);
        };

        $scope.ignoreCustomerAction_click = function(){
            $scope.config.data.bIgnoreCustomerAction = !$scope.config.data.bIgnoreCustomerAction;
            ticketData.calculateTotals();
        };

        $scope.save_click = function () {
            $scope.$emit('closeSettingsScreen');
        };
}]);
