angular.module('app.internalIncidents').controller('app.internalIncidents.detailController',
    ['$scope', '$http', '$window', 'app.internalIncidents.ticketData','$routeParams', 'app.internalIncidents.configservice', "bridge.converter", "bridgeDataService", "employeeService",
    function Controller($scope, $http, $window, ticketDataService, $routeParams, configService, converter, bridgeDataService, employeeService) {
        var config = configService.getConfigForAppId($routeParams.appId);
        var ticketData = ticketDataService.getInstanceForAppId($routeParams.appId);
        $scope.filterText = '';
        $scope.messages = [];
        $scope.prios = ticketData.prios;
        $scope.detailForNotifications = false;

        $scope.filterTable = function(oTicket){
            var bTicketPriorityMatches = false;
            angular.forEach($scope.prios, function(prio){
                if (prio.active === true && oTicket.PRIORITY_KEY === prio.key){
                    bTicketPriorityMatches = true;
                }
            });

            var bTicketContainsFilterString = false;
            if ($scope.filterText === "" || $scope.filterText === undefined){
                bTicketContainsFilterString = true;
            } else {
                var property;
                for (property in oTicket){
                    if (oTicket[property].toString().toUpperCase().indexOf($scope.filterText.toUpperCase()) !== -1){
                        bTicketContainsFilterString = true;
                    }
                }
            }

            return bTicketPriorityMatches && bTicketContainsFilterString;
        };

        $scope.userClick = function(employeeDetails){
            employeeService.showEmployeeModal(employeeDetails);
        };

        function enhanceMessage(message){
            if(message.REPORTER_ID !== "") {
                employeeService.getData(message.REPORTER_ID).then(function(empData) {
                    message.reporterData = empData;
                });
            }
        }

        function enhanceAllMessages(){
            if ($scope.detailForNotifications === true){
                $scope.messages = ticketData.ticketsFromNotifications;
            } else {
                $scope.messages = ticketData.getRelevantTickets(config.data.selection.sel_components, config.data.selection.colleagues, config.data.selection.assigned_me, config.data.selection.created_me, config.data.ignoreAuthorAction);
            }
            $scope.messages.forEach(enhanceMessage);
        }

        $scope.$watch('config', function(newVal, oldVal) {
            if($scope.config !== undefined && newVal !== oldVal){
                enhanceAllMessages();
            }
        },true);

        $scope.getFormattedDate = function(sAbapDate){
            var date = converter.getDateFromAbapTimeString(sAbapDate);
            return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        };

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
