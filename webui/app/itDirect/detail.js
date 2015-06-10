angular.module('app.itdirect').controller('app.itdirect.detailController', ["$scope", "$routeParams", "bridgeDataService", "app.itdirect.ticketData", "app.itdirect.config", "bridge.converter", "employeeService",
    function($scope, $routeParams, bridgeDataService, ticketDataService, configService, converter, employeeService){

        var that = this;
        var config = configService.getConfigForAppId($routeParams.appId);
        var ticketData = ticketDataService.getInstanceForAppId($routeParams.appId);

        $scope.prios = ticketData.prios;
        $scope.config = config;
        $scope.tickets = [];
        $scope.detailForNotifications = ($routeParams.calledFromNotifications === 'true');

        $scope.filterTable = function(oTicket){
            var bTicketPriorityMatches = false;
            angular.forEach($scope.prios, function(prio){
               if (prio.active === true && oTicket.URGENCY.toString() === prio.key){
                   bTicketPriorityMatches = true;
               }
            });

            // leave out check for category if we come from notifications
            var bCategoryMatches = false;
            if ($scope.detailForNotifications === false) {
                if (config.bPartieOfRequestSelected === true && oTicket.bridgeCategory === "assigned_me" ||
                    config.bSavedSearchSelected === true && oTicket.bridgeCategory === "savedSearch") {
                    bCategoryMatches = true;
                }
            } else {
                bCategoryMatches = true;
            }

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

            return bTicketPriorityMatches && bCategoryMatches && bTicketContainsFilterString;
        };

        $scope.getFormattedDate = function(sAbapDate){
            return converter.getDateFromAbapTimeString(sAbapDate).toLocaleString();
        };

        this.containsTicket = function(sGuid){
            var foundTicket = _.find($scope.tickets, { "GUID": sGuid });
            if (foundTicket === undefined){
                return false;
            } else {
                return true;
            }
        };

        $scope.userClick = function(employeeDetails){
            employeeService.showEmployeeModal(employeeDetails);
        };

        function enhanceAllTickets(aTickets){
            var sTicketCategory = "";
            function addAndEnhanceTicket(ticket) {
                ticket.url = 'https://itdirect.wdf.sap.corp/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-client=001&sap-sessioncmd=open&CRM-OBJECT-ACTION=B&CRM-OBJECT-TYPE=AIC_OB_INCIDENT&thtmlbSliderState=HIDDEN&CRM-OBJECT-VALUE=' + ticket.GUID.toString();
                ticket.bridgeCategory = sTicketCategory;

                if (ticket.CREATED_BY !== "") {
                    employeeService.getData(ticket.CREATED_BY).then(function success(employeeData){
                        ticket.creator = employeeData;
                    });
                }

                if (!that.containsTicket(ticket.GUID.toString())){
                    $scope.tickets.push(ticket);
                }
            }

            sTicketCategory = "assigned_me";
            angular.forEach(aTickets.assigned_me, addAndEnhanceTicket);
            sTicketCategory = "savedSearch";
            angular.forEach(aTickets.savedSearch, addAndEnhanceTicket);
        }

        if (config.isInitialized === false) {
            config.initialize(bridgeDataService.getAppConfigById($routeParams.appId));
        }

        if ($scope.detailForNotifications === false) {
            ticketData.activatePrio($routeParams.prio);
        }
        else {
            ticketData.activateAllPrios();
        }

        if (ticketData.isInitialized.value === false && $scope.detailForNotifications === false) {
            var promise = ticketData.initialize();

            promise.then(function success() {
                enhanceAllTickets(ticketData.tickets);
            });
        } else if ($scope.detailForNotifications === true){
            enhanceAllTickets(ticketData.ticketsFromNotifications);
        } else {
            enhanceAllTickets(ticketData.tickets);
        }

}]);
