angular.module("app.premiumEngagement").controller("app.premiumEngagement.detailController",
    ["$scope", "$routeParams", "app.premiumEngagement.configService", "app.premiumEngagement.ticketData", "bridge.ticketAppUtils.detailUtils", "employeeService", "bridgeDataService",
    function($scope, $routeParams, configService, ticketDataService, detailUtils, employeeService, bridgeDataService){

        var config = configService.getInstanceForAppId($routeParams.appId),
            ticketData = ticketDataService.getInstanceForAppId($routeParams.appId);

        $scope.filterText = "";
        $scope.prios = ticketData.prios;

        $scope.filterTable = function(oTicket){
            return detailUtils.ticketMatches(oTicket, $scope.filterText, $scope.prios);
        };

        function enhanceMessage(message){
            if(message.PROCESSOR_ID !== "") {
                employeeService.getData(message.PROCESSOR_ID).then(function(empData) {
                    message.processor_enh = empData;
                });
            }
        }

        function enhanceAllMessages(){
            if ($scope.detailForNotifications === true){
                $scope.messages = ticketData.ticketsFromNotifications;
            } else {
                $scope.messages = ticketData.getTicketsForCustomerSelection();
            }
            $scope.messages.forEach(enhanceMessage);
        }

        function setPrioSelections(active){
            angular.forEach($scope.prios, function(prio){
                prio.active = active;
            });
        }

        if (config.isInitialized === false) {
            config.initialize(bridgeDataService.getAppConfigById($routeParams.appId));
        }
        $scope.config = config;

        if ($routeParams.calledFromNotifications === "true"){
            $scope.detailForNotifications = true;
            setPrioSelections(true);
            enhanceAllMessages();
        } else {
            if (ticketData.isInitialized.value === false) {
                var promise = ticketData.initialize();

                promise.then(function success() {
                    enhanceAllMessages();
                });
            } else {
                enhanceAllMessages();
            }

            setPrioSelections(false);
            _.find($scope.prios, {"key": $routeParams.prio}).active = true;
        }
}]);
