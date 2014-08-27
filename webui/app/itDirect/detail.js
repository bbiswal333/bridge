angular.module('app.itdirect').controller('app.itdirect.detailController', ["$scope", "$routeParams", "bridgeDataService", "app.itdirect.ticketData", "app.itdirect.config", "app.itdirect.formatter",
    function($scope, $routeParams, bridgeDataService, ticketData, config, formatter){

        var that = this;
        $scope.prios = ticketData.prios;
        $scope.config = config;
        $scope.tickets = [];
        $scope.detailForNotifications = ($routeParams.calledFromNotifications === 'true');

        $scope.filterTable = function(oTicket){
            var bTicketPriorityMatches = false;
            angular.forEach($scope.prios, function(prio){
               if (prio.active === true && oTicket.PRIORITY.toString() === prio.key){
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
            return formatter.getDateFromAbapTimeString(sAbapDate).toLocaleString();
        };

        this.containsTicket = function(sGuid){
            var foundTicket = _.find($scope.tickets, { "GUID": sGuid });
            if (foundTicket === undefined){
                return false;
            } else {
                return true;
            }
        };

        function enhanceAllTickets(aTickets){
            var sTicketCategory = "";
            function addAndEnhanceTicket(ticket) {
                ticket.url = 'https://itdirect.wdf.sap.corp/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-client=001&sap-sessioncmd=open&CRM-OBJECT-ACTION=B&CRM-OBJECT-TYPE=AIC_OB_INCIDENT&SAPROLE=ZITSERVREQU&thtmlbSliderState=HIDDEN&CRM-OBJECT-VALUE=' + ticket.GUID.toString();
                ticket.bridgeCategory = sTicketCategory;

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
