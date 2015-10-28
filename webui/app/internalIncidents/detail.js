angular.module('app.internalIncidents').controller('app.internalIncidents.detailController',
    ['$scope', '$http', '$window', 'app.internalIncidents.bcpTicketData', 'app.internalIncidents.mitosisTicketData','$routeParams', 'app.internalIncidents.configservice', "bridge.converter", "bridgeDataService", "employeeService", "bridge.ticketAppUtils.detailUtils",
    function Controller($scope, $http, $window, bcpTicketDataService, mitosisTicketDataService, $routeParams, configService, converter, bridgeDataService, employeeService, detailUtils) {
        var config = configService.getConfigForAppId($routeParams.appId);
        var ticketData;
        $scope.filterText = '';
        $scope.messages = [];
        $scope.detailForNotifications = false;

        if (config.isInitialized === false) {
            config.initialize(bridgeDataService.getAppConfigById($routeParams.appId));
        }

        if(config.data.advancedMode === true) {
            ticketData = mitosisTicketDataService.getInstanceForAppId($routeParams.appId);
        } else {
            ticketData = bcpTicketDataService.getInstanceForAppId($routeParams.appId);
        }

        $scope.filterTable = function(oTicket){
            return detailUtils.ticketMatches(oTicket, $scope.filterText, $scope.prios);
        };

        $scope.userClick = function(employeeDetails){
            employeeService.showEmployeeModal(employeeDetails);
        };

        function enhanceAllMessages(){
            if ($scope.detailForNotifications === true){
                $scope.messages = ticketData.ticketsFromNotifications;
            } else {
                $scope.messages = ticketData.getRelevantTickets(config.data.selection.sel_components, config.data.selection.colleagues, config.data.selection.assigned_me, config.data.selection.created_me, config.data.ignoreAuthorAction);
            }
        }

        $scope.$watch('config', function(newVal, oldVal) {
            if($scope.config !== undefined && newVal !== oldVal){
                enhanceAllMessages();
            }
        },true);

        $scope.getFormattedDate = function(sAbapDate){
            if(!sAbapDate) {
                return "";
            }
            var date = converter.getDateFromAbapTimeString(sAbapDate);
            return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        };

        function setPrioSelections(active){
            angular.forEach($scope.prios, function(prio){
                prio.active = active;
            });
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
                    $scope.prios = ticketData.prios;
                });
            } else {
                enhanceAllMessages();
                $scope.prios = ticketData.prios;
            }
        }

        $scope.$watch('prios', function() {
            if(!$scope.prios) {
                return;
            }
            setPrioSelections(false);
            _.find($scope.prios, {"key": $routeParams.prio}).active = true;
        });

}]);
