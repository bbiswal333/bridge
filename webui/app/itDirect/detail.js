angular.module('app.itdirect')
    .controller('app.itdirect.detailController', ["$scope", "$routeParams", "bridgeDataService", "app.itdirect.ticketData", "app.itdirect.config", function($scope, $routeParams, bridgeDataService, ticketData, config){

    var that = this;
    $scope.prios = ticketData.prios;
    $scope.config = config;
    $scope.tickets = [];

    $scope.filterTable = function(oTicket){
        var bTicketPriorityMatches = false;
        angular.forEach($scope.prios, function(prio){
           if (prio.active === true && oTicket.PRIORITY.toString() === prio.key){
               bTicketPriorityMatches = true;
           }
        });

        var bCategoryMatches = false;
        if (config.bPartieOfRequestSelected === true && oTicket.bridgeCategory === "assigned_me" ||
            config.bSavedSearchSelected === true && oTicket.bridgeCategory === "savedSearch"){
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

    this.containsTicket = function(sGuid){
        var foundTicket = _.find($scope.tickets, { "GUID": sGuid });
        if (foundTicket === undefined){
            return false;
        } else {
            return true;
        }
    };

    function enhanceAllTickets(){
        var sTicketCategory = "";
        function addAndEnhanceTicket(ticket) {
            ticket.url = 'https://itdirect.wdf.sap.corp/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-client=001&sap-sessioncmd=open&CRM-OBJECT-ACTION=B&CRM-OBJECT-TYPE=AIC_OB_INCIDENT&SAPROLE=ZITSERVREQU&thtmlbSliderState=HIDDEN&CRM-OBJECT-VALUE=' + ticket.GUID.toString();
            ticket.bridgeCategory = sTicketCategory;

            if (!that.containsTicket(ticket.GUID.toString())){
                $scope.tickets.push(ticket);
            }
        }

        sTicketCategory = "assigned_me";
        angular.forEach(ticketData.tickets.assigned_me, addAndEnhanceTicket);
        sTicketCategory = "savedSearch";
        angular.forEach(ticketData.tickets.savedSearch, addAndEnhanceTicket);

    }

    if (ticketData.isInitialized.value === false) {
        var promise = ticketData.initialize();

        promise.then(function success() {
            enhanceAllTickets();
        });
    } else {
        enhanceAllTickets();
    }

    if (config.isInitialized === false) {
        config.initialize(bridgeDataService.getAppConfigById($routeParams.appId));
    }

    ticketData.activatePrio($routeParams.prio);
}]);
